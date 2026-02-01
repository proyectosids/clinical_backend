class UpdateNotaMedicaSeguimientoUseCase {
  constructor(notaRepo) {
    this.notaRepo = notaRepo;
  }

  async execute(id, data) {
    return await this.notaRepo.update(id, data);
  }
}
module.exports = UpdateNotaMedicaSeguimientoUseCase;
