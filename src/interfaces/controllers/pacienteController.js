const logger = require("../../shared/logger.js");
class PacienteController {
  async create(req, res) {
    try {
      const id = await this.createUseCase.execute(req.body);
      res.status(201).json({ id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      logger.info("Solicitud GET /api/pacientes recibida");
      const pacientes = await this.getUseCase.execute();
      logger.info(`Pacientes obtenidos: ${pacientes.length}`);
      res.json(pacientes);
    } catch (err) {
      logger.error(`Error al obtener pacientes: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }
  async getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
      const paciente = await this.repo.findById(id);
      if (!paciente) {
        return res.status(404).json({ error: "Paciente no encontrado" });
      }
      res.json(paciente);
    } catch (err) {
      logger.error(`Error al obtener paciente por ID: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
      const data = req.body;
      if (typeof data.status === "undefined") data.status = 1;
      const ok = await this.repo.update(id, data);
      if (!ok) {
        return res.status(404).json({ error: "Paciente no encontrado" });
      }
      res.json({ success: true });
    } catch (err) {
      logger.error(`Error al actualizar paciente: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
      const ok = await this.repo.delete(id);
      if (!ok) {
        return res.status(404).json({ error: "Paciente no encontrado" });
      }
      res.json({ success: true, message: "Paciente dado de baja (status=0)" });
    } catch (err) {
      logger.error(`Error al eliminar paciente: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }
  constructor(createUseCase, getUseCase, repo) {
    this.createUseCase = createUseCase;
    this.getUseCase = getUseCase;
    this.repo = repo;
  }

  async create(req, res) {
    try {
      const id = await this.createUseCase.execute(req.body);
      res.status(201).json({ id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      logger.info("Solicitud GET /api/pacientes recibida");
      const pacientes = await this.getUseCase.execute();
      logger.info(`Pacientes obtenidos: ${pacientes.length}`);
      res.json(pacientes);
    } catch (err) {
      logger.error(`Error al obtener pacientes: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }
  async getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
      const paciente = await this.repo.findById(id);
      if (!paciente) {
        return res.status(404).json({ error: "Paciente no encontrado" });
      }
      res.json(paciente);
    } catch (err) {
      logger.error(`Error al obtener paciente por ID: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }
}
module.exports = PacienteController;
