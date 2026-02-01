class UpdateSignosVitalesUseCase {
  constructor(signosRepo) {
    this.signosRepo = signosRepo;
  }

  async execute(id, data) {
    return await this.signosRepo.update(id, data);
  }
}
module.exports = UpdateSignosVitalesUseCase;
