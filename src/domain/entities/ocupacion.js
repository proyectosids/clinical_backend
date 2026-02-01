class Ocupacion {
  constructor({ id_ocupacion = null, id_especialidad = null, nombre_ocupacion, cedula_profesional = null, institucion_titulacion = null, anio_titulacion = null, descripcion = null }) {
    this.id_ocupacion = id_ocupacion;
    this.id_especialidad = id_especialidad;
    this.nombre_ocupacion = nombre_ocupacion;
    this.cedula_profesional = cedula_profesional;
    this.institucion_titulacion = institucion_titulacion;
    this.anio_titulacion = anio_titulacion;
    this.descripcion = descripcion;
  }
}
module.exports = Ocupacion;
