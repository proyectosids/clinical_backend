const express = require('express');
const router = express.Router();
const MssqlCitaRepository = require('../../infrastructure/repositories/MssqlCitaRepository');
const CreateCitaUseCase = require('../../application/use-cases/cita/createCitaUseCase');
const GetCitasUseCase = require('../../application/use-cases/cita/getCitasUseCase');
const CitaController = require('../controllers/citaController');

const citaRepo = new MssqlCitaRepository();
const createCitaUseCase = new CreateCitaUseCase(citaRepo);
const getCitasUseCase = new GetCitasUseCase(citaRepo);
const citaController = new CitaController(citaRepo);

router.post('/', (req, res) => citaController.create(req, res));
// Helper: crear cita buscando un Horario disponible y reservándolo
router.post('/crear-con-horario', async (req, res) => {
	const { id_paciente, id_medico, id_servicio, fecha, hora, id_profesional } = req.body || {};
	if (!id_medico || !id_servicio || !fecha || !hora) {
		return res.status(400).json({ error: 'Faltan campos requeridos: id_medico, id_servicio, fecha, hora' });
	}
	try {
		const { getPool } = require('../../config/db');
		const pool = await getPool();
		// Detectar la columna de hora en Horario (hora o hora_inicio)
		const horaColRes = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Horario' AND COLUMN_NAME IN ('hora','hora_inicio')");
		const horaCol = (horaColRes.recordset && horaColRes.recordset[0] && horaColRes.recordset[0].COLUMN_NAME) || 'hora';
		// Detectar la columna de profesional en la tabla Cita
		const colsRes = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cita' AND COLUMN_NAME IN ('id_medico','id_profesional','id_usuario')");
		const profCol = (colsRes.recordset && colsRes.recordset[0] && colsRes.recordset[0].COLUMN_NAME) || 'id_profesional';
		// Detectar si Cita tiene id_clinica
		const hasClinicaRes = await pool.request().query("SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cita' AND COLUMN_NAME = 'id_clinica'");
		const hasIdClinica = !!(hasClinicaRes.recordset && hasClinicaRes.recordset.length);
		const transaction = new (require('mssql').Transaction)(pool);
		await transaction.begin();
		try {
			const trReq = transaction.request();
			// Buscar un horario disponible exacto
			const horarioQuery = `SELECT TOP 1 * FROM Horario WHERE id_medico = @id_medico AND id_servicio = @id_servicio AND fecha = @fecha AND ${horaCol} = @hora AND status = 1`;
			const horarioRes = await trReq
				.input('id_medico', id_medico)
				.input('id_servicio', id_servicio)
				.input('fecha', fecha)
				.input('hora', hora)
				.query(horarioQuery);
			const horario = horarioRes.recordset && horarioRes.recordset[0];
			if (!horario) {
				await transaction.rollback();
				return res.status(404).json({ error: 'No hay horario disponible en la fecha/hora solicitada' });
			}
			// Reservar horario (marcar status = 2 reservado)
			await trReq.input('id_horario', horario.id_horario).query(`UPDATE Horario SET status = 2, id_cita = NULL WHERE id_horario = @id_horario`);
			// Construir INSERT a Cita dinámico (incluir id_clinica si existe en tabla Cita)
			const insertCols = ['id_paciente','id_horario'];
			const insertVals = ['@id_paciente','@id_horario'];
			if (hasIdClinica) { insertCols.push('id_clinica'); insertVals.push('@id_clinica'); }
			insertCols.push('id_servicio','' + profCol + '', 'fecha_cita','hora_cita','id_estado_cita');
			insertVals.push('@id_servicio','@id_profesional','@fecha_cita','@hora_cita','@id_estado_cita');
			const insertSql = `INSERT INTO Cita (${insertCols.join(', ')}) VALUES (${insertVals.join(', ')}); SELECT SCOPE_IDENTITY() AS id_cita;`;
			const insertReq = trReq.input('id_paciente', id_paciente || null).input('id_horario', horario.id_horario).input('id_servicio', id_servicio).input('id_profesional', id_profesional || id_medico || null).input('fecha_cita', fecha).input('hora_cita', hora).input('id_estado_cita', 1);
			if (hasIdClinica) insertReq.input('id_clinica', horario.id_clinica || null);
			const insertRes = await insertReq.query(insertSql);
			const id_cita = insertRes.recordset && insertRes.recordset[0] && insertRes.recordset[0].id_cita;
			// Actualizar horario para asociar la cita y marcar reservado
			await trReq.input('id_horario', horario.id_horario).input('id_cita', id_cita).query(`UPDATE Horario SET status = 2, id_cita = @id_cita WHERE id_horario = @id_horario`);
			await transaction.commit();
			return res.status(201).json({ id: id_cita });
		} catch (err) {
			await transaction.rollback();
			throw err;
		}
	} catch (err) {
		console.error('Error helper crear-con-horario:', err.message || err);
		return res.status(500).json({ error: err.message || 'Error interno' });
	}
});
router.get('/', (req, res) => citaController.getAll(req, res));

module.exports = router;
