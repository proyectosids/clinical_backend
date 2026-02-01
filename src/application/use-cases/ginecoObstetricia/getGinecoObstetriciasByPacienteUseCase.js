class GetGinecoObstetriciasByPacienteUseCase {
  constructor(ginecoRepo) {
    this.ginecoRepo = ginecoRepo;
  }

  async execute(id_paciente) {
    return await this.ginecoRepo.findByPaciente(id_paciente);
  }
}
module.exports = GetGinecoObstetriciasByPacienteUseCase;
