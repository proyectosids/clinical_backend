const logger = require('../../shared/logger');

class EspecialidadController {
  constructor(repo) {
    this.repo = repo;
  }

  async create(req, res) {
    try {
      const id = await this.repo.create(req.body);
      res.status(201).json({ id });
    } catch (err) {
      logger.error(`Error al crear especialidad: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const especialidades = await this.repo.findAll();
      res.json(especialidades);
    } catch (err) {
      logger.error(`Error al obtener especialidades: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }
}
module.exports = EspecialidadController;
