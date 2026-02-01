class Estudio {
  constructor({ id_estudio = null, nombre, descripcion = null, precio = null, fecha_creacion = null, status = 1 }) {
    this.id_estudio = id_estudio;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.fecha_creacion = fecha_creacion;
    this.status = status;
  }
}
module.exports = Estudio;
