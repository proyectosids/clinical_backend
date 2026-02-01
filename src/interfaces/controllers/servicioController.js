const logger = require('../../shared/logger');
const Servicio = require('../../domain/entities/servicio');

class ServicioController {
  constructor(createUseCase, getServiciosUseCase, getServicioByIdUseCase, updateUseCase, deleteUseCase) {
    this.createUseCase = createUseCase;
    this.getServiciosUseCase = getServiciosUseCase;
    this.getServicioByIdUseCase = getServicioByIdUseCase;
    this.updateUseCase = updateUseCase;
    this.deleteUseCase = deleteUseCase;
  }

  async create(req, res) {
    try {
      // Validar datos requeridos
      const { nombre_servicio, costo } = req.body;
      if (!nombre_servicio || !costo) {
        return res.status(400).json({ 
          success: false,
          error: 'Los campos nombre_servicio y costo son requeridos' 
        });
      }

      const servicio = new Servicio(req.body);
      const id = await this.createUseCase.execute(servicio);
      res.status(201).json({ 
        success: true, 
        message: 'Servicio creado exitosamente',
        id 
      });
    } catch (err) {
      logger.error(`Error al crear servicio: ${err.message}`);
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  }

  async getAll(req, res) {
    try {
      const servicios = await this.getServiciosUseCase.execute();
      res.json({ 
        success: true, 
        data: servicios 
      });
    } catch (err) {
      logger.error(`Error al obtener servicios: ${err.message}`);
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const servicio = await this.getServicioByIdUseCase.execute(id);
      res.json({ 
        success: true, 
        data: servicio 
      });
    } catch (err) {
      logger.error(`Error al obtener servicio: ${err.message}`);
      if (err.message === 'Servicio no encontrado') {
        return res.status(404).json({ 
          success: false,
          error: err.message 
        });
      }
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nombre_servicio, costo } = req.body;
      
      if (!nombre_servicio || !costo) {
        return res.status(400).json({ 
          success: false,
          error: 'Los campos nombre_servicio y costo son requeridos' 
        });
      }

      await this.updateUseCase.execute(id, req.body);
      res.json({ 
        success: true, 
        message: 'Servicio actualizado exitosamente' 
      });
    } catch (err) {
      logger.error(`Error al actualizar servicio: ${err.message}`);
      if (err.message === 'Servicio no encontrado') {
        return res.status(404).json({ 
          success: false,
          error: err.message 
        });
      }
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.deleteUseCase.execute(id);
      res.json({ 
        success: true, 
        message: 'Servicio eliminado exitosamente' 
      });
    } catch (err) {
      logger.error(`Error al eliminar servicio: ${err.message}`);
      if (err.message === 'Servicio no encontrado') {
        return res.status(404).json({ 
          success: false,
          error: err.message 
        });
      }
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  }
}
module.exports = ServicioController;
