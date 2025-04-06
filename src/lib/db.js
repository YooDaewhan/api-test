// src/lib/db.js
import mariadb from "mariadb";

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

export const getConnection = async () => {
  try {
    const conn = await pool.getConnection();
    return conn;
  } catch (err) {
    throw err;
  }
};
