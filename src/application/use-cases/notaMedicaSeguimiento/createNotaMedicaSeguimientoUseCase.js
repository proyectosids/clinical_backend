class CreateNotaMedicaSeguimientoUseCase {
  constructor(notaRepo) {
    this.notaRepo = notaRepo;
  }

  async execute(data) {
    return await this.notaRepo.create(data);
  }
}
module.exports = CreateNotaMedicaSeguimientoUseCase;
