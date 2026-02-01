const Paciente = require('../src/domain/entities/paciente');

describe('Lógica de Paciente', () => {
  it('esActivo debe retornar true si status es 1', () => {
    const paciente = new Paciente({ nombre: 'Luis', status: 1 });
    expect(paciente.esActivo()).toBe(true);
  });

  it('esActivo debe retornar false si status es 0', () => {
    const paciente = new Paciente({ nombre: 'Luis', status: 0 });
    expect(paciente.esActivo()).toBe(false);
  });

  it('esInactivo debe retornar true si status es 0', () => {
    const paciente = new Paciente({ nombre: 'Luis', status: 0 });
    expect(paciente.esInactivo()).toBe(true);
  });

  it('esInactivo debe retornar false si status es 1', () => {
    const paciente = new Paciente({ nombre: 'Luis', status: 1 });
    expect(paciente.esInactivo()).toBe(false);
  });
});
