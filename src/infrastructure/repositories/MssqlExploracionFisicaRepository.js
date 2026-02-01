const ExploracionFisicaRepository = require('../../domain/repositories/exploracionFisicaRepository');
const { getPool } = require('../../config/db');

class MssqlExploracionFisicaRepository extends ExploracionFisicaRepository {
  async create(exploracion) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_paciente', exploracion.id_paciente)
      .input('fecha', exploracion.fecha)
      .input('hallazgos', exploracion.hallazgos)
      .input('observaciones', exploracion.observaciones)
      .input('status', exploracion.status)
      .query(`
        INSERT INTO ExploracionFisica (id_paciente, fecha, hallazgos, observaciones, status)
        VALUES (@id_paciente, @fecha, @hallazgos, @observaciones, @status);
        SELECT SCOPE_IDENTITY() AS id_exploracion;
      `);
    return result.recordset[0].id_exploracion;
  }

  async findAll() {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT * FROM ExploracionFisica`);
    return result.recordset;
  }

  async findById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_exploracion', id)
      .query(`SELECT * FROM ExploracionFisica WHERE id_exploracion = @id_exploracion`);
    return result.recordset[0] || null;
  }

  async findByPaciente(id_paciente) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_paciente', id_paciente)
      .query(`SELECT * FROM ExploracionFisica WHERE id_paciente = @id_paciente`);
    return result.recordset;
  }

  async update(id, data) {
    const pool = await getPool();
    await pool.request()
      .input('id_exploracion', id)
      .input('id_paciente', data.id_paciente)
      .input('fecha', data.fecha)
      .input('hallazgos', data.hallazgos)
      .input('observaciones', data.observaciones)
      .input('status', data.status)
      .query(`
        UPDATE ExploracionFisica SET id_paciente=@id_paciente, fecha=@fecha, hallazgos=@hallazgos, observaciones=@observaciones, status=@status WHERE id_exploracion=@id_exploracion
      `);
    return true;
  }

  async delete(id) {
    const pool = await getPool();
    await pool.request()
      .input('id_exploracion', id)
      .query(`DELETE FROM ExploracionFisica WHERE id_exploracion = @id_exploracion`);
    return true;
  }
}
module.exports = MssqlExploracionFisicaRepository;
