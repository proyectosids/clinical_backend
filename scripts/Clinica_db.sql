CREATE DATABASE ClinicaDB;
GO

USE ClinicaDB;

CREATE TABLE Rol
(
    id_rol INT IDENTITY(1,1) PRIMARY KEY,
    nombre_rol NVARCHAR(50) NOT NULL UNIQUE,
    descripcion NVARCHAR(200) NULL
);

CREATE TABLE Especialidad
(
    id_especialidad INT IDENTITY(1,1) PRIMARY KEY,
    nombre_esp NVARCHAR(100) NOT NULL,
    cedula_profesional NVARCHAR(50) NULL,
    institucion_titulacion NVARCHAR(100) NULL,
    anio_titulacion INT NULL,
    descripcion NVARCHAR(200) NULL
);

CREATE TABLE Estudio
(
    id_estudio INT IDENTITY(1,1) PRIMARY KEY,
    nombre_estudio NVARCHAR(100) NOT NULL UNIQUE
    -- 'Laboratorio', 'Imagenologia', 'Gabinete'
);

CREATE TABLE Servicio
(
    id_servicio INT IDENTITY(1,1) PRIMARY KEY,
    nombre_servicio NVARCHAR(100) NOT NULL,
    descripcion NVARCHAR(MAX) NULL,
    costo DECIMAL(10,2) NOT NULL,
    horario NVARCHAR(100) NULL,
    url_imagen NVARCHAR(255) NULL,
    creado_en DATETIME DEFAULT GETDATE(),
    actualizado_en DATETIME DEFAULT GETDATE(),
    status TINYINT DEFAULT 1
);

CREATE TABLE Clinica
(
    id_clinica INT IDENTITY(1,1) PRIMARY KEY,
    nombre_marca NVARCHAR(100) NOT NULL,
    ubicacion NVARCHAR(MAX) NOT NULL,
    numero_contacto NVARCHAR(20) NULL,
    email NVARCHAR(100) NULL,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    status TINYINT DEFAULT 1
);

CREATE TABLE TipoAntecedente
(
    id_tipo_antecedente INT IDENTITY(1,1) PRIMARY KEY,
    nombre_tipo NVARCHAR(50) NOT NULL,
    clave_codigo NVARCHAR(20) NULL,
    status INT NOT NULL DEFAULT 1
);

CREATE TABLE SignosVitales
(
    id_signos_vitales INT IDENTITY(1,1) PRIMARY KEY,
    temperatura DECIMAL(4,2) NULL,
    presion_arterial NVARCHAR(10) NULL,
    -- '120/80'
    frecuencia_cardiaca INT NULL,
    frecuencia_respiratoria INT NULL,
    glucemia INT NULL,
    saturacion_oxigeno DECIMAL(4,2) NULL,
    peso DECIMAL(5,2) NULL,
    talla DECIMAL(4,2) NULL,
    imc DECIMAL(5,2) NULL,
    id_paciente INT NOT NULL,
    fecha_registro DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Signos_Paciente FOREIGN KEY (id_paciente) REFERENCES Paciente(id_paciente)
);

CREATE TABLE ExploracionFisica
(
    id_exploracion_fisica INT IDENTITY(1,1) PRIMARY KEY,
    inspeccion_general NVARCHAR(MAX) NULL,
    cabeza_cuello NVARCHAR(MAX) NULL,
    torax NVARCHAR(MAX) NULL,
    abdomen NVARCHAR(MAX) NULL,
    genitales NVARCHAR(MAX) NULL,
    extremidades NVARCHAR(MAX) NULL,
    observaciones NVARCHAR(MAX) NULL
);

