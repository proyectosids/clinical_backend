class CreateAntecedenteUseCase {
  constructor(antecedenteRepo) {
    this.antecedenteRepo = antecedenteRepo;
  }

  async execute(data) {
    return await this.antecedenteRepo.create(data);
  }
}
module.exports = CreateAntecedenteUseCase;
