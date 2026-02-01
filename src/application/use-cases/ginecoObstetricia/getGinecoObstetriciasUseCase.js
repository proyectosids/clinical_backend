class GetGinecoObstetriciasUseCase {
  constructor(ginecoRepo) {
    this.ginecoRepo = ginecoRepo;
  }

  async execute() {
    return await this.ginecoRepo.findAll();
  }
}
module.exports = GetGinecoObstetriciasUseCase;