CREATE TABLE Paciente
(
    id_paciente INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(50) NOT NULL,
    apellido NVARCHAR(50) NOT NULL,
    curp_paciente NVARCHAR(18) UNIQUE NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    numero_contacto NVARCHAR(50) NULL,
    direccion NVARCHAR(MAX) NULL,
    email NVARCHAR(100) NULL,
    contacto_emergencia NVARCHAR(100) NULL,
    edad INT NULL,
    genero NVARCHAR(10) CHECK (genero IN ('M', 'F', 'Otro')),
    estado_civil NVARCHAR(20) NULL,
    ocupacion NVARCHAR(50) NULL,
    tipo_sangre NVARCHAR(5) NULL,
    alergias NVARCHAR(5) NULL,
    foto_url NVARCHAR(255) NULL
);

CREATE TABLE Usuario
(
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    id_rol INT NOT NULL,
    nombre NVARCHAR(50) NOT NULL,
    apellido NVARCHAR(50) NOT NULL,
    curp NVARCHAR(18) UNIQUE NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    direccion NVARCHAR(MAX) NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    telefono NVARCHAR(15) NULL,
    password_hash NVARCHAR(MAX) NOT NULL,
    foto_url NVARCHAR(255) NULL,
    status TINYINT DEFAULT 1,
    fecha_registro DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Usuario_Rol FOREIGN KEY (id_rol) REFERENCES Rol(id_rol)
);

CREATE TABLE Clinica_Servicio
(
    id_clinica_servicio INT IDENTITY(1,1) PRIMARY KEY,
    id_clinica INT NOT NULL,
    id_servicio INT NOT NULL,
    horario_atencion TIME NULL,
    precio_personalizado DECIMAL(10,2) NULL,
    CONSTRAINT FK_ClinicaServicio_Clinica FOREIGN KEY (id_clinica) REFERENCES Clinica(id_clinica),
    CONSTRAINT FK_ClinicaServicio_Servicio FOREIGN KEY (id_servicio) REFERENCES Servicio(id_servicio),
    CONSTRAINT UQ_ClinicaServicio UNIQUE (id_clinica, id_servicio)
);

