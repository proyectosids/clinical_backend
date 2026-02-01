const Usuario = require('../../domain/entities/usuario');

class CreateUsuarioUseCase {
  constructor(usuarioRepo) {
    this.usuarioRepo = usuarioRepo;
  }

  async execute(data) {
    // Agregar validaciones y hash de contraseña si es necesario
    const usuario = new Usuario(data);
    return await this.usuarioRepo.create(usuario);
  }
}

module.exports = CreateUsuarioUseCase;
