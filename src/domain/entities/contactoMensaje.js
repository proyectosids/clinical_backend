class ContactoMensaje {
  constructor({
    id_contacto = null,
    nombre,
    email,
    telefono,
    asunto,
    mensaje,
    medio_preferido = null,
    status = 1,
    fecha_creacion = null,
    fecha_contacto = null,
    atendido_por = null,
  }) {
    this.id_contacto = id_contacto;
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.asunto = asunto;
    this.mensaje = mensaje;
    this.medio_preferido = medio_preferido;
    this.status = status;
    this.fecha_creacion = fecha_creacion || new Date();
    this.fecha_contacto = fecha_contacto;
    this.atendido_por = atendido_por;
  }
}

module.exports = ContactoMensaje;
