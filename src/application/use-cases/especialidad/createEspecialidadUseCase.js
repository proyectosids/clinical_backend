class CreateEspecialidadUseCase {
  constructor(especialidadRepo) {
    this.especialidadRepo = especialidadRepo;
  }

  async execute(data) {
    return await this.especialidadRepo.create(data);
  }
}
module.exports = CreateEspecialidadUseCase;
