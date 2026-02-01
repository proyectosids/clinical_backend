const mockPool = {
  request: jest.fn().mockReturnThis(),
  input: jest.fn().mockReturnThis(),
  query: jest.fn()
};

jest.mock('../src/config/db', () => ({
  getPool: () => Promise.resolve(mockPool)
}));

const MssqlPacienteRepository = require('../src/infrastructure/repositories/MssqlPacienteRepository');

describe('PacienteRepository CRUD (mock)', () => {
  let repo;

  beforeEach(() => {
    mockPool.request.mockClear();
    mockPool.input.mockClear();
    mockPool.query.mockClear();
    repo = new MssqlPacienteRepository();
  });

  it('create debe insertar y retornar id', async () => {
    mockPool.query.mockResolvedValue({ recordset: [{ id: 123 }] });
    const id = await repo.create({ nombre: 'Luis', status: 1 });
    expect(id).toBe(123);
  });

  it('findAll debe retornar array de pacientes', async () => {
    mockPool.query.mockResolvedValue({ recordset: [{ nombre: 'Luis' }, { nombre: 'Ana' }] });
    const pacientes = await repo.findAll();
    expect(Array.isArray(pacientes)).toBe(true);
    expect(pacientes.length).toBe(2);
  });

  it('findById debe retornar paciente por id', async () => {
    mockPool.query.mockResolvedValue({ recordset: [{ nombre: 'Luis', id_paciente: 1 }] });
    const paciente = await repo.findById(1);
    expect(paciente).toBeDefined();
    expect(paciente.id_paciente).toBe(1);
  });

  it('update debe retornar true', async () => {
    mockPool.query.mockResolvedValue({});
    const result = await repo.update(1, { nombre: 'Luis', status: 1 });
    expect(result).toBe(true);
  });

  it('delete debe retornar true', async () => {
    mockPool.query.mockResolvedValue({});
    const result = await repo.delete(1);
    expect(result).toBe(true);
  });
});
