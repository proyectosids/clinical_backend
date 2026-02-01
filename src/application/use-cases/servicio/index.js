// index.js de casos de uso de Servicio
const CreateServicioUseCase = require('./createServicioUseCase');
const GetServiciosUseCase = require('./getServiciosUseCase');
const GetServicioByIdUseCase = require('./getServicioByIdUseCase');
const UpdateServicioUseCase = require('./updateServicioUseCase');
const DeleteServicioUseCase = require('./deleteServicioUseCase');

module.exports = {
  CreateServicioUseCase,
  GetServiciosUseCase,
  GetServicioByIdUseCase,
  UpdateServicioUseCase,
  DeleteServicioUseCase
};
