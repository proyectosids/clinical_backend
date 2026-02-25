const express = require("express");
const router = express.Router();
const MssqlNotaMedicaSeguimientoRepository = require("../../infrastructure/repositories/MssqlNotaMedicaSeguimientoRepository");
const CreateNotaMedicaSeguimientoUseCase = require("../../application/use-cases/notaMedicaSeguimiento/createNotaMedicaSeguimientoUseCase");
const GetNotasMedicasSeguimientoUseCase = require("../../application/use-cases/notaMedicaSeguimiento/getNotasMedicasSeguimientoUseCase");
const GetNotasMedicasSeguimientoByPacienteUseCase = require("../../application/use-cases/notaMedicaSeguimiento/getNotasMedicasSeguimientoByPacienteUseCase");
const NotaMedicaSeguimientoController = require("../controllers/notaMedicaSeguimientoController");
const { notaMedicaSeguimientoSchema } = require("../../shared/validator");

const notaRepo = new MssqlNotaMedicaSeguimientoRepository();
const createNotaUseCase = new CreateNotaMedicaSeguimientoUseCase(notaRepo);
const getNotasUseCase = new GetNotasMedicasSeguimientoUseCase(notaRepo);
const getNotasByPacienteUseCase =
  new GetNotasMedicasSeguimientoByPacienteUseCase(notaRepo);
const notaController = new NotaMedicaSeguimientoController(notaRepo);

router.post("/", (req, res, next) => {
  const { error } = notaMedicaSeguimientoSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  notaController.create(req, res, next);
});
// Crear nota usando id_paciente en la URL: POST /api/notas-medicas-seguimiento/paciente/:id_paciente
router.post("/paciente/:id_paciente", (req, res, next) => {
  // Inyectar id_paciente desde la URL al body para la validación y la creación
  const payload = Object.assign({}, req.body, {
    id_paciente: parseInt(req.params.id_paciente, 10),
  });
  const { error } = notaMedicaSeguimientoSchema.validate(payload);
  if (error) return res.status(400).json({ error: error.details[0].message });
  // Reemplazar el body temporalmente antes de llamar al controller
  req.body = payload;
  notaController.create(req, res, next);
});
router.get("/", (req, res) => notaController.getAll(req, res));
router.get("/paciente/:id_paciente", (req, res) =>
  notaController.getByPaciente(req, res),
);
// Obtener nota por ID
router.get("/:id", (req, res) => notaController.getById(req, res));

// Actualizar nota por ID
router.put("/:id", (req, res, next) => {
  const { error } = notaMedicaSeguimientoSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  notaController.update(req, res, next);
});

// Eliminar nota por ID
router.delete("/:id", (req, res) => notaController.delete(req, res));

module.exports = router;
