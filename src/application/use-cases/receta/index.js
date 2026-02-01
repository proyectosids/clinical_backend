// index.js de casos de uso de Receta
const CreateRecetaUseCase = require('./createRecetaUseCase');
const DeleteRecetaUseCase = require('./deleteRecetaUseCase');
const GetRecetaByIdUseCase = require('./getRecetaByIdUseCase');
const GetRecetasByPacienteUseCase = require('./getRecetasByPacienteUseCase');
const GetRecetasUseCase = require('./getRecetasUseCase');
const UpdateRecetaUseCase = require('./updateRecetaUseCase');

module.exports = {
  CreateRecetaUseCase,
  DeleteRecetaUseCase,
  GetRecetaByIdUseCase,
  GetRecetasByPacienteUseCase,
  GetRecetasUseCase,
  UpdateRecetaUseCase
};
