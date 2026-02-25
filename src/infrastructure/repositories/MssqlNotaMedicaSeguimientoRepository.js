const NotaMedicaSeguimientoRepository = require("../../domain/repositories/notaMedicaSeguimientoRepository");
const { getPool } = require("../../config/db");

class MssqlNotaMedicaSeguimientoRepository extends NotaMedicaSeguimientoRepository {
  async create(nota) {
    const pool = await getPool();

    // If id_paciente is not provided, try to retrieve it from Cita
    let id_paciente = nota.id_paciente || null;
    if (!id_paciente && nota.id_cita) {
      const citaRes = await pool
        .request()
        .input("id_cita", nota.id_cita)
        .query("SELECT id_paciente FROM Cita WHERE id_cita = @id_cita");
      if (citaRes && citaRes.recordset && citaRes.recordset[0]) {
        id_paciente = citaRes.recordset[0].id_paciente;
      }
    }

    // Si después de intentar obtenerlo id_paciente sigue siendo null, abortamos con un error
    // para evitar que la INSERT falle por la restricción NOT NULL en la BD.
    if (!id_paciente) {
      throw new Error(
        `No se pudo determinar id_paciente para la nota. Verifica que la cita (id_cita=${nota.id_cita}) exista y tenga id_paciente.`,
      );
    }

    const result = await pool
      .request()
      .input("id_cita", nota.id_cita)
      .input("id_paciente", id_paciente)
      .input("padecimiento_actual", nota.padecimiento_actual)
      .input("id_signos_vitales", nota.id_signos_vitales)
      .input("id_exploracion_fisica", nota.id_exploracion_fisica)
      .input("id_examen_clinico", nota.id_examen_clinico)
      .input("diagnostico_idx", nota.diagnostico_idx)
      .input("analisis", nota.analisis)
      .input("plan_medico", nota.plan_medico)
      .input("id_solicitud_estudio", nota.id_solicitud_estudio)
      .input("id_receta", nota.id_receta)
      .input("pronostico", nota.pronostico)
      .input("id_profesional", nota.id_profesional)
      .input("fecha_hora_atencion", nota.fecha_hora_atencion).query(`
        INSERT INTO NotaMedicaSeguimiento (id_cita, id_paciente, padecimiento_actual, id_signos_vitales, id_exploracion_fisica, id_examen_clinico, diagnostico_idx, analisis, plan_medico, id_solicitud_estudio, id_receta, pronostico, id_profesional, fecha_hora_atencion)
        VALUES (@id_cita, @id_paciente, @padecimiento_actual, @id_signos_vitales, @id_exploracion_fisica, @id_examen_clinico, @diagnostico_idx, @analisis, @plan_medico, @id_solicitud_estudio, @id_receta, @pronostico, @id_profesional, @fecha_hora_atencion);
        SELECT SCOPE_IDENTITY() AS id_nota_medica_seguimiento;
      `);
    return (
      result.recordset[0] && result.recordset[0].id_nota_medica_seguimiento
    );
  }

  async findAll() {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT n.*, c.id_paciente
      FROM NotaMedicaSeguimiento n
      LEFT JOIN Cita c ON n.id_cita = c.id_cita
      ORDER BY n.fecha_hora_atencion DESC
    `);
    return result.recordset;
  }

  async findById(id) {
    const pool = await getPool();
    const result = await pool.request().input("id_nota_medica_seguimiento", id)
      .query(`
        SELECT n.*, c.id_paciente
        FROM NotaMedicaSeguimiento n
        LEFT JOIN Cita c ON n.id_cita = c.id_cita
        WHERE n.id_nota_medica_seguimiento = @id_nota_medica_seguimiento
      `);
    return result.recordset[0] || null;
  }

  async findByPaciente(id_paciente) {
    const pool = await getPool();
    const result = await pool.request().input("id_paciente", id_paciente)
      .query(`
        SELECT n.* FROM NotaMedicaSeguimiento n
        JOIN Cita c ON n.id_cita = c.id_cita
        WHERE c.id_paciente = @id_paciente
        ORDER BY n.fecha_hora_atencion DESC
      `);
    return result.recordset;
  }

  async update(id, data) {
    const pool = await getPool();

    // If id_paciente provided use it, otherwise try to get from Cita
    let id_paciente = data.id_paciente || null;
    if (!id_paciente && data.id_cita) {
      const citaRes = await pool
        .request()
        .input("id_cita", data.id_cita)
        .query("SELECT id_paciente FROM Cita WHERE id_cita = @id_cita");
      if (citaRes && citaRes.recordset && citaRes.recordset[0]) {
        id_paciente = citaRes.recordset[0].id_paciente;
      }
    }

    await pool
      .request()
      .input("id_nota_medica_seguimiento", id)
      .input("id_cita", data.id_cita)
      .input("id_paciente", id_paciente)
      .input("padecimiento_actual", data.padecimiento_actual)
      .input("id_signos_vitales", data.id_signos_vitales)
      .input("id_exploracion_fisica", data.id_exploracion_fisica)
      .input("id_examen_clinico", data.id_examen_clinico)
      .input("diagnostico_idx", data.diagnostico_idx)
      .input("analisis", data.analisis)
      .input("plan_medico", data.plan_medico)
      .input("id_solicitud_estudio", data.id_solicitud_estudio)
      .input("id_receta", data.id_receta)
      .input("pronostico", data.pronostico)
      .input("id_profesional", data.id_profesional)
      .input("fecha_hora_atencion", data.fecha_hora_atencion).query(`
        UPDATE NotaMedicaSeguimiento SET id_cita=@id_cita, id_paciente=@id_paciente, padecimiento_actual=@padecimiento_actual, id_signos_vitales=@id_signos_vitales, id_exploracion_fisica=@id_exploracion_fisica, id_examen_clinico=@id_examen_clinico, diagnostico_idx=@diagnostico_idx, analisis=@analisis, plan_medico=@plan_medico, id_solicitud_estudio=@id_solicitud_estudio, id_receta=@id_receta, pronostico=@pronostico, id_profesional=@id_profesional, fecha_hora_atencion=@fecha_hora_atencion WHERE id_nota_medica_seguimiento=@id_nota_medica_seguimiento
      `);
    return true;
  }

  async delete(id) {
    const pool = await getPool();
    await pool
      .request()
      .input("id_nota_medica_seguimiento", id)
      .query(
        `DELETE FROM NotaMedicaSeguimiento WHERE id_nota_medica_seguimiento = @id_nota_medica_seguimiento`,
      );
    return true;
  }
}
module.exports = MssqlNotaMedicaSeguimientoRepository;
