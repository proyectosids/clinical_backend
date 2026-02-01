class Receta {
  constructor({ id_receta = null, id_paciente, id_usuario, fecha, medicamentos = null, indicaciones = null, status = 1 }) {
    this.id_receta = id_receta;
    this.id_paciente = id_paciente;
    this.id_usuario = id_usuario;
    this.fecha = fecha;
    this.medicamentos = medicamentos;
    this.indicaciones = indicaciones;
    this.status = status;
  }
}
module.exports = Receta;
