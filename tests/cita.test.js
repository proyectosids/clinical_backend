const Cita = require('../src/domain/entities/cita');

describe('Cita', () => {
  it('debe crear una cita con fecha y status', () => {
    const cita = new Cita({ fecha: '2025-08-25', status: 1 });
    expect(cita.fecha).toBe('2025-08-25');
    expect(cita.status).toBe(1);
  });

  it('debe marcar como inactiva si el status es 0', () => {
    const cita = new Cita({ fecha: '2025-08-25', status: 0 });
    expect(cita.status).toBe(0);
  });
});
