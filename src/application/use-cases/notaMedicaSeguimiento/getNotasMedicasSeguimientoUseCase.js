class GetNotasMedicasSeguimientoUseCase {
  constructor(notaRepo) {
    this.notaRepo = notaRepo;
  }

  async execute() {
    return await this.notaRepo.findAll();
  }
}
module.exports = GetNotasMedicasSeguimientoUseCase;
