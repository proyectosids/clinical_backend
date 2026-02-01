class GetRecetaByIdUseCase {
  constructor(recetaRepo) {
    this.recetaRepo = recetaRepo;
  }

  async execute(id) {
    return await this.recetaRepo.findById(id);
  }
}
module.exports = GetRecetaByIdUseCase;
