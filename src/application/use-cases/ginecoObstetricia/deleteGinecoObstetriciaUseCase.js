class DeleteGinecoObstetriciaUseCase {
  constructor(ginecoRepo) {
    this.ginecoRepo = ginecoRepo;
  }

  async execute(id) {
    return await this.ginecoRepo.delete(id);
  }
}
module.exports = DeleteGinecoObstetriciaUseCase;
