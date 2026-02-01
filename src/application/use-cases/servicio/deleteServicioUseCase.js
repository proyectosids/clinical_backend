class DeleteServicioUseCase {
  constructor(servicioRepo) {
    this.servicioRepo = servicioRepo;
  }

  async execute(id) {
    // Validar que el servicio existe
    const servicioExistente = await this.servicioRepo.findById(id);
    if (!servicioExistente) {
      throw new Error('Servicio no encontrado');
    }

    return await this.servicioRepo.delete(id);
  }
}

module.exports = DeleteServicioUseCase;

