use ClinicaDB;
GO
-- Indexar CURP del paciente para b�squedas r�pidas
CREATE INDEX IX_Paciente_CURP ON Paciente(curp_paciente);

-- Indexar email del usuario
CREATE INDEX IX_Usuario_Email ON Usuario(email);

-- Indexar citas por fecha para reportes o calendarios
CREATE INDEX IX_Cita_Fecha ON Cita(fecha_cita);

-- Llenar campos de la base de datos
--Roles de usuarios
INSERT INTO Rol
    (nombre_rol, descripcion)
VALUES
    ('Administrador', 'Gestiona el sistema completo'),
    ('Recepcionista', 'Gestiona citas, pacientes y agenda'),
    ('M�dico', 'Accede a expedientes, historia cl�nica y recetas'),
    ('Enfermera', 'Registra signos vitales y asistencias'),
    ('Farmac�utico', 'Valida recetas y controla medicamentos'),
    ('Laboratorista', 'Registra estudios cl�nicos');

--Especialidad solo aplica para doctores o personal con especialidad medica
INSERT INTO Especialidad
    (nombre_esp, cedula_profesional, descripcion)
VALUES
    ('Medicina General', '1234567', 'Atenci�n m�dica general'),
    ('Ginecolog�a', '2345678', 'Salud femenina y obstetricia'),
    ('Pediatr�a', '3456789', 'Atenci�n a ni�os'),
    ('Cardiolog�a', '4567890', 'Coraz�n y sistema circulatorio');

--Enlista las ocupaciones principales
INSERT INTO Ocupacion
    (id_especialidad, nombre_ocupacion, cedula_profesional, institucion_titulacion, anio_titulacion, descripcion)
VALUES
    (1, 'M�dico General', '1234567', 'UNAM', 2015, 'Atiende consultas generales'),
    (2, 'Ginec�loga', '2345678', 'UANL', 2016, 'Especialista en salud femenina'),
    (3, 'Pediatra', '3456789', 'IPN', 2018, 'Especialista en ni�os'),
    (NULL, 'Enfermera General', NULL, 'Tecnol�gico de Enfermer�a', 2019, 'Asiste en procesos cl�nicos');

SELECT *
FROM Especialidad;

-- Enlistar estudios varios de solicitud
INSERT INTO Estudio
    (nombre_estudio)
VALUES
    ('An�lisis de Sangre'),
    ('Radiograf�a de T�rax'),
    ('Ultrasonido'),
    ('Electrocardiograma'),
    ('Examen General de Orina');

--Lista de servicios en la clinica pueden ser mas o menos dependiendo la clinica
INSERT INTO Servicio
    (nombre_servicio, descripcion, costo)
VALUES
    ('Consulta General', 'Evaluaci�n m�dica general', 250.00),
    ('Consulta Pedi�trica', 'Atenci�n para menores de edad', 300.00),
    ('Consulta Ginecol�gica', 'Chequeo ginecol�gico completo', 400.00),
    ('Laboratorio', 'Toma y an�lisis de muestras', 150.00),
    ('Estudios de Gabinete', 'Rayos X, ultrasonido y m�s', 500.00);

--Si va haber mas sucursales se puede agregar los nombres distintivos de las demas clinicas
INSERT INTO Clinica
    (nombre_marca, ubicacion, numero_contacto, email)
VALUES
    ('Cl�nica HealthCare', 'Calle Salud 123, CDMX', '5551234567', 'info@sanrafael.mx'),
    ('Consultorio Sanare', 'Av. Bienestar 456, Guadalajara', '3312345678', 'contacto@vidaplena.mx');

-- Identificacion de tipo de antecedente
INSERT INTO TipoAntecedente
    (nombre_tipo, clave_codigo)
VALUES
    ('Heredo-Familiares', 'HF01'),
    ('Personales Patol�gicos', 'PP01'),
    ('No Patol�gicos', 'NP01'),
    ('Gineco-Obst�tricos', 'GO01');

