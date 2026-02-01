class ExploracionFisica {
  constructor({ id_exploracion = null, id_paciente, fecha, hallazgos = null, observaciones = null, status = 1 }) {
    this.id_exploracion = id_exploracion;
    this.id_paciente = id_paciente;
    this.fecha = fecha;
    this.hallazgos = hallazgos;
    this.observaciones = observaciones;
    this.status = status;
  }
}
module.exports = ExploracionFisica;
