class Clinica {
  constructor({ id_clinica = null, nombre_marca, ubicacion, numero_contacto = null, email = null, fecha_creacion = null, status = 1 }) {
    this.id_clinica = id_clinica;
    this.nombre_marca = nombre_marca;
    this.ubicacion = ubicacion;
    this.numero_contacto = numero_contacto;
    this.email = email;
    this.fecha_creacion = fecha_creacion;
    this.status = status;
  }
}
module.exports = Clinica;