--El paciente va ligado con el numero de expedientes
INSERT INTO Paciente
    (nombre, apellido, curp_paciente, fecha_nacimiento, numero_contacto, direccion, email, contacto_emergencia, edad, genero, estado_civil, ocupacion, tipo_sangre)
VALUES
    ('Laura', 'Garc�a', 'GACL900123MDFRRL09', '1990-01-23', '5551231234', 'CDMX, Calle Uno', 'laura.garcia@example.com', 'Ana Garc�a', 34, 'F', 'Soltera', 'Dise�adora', 'A+'),
    ('Carlos', 'Ram�rez', 'RACR850523HDFRRL05', '1985-05-23', '5543214321', 'CDMX, Calle Dos', 'carlos.ramirez@example.com', 'Pedro Ram�rez', 39, 'M', 'Casado', 'Ingeniero', 'O-');

SELECT *
FROM Paciente;

--Los usuarios se definen en tipo de rol para los accesos y pantallas
INSERT INTO Usuario
    (id_rol, id_ocupacion, nombre, apellido, curp, fecha_nacimiento, direccion, email, telefono, password_hash)
VALUES
    (1, NULL, 'Admin', 'Sistema', 'ADMS900101HDFXXX01', '1990-01-01', 'Oficina Central', 'admin@clinica.com', '5550000000', '321poi'),
    --admin
    (3, 2, 'Luis', 'Hern�ndez', 'HERL870415HDFRRL01', '1987-04-15', 'CDMX, Calle Doctor', 'luis.hernandez@clinica.com', '5560010010', '321poi'),
    --Medico
    (4, NULL, 'Mar�a', 'S�nchez', 'SASM910505MDFRRL08', '1991-05-05', 'CDMX, Calle Enfermer�a', 'maria.sanchez@clinica.com', '5570020020', '321poi');
--Enfermera

ALTER TABLE HistoriaClinica
ADD CONSTRAINT DF_HistoriaClinica_FechaApertura DEFAULT GETDATE() FOR fecha_apertura;

INSERT INTO Servicio
    (nombre_servicio, descripcion, costo)
VALUES
    ('Consulta General', 'Atenci�n m�dica general', 500);

INSERT INTO HorarioDisponible
    (id_usuario, fecha, dia, hora, disponible)
VALUES
    (2, '2025-08-10', '09:00', '10:00', 1);

-- Paso A: agregar columna de referencia
ALTER TABLE Cita
ADD id_estado_cita INT;

-- Paso B: crear relaci�n for�nea
ALTER TABLE Cita
ADD CONSTRAINT FK_Cita_EstadoCita
FOREIGN KEY (id_estado_cita) REFERENCES EstadoCita(id_estado_cita);

-- Paso C (opcional): eliminar columna anterior de status si ya no la necesitas
ALTER TABLE Cita
DROP COLUMN status;

SELECT *
FROM Cita;

CREATE TABLE EstadoCita
(
    id_estado_cita INT IDENTITY(1,1) PRIMARY KEY,
    nombre_estado NVARCHAR(20) NOT NULL UNIQUE
);

-- Insertar los estados posibles
INSERT INTO EstadoCita
    (nombre_estado)
VALUES
    ('disponible'),
    ('reservada'),
    ('confirmada'),
    ('cancelada'),
    ('completada');

ALTER TABLE Cita
ADD id_estado_cita INT;

-- Agregar la restricci�n de clave for�nea
ALTER TABLE Cita
ADD CONSTRAINT FK_EstadoCita
FOREIGN KEY (id_estado_cita) REFERENCES EstadoCita(id_estado_cita);

-- Obtener el ID de "disponible"
DECLARE @idDisponible INT;

SELECT @idDisponible = id_estado_cita
FROM EstadoCita
WHERE nombre_estado = 'disponible';

