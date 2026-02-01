USE ClinicaDB;
GO

-- =====================================================
-- Agenda dinámica: plantillas (HorarioMedico), slots (Horario) y excepciones
-- No se requiere id_clinica en este diseño (tal como solicitaste)
-- =====================================================

-- 0) Eliminar FK de Cita hacia Horario si existe (para poder recrearla)
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Cita_Horario')
    ALTER TABLE Cita DROP CONSTRAINT FK_Cita_Horario;
GO

-- 1) Eliminar tablas previas si existen
IF OBJECT_ID('dbo.Horario', 'U') IS NOT NULL
    DROP TABLE dbo.Horario;
IF OBJECT_ID('dbo.HorarioMedico', 'U') IS NOT NULL
    DROP TABLE dbo.HorarioMedico;
IF OBJECT_ID('dbo.ExcepcionHorario', 'U') IS NOT NULL
    DROP TABLE dbo.ExcepcionHorario;
GO

-- 2) Crear HorarioMedico (plantilla semanal por médico)
CREATE TABLE HorarioMedico (
    id_horario_medico INT IDENTITY(1,1) PRIMARY KEY,
    id_medico INT NOT NULL, -- FK a Usuario.id_usuario
    id_servicio INT NOT NULL,
    dia_semana TINYINT NOT NULL CHECK (dia_semana BETWEEN 1 AND 7), -- 1=Lunes, 7=Domingo
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    duracion_consulta INT NOT NULL DEFAULT 30, -- minutos por consulta
    activo BIT DEFAULT 1,
    fecha_vigencia_inicio DATE NULL,
    fecha_vigencia_fin DATE NULL,
    CONSTRAINT FK_HorarioMedico_Usuario FOREIGN KEY (id_medico) REFERENCES Usuario(id_usuario),
    CONSTRAINT FK_HorarioMedico_Servicio FOREIGN KEY (id_servicio) REFERENCES Servicio(id_servicio),
    CONSTRAINT CHK_HorarioMedico_Horas CHECK (hora_fin > hora_inicio)
);
GO

-- 3) Crear Horario (slots específicos generados o creados manualmente)
CREATE TABLE Horario (
    id_horario INT IDENTITY(1,1) PRIMARY KEY,
    id_horario_medico INT NOT NULL,
    id_medico INT NOT NULL,
    id_servicio INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    status TINYINT DEFAULT 1, -- 1: disponible, 2: reservado, 3: bloqueado, 4: cancelado
    id_cita INT NULL,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Horario_HorarioMedico FOREIGN KEY (id_horario_medico) REFERENCES HorarioMedico(id_horario_medico),
    CONSTRAINT FK_Horario_Medico FOREIGN KEY (id_medico) REFERENCES Usuario(id_usuario),
    CONSTRAINT FK_Horario_Servicio FOREIGN KEY (id_servicio) REFERENCES Servicio(id_servicio),
    CONSTRAINT UQ_Horario_Unico UNIQUE (id_medico, fecha, hora_inicio)
);
GO

-- 4) Crear ExcepcionHorario (vacaciones, feriados, etc.)
CREATE TABLE ExcepcionHorario (
    id_excepcion INT IDENTITY(1,1) PRIMARY KEY,
    id_medico INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    motivo NVARCHAR(200) NULL,
    tipo NVARCHAR(20) CHECK (tipo IN ('vacaciones', 'feriado', 'capacitacion', 'personal', 'enfermedad')),
    creado_por INT NULL,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Excepcion_Medico FOREIGN KEY (id_medico) REFERENCES Usuario(id_usuario),
    CONSTRAINT FK_Excepcion_CreadoPor FOREIGN KEY (creado_por) REFERENCES Usuario(id_usuario)
);
GO

-- 5) Restaurar FK de Cita hacia Horario (si la tabla Cita existe)
IF OBJECT_ID('dbo.Cita', 'U') IS NOT NULL
BEGIN
    ALTER TABLE Cita
    ADD CONSTRAINT FK_Cita_Horario FOREIGN KEY (id_horario) REFERENCES Horario(id_horario);
END
GO

-- 6) Stored procedure: Generar y reservar un slot dinámico (si hace falta)
--    Parámetros:
--      @id_medico INT, @id_paciente INT, @id_servicio INT, @fecha DATE, @hora TIME, @duracion INT (minutos), @id_profesional INT NULL
--    Resultado: en éxito devuelve SELECT { id_cita = <int>, id_horario = <int> }
--    Errores: RAISERROR con mensaje claro (use try/catch desde el cliente)

