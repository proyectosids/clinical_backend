class UpdateGinecoObstetriciaUseCase {
  constructor(ginecoRepo) {
    this.ginecoRepo = ginecoRepo;
  }

  async execute(id, data) {
    return await this.ginecoRepo.update(id, data);
  }
}
module.exports = UpdateGinecoObstetriciaUseCase;
