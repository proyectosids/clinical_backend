class UpdateRecetaUseCase {
  constructor(recetaRepo) {
    this.recetaRepo = recetaRepo;
  }

  async execute(id, data) {
    return await this.recetaRepo.update(id, data);
  }
}
module.exports = UpdateRecetaUseCase;
