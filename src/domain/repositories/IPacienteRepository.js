/**
 * Interfaz del repositorio de pacientes
 * Define los contratos que debe implementar cualquier repositorio de pacientes
 */
class IPacienteRepository {
  /**
   * Crear un nuevo paciente
   * @param {Object} paciente - Objeto paciente
   * @returns {Promise<Object>} Paciente creado
   */
  async crear(paciente) {
    throw new Error('Método crear debe ser implementado');
  }

  /**
   * Buscar paciente por ID
   * @param {number} id - ID del paciente
   * @returns {Promise<Object|null>} Paciente encontrado o null
   */
  async buscarPorId(id) {
    throw new Error('Método buscarPorId debe ser implementado');
  }

  /**
   * Buscar paciente por documento de identidad
   * @param {string} documento - Número de documento
   * @returns {Promise<Object|null>} Paciente encontrado o null
   */
  async buscarPorDocumento(documento) {
    throw new Error('Método buscarPorDocumento debe ser implementado');
  }

  /**
   * Buscar pacientes por nombre
   * @param {string} nombre - Nombre a buscar
   * @returns {Promise<Array>} Lista de pacientes
   */
  async buscarPorNombre(nombre) {
    throw new Error('Método buscarPorNombre debe ser implementado');
  }

  /**
   * Obtener todos los pacientes con paginación
   * @param {Object} opciones - Opciones de paginación
   * @returns {Promise<Object>} Lista paginada de pacientes
   */
  async obtenerTodos(opciones = {}) {
    throw new Error('Método obtenerTodos debe ser implementado');
  }

  /**
   * Actualizar paciente
   * @param {number} id - ID del paciente
   * @param {Object} datos - Datos a actualizar
   * @returns {Promise<Object>} Paciente actualizado
   */
  async actualizar(id, datos) {
    throw new Error('Método actualizar debe ser implementado');
  }

  /**
   * Eliminar paciente (desactivar)
   * @param {number} id - ID del paciente
   * @returns {Promise<boolean>} True si se eliminó correctamente
   */
  async eliminar(id) {
    throw new Error('Método eliminar debe ser implementado');
  }

  /**
   * Activar paciente
   * @param {number} id - ID del paciente
   * @returns {Promise<Object>} Paciente activado
   */
  async activar(id) {
    throw new Error('Método activar debe ser implementado');
  }

  /**
   * Contar total de pacientes
   * @returns {Promise<number>} Total de pacientes
   */
  async contar() {
    throw new Error('Método contar debe ser implementado');
  }
}

module.exports = IPacienteRepository; 