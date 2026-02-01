class CreateServicioUseCase {
  constructor(servicioRepo) {
    this.servicioRepo = servicioRepo;
  }

  async execute(data) {
    return await this.servicioRepo.create(data);
  }
}
module.exports = CreateServicioUseCase;
