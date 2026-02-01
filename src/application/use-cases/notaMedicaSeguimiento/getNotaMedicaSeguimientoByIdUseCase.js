class GetNotaMedicaSeguimientoByIdUseCase {
  constructor(notaRepo) {
    this.notaRepo = notaRepo;
  }

  async execute(id) {
    return await this.notaRepo.findById(id);
  }
}
module.exports = GetNotaMedicaSeguimientoByIdUseCase;
