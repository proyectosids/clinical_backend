class CreateClinicaUseCase {
  constructor(clinicaRepo) {
    this.clinicaRepo = clinicaRepo;
  }

  async execute(data) {
    return await this.clinicaRepo.create(data);
  }
}
module.exports = CreateClinicaUseCase;
