class GetRecetasByPacienteUseCase {
  constructor(recetaRepo) {
    this.recetaRepo = recetaRepo;
  }

  async execute(id_paciente) {
    return await this.recetaRepo.findByPaciente(id_paciente);
  }
}
module.exports = GetRecetasByPacienteUseCase;
