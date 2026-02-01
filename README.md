# 🏥 **Backend de Clínica - API REST Simple**

Backend desarrollado con **Node.js** y **Express** conectándose a **SQL Server** usando **mssql nativo**.

## 🚀 **Características**

- ✅ **Estructura simple** y fácil de entender
- ✅ **Conexión directa a SQL Server** (mssql)
- ✅ **Autenticación JWT**
- ✅ **CRUD completo** para pacientes y usuarios
- ✅ **Validaciones básicas**
- ✅ **Paginación automática**

## 🏗️ **Estructura del Proyecto**

```
ClinicaBE/
├── src/
│   ├── config/
│   │   └── database.js      # Conexión a SQL Server
│   └── routes/
│       ├── pacientes.js     # Rutas de pacientes
│       ├── usuarios.js      # Rutas de usuarios
│       └── auth.js          # Rutas de autenticación
├── .env                     # Variables de entorno
├── server.js                # Servidor principal
└── package.json
```

## 📋 **Requisitos**

- **Node.js** (versión 18+)
- **SQL Server** (2019+)
- **npm**

## 🔧 **Instalación**

1. **Instalar dependencias:**

   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**

   ```bash
   # Copiar archivo de ejemplo
   copy env.example .env

   # Editar .env con tus credenciales
   ```

3. **Configurar base de datos:**
   - Crear base de datos `ClinicaDB`
   - Ejecutar script SQL para crear tablas

## ⚙️ **Configuración (.env)**

```env
# Servidor
PORT=3001
NODE_ENV=development

# Base de datos
DBUSER=sa
DBPASSWORD=tu_contraseña
DBSERVER=localhost
DATABASE=ClinicaDB

# JWT
TOKEN_KEY=tu_clave_secreta
TOKEN_EXPIRY=24h
```

## 🚀 **Ejecución**

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

El servidor se iniciará en **http://localhost:3001**

## 📡 **Endpoints de la API**

### **🔐 Autenticación**

#### **POST /api/auth/login**

```json
{
  "email": "usuario@clinica.com",
  "password": "contraseña123"
}
```

#### **POST /api/auth/register**

```json
{
  "id_rol": 2,
  "nombre": "Dr. Juan",
  "apellido": "Pérez",
  "curp": "PERJ800315HDFXXX01",
  "email": "juan.perez@clinica.com",
  "password": "contraseña123",
  "fecha_nacimiento": "1980-03-15"
}
```

### **👥 Pacientes**

#### **GET /api/pacientes**

- `?pagina=1&limite=10` - Paginación
- `?buscar=Juan` - Búsqueda por nombre/apellido/CURP

#### **POST /api/pacientes**

```json
{
  "nombre": "María",
  "apellido": "García",
  "curp_paciente": "GARM850315MDFXXX01",
  "fecha_nacimiento": "1985-03-15",
  "numero_contacto": "555-123-4567",
  "genero": "F"
}
```

#### **GET /api/pacientes/:id** - Obtener por ID

#### **PUT /api/pacientes/:id** - Actualizar

#### **DELETE /api/pacientes/:id** - Eliminar

### **👤 Usuarios**

#### **GET /api/usuarios** - Lista de usuarios

#### **GET /api/usuarios/medicos** - Solo médicos

#### **GET /api/usuarios/:id** - Por ID

#### **POST /api/usuarios** - Crear usuario

#### **PUT /api/usuarios/:id** - Actualizar

#### **DELETE /api/usuarios/:id** - Eliminar

## 🗄️ **Base de Datos**

### **Tabla: Paciente**

```sql
CREATE TABLE Paciente (
  id_paciente INT IDENTITY(1,1) PRIMARY KEY,
  nombre NVARCHAR(50) NOT NULL,
  apellido NVARCHAR(50) NOT NULL,
  curp_paciente NVARCHAR(18) UNIQUE NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  numero_contacto NVARCHAR(50) NULL,
  direccion NVARCHAR(MAX) NULL,
  email NVARCHAR(100) NULL,
  contacto_emergencia NVARCHAR(100) NULL,
  genero NVARCHAR(10) CHECK (genero IN ('M', 'F', 'Otro')),
  estado_civil NVARCHAR(20) NULL,
  ocupacion NVARCHAR(50) NULL,
  tipo_sangre NVARCHAR(5) NULL,
  alergias NVARCHAR(5) NULL,
  foto_url NVARCHAR(255) NULL
);
```

### **Tabla: Usuario**

```sql
CREATE TABLE Usuario (
  id_usuario INT IDENTITY(1,1) PRIMARY KEY,
  id_rol INT NOT NULL,
  id_ocupacion INT NULL,
  nombre NVARCHAR(50) NOT NULL,
  apellido NVARCHAR(50) NOT NULL,
  curp NVARCHAR(18) UNIQUE NOT NULL,
  email NVARCHAR(100) UNIQUE NOT NULL,
  password_hash NVARCHAR(255) NOT NULL,
  numero_contacto NVARCHAR(50) NULL,
  direccion NVARCHAR(MAX) NULL,
  fecha_nacimiento DATE NOT NULL,
  genero NVARCHAR(10) CHECK (genero IN ('M', 'F', 'Otro')),
  estado_civil NVARCHAR(20) NULL,
  foto_url NVARCHAR(255) NULL,
  fecha_registro DATETIME DEFAULT GETDATE(),
  activo TINYINT DEFAULT 1
);
```

## 🧪 **Pruebas**


## Probar conexión a la base de datos
 La conexión ahora se realiza automáticamente al iniciar el servidor (server.js).
```bash
npm run dev #para ejecutar el proyecto y iniciar el servidor y hace la conexion a la base de datos

# Probar endpoints
curl http://localhost:3001/health
curl http://localhost:3001/api/pacientes
```

## 🛠️ **Tecnologías**

- **Node.js** + **Express**
- **mssql** (SQL Server nativo)
- **JWT** (autenticación)
- **bcrypt** (hashing de contraseñas)
- **CORS** habilitado

## 🚨 **Solución de Problemas**

### **Error de Conexión:**

1. Verificar que SQL Server esté ejecutándose
2. Confirmar credenciales en `.env`
3. Verificar que la base de datos exista

### **Error de Puerto:**

1. Cambiar `PORT` en `.env`
2. Verificar que no haya otros servicios usando el puerto

---

**¡Simple, directo y funcional! 🚀**
