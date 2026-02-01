const Permiso = require("../../domain/entities/permiso");

class PermisoController {
  constructor(permisoRepo) {
    this.permisoRepo = permisoRepo;
  }

  async getAll(req, res, next) {
    try {
      const permisos = await this.permisoRepo.findAll();
      res.json(permisos);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PermisoController;
