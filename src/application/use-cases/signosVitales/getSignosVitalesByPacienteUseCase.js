class GetSignosVitalesByPacienteUseCase {
  constructor(signosRepo) {
    this.signosRepo = signosRepo;
  }

  async execute(id_paciente) {
    return await this.signosRepo.findByPaciente(id_paciente);
  }
}
module.exports = GetSignosVitalesByPacienteUseCase;
