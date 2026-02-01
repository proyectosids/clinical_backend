const express = require('express');
const router = express.Router();
const MssqlExploracionFisicaRepository = require('../../infrastructure/repositories/MssqlExploracionFisicaRepository');
const CreateExploracionFisicaUseCase = require('../../application/use-cases/exploracionFisica/createExploracionFisicaUseCase');
const GetExploracionesFisicasUseCase = require('../../application/use-cases/exploracionFisica/getExploracionesFisicasUseCase');
const GetExploracionesFisicasByPacienteUseCase = require('../../application/use-cases/exploracionFisica/getExploracionesFisicasByPacienteUseCase');
const ExploracionFisicaController = require('../controllers/exploracionFisicaController');
const { exploracionFisicaSchema } = require('../../shared/validator');

const exploracionRepo = new MssqlExploracionFisicaRepository();
const createExploracionUseCase = new CreateExploracionFisicaUseCase(exploracionRepo);
const getExploracionesUseCase = new GetExploracionesFisicasUseCase(exploracionRepo);
const getExploracionesByPacienteUseCase = new GetExploracionesFisicasByPacienteUseCase(exploracionRepo);
const exploracionController = new ExploracionFisicaController(exploracionRepo);

router.post('/', (req, res, next) => {
  const { error } = exploracionFisicaSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  exploracionController.create(req, res, next);
});
router.get('/', (req, res) => exploracionController.getAll(req, res));
router.get('/paciente/:id_paciente', (req, res) => exploracionController.getByPaciente(req, res));

module.exports = router;
