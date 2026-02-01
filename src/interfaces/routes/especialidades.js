const express = require('express');
const router = express.Router();
const MssqlEspecialidadRepository = require('../../infrastructure/repositories/MssqlEspecialidadRepository');
const CreateEspecialidadUseCase = require('../../application/use-cases/especialidad/createEspecialidadUseCase');
const GetEspecialidadesUseCase = require('../../application/use-cases/especialidad/getEspecialidadesUseCase');
const EspecialidadController = require('../controllers/especialidadController');

const especialidadRepo = new MssqlEspecialidadRepository();
const createEspecialidadUseCase = new CreateEspecialidadUseCase(especialidadRepo);
const getEspecialidadesUseCase = new GetEspecialidadesUseCase(especialidadRepo);
const especialidadController = new EspecialidadController(especialidadRepo);

router.post('/', (req, res) => especialidadController.create(req, res));
router.get('/', (req, res) => especialidadController.getAll(req, res));

module.exports = router;
