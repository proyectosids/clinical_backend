class Cita {
  constructor({ id_cita = null, id_paciente, fecha, hora, motivo = null, atendido = false, id_estudio = null, id_servicio = null, id_usuario = null, fecha_creacion = null, status = 1 }) {
    this.id_cita = id_cita;
    this.id_paciente = id_paciente;
    this.fecha = fecha;
    this.hora = hora;
    this.motivo = motivo;
    this.atendido = atendido;
    this.id_estudio = id_estudio;
    this.id_servicio = id_servicio;
    this.id_usuario = id_usuario;
    this.fecha_creacion = fecha_creacion;
    this.status = status;
  }
}
module.exports = Cita;
