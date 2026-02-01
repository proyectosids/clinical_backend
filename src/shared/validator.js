const Joi = require("joi");

const pacienteSchema = Joi.object({
  nombre: Joi.string().min(2).max(50).required(),
  apellido: Joi.string().min(2).max(50).required(),
  curp_paciente: Joi.string().length(18).required(),
  fecha_nacimiento: Joi.date().required(),
  numero_contacto: Joi.string().max(50).allow(null, ""),
  direccion: Joi.string().allow(null, ""),
  email: Joi.string().email().allow(null, ""),
  contacto_emergencia: Joi.string().max(100).allow(null, ""),
  edad: Joi.number().integer().min(0).allow(null),
  genero: Joi.string().valid("M", "F", "Otro").allow(null, ""),
  estado_civil: Joi.string().max(20).allow(null, ""),
  ocupacion: Joi.string().max(50).allow(null, ""),
  tipo_sangre: Joi.string().max(5).allow(null, ""),
  alergias: Joi.string().max(255).allow(null, ""),
  foto_url: Joi.string().max(255).allow(null, ""),
});

const usuarioSchema = Joi.object({
  id_rol: Joi.number().required(),
  nombre: Joi.string().min(2).max(50).required(),
  apellido: Joi.string().min(2).max(50).required(),
  curp: Joi.string().length(18).required(),
  fecha_nacimiento: Joi.date().required(),
  direccion: Joi.string().allow(null, ""),
  email: Joi.string().email().required(),
  telefono: Joi.string().max(15).allow(null, ""),
  password: Joi.string().min(6).required(),
  foto_url: Joi.string().max(255).allow(null, ""),
  status: Joi.number().valid(0, 1).default(1),
  fecha_registro: Joi.date().allow(null),
});

// Validación para Clinica
const clinicaSchema = Joi.object({
  nombre_marca: Joi.string().min(2).max(100).required(),
  ubicacion: Joi.string().min(2).max(255).required(),
  numero_contacto: Joi.string().max(50).allow(null, ""),
  email: Joi.string().email().allow(null, ""),
  fecha_creacion: Joi.date().allow(null),
  status: Joi.number().valid(0, 1).default(1),
});

// Validación para Estudio
const estudioSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  descripcion: Joi.string().max(255).allow(null, ""),
  precio: Joi.number().precision(2).min(0).allow(null),
  fecha_creacion: Joi.date().allow(null),
  status: Joi.number().valid(0, 1).default(1),
});

// Validación para Cita
const citaSchema = Joi.object({
  // Schema estricto alineado al DDL: requerir id_horario, id_clinica e id_servicio
  id_horario: Joi.number().required(),
  id_clinica: Joi.number().required(),
  id_servicio: Joi.number().required(),
  // id_paciente puede ser opcional en algunos flujos (se infiere desde el horario)
  id_paciente: Joi.number().allow(null),
  // Usamos 'fecha' y 'hora' en la API y el repo las mapea a fecha_cita/hora_cita según el esquema
  fecha: Joi.date().required(),
  hora: Joi.string()
    .pattern(/^([01]?\d|2[0-3]):[0-5]\d$/)
    .required(),
  motivo: Joi.string().max(255).allow(null, ""),
  atendido: Joi.boolean().default(false),
  id_estudio: Joi.number().allow(null),
  id_profesional: Joi.number().allow(null),
  id_usuario: Joi.number().allow(null),
  fecha_creacion: Joi.date().allow(null),
});

// Validación para SignosVitales
const signosVitalesSchema = Joi.object({
  id_paciente: Joi.number().required(),
  fecha_registro: Joi.date().optional(),
  peso: Joi.number().precision(2).min(0).allow(null),
  talla: Joi.number().precision(2).min(0).allow(null),
  temperatura: Joi.number().precision(2).min(0).allow(null),
  presion_arterial: Joi.string().max(20).allow(null, ""),
  frecuencia_cardiaca: Joi.number().integer().min(0).allow(null),
  frecuencia_respiratoria: Joi.number().integer().min(0).allow(null),
  glucemia: Joi.number().integer().min(0).allow(null),
  saturacion_oxigeno: Joi.number().precision(2).min(0).allow(null),
  imc: Joi.number().precision(2).min(0).allow(null),
});

// Validación para ExploracionFisica
const exploracionFisicaSchema = Joi.object({
  id_paciente: Joi.number().required(),
  fecha: Joi.date().required(),
  hallazgos: Joi.string().max(255).allow(null, ""),
  observaciones: Joi.string().max(255).allow(null, ""),
  status: Joi.number().valid(0, 1).default(1),
});

// Validación para GinecoObstetricia
const ginecoObstetriciaSchema = Joi.object({
  id_paciente: Joi.number().required(),
  menarca: Joi.date().allow(null),
  fum: Joi.date().allow(null),
  ivsa: Joi.date().allow(null),
  dismenorrea: Joi.boolean().default(false),
  embarazos: Joi.number().integer().min(0).allow(null),
  partos: Joi.number().integer().min(0).allow(null),
  cesareas: Joi.number().integer().min(0).allow(null),
  abortos: Joi.number().integer().min(0).allow(null)
});

// Validación para Receta
const recetaSchema = Joi.object({
  id_paciente: Joi.number().required(),
  id_usuario: Joi.number().required(),
  fecha: Joi.date().required(),
  medicamentos: Joi.string().max(255).allow(null, ""),
  indicaciones: Joi.string().max(255).allow(null, ""),
  status: Joi.number().valid(0, 1).default(1),
});

// Validación para NotaMedicaSeguimiento
const notaMedicaSeguimientoSchema = Joi.object({
  id_paciente: Joi.number().optional(),
  id_cita: Joi.number().required(),
  padecimiento_actual: Joi.string().allow(null, ""),
  id_signos_vitales: Joi.number().allow(null),
  id_exploracion_fisica: Joi.number().allow(null),
  id_examen_clinico: Joi.number().allow(null),
  diagnostico_idx: Joi.string().allow(null, ""),
  analisis: Joi.string().allow(null, ""),
  plan_medico: Joi.string().allow(null, ""),
  id_solicitud_estudio: Joi.number().allow(null),
  id_receta: Joi.number().allow(null),
  pronostico: Joi.string().allow(null, ""),
  id_profesional: Joi.number().required(),
  fecha_hora_atencion: Joi.date().optional(),
});

module.exports = {
  pacienteSchema,
  usuarioSchema,
  clinicaSchema,
  estudioSchema,
  citaSchema,
  signosVitalesSchema,
  exploracionFisicaSchema,
  ginecoObstetriciaSchema,
  recetaSchema,
  notaMedicaSeguimientoSchema,
};
