const IContactoMensajeRepository = require("../../domain/repositories/contactoMensajeRepository");
const ContactoMensaje = require("../../domain/entities/contactoMensaje");
const { getPool } = require("../../config/db");

class MssqlContactoMensajeRepository extends IContactoMensajeRepository {
  async create(contactoMensaje) {
    const pool = await getPool();
    // Forzar status válido
    const status =
      contactoMensaje.status &&
      ["nuevo", "en_proceso", "contactado", "cerrado"].includes(
        contactoMensaje.status
      )
        ? contactoMensaje.status
        : "nuevo";
    const result = await pool
      .request()
      .input("nombre", contactoMensaje.nombre)
      .input("email", contactoMensaje.email)
      .input("telefono", contactoMensaje.telefono)
      .input("asunto", contactoMensaje.asunto)
      .input("mensaje", contactoMensaje.mensaje)
      .input("medio_preferido", contactoMensaje.medio_preferido)
      .input("status", status)
      .input("fecha_creacion", contactoMensaje.fecha_creacion)
      .input("atendido_por", contactoMensaje.atendido_por)
      .query(`INSERT INTO ContactoMensaje (nombre, email, telefono, asunto, mensaje, medio_preferido, status, fecha_creacion, atendido_por)
              VALUES (@nombre, @email, @telefono, @asunto, @mensaje, @medio_preferido, @status, @fecha_creacion, @atendido_por);
              SELECT SCOPE_IDENTITY() AS id_contacto;`);
    const id_contacto = result.recordset[0].id_contacto;
    return await this.findById(id_contacto);
  }

  async findById(id_contacto) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id_contacto", id_contacto)
      .query("SELECT * FROM ContactoMensaje WHERE id_contacto = @id_contacto");
    if (!result.recordset[0]) return null;
    return new ContactoMensaje(result.recordset[0]);
  }

  async findAll() {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM ContactoMensaje");
    return result.recordset.map((row) => new ContactoMensaje(row));
  }

  async update(id_contacto, data) {
    const pool = await getPool();
    await pool
      .request()
      .input("id_contacto", id_contacto)
      .input("status", data.status)
      .input("atendido_por", data.atendido_por)
      .query(
        "UPDATE ContactoMensaje SET status = @status, atendido_por = @atendido_por WHERE id_contacto = @id_contacto"
      );
    return await this.findById(id_contacto);
  }

  async delete(id_contacto) {
    const pool = await getPool();
    await pool
      .request()
      .input("id_contacto", id_contacto)
      .query("DELETE FROM ContactoMensaje WHERE id_contacto = @id_contacto");
    return true;
  }
}

module.exports = MssqlContactoMensajeRepository;
