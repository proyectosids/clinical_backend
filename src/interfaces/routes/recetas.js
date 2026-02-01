const express = require('express');
const router = express.Router();
const MssqlRecetaRepository = require('../../infrastructure/repositories/MssqlRecetaRepository');
const CreateRecetaUseCase = require('../../application/use-cases/receta/createRecetaUseCase');
const GetRecetasUseCase = require('../../application/use-cases/receta/getRecetasUseCase');
const GetRecetasByPacienteUseCase = require('../../application/use-cases/receta/getRecetasByPacienteUseCase');
const RecetaController = require('../controllers/recetaController');
const { recetaSchema } = require('../../shared/validator');

const recetaRepo = new MssqlRecetaRepository();
const createRecetaUseCase = new CreateRecetaUseCase(recetaRepo);
const getRecetasUseCase = new GetRecetasUseCase(recetaRepo);
const getRecetasByPacienteUseCase = new GetRecetasByPacienteUseCase(recetaRepo);
const recetaController = new RecetaController(recetaRepo);

router.post('/', (req, res, next) => {
  const { error } = recetaSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  recetaController.create(req, res, next);
});
router.get('/', (req, res) => recetaController.getAll(req, res));
router.get('/paciente/:id_paciente', (req, res) => recetaController.getByPaciente(req, res));

module.exports = router;
