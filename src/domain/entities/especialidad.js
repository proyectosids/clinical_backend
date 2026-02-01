class Especialidad {
  constructor({ id_especialidad = null, nombre_esp, cedula_profesional = null, descripcion = null }) {
    this.id_especialidad = id_especialidad;
    this.nombre_esp = nombre_esp;
    this.cedula_profesional = cedula_profesional;
    this.descripcion = descripcion;
  }
}
module.exports = Especialidad;
