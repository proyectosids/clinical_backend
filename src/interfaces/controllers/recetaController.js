const logger = require('../../shared/logger');
const {
  CreateRecetaUseCase,
  GetRecetasUseCase,
  GetRecetaByIdUseCase,
  GetRecetasByPacienteUseCase,
  UpdateRecetaUseCase,
  DeleteRecetaUseCase
} = require('../../application/use-cases/receta');

class RecetaController {
  constructor(repo) {
    this.repo = repo;
    this.createUseCase = new CreateRecetaUseCase(repo);
    this.getAllUseCase = new GetRecetasUseCase(repo);
    this.getByIdUseCase = new GetRecetaByIdUseCase(repo);
    this.getByPacienteUseCase = new GetRecetasByPacienteUseCase(repo);
    this.updateUseCase = new UpdateRecetaUseCase(repo);
    this.deleteUseCase = new DeleteRecetaUseCase(repo);
  }

  async create(req, res) {
    try {
      const id = await this.createUseCase.execute(req.body);
      res.status(201).json({ id });
    } catch (err) {
      logger.error(`Error al crear receta: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const recetas = await this.getAllUseCase.execute();
      res.json(recetas);
    } catch (err) {
      logger.error(`Error al obtener recetas: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const receta = await this.getByIdUseCase.execute(req.params.id);
      res.json(receta);
    } catch (err) {
      logger.error(`Error al obtener receta por id: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getByPaciente(req, res) {
    try {
      const recetas = await this.getByPacienteUseCase.execute(req.params.id_paciente);
      res.json(recetas);
    } catch (err) {
      logger.error(`Error al obtener recetas por paciente: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      await this.updateUseCase.execute(req.params.id, req.body);
      res.json({ success: true });
    } catch (err) {
      logger.error(`Error al actualizar receta: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await this.deleteUseCase.execute(req.params.id);
      res.json({ success: true });
    } catch (err) {
      logger.error(`Error al eliminar receta: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }
}
module.exports = RecetaController;
