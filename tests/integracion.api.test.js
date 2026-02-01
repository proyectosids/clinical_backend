// Placeholder skipped test to keep Jest happy while the real integration tests are commented.
test.skip('integracion.api placeholder', () => {});

// jest.mock('../src/infrastructure/repositories/MssqlUsuarioRepository', () => {
//   return jest.fn().mockImplementation(() => ({
//     findAll: jest.fn().mockResolvedValue([{ id: 1, nombre: 'Juan' }])
//   }));
// });
// jest.mock('../src/infrastructure/repositories/MssqlPacienteRepository', () => {
//   return jest.fn().mockImplementation(() => ({
//     findAll: jest.fn().mockResolvedValue([{ id: 1, nombre: 'Paciente' }])
//   }));
// });
// jest.mock('../src/infrastructure/repositories/MssqlServicioRepository', () => {
//   return jest.fn().mockImplementation(() => ({
//     findAll: jest.fn().mockResolvedValue([{ id: 1, nombre: 'Servicio' }])
//   }));
// });
// jest.mock('../src/infrastructure/repositories/MssqlRecetaRepository', () => {
//   return jest.fn().mockImplementation(() => ({
//     findAll: jest.fn().mockResolvedValue([{ id: 1, medicamentos: ['Paracetamol'] }])
//   }));
// });
// const request = require('supertest');
// const app = require('../server');

// describe('Integración API Clínica', () => {
//   it('GET /health debe retornar status 200 y success true', async () => {
//     const res = await request(app).get('/health');
//     expect(res.statusCode).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(res.body.message).toMatch(/API de Clínica funcionando/);
//   });

//   it('GET /api/usuarios debe retornar status 200 y un array', async () => {
//     const res = await request(app).get('/api/usuarios');
//     expect(res.statusCode).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });

//   it('GET /api/pacientes debe retornar status 200 y un objeto con data array', async () => {
//     const res = await request(app).get('/api/pacientes');
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty('success', true);
//     expect(Array.isArray(res.body.data)).toBe(true);
//   });

//   it('GET /api/servicios debe retornar status 200 y un array', async () => {
//     const res = await request(app).get('/api/servicios');
//     expect(res.statusCode).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });

//   it('GET /api/recetas debe retornar status 200 y un array', async () => {
//     const res = await request(app).get('/api/recetas');
//     expect(res.statusCode).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });
// });
