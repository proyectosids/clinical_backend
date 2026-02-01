const express = require('express');
const router = express.Router();
const MssqlClinicaRepository = require('../../infrastructure/repositories/MssqlClinicaRepository');
const CreateClinicaUseCase = require('../../application/use-cases/clinica/createClinicaUseCase');
const GetClinicasUseCase = require('../../application/use-cases/clinica/getClinicasUseCase');
const ClinicaController = require('../controllers/clinicaController');

const clinicaRepo = new MssqlClinicaRepository();
const createClinicaUseCase = new CreateClinicaUseCase(clinicaRepo);
const getClinicasUseCase = new GetClinicasUseCase(clinicaRepo);
const clinicaController = new ClinicaController(clinicaRepo);

router.post('/', (req, res) => clinicaController.create(req, res));
router.get('/', (req, res) => clinicaController.getAll(req, res));

module.exports = router;
