class CreateExploracionFisicaUseCase {
  constructor(exploracionRepo) {
    this.exploracionRepo = exploracionRepo;
  }

  async execute(data) {
    return await this.exploracionRepo.create(data);
  }
}
module.exports = CreateExploracionFisicaUseCase;
