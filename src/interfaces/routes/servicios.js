const express = require('express');
const router = express.Router();
const MssqlServicioRepository = require('../../infrastructure/repositories/MssqlServicioRepository');
const {
  CreateServicioUseCase,
  GetServiciosUseCase,
  GetServicioByIdUseCase,
  UpdateServicioUseCase,
  DeleteServicioUseCase
} = require('../../application/use-cases/servicio');
const ServicioController = require('../controllers/servicioController');
const { authenticateJWT } = require('../../shared/authMiddleware');

// Inicializar repositorio y casos de uso
const servicioRepo = new MssqlServicioRepository();
const createServicioUseCase = new CreateServicioUseCase(servicioRepo);
const getServiciosUseCase = new GetServiciosUseCase(servicioRepo);
const getServicioByIdUseCase = new GetServicioByIdUseCase(servicioRepo);
const updateServicioUseCase = new UpdateServicioUseCase(servicioRepo);
const deleteServicioUseCase = new DeleteServicioUseCase(servicioRepo);

// Inicializar controlador con todos los casos de uso
const servicioController = new ServicioController(
  createServicioUseCase,
  getServiciosUseCase,
  getServicioByIdUseCase,
  updateServicioUseCase,
  deleteServicioUseCase
);

// Rutas públicas (sin autenticación) - para mostrar servicios en página estática
router.get('/', (req, res) => servicioController.getAll(req, res));
router.get('/:id', (req, res) => servicioController.getById(req, res));

// Rutas protegidas (requieren autenticación) - para panel administrativo
router.post('/', authenticateJWT, (req, res) => servicioController.create(req, res));
router.put('/:id', authenticateJWT, (req, res) => servicioController.update(req, res));
router.delete('/:id', authenticateJWT, (req, res) => servicioController.delete(req, res));

module.exports = router;
