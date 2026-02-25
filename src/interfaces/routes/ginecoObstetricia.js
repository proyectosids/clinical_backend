const express = require("express");
const router = express.Router();
const MssqlGinecoObstetriciaRepository = require("../../infrastructure/repositories/MssqlGinecoObstetriciaRepository");
const CreateGinecoObstetriciaUseCase = require("../../application/use-cases/ginecoObstetricia/createGinecoObstetriciaUseCase");
const GetGinecoObstetriciasUseCase = require("../../application/use-cases/ginecoObstetricia/getGinecoObstetriciasUseCase");
const GetGinecoObstetriciasByPacienteUseCase = require("../../application/use-cases/ginecoObstetricia/getGinecoObstetriciasByPacienteUseCase");
const GinecoObstetriciaController = require("../controllers/ginecoObstetriciaController");
const { ginecoObstetriciaSchema } = require("../../shared/validator");

const ginecoRepo = new MssqlGinecoObstetriciaRepository();
const createGinecoUseCase = new CreateGinecoObstetriciaUseCase(ginecoRepo);
const getGinecoUseCase = new GetGinecoObstetriciasUseCase(ginecoRepo);
const getGinecoByPacienteUseCase = new GetGinecoObstetriciasByPacienteUseCase(
  ginecoRepo,
);
const ginecoController = new GinecoObstetriciaController(ginecoRepo);

// Crear mediante body (id_paciente en el body)
router.post("/", (req, res, next) => {
  const { error } = ginecoObstetriciaSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  ginecoController.create(req, res, next);
});

// Crear usando el id del paciente en la URL: POST /api/gineco-obstetricia/paciente/:id_paciente
// Esto inyecta el id_paciente en el body y reutiliza la validación existente.
router.post("/paciente/:id_paciente", (req, res, next) => {
  // asegurarse de que el id venga como número
  req.body = Object.assign({}, req.body, {
    id_paciente: parseInt(req.params.id_paciente, 10),
  });
  const { error } = ginecoObstetriciaSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  ginecoController.create(req, res, next);
});
router.get("/", (req, res) => ginecoController.getAll(req, res));
router.get("/paciente/:id_paciente", (req, res) =>
  ginecoController.getByPaciente(req, res),
);

// Obtener por ID
router.get("/:id", (req, res) => ginecoController.getById(req, res));
// Actualizar por ID
router.put("/:id", (req, res) => ginecoController.update(req, res));
// Eliminar por ID
router.delete("/:id", (req, res) => ginecoController.delete(req, res));

module.exports = router;
