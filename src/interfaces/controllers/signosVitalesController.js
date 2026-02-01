const logger = require('../../shared/logger');
const CreateSignosVitalesUseCase = require('../../application/use-cases/signosVitales/createSignosVitalesUseCase');
const GetSignosVitalesUseCase = require('../../application/use-cases/signosVitales/getSignosVitalesUseCase');
const GetSignosVitalesByIdUseCase = require('../../application/use-cases/signosVitales/getSignosVitalesByIdUseCase');
const GetSignosVitalesByPacienteUseCase = require('../../application/use-cases/signosVitales/getSignosVitalesByPacienteUseCase');
const UpdateSignosVitalesUseCase = require('../../application/use-cases/signosVitales/updateSignosVitalesUseCase');
const DeleteSignosVitalesUseCase = require('../../application/use-cases/signosVitales/deleteSignosVitalesUseCase');

class SignosVitalesController {
  constructor(repo) {
    this.repo = repo;
    this.createUseCase = new CreateSignosVitalesUseCase(repo);
    this.getAllUseCase = new GetSignosVitalesUseCase(repo);
    this.getByIdUseCase = new GetSignosVitalesByIdUseCase(repo);
    this.getByPacienteUseCase = new GetSignosVitalesByPacienteUseCase(repo);
    this.updateUseCase = new UpdateSignosVitalesUseCase(repo);
    this.deleteUseCase = new DeleteSignosVitalesUseCase(repo);
  }

  async create(req, res) {
    try {
      const id = await this.createUseCase.execute(req.body);
      res.status(201).json({ id });
    } catch (err) {
      logger.error(`Error al crear signos vitales: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const signos = await this.getAllUseCase.execute();
      res.json(signos);
    } catch (err) {
      logger.error(`Error al obtener signos vitales: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const signo = await this.getByIdUseCase.execute(req.params.id);
      res.json(signo);
    } catch (err) {
      logger.error(`Error al obtener signos vitales por id: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async getByPaciente(req, res) {
    try {
      const signos = await this.getByPacienteUseCase.execute(req.params.id_paciente);
      res.json(signos);
    } catch (err) {
      logger.error(`Error al obtener signos vitales por paciente: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      await this.updateUseCase.execute(req.params.id, req.body);
      res.json({ success: true });
    } catch (err) {
      logger.error(`Error al actualizar signos vitales: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await this.deleteUseCase.execute(req.params.id);
      res.json({ success: true });
    } catch (err) {
      logger.error(`Error al eliminar signos vitales: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }
}
module.exports = SignosVitalesController;
