const CitaRepository = require('../../domain/repositories/citaRepository');
const { getPool } = require('../../config/db');

class MssqlCitaRepository extends CitaRepository {
  async create(cita) {
    const pool = await getPool();
    // Detectar esquema real de la tabla Cita consultando INFORMATION_SCHEMA.COLUMNS
    const colsRes = await pool.request()
      .query(`SELECT COLUMN_NAME, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cita'`);
    const columns = new Set((colsRes.recordset || []).map(r => r.COLUMN_NAME));

    // Si la tabla usa el esquema con id_horario (tu DDL), usar esa variante
    const usesHorario = columns.has('id_horario');

    if (usesHorario) {
      // Detectar columnas opcionales
      const hasIdClinica = columns.has('id_clinica');
      const hasMotivoDetalle = columns.has('motivo_detalle');

      // Requeridos según ese esquema: id_horario, id_servicio, fecha (fecha_cita), hora (hora_cita)
      const missing = [];
      if (!cita.id_horario) missing.push('id_horario');
      if (!cita.id_servicio) missing.push('id_servicio');
      if (!cita.fecha) missing.push('fecha (fecha_cita)');
      if (!cita.hora) missing.push('hora (hora_cita)');
      if (hasIdClinica && !cita.id_clinica) missing.push('id_clinica');
      if (missing.length) {
        throw new Error(`REQUIRED_FIELDS_MISSING: faltan campos obligatorios para este esquema de Cita: ${missing.join(', ')}`);
      }

      // Construir INSERT dinámico según columnas existentes
      const insertCols = ['id_paciente', 'id_horario'];
      const insertVals = ['@id_paciente', '@id_horario'];
      if (hasIdClinica) {
        insertCols.push('id_clinica');
        insertVals.push('@id_clinica');
      }
      insertCols.push('id_servicio'); insertVals.push('@id_servicio');
      insertCols.push('id_profesional'); insertVals.push('@id_profesional');
      insertCols.push('fecha_cita'); insertVals.push('@fecha_cita');
      insertCols.push('hora_cita'); insertVals.push('@hora_cita');
      insertCols.push('id_estado_cita'); insertVals.push('@id_estado_cita');
      if (hasMotivoDetalle) { insertCols.push('motivo_detalle'); insertVals.push('@motivo_detalle'); }

      const insertSql = `INSERT INTO Cita (${insertCols.join(', ')}) VALUES (${insertVals.join(', ')}); SELECT SCOPE_IDENTITY() AS id_cita;`;

      const req = pool.request()
        .input('id_paciente', cita.id_paciente || null)
        .input('id_horario', cita.id_horario)
        .input('id_servicio', cita.id_servicio)
        .input('id_profesional', cita.id_profesional || cita.id_usuario || null)
        .input('fecha_cita', cita.fecha)
        .input('hora_cita', cita.hora)
        .input('id_estado_cita', cita.id_estado_cita || null);

      if (hasIdClinica) req.input('id_clinica', cita.id_clinica || null);
      if (hasMotivoDetalle) req.input('motivo_detalle', cita.motivo_detalle || null);

      const result = await req.query(insertSql);
      return result.recordset[0].id_cita;
    }

    // Si no usa horario, intentar el esquema alternativo (id_paciente, fecha, hora, motivo, atendido, id_estudio, id_servicio, id_usuario)
    const result = await pool.request()
      .input('id_paciente', cita.id_paciente)
      .input('fecha', cita.fecha)
      .input('hora', cita.hora)
      .input('motivo', cita.motivo)
      .input('atendido', cita.atendido)
      .input('id_estudio', cita.id_estudio)
      .input('id_servicio', cita.id_servicio)
      .input('id_usuario', cita.id_usuario)
      .query(`
        INSERT INTO Cita (id_paciente, fecha, hora, motivo, atendido, id_estudio, id_servicio, id_usuario)
        VALUES (@id_paciente, @fecha, @hora, @motivo, @atendido, @id_estudio, @id_servicio, @id_usuario);
        SELECT SCOPE_IDENTITY() AS id_cita;
      `);
    return result.recordset[0].id_cita;
  }

  async findAll() {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT * FROM Cita`);
    return result.recordset;
  }

  async findById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_cita', id)
      .query(`SELECT * FROM Cita WHERE id_cita = @id_cita`);
    return result.recordset[0] || null;
  }

  async update(id, data) {
    const pool = await getPool();
    // Detectar esquema actual
    const colsRes = await pool.request()
      .query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cita'`);
    const columns = new Set((colsRes.recordset || []).map(r => r.COLUMN_NAME));
    const usesHorario = columns.has('id_horario');
    const hasIdClinica = columns.has('id_clinica');
    const hasMotivoDetalle = columns.has('motivo_detalle');

    if (!usesHorario) {
      // Legacy schema update
      await pool.request()
        .input('id_cita', id)
        .input('id_paciente', data.id_paciente)
        .input('fecha', data.fecha)
        .input('hora', data.hora)
        .input('motivo', data.motivo)
        .input('atendido', data.atendido)
        .input('id_estudio', data.id_estudio)
        .input('id_servicio', data.id_servicio)
        .input('id_usuario', data.id_usuario)
        .query(`
          UPDATE Cita SET id_paciente=@id_paciente, fecha=@fecha, hora=@hora, motivo=@motivo, atendido=@atendido, id_estudio=@id_estudio, id_servicio=@id_servicio, id_usuario=@id_usuario WHERE id_cita=@id_cita
        `);
      return true;
    }

    // usesHorario branch: update canonical schema
    const updateFields = [ 'id_paciente', 'id_horario' ];
    if (hasIdClinica) updateFields.push('id_clinica');
    updateFields.push('id_servicio', 'id_profesional', 'fecha_cita', 'hora_cita', 'id_estado_cita');
    if (hasMotivoDetalle) updateFields.push('motivo_detalle');

    const setClauses = updateFields.map(f => `${f}=@${f}`).join(', ');
    const sql = `UPDATE Cita SET ${setClauses} WHERE id_cita=@id_cita`;

    const req = pool.request()
      .input('id_cita', id)
      .input('id_paciente', data.id_paciente)
      .input('id_horario', data.id_horario || null)
      .input('id_servicio', data.id_servicio || null)
      .input('id_profesional', data.id_usuario || data.id_profesional || null)
      .input('fecha_cita', data.fecha)
      .input('hora_cita', data.hora)
      .input('id_estado_cita', data.id_estado_cita || null);
    if (hasIdClinica) req.input('id_clinica', data.id_clinica || null);
    if (hasMotivoDetalle) req.input('motivo_detalle', data.motivo_detalle || null);

    await req.query(sql);
    return true;
    return true;
  }

  async delete(id) {
    const pool = await getPool();
    await pool.request()
      .input('id_cita', id)
      .query(`DELETE FROM Cita WHERE id_cita = @id_cita`);
    return true;
  }
}
module.exports = MssqlCitaRepository;
