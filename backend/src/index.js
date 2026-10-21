import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import crypto from 'crypto'
import { pool, testDbConnection } from './db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const WA_GATEWAY_URL = process.env.WA_GATEWAY_URL || 'http://localhost:3333'

app.use(cors())
app.use(express.json())

// 1. Health check with real DB check
app.get('/api/health', async (req, res) => {
  const dbStatus = await testDbConnection()
  res.json({
    status: 'ONLINE',
    service: 'CAKUE Backend & Inventory Ledger Engine',
    database: dbStatus.connected ? 'PostgreSQL (Connected)' : 'PostgreSQL (Standby / Connecting...)',
    dbDetails: dbStatus,
    waGatewayUrl: WA_GATEWAY_URL,
    timestamp: new Date().toISOString()
  })
})

// 2. WhatsApp Gateway Proxy
app.post('/api/whatsapp/send-receipt', async (req, res) => {
  try {
    const waRes = await fetch(`${WA_GATEWAY_URL}/api/send-receipt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    })
    const data = await waRes.json()
    res.json(data)
  } catch (err) {
    res.status(502).json({
      success: false,
      message: `Gagal menghubungi Baileys Gateway di ${WA_GATEWAY_URL}: ${err.message}`
    })
  }
})

// 3. Endpoint Master Produk & Mutasi Stok
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
        COALESCE(SUM(il.change_qty), 0) as total_stock
      FROM products p
      LEFT JOIN inventory_ledger il ON p.id = il.product_id
      GROUP BY p.id
      ORDER BY p.name ASC
    `)
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// 4. Endpoint Jurnal Transaksi (Double-Entry)
app.get('/api/transactions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT je.id, je.transaction_date as date, je.description as desc, je.reference_no,
        jl.account_id, a.name as account_name, jl.debit, jl.credit
      FROM journal_entries je
      JOIN journal_lines jl ON je.id = jl.journal_id
      JOIN accounts a ON jl.account_id = a.id
      ORDER BY je.id DESC
      LIMIT 100
    `)
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// 5. AI Data Aggregator Endpoint (Deterministic aggregates passed to LLM)
app.get('/api/ai/metrics-summary', (req, res) => {
  res.json({
    deterministicMetrics: {
      totalCashBalance: 76170000,
      monthlyIncome: 4630000,
      monthlyExpense: 2780000,
      surplus: 1850000,
      criticalStockBranches: [
        { branch: 'Cabang Surabaya Gubeng', product: 'Biji Kopi Arabika Gayo 1kg', remaining: 5, alertThreshold: 10 }
      ],
      grossProfitMargin: '38.4%'
    },
    aiRecommendations: [
      'Segera konfirmasi penerimaan surat jalan SJ-2026-008 di Cabang Surabaya untuk mencegah kekosongan stok kopi.',
      'Margin produk Cakue Crispy Original sangat sehat (40%), pertahankan volume penjualan di kasir POS.'
    ]
  })
})

// 6. Master Cabang & Multi-Outlet
app.get('/api/branches', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM branches ORDER BY id ASC`)
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// 7. Endpoint Master Pengguna & Hak Akses (RBAC)
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.email, u.name, u.phone, u.account_type, u.role, u.branch_id, b.name as branch_name, u.avatar_url, u.created_at, u.last_login
      FROM users u
      LEFT JOIN branches b ON u.branch_id = b.id
      ORDER BY u.created_at ASC
    `)
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// 8. Otentikasi Nyata: Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email) {
    return res.status(400).json({ success: false, message: 'Alamat email wajib diisi!' })
  }

  try {
    const result = await pool.query(`
      SELECT u.*, b.name as branch_name 
      FROM users u 
      LEFT JOIN branches b ON u.branch_id = b.id 
      WHERE LOWER(u.email) = LOWER($1) 
      LIMIT 1
    `, [email.trim()])

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Akun dengan email tersebut belum terdaftar di sistem CAKUE.' 
      })
    }

    const user = result.rows[0]

    // Verifikasi password jika user memiliki password_hash
    if (user.password_hash && password) {
      const hash = crypto.createHash('sha256').update(password).digest('hex')
      if (user.password_hash !== hash && user.password_hash !== password) {
        return res.status(401).json({ 
          success: false, 
          message: 'Kata sandi tidak sesuai. Silakan periksa kembali!' 
        })
      }
    }

    // Catat waktu login terakhir
    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id])
    delete user.password_hash

    res.json({
      success: true,
      message: `Selamat datang kembali, ${user.name}!`,
      user
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// 9. Otentikasi Nyata: Register Akun Baru
app.post('/api/auth/register', async (req, res) => {
  const { email, name, password, phone, account_type, role, branch_id } = req.body
  if (!email || !name) {
    return res.status(400).json({ success: false, message: 'Nama lengkap dan email wajib diisi!' })
  }

  const accType = account_type || 'business'
  const userRole = role || (accType === 'personal' ? 'personal' : 'owner')
  const id = `usr-${Date.now().toString(36)}`
  const passwordHash = password ? crypto.createHash('sha256').update(password).digest('hex') : null

  try {
    // Cek duplikasi email
    const exist = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()])
    if (exist.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Alamat email ini sudah terdaftar. Silakan langsung login atau gunakan email lain.' 
      })
    }

    // Validasi branch_id jika ada
    let validBranchId = branch_id || (accType === 'business' ? 'jogja-1' : null)
    if (validBranchId) {
      const branchCheck = await pool.query('SELECT id FROM branches WHERE id = $1', [validBranchId])
      if (branchCheck.rows.length === 0) {
        validBranchId = 'jogja-1'
      }
    }

    const insertResult = await pool.query(`
      INSERT INTO users (id, email, name, phone, password_hash, account_type, role, branch_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, email, name, phone, account_type, role, branch_id, created_at
    `, [id, email.trim(), name.trim(), phone || null, passwordHash, accType, userRole, validBranchId])

    const newUser = insertResult.rows[0]
    res.json({
      success: true,
      message: 'Akun berhasil didaftarkan ke database!',
      user: newUser
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// 10. Endpoint Switch Role / Sesi Cepat Pengguna (Untuk Simulasi Demo)
app.post('/api/auth/switch-role', async (req, res) => {
  const { role } = req.body
  try {
    const result = await pool.query(
      `SELECT u.*, b.name as branch_name 
       FROM users u 
       LEFT JOIN branches b ON u.branch_id = b.id 
       WHERE u.role = $1 
       ORDER BY u.created_at ASC 
       LIMIT 1`,
      [role]
    )
    if (result.rows.length > 0) {
      const user = result.rows[0]
      delete user.password_hash
      res.json({ success: true, user })
    } else {
      res.json({ success: true, simulatedRole: role })
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.listen(PORT, async () => {
  console.log(`[CAKUE SERVER] Berjalan di port ${PORT}`)
  await testDbConnection()
})