-- Asignarlo a todas las citas que tengan NULL
UPDATE Cita

SET id_estado_cita = @idDisponible
WHERE id_estado_cita IS NULL;
SELECT *
FROM EstadoCita;

SELECT *
FROM Cita
WHERE id_estado_cita IS NULL
ALTER TABLE Paciente
ADD alergias NVARCHAR(MAX) NULL;

-- Consulta General
UPDATE Servicio
SET url_imagen = 'https://www.freepik.es/foto-gratis/cientificos-tiro-medio-posando-juntos_14309430.htm#fromView=keyword&page=1&position=0&uuid=9a1a4e6c-5536-4741-ac82-698f23a30c7f&query=Medicos'
WHERE id_servicio = 9;

-- Consulta Pedi�trica
UPDATE Servicio
SET url_imagen = 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=400&q=80'
WHERE id_servicio = 10;

-- Consulta Ginecol�gica
UPDATE Servicio
SET url_imagen = 'https://images.unsplash.com/photo-1588776814546-ec7e3b2c8b1b?auto=format&fit=crop&w=400&q=80'
WHERE id_servicio = 11;

-- Laboratorio 
UPDATE Servicio
SET url_imagen = 'https://images.unsplash.com/photo-1519821172143-ecb1df1bbf55?auto=format&fit=crop&w=400&q=80'
WHERE id_servicio = 12;

--eliminacion de las fechas de contactoPaciente
ALTER TABLE ContactoMensaje
DROP COLUMN fecha_contacto;
--ejemplo de crear mensajes de contacto para la clinica
INSERT INTO ContactoMensaje
    (nombre, email, telefono, asunto, mensaje, medio_preferido, status, atendido_por)
VALUES
    ('Julia lopez', 'julia@paciente.com', '9661564111', 'Consulta', 'Quiero informaci�n sobre mis citas en ginecologia', 'telefono', 'nuevo', NULL);

--cambiamos el nombre de la tabla permisos para mejor identificacion en el back
SELECT OBJECT_NAME(object_id) AS objeto, definition
FROM sys.sql_modules
WHERE definition LIKE '%Permiso.nombre%';

SELECT OBJECT_NAME(object_id) AS objeto, definition
FROM sys.sql_modules
WHERE definition LIKE '%nombre%';

SELECT OBJECT_NAME(object_id) AS objeto, definition
FROM sys.sql_modules
WHERE definition LIKE '%Permiso%';

EXEC sp_rename 'Permiso.nombre', 'nombre_pantalla', 'COLUMN';
--alterando la tabla rolpermiso para poder usar permitido por check true/false
ALTER TABLE RolPermiso
ADD permitido BIT DEFAULT 0 NOT NULL;

--rellenando datos para mostrar en la pantalla
INSERT INTO Permiso
    (nombre_pantalla, descripcion)
VALUES
    ('Dashboard', 'Vista general de estad�sticas del sistema (citas, pacientes, ingresos, etc.)'),
    ('Citas', 'Agenda, creaci�n, modificaci�n y gesti�n de citas m�dicas'),
    ('Pacientes', 'Registro, b�squeda y actualizaci�n de pacientes'),
    ('Expedientes clinicos', 'Acceso al historial m�dico y registros cl�nicos'),
    ('Recetas medicas', 'Creaci�n, firma e impresi�n de recetas para pacientes'),
    ('Laboratorio/ Estudios clinicos', 'Registro y resultados de an�lisis de laboratorio o im�genes'),
    ('Cobros y facturacion', 'Facturaci�n, registro de pagos, control de ingresos');
-- Agrega m�s seg�n tus m�dulos

--llenando la tabla RolPermiso
-- Elimina cualquier asignaci�n previa del rol Administrador (opcional pero recomendado)
DELETE FROM RolPermiso
WHERE id_rol = 1;
-- Inserta todos los permisos disponibles al rol Administrador
INSERT INTO RolPermiso
    (id_rol, id_permiso, permitido)
