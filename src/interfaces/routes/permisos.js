const express = require("express");
const router = express.Router();
const PermisoController = require("../controllers/permisoController");
const MssqlPermisoRepository = require("../../infrastructure/repositories/MssqlPermisoRepository");

const permisoRepo = new MssqlPermisoRepository();
const permisoController = new PermisoController(permisoRepo);

// GET /api/permisos - Listar todos los permisos
router.get("/", (req, res, next) => permisoController.getAll(req, res, next));

module.exports = router;
