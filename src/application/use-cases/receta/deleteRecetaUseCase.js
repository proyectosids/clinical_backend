class DeleteRecetaUseCase {
  constructor(recetaRepo) {
    this.recetaRepo = recetaRepo;
  }

  async execute(id) {
    return await this.recetaRepo.delete(id);
  }
}
module.exports = DeleteRecetaUseCase;