SELECT 1 AS id_rol, id_permiso, 1 AS permitido
FROM Permiso;

-- El rol Recepcionista (id_rol = 2) tiene acceso a Citas (id_permiso = 2)
INSERT INTO RolPermiso
    (id_rol, id_permiso, permitido)
VALUES
    (2, 2, 1);

-- El rol M�dico (id_rol = 3) NO tiene acceso al Dashboard
INSERT INTO RolPermiso
    (id_rol, id_permiso, permitido)
VALUES
    (3, 1, 0);

-- Modificar tabla paciente para tener pacientes activos o inactivos
ALTER TABLE Paciente ADD status INT NOT NULL DEFAULT 1;

-- Agregando status a la tabla antecedente======================================================
ALTER TABLE Antecedente ADD status INT NOT NULL DEFAULT 1;

--insertando datos para antecedentes
INSERT INTO TipoAntecedente
    (nombre_tipo, clave_codigo)
VALUES
    ('Personal Patologica', 'PER_PAT');
INSERT INTO Antecedente
    (nombre_antecedente, descripcion, id_tipo_antecedente)
VALUES
    ('TraumatismoFX', 'Fractura No craneal', 1);
INSERT INTO AntecedentePaciente
    (id_antecedente, id_paciente, especificacion, fecha_registro, descripcion)
VALUES
    (1, 2, 'Accidente de moto', '2025-10-22T10:00:00.000', 'fractura expuesta Femur pierna derecha');

--Alteramos la tabla signos vitales ya que los signos vitales son cambiantes y requieren historial de avances en el paciente
ALTER TABLE SignosVitales
ADD id_paciente INT NOT NULL,
    fecha_registro DATETIME DEFAULT GETDATE();

ALTER TABLE SignosVitales
ADD CONSTRAINT FK_Signos_Paciente FOREIGN KEY (id_paciente) REFERENCES Paciente(id_paciente);

-- Insertamos los estados posibles
INSERT INTO EstadoCita
     (nombre_estado)
VALUES
	('pendiente'),
	('confirmada'),
	('cancelada'),
	('completada');

-- 1) A�adir las columnas (primero como NULL si hay datos existentes)
ALTER TABLE NotaMedicaSeguimiento
ADD id_paciente INT NULL,
    fecha_registro DATETIME DEFAULT GETDATE();
GO

-- 2) Backfill de id_paciente desde la tabla Cita (sin usar alias)
UPDATE NotaMedicaSeguimiento
SET id_paciente = (
    SELECT id_paciente
FROM Cita
WHERE Cita.id_cita = NotaMedicaSeguimiento.id_cita
)
WHERE id_paciente IS NULL AND id_cita IS NOT NULL;
GO

-- 3) Verificar cu�ntas filas quedaron sin id_paciente antes de forzar NOT NULL
SELECT COUNT(1) AS NullCount
FROM NotaMedicaSeguimiento
WHERE id_paciente IS NULL;
GO

-- Si NullCount = 0 puedes hacer la columna NOT NULL y aplicar la FK.
-- 4) Hacer la columna NOT NULL (ejecutar s�lo si no hay NULLs)
ALTER TABLE NotaMedicaSeguimiento
ALTER COLUMN id_paciente INT NOT NULL;
GO

-- 5) Crear �ndice (opcional, ayuda en joins/busquedas)
CREATE INDEX IX_NotaMedicaSeg_IdPaciente ON NotaMedicaSeguimiento(id_paciente);
GO

-- 6) Agregar la restricci�n de clave for�nea
ALTER TABLE NotaMedicaSeguimiento
ADD CONSTRAINT FK_NotaMedica_Paciente FOREIGN KEY (id_paciente) REFERENCES Paciente(id_paciente);
GO

