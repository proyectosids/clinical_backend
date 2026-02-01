class CreateRecetaUseCase {
  constructor(recetaRepo) {
    this.recetaRepo = recetaRepo;
  }

  async execute(data) {
    return await this.recetaRepo.create(data);
  }
}
module.exports = CreateRecetaUseCase;
