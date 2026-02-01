const ClinicaRepository = require('../../domain/repositories/clinicaRepository');
const { getPool } = require('../../config/db');

class MssqlClinicaRepository extends ClinicaRepository {
  async create(clinica) {
    const pool = await getPool();
    const result = await pool.request()
      .input('nombre_marca', clinica.nombre_marca)
      .input('ubicacion', clinica.ubicacion)
      .input('numero_contacto', clinica.numero_contacto)
      .input('email', clinica.email)
      .input('status', clinica.status)
      .query(`
        INSERT INTO Clinica (nombre_marca, ubicacion, numero_contacto, email, status)
        VALUES (@nombre_marca, @ubicacion, @numero_contacto, @email, @status);
        SELECT SCOPE_IDENTITY() AS id_clinica;
      `);
    return result.recordset[0].id_clinica;
  }

  async findAll() {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT * FROM Clinica`);
    return result.recordset;
  }

  async findById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_clinica', id)
      .query(`SELECT * FROM Clinica WHERE id_clinica = @id_clinica`);
    return result.recordset[0] || null;
  }

  async update(id, data) {
    const pool = await getPool();
    await pool.request()
      .input('id_clinica', id)
      .input('nombre_marca', data.nombre_marca)
      .input('ubicacion', data.ubicacion)
      .input('numero_contacto', data.numero_contacto)
      .input('email', data.email)
      .input('status', data.status)
      .query(`
        UPDATE Clinica SET nombre_marca=@nombre_marca, ubicacion=@ubicacion, numero_contacto=@numero_contacto, email=@email, status=@status WHERE id_clinica=@id_clinica
      `);
    return true;
  }

  async delete(id) {
    const pool = await getPool();
    await pool.request()
      .input('id_clinica', id)
      .query(`DELETE FROM Clinica WHERE id_clinica = @id_clinica`);
    return true;
  }
}
module.exports = MssqlClinicaRepository;
