const Usuario = require('../src/domain/entities/usuario');

describe('Usuario', () => {
  it('debe crear un usuario con nombre y status', () => {
    const usuario = new Usuario({ nombre: 'Juan', apellido: 'Pérez', status: 1, email: 'juan@example.com', id_rol: 2, password_hash: 'hash' });
    expect(usuario.nombre).toBe('Juan');
    expect(usuario.status).toBe(1);
    expect(usuario.email).toBe('juan@example.com');
  });

  it('debe marcar como inactivo si el status es 0', () => {
    const usuario = new Usuario({ nombre: 'Ana', status: 0, email: 'ana@example.com', id_rol: 2, password_hash: 'hash' });
    expect(usuario.status).toBe(0);
  });
});
