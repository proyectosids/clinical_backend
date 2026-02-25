const express = require("express");
const router = express.Router();
const MssqlUsuarioRepository = require("../../infrastructure/repositories/MssqlUsuarioRepository");
const { executeQuery } = require("../../config/db");
const MssqlRolRepository = require("../../infrastructure/repositories/MssqlRolRepository");

// IDs de roles irrelevantes para pacientes
const ROLES_EXCLUIR = [1, 2]; // 1: Administrador, 2: Recepcionista

router.get("/", async (req, res) => {
  try {
    // Obtener todos los usuarios
    const usuarioRepo = new MssqlUsuarioRepository();
    const usuarios = await usuarioRepo.findAll();

    // Obtener roles
    const rolRepo = new MssqlRolRepository();
    const roles = await rolRepo.findAll();

    // Mapear roles por id
    const rolMap = {};
    roles.forEach((r) => {
      rolMap[r.id_rol] = r.nombre_rol;
    });

    // Obtener mapeo usuario -> especialidades desde usuarioEspecialidad JOIN Especialidad
    const sql = `SELECT ue.id_usuario, e.id_especialidad, e.nombre_esp FROM usuarioEspecialidad ue JOIN Especialidad e ON ue.id_especialidad = e.id_especialidad`;
    const espRows = await executeQuery(sql, []);
    const especialidadMap = {};
    (espRows || []).forEach((row) => {
      const uid = row.id_usuario;
      if (!especialidadMap[uid]) especialidadMap[uid] = [];
      especialidadMap[uid].push(row.nombre_esp);
    });

    // Filtrar y enriquecer usuarios
    const perfiles = usuarios
      .filter((u) => !ROLES_EXCLUIR.includes(u.id_rol))
      .map((u) => ({
        id_usuario: u.id_usuario,
        nombre: u.nombre,
        apellido: u.apellido,
        email: u.email,
        telefono: u.telefono,
        foto_url: u.foto_url,
        rol: rolMap[u.id_rol] || "",
        especialidad: especialidadMap[u.id_usuario]
          ? especialidadMap[u.id_usuario].join(", ")
          : "",
        status: u.status,
      }));

    res.json({ success: true, data: perfiles });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener perfiles",
      error: error.message,
    });
  }
});

module.exports = router;