--agrega interbalo de fecha y hora de atencion
ALTER TABLE Cita
ADD CONSTRAINT CHK_Cita_HoraCita
CHECK (hora_cita >= '06:00' AND hora_cita <= '18:00');

--verificando datos cita
SELECT id_horario, id_medico, fecha, hora
FROM Horario;

--verifar servicios existentes
SELECT id_servicio, nombre_servicio
FROM Servicio;

--isertar horario
INSERT INTO Horario
    (id_medico, id_clinica, id_servicio, fecha, dia, hora, status)
VALUES
    (1, 1, 9, '2025-10-28', 2, '08:00', 1);
-- id_servicio = 9 (Consulta General)

--verficar horario creado
SELECT id_horario, id_medico, id_clinica, id_servicio, fecha, hora
FROM Horario;

--verificar profesional medico
SELECT id_usuario, nombre, apellido
FROM Usuario
WHERE id_rol = 3;
-- solo mEdicos

--insertar horario para medico
-- Ejemplo: Horario para Luis HernAndez
INSERT INTO Horario
    (id_medico, id_clinica, id_servicio, fecha, dia, hora)
VALUES
    (10, 1, 9, '2025-10-28', 2, '08:00');

--horarios existentes
SELECT *
FROM Horario;

--insertar cita con horario creado previo
INSERT INTO Cita
    (
    id_paciente,
    id_horario,
    id_clinica,
    id_servicio,
    id_profesional,
    fecha_cita,
    hora_cita,
    id_estado_cita
    )
VALUES
    (
        1, -- id_paciente
        3, -- id_horario existente
        1, -- id_clinica
        9, -- id_servicio
        10, -- id_profesional = Luis HernAndez
        '2025-10-28',
        '08:00',
        1    -- pendiente
);

--verificando cita creada
SELECT *
FROM Cita;

--Script para agregar datos horario disponible
-- Variables de configuraciOn
-- Borrar todas las citas que tienen horarios antiguos

--crear constraint llave foranea de horario
ALTER TABLE Horario
ADD CONSTRAINT FK_Horario_Clinica FOREIGN KEY (id_clinica) REFERENCES Clinica(id_clinica);

ALTER TABLE Horario
ADD CONSTRAINT FK_Horario_Servicio FOREIGN KEY (id_servicio) REFERENCES Servicio(id_servicio);

ALTER TABLE Horario
ADD CONSTRAINT FK_Horario_Medico FOREIGN KEY (id_medico) REFERENCES Usuario(id_usuario);


-- =====================================================
-- SISTEMA DE AGENDA DINAMICA PARA CITAS MEDICAS
-- =====================================================

IF EXISTS (SELECT 1
FROM sys.foreign_keys
WHERE name = 'FK_Cita_Horario')
    ALTER TABLE Cita DROP CONSTRAINT FK_Cita_Horario;

-- 1.2 Eliminar la tabla Horario existente
IF EXISTS (SELECT 1
FROM sys.objects
WHERE name = 'Horario' AND type = 'U')
    DROP TABLE Horario;

-- 1.3 Eliminar HorarioMedico si existe
IF EXISTS (SELECT 1
FROM sys.objects
WHERE name = 'HorarioMedico' AND type = 'U')
    DROP TABLE HorarioMedico;

-- 1.4 Eliminar ExcepcionHorario si existe
IF EXISTS (SELECT 1
FROM sys.objects
WHERE name = 'ExcepcionHorario' AND type = 'U')
    DROP TABLE ExcepcionHorario;

