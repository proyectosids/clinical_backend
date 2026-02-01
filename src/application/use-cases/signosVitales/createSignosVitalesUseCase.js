class CreateSignosVitalesUseCase {
  constructor(signosRepo) {
    this.signosRepo = signosRepo;
  }

  async execute(data) {
    return await this.signosRepo.create(data);
  }
}
module.exports = CreateSignosVitalesUseCase;
