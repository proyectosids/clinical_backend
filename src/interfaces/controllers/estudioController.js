const logger = require('../../shared/logger');

class EstudioController {
  constructor(repo) {
    this.repo = repo;
  }

  async create(req, res) {
    try {
      const id = await this.repo.create(req.body);
      res.status(201).json({ id });
    } catch (err) {
      logger.error(`Error al crear estudio: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const estudios = await this.repo.findAll();
      res.json(estudios);
    } catch (err) {
      logger.error(`Error al obtener estudios: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }
}
module.exports = EstudioController;
