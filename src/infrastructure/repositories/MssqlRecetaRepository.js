const RecetaRepository = require('../../domain/repositories/recetaRepository');
const { getPool } = require('../../config/db');

class MssqlRecetaRepository extends RecetaRepository {
  async create(receta) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_paciente', receta.id_paciente)
      .input('id_usuario', receta.id_usuario)
      .input('fecha', receta.fecha)
      .input('medicamentos', receta.medicamentos)
      .input('indicaciones', receta.indicaciones)
      .input('status', receta.status)
      .query(`
        INSERT INTO Receta (id_paciente, id_usuario, fecha, medicamentos, indicaciones, status)
        VALUES (@id_paciente, @id_usuario, @fecha, @medicamentos, @indicaciones, @status);
        SELECT SCOPE_IDENTITY() AS id_receta;
      `);
    return result.recordset[0].id_receta;
  }

  async findAll() {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT * FROM Receta`);
    return result.recordset;
  }

  async findById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_receta', id)
      .query(`SELECT * FROM Receta WHERE id_receta = @id_receta`);
    return result.recordset[0] || null;
  }

  async findByPaciente(id_paciente) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_paciente', id_paciente)
      .query(`SELECT * FROM Receta WHERE id_paciente = @id_paciente`);
    return result.recordset;
  }

  async update(id, data) {
    const pool = await getPool();
    await pool.request()
      .input('id_receta', id)
      .input('id_paciente', data.id_paciente)
      .input('id_usuario', data.id_usuario)
      .input('fecha', data.fecha)
      .input('medicamentos', data.medicamentos)
      .input('indicaciones', data.indicaciones)
      .input('status', data.status)
      .query(`
        UPDATE Receta SET id_paciente=@id_paciente, id_usuario=@id_usuario, fecha=@fecha, medicamentos=@medicamentos, indicaciones=@indicaciones, status=@status WHERE id_receta=@id_receta
      `);
    return true;
  }

  async delete(id) {
    const pool = await getPool();
    await pool.request()
      .input('id_receta', id)
      .query(`DELETE FROM Receta WHERE id_receta = @id_receta`);
    return true;
  }
}
module.exports = MssqlRecetaRepository;
