class GetUsuariosUseCase {
  constructor(usuarioRepo) {
    this.usuarioRepo = usuarioRepo;
  }

  async execute() {
    return await this.usuarioRepo.findAll();
  }
}

module.exports = GetUsuariosUseCase;
