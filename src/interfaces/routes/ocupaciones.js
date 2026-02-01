const express = require('express');
const router = express.Router();
const MssqlOcupacionRepository = require('../../infrastructure/repositories/MssqlOcupacionRepository');
const CreateOcupacionUseCase = require('../../application/use-cases/ocupacion/createOcupacionUseCase');
const GetOcupacionesUseCase = require('../../application/use-cases/ocupacion/getOcupacionesUseCase');
const OcupacionController = require('../controllers/ocupacionController');

const ocupacionRepo = new MssqlOcupacionRepository();
const createOcupacionUseCase = new CreateOcupacionUseCase(ocupacionRepo);
const getOcupacionesUseCase = new GetOcupacionesUseCase(ocupacionRepo);
const ocupacionController = new OcupacionController(ocupacionRepo);

router.post('/', (req, res) => ocupacionController.create(req, res));
router.get('/', (req, res) => ocupacionController.getAll(req, res));

module.exports = router;
