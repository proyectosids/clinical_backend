const logger = require("../../shared/logger");
const bcrypt = require("bcrypt");

class UsuarioController {
  constructor(createUseCase, getUseCase, repo) {
    this.createUseCase = createUseCase;
    this.getUseCase = getUseCase;
    this.repo = repo;
  }

  async create(req, res) {
    try {
      // Backward-compatible behavior for tests and callers:
      // - If password is provided: validate and hash before creating
      // - If no password provided: pass-through body to the use case (legacy tests expect this)
      const { password, ...rest } = req.body;
      let usuarioData;
      if (password) {
        if (typeof password !== "string" || password.length < 6) {
          return res.status(400).json({
            success: false,
            message: "El campo password debe ser una cadena de al menos 6 caracteres.",
          });
        }
        const password_hash = await bcrypt.hash(password, 10);
        usuarioData = { ...rest, password_hash };
      } else {
        // legacy: pass the body as-is
        usuarioData = { ...req.body };
      }

      const usuarioCreado = await this.createUseCase.execute(usuarioData);

      // Normalize success response for compatibility with tests and frontend:
      // if use case returns a numeric id, return { id: <num> }
      if (typeof usuarioCreado === 'number') {
        return res.status(201).json({ id: usuarioCreado });
      }
      return res.status(201).json({ success: true, data: usuarioCreado });
    } catch (error) {
      logger.error(`Error al crear usuario: ${error.message}`);
      // Use { error: message } shape expected by some tests
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      logger.info("Solicitud GET /api/usuarios recibida");
      const usuarios = await this.getUseCase.execute();
      logger.info(`Usuarios obtenidos: ${usuarios.length}`);
      res.json(usuarios);
    } catch (err) {
      logger.error(`Error al obtener usuarios: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = UsuarioController;
