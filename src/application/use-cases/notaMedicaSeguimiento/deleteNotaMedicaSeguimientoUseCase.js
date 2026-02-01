class DeleteNotaMedicaSeguimientoUseCase {
  constructor(notaRepo) {
    this.notaRepo = notaRepo;
  }

  async execute(id) {
    return await this.notaRepo.delete(id);
  }
}
module.exports = DeleteNotaMedicaSeguimientoUseCase;
