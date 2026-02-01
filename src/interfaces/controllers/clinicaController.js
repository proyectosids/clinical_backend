const logger = require('../../shared/logger');

class ClinicaController {
  constructor(repo) {
    this.repo = repo;
  }

  async create(req, res) {
    try {
      const id = await this.repo.create(req.body);
      res.status(201).json({ id });
    } catch (err) {
      logger.error(`Error al crear clinica: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const clinicas = await this.repo.findAll();
      res.json(clinicas);
    } catch (err) {
      logger.error(`Error al obtener clinicas: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }
}
module.exports = ClinicaController;
