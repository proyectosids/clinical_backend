class NotaMedicaSeguimiento {
  constructor({
    id_nota_medica_seguimiento = null,
    id_cita,
    id_paciente = null,
    padecimiento_actual = null,
    id_signos_vitales = null,
    id_exploracion_fisica = null,
    id_examen_clinico = null,
    diagnostico_idx = null,
    analisis = null,
    plan_medico = null,
    id_solicitud_estudio = null,
    id_receta = null,
    pronostico = null,
    id_profesional,
    fecha_hora_atencion = null,
  }) {
    this.id_nota_medica_seguimiento = id_nota_medica_seguimiento;
    this.id_cita = id_cita;
    this.id_paciente = id_paciente;
    this.padecimiento_actual = padecimiento_actual;
    this.id_signos_vitales = id_signos_vitales;
    this.id_exploracion_fisica = id_exploracion_fisica;
    this.id_examen_clinico = id_examen_clinico;
    this.diagnostico_idx = diagnostico_idx;
    this.analisis = analisis;
    this.plan_medico = plan_medico;
    this.id_solicitud_estudio = id_solicitud_estudio;
    this.id_receta = id_receta;
    this.pronostico = pronostico;
    this.id_profesional = id_profesional;
    this.fecha_hora_atencion = fecha_hora_atencion;
  }
}
module.exports = NotaMedicaSeguimiento;
