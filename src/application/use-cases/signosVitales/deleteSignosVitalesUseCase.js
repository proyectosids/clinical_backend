class DeleteSignosVitalesUseCase {
  constructor(signosRepo) {
    this.signosRepo = signosRepo;
  }

  async execute(id) {
    return await this.signosRepo.delete(id);
  }
}
module.exports = DeleteSignosVitalesUseCase;
