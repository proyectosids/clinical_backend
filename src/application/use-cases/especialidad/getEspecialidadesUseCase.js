class GetEspecialidadesUseCase {
  constructor(especialidadRepo) {
    this.especialidadRepo = especialidadRepo;
  }

  async execute() {
    return await this.especialidadRepo.findAll();
  }
}
module.exports = GetEspecialidadesUseCase;
