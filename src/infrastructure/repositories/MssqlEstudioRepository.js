const EstudioRepository = require('../../domain/repositories/estudioRepository');
const { getPool } = require('../../config/db');

class MssqlEstudioRepository extends EstudioRepository {
  async create(estudio) {
    const pool = await getPool();
    const result = await pool.request()
      .input('nombre', estudio.nombre)
      .input('descripcion', estudio.descripcion)
      .input('precio', estudio.precio)
      .input('status', estudio.status)
      .query(`
        INSERT INTO Estudio (nombre, descripcion, precio, status)
        VALUES (@nombre, @descripcion, @precio, @status);
        SELECT SCOPE_IDENTITY() AS id_estudio;
      `);
    return result.recordset[0].id_estudio;
  }

  async findAll() {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT * FROM Estudio`);
    return result.recordset;
  }

  async findById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_estudio', id)
      .query(`SELECT * FROM Estudio WHERE id_estudio = @id_estudio`);
    return result.recordset[0] || null;
  }

  async update(id, data) {
    const pool = await getPool();
    await pool.request()
      .input('id_estudio', id)
      .input('nombre', data.nombre)
      .input('descripcion', data.descripcion)
      .input('precio', data.precio)
      .input('status', data.status)
      .query(`
        UPDATE Estudio SET nombre=@nombre, descripcion=@descripcion, precio=@precio, status=@status WHERE id_estudio=@id_estudio
      `);
    return true;
  }

  async delete(id) {
    const pool = await getPool();
    await pool.request()
      .input('id_estudio', id)
      .query(`DELETE FROM Estudio WHERE id_estudio = @id_estudio`);
    return true;
  }
}
module.exports = MssqlEstudioRepository;