CREATE TABLE SolicitudEstudio
(
    id_solicitud_estudio INT IDENTITY(1,1) PRIMARY KEY,
    id_paciente INT NOT NULL,
    -- FK a Paciente
    id_usuario INT NOT NULL,
    -- FK a Usuario (m�dico que solicita)
    fecha_solicitud DATE NOT NULL DEFAULT GETDATE(),
    observaciones NVARCHAR(255) NULL,

    FOREIGN KEY (id_paciente) REFERENCES Paciente(id_paciente),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Antecedente
(
    id_antecedente INT IDENTITY(1,1) PRIMARY KEY,
    id_tipo_antecedente INT NOT NULL,
    nombre_antecedente NVARCHAR(100) NOT NULL,
    descripcion NVARCHAR(200) NULL,
    CONSTRAINT FK_Antecedente_Tipo FOREIGN KEY (id_tipo_antecedente) REFERENCES TipoAntecedente(id_tipo_antecedente)
);

CREATE TABLE Horario
(
    id_horario INT IDENTITY(1,1) PRIMARY KEY,
    id_medico INT NOT NULL,
    -- id_usuario del m�dico
    id_clinica INT NOT NULL,
    id_servicio INT NOT NULL,
    fecha DATE NOT NULL,
    dia TINYINT NOT NULL CHECK (dia BETWEEN 1 AND 7),
    -- 1=Lunes, 7=Domingo
    hora TIME NOT NULL,
    status TINYINT DEFAULT 1,
    -- 1: disponible
    CONSTRAINT FK_Horario_Medico FOREIGN KEY (id_medico) REFERENCES Usuario(id_usuario),
    CONSTRAINT FK_Horario_Clinica FOREIGN KEY (id_clinica) REFERENCES Clinica(id_clinica),
    CONSTRAINT FK_Horario_Servicio FOREIGN KEY (id_servicio) REFERENCES Servicio(id_servicio)
);

CREATE TABLE Cita
(
    id_cita INT IDENTITY(1,1) PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_horario INT NOT NULL,
    id_clinica INT NOT NULL,
    id_servicio INT NOT NULL,
    id_paciente INT NOT NULL,
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    id_estado_cita INT NOT NULL,
    motivo_detalle NVARCHAR(500) NULL,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Cita_Paciente FOREIGN KEY (id_paciente) REFERENCES Paciente(id_paciente),
    CONSTRAINT FK_Cita_Horario FOREIGN KEY (id_horario) REFERENCES Horario(id_horario),
    CONSTRAINT FK_Cita_Clinica FOREIGN KEY (id_clinica) REFERENCES Clinica(id_clinica),
    CONSTRAINT FK_Cita_Servicio FOREIGN KEY (id_servicio) REFERENCES Servicio(id_servicio),
    CONSTRAINT FK_Cita_Medico FOREIGN KEY (id_medico) REFERENCES Usuario(id_usuario),
    CONSTRAINT FK_EstadoCita FOREIGN KEY (id_estado_cita) REFERENCES EstadoCita(id_estado_cita),
    CONSTRAINT UQ_Cita_Duplicada UNIQUE (id_medico, fecha_cita, hora_cita)
);

CREATE TABLE AntecedentePaciente
(
    id_antecedente_paciente INT IDENTITY(1,1) PRIMARY KEY,
    id_antecedente INT NOT NULL,
    id_paciente INT NOT NULL,
    especificacion NVARCHAR(MAX) NULL,
    fecha_registro DATETIME2 DEFAULT GETDATE(),
    descripcion NVARCHAR(255),
    CONSTRAINT FK_AntPac_Antecedente FOREIGN KEY (id_antecedente) REFERENCES Antecedente(id_antecedente),
    CONSTRAINT FK_AntPac_Paciente FOREIGN KEY (id_paciente) REFERENCES Paciente(id_paciente),
    CONSTRAINT UQ_AntecedentePaciente UNIQUE (id_antecedente, id_paciente)
);

CREATE TABLE Gineco_Obstetricia
(
    id_gineo INT IDENTITY(1,1) PRIMARY KEY,
    id_paciente INT NOT NULL,
    menarca DATE NULL,
    fum DATE NULL,
    ivsa DATE NULL,
    dismenorrea BIT DEFAULT 0,
    embarazos INT NULL,
    partos INT NULL,
    cesareas INT NULL,
    abortos INT NULL,
    CONSTRAINT FK_Gineo_Paciente FOREIGN KEY (id_paciente) REFERENCES Paciente(id_paciente)
);

CREATE TABLE DetalleSolicitudEstudio
(
    id_detalle_solicitud INT IDENTITY(1,1) PRIMARY KEY,
    id_solicitud_estudio INT NOT NULL,
    -- FK a SolicitudEstudio
    id_estudio INT NOT NULL,
    -- FK a Estudio
    estatus_entrega NVARCHAR(50) DEFAULT 'pendiente',
    -- (pendiente, entregado, cancelado, etc.)
    fecha_entrega DATE NULL,
    comentario_medico NVARCHAR(255) NULL,

    FOREIGN KEY (id_solicitud_estudio) REFERENCES SolicitudEstudio(id_solicitud_estudio),
    FOREIGN KEY (id_estudio) REFERENCES Estudio(id_estudio)
);

CREATE TABLE ExamenClinico
(
    id_examen_clinico INT IDENTITY(1,1) PRIMARY KEY,
    id_detalle_solicitud INT NOT NULL,
    -- FK al detalle de la solicitud especifica
    id_usuario INT NOT NULL,
    -- Medico que interpreta el resultado
    fecha_resultado DATE NOT NULL DEFAULT GETDATE(),
    descripcion_resultado NVARCHAR(MAX) NULL,
    -- resumen medico
    archivo_pdf NVARCHAR(255) NULL,
    -- ruta o nombre de archivo PDF escaneado
    observaciones NVARCHAR(255) NULL,

    FOREIGN KEY (id_detalle_solicitud) REFERENCES DetalleSolicitudEstudio(id_detalle_solicitud),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Receta
(
    id_receta INT IDENTITY(1,1) PRIMARY KEY,
    id_clinica INT NOT NULL,
    id_medico INT NOT NULL,
    fecha_emision DATETIME2 DEFAULT GETDATE(),
    medicamentos NVARCHAR(MAX) NULL,
    -- Puede almacenar JSON
    indicaciones NVARCHAR(MAX) NULL,
    duracion_dias INT NULL,
    CONSTRAINT FK_Receta_Clinica FOREIGN KEY (id_clinica) REFERENCES Clinica(id_clinica),
    CONSTRAINT FK_Receta_Medico FOREIGN KEY (id_medico) REFERENCES Usuario(id_usuario)
);

CREATE TABLE NotaMedicaSeguimiento
(
    id_nota_medica_seguimiento INT IDENTITY(1,1) PRIMARY KEY,
    id_cita INT NOT NULL,
    padecimiento_actual NVARCHAR(MAX) NULL,
    id_signos_vitales INT NULL,
    id_exploracion_fisica INT NULL,
    id_examen_clinico INT NULL,
    diagnostico_idx NVARCHAR(MAX) NULL,
    analisis NVARCHAR(MAX) NULL,
    plan_medico NVARCHAR(MAX) NULL,
    id_solicitud_estudio INT NULL,
    id_receta INT NULL,
    pronostico NVARCHAR(MAX) NULL,
    id_medico INT NOT NULL,
    id_paciente INT NOT NULL,
    fecha_hora_atencion DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Nota_Cita FOREIGN KEY (id_cita) REFERENCES Cita(id_cita),
    CONSTRAINT FK_Nota_Signos FOREIGN KEY (id_signos_vitales) REFERENCES SignosVitales(id_signos_vitales),
    CONSTRAINT FK_Nota_Exploracion FOREIGN KEY (id_exploracion_fisica) REFERENCES ExploracionFisica(id_exploracion_fisica),
    CONSTRAINT FK_Nota_Examen FOREIGN KEY (id_examen_clinico) REFERENCES ExamenClinico(id_examen_clinico),
    CONSTRAINT FK_Nota_Solicitud FOREIGN KEY (id_solicitud_estudio) REFERENCES SolicitudEstudio(id_solicitud_estudio),
    CONSTRAINT FK_Nota_Receta FOREIGN KEY (id_receta) REFERENCES Receta(id_receta),
    CONSTRAINT FK_Nota_Medico FOREIGN KEY (id_medico) REFERENCES Usuario(id_usuario),
    CONSTRAINT FK_NotaMedica_Paciente FOREIGN KEY (id_paciente) REFERENCES Paciente(id_paciente)
);

CREATE TABLE ConsentimientoInformado
(
    id_consentimiento INT IDENTITY(1,1) PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_medico INT NOT NULL,
    contenido NVARCHAR(MAX) NOT NULL,
    fecha DATETIME NOT NULL DEFAULT GETDATE(),
    firmado BIT DEFAULT 0,
    -- 0 = no firmado, 1 = firmado
    observaciones NVARCHAR(500) NULL,
    -- para indicar si fue firmado fisicamente o electronicamente
    FOREIGN KEY (id_paciente) REFERENCES Paciente(id_paciente),
    FOREIGN KEY (id_medico) REFERENCES Usuario(id_usuario)
);

CREATE TABLE HistoriaClinica
(
    id_historia_cli INT IDENTITY(1,1) PRIMARY KEY,
    id_antecedente_paciente INT NULL,
    id_gineo INT NULL,
    id_nota_medica_seguimiento INT NULL,
    CONSTRAINT FK_Historia_AntecedentePac FOREIGN KEY (id_antecedente_paciente) REFERENCES AntecedentePaciente(id_antecedente_paciente),
    CONSTRAINT FK_Historia_Gineo FOREIGN KEY (id_gineo) REFERENCES Gineco_Obstetricia(id_gineo),
    CONSTRAINT FK_Historia_Nota FOREIGN KEY (id_nota_medica_seguimiento) REFERENCES NotaMedicaSeguimiento(id_nota_medica_seguimiento)
);

CREATE TABLE Expediente
(
    id_expediente INT IDENTITY(1,1) PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_historia_cli INT NULL,
    observaciones NVARCHAR(MAX) NULL,
    CONSTRAINT FK_Expediente_Paciente FOREIGN KEY (id_paciente) REFERENCES Paciente(id_paciente),
    CONSTRAINT FK_Expediente_Historia FOREIGN KEY (id_historia_cli) REFERENCES HistoriaClinica(id_historia_cli)
);

CREATE TABLE IncapacidadMedica
(
    id_incapacidad INT IDENTITY(1,1) PRIMARY KEY,
    id_historia_cli INT NOT NULL,
    id_medico INT NOT NULL,
    dias_incapacidad INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    motivo NVARCHAR(MAX) NULL,
    numero_folio NVARCHAR(50) UNIQUE NOT NULL,
    CONSTRAINT FK_Incapacidad_Historia FOREIGN KEY (id_historia_cli) REFERENCES HistoriaClinica(id_historia_cli),
    CONSTRAINT FK_Incapacidad_Medico FOREIGN KEY (id_medico) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Pago
(
    id_pago INT IDENTITY(1,1) PRIMARY KEY,
    id_paciente INT NOT NULL,
    fecha_pago DATETIME2 DEFAULT GETDATE(),
    metodo_pago NVARCHAR(20)
        CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia', 'credito')),
    total DECIMAL(10,2) NOT NULL,
    status NVARCHAR(20) DEFAULT 'pendiente'
        CHECK (status IN ('pendiente', 'pagado', 'anulado')),
    CONSTRAINT FK_Pago_Paciente FOREIGN KEY (id_paciente) REFERENCES Paciente(id_paciente)
);

CREATE TABLE DetallePago
(
    id_detalle INT IDENTITY(1,1) PRIMARY KEY,
    id_pago INT NOT NULL,
    id_servicio INT NOT NULL,
    id_medico INT NOT NULL,
    id_clinica INT NOT NULL,
    cantidad INT DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    iva DECIMAL(10,2) NOT NULL,
    total_linea DECIMAL(10,2) NOT NULL,
    CONSTRAINT FK_Detalle_Pago FOREIGN KEY (id_pago) REFERENCES Pago(id_pago),
    CONSTRAINT FK_Detalle_Servicio FOREIGN KEY (id_servicio) REFERENCES Servicio(id_servicio),
    CONSTRAINT FK_Detalle_Medico FOREIGN KEY (id_medico) REFERENCES Usuario(id_usuario),
    CONSTRAINT FK_Detalle_Clinica FOREIGN KEY (id_clinica) REFERENCES Clinica(id_clinica)
);

--tabla estado para citas
CREATE TABLE EstadoCita
(
    id_estado_cita INT IDENTITY(1,1) PRIMARY KEY,
    nombre_estado NVARCHAR(50) NOT NULL UNIQUE
);



--Creamos la tabla permisos para roles de usuarios
CREATE TABLE Permiso
(
    id_permiso INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    -- ej: 'agendar_cita'
    descripcion NVARCHAR(200) NULL
);

-- ?? Crear tabla RolPermiso (muchos a muchos entre Rol y Permiso)
CREATE TABLE RolPermiso
(
    id_rol INT NOT NULL,
    id_permiso INT NOT NULL,
    PRIMARY KEY (id_rol, id_permiso),
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol) ON DELETE CASCADE,
    FOREIGN KEY (id_permiso) REFERENCES Permiso(id_permiso) ON DELETE CASCADE
);

--tabla para acualizar noticias en la pagina estatica
-- Tabla de noticias publicas
CREATE TABLE Noticia
(
    id_noticia INT IDENTITY(1,1) PRIMARY KEY,
    titulo NVARCHAR(150) NOT NULL,
    resumen NVARCHAR(300) NULL,
    contenido NVARCHAR(MAX) NULL,
    imagen_url NVARCHAR(255) NULL,
    publicado BIT NOT NULL DEFAULT 1,
    fecha_publicacion DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    fecha_actualizacion DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    creado_por INT NULL,
    actualizado_por INT NULL,
    CONSTRAINT FK_Noticia_Creador FOREIGN KEY (creado_por) REFERENCES Usuario(id_usuario),
    CONSTRAINT FK_Noticia_Actualizador FOREIGN KEY (actualizado_por) REFERENCES Usuario(id_usuario)
);
CREATE INDEX IX_Noticia_Publicado_Fecha ON Noticia(publicado, fecha_publicacion DESC);

--tabla formulario de contacto para personal del hospital
-- Mensajes recibidos desde el formulario publico
CREATE TABLE ContactoMensaje
(
    id_contacto INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    email NVARCHAR(120) NOT NULL,
    telefono NVARCHAR(20) NULL,
    asunto NVARCHAR(150) NULL,
    mensaje NVARCHAR(MAX) NOT NULL,
    medio_preferido NVARCHAR(10) NULL
        CHECK (medio_preferido IN ('telefono','email')),
    status NVARCHAR(20) NOT NULL DEFAULT 'nuevo'
        CHECK (status IN ('nuevo','en_proceso','contactado','cerrado')),
    fecha_creacion DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    atendido_por INT NULL,
    CONSTRAINT FK_Contacto_AtendidoPor FOREIGN KEY (atendido_por) REFERENCES Usuario(id_usuario)
);

--acualizacion usuarios para visualizacion del personal medico de la clinica para informacion de los pacientes
ALTER TABLE Usuario
ADD es_publico BIT NOT NULL DEFAULT 0,
    titulo NVARCHAR(100) NULL,          -- Ej: "Dr.", "Dra.", "Lic."
    bio NVARCHAR(700) NULL,             -- Mini biografia
    redes NVARCHAR(400) NULL;           -- JSON con redes si lo usas (opcional)

-- opcion de que usuarios seran publico en la pagina estatica
GO

CREATE TABLE ExcepcionHorario
(
    id_excepcion INT IDENTITY(1,1) PRIMARY KEY,
    id_medico INT NOT NULL,
    id_clinica INT NULL,
    -- NULL si aplica a todas las clinicas
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    motivo NVARCHAR(200) NULL,
    tipo NVARCHAR(20) CHECK (tipo IN ('vacaciones', 'feriado', 'capacitacion', 'personal', 'enfermedad')),
    creado_por INT NULL,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Excepcion_Medico FOREIGN KEY (id_medico) REFERENCES Usuario(id_usuario),
    CONSTRAINT FK_Excepcion_CreadoPor FOREIGN KEY (creado_por) REFERENCES Usuario(id_usuario)
);

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




CREATE INDEX IX_Paciente_CURP ON Paciente(curp_paciente);
CREATE INDEX IX_Usuario_Email ON Usuario(email);
CREATE INDEX IX_Cita_Fecha ON Cita(fecha_cita);

ALTER TABLE Servicio
ADD CONSTRAINT DF_Servicio_CreadoEn DEFAULT GETDATE() FOR creado_en;

ALTER TABLE Servicio
ADD CONSTRAINT DF_Servicio_ActualizadoEn DEFAULT GETDATE() FOR actualizado_en;

ALTER TABLE Servicio
ADD CONSTRAINT DF_Servicio_Status DEFAULT 1 FOR status;

