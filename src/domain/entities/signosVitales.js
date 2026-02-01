class SignosVitales {
  constructor({
    id_signos_vitales = null,
    id_paciente = null,
    fecha_registro = null,
    temperatura = null,
    presion_arterial = null,
    frecuencia_cardiaca = null,
    frecuencia_respiratoria = null,
    glucemia = null,
    saturacion_oxigeno = null,
    peso = null,
    talla = null,
    imc = null,
  }) {
    this.id_signos_vitales = id_signos_vitales;
    this.id_paciente = id_paciente;
    this.fecha_registro = fecha_registro;
    this.temperatura = temperatura;
    this.presion_arterial = presion_arterial;
    this.frecuencia_cardiaca = frecuencia_cardiaca;
    this.frecuencia_respiratoria = frecuencia_respiratoria;
    this.glucemia = glucemia;
    this.saturacion_oxigeno = saturacion_oxigeno;
    this.peso = peso;
    this.talla = talla;
    this.imc = imc;
  }
}
module.exports = SignosVitales;
