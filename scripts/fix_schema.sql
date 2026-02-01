-- Script: fix_schema.sql
-- Propósito: aplicar correcciones seguras al esquema existente en ClinicaDB
-- Instrucciones: ejecutar en entorno de staging primero. Hacer BACKUP antes de producción.

SET NOCOUNT ON;

-- 1) Asegurar columnas y defaults en Servicio
IF OBJECT_ID('dbo.Servicio', 'U') IS NOT NULL
BEGIN
  PRINT 'Comprobando tabla Servicio...';

  IF COL_LENGTH('dbo.Servicio','creado_en') IS NULL
  BEGIN
    PRINT 'Añadiendo columna creado_en en Servicio';
    ALTER TABLE dbo.Servicio ADD creado_en DATETIME DEFAULT GETDATE();
  END

  IF COL_LENGTH('dbo.Servicio','actualizado_en') IS NULL
  BEGIN
    PRINT 'Añadiendo columna actualizado_en en Servicio';
    ALTER TABLE dbo.Servicio ADD actualizado_en DATETIME DEFAULT GETDATE();
  END

  IF COL_LENGTH('dbo.Servicio','status') IS NULL
  BEGIN
    PRINT 'Añadiendo columna status en Servicio';
    ALTER TABLE dbo.Servicio ADD status TINYINT DEFAULT 1;
  END

  -- Añadir constraints de default si no existen (nombres esperados)
  IF NOT EXISTS(SELECT 1 FROM sys.default_constraints dc JOIN sys.columns c ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id WHERE OBJECT_NAME(dc.parent_object_id) = 'Servicio' AND c.name = 'creado_en')
  BEGIN
    ALTER TABLE dbo.Servicio ADD CONSTRAINT DF_Servicio_CreadoEn DEFAULT GETDATE() FOR creado_en;
  END

  IF NOT EXISTS(SELECT 1 FROM sys.default_constraints dc JOIN sys.columns c ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id WHERE OBJECT_NAME(dc.parent_object_id) = 'Servicio' AND c.name = 'actualizado_en')
  BEGIN
    ALTER TABLE dbo.Servicio ADD CONSTRAINT DF_Servicio_ActualizadoEn DEFAULT GETDATE() FOR actualizado_en;
  END

  IF NOT EXISTS(SELECT 1 FROM sys.default_constraints dc JOIN sys.columns c ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id WHERE OBJECT_NAME(dc.parent_object_id) = 'Servicio' AND c.name = 'status')
  BEGIN
    ALTER TABLE dbo.Servicio ADD CONSTRAINT DF_Servicio_Status DEFAULT 1 FOR status;
  END
END

-- 2) Corregir SignosVitales: añadir columnas faltantes y FK hacia Paciente
IF OBJECT_ID('dbo.SignosVitales','U') IS NOT NULL
BEGIN
  PRINT 'Comprobando tabla SignosVitales...';

  -- columnas de valores fisiológicos (añadir solo si faltan)
  IF COL_LENGTH('dbo.SignosVitales','temperatura') IS NULL
    ALTER TABLE dbo.SignosVitales ADD temperatura DECIMAL(4,2) NULL;
  IF COL_LENGTH('dbo.SignosVitales','presion_arterial') IS NULL
    ALTER TABLE dbo.SignosVitales ADD presion_arterial NVARCHAR(10) NULL;
  IF COL_LENGTH('dbo.SignosVitales','frecuencia_cardiaca') IS NULL
    ALTER TABLE dbo.SignosVitales ADD frecuencia_cardiaca INT NULL;
  IF COL_LENGTH('dbo.SignosVitales','frecuencia_respiratoria') IS NULL
    ALTER TABLE dbo.SignosVitales ADD frecuencia_respiratoria INT NULL;
  IF COL_LENGTH('dbo.SignosVitales','glucemia') IS NULL
    ALTER TABLE dbo.SignosVitales ADD glucemia INT NULL;
  IF COL_LENGTH('dbo.SignosVitales','saturacion_oxigeno') IS NULL
    ALTER TABLE dbo.SignosVitales ADD saturacion_oxigeno DECIMAL(4,2) NULL;
  IF COL_LENGTH('dbo.SignosVitales','peso') IS NULL
    ALTER TABLE dbo.SignosVitales ADD peso DECIMAL(5,2) NULL;
  IF COL_LENGTH('dbo.SignosVitales','talla') IS NULL
    ALTER TABLE dbo.SignosVitales ADD talla DECIMAL(4,2) NULL;
  IF COL_LENGTH('dbo.SignosVitales','imc') IS NULL
    ALTER TABLE dbo.SignosVitales ADD imc DECIMAL(5,2) NULL;

  -- id_paciente y fecha_registro
  IF COL_LENGTH('dbo.SignosVitales','id_paciente') IS NULL
  BEGIN
    PRINT 'Añadiendo columna id_paciente en SignosVitales (nullable)';
    ALTER TABLE dbo.SignosVitales ADD id_paciente INT NULL;
  END

  IF COL_LENGTH('dbo.SignosVitales','fecha_registro') IS NULL
  BEGIN
    PRINT 'Añadiendo columna fecha_registro en SignosVitales';
    ALTER TABLE dbo.SignosVitales ADD fecha_registro DATETIME DEFAULT GETDATE();
  END

  -- crear FK hacia Paciente si no existe
  IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Signos_Paciente')
  BEGIN
    -- verificar que la tabla Paciente exista
    IF OBJECT_ID('dbo.Paciente','U') IS NOT NULL
    BEGIN
      ALTER TABLE dbo.SignosVitales ADD CONSTRAINT FK_Signos_Paciente FOREIGN KEY (id_paciente) REFERENCES dbo.Paciente(id_paciente);
    END
    ELSE
    BEGIN
      PRINT 'Advertencia: la tabla Paciente no existe. No se creó la FK FK_Signos_Paciente.';
    END
  END
END

-- 3) Nota: la migración para agregar id_paciente a NotaMedicaSeguimiento está en scripts/add_id_paciente_to_NotaMedicaSeguimiento.sql
PRINT 'Script fix_schema.sql finalizado.';
