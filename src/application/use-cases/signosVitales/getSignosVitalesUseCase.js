class GetSignosVitalesUseCase {
  constructor(signosRepo) {
    this.signosRepo = signosRepo;
  }

  async execute() {
    return await this.signosRepo.findAll();
  }
}
module.exports = GetSignosVitalesUseCase;
