const RolRepository = require('../../domain/repositories/rolRepository');
const { getPool } = require('../../config/db');

class MssqlRolRepository extends RolRepository {
  async create(rol) {
    const pool = await getPool();
    const result = await pool.request()
      .input('nombre_rol', rol.nombre_rol)
      .input('descripcion', rol.descripcion)
      .query(`
        INSERT INTO Rol (nombre_rol, descripcion)
        VALUES (@nombre_rol, @descripcion);
        SELECT SCOPE_IDENTITY() AS id_rol;
      `);
    return result.recordset[0].id_rol;
  }

  async findAll() {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT * FROM Rol`);
    return result.recordset;
  }

  async findById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_rol', id)
      .query(`SELECT * FROM Rol WHERE id_rol = @id_rol`);
    return result.recordset[0] || null;
  }

  async update(id, data) {
    const pool = await getPool();
    await pool.request()
      .input('id_rol', id)
      .input('nombre_rol', data.nombre_rol)
      .input('descripcion', data.descripcion)
      .query(`
        UPDATE Rol SET nombre_rol=@nombre_rol, descripcion=@descripcion WHERE id_rol=@id_rol
      `);
    return true;
  }

  async delete(id) {
    const pool = await getPool();
    await pool.request()
      .input('id_rol', id)
      .query(`DELETE FROM Rol WHERE id_rol = @id_rol`);
    return true;
  }
}
module.exports = MssqlRolRepository;