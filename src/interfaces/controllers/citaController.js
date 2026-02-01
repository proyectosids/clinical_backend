const logger = require('../../shared/logger');

class CitaController {
  constructor(repo) {
    this.repo = repo;
  }

  async create(req, res) {
    try {
      const id = await this.repo.create(req.body);
      res.status(201).json({ id });
    } catch (err) {
      logger.error(`Error al crear cita: ${err.message}`);
      // Si el repositorio indica campos requeridos faltantes, devolver 400 para que el cliente lo corrija
      if (err.message && err.message.startsWith('REQUIRED_FIELDS_MISSING')) {
        return res.status(400).json({ error: err.message.replace('REQUIRED_FIELDS_MISSING: ', '') });
      }
      res.status(500).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const citas = await this.repo.findAll();
      res.json(citas);
    } catch (err) {
      logger.error(`Error al obtener citas: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }
}
module.exports = CitaController;
