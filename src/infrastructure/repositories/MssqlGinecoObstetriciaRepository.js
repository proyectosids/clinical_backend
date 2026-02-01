const GinecoObstetriciaRepository = require('../../domain/repositories/ginecoObstetriciaRepository');
const { getPool } = require('../../config/db');

class MssqlGinecoObstetriciaRepository extends GinecoObstetriciaRepository {
  async create(gineco) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_paciente', gineco.id_paciente)
      .input('menarca', gineco.menarca)
      .input('fum', gineco.fum)
      .input('ivsa', gineco.ivsa)
      .input('dismenorrea', typeof gineco.dismenorrea !== 'undefined' ? gineco.dismenorrea : 0)
      .input('embarazos', gineco.embarazos)
      .input('partos', gineco.partos)
      .input('cesareas', gineco.cesareas)
      .input('abortos', gineco.abortos)
      .query(`INSERT INTO Gineco_Obstetricia (id_paciente, menarca, fum, ivsa, dismenorrea, embarazos, partos, cesareas, abortos)
              VALUES (@id_paciente, @menarca, @fum, @ivsa, @dismenorrea, @embarazos, @partos, @cesareas, @abortos);
              SELECT SCOPE_IDENTITY() AS id_gineo;`);
    return result.recordset[0].id_gineo;
  }

  async findAll() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Gineco_Obstetricia');
    return result.recordset;
  }

  async findById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_gineo', id)
      .query('SELECT * FROM Gineco_Obstetricia WHERE id_gineo = @id_gineo');
    return result.recordset[0] || null;
  }

  async findByPaciente(id_paciente) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_paciente', id_paciente)
      .query('SELECT * FROM Gineco_Obstetricia WHERE id_paciente = @id_paciente ORDER BY id_gineo DESC');
    return result.recordset;
  }

  async update(id, data) {
    const pool = await getPool();
    await pool.request()
      .input('id_gineo', id)
      .input('menarca', data.menarca)
      .input('fum', data.fum)
      .input('ivsa', data.ivsa)
      .input('dismenorrea', data.dismenorrea)
      .input('embarazos', data.embarazos)
      .input('partos', data.partos)
      .input('cesareas', data.cesareas)
      .input('abortos', data.abortos)
      .query('UPDATE Gineco_Obstetricia SET menarca=@menarca, fum=@fum, ivsa=@ivsa, dismenorrea=@dismenorrea, embarazos=@embarazos, partos=@partos, cesareas=@cesareas, abortos=@abortos WHERE id_gineo=@id_gineo');
    return true;
  }

  async delete(id) {
    const pool = await getPool();
    await pool.request()
      .input('id_gineo', id)
      .query('DELETE FROM Gineco_Obstetricia WHERE id_gineo = @id_gineo');
    return true;
  }
}
module.exports = MssqlGinecoObstetriciaRepository;
