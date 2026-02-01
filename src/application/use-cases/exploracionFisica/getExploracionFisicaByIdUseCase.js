class GetExploracionFisicaByIdUseCase {
  constructor(exploracionRepo) {
    this.exploracionRepo = exploracionRepo;
  }

  async execute(id) {
    return await this.exploracionRepo.findById(id);
  }
}
module.exports = GetExploracionFisicaByIdUseCase;
