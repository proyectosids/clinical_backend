class GetEstudiosUseCase {
  constructor(estudioRepo) {
    this.estudioRepo = estudioRepo;
  }

  async execute() {
    return await this.estudioRepo.findAll();
  }
}
module.exports = GetEstudiosUseCase;
