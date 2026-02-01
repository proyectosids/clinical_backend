const Paciente = require('../src/domain/entities/paciente');

describe('Paciente', () => {
  it('debe crear un paciente con nombre y status', () => {
    const paciente = new Paciente({ nombre: 'Luis', status: 1 });
    expect(paciente.nombre).toBe('Luis');
    expect(paciente.status).toBe(1);
  });

  it('debe marcar como inactivo si el status es 0', () => {
    const paciente = new Paciente({ nombre: 'Maria', status: 0 });
    expect(paciente.status).toBe(0);
  });
});
