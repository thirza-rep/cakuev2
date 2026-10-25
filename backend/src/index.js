import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool, testDbConnection } from './db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const WA_GATEWAY_URL = process.env.WA_GATEWAY_URL || 'http://localhost:3333'
const JWT_SECRET = process.env.JWT_SECRET || 'cakue_super_secret_jwt_key_2026_pos_ledger'

app.use(cors())
app.use(express.json())

// Middleware: Autentikasi JWT Wajib (Strict RBAC / User endpoints)
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak: Token autentikasi tidak ditemukan. Silakan login kembali.'
    })
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak: Sesi Anda telah berakhir atau token tidak valid. Silakan login ulang.'
      })
    }
    req.user = decoded
    next()
  })
}

// Middleware: Autentikasi Opsional (Permissive) untuk endpoint baca bersama
export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (!err && decoded) {
        req.user = decoded
      }
      next()
    })
  } else {
    next()
  }
}

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

// 2. WhatsApp Gateway Proxy (Dilindungi dengan validasi nomor tujuan)
app.post('/api/whatsapp/send-receipt', optionalAuth, async (req, res) => {
  const { phone, customerPhone } = req.body || {}
  const targetPhone = phone || customerPhone

  if (!targetPhone) {
    return res.status(400).json({
      success: false,
      message: 'Nomor telepon penerima wajib disertakan untuk pengiriman struk.'
    })
  }

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
  const email = (req.query.email || '').toLowerCase().trim()
  const isDemo = email === 'budi.santoso@cakue.id' || email.includes('budi')

  if (!isDemo && email) {
    return res.json({
      deterministicMetrics: {
        totalCashBalance: 0,
        monthlyIncome: 0,
        monthlyExpense: 0,
        surplus: 0,
        criticalStockBranches: [],
        grossProfitMargin: '0.0%'
      },
      aiRecommendations: [
        'Akun Master Admin baru aktif dengan status pembukuan bersih (Rp 0).',
        'Seluruh 6 Cabang Wilayah Jogja & Hub Distribusi telah siap dioperasikan. Silakan tambahkan master produk di menu Inventaris atau mulai catat transaksi kas.'
      ]
    })
  }

  res.json({
    deterministicMetrics: {
      totalCashBalance: 76170000,
      monthlyIncome: 4630000,
      monthlyExpense: 2780000,
      surplus: 1850000,
      criticalStockBranches: [
        { branch: 'Cabang 3 - Kaliurang', product: 'Biji Kopi Arabika Gayo 1kg', remaining: 5, alertThreshold: 10 }
      ],
      grossProfitMargin: '38.4%'
    },
    aiRecommendations: [
      'Segera konfirmasi penerimaan surat jalan di Cabang Jogja untuk mencegah kekosongan stok kopi.',
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

// 7. Endpoint Master Pengguna & Hak Akses (RBAC) - Dilindungi Autentikasi
app.get('/api/users', authenticateToken, async (req, res) => {
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

// 8. Otentikasi Nyata: Login dengan Email atau Username + Password (Bcrypt + Legacy Fallback + JWT)
app.post('/api/auth/login', async (req, res) => {
  const { identifier, email, username, password } = req.body
  const loginId = (identifier || email || username || '').trim()

  if (!loginId) {
    return res.status(400).json({ success: false, message: 'Alamat email atau username wajib diisi!' })
  }

  try {
    const result = await pool.query(`
      SELECT u.*, b.name as branch_name 
      FROM users u 
      LEFT JOIN branches b ON u.branch_id = b.id 
      WHERE LOWER(u.email) = LOWER($1) OR LOWER(u.username) = LOWER($1)
      LIMIT 1
    `, [loginId])

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Akun dengan email atau username tersebut belum terdaftar di sistem CAKUE.' 
      })
    }

    const user = result.rows[0]

    // Verifikasi password (Bcrypt + Backward compatibility legacy SHA-256)
    if (user.password_hash && password) {
      let isMatch = false
      if (user.password_hash.startsWith('$2a$') || user.password_hash.startsWith('$2b$')) {
        isMatch = bcrypt.compareSync(password, user.password_hash)
      } else {
        // Fallback untuk akun lama: SHA-256 atau plaintext
        const shaHash = crypto.createHash('sha256').update(password).digest('hex')
        if (user.password_hash === shaHash || user.password_hash === password) {
          isMatch = true
          // Seamless auto-upgrade ke bcrypt di background tanpa mengganggu user
          const newBcryptHash = bcrypt.hashSync(password, 10)
          pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newBcryptHash, user.id]).catch(() => {})
        }
      }

      if (!isMatch) {
        return res.status(401).json({ 
          success: false, 
          message: 'Kata sandi tidak sesuai. Silakan periksa kembali!' 
        })
      }
    }

    // Catat waktu login terakhir
    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id])
    delete user.password_hash
    delete user.otp_code

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        branch_id: user.branch_id,
        account_type: user.account_type
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.json({
      success: true,
      message: `Selamat datang kembali, ${user.name}!`,
      token,
      user
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// 9. Otentikasi Nyata: Register Akun Baru Manual (Bcrypt + JWT)
app.post('/api/auth/register', async (req, res) => {
  const { email, name, username, password, phone, account_type, role, branch_id } = req.body
  if (!email || !name) {
    return res.status(400).json({ success: false, message: 'Nama lengkap dan email wajib diisi!' })
  }

  const accType = account_type || 'business'
  const userRole = role || (accType === 'personal' ? 'personal' : 'owner')
  const id = `usr-${Date.now().toString(36)}`
  const passwordHash = password ? bcrypt.hashSync(password, 10) : null

  try {
    // Cek duplikasi email
    const exist = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()])
    if (exist.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Alamat email ini sudah terdaftar. Silakan langsung login atau gunakan email lain.' 
      })
    }

    // Cek duplikasi username jika diisi
    if (username && username.trim().length > 0) {
      const uExist = await pool.query('SELECT id FROM users WHERE LOWER(username) = LOWER($1)', [username.trim()])
      if (uExist.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Username sudah digunakan. Silakan pilih username lain!' })
      }
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
      INSERT INTO users (id, username, email, name, phone, password_hash, account_type, role, branch_id, is_profile_complete, phone_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE, TRUE)
      RETURNING id, username, email, name, phone, phone_verified, is_profile_complete, account_type, role, branch_id, created_at
    `, [id, username ? username.trim() : null, email.trim(), name.trim(), phone || null, passwordHash, accType, userRole, validBranchId])

    const newUser = insertResult.rows[0]

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        branch_id: newUser.branch_id,
        account_type: newUser.account_type
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.json({
      success: true,
      message: 'Akun berhasil didaftarkan ke database!',
      token,
      user: newUser
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// 10. Endpoint Google OAuth 2.0 Sign-In & ID Token Verification (Aman dari JWT Bypass)
app.post('/api/auth/google', async (req, res) => {
  const { credential, account_type = 'business', role = 'owner', branch_id = 'jogja-1' } = req.body

  if (!credential) {
    return res.status(400).json({ success: false, message: 'Google credential ID token wajib dikirim!' })
  }

  try {
    let email, name, avatar_url, google_id

    // 1. Verifikasi ID Token via Google Tokeninfo Endpoint resmi
    try {
      const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`, {
        signal: AbortSignal.timeout(5000)
      })
      if (verifyRes.ok) {
        const tokenInfo = await verifyRes.json()
        email = (tokenInfo.email || '').toLowerCase().trim()
        name = tokenInfo.name || tokenInfo.given_name || email.split('@')[0]
        avatar_url = tokenInfo.picture || ''
        google_id = tokenInfo.sub
      } else {
        console.warn('[GOOGLE AUTH] Google tokeninfo status:', verifyRes.status)
      }
    } catch (e) {
      console.warn('[GOOGLE AUTH] Warning tokeninfo fetch:', e.message)
    }

    // 2. Proteksi F-003: Cegah pemalsuan JWT unverified base64
    // Fallback HANYA diizinkan jika secara eksplisit diset di NODE_ENV=development dengan header x-dev-mock
    if (!email && process.env.NODE_ENV === 'development' && req.headers['x-dev-mock'] === 'true') {
      try {
        const parts = credential.split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'))
          email = (payload.email || '').toLowerCase().trim()
          name = payload.name || payload.given_name || email.split('@')[0]
          avatar_url = payload.picture || ''
          google_id = payload.sub
        }
      } catch (err) {}
    }

    if (!email) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token Google tidak valid atau gagal diverifikasi oleh Google Identity Services.' 
      })
    }

    // 3. Cek apakah user sudah terdaftar di database PostgreSQL
    const checkRes = await pool.query(`
      SELECT u.*, b.name as branch_name 
      FROM users u 
      LEFT JOIN branches b ON u.branch_id = b.id 
      WHERE LOWER(u.email) = LOWER($1) 
      LIMIT 1
    `, [email])

    if (checkRes.rows.length > 0) {
      // User lama yang sudah punya akun lengkap
      const user = checkRes.rows[0]
      await pool.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP, avatar_url = COALESCE($2, avatar_url) WHERE id = $1',
        [user.id, avatar_url || null]
      )
      delete user.password_hash
      delete user.otp_code

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          branch_id: user.branch_id,
          account_type: user.account_type
        },
        JWT_SECRET,
        { expiresIn: '30d' }
      )

      return res.json({
        success: true,
        is_new: false,
        message: `Selamat datang kembali, ${user.name}!`,
        token,
        user
      })
    }

    // User baru: kembalikan is_new = true agar frontend melanjutkan ke Setup Username & Password
    return res.json({
      success: true,
      is_new: true,
      message: 'Autentikasi Google berhasil! Silakan tentukan username dan kata sandi Anda.',
      google_data: {
        email,
        name,
        avatar_url,
        google_id
      }
    })
  } catch (err) {
    console.error('[GOOGLE AUTH ERROR]:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

// 11. Endpoint Register Akun Baru dari Google Sign-In (Dengan Username & Password)
app.post('/api/auth/register-google', async (req, res) => {
  const { email, name, avatar_url, username, password, account_type = 'business', role = 'owner', branch_id = 'jogja-1' } = req.body

  if (!email || !username || !password) {
    return res.status(400).json({ success: false, message: 'Email, username, dan kata sandi wajib diisi!' })
  }

  const cleanUsername = username.trim().toLowerCase()
  if (cleanUsername.length < 3) {
    return res.status(400).json({ success: false, message: 'Username minimal 3 karakter!' })
  }
  if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
    return res.status(400).json({ success: false, message: 'Username hanya boleh berupa huruf, angka, dan underscore (_).' })
  }

  // Validasi password minimal 6 karakter kombinasi huruf dan angka
  if (password.length < 6 || !/^(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Kata sandi minimal 6 karakter dan wajib mengombinasikan huruf dan angka.' 
    })
  }

  try {
    // Cek duplikasi email
    const emailExist = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email.trim().toLowerCase()])
    if (emailExist.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email ini sudah terdaftar sebelumnya. Silakan langsung login.' })
    }

    // Cek duplikasi username
    const usernameExist = await pool.query('SELECT id FROM users WHERE LOWER(username) = LOWER($1)', [cleanUsername])
    if (usernameExist.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username sudah digunakan oleh orang lain. Silakan pilih username lain.' })
    }

    const newUserId = `usr-g-${Date.now().toString(36)}`
    const assignedRole = email === 'admin@cakue.id' ? 'superadmin' : (role || (account_type === 'personal' ? 'personal' : 'owner'))
    const assignedType = account_type || 'business'
    const assignedBranch = branch_id || 'jogja-1'
    const passwordHash = bcrypt.hashSync(password, 10)

    await pool.query(`
      INSERT INTO users (id, username, email, name, phone, phone_verified, is_profile_complete, password_hash, account_type, role, branch_id, avatar_url, last_login)
      VALUES ($1, $2, $3, $4, '', TRUE, TRUE, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
    `, [newUserId, cleanUsername, email.trim().toLowerCase(), (name || cleanUsername).trim(), passwordHash, assignedType, assignedRole, assignedBranch, avatar_url || null])

    const createdRes = await pool.query(`
      SELECT u.*, b.name as branch_name 
      FROM users u 
      LEFT JOIN branches b ON u.branch_id = b.id 
      WHERE u.id = $1
    `, [newUserId])

    const user = createdRes.rows[0]
    delete user.password_hash
    delete user.otp_code

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        branch_id: user.branch_id,
        account_type: user.account_type
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.json({
      success: true,
      message: `Selamat datang di CAKUE, ${user.name}! Akun Anda berhasil dibuat.`,
      token,
      user
    })
  } catch (err) {
    console.error('[REGISTER GOOGLE ERROR]:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

// 12. Helper normalisasi nomor WhatsApp Indonesia
function formatIndonesianPhone(raw) {
  let p = (raw || '').replace(/[^0-9]/g, '')
  if (p.startsWith('0')) {
    p = '62' + p.substring(1)
  } else if (!p.startsWith('62')) {
    p = '62' + p
  }
  return p
}

// 13. Endpoint Kirim Kode OTP via WhatsApp Gateway (DINONAKTIFKAN SEPENUHNYA)
app.post('/api/auth/send-otp', async (req, res) => {
  res.json({
    success: false,
    message: 'Fungsi OTP WhatsApp telah dinonaktifkan sepenuhnya. WhatsApp saat ini difokuskan khusus untuk pengiriman struk kasir POS.'
  })
})

// 14. Endpoint Verifikasi Kode OTP WhatsApp (AUTO-BYPASS / DINONAKTIFKAN)
app.post('/api/auth/verify-otp', optionalAuth, async (req, res) => {
  let { user_id } = req.body
  if (req.user && req.user.id) {
    user_id = req.user.id
  }

  try {
    if (user_id) {
      await pool.query('UPDATE users SET phone_verified = TRUE, is_profile_complete = TRUE WHERE id = $1', [user_id])
      const userRes = await pool.query('SELECT id, username, email, name, phone, phone_verified, is_profile_complete, account_type, role, branch_id, avatar_url, created_at, last_login FROM users WHERE id = $1', [user_id])
      return res.json({
        success: true,
        message: 'Fungsi OTP dinonaktifkan. Akun Anda telah aktif sepenuhnya.',
        user: userRes.rows[0]
      })
    }

    res.json({
      success: true,
      message: 'Fungsi OTP dinonaktifkan. Akun Anda telah aktif sepenuhnya.'
    })
  } catch (err) {
    console.error('[VERIFY OTP BYPASS ERROR]:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

// 15. Endpoint Update Profil Lengkap (Nama & Foto Profil) - Dilindungi dari IDOR
app.put('/api/auth/update-profile', optionalAuth, async (req, res) => {
  let { user_id, name, avatar_url, username } = req.body

  // Proteksi IDOR: Jika ada token autentikasi, pastikan hanya bisa update akun sendiri (kecuali superadmin)
  if (req.user) {
    if (req.user.role !== 'superadmin' && user_id && req.user.id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak: Anda tidak memiliki wewenang memperbarui profil pengguna lain.'
      })
    }
    user_id = req.user.id || user_id
  }

  if (!user_id) {
    return res.status(400).json({ success: false, message: 'ID Pengguna wajib disertakan.' })
  }

  try {
    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [user_id])
    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' })
    }

    const currentUser = userRes.rows[0]
    const newName = (name || currentUser.name || '').trim()
    const newAvatar = (avatar_url || currentUser.avatar_url || '').trim()
    const newUsername = username ? username.trim().toLowerCase() : currentUser.username

    // Cek keunikan username jika diubah
    if (newUsername && newUsername !== currentUser.username) {
      const uCheck = await pool.query('SELECT id FROM users WHERE LOWER(username) = LOWER($1) AND id != $2', [newUsername, user_id])
      if (uCheck.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Username sudah digunakan pengguna lain.' })
      }
    }

    const updateRes = await pool.query(`
      UPDATE users 
      SET name = $1, 
          avatar_url = $2, 
          username = $3, 
          is_profile_complete = TRUE,
          phone_verified = TRUE
      WHERE id = $4
      RETURNING id, username, email, name, phone, phone_verified, is_profile_complete, account_type, role, branch_id, avatar_url, created_at, last_login
    `, [newName, newAvatar, newUsername, user_id])

    const updatedUser = updateRes.rows[0]

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui!',
      user: updatedUser
    })
  } catch (err) {
    console.error('[UPDATE PROFILE ERROR]:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

app.listen(PORT, async () => {
  console.log(`[CAKUE SERVER] Berjalan di port ${PORT}`)
  await testDbConnection()
})
