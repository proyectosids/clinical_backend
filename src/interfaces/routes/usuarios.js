const express = require("express");
const router = express.Router();
const MssqlUsuarioRepository = require("../../infrastructure/repositories/MssqlUsuarioRepository");
const GetUsuariosUseCase = require("../../application/use-cases/usuario/getUsuariosUseCase");
const UsuarioController = require("../controllers/usuarioController");
const { authenticateJWT } = require("../../shared/authMiddleware");

const usuarioRepo = new MssqlUsuarioRepository();

// GET /api/usuarios/:id - Obtener usuario/perfil por id
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }
    const usuario = await usuarioRepo.findById(id);
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error al obtener usuario",
        error: error.message,
      });
  }
});

// GET /api/usuarios/me - Perfil del usuario autenticado
router.get("/me", authenticateJWT, async (req, res) => {
  try {
    console.log("Payload JWT recibido en req.user:", req.user);
    const id = req.user.id_usuario || req.user.id || req.user.userId;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "No se encontró el campo id_usuario en el token JWT.",
      });
    }
    const usuario = await usuarioRepo.findById(id);
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener perfil",
      error: error.message,
    });
  }
});
const getUsuariosUseCase = new GetUsuariosUseCase(usuarioRepo);
const usuarioController = new UsuarioController(
  null,
  getUsuariosUseCase,
  usuarioRepo,
);

// GET /api/usuarios - Obtener todos los usuarios (público)
router.get("/", (req, res) => usuarioController.getAll(req, res));

// POST /api/usuarios - Crear usuario
router.post("/", async (req, res) => {
  try {
    const {
      id_rol,
      nombre,
      apellido,
      curp,
      fecha_nacimiento,
      direccion,
      email,
      telefono,
      password,
      foto_url,
      status,
      especialidades,
    } = req.body;

    if (!password || typeof password !== "string" || password.trim() === "") {
      return res.status(400).json({
        success: false,
        message:
          "El campo password es obligatorio y debe ser una cadena válida.",
      });
    }

    const bcrypt = require("bcrypt");
    const password_hash = await bcrypt.hash(password, 10);

    const usuarioPayload = {
      id_rol,
      nombre,
      apellido,
      curp,
      fecha_nacimiento,
      direccion,
      email,
      telefono,
      password_hash,
      foto_url,
      status,
      especialidades, // optional array of ids
    };

    // Use repository which now returns enriched user (rol name + especialidades array)
    const created = await usuarioRepo.create(usuarioPayload);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear usuario",
      error: error.message,
    });
  }
});

module.exports = router;
