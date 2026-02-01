class GinecoObstetricia {
  constructor({ id_gineco = null, id_paciente, fecha, menarca = null, ritmo_menstrual = null, ivsa = null, embarazos = null, partos = null, abortos = null, cesareas = null, fum = null, fup = null, metodo_anticonceptivo = null, observaciones = null, status = 1 }) {
    this.id_gineco = id_gineco;
    this.id_paciente = id_paciente;
    this.fecha = fecha;
    this.menarca = menarca;
    this.ritmo_menstrual = ritmo_menstrual;
    this.ivsa = ivsa;
    this.embarazos = embarazos;
    this.partos = partos;
    this.abortos = abortos;
    this.cesareas = cesareas;
    this.fum = fum;
    this.fup = fup;
    this.metodo_anticonceptivo = metodo_anticonceptivo;
    this.observaciones = observaciones;
    this.status = status;
  }
}
module.exports = GinecoObstetricia;
