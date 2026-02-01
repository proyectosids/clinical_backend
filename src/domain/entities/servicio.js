class Servicio {
  constructor({ 
    id_servicio = null, 
    nombre_servicio, 
    descripcion = null, 
    costo, 
    horario = null,
    url_imagen = null,
    creado_en = null,
    actualizado_en = null,
    status = 1 
  }) {
    this.id_servicio = id_servicio;
    this.nombre_servicio = nombre_servicio;
    this.descripcion = descripcion;
    this.costo = costo;
    this.horario = horario;
    this.url_imagen = url_imagen;
    this.creado_en = creado_en;
    this.actualizado_en = actualizado_en;
    this.status = status;
  }
}
module.exports = Servicio;
