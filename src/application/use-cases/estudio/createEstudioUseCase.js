class CreateEstudioUseCase {
  constructor(estudioRepo) {
    this.estudioRepo = estudioRepo;
  }

  async execute(data) {
    return await this.estudioRepo.create(data);
  }
}
module.exports = CreateEstudioUseCase;
