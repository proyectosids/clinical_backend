class Permiso {
  constructor({ id_permiso, nombre_pantalla, descripcion, permitido }) {
    this.id_permiso = id_permiso;
    this.nombre_pantalla = nombre_pantalla;
    this.descripcion = descripcion;
    if (permitido !== undefined) this.permitido = permitido;
  }
}

module.exports = Permiso;
