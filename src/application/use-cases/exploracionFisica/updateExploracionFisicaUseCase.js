class UpdateExploracionFisicaUseCase {
  constructor(exploracionRepo) {
    this.exploracionRepo = exploracionRepo;
  }

  async execute(id, data) {
    return await this.exploracionRepo.update(id, data);
  }
}
module.exports = UpdateExploracionFisicaUseCase;
