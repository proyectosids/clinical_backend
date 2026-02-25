const express = require("express");
const router = express.Router();
const { executeQuery } = require("../../config/db");

// POST /api/antecedente-paciente - Asociar antecedente a paciente
router.post("/", async (req, res) => {
  try {
    const {
      id_antecedente,
      id_paciente,
      especificacion,
      fecha_registro,
      descripcion,
    } = req.body;
    // Formatear fecha_registro a ISO si viene como string
    let fecha = fecha_registro
      ? new Date(fecha_registro).toISOString()
      : new Date().toISOString();
    const query = `INSERT INTO AntecedentePaciente (id_antecedente, id_paciente, especificacion, fecha_registro, descripcion)
                   VALUES (@param0, @param1, @param2, @param3, @param4);
                   SELECT SCOPE_IDENTITY() AS id_antecedente_paciente;`;
    const params = [
      id_antecedente,
      id_paciente,
      especificacion || null,
      fecha,
      descripcion || null,
    ];
    const result = await executeQuery(query, params);
    res
      .status(201)
      .json({ success: true, id: result[0].id_antecedente_paciente });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al asociar antecedente a paciente",
      error: error.message,
    });
  }
});

// GET /api/antecedente-paciente/:id_paciente - Listar antecedentes asociados a un paciente
router.get("/:id_paciente", async (req, res) => {
  try {
    const query = `SELECT ap.*, a.nombre_antecedente, a.descripcion, ta.nombre_tipo
                   FROM AntecedentePaciente ap
                   JOIN Antecedente a ON ap.id_antecedente = a.id_antecedente
                   JOIN TipoAntecedente ta ON a.id_tipo_antecedente = ta.id_tipo_antecedente
                   WHERE ap.id_paciente = @param0`;
    const params = [req.params.id_paciente];
    const antecedentes = await executeQuery(query, params);
    res.json(antecedentes);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener antecedentes del paciente",
      error: error.message,
    });
  }
});

// POST /api/antecedente-paciente/paciente/:id_paciente - Crear asociación usando id_paciente en la URL
router.post("/paciente/:id_paciente", async (req, res) => {
  try {
    const { id_antecedente, especificacion, fecha_registro, descripcion } =
      req.body || {};

    const id_paciente = req.params.id_paciente;

    // Formatear fecha_registro a ISO si viene como string
    let fecha = fecha_registro
      ? new Date(fecha_registro).toISOString()
      : new Date().toISOString();

    const query = `INSERT INTO AntecedentePaciente (id_antecedente, id_paciente, especificacion, fecha_registro, descripcion)
                   VALUES (@param0, @param1, @param2, @param3, @param4);
                   SELECT SCOPE_IDENTITY() AS id_antecedente_paciente;`;
    const params = [
      id_antecedente,
      id_paciente,
      especificacion || null,
      fecha,
      descripcion || null,
    ];
    const result = await executeQuery(query, params);
    res
      .status(201)
      .json({ success: true, id: result[0].id_antecedente_paciente });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al asociar antecedente a paciente (url)",
      error: error.message,
    });
  }
});

module.exports = router;
