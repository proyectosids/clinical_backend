const express = require('express');
const router = express.Router();
const MssqlAntecedenteRepository = require('../../infrastructure/repositories/MssqlAntecedenteRepository');
const CreateAntecedenteUseCase = require('../../application/use-cases/antecedente/createAntecedenteUseCase');
const GetAntecedentesUseCase = require('../../application/use-cases/antecedente/getAntecedentesUseCase');
const GetAntecedentesByPacienteUseCase = require('../../application/use-cases/antecedente/getAntecedentesByPacienteUseCase');
const AntecedenteController = require('../controllers/antecedenteController');

const antecedenteRepo = new MssqlAntecedenteRepository();
const createAntecedenteUseCase = new CreateAntecedenteUseCase(antecedenteRepo);
const getAntecedentesUseCase = new GetAntecedentesUseCase(antecedenteRepo);
const getAntecedentesByPacienteUseCase = new GetAntecedentesByPacienteUseCase(antecedenteRepo);
const antecedenteController = new AntecedenteController(antecedenteRepo);

router.post('/', (req, res) => antecedenteController.create(req, res));
router.get('/', (req, res) => antecedenteController.getAll(req, res));
router.get('/paciente/:id_paciente', (req, res) => antecedenteController.getByPaciente(req, res));

module.exports = router;
