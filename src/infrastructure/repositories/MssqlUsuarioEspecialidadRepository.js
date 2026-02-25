const { getPool } = require("../../config/db");

class MssqlUsuarioEspecialidadRepository {
  async add(id_usuario, id_especialidad) {
    const pool = await getPool();
    await pool
      .request()
      .input("id_usuario", id_usuario)
      .input("id_especialidad", id_especialidad)
      .query(
        "INSERT INTO usuarioEspecialidad (id_usuario, id_especialidad) VALUES (@id_usuario, @id_especialidad)",
      );
    return true;
  }

  async addMany(id_usuario, especialidades = []) {
    if (!Array.isArray(especialidades) || especialidades.length === 0)
      return true;
    const pool = await getPool();
    const transaction = new (require("mssql").Transaction)(pool);
    await transaction.begin();
    try {
      const trReq = transaction.request();
      for (let i = 0; i < especialidades.length; i++) {
        trReq.input(`id_usuario_${i}`, id_usuario);
        trReq.input(`id_especialidad_${i}`, especialidades[i]);
        await trReq.query(
          `INSERT INTO usuarioEspecialidad (id_usuario, id_especialidad) VALUES (@id_usuario_${i}, @id_especialidad_${i})`,
        );
      }
      await transaction.commit();
      return true;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async findByUser(id_usuario) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id_usuario", id_usuario)
      .query(
        `SELECT ue.id_usuario, ue.id_especialidad, e.nombre_esp FROM usuarioEspecialidad ue JOIN Especialidad e ON ue.id_especialidad = e.id_especialidad WHERE ue.id_usuario = @id_usuario`,
      );
    return result.recordset;
  }

  async remove(id_usuario, id_especialidad) {
    const pool = await getPool();
    await pool
      .request()
      .input("id_usuario", id_usuario)
      .input("id_especialidad", id_especialidad)
      .query(
        "DELETE FROM usuarioEspecialidad WHERE id_usuario = @id_usuario AND id_especialidad = @id_especialidad",
      );
    return true;
  }

  async removeAll(id_usuario) {
    const pool = await getPool();
    await pool
      .request()
      .input("id_usuario", id_usuario)
      .query("DELETE FROM usuarioEspecialidad WHERE id_usuario = @id_usuario");
    return true;
  }
}

module.exports = MssqlUsuarioEspecialidadRepository;
