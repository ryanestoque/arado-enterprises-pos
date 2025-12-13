import mysql from 'mysql2/promise'
import dotenv from "dotenv"

dotenv.config()

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 4000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2'
  }
});

(async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Connected to TiDB Cloud successfully!');
    connection.release();
  } catch (err: any) {
    console.error('❌ Database connection failed:', err.message);
  }
})();


export default db;

// import mysql from 'mysql2/promise'
// import dotenv from "dotenv"

// dotenv.config()

// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   ssl: {
//     rejectUnauthorized: false
//   }
// })

// export default db;
