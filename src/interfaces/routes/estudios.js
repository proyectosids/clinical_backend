const express = require('express');
const router = express.Router();
const MssqlEstudioRepository = require('../../infrastructure/repositories/MssqlEstudioRepository');
const CreateEstudioUseCase = require('../../application/use-cases/estudio/createEstudioUseCase');
const GetEstudiosUseCase = require('../../application/use-cases/estudio/getEstudiosUseCase');
const EstudioController = require('../controllers/estudioController');

const estudioRepo = new MssqlEstudioRepository();
const createEstudioUseCase = new CreateEstudioUseCase(estudioRepo);
const getEstudiosUseCase = new GetEstudiosUseCase(estudioRepo);
const estudioController = new EstudioController(estudioRepo);

router.post('/', (req, res) => estudioController.create(req, res));
router.get('/', (req, res) => estudioController.getAll(req, res));

module.exports = router;
