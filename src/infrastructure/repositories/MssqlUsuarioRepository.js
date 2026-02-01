const UsuarioRepository = require("../../domain/repositories/usuarioRepository");
const { getPool } = require("../../config/db");
const Usuario = require("../../domain/entities/usuario");

class MssqlUsuarioRepository extends UsuarioRepository {
  async create(usuario) {
    // Crear usuario y opcionalmente sus especialidades en una transacción
    const pool = await getPool();
    const transaction = new (require("mssql").Transaction)(pool);
    await transaction.begin();
    try {
      const trReq = transaction.request();
      trReq.input("id_rol", usuario.id_rol);
      trReq.input("nombre", usuario.nombre);
      trReq.input("apellido", usuario.apellido);
      trReq.input("curp", usuario.curp);
      trReq.input("fecha_nacimiento", usuario.fecha_nacimiento);
      trReq.input("direccion", usuario.direccion);
      trReq.input("email", usuario.email);
      trReq.input("telefono", usuario.telefono);
      trReq.input("password_hash", usuario.password_hash);
      trReq.input("foto_url", usuario.foto_url);
      trReq.input("status", usuario.status);

      const insertResult = await trReq.query(`
        INSERT INTO Usuario (id_rol, nombre, apellido, curp, fecha_nacimiento, direccion, email, telefono, password_hash, foto_url, status)
        VALUES (@id_rol, @nombre, @apellido, @curp, @fecha_nacimiento, @direccion, @email, @telefono, @password_hash, @foto_url, @status);
        SELECT SCOPE_IDENTITY() AS id_usuario;
      `);
      const id_usuario = insertResult.recordset[0] ? insertResult.recordset[0].id_usuario : null;

      // Insertar especialidades si vienen
      if (Array.isArray(usuario.especialidades) && usuario.especialidades.length > 0 && id_usuario) {
        for (let i = 0; i < usuario.especialidades.length; i++) {
          const idEsp = usuario.especialidades[i];
          await transaction.request().input(`id_usuario`, id_usuario).input(`id_especialidad`, idEsp)
            .query(`INSERT INTO usuarioEspecialidad (id_usuario, id_especialidad) VALUES (@id_usuario, @id_especialidad)`);
        }
      }

      await transaction.commit();
      return await this.findById(id_usuario);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async findAllByStatus(status) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("status", status)
      .query(
        `SELECT u.*, r.nombre_rol, e.id_especialidad, e.nombre_esp
         FROM Usuario u
         JOIN Rol r ON u.id_rol = r.id_rol
         LEFT JOIN usuarioEspecialidad ue ON ue.id_usuario = u.id_usuario
         LEFT JOIN Especialidad e ON e.id_especialidad = ue.id_especialidad
         WHERE u.status = @status`
      );
    const rows = result.recordset || [];
    // Agrupar especialidades por usuario
    const map = {};
    rows.forEach((r) => {
      const id = r.id_usuario;
      if (!map[id]) {
        map[id] = {
          id_usuario: r.id_usuario,
          id_rol: r.id_rol,
          nombre: r.nombre,
          apellido: r.apellido,
          curp: r.curp,
          fecha_nacimiento: r.fecha_nacimiento,
          direccion: r.direccion,
          email: r.email,
          telefono: r.telefono,
          foto_url: r.foto_url,
          status: r.status,
          fecha_registro: r.fecha_registro,
          rol: r.nombre_rol || null,
          especialidades: [],
        };
      }
      if (r.nombre_esp) map[id].especialidades.push(r.nombre_esp);
    });
    return Object.values(map);
  }

  async findAll() {
    const pool = await getPool();
    const result = await pool
      .request()
      .query(
        `SELECT u.*, r.nombre_rol, e.id_especialidad, e.nombre_esp
         FROM Usuario u
         JOIN Rol r ON u.id_rol = r.id_rol
         LEFT JOIN usuarioEspecialidad ue ON ue.id_usuario = u.id_usuario
         LEFT JOIN Especialidad e ON e.id_especialidad = ue.id_especialidad`
      );
    const rows = result.recordset || [];
    const map = {};
    rows.forEach((r) => {
      const id = r.id_usuario;
      if (!map[id]) {
        map[id] = {
          id_usuario: r.id_usuario,
          id_rol: r.id_rol,
          nombre: r.nombre,
          apellido: r.apellido,
          curp: r.curp,
          fecha_nacimiento: r.fecha_nacimiento,
          direccion: r.direccion,
          email: r.email,
          telefono: r.telefono,
          foto_url: r.foto_url,
          status: r.status,
          fecha_registro: r.fecha_registro,
          rol: r.nombre_rol || null,
          especialidades: [],
        };
      }
      if (r.nombre_esp) map[id].especialidades.push(r.nombre_esp);
    });
    return Object.values(map);
  }

  async findById(id) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id_usuario", id)
      .query(
        `SELECT u.*, r.nombre_rol, e.id_especialidad, e.nombre_esp
         FROM Usuario u
         JOIN Rol r ON u.id_rol = r.id_rol
         LEFT JOIN usuarioEspecialidad ue ON ue.id_usuario = u.id_usuario
         LEFT JOIN Especialidad e ON e.id_especialidad = ue.id_especialidad
         WHERE u.id_usuario = @id_usuario`
      );
    const rows = result.recordset || [];
    if (rows.length === 0) return null;
    // Construir objeto enriquecido
    const base = rows[0];
    const usuario = {
      id_usuario: base.id_usuario,
      id_rol: base.id_rol,
      nombre: base.nombre,
      apellido: base.apellido,
      curp: base.curp,
      fecha_nacimiento: base.fecha_nacimiento,
      direccion: base.direccion,
      email: base.email,
      telefono: base.telefono,
      foto_url: base.foto_url,
      status: base.status,
      fecha_registro: base.fecha_registro,
      rol: base.nombre_rol || null,
      especialidades: [],
    };
    rows.forEach((r) => {
      if (r.nombre_esp) usuario.especialidades.push(r.nombre_esp);
    });
    return usuario;
  }

