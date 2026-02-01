class GetClinicasUseCase {
  constructor(clinicaRepo) {
    this.clinicaRepo = clinicaRepo;
  }

  async execute() {
    return await this.clinicaRepo.findAll();
  }
}
module.exports = GetClinicasUseCase;
