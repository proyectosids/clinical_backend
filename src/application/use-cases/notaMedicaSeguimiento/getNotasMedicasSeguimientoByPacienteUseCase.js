class GetNotasMedicasSeguimientoByPacienteUseCase {
  constructor(notaRepo) {
    this.notaRepo = notaRepo;
  }

  async execute(id_paciente) {
    return await this.notaRepo.findByPaciente(id_paciente);
  }
}
module.exports = GetNotasMedicasSeguimientoByPacienteUseCase;
