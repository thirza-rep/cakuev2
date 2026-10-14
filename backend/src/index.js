import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
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

// 6. Endpoint Master Pengguna & Hak Akses (RBAC)
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.email, u.name, u.phone, u.account_type, u.role, u.branch_id, b.name as branch_name, u.avatar_url, u.created_at
      FROM users u
      LEFT JOIN branches b ON u.branch_id = b.id
      ORDER BY u.created_at ASC
    `)
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// 7. Endpoint Switch Role / Sesi Pengguna
app.post('/api/auth/switch-role', async (req, res) => {
  const { role } = req.body
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE role = $1 LIMIT 1`,
      [role]
    )
    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] })
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
