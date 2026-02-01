const LoginUseCase = require("../../application/use-cases/usuario/LoginUseCase");
const MssqlUsuarioRepository = require("../../infrastructure/repositories/MssqlUsuarioRepository");
const { usuarioSchema } = require("../../shared/validator");

const usuarioRepo = new MssqlUsuarioRepository();
const loginUseCase = new LoginUseCase(usuarioRepo, {
  loginSchema: () => {
    return require("joi").object({
      email: require("joi").string().email().required(),
      password: require("joi").string().min(6).required(),
    });
  },
});

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config/app");

class AuthController {
  async login(req, res) {
    try {
      const result = await loginUseCase.ejecutar(req.body);
      if (result.success) {
        res.json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  }

  async register(req, res) {
    try {
      const {
        nombre,
        apellido,
        curp,
        fecha_nacimiento,
        direccion = "",
        email,
        telefono,
        password,
        rol,
      } = req.body;
      // Validar campos básicos
      if (
        !nombre ||
        !apellido ||
        !email ||
        !password ||
        !rol ||
        !curp ||
        !fecha_nacimiento ||
        !telefono
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Faltan datos requeridos (nombre, apellido, email, password, rol, curp, fecha_nacimiento, telefono)",
        });
      }
      // Validar email único
      const existente = await usuarioRepo.buscarPorEmail(email);
      if (existente) {
        return res
          .status(409)
          .json({ success: false, message: "El correo ya está registrado" });
      }
      // Hashear contraseña
      const password_hash = await bcrypt.hash(password, 10);
      // Crear usuario con valores por defecto para campos opcionales
      const nuevoUsuario = {
        nombre,
        apellido,
        curp,
        fecha_nacimiento,
        direccion,
        email,
        telefono,
        password_hash,
        id_rol: rol,
        status: 1,
      };
      const creado = await usuarioRepo.create(nuevoUsuario);
      if (!creado) {
        return res
          .status(500)
          .json({ success: false, message: "No se pudo crear el usuario" });
      }
      res.status(201).json({
        success: true,
        message: "Usuario creado",
        userId: creado.id_usuario,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error en el registro",
        error: error.message,
      });
    }
  }

  // Solicitud de recuperación de contraseña
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      console.log("[RECUPERAR] Email recibido:", email);
      if (!email) {
        console.log("[RECUPERAR] Email faltante");
        return res
          .status(400)
          .json({ success: false, message: "Email requerido" });
      }
      const usuario = await usuarioRepo.buscarPorEmail(email);
      console.log(
        "[RECUPERAR] Usuario encontrado:",
        usuario ? usuario.email : null
      );
      if (!usuario) {
        console.log("[RECUPERAR] No existe usuario con ese correo");
        return res.status(404).json({
          success: false,
          message: "No existe usuario con ese correo",
        });
      }
      // Generar token temporal (JWT expira en 15 min)
      console.log("[RECUPERAR] Usando JWT_SECRET:", config.jwtSecret);
      const token = jwt.sign(
        { id: usuario.id_usuario, email },
        config.jwtSecret,
        { expiresIn: "15m" }
      );
      console.log("[RECUPERAR] Token generado:", token);
      // Aquí deberías enviar el correo con el link, pero solo devolvemos el token para pruebas
      // En producción, usar un servicio de correo y enviar: https://tusistema.com/reset-password?token=TOKEN
      res.json({
        success: true,
        message: "Se ha enviado un correo con instrucciones",
        token,
      });
    } catch (error) {
      console.error("[RECUPERAR] Error:", error);
      res.status(500).json({
        success: false,
        message: "Error en recuperación",
        error: error.message,
      });
    }
  }

  // Restablecer contraseña con token
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Token y nueva contraseña requeridos",
        });
      }
      // Verificar token
      let payload;
      try {
        payload = jwt.verify(token, config.jwtSecret);
      } catch (err) {
        return res
          .status(400)
          .json({ success: false, message: "Token inválido o expirado" });
      }
      // Buscar usuario
      const usuario = await usuarioRepo.findById(payload.id);
      if (!usuario) {
        return res
          .status(404)
          .json({ success: false, message: "Usuario no encontrado" });
      }
      // Hashear nueva contraseña
      const password_hash = await bcrypt.hash(newPassword, 10);
      // Actualizar solo el password_hash usando todos los datos actuales
      const datosActualizados = {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        curp: usuario.curp,
        fecha_nacimiento: usuario.fecha_nacimiento,
        direccion: usuario.direccion,
        email: usuario.email,
        telefono: usuario.telefono,
        foto_url: usuario.foto_url,
        status: usuario.status,
        id_rol: usuario.id_rol,
        password_hash,
      };
      await usuarioRepo.update(usuario.id_usuario, datosActualizados);
      res.json({ success: true, message: "Contraseña actualizada" });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al resetear contraseña",
        error: error.message,
      });
    }
  }
}

module.exports = new AuthController();
