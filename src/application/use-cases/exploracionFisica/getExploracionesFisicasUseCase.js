class GetExploracionesFisicasUseCase {
  constructor(exploracionRepo) {
    this.exploracionRepo = exploracionRepo;
  }

  async execute() {
    return await this.exploracionRepo.findAll();
  }
}
module.exports = GetExploracionesFisicasUseCase;
