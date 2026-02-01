const AntecedenteRepository = require("../../domain/repositories/antecedenteRepository");
const { getPool } = require("../../config/db");

class MssqlAntecedenteRepository extends AntecedenteRepository {
  async create(antecedente) {
    const pool = await getPool();
    const status =
      typeof antecedente.status === "undefined" ? 1 : antecedente.status;
    const result = await pool
      .request()
      .input("id_paciente", antecedente.id_paciente)
      .input("tipo", antecedente.tipo)
      .input("descripcion", antecedente.descripcion)
      .input("status", status).query(`
        INSERT INTO Antecedente (id_paciente, tipo, descripcion, status)
        VALUES (@id_paciente, @tipo, @descripcion, @status);
        SELECT SCOPE_IDENTITY() AS id_antecedente;
      `);
    return result.recordset[0].id_antecedente;
  }

  async findAll() {
    const pool = await getPool();
    const result = await pool
      .request()
      .query(`SELECT * FROM Antecedente WHERE status = 1`);
    return result.recordset;
  }

  async findById(id) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id_antecedente", id)
      .query(
        `SELECT * FROM Antecedente WHERE id_antecedente = @id_antecedente`
      );
    return result.recordset[0] || null;
  }

  async findByPaciente(id_paciente) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id_paciente", id_paciente)
      .query(
        `SELECT * FROM Antecedente WHERE id_paciente = @id_paciente AND status = 1`
      );
    return result.recordset;
  }

  async update(id, data) {
    const pool = await getPool();
    await pool
      .request()
      .input("id_antecedente", id)
      .input("tipo", data.tipo)
      .input("descripcion", data.descripcion)
      .input("status", data.status).query(`
        UPDATE Antecedente SET tipo=@tipo, descripcion=@descripcion, status=@status WHERE id_antecedente=@id_antecedente
      `);
    return true;
  }

  async delete(id) {
    const pool = await getPool();
    await pool
      .request()
      .input("id_antecedente", id)
      .query(`DELETE FROM Antecedente WHERE id_antecedente = @id_antecedente`);
    return true;
  }
}
module.exports = MssqlAntecedenteRepository;
