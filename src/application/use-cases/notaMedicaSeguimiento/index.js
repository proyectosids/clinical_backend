// index.js de casos de uso de NotaMedicaSeguimiento
const CreateNotaMedicaSeguimientoUseCase = require('./createNotaMedicaSeguimientoUseCase');
const DeleteNotaMedicaSeguimientoUseCase = require('./deleteNotaMedicaSeguimientoUseCase');
const GetNotaMedicaSeguimientoByIdUseCase = require('./getNotaMedicaSeguimientoByIdUseCase');
const GetNotasMedicasSeguimientoByPacienteUseCase = require('./getNotasMedicasSeguimientoByPacienteUseCase');
const GetNotasMedicasSeguimientoUseCase = require('./getNotasMedicasSeguimientoUseCase');
const UpdateNotaMedicaSeguimientoUseCase = require('./updateNotaMedicaSeguimientoUseCase');

module.exports = {
  CreateNotaMedicaSeguimientoUseCase,
  DeleteNotaMedicaSeguimientoUseCase,
  GetNotaMedicaSeguimientoByIdUseCase,
  GetNotasMedicasSeguimientoByPacienteUseCase,
  GetNotasMedicasSeguimientoUseCase,
  UpdateNotaMedicaSeguimientoUseCase
};
