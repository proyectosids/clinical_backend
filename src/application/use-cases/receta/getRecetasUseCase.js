class GetRecetasUseCase {
  constructor(recetaRepo) {
    this.recetaRepo = recetaRepo;
  }

  async execute() {
    return await this.recetaRepo.findAll();
  }
}
module.exports = GetRecetasUseCase;
