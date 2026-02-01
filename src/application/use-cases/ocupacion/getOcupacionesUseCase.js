class GetOcupacionesUseCase {
  constructor(ocupacionRepo) {
    this.ocupacionRepo = ocupacionRepo;
  }

  async execute() {
    return await this.ocupacionRepo.findAll();
  }
}
module.exports = GetOcupacionesUseCase;