-- 1. MODIFICAR TABLA HorarioMedico (Plantilla semanal)
-- Esta tabla define los horarios habituales del mEdico
DROP TABLE IF EXISTS HorarioMedico;
CREATE TABLE HorarioMedico
(
    id_horario_medico INT IDENTITY(1,1) PRIMARY KEY,
    id_medico INT NOT NULL,
    id_clinica INT NOT NULL,
    id_servicio INT NOT NULL,
    dia_semana TINYINT NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
    -- 1=Lunes, 7=Domingo
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    duracion_consulta INT NOT NULL DEFAULT 30,
    -- minutos por consulta
    activo BIT DEFAULT 1,
    fecha_vigencia_inicio DATE NULL,
    -- desde cuAndo aplica
    fecha_vigencia_fin DATE NULL,
    -- hasta cuAndo aplica (NULL = indefinido)
    CONSTRAINT FK_HorarioMedico_Usuario FOREIGN KEY (id_medico) REFERENCES Usuario(id_usuario),
    CONSTRAINT FK_HorarioMedico_Clinica FOREIGN KEY (id_clinica) REFERENCES Clinica(id_clinica),
    CONSTRAINT FK_HorarioMedico_Servicio FOREIGN KEY (id_servicio) REFERENCES Servicio(id_servicio),
    CONSTRAINT CHK_HorarioMedico_Horas CHECK (hora_fin > hora_inicio)
);

-- 2. MODIFICAR TABLA Horario (Slots especIficos generados)
-- Esta tabla contendrA los espacios de tiempo especIficos disponibles
DROP TABLE IF EXISTS Horario;
CREATE TABLE Horario
(
    id_horario INT IDENTITY(1,1) PRIMARY KEY,
    id_horario_medico INT NOT NULL,
    -- referencia a la plantilla
    id_medico INT NOT NULL,
    id_clinica INT NOT NULL,
    id_servicio INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    status TINYINT DEFAULT 1,
    -- 1: disponible, 2: reservado, 3: bloqueado, 4: cancelado
    id_cita INT NULL,
    -- si estA reservado, referencia a la cita
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Horario_HorarioMedico FOREIGN KEY (id_horario_medico) REFERENCES HorarioMedico(id_horario_medico),
    CONSTRAINT FK_Horario_Medico FOREIGN KEY (id_medico) REFERENCES Usuario(id_usuario),
    CONSTRAINT FK_Horario_Clinica FOREIGN KEY (id_clinica) REFERENCES Clinica(id_clinica),
    CONSTRAINT FK_Horario_Servicio FOREIGN KEY (id_servicio) REFERENCES Servicio(id_servicio),
    CONSTRAINT UQ_Horario_Unico UNIQUE (id_medico, fecha, hora_inicio)
);

-- 3. TABLA para excepciones (dIas no laborables, vacaciones, etc.)
CREATE TABLE ExcepcionHorario
(
    id_excepcion INT IDENTITY(1,1) PRIMARY KEY,
    id_medico INT NOT NULL,
    id_clinica INT NULL,
    -- NULL si aplica a todas las clInicas
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    motivo NVARCHAR(200) NULL,
    tipo NVARCHAR(20) CHECK (tipo IN ('vacaciones', 'feriado', 'capacitacion', 'personal', 'enfermedad')),
    creado_por INT NULL,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Excepcion_Medico FOREIGN KEY (id_medico) REFERENCES Usuario(id_usuario),
    CONSTRAINT FK_Excepcion_CreadoPor FOREIGN KEY (creado_por) REFERENCES Usuario(id_usuario)
);

--restaruar la FK de cita hacia horario
ALTER TABLE Cita
ADD CONSTRAINT FK_Cita_Horario FOREIGN KEY (id_horario) REFERENCES Horario(id_horario);

-- 4. PROCEDIMIENTO para generar slots de horarios automAticamente
--elimnar ocupacion  y sitetizar especialidad
ALTER TABLE Especialidad
    ADD institucion_titulacion NVARCHAR(100) NULL;

ALTER TABLE Especialidad
    ADD anio_titulacion INT NULL;

SELECT 
    fk.name AS NombreRestriccion,
    OBJECT_NAME(fk.parent_object_id) AS TablaReferenciadora
FROM 
    sys.foreign_keys fk
