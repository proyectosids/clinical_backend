const logger = require('../../shared/logger');
const {
  CreateNotaMedicaSeguimientoUseCase,
  GetNotasMedicasSeguimientoUseCase,
  GetNotaMedicaSeguimientoByIdUseCase,
  GetNotasMedicasSeguimientoByPacienteUseCase,
  UpdateNotaMedicaSeguimientoUseCase,
  DeleteNotaMedicaSeguimientoUseCase
} = require('../../application/use-cases/notaMedicaSeguimiento');

class NotaMedicaSeguimientoController {
  constructor(repo) {
    this.repo = repo;
    this.createUseCase = new CreateNotaMedicaSeguimientoUseCase(repo);
    this.getAllUseCase = new GetNotasMedicasSeguimientoUseCase(repo);
    this.getByIdUseCase = new GetNotaMedicaSeguimientoByIdUseCase(repo);
    this.getByPacienteUseCase = new GetNotasMedicasSeguimientoByPacienteUseCase(repo);
    this.updateUseCase = new UpdateNotaMedicaSeguimientoUseCase(repo);
    this.deleteUseCase = new DeleteNotaMedicaSeguimientoUseCase(repo);
  }

  async create(req, res) {
    try {
      const id = await this.createUseCase.execute(req.body);
      res.status(201).json({ id });
    } catch (err) {
      logger.error(`Error al crear nota médica de seguimiento: ${err.message}`);
      // Si el repositorio lanzó el error de id_paciente ausente, devolver 400 para que el cliente lo corrija
      if (err.message && err.message.includes('No se pudo determinar id_paciente')) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const notas = await this.getAllUseCase.execute();
      res.json(notas);
    } catch (err) {
      logger.error(`Error al obtener notas médicas de seguimiento: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const nota = await this.getByIdUseCase.execute(req.params.id);
      res.json(nota);
    } catch (err) {
      logger.error(`Error al obtener nota médica de seguimiento por id: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getByPaciente(req, res) {
    try {
      const notas = await this.getByPacienteUseCase.execute(req.params.id_paciente);
      res.json(notas);
    } catch (err) {
      logger.error(`Error al obtener notas médicas de seguimiento por paciente: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      await this.updateUseCase.execute(req.params.id, req.body);
      res.json({ success: true });
    } catch (err) {
      logger.error(`Error al actualizar nota médica de seguimiento: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await this.deleteUseCase.execute(req.params.id);
      res.json({ success: true });
    } catch (err) {
      logger.error(`Error al eliminar nota médica de seguimiento: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }
}
module.exports = NotaMedicaSeguimientoController;
