class GetGinecoObstetriciaByIdUseCase {
  constructor(ginecoRepo) {
    this.ginecoRepo = ginecoRepo;
  }

  async execute(id) {
    return await this.ginecoRepo.findById(id);
  }
}
module.exports = GetGinecoObstetriciaByIdUseCase;
