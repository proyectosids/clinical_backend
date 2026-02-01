wexport default class GetPacientesUseCase {
  constructor(pacienteRepo) {
    this.pacienteRepo = pacienteRepo;
  }

  async execute() {
    return await this.pacienteRepo.findAll();
  }
}
