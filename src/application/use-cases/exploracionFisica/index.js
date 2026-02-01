//index caso de uso de exploracionFisica
const CreateExploracionFisicaUseCase = require('./createExploracionFisicaUseCase');
const GetExploracionesFisicasUseCase = require('./getExploracionesFisicasUseCase');
const GetExploracionFisicaByIdUseCase = require('./getExploracionFisicaByIdUseCase');
const GetExploracionesFisicasByPacienteUseCase = require('./getExploracionesFisicasByPacienteUseCase');
const UpdateExploracionFisicaUseCase = require('./updateExploracionFisicaUseCase');
const DeleteExploracionFisicaUseCase = require('./deleteExploracionFisicaUseCase');

module.exports = {
  CreateExploracionFisicaUseCase,
  GetExploracionesFisicasUseCase,
  GetExploracionFisicaByIdUseCase,
  GetExploracionesFisicasByPacienteUseCase,
  UpdateExploracionFisicaUseCase,
  DeleteExploracionFisicaUseCase
};
