const oracledb = require('oracledb');
require('dotenv').config();

const CLIENTES_COLLECTION = 'clientes';

(async () => {
  try {
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.CONNECT_STRING,
    });

    const connection = await oracledb.getConnection();
    const soda = connection.getSodaDatabase();
    const collection = await soda.openCollection(CLIENTES_COLLECTION);

    // 🚫 Eliminar documentos con assignmentMethod SIN intentar leerlos
    const result = await collection.find()
      .filter({ assignmentMethod: { "$exists": true } })
      .remove();

    console.log(`🧹 Documentos eliminados: ${result.count}`);
    
    await connection.close();
    await oracledb.getPool().close();
    console.log('✔️ Limpieza completada.');
  } catch (err) {
    console.error('❌ Error limpiando documentos:', err);
  }
})();
