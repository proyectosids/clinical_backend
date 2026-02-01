const OcupacionRepository = require('../../domain/repositories/ocupacionRepository');
const { getPool } = require('../../config/db');

class MssqlOcupacionRepository extends OcupacionRepository {
  async create(ocupacion) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_especialidad', ocupacion.id_especialidad)
      .input('nombre_ocupacion', ocupacion.nombre_ocupacion)
      .input('cedula_profesional', ocupacion.cedula_profesional)
      .input('institucion_titulacion', ocupacion.institucion_titulacion)
      .input('anio_titulacion', ocupacion.anio_titulacion)
      .input('descripcion', ocupacion.descripcion)
      .query(`
        INSERT INTO Ocupacion (id_especialidad, nombre_ocupacion, cedula_profesional, institucion_titulacion, anio_titulacion, descripcion)
        VALUES (@id_especialidad, @nombre_ocupacion, @cedula_profesional, @institucion_titulacion, @anio_titulacion, @descripcion);
        SELECT SCOPE_IDENTITY() AS id_ocupacion;
      `);
    return result.recordset[0].id_ocupacion;
  }

  async findAll() {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT * FROM Ocupacion`);
    return result.recordset;
  }

  async findById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_ocupacion', id)
      .query(`SELECT * FROM Ocupacion WHERE id_ocupacion = @id_ocupacion`);
    return result.recordset[0] || null;
  }

  async update(id, data) {
    const pool = await getPool();
    await pool.request()
      .input('id_ocupacion', id)
      .input('id_especialidad', data.id_especialidad)
      .input('nombre_ocupacion', data.nombre_ocupacion)
      .input('cedula_profesional', data.cedula_profesional)
      .input('institucion_titulacion', data.institucion_titulacion)
      .input('anio_titulacion', data.anio_titulacion)
      .input('descripcion', data.descripcion)
      .query(`
        UPDATE Ocupacion SET id_especialidad=@id_especialidad, nombre_ocupacion=@nombre_ocupacion, cedula_profesional=@cedula_profesional, institucion_titulacion=@institucion_titulacion, anio_titulacion=@anio_titulacion, descripcion=@descripcion WHERE id_ocupacion=@id_ocupacion
      `);
    return true;
  }

  async delete(id) {
    const pool = await getPool();
    await pool.request()
      .input('id_ocupacion', id)
      .query(`DELETE FROM Ocupacion WHERE id_ocupacion = @id_ocupacion`);
    return true;
  }
}
module.exports = MssqlOcupacionRepository;
