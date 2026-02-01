class GetServicioByIdUseCase {
  constructor(servicioRepo) {
    this.servicioRepo = servicioRepo;
  }

  async execute(id) {
    const servicio = await this.servicioRepo.findById(id);
    if (!servicio) {
      throw new Error('Servicio no encontrado');
    }
    return servicio;
  }
}

module.exports = GetServicioByIdUseCase;

