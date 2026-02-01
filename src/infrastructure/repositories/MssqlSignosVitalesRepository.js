const SignosVitalesRepository = require("../../domain/repositories/signosVitalesRepository");
const { getPool } = require("../../config/db");

class MssqlSignosVitalesRepository extends SignosVitalesRepository {
  async create(signos) {
    const pool = await getPool();
    let query, params;
    if (signos.fecha_registro) {
      query = `INSERT INTO SignosVitales (id_paciente, fecha_registro, temperatura, presion_arterial, frecuencia_cardiaca, frecuencia_respiratoria, glucemia, saturacion_oxigeno, peso, talla, imc)
                 VALUES (@id_paciente, @fecha_registro, @temperatura, @presion_arterial, @frecuencia_cardiaca, @frecuencia_respiratoria, @glucemia, @saturacion_oxigeno, @peso, @talla, @imc);
                 SELECT SCOPE_IDENTITY() AS id_signos_vitales;`;
      params = pool
        .request()
        .input("id_paciente", signos.id_paciente)
        .input("fecha_registro", signos.fecha_registro)
        .input("temperatura", signos.temperatura)
        .input("presion_arterial", signos.presion_arterial)
        .input("frecuencia_cardiaca", signos.frecuencia_cardiaca)
        .input("frecuencia_respiratoria", signos.frecuencia_respiratoria)
        .input("glucemia", signos.glucemia)
        .input("saturacion_oxigeno", signos.saturacion_oxigeno)
        .input("peso", signos.peso)
        .input("talla", signos.talla)
        .input("imc", signos.imc);
    } else {
      query = `INSERT INTO SignosVitales (id_paciente, temperatura, presion_arterial, frecuencia_cardiaca, frecuencia_respiratoria, glucemia, saturacion_oxigeno, peso, talla, imc)
                 VALUES (@id_paciente, @temperatura, @presion_arterial, @frecuencia_cardiaca, @frecuencia_respiratoria, @glucemia, @saturacion_oxigeno, @peso, @talla, @imc);
                 SELECT SCOPE_IDENTITY() AS id_signos_vitales;`;
      params = pool
        .request()
        .input("id_paciente", signos.id_paciente)
        .input("temperatura", signos.temperatura)
        .input("presion_arterial", signos.presion_arterial)
        .input("frecuencia_cardiaca", signos.frecuencia_cardiaca)
        .input("frecuencia_respiratoria", signos.frecuencia_respiratoria)
        .input("glucemia", signos.glucemia)
        .input("saturacion_oxigeno", signos.saturacion_oxigeno)
        .input("peso", signos.peso)
        .input("talla", signos.talla)
        .input("imc", signos.imc);
    }
    const result = await params.query(query);
    return result.recordset[0].id_signos_vitales;
  }

  async findAll() {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT * FROM SignosVitales`);
    return result.recordset;
  }

  async findById(id) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id_signos_vitales", id)
      .query(
        "SELECT * FROM SignosVitales WHERE id_signos_vitales = @id_signos_vitales"
      );
    return result.recordset[0] || null;
  }

  async findByPaciente(id_paciente) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id_paciente", id_paciente)
      .query(`SELECT * FROM SignosVitales WHERE id_paciente = @id_paciente`);
    return result.recordset; // No existe id_paciente en la tabla SignosVitales según la estructura actual
    // Si necesitas filtrar por paciente, deberás agregar ese campo en la tabla
  }

  async update(id, data) {
    const pool = await getPool();
    await pool
      .request()
      .input("id_signos_vitales", id)
      .input("temperatura", data.temperatura)
      .input("presion_arterial", data.presion_arterial)
      .input("frecuencia_cardiaca", data.frecuencia_cardiaca)
      .input("frecuencia_respiratoria", data.frecuencia_respiratoria)
      .input("glucemia", data.glucemia)
      .input("saturacion_oxigeno", data.saturacion_oxigeno)
      .input("peso", data.peso)
      .input("talla", data.talla)
      .input("imc", data.imc)
      .query(
        "UPDATE SignosVitales SET temperatura=@temperatura, presion_arterial=@presion_arterial, frecuencia_cardiaca=@frecuencia_cardiaca, frecuencia_respiratoria=@frecuencia_respiratoria, glucemia=@glucemia, saturacion_oxigeno=@saturacion_oxigeno, peso=@peso, talla=@talla, imc=@imc WHERE id_signos_vitales=@id_signos_vitales"
      );
    return true;
  }

  async delete(id) {
    const pool = await getPool();
    await pool
      .request()
      .input("id_signos_vitales", id)
      .query(
        "DELETE FROM SignosVitales WHERE id_signos_vitales = @id_signos_vitales"
      );
    return true;
  }
}
module.exports = MssqlSignosVitalesRepository;
