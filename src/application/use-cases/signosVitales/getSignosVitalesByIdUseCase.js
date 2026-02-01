class GetSignosVitalesByIdUseCase {
  constructor(signosRepo) {
    this.signosRepo = signosRepo;
  }

  async execute(id) {
    return await this.signosRepo.findById(id);
  }
}
module.exports = GetSignosVitalesByIdUseCase;
