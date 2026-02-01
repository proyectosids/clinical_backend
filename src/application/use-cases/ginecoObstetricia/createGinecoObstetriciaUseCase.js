class CreateGinecoObstetriciaUseCase {
  constructor(ginecoRepo) {
    this.ginecoRepo = ginecoRepo;
  }

  async execute(data) {
    return await this.ginecoRepo.create(data);
  }
}
module.exports = CreateGinecoObstetriciaUseCase;
