class Usuario {
  constructor({
    id_usuario = null,
    id_rol,
    id_ocupacion = null,
    nombre,
    apellido,
    curp,
    fecha_nacimiento,
    direccion = null,
    email,
    telefono = null,
    password_hash,
    foto_url = null,
    status = 1,
    fecha_registro = null,
  }) {
    this.id_usuario = id_usuario;
    this.id_rol = id_rol;
    this.id_ocupacion = id_ocupacion;
    this.nombre = nombre;
    this.apellido = apellido;
    this.curp = curp;
    this.fecha_nacimiento = fecha_nacimiento;
    this.direccion = direccion;
    this.email = email;
    this.telefono = telefono;
    this.password_hash = password_hash;
    this.foto_url = foto_url;
    this.status = status;
    this.fecha_registro = fecha_registro;
  }

  esActivo() {
    return this.status === 1;
  }

  esInactivo() {
    return this.status !== 1;
  }

  toJSON() {
    const obj = {
      id_usuario: this.id_usuario,
      id_rol: this.id_rol,
      id_ocupacion: this.id_ocupacion,
      nombre: this.nombre,
      apellido: this.apellido,
      curp: this.curp,
      fecha_nacimiento: this.fecha_nacimiento,
      direccion: this.direccion,
      email: this.email,
      telefono: this.telefono,
      foto_url: this.foto_url,
      status: this.status,
      fecha_registro: this.fecha_registro,
      // No incluyas password_hash por seguridad
    };
    if (this.nombre_rol) obj.nombre_rol = this.nombre_rol;
    return obj;
  }
}

module.exports = Usuario;
