# API de Servicios Médicos - Clínica

## Descripción

API REST para el manejo de servicios médicos de la clínica. Permite realizar operaciones CRUD completas sobre los servicios ofrecidos, tanto para el panel administrativo como para mostrar información a los pacientes en la página estática.

## Estructura de la Base de Datos

La tabla `Servicio` tiene la siguiente estructura:

```sql
CREATE TABLE Servicio (
    id_servicio INT IDENTITY(1,1) PRIMARY KEY,
    nombre_servicio NVARCHAR(100) NOT NULL,
    descripcion NVARCHAR(MAX) NULL,
    costo DECIMAL(10,2) NOT NULL,
    horario NVARCHAR(100) NULL,
    url_imagen NVARCHAR(255) NULL,
    creado_en DATETIME DEFAULT GETDATE(),
    actualizado_en DATETIME DEFAULT GETDATE(),
    status TINYINT DEFAULT 1
);
```

## Endpoints

### 1. Obtener todos los servicios (Público)

- **URL:** `GET /api/servicios`
- **Autenticación:** No requerida
- **Descripción:** Obtiene la lista de todos los servicios disponibles para mostrar en la página estática

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": [
    {
      "id_servicio": 1,
      "nombre_servicio": "Consulta General",
      "descripcion": "Consulta médica general para evaluación de síntomas y diagnóstico básico",
      "costo": 500.0,
      "horario": "Lunes a Viernes 8:00-18:00",
      "url_imagen": "https://ejemplo.com/consulta-general.jpg",
      "creado_en": "2024-01-01T10:00:00.000Z",
      "actualizado_en": "2024-01-01T10:00:00.000Z",
      "status": 1
    }
  ]
}
```

### 2. Obtener servicio por ID (Público)

- **URL:** `GET /api/servicios/:id`
- **Autenticación:** No requerida
- **Parámetros:**
  - `id` (number): ID del servicio

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": {
    "id_servicio": 1,
    "nombre_servicio": "Consulta General",
    "descripcion": "Consulta médica general para evaluación de síntomas y diagnóstico básico",
    "costo": 500.0,
    "horario": "Lunes a Viernes 8:00-18:00",
    "url_imagen": "https://ejemplo.com/consulta-general.jpg",
    "creado_en": "2024-01-01T10:00:00.000Z",
    "actualizado_en": "2024-01-01T10:00:00.000Z",
    "status": 1
  }
}
```

### 3. Crear nuevo servicio (Panel Administrativo)

- **URL:** `POST /api/servicios`
- **Autenticación:** Requerida (JWT)
- **Descripción:** Crea un nuevo servicio médico

**Cuerpo de la petición:**

```json
{
  "nombre_servicio": "Consulta de Cardiología",
  "descripcion": "Consulta especializada en enfermedades del corazón y sistema cardiovascular",
  "costo": 800.0,
  "horario": "Lunes a Viernes 9:00-17:00",
  "url_imagen": "https://ejemplo.com/cardiologia.jpg",
  "status": 1
}
```

**Campos requeridos:**

- `nombre_servicio` (string): Nombre del servicio
- `costo` (number): Costo del servicio

**Campos opcionales:**

- `descripcion` (string): Descripción detallada del servicio
- `horario` (string): Horarios de atención
- `url_imagen` (string): URL de imagen del servicio
- `status` (number): Estado del servicio (1=activo, 0=inactivo)

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": "Servicio creado exitosamente",
  "id": 6
}
```

### 4. Actualizar servicio (Panel Administrativo)

- **URL:** `PUT /api/servicios/:id`
- **Autenticación:** Requerida (JWT)
- **Parámetros:**
  - `id` (number): ID del servicio a actualizar

**Cuerpo de la petición:**

```json
{
  "nombre_servicio": "Consulta de Cardiología Actualizada",
  "descripcion": "Consulta especializada en enfermedades del corazón y sistema cardiovascular",
  "costo": 850.0,
  "horario": "Lunes a Viernes 9:00-18:00",
  "url_imagen": "https://ejemplo.com/cardiologia-actualizada.jpg",
  "status": 1
}
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Servicio actualizado exitosamente"
}
```

### 5. Eliminar servicio (Panel Administrativo)

- **URL:** `DELETE /api/servicios/:id`
- **Autenticación:** Requerida (JWT)
- **Parámetros:**
  - `id` (number): ID del servicio a eliminar

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Servicio eliminado exitosamente"
}
```

## Códigos de Error

### 400 - Bad Request

```json
{
  "success": false,
  "error": "Los campos nombre_servicio y costo son requeridos"
}
```

### 401 - Unauthorized

```json
{
  "success": false,
  "error": "Token no proporcionado"
}
```

### 404 - Not Found

```json
{
  "success": false,
  "error": "Servicio no encontrado"
}
```

### 500 - Internal Server Error

```json
{
  "success": false,
  "error": "Error interno del servidor"
}
```

## Autenticación

Para las operaciones del panel administrativo (crear, actualizar, eliminar), se requiere un token JWT válido en el header:

```
Authorization: Bearer <tu_token_jwt>
```

## Ejemplos de Uso

### Frontend - Obtener servicios para página estática

```javascript
const response = await fetch("/api/servicios");
const data = await response.json();
console.log(data.data); // Array de servicios
```

### Frontend - Crear servicio (Panel Administrativo)

```javascript
const nuevoServicio = {
  nombre_servicio: "Consulta de Neurología",
  descripcion: "Consulta especializada en enfermedades del sistema nervioso",
  costo: 900.0,
  horario: "Lunes a Viernes 10:00-16:00",
  url_imagen: "https://ejemplo.com/neurologia.jpg",
};

const response = await fetch("/api/servicios", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(nuevoServicio),
});

const result = await response.json();
```

### Frontend - Actualizar servicio (Panel Administrativo)

```javascript
const servicioActualizado = {
  nombre_servicio: "Consulta de Neurología",
  descripcion:
    "Consulta especializada en enfermedades del sistema nervioso central y periférico",
  costo: 950.0,
  horario: "Lunes a Viernes 9:00-17:00",
  url_imagen: "https://ejemplo.com/neurologia-actualizada.jpg",
};

const response = await fetch(`/api/servicios/${id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(servicioActualizado),
});
```

### Frontend - Eliminar servicio (Panel Administrativo)

```javascript
const response = await fetch(`/api/servicios/${id}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const result = await response.json();
```

## Configuración del Servidor

El servidor está configurado para ejecutarse en el puerto 3001. Asegúrate de tener las siguientes variables de entorno configuradas:

```env
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_SERVER=tu_servidor
DB_NAME=ClinicaDB
DB_PORT=1433
JWT_SECRET=tu_secreto_jwt
```

## Testing

Para probar la API, puedes usar:

1. **Postman**: Importa la colección de Postman incluida
2. **cURL**: Usa los ejemplos de comandos cURL
3. **Frontend**: Conecta tu aplicación Vue.js con estos endpoints

## Notas Importantes

- Las rutas GET son públicas para permitir que la página estática muestre los servicios
- Las rutas POST, PUT y DELETE requieren autenticación JWT para el panel administrativo
- Los campos `creado_en` y `actualizado_en` se manejan automáticamente por la base de datos
- El campo `status` permite activar/desactivar servicios sin eliminarlos

