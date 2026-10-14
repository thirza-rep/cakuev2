import pkg from 'pg'
const { Pool } = pkg
import dotenv from 'dotenv'

dotenv.config()

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://cakue_user:cakue_password_secure2026@192.168.1.13:5433/cakue_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000
})

pool.on('error', (err) => {
  console.error('[DB-POOL] Unexpected error on idle client:', err)
})

export async function testDbConnection() {
  try {
    const res = await pool.query('SELECT NOW() as current_time, current_database() as db_name')
    console.log(`[POSTGRES] Terhubung ke ${res.rows[0].db_name} @ ${res.rows[0].current_time}`)
    return { connected: true, details: res.rows[0] }
  } catch (error) {
    console.warn(`[POSTGRES] Belum dapat terhubung ke PostgreSQL: ${error.message}`)
    return { connected: false, error: error.message }
  }
}
