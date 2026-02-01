const logger = require('../../shared/logger');
const {
  CreateGinecoObstetriciaUseCase,
  GetGinecoObstetriciasUseCase,
  GetGinecoObstetriciaByIdUseCase,
  GetGinecoObstetriciasByPacienteUseCase,
  UpdateGinecoObstetriciaUseCase,
  DeleteGinecoObstetriciaUseCase
} = require('../../application/use-cases/ginecoObstetricia');

class GinecoObstetriciaController {
  constructor(repo) {
    this.repo = repo;
    this.createUseCase = new CreateGinecoObstetriciaUseCase(repo);
    this.getAllUseCase = new GetGinecoObstetriciasUseCase(repo);
    this.getByIdUseCase = new GetGinecoObstetriciaByIdUseCase(repo);
    this.getByPacienteUseCase = new GetGinecoObstetriciasByPacienteUseCase(repo);
    this.updateUseCase = new UpdateGinecoObstetriciaUseCase(repo);
    this.deleteUseCase = new DeleteGinecoObstetriciaUseCase(repo);
  }

  async create(req, res) {
    try {
      const id = await this.createUseCase.execute(req.body);
      res.status(201).json({ id });
    } catch (err) {
      logger.error(`Error al crear gineco-obstetricia: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const ginecos = await this.getAllUseCase.execute();
      res.json(ginecos);
    } catch (err) {
      logger.error(`Error al obtener gineco-obstetricia: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const gineco = await this.getByIdUseCase.execute(req.params.id);
      res.json(gineco);
    } catch (err) {
      logger.error(`Error al obtener gineco-obstetricia por id: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getByPaciente(req, res) {
    try {
      const ginecos = await this.getByPacienteUseCase.execute(req.params.id_paciente);
      res.json(ginecos);
    } catch (err) {
      logger.error(`Error al obtener gineco-obstetricia por paciente: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      await this.updateUseCase.execute(req.params.id, req.body);
      res.json({ success: true });
    } catch (err) {
      logger.error(`Error al actualizar gineco-obstetricia: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await this.deleteUseCase.execute(req.params.id);
      res.json({ success: true });
    } catch (err) {
      logger.error(`Error al eliminar gineco-obstetricia: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }
}
module.exports = GinecoObstetriciaController;
