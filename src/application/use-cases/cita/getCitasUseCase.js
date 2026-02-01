class GetCitasUseCase {
  constructor(citaRepo) {
    this.citaRepo = citaRepo;
  }

  async execute() {
    return await this.citaRepo.findAll();
  }
}
module.exports = GetCitasUseCase;
