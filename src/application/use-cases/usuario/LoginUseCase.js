const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../../config/app');

class LoginUseCase {
  constructor(usuarioRepository, validator) {
    this.usuarioRepository = usuarioRepository;
    this.validator = validator;
  }

  async ejecutar(credenciales) {
    try {
      // 1. Validar datos de entrada
      const datosValidos = await this.validarDatos(credenciales); 
      // 2. Buscar usuario por email
      const usuario = await this.usuarioRepository.buscarPorEmail(datosValidos.email);
      // 3. Verificar existencia y estado
      if (!usuario) throw new Error('Credenciales inválidas');
      if (!usuario.esActivo()) throw new Error('Usuario inactivo');
      // 4. Verificar contraseña
      const passwordValida = await this.verificarPassword(datosValidos.password, usuario.password_hash);
      if (!passwordValida) throw new Error('Credenciales inválidas');
      // 5. Generar token JWT
      const token = this.generarToken(usuario);
      // 6. Retornar usuario sin password y token
      const { password_hash, ...usuarioSinPassword } = usuario.toJSON();
      return {
        success: true,
        data: { usuario: usuarioSinPassword, token },
        message: 'Login exitoso'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error en el login'
      };
    }
  }

  // 1. Validar datos
  async validarDatos(datos) {
    const schema = this.validator.loginSchema();
    const { error, value } = schema.validate(datos);
    if (error) throw new Error(`Error de validación: ${error.details[0].message}`);
    return value;
  }

  // 4. Verificar contraseña
  async verificarPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // 5. Generar token JWT
  generarToken(usuario) {
    const payload = {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      id_rol: usuario.id_rol,
      nombre: usuario.nombre,
      apellido: usuario.apellido
    };
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });
  }
}

module.exports = LoginUseCase;