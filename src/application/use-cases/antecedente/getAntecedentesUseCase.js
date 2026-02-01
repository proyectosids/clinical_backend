class GetAntecedentesUseCase {
  constructor(antecedenteRepo) {
    this.antecedenteRepo = antecedenteRepo;
  }

  async execute() {
    return await this.antecedenteRepo.findAll();
  }
}
module.exports = GetAntecedentesUseCase;
