class GetServiciosUseCase {
  constructor(servicioRepo) {
    this.servicioRepo = servicioRepo;
  }

  async execute() {
    return await this.servicioRepo.findAll();
  }
}
module.exports = GetServiciosUseCase;