IF OBJECT_ID('dbo.sp_GenerarReservarHorario', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_GenerarReservarHorario;
GO

CREATE PROCEDURE dbo.sp_GenerarReservarHorario
    @id_medico INT,
    @id_paciente INT,
    @id_servicio INT,
    @fecha DATE,
    @hora TIME,
    @duracion INT = 30,
    @id_profesional INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @hora_fin TIME = CONVERT(TIME, DATEADD(MINUTE, @duracion, CAST(@hora AS DATETIME)));
    DECLARE @id_horario INT;
    DECLARE @id_cita INT;
    DECLARE @oldDateFirst INT = @@DATEFIRST;

    -- Forzar DATEFIRST = 1 para que DATEPART(dw,...) devuelva 1 = Lunes
    SET DATEFIRST 1;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1) Verificar excepciones (vacaciones/feriados)
        IF EXISTS (
            SELECT 1 FROM ExcepcionHorario e
            WHERE e.id_medico = @id_medico
              AND @fecha BETWEEN e.fecha_inicio AND e.fecha_fin
        )
        BEGIN
            RAISERROR('El médico tiene una excepción en la fecha solicitada', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- 2) Intentar obtener un Horario disponible exacto (lock para concurrencia)
        SELECT TOP 1 @id_horario = id_horario
        FROM Horario WITH (UPDLOCK, HOLDLOCK)
        WHERE id_medico = @id_medico
          AND id_servicio = @id_servicio
          AND fecha = @fecha
          AND hora_inicio = @hora
          AND status = 1;

        IF @id_horario IS NOT NULL
        BEGIN
            -- Reservar el horario: crear Cita y actualizar Horario
            INSERT INTO Cita (id_paciente, id_horario, id_servicio, id_profesional, fecha_cita, hora_cita, id_estado_cita)
            VALUES (@id_paciente, @id_horario, @id_servicio, ISNULL(@id_profesional, @id_medico), @fecha, @hora, 1);
            SET @id_cita = SCOPE_IDENTITY();

            UPDATE Horario
            SET status = 2, id_cita = @id_cita
            WHERE id_horario = @id_horario;

            COMMIT TRANSACTION;
            SET DATEFIRST @oldDateFirst;
            SELECT @id_cita AS id_cita, @id_horario AS id_horario;
            RETURN;
        END

        -- 3) Si no existe slot exacto, buscar plantilla HorarioMedico que cubra el horario solicitado
        DECLARE @dia_semana TINYINT = DATEPART(dw, @fecha); -- con DATEFIRST=1, 1=Lunes

        DECLARE @id_horario_medico INT;
        SELECT TOP 1 @id_horario_medico = id_horario_medico
        FROM HorarioMedico
        WHERE id_medico = @id_medico
          AND id_servicio = @id_servicio
          AND activo = 1
          AND dia_semana = @dia_semana
          AND @hora >= hora_inicio
          AND DATEADD(MINUTE, duracion_consulta, @hora) <= hora_fin
          AND (fecha_vigencia_inicio IS NULL OR @fecha >= fecha_vigencia_inicio)
          AND (fecha_vigencia_fin IS NULL OR @fecha <= fecha_vigencia_fin);

        IF @id_horario_medico IS NULL
        BEGIN
            RAISERROR('No existe plantilla de horario para el médico en ese día/hora', 16, 1);
            ROLLBACK TRANSACTION;
            SET DATEFIRST @oldDateFirst;
            RETURN;
        END

        -- 4) Comprobar solapamientos con otros horarios existentes
        IF EXISTS (
            SELECT 1 FROM Horario WITH (UPDLOCK, HOLDLOCK)
            WHERE id_medico = @id_medico
              AND fecha = @fecha
              AND NOT (hora_fin <= @hora OR hora_inicio >= @hora_fin)
              AND status IN (1,2)
        )
        BEGIN
            RAISERROR('Conflicto: existe un horario que solapa la hora solicitada', 16, 1);
            ROLLBACK TRANSACTION;
            SET DATEFIRST @oldDateFirst;
            RETURN;
        END

        -- 5) Crear nuevo Horario (slot) y reservarlo creando la Cita
        INSERT INTO Horario (id_horario_medico, id_medico, id_servicio, fecha, hora_inicio, hora_fin, status)
        VALUES (@id_horario_medico, @id_medico, @id_servicio, @fecha, @hora, @hora_fin, 2); -- crear ya reservado
        SET @id_horario = SCOPE_IDENTITY();

        INSERT INTO Cita (id_paciente, id_horario, id_servicio, id_profesional, fecha_cita, hora_cita, id_estado_cita)
        VALUES (@id_paciente, @id_horario, @id_servicio, ISNULL(@id_profesional, @id_medico), @fecha, @hora, 1);
        SET @id_cita = SCOPE_IDENTITY();

        -- Asociar id_cita al Horario
        UPDATE Horario SET id_cita = @id_cita WHERE id_horario = @id_horario;

        COMMIT TRANSACTION;
        SET DATEFIRST @oldDateFirst;
        SELECT @id_cita AS id_cita, @id_horario AS id_horario;
        RETURN;

    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0
            ROLLBACK TRANSACTION;
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        SET DATEFIRST @oldDateFirst;
        RAISERROR('sp_GenerarReservarHorario error: %s', 16, 1, @ErrMsg);
        RETURN;
    END CATCH
END
GO

-- Índices útiles para rendimiento
CREATE INDEX IX_Horario_Medico_Fecha_Hora ON Horario (id_medico, fecha, hora_inicio);
CREATE INDEX IX_HorarioMedico_Medico_Dia ON HorarioMedico (id_medico, dia_semana);
GO
