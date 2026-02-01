const Receta = require('../src/domain/entities/receta');

describe('Receta', () => {
  it('debe crear una receta con medicamentos y status', () => {
    const receta = new Receta({ medicamentos: 'Paracetamol', status: 1 });
    expect(receta.medicamentos).toBe('Paracetamol');
    expect(receta.status).toBe(1);
  });

  it('debe marcar como inactiva si el status es 0', () => {
    const receta = new Receta({ medicamentos: 'Ibuprofeno', status: 0 });
    expect(receta.status).toBe(0);
  });
});
