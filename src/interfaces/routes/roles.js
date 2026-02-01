const express = require("express");
const router = express.Router();
const MssqlRolRepository = require("../../infrastructure/repositories/MssqlRolRepository");
const RolController = require("../controllers/rolController");

const rolRepo = new MssqlRolRepository();
const rolController = new RolController(rolRepo);
const MssqlRolPermisoRepository = require("../../infrastructure/repositories/MssqlRolPermisoRepository");
const RolPermisoController = require("../controllers/rolPermisoController");
const rolPermisoRepo = new MssqlRolPermisoRepository();
const rolPermisoController = new RolPermisoController(rolPermisoRepo);
// GET /api/roles/:id/permisos - Obtener permisos de un rol
router.get("/:id/permisos", (req, res, next) =>
  rolPermisoController.getPermisosByRol(req, res, next)
);

// POST /api/roles/:id/permisos - Actualizar permisos de un rol
router.post("/:id/permisos", (req, res, next) =>
  rolPermisoController.updatePermisosByRol(req, res, next)
);

// GET /api/roles - Obtener todos los roles
router.get("/", (req, res, next) => rolController.getAll(req, res, next));

// GET /api/roles/:id - Obtener un rol por ID
router.get("/:id", (req, res, next) => rolController.getById(req, res, next));

// POST /api/roles - Crear un nuevo rol
router.post("/", (req, res, next) => rolController.create(req, res, next));

// PUT /api/roles/:id - Actualizar un rol existente
router.put("/:id", (req, res, next) => rolController.update(req, res, next));

// DELETE /api/roles/:id - Eliminar un rol
router.delete("/:id", (req, res, next) => rolController.delete(req, res, next));

module.exports = router;
