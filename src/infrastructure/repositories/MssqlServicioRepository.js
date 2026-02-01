const ServicioRepository = require('../../domain/repositories/servicioRepository');
const { getPool } = require('../../config/db');

class MssqlServicioRepository extends ServicioRepository {
  async create(servicio) {
    const pool = await getPool();
    const result = await pool.request()
      .input('nombre_servicio', servicio.nombre_servicio)
      .input('descripcion', servicio.descripcion)
      .input('costo', servicio.costo)
      .input('horario', servicio.horario)
      .input('url_imagen', servicio.url_imagen)
      .input('status', servicio.status)
      .query(`
        INSERT INTO Servicio (nombre_servicio, descripcion, costo, horario, url_imagen, status)
        VALUES (@nombre_servicio, @descripcion, @costo, @horario, @url_imagen, @status);
        SELECT SCOPE_IDENTITY() AS id_servicio;
      `);
    return result.recordset[0].id_servicio;
  }

  async findAll() {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT * FROM Servicio`);
    return result.recordset;
  }

  async findById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_servicio', id)
      .query(`SELECT * FROM Servicio WHERE id_servicio = @id_servicio`);
    return result.recordset[0] || null;
  }

  async update(id, data) {
    const pool = await getPool();
    await pool.request()
      .input('id_servicio', id)
      .input('nombre_servicio', data.nombre_servicio)
      .input('descripcion', data.descripcion)
      .input('costo', data.costo)
      .input('horario', data.horario)
      .input('url_imagen', data.url_imagen)
      .input('status', data.status)
      .query(`
        UPDATE Servicio 
        SET nombre_servicio=@nombre_servicio, 
            descripcion=@descripcion, 
            costo=@costo, 
            horario=@horario, 
            url_imagen=@url_imagen, 
            status=@status,
            actualizado_en=GETDATE()
        WHERE id_servicio=@id_servicio
      `);
    return true;
  }

  async delete(id) {
    const pool = await getPool();
    await pool.request()
      .input('id_servicio', id)
      .query(`DELETE FROM Servicio WHERE id_servicio = @id_servicio`);
    return true;
  }
}
module.exports = MssqlServicioRepository;
