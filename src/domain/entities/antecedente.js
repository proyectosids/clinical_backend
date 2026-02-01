class Antecedente {
  constructor({
    id_antecedente = null,
    id_paciente,
    tipo,
    descripcion = null,
    status = 1,
  }) {
    this.id_antecedente = id_antecedente;
    this.id_paciente = id_paciente;
    this.tipo = tipo;
    this.descripcion = descripcion;
    this.status = status;
  }
}
module.exports = Antecedente;
