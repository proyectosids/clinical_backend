-- Migration: Añadir columna id_paciente a NotaMedicaSeguimiento y crear FK hacia Paciente
-- Seguridad: ejecutar en entorno de pruebas primero; hacer BACKUP antes de ejecutar en producción.

SET NOCOUNT ON;

BEGIN TRY
	BEGIN TRANSACTION;

	-- 1) Añadir columna id_paciente si no existe (nullable inicialmente)
	IF COL_LENGTH('dbo.NotaMedicaSeguimiento','id_paciente') IS NULL
	BEGIN
		ALTER TABLE dbo.NotaMedicaSeguimiento ADD id_paciente INT NULL;
	END

	-- 2) Backfill: poblar id_paciente desde la tabla Cita (join por id_cita)
	-- Usar SQL dinámico para evitar errores de resolución de nombres en el mismo batch
	DECLARE @backfill_sql NVARCHAR(MAX) = N'
UPDATE dbo.NotaMedicaSeguimiento
SET id_paciente = c.id_paciente
FROM dbo.NotaMedicaSeguimiento
INNER JOIN dbo.Cita c ON dbo.NotaMedicaSeguimiento.id_cita = c.id_cita
WHERE dbo.NotaMedicaSeguimiento.id_paciente IS NULL AND c.id_paciente IS NOT NULL;
';
	EXEC sp_executesql @backfill_sql;

	-- 3) (Opcional) limpiar referencias inválidas: si hay id_paciente que no existen en Paciente
	--    Puedes revisar con la consulta siguiente antes de forzar cambios:
	-- SELECT DISTINCT n.id_paciente FROM dbo.NotaMedicaSeguimiento n LEFT JOIN dbo.Paciente p ON n.id_paciente = p.id_paciente WHERE n.id_paciente IS NOT NULL AND p.id_paciente IS NULL;
	-- Si aparecen filas, resolver manualmente o setear a NULL:
	-- UPDATE dbo.NotaMedicaSeguimiento SET id_paciente = NULL WHERE id_paciente IN ( ... );

	-- 4) Crear índice en id_paciente si no existe (mejorará consultas por paciente)
	IF NOT EXISTS (
		SELECT 1 FROM sys.indexes WHERE name = 'IX_NotaMedicaSeguimiento_id_paciente' AND object_id = OBJECT_ID('dbo.NotaMedicaSeguimiento')
	)
	BEGIN
		CREATE INDEX IX_NotaMedicaSeguimiento_id_paciente ON dbo.NotaMedicaSeguimiento(id_paciente);
	END

	-- 5) Agregar FK hacia Paciente si no existe
	IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Nota_Paciente')
	BEGIN
		ALTER TABLE dbo.NotaMedicaSeguimiento
			ADD CONSTRAINT FK_Nota_Paciente FOREIGN KEY (id_paciente) REFERENCES dbo.Paciente(id_paciente);
	END

	COMMIT TRANSACTION;
	PRINT 'Migración completada correctamente.';
END TRY
BEGIN CATCH
	ROLLBACK TRANSACTION;
	DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
	DECLARE @ErrNum INT = ERROR_NUMBER();
	PRINT 'Error en migración: ' + COALESCE(CAST(@ErrNum AS NVARCHAR(10)), '') + ' - ' + @ErrMsg;
	THROW;
END CATCH;

/*
Post-migration (opcional): después de verificar que no quedan NULLs en id_paciente, puedes volver
la columna a NOT NULL con:

-- Verificar que no queden NULLs
SELECT COUNT(1) AS NullCount FROM dbo.NotaMedicaSeguimiento WHERE id_paciente IS NULL;

-- Si NullCount = 0, hacer (en ventana de mantenimiento):
ALTER TABLE dbo.NotaMedicaSeguimiento ALTER COLUMN id_paciente INT NOT NULL;

*/

