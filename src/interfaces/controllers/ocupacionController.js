const logger = require('../../shared/logger');

class OcupacionController {
  constructor(repo) {
    this.repo = repo;
  }

  async create(req, res) {
    try {
      const id = await this.repo.create(req.body);
      res.status(201).json({ id });
    } catch (err) {
      logger.error(`Error al crear ocupacion: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const ocupaciones = await this.repo.findAll();
      res.json(ocupaciones);
    } catch (err) {
      logger.error(`Error al obtener ocupaciones: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }
}
module.exports = OcupacionController;
