class GetAntecedentesByPacienteUseCase {
  constructor(antecedenteRepo) {
    this.antecedenteRepo = antecedenteRepo;
  }

  async execute(id_paciente) {
    return await this.antecedenteRepo.findByPaciente(id_paciente);
  }
}
module.exports = GetAntecedentesByPacienteUseCase;
