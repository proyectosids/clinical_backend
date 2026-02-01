class DeleteExploracionFisicaUseCase {
  constructor(exploracionRepo) {
    this.exploracionRepo = exploracionRepo;
  }

  async execute(id) {
    return await this.exploracionRepo.delete(id);
  }
}
module.exports = DeleteExploracionFisicaUseCase;
