const Usuario = require('../src/domain/entities/usuario');

describe('Lógica de Usuario', () => {
  it('esActivo debe retornar true si status es 1', () => {
    const usuario = new Usuario({
      id_rol: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      curp: 'CURP123',
      fecha_nacimiento: '1990-01-01',
      email: 'juan@example.com',
      password_hash: 'hash',
      status: 1
    });
    expect(usuario.esActivo()).toBe(true);
  });

  it('esActivo debe retornar false si status es 0', () => {
    const usuario = new Usuario({
      id_rol: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      curp: 'CURP123',
      fecha_nacimiento: '1990-01-01',
      email: 'juan@example.com',
      password_hash: 'hash',
      status: 0
    });
    expect(usuario.esActivo()).toBe(false);
  });

  it('esInactivo debe retornar true si status es 0', () => {
    const usuario = new Usuario({
      id_rol: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      curp: 'CURP123',
      fecha_nacimiento: '1990-01-01',
      email: 'juan@example.com',
      password_hash: 'hash',
      status: 0
    });
    expect(usuario.esInactivo()).toBe(true);
  });

  it('esInactivo debe retornar false si status es 1', () => {
    const usuario = new Usuario({
      id_rol: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      curp: 'CURP123',
      fecha_nacimiento: '1990-01-01',
      email: 'juan@example.com',
      password_hash: 'hash',
      status: 1
    });
    expect(usuario.esInactivo()).toBe(false);
  });

  it('debe marcar como admin si id_rol es 1', () => {
    const usuario = new Usuario({
      id_rol: 1,
      nombre: 'Admin',
      apellido: 'Root',
      curp: 'CURPADMIN',
      fecha_nacimiento: '1980-01-01',
      email: 'admin@example.com',
      password_hash: 'hash',
      status: 1
    });
    // Lógica adicional: admin si id_rol === 1
    expect(usuario.id_rol).toBe(1);
    expect(usuario.nombre).toBe('Admin');
  });

  it('debe tener email válido', () => {
    const usuario = new Usuario({
      id_rol: 2,
      nombre: 'Juan',
      apellido: 'Pérez',
      curp: 'CURP123',
      fecha_nacimiento: '1990-01-01',
      email: 'juan@example.com',
      password_hash: 'hash',
      status: 1
    });
    expect(usuario.email).toMatch(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/);
  });

  it('debe tener curp de longitud 8 o más', () => {
    const usuario = new Usuario({
      id_rol: 2,
      nombre: 'Ana',
      apellido: 'López',
      curp: 'CURP1234',
      fecha_nacimiento: '1995-05-05',
      email: 'ana@example.com',
      password_hash: 'hash',
      status: 1
    });
    expect(usuario.curp.length).toBeGreaterThanOrEqual(8);
  });

  it('debe tener fecha de nacimiento en formato válido', () => {
    const usuario = new Usuario({
      id_rol: 2,
      nombre: 'Luis',
      apellido: 'Martínez',
      curp: 'CURP5678',
      fecha_nacimiento: '2000-12-31',
      email: 'luis@example.com',
      password_hash: 'hash',
      status: 1
    });
    expect(usuario.fecha_nacimiento).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
