const PacienteRepository = require("../../domain/repositories/pacienteRepository");
const { getPool } = require("../../config/db");

class MssqlPacienteRepository extends PacienteRepository {
  async create(paciente) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("nombre", paciente.nombre)
      .input("apellido", paciente.apellido)
      .input("curp_paciente", paciente.curp_paciente)
      .input("fecha_nacimiento", paciente.fecha_nacimiento)
      .input("email", paciente.email).query(`
        INSERT INTO Paciente (nombre, apellido, curp_paciente, fecha_nacimiento, email)
        VALUES (@nombre, @apellido, @curp_paciente, @fecha_nacimiento, @email);
        SELECT SCOPE_IDENTITY() AS id;
      `);
    return result.recordset[0].id;
  }

  async findAllByStatus(status) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("status", status)
      .query(`SELECT * FROM Paciente WHERE status = @status`);
    return result.recordset;
  }

  async findAll() {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT * FROM Paciente`);
    return result.recordset;
  }

  async findById(id) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", id)
      .query(`SELECT * FROM Paciente WHERE id_paciente = @id`);
    return result.recordset[0] || null;
  }

  async update(id, data) {
    const pool = await getPool();
    // Obtener datos actuales
    const result = await pool
      .request()
      .input("id", id)
      .query("SELECT * FROM Paciente WHERE id_paciente = @id");
    // result may be undefined or not contain recordset in tests/mocks
    const actual =
      result && result.recordset && result.recordset[0]
        ? result.recordset[0]
        : {};
    // Combinar datos existentes con los nuevos
    const updated = {
      ...actual,
      ...data,
    };
    await pool
      .request()
      .input("id_paciente", id)
      .input("nombre", updated.nombre)
      .input("apellido", updated.apellido)
      .input("curp_paciente", updated.curp_paciente)
      .input("fecha_nacimiento", updated.fecha_nacimiento)
      .input("numero_contacto", updated.numero_contacto)
      .input("direccion", updated.direccion)
      .input("email", updated.email)
      .input("contacto_emergencia", updated.contacto_emergencia)
      .input("edad", updated.edad)
      .input("genero", updated.genero)
      .input("estado_civil", updated.estado_civil)
      .input("ocupacion", updated.ocupacion)
      .input("tipo_sangre", updated.tipo_sangre)
      .input("alergias", updated.alergias)
      .input("foto_url", updated.foto_url)
      .input("status", updated.status)
      .query(
        `UPDATE Paciente SET nombre=@nombre, apellido=@apellido, curp_paciente=@curp_paciente, fecha_nacimiento=@fecha_nacimiento, numero_contacto=@numero_contacto, direccion=@direccion, email=@email, contacto_emergencia=@contacto_emergencia, edad=@edad, genero=@genero, estado_civil=@estado_civil, ocupacion=@ocupacion, tipo_sangre=@tipo_sangre, alergias=@alergias, foto_url=@foto_url, status=@status WHERE id_paciente=@id_paciente`,
      );
    return true;
  }

  async delete(id) {
    const pool = await getPool();
    await pool
      .request()
      .input("id_paciente", id)
      .query(`UPDATE Paciente SET status = 0 WHERE id_paciente = @id_paciente`);
    return true;
  }
}

module.exports = MssqlPacienteRepository;
