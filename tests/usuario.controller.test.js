const UsuarioController = require('../src/interfaces/controllers/usuarioController');

describe('UsuarioController', () => {
  let mockCreateUseCase, mockGetUseCase, mockRepo, usuarioController;

  beforeEach(() => {
    mockCreateUseCase = { execute: jest.fn() };
    mockGetUseCase = { execute: jest.fn() };
    mockRepo = {};
    usuarioController = new UsuarioController(mockCreateUseCase, mockGetUseCase, mockRepo);
  });

  describe('create', () => {
    it('debería crear un usuario y retornar el id', async () => {
      const req = { body: { nombre: 'Juan' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      mockCreateUseCase.execute.mockResolvedValue(123);

      await usuarioController.create(req, res);

      expect(mockCreateUseCase.execute).toHaveBeenCalledWith({ nombre: 'Juan' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 123 });
    });

    it('debería manejar errores y retornar status 500', async () => {
      const req = { body: { nombre: 'Juan' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const error = new Error('Fallo al crear');
      mockCreateUseCase.execute.mockRejectedValue(error);

      await usuarioController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getAll', () => {
    it('debería retornar usuarios correctamente', async () => {
      const usuarios = [{ id: 1, nombre: 'Juan' }];
      const req = {};
      const res = { json: jest.fn() };
      mockGetUseCase.execute.mockResolvedValue(usuarios);

      await usuarioController.getAll(req, res);

      expect(mockGetUseCase.execute).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(usuarios);
    });

    it('debería manejar errores y retornar status 500', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const error = new Error('Fallo al obtener');
      mockGetUseCase.execute.mockRejectedValue(error);

      await usuarioController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});
