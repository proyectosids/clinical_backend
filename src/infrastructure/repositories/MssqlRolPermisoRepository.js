const RolPermisoRepository = require("../../domain/repositories/rolPermisoRepository");
const Permiso = require("../../domain/entities/permiso");
const { getPool } = require("../../config/db");

class MssqlRolPermisoRepository extends RolPermisoRepository {
  // Devuelve todos los permisos con el campo permitido para el rol
  async getPermisosByRol(id_rol) {
    const pool = await getPool();
    const result = await pool.request().input("id_rol", id_rol).query(`
        SELECT p.id_permiso, p.nombre_pantalla, p.descripcion,
               ISNULL(rp.permitido, 0) AS permitido
        FROM Permiso p
        LEFT JOIN RolPermiso rp ON p.id_permiso = rp.id_permiso AND rp.id_rol = @id_rol
        ORDER BY p.id_permiso
      `);
    return result.recordset.map((row) => new Permiso(row));
  }

  // Actualiza los permisos de un rol
  async updatePermisosByRol(id_rol, permisos) {
    const pool = await getPool();
    // Elimina todos los permisos actuales del rol
    await pool
      .request()
      .input("id_rol", id_rol)
      .query("DELETE FROM RolPermiso WHERE id_rol = @id_rol");
    // Inserta los nuevos permisos
    for (const p of permisos) {
      await pool
        .request()
        .input("id_rol", id_rol)
        .input("id_permiso", p.id_permiso)
        .input("permitido", p.permitido ? 1 : 0)
        .query(
          "INSERT INTO RolPermiso (id_rol, id_permiso, permitido) VALUES (@id_rol, @id_permiso, @permitido)"
        );
    }
  }
}

module.exports = MssqlRolPermisoRepository;
