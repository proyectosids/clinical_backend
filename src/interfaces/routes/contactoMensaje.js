const express = require("express");
const router = express.Router();
const MssqlContactoMensajeRepository = require("../../infrastructure/repositories/MssqlContactoMensajeRepository");
const {
  CreateContactoMensajeUseCase,
  GetContactoMensajesUseCase,
  GetContactoMensajeByIdUseCase,
  UpdateContactoMensajeUseCase,
  DeleteContactoMensajeUseCase,
} = require("../../application/use-cases/contactoMensaje");
const ContactoMensajeController = require("../controllers/contactoMensajeController");

const repo = new MssqlContactoMensajeRepository();
const createUseCase = new CreateContactoMensajeUseCase(repo);
const getAllUseCase = new GetContactoMensajesUseCase(repo);
const getByIdUseCase = new GetContactoMensajeByIdUseCase(repo);
const updateUseCase = new UpdateContactoMensajeUseCase(repo);
const deleteUseCase = new DeleteContactoMensajeUseCase(repo);

const controller = new ContactoMensajeController(
  createUseCase,
  getAllUseCase,
  getByIdUseCase,
  updateUseCase,
  deleteUseCase
);

// POST /api/contacto-mensajes
router.post("/", (req, res) => controller.create(req, res));
// GET /api/contacto-mensajes
router.get("/", (req, res) => controller.getAll(req, res));
// GET /api/contacto-mensajes/:id
router.get("/:id", (req, res) => controller.getById(req, res));
// PUT /api/contacto-mensajes/:id
router.put("/:id", (req, res) => controller.update(req, res));
// DELETE /api/contacto-mensajes/:id
router.delete("/:id", (req, res) => controller.delete(req, res));

module.exports = router;
