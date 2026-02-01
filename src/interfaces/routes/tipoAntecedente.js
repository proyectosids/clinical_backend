const express = require("express");
const router = express.Router();
const { executeQuery } = require("../../config/db");

// GET /api/tipo-antecedentes - Listar todos los tipos de antecedentes
router.get("/", async (req, res) => {
  try {
    const tipos = await executeQuery("SELECT * FROM TipoAntecedente", []);
    res.json(tipos);
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error al obtener tipos de antecedentes",
        error: error.message,
      });
  }
});

module.exports = router;
