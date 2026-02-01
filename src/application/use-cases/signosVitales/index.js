// index.js de casos de uso de SignosVitales
const CreateSignosVitalesUseCase = require('./createSignosVitalesUseCase');
const DeleteSignosVitalesUseCase = require('./deleteSignosVitalesUseCase');
const GetSignosVitalesByIdUseCase = require('./getSignosVitalesByIdUseCase');
const GetSignosVitalesByPacienteUseCase = require('./getSignosVitalesByPacienteUseCase');
const GetSignosVitalesUseCase = require('./getSignosVitalesUseCase');
const UpdateSignosVitalesUseCase = require('./updateSignosVitalesUseCase');

module.exports = {
  CreateSignosVitalesUseCase,
  DeleteSignosVitalesUseCase,
  GetSignosVitalesByIdUseCase,
  GetSignosVitalesByPacienteUseCase,
  GetSignosVitalesUseCase,
  UpdateSignosVitalesUseCase
};
