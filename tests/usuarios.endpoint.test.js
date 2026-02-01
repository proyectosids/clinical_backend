const request = require('supertest');
const express = require('express');
jest.mock('../src/infrastructure/repositories/MssqlUsuarioRepository', () => {
  return jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue([{ id: 1, nombre: 'Juan' }])
  }));
});
const usuariosRouter = require('../src/interfaces/routes/usuarios');

describe('Endpoints de Usuarios', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/usuarios', usuariosRouter);
  });

  it('GET /api/usuarios debe retornar 200 y un array', async () => {
    const res = await request(app).get('/api/usuarios');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('nombre');
  });
});
