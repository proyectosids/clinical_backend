const logger = require('../../shared/logger');

class AntecedenteController {
  constructor(repo) {
    this.repo = repo;
  }

  async create(req, res) {
    try {
      const id = await this.repo.create(req.body);
      res.status(201).json({ id });
    } catch (err) {
      logger.error(`Error al crear antecedente: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const antecedentes = await this.repo.findAll();
      res.json(antecedentes);
    } catch (err) {
      logger.error(`Error al obtener antecedentes: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getByPaciente(req, res) {
    try {
      const antecedentes = await this.repo.findByPaciente(req.params.id_paciente);
      res.json(antecedentes);
    } catch (err) {
      logger.error(`Error al obtener antecedentes por paciente: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }
}
module.exports = AntecedenteController;
