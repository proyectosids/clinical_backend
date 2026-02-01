class CreateOcupacionUseCase {
  constructor(ocupacionRepo) {
    this.ocupacionRepo = ocupacionRepo;
  }

  async execute(data) {
    return await this.ocupacionRepo.create(data);
  }
}
module.exports = CreateOcupacionUseCase;
