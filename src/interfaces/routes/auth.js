const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// POST /api/auth/login - Login de usuario
router.post("/login", (req, res) => authController.login(req, res));

// POST /api/auth/register - Registro de usuario
router.post("/register", (req, res) => authController.register(req, res));

// POST /api/auth/forgot-password - Solicitud de recuperación
router.post("/forgot-password", (req, res) =>
  authController.forgotPassword(req, res)
);

// POST /api/auth/reset-password - Restablecer contraseña
router.post("/reset-password", (req, res) =>
  authController.resetPassword(req, res)
);

module.exports = router;
