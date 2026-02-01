class GetExploracionesFisicasByPacienteUseCase {
  constructor(exploracionRepo) {
    this.exploracionRepo = exploracionRepo;
  }

  async execute(id_paciente) {
    return await this.exploracionRepo.findByPaciente(id_paciente);
  }
}
module.exports = GetExploracionesFisicasByPacienteUseCase;
