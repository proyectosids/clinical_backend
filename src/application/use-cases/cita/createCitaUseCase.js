class CreateCitaUseCase {
  constructor(citaRepo) {
    this.citaRepo = citaRepo;
  }

  async execute(data) {
    return await this.citaRepo.create(data);
  }
}
module.exports = CreateCitaUseCase;
