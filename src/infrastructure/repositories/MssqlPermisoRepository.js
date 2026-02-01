const PermisoRepository = require("../../domain/repositories/permisoRepository");
const Permiso = require("../../domain/entities/permiso");
const { getPool } = require("../../config/db");

class MssqlPermisoRepository extends PermisoRepository {
  async findAll() {
    const pool = await getPool();
    const result = await pool
      .request()
      .query("SELECT id_permiso, nombre_pantalla, descripcion FROM Permiso");
    return result.recordset.map((row) => new Permiso(row));
  }
}

module.exports = MssqlPermisoRepository;
