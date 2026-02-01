const logger = require("../../shared/logger");

class ContactoMensajeController {
  constructor(
    createUseCase,
    getAllUseCase,
    getByIdUseCase,
    updateUseCase,
    deleteUseCase
  ) {
    this.createUseCase = createUseCase;
    this.getAllUseCase = getAllUseCase;
    this.getByIdUseCase = getByIdUseCase;
    this.updateUseCase = updateUseCase;
    this.deleteUseCase = deleteUseCase;
  }

  async create(req, res) {
    try {
      const contacto = await this.createUseCase.execute(req.body);
      res.status(201).json({ success: true, data: contacto });
    } catch (err) {
      logger.error(`Error al crear mensaje de contacto: ${err.message}`);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const mensajes = await this.getAllUseCase.execute();
      res.json({ success: true, data: mensajes });
    } catch (err) {
      logger.error(`Error al obtener mensajes de contacto: ${err.message}`);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const mensaje = await this.getByIdUseCase.execute(req.params.id);
      if (!mensaje)
        return res.status(404).json({ success: false, error: "No encontrado" });
      res.json({ success: true, data: mensaje });
    } catch (err) {
      logger.error(`Error al obtener mensaje de contacto: ${err.message}`);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async update(req, res) {
    try {
      const mensaje = await this.updateUseCase.execute(req.params.id, req.body);
      res.json({ success: true, data: mensaje });
    } catch (err) {
      logger.error(`Error al actualizar mensaje de contacto: ${err.message}`);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await this.deleteUseCase.execute(req.params.id);
      res.status(204).end();
    } catch (err) {
      logger.error(`Error al eliminar mensaje de contacto: ${err.message}`);
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = ContactoMensajeController;
