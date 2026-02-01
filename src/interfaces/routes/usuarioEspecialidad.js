const express = require('express');
const router = express.Router();
const MssqlUsuarioEspecialidadRepository = require('../../infrastructure/repositories/MssqlUsuarioEspecialidadRepository');
const { authenticateJWT } = require('../../shared/authMiddleware');

const repo = new MssqlUsuarioEspecialidadRepository();

// GET /api/usuario-especialidad/:id_usuario -> lista de especialidades del usuario
router.get('/:id_usuario', authenticateJWT, async (req, res) => {
  try {
    const id = parseInt(req.params.id_usuario, 10);
    const rows = await repo.findByUser(id);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/usuario-especialidad -> agregar una relacion
// body: { id_usuario, id_especialidad }
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { id_usuario, id_especialidad } = req.body;
    if (!id_usuario || !id_especialidad) return res.status(400).json({ success: false, message: 'id_usuario e id_especialidad son requeridos' });
    await repo.add(id_usuario, id_especialidad);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/usuario-especialidad/batch -> agregar varias especialidades a un usuario
// body: { id_usuario, especialidades: [id_especialidad,...] }
router.post('/batch', authenticateJWT, async (req, res) => {
  try {
    const { id_usuario, especialidades } = req.body;
    if (!id_usuario || !Array.isArray(especialidades)) return res.status(400).json({ success: false, message: 'id_usuario y arreglo especialidades son requeridos' });
    await repo.addMany(id_usuario, especialidades);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/usuario-especialidad -> eliminar relacion (body)
// body: { id_usuario, id_especialidad }
router.delete('/', authenticateJWT, async (req, res) => {
  try {
    const { id_usuario, id_especialidad } = req.body;
    if (!id_usuario || !id_especialidad) return res.status(400).json({ success: false, message: 'id_usuario e id_especialidad son requeridos' });
    await repo.remove(id_usuario, id_especialidad);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