  async update(id, data) {
    const pool = await getPool();
    const request = pool
      .request()
      .input("id_usuario", id)
      .input("nombre", data.nombre)
      .input("apellido", data.apellido)
      .input("curp", data.curp)
      .input("fecha_nacimiento", data.fecha_nacimiento)
      .input("direccion", data.direccion)
      .input("email", data.email)
      .input("telefono", data.telefono)
      .input("password_hash", data.password_hash)
      .input("foto_url", data.foto_url)
      .input("status", data.status);
    await request.query(`
  UPDATE Usuario 
  SET nombre=@nombre, apellido=@apellido, curp=@curp, fecha_nacimiento=@fecha_nacimiento, 
      direccion=@direccion, email=@email, telefono=@telefono, 
      password_hash=@password_hash, foto_url=@foto_url, status=@status 
  WHERE id_usuario=@id_usuario`);
    return await this.findById(id);
  }

  async delete(id) {
    const pool = await getPool();
    await pool
      .request()
      .input("id_usuario", id)
      .query(`UPDATE Usuario SET status = 0 WHERE id_usuario = @id_usuario`);
    return await this.findById(id);
  }

  async buscarPorEmail(email) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("email", email)
      .query(
        `SELECT u.*, r.nombre_rol FROM Usuario u JOIN Rol r ON u.id_rol = r.id_rol WHERE u.email = @email`
      );
    if (!result.recordset[0]) return null;
    return new Usuario(result.recordset[0]);
  }

  async findInactivos() {
    const pool = await getPool();
    const result = await pool
      .request()
      .query(
        `SELECT u.*, r.nombre_rol FROM Usuario u JOIN Rol r ON u.id_rol = r.id_rol WHERE u.status = 0`
      );
    return result.recordset.map((row) => new Usuario(row));
  }

  async reactivar(id) {
    const pool = await getPool();
    await pool
      .request()
      .input("id_usuario", id)
      .query(`UPDATE Usuario SET status = 1 WHERE id_usuario = @id_usuario`);
    await request.query(`
  UPDATE Usuario 
  SET nombre=@nombre, apellido=@apellido, curp=@curp, fecha_nacimiento=@fecha_nacimiento, 
      direccion=@direccion, email=@email, telefono=@telefono, 
      password_hash=@password_hash, foto_url=@foto_url, status=@status 
  WHERE id_usuario=@id_usuario
`);
    return await this.findById(id); // ✅ devuelve el usuario actualizado
  }
}

module.exports = MssqlUsuarioRepository;
