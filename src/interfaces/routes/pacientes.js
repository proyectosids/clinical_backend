const express = require("express");
const router = express.Router();
const { executeQuery } = require("../../config/db");

// GET /api/pacientes - Obtener todos los pacientes (público)
router.get("/", async (req, res) => {
  let query = "";
  let params = [];
  let pagina, limite, buscar, offset, whereClause, total;
  try {
    ({ pagina = 1, limite = 10, buscar = "" } = req.query);
    offset = (pagina - 1) * limite;

    whereClause = "";
    params = [];

    if (buscar) {
      whereClause =
        "WHERE nombre LIKE @param0 OR apellido LIKE @param0 OR curp_paciente LIKE @param0";
      params.push(`%${buscar}%`);
    }

    query = `
		       SELECT * FROM Paciente 
		       ${whereClause}
		       ORDER BY id_paciente DESC
		       OFFSET @param${params.length} ROWS
		       FETCH NEXT @param${params.length + 1} ROWS ONLY
	       `;

    params.push(offset, parseInt(limite));
    const pacientes = await executeQuery(query, params);

    // Contar total
    const countQuery = `SELECT COUNT(*) as total FROM Paciente ${whereClause}`;
    const countResult = await executeQuery(
      countQuery,
      buscar ? [params[0]] : []
    );
    total = countResult[0]?.total || 0;

    res.json({
      success: true,
      data: pacientes,
      paginacion: {
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        total,
        totalPaginas: Math.ceil(total / limite),
      },
    });
  } catch (error) {
    // ...manejo de error...
    try {
      // Intentar ejecutar la consulta nuevamente
      const pacientes = await executeQuery(query, params);
      res.json({
        success: true,
        data: pacientes,
        paginacion: {
          pagina: parseInt(pagina),
          limite: parseInt(limite),
          total,
          totalPaginas: Math.ceil(total / limite),
        },
      });
    } catch (retryError) {
      console.error("Error al reintentar la consulta:", retryError);
      res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  }
});

// POST /api/pacientes - Crear paciente
router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      curp_paciente,
      fecha_nacimiento,
      numero_contacto,
      direccion,
      email,
      contacto_emergencia,
      edad,
      genero,
      estado_civil,
      ocupacion,
      tipo_sangre,
      alergias,
      foto_url,
    } = req.body;

    const query = `INSERT INTO Paciente (
			nombre, apellido, curp_paciente, fecha_nacimiento, numero_contacto, direccion, email, contacto_emergencia, edad, genero, estado_civil, ocupacion, tipo_sangre, alergias, foto_url
		) VALUES (
			@param0, @param1, @param2, @param3, @param4, @param5, @param6, @param7, @param8, @param9, @param10, @param11, @param12, @param13, @param14
		);
		SELECT SCOPE_IDENTITY() AS id_paciente;`;
    const params = [
      nombre,
      apellido,
      curp_paciente,
      fecha_nacimiento,
      numero_contacto,
      direccion,
      email,
      contacto_emergencia,
      edad,
      genero,
      estado_civil,
      ocupacion,
      tipo_sangre,
      alergias,
      foto_url,
    ];
    const result = await require("../../config/db").executeQuery(query, params);
    res.status(201).json({ success: true, id: result[0].id_paciente });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear paciente",
      error: error.message,
    });
  }
});

// GET /api/pacientes/:id - Obtener paciente por ID
const PacienteController = require("../controllers/pacienteController");
const MssqlPacienteRepository = require("../../infrastructure/repositories/MssqlPacienteRepository");
const PacienteRepository = new MssqlPacienteRepository();
const pacienteController = new PacienteController(
  null,
  null,
  PacienteRepository
);

// PUT /api/pacientes/:id - Editar paciente
router.put("/:id", async (req, res) => {
  await pacienteController.update(req, res);
});

// DELETE /api/pacientes/:id - Dar de baja lógica (status=0)
router.delete("/:id", async (req, res) => {
  await pacienteController.delete(req, res);
});

router.get("/:id", async (req, res) => {
  console.log("Consulta por ID:", req.params.id);
  await pacienteController.getById(req, res);
});

module.exports = router;
