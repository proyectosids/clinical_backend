const logger = require('../../shared/logger');
const {
  CreateExploracionFisicaUseCase,
  GetExploracionesFisicasUseCase,
  GetExploracionFisicaByIdUseCase,
  GetExploracionesFisicasByPacienteUseCase,
  UpdateExploracionFisicaUseCase,
  DeleteExploracionFisicaUseCase
} = require('../../application/use-cases/exploracionFisica');

class ExploracionFisicaController {
  constructor(repo) {
    this.repo = repo;
    this.createUseCase = new CreateExploracionFisicaUseCase(repo);
    this.getAllUseCase = new GetExploracionesFisicasUseCase(repo);
    this.getByIdUseCase = new GetExploracionFisicaByIdUseCase(repo);
    this.getByPacienteUseCase = new GetExploracionesFisicasByPacienteUseCase(repo);
    this.updateUseCase = new UpdateExploracionFisicaUseCase(repo);
    this.deleteUseCase = new DeleteExploracionFisicaUseCase(repo);
  }

  async create(req, res) {
    try {
      const id = await this.createUseCase.execute(req.body);
      res.status(201).json({ id });
    } catch (err) {
      logger.error(`Error al crear exploración física: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const exploraciones = await this.getAllUseCase.execute();
      res.json(exploraciones);
    } catch (err) {
      logger.error(`Error al obtener exploraciones físicas: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const exploracion = await this.getByIdUseCase.execute(req.params.id);
      res.json(exploracion);
    } catch (err) {
      logger.error(`Error al obtener exploración física por id: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getByPaciente(req, res) {
    try {
      const exploraciones = await this.getByPacienteUseCase.execute(req.params.id_paciente);
      res.json(exploraciones);
    } catch (err) {
      logger.error(`Error al obtener exploraciones físicas por paciente: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      await this.updateUseCase.execute(req.params.id, req.body);
      res.json({ success: true });
    } catch (err) {
      logger.error(`Error al actualizar exploración física: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await this.deleteUseCase.execute(req.params.id);
      res.json({ success: true });
    } catch (err) {
      logger.error(`Error al eliminar exploración física: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }
}
module.exports = ExploracionFisicaController;
