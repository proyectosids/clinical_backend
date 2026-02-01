USE ClinicaDB;
GO

-- Migración: eliminar tabla Ocupacion y consolidar datos en Especialidad
-- Estrategia:
-- 1) Para cada fila de Ocupacion:
--    - Si id_especialidad IS NOT NULL -> mapear a esa Especialidad y completar campos faltantes
--    - Si id_especialidad IS NULL -> crear una nueva fila en Especialidad con los datos de Ocupacion
-- 2) Añadir columna id_especialidad a Usuario y copiar el mapeo desde id_ocupacion
-- 3) Eliminar FK y columna id_ocupacion en Usuario, y finalmente eliminar la tabla Ocupacion
-- IMPORTANTE: Ejecutar en entorno de desarrollo primero y hacer BACKUP antes de aplicar en producción.

SET NOCOUNT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    -- Verificar que la tabla Ocupacion existe
    IF OBJECT_ID('dbo.Ocupacion','U') IS NULL
    BEGIN
        RAISERROR('La tabla Ocupacion no existe. Nada que migrar.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- Verificar si hay otras FKs que dependan de Ocupacion aparte de Usuario
    DECLARE @fkCount INT;
    SELECT @fkCount = COUNT(*) FROM sys.foreign_keys fk WHERE fk.referenced_object_id = OBJECT_ID('dbo.Ocupacion');
    -- Permitimos la FK desde Usuario (si existe). Si hay más de 1, abortamos y mostramos las dependencias.
    IF @fkCount > 1
    BEGIN
        RAISERROR('Hay %d constraints FK que referencian a Ocupacion. Revise dependencias antes de migrar.', 16, 1, @fkCount);
        SELECT fk.name AS fk_name, OBJECT_NAME(fk.parent_object_id) AS parent_table
        FROM sys.foreign_keys fk
        WHERE fk.referenced_object_id = OBJECT_ID('dbo.Ocupacion');
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- Tabla temporal para mapear id_ocupacion -> id_especialidad nueva/ existente
    IF OBJECT_ID('tempdb..#map_ocup') IS NOT NULL DROP TABLE #map_ocup;
    CREATE TABLE #map_ocup (
        id_ocupacion INT PRIMARY KEY,
        id_especialidad INT NOT NULL
    );

    -- 1) Para filas de Ocupacion que ya referencian una Especialidad -> usar esa especialidad
    INSERT INTO #map_ocup (id_ocupacion, id_especialidad)
    SELECT o.id_ocupacion, o.id_especialidad
    FROM Ocupacion o
    WHERE o.id_especialidad IS NOT NULL;

    -- 1a) Completar datos en Especialidad si falta cedula_profesional o descripcion
    UPDATE e
    SET e.cedula_profesional = COALESCE(e.cedula_profesional, o.cedula_profesional),
        e.descripcion = COALESCE(e.descripcion, o.descripcion)
    FROM Especialidad e
    JOIN Ocupacion o ON e.id_especialidad = o.id_especialidad
    WHERE (e.cedula_profesional IS NULL OR LTRIM(RTRIM(e.cedula_profesional)) = '')
       OR (e.descripcion IS NULL OR LTRIM(RTRIM(e.descripcion)) = '');

    -- 2) Para filas de Ocupacion que NO tienen id_especialidad -> crear nueva Especialidad y mapear
    DECLARE @id_oc INT, @nombre_oc NVARCHAR(100), @ced NVARCHAR(50), @desc NVARCHAR(200), @new_id_es INT;
    DECLARE cur CURSOR LOCAL FAST_FORWARD FOR
        SELECT id_ocupacion, nombre_ocupacion, cedula_profesional, descripcion
        FROM Ocupacion
        WHERE id_especialidad IS NULL;

    OPEN cur;
    FETCH NEXT FROM cur INTO @id_oc, @nombre_oc, @ced, @desc;
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Insertar nueva Especialidad si no existe ya una con el mismo nombre (prevención duplicados)
        SELECT @new_id_es = id_especialidad FROM Especialidad WHERE nombre_esp = @nombre_oc;
        IF @new_id_es IS NULL
        BEGIN
            INSERT INTO Especialidad (nombre_esp, cedula_profesional, descripcion)
            VALUES (@nombre_oc, @ced, @desc);
            SET @new_id_es = SCOPE_IDENTITY();
        END

        INSERT INTO #map_ocup (id_ocupacion, id_especialidad)
        VALUES (@id_oc, @new_id_es);

        FETCH NEXT FROM cur INTO @id_oc, @nombre_oc, @ced, @desc;
    END
    CLOSE cur;
    DEALLOCATE cur;

    -- 3) Añadir columna id_especialidad a Usuario si no existe
    IF COL_LENGTH('dbo.Usuario','id_especialidad') IS NULL
    BEGIN
        ALTER TABLE Usuario ADD id_especialidad INT NULL;
    END

    -- 4) Copiar datos desde Usuario.id_ocupacion -> Usuario.id_especialidad usando el mapeo
    UPDATE u
    SET id_especialidad = m.id_especialidad
    FROM Usuario u
    JOIN Ocupacion o ON u.id_ocupacion = o.id_ocupacion
    JOIN #map_ocup m ON o.id_ocupacion = m.id_ocupacion
    WHERE u.id_ocupacion IS NOT NULL;

    -- 5) Crear FK Usuario.id_especialidad -> Especialidad(id_especialidad) si no existe
    IF NOT EXISTS (
        SELECT 1 FROM sys.foreign_keys fk
        WHERE fk.parent_object_id = OBJECT_ID('dbo.Usuario') AND fk.referenced_object_id = OBJECT_ID('dbo.Especialidad')
    )
    BEGIN
        ALTER TABLE Usuario ADD CONSTRAINT FK_Usuario_Especialidad FOREIGN KEY (id_especialidad) REFERENCES Especialidad(id_especialidad);
    END

    -- 6) Eliminar FK desde Usuario hacia Ocupacion (si existe)
    DECLARE @fkname sysname;
    SELECT @fkname = fk.name
    FROM sys.foreign_keys fk
    WHERE fk.parent_object_id = OBJECT_ID('dbo.Usuario') AND fk.referenced_object_id = OBJECT_ID('dbo.Ocupacion');

    IF @fkname IS NOT NULL
    BEGIN
        EXEC('ALTER TABLE dbo.Usuario DROP CONSTRAINT [' + @fkname + ']');
    END

    -- 7) Eliminar columna id_ocupacion de Usuario si existe
    IF COL_LENGTH('dbo.Usuario','id_ocupacion') IS NOT NULL
    BEGIN
        ALTER TABLE Usuario DROP COLUMN id_ocupacion;
    END

    -- 8) (Opcional) Si no hay más referencias a Ocupacion, eliminar la tabla
    IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys fk WHERE fk.referenced_object_id = OBJECT_ID('dbo.Ocupacion'))
    BEGIN
        DROP TABLE Ocupacion;
    END
    ELSE
    BEGIN
        RAISERROR('No se eliminó Ocupacion: existen dependencias adicionales. Revise sys.foreign_keys.', 16, 1);
    END

    COMMIT TRANSACTION;
    PRINT 'Migración completada correctamente. Revise Usuario.id_especialidad y Especialidad para confirmar datos.';
END TRY
BEGIN CATCH
    DECLARE @err NVARCHAR(4000) = ERROR_MESSAGE();
    ROLLBACK TRANSACTION;
    RAISERROR('Error durante migración: %s', 16, 1, @err);
    RETURN;
END CATCH;
GO

-- Verificaciones rápidas
SELECT TOP 20 id_especialidad, nombre_esp, cedula_profesional FROM Especialidad ORDER BY id_especialidad DESC;
SELECT TOP 20 id_usuario, nombre, apellido, id_especialidad FROM Usuario WHERE id_especialidad IS NOT NULL;
GO
