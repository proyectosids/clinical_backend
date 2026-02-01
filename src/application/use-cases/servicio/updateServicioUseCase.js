class UpdateServicioUseCase {
  constructor(servicioRepo) {
    this.servicioRepo = servicioRepo;
  }

  async execute(id, data) {
    // Validar que el servicio existe
    const servicioExistente = await this.servicioRepo.findById(id);
    if (!servicioExistente) {
      throw new Error('Servicio no encontrado');
    }

    return await this.servicioRepo.update(id, data);
  }
}

module.exports = UpdateServicioUseCase;

