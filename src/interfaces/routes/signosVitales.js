const express = require("express");
const router = express.Router();
const MssqlSignosVitalesRepository = require("../../infrastructure/repositories/MssqlSignosVitalesRepository");
const CreateSignosVitalesUseCase = require("../../application/use-cases/signosVitales/createSignosVitalesUseCase");
const GetSignosVitalesUseCase = require("../../application/use-cases/signosVitales/getSignosVitalesUseCase");
const GetSignosVitalesByPacienteUseCase = require("../../application/use-cases/signosVitales/getSignosVitalesByPacienteUseCase");
const SignosVitalesController = require("../controllers/signosVitalesController");
const { signosVitalesSchema } = require("../../shared/validator");

const signosRepo = new MssqlSignosVitalesRepository();
const createSignosUseCase = new CreateSignosVitalesUseCase(signosRepo);
const getSignosUseCase = new GetSignosVitalesUseCase(signosRepo);
const getSignosByPacienteUseCase = new GetSignosVitalesByPacienteUseCase(
  signosRepo
);
const signosController = new SignosVitalesController(signosRepo);

router.post("/", (req, res, next) => {
  const { error } = signosVitalesSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  signosController.create(req, res, next);
});
router.get("/", (req, res) => signosController.getAll(req, res));
router.get("/paciente/:id_paciente", (req, res) =>
  signosController.getByPaciente(req, res)
);

// Obtener signos vitales por ID
router.get("/:id", (req, res) => signosController.getById(req, res));
// Actualizar signos vitales por ID
router.put("/:id", (req, res) => signosController.update(req, res));
// Eliminar signos vitales por ID
router.delete("/:id", (req, res) => signosController.delete(req, res));

module.exports = router;
