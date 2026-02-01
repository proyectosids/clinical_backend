const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "1433", 10),
  options: {
    trustServerCertificate: true,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {jhbjhbjhb
    iuhoio
    
    console.log(" Conectado a SQL Server");
    return pool;
  })
  .catch(err => {
    console.error("💢 Error conectando a SQL Server:", err);
    throw err;
  });

async function executeQuery(query, params = []) {
  const pool = await poolPromise;
  const request = pool.request();
  // Agregar parámetros como @param0, @param1, ...
  params.forEach((value, idx) => {
    request.input(`param${idx}`, value);
  });
  const result = await request.query(query);
  return result.recordset;
}

async function getPool() {
  return await poolPromise;
}

module.exports = { sql, poolPromise, executeQuery, getPool };