WHERE 
    fk.referenced_object_id = OBJECT_ID('Ocupacion');

ALTER TABLE Usuario
DROP CONSTRAINT FK_Usuario_Ocupacion;
DROP VIEW vw_MedicosPublicos;

SELECT * FROM EstadoCita;
SELECT * FROM Noticia; --VACIO
SELECT * FROM Especialidad;
SELECT * FROM Usuario;
Select * FROM Paciente;
SELECT * FROM Servicio;
SELECT * FROM ContactoMensaje; --VACIO
SELECT * FROM Rol;
SELECT * FROM RolPermiso;
SELECT * FROM Permiso;
SELECT * FROM Antecedente;
SELECT * FROM AntecedentePaciente;
SELECT * FROM TipoAntecedente;
SELECT * FROM SignosVitales;
SELECT * FROM Gineco_Obstetricia;
SELECT * FROM NotaMedicaSeguimiento; --VACIO
SELECT * FROM Cita;
--delete from Servicio;

DROP TABLE Horario;
DROP TABLE HorarioMedico;

EXEC sp_rename 'Cita.id_profesional', 'id_medico', 'COLUMN';
EXEC sp_rename 'NotaMedicaSeguimiento.id_profesional', 'id_medico', 'COLUMN';
EXEC sp_rename 'Receta.id_profesional', 'id_medico', 'COLUMN';
EXEC sp_rename 'ConsentimientoInformado.id_profesional', 'id_medico', 'COLUMN';
EXEC sp_rename 'IncapacidadMedica.id_profesional', 'id_medico', 'COLUMN';
EXEC sp_rename 'DetallePago.id_profesional', 'id_medico', 'COLUMN';
EXEC sp_rename 'ExamenClinico.id_usuario', 'id_medico', 'COLUMN';

-- Cambia 'FK_Cita_Profesional' a 'FK_Cita_Medico'
EXEC sp_rename 'FK_Cita_Profesional', 'FK_Cita_Medico', 'OBJECT';
EXEC sp_rename 'FK_Nota_Profesional', 'FK_Nota_Medico', 'OBJECT';
EXEC sp_rename 'FK_Receta_Profesional', 'FK_Receta_Medico', 'OBJECT';
EXEC sp_rename 'FK__Consentim__id_pr__46B27FE2', 'FK_Consentimiento_Medico', 'OBJECT';
EXEC sp_rename 'FK_Incapacidad_Profesional', 'FK_Incapacidad_Medico', 'OBJECT';
EXEC sp_rename 'FK_Detalle_Profesional', 'FK_Detalle_Medico', 'OBJECT';
EXEC sp_rename 'FK__ExamenCli__id_us__06CD04F7', 'FK_ExamenClinico_Medico', 'OBJECT';
-- INFORMACIÓN DE LA CONSULTA
-- 1️⃣ Agregar columna para motivo o detalle de la consulta
ALTER TABLE Cita
ADD motivo_detalle NVARCHAR(500) NULL;
GO

-- 2️⃣ Crear restricción única: evita que un médico tenga dos citas en el mismo horario
ALTER TABLE Cita
ADD CONSTRAINT UQ_Cita_Duplicada UNIQUE (id_medico, fecha_cita, hora_cita);
GO

-- Relación entre Usuario y Especialidad
CREATE TABLE UsuarioEspecialidad (
    id_usuario_especialidad INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_especialidad INT NOT NULL,
    anios_experiencia INT NULL,
    descripcion NVARCHAR(200) NULL,  -- información adicional opcional
    CONSTRAINT FK_UsuarioEsp_Usuario FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    CONSTRAINT FK_UsuarioEsp_Especialidad FOREIGN KEY (id_especialidad) REFERENCES Especialidad(id_especialidad),
    CONSTRAINT UQ_UsuarioEsp UNIQUE (id_usuario, id_especialidad)
);


