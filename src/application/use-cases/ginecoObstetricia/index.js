//index para caso de uso de ginecoOsbtetricia
const CreateGinecoObstetriciaUseCase = require('./createGinecoObstetriciaUseCase');
const GetGinecoObstetriciasUseCase = require('./getGinecoObstetriciasUseCase');
const GetGinecoObstetriciaByIdUseCase = require('./getGinecoObstetriciaByIdUseCase');
const GetGinecoObstetriciasByPacienteUseCase = require('./getGinecoObstetriciasByPacienteUseCase');
const UpdateGinecoObstetriciaUseCase = require('./updateGinecoObstetriciaUseCase');
const DeleteGinecoObstetriciaUseCase = require('./deleteGinecoObstetriciaUseCase');

module.exports = {
  CreateGinecoObstetriciaUseCase,
  GetGinecoObstetriciasUseCase,
  GetGinecoObstetriciaByIdUseCase,
  GetGinecoObstetriciasByPacienteUseCase,
  UpdateGinecoObstetriciaUseCase,
  DeleteGinecoObstetriciaUseCase
};
