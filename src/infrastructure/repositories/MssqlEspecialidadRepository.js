const EspecialidadRepository = require('../../domain/repositories/especialidadRepository');
const { getPool } = require('../../config/db');

class MssqlEspecialidadRepository extends EspecialidadRepository {
  async create(especialidad) {
    const pool = await getPool();
    const result = await pool.request()
      .input('nombre_esp', especialidad.nombre_esp)
      .input('cedula_profesional', especialidad.cedula_profesional)
      .input('descripcion', especialidad.descripcion)
      .query(`
        INSERT INTO Especialidad (nombre_esp, cedula_profesional, descripcion)
        VALUES (@nombre_esp, @cedula_profesional, @descripcion);
        SELECT SCOPE_IDENTITY() AS id_especialidad;
      `);
    return result.recordset[0].id_especialidad;
  }

  async findAll() {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT * FROM Especialidad`);
    return result.recordset;
  }

  async findById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_especialidad', id)
      .query(`SELECT * FROM Especialidad WHERE id_especialidad = @id_especialidad`);
    return result.recordset[0] || null;
  }

  async update(id, data) {
    const pool = await getPool();
    await pool.request()
      .input('id_especialidad', id)
      .input('nombre_esp', data.nombre_esp)
      .input('cedula_profesional', data.cedula_profesional)
      .input('descripcion', data.descripcion)
      .query(`
        UPDATE Especialidad SET nombre_esp=@nombre_esp, cedula_profesional=@cedula_profesional, descripcion=@descripcion WHERE id_especialidad=@id_especialidad
      `);
    return true;
  }

  async delete(id) {
    const pool = await getPool();
    await pool.request()
      .input('id_especialidad', id)
      .query(`DELETE FROM Especialidad WHERE id_especialidad = @id_especialidad`);
    return true;
  }
}
module.exports = MssqlEspecialidadRepository;
