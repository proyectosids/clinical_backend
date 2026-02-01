export default class CreatePacienteUseCase {
  constructor(pacienteRepo) {
    this.pacienteRepo = pacienteRepo;
  }

  async execute(payload) {
    // Aquí puedes sumar validaciones del dominio (edad, curp, etc.)
    return await this.pacienteRepo.create(payload);
  }
}
