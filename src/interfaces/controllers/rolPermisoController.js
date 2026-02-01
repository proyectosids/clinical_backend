const Permiso = require("../../domain/entities/permiso");

class RolPermisoController {
  constructor(rolPermisoRepo) {
    this.rolPermisoRepo = rolPermisoRepo;
  }

  // GET /api/roles/:id/permisos
  async getPermisosByRol(req, res, next) {
    try {
      const id_rol = parseInt(req.params.id);
      const permisos = await this.rolPermisoRepo.getPermisosByRol(id_rol);
      res.json(permisos);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/roles/:id/permisos
  async updatePermisosByRol(req, res, next) {
    try {
      const id_rol = parseInt(req.params.id);
      const permisos = req.body; // [{id_permiso, permitido}, ...]
      await this.rolPermisoRepo.updatePermisosByRol(id_rol, permisos);
      res.json({ success: true, message: "Permisos actualizados" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RolPermisoController;
