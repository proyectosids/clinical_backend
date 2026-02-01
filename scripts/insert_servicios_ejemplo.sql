-- Script para insertar datos de ejemplo en la tabla Servicio
-- Ejecutar este script en SQL Server Management Studio o Azure Data Studio

USE ClinicaDB;
GO

-- Verificar si la tabla Servicio existe
IF EXISTS (SELECT *
FROM sysobjects
WHERE name='Servicio' AND xtype='U')
BEGIN
    PRINT 'Tabla Servicio encontrada';

    -- Insertar datos de ejemplo si no existen
    IF NOT EXISTS (SELECT *
    FROM Servicio
    WHERE nombre_servicio = 'Consulta General')
    BEGIN
        INSERT INTO Servicio
            (nombre_servicio, descripcion, costo, horario, url_imagen, status)
        VALUES
            ('Consulta General', 'Consulta médica general para evaluación de síntomas y diagnóstico básico', 500.00, 'Lunes a Viernes 8:00-18:00', 'https://ejemplo.com/consulta-general.jpg', 1),
            ('Consulta Especializada', 'Consulta con médico especialista en diferentes áreas médicas', 800.00, 'Lunes a Viernes 9:00-17:00', 'https://ejemplo.com/consulta-especializada.jpg', 1),
            ('Laboratorio Clínico', 'Análisis de sangre, orina y otros estudios de laboratorio', 300.00, 'Lunes a Sábado 7:00-15:00', 'https://ejemplo.com/laboratorio.jpg', 1),
            ('Radiología', 'Estudios de rayos X, ultrasonido y tomografía', 400.00, 'Lunes a Viernes 8:00-16:00', 'https://ejemplo.com/radiologia.jpg', 1),
            ('Fisioterapia', 'Sesiones de rehabilitación y terapia física', 350.00, 'Lunes a Viernes 8:00-17:00', 'https://ejemplo.com/fisioterapia.jpg', 1),
            ('Consulta de Cardiología', 'Consulta especializada en enfermedades del corazón y sistema cardiovascular', 900.00, 'Lunes a Viernes 10:00-16:00', 'https://ejemplo.com/cardiologia.jpg', 1),
            ('Consulta de Dermatología', 'Consulta especializada en enfermedades de la piel', 600.00, 'Lunes a Viernes 9:00-15:00', 'https://ejemplo.com/dermatologia.jpg', 1),
            ('Consulta de Pediatría', 'Consulta médica especializada en niños y adolescentes', 450.00, 'Lunes a Viernes 8:00-18:00', 'https://ejemplo.com/pediatria.jpg', 1),
            ('Consulta de Neurología', 'Consulta especializada en enfermedades del sistema nervioso', 850.00, 'Lunes a Viernes 9:00-17:00', 'https://ejemplo.com/neurologia.jpg', 1),
            ('Consulta de Ginecología', 'Consulta especializada en salud femenina', 700.00, 'Lunes a Viernes 8:00-16:00', 'https://ejemplo.com/ginecologia.jpg', 1);

        PRINT 'Datos de ejemplo insertados exitosamente en la tabla Servicio';
    END
    ELSE
    BEGIN
        PRINT 'Los datos de ejemplo ya existen en la tabla Servicio';
    END

    -- Mostrar los servicios insertados
    SELECT
        id_servicio,
        nombre_servicio,
        descripcion,
        costo,
        horario,
        url_imagen,
        status,
        creado_en
    FROM Servicio
    ORDER BY id_servicio;

END
ELSE
BEGIN
    PRINT 'ERROR: La tabla Servicio no existe. Ejecuta primero el script de creación de la base de datos.';
END

PRINT 'Script ejecutado exitosamente';

