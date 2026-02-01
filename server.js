const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware básico
app.use(cors());
app.use(express.json());

// Ruta de salud
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API de Clínica funcionando",
    timestamp: new Date().toISOString(),
  });
});

// Rutas de la API
app.use("/api/pacientes", require("./src/interfaces/routes/pacientes"));
app.use("/api/usuarios", require("./src/interfaces/routes/usuarios"));
app.use("/api/auth", require("./src/interfaces/routes/auth"));
app.use("/api/servicios", require("./src/interfaces/routes/servicios"));
//app.use('/api/clinicas', require('./src/interfaces/routes/clinicas'));
app.use(
  "/api/signos-vitales",
  require("./src/interfaces/routes/signosVitales")
);
app.use("/api/antecedentes", require("./src/interfaces/routes/antecedentes"));
app.use("/api/antecedente-paciente", require("./src/interfaces/routes/antecedentePaciente"));
app.use("/api/tipo-antecedentes", require("./src/interfaces/routes/tipoAntecedente"));
app.use(
  "/api/exploraciones-fisicas",
  require("./src/interfaces/routes/exploracionFisica")
);
app.use(
  "/api/gineco-obstetricia",
  require("./src/interfaces/routes/ginecoObstetricia")
);
app.use("/api/recetas", require("./src/interfaces/routes/recetas"));
app.use(
  "/api/notas-medicas-seguimiento",
  require("./src/interfaces/routes/notaMedicaSeguimiento")
);
app.use("/api/citas", require("./src/interfaces/routes/citas"));
app.use("/api/estudios", require("./src/interfaces/routes/estudios"));

app.use(
  "/api/especialidades",
  require("./src/interfaces/routes/especialidades")
);
app.use(
  "/api/usuario-especialidad",
  require("./src/interfaces/routes/usuarioEspecialidad")
);
app.use("/api/roles", require("./src/interfaces/routes/roles"));
app.use("/api/ocupaciones", require("./src/interfaces/routes/ocupaciones"));
app.use("/api/perfiles", require("./src/interfaces/routes/perfiles"));
app.use("/api/permisos", require("./src/interfaces/routes/permisos"));
app.use(
  "/api/contacto-mensajes",
  require("./src/interfaces/routes/contactoMensaje")
);

// Ruta 404 no existente
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

// Manejo de errores
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
  });
});

// Exportar app para pruebas de integración
module.exports = app;

// Iniciar servidor solo si no es test
if (require.main === module) {
  // Iniciar servidor
  async function startServer() {
    try {
      app.listen(PORT, () => {
        console.log(` Servidor iniciado en puerto ${PORT}`);
        console.log(` API disponible en: http://localhost:${PORT}`);
        console.log(` Endpoints:`);
        console.log(`   - Pacientes: http://localhost:${PORT}/api/pacientes`);
        console.log(
          `   - Paciente por ID: http://localhost:${PORT}/api/pacientes/:id`
        );
        console.log(`   - Usuarios: http://localhost:${PORT}/api/usuarios`);
        console.log(`   - Auth: http://localhost:${PORT}/api/auth`);
        console.log(`   - Servicios: http://localhost:${PORT}/api/servicios`);
        console.log(`   - Clinicas: http://localhost:${PORT}/api/clinicas`);
        console.log(`   - Estudios: http://localhost:${PORT}/api/estudios`);
        console.log(`   - Citas: http://localhost:${PORT}/api/citas`);
        console.log(
          `   - Antecedentes: http://localhost:${PORT}/api/antecedentes`
        );
        console.log(
          `   - Especialidades: http://localhost:${PORT}/api/especialidades`
        );
      });
    } catch (error) {
      console.error("❌ Error al iniciar servidor:", error.message);
      process.exit(1);
    }
  }

  startServer();
}
