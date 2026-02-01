class Paciente {
    constructor({
      id_paciente = null,
      nombre,
      apellido = null,
      curp_paciente = null,
      fecha_nacimiento = null,
      email = null,
      numero_contacto = null,
      direccion = null,
      edad = null,
      genero = null,
      estado_civil = null,
      ocupacion = null,
      tipo_sangre = null,
      alergias = null,
      foto_url = null,
      status = 1
    }) {
      this.id_paciente = id_paciente;
      this.nombre = nombre;
      this.apellido = apellido;
      this.curp_paciente = curp_paciente;
      this.fecha_nacimiento = fecha_nacimiento;
      this.email = email;
      this.numero_contacto = numero_contacto;
      this.direccion = direccion;
      this.edad = edad;
      this.genero = genero;
      this.estado_civil = estado_civil;
      this.ocupacion = ocupacion;
      this.tipo_sangre = tipo_sangre;
      this.alergias = alergias;
      this.foto_url = foto_url;
      this.status = status;
    }
    esActivo() {
      return this.status === 1;
    }
    esInactivo() {
      return this.status !== 1;
    }
  }
  
  module.exports = Paciente;
