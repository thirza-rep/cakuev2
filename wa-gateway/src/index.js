import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import QRCode from 'qrcode'
import pino from 'pino'
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys'
import fs from 'fs'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3333
const AUTH_DIR = path.join(__dirname, '../auth_info_baileys')

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

let sock = null
let latestQrCode = null
let connectionStatus = 'INITIALIZING'
let connectedUser = null

// Pastikan direktori auth ada
if (!fs.existsSync(AUTH_DIR)) {
  fs.mkdirSync(AUTH_DIR, { recursive: true })
}

async function connectToWhatsApp() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR)
    const { version, isLatest } = await fetchLatestBaileysVersion()

    console.log(`[WA-GATEWAY] Inisialisasi Baileys v${version.join('.')}, isLatest: ${isLatest}`)

    sock = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: true,
      auth: state,
      browser: ['CAKUE POS Terminal', 'Chrome', '1.0.0'],
      syncFullHistory: false
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update

      if (qr) {
        latestQrCode = await QRCode.toDataURL(qr, { width: 320, margin: 2 })
        connectionStatus = 'WAITING_QR'
        console.log('[WA-GATEWAY] QR Code baru siap di-scan pada Web UI http://localhost:' + PORT)
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut

        console.log(`[WA-GATEWAY] Koneksi terputus (Status: ${statusCode}). Reconnect: ${shouldReconnect}`)
        connectionStatus = 'DISCONNECTED'
        latestQrCode = null
        connectedUser = null

        if (shouldReconnect) {
          setTimeout(connectToWhatsApp, 3000)
        } else {
          console.log('[WA-GATEWAY] Sesi berakhir/logout. Menghapus data sesi lama...')
          if (fs.existsSync(AUTH_DIR)) {
            fs.rmSync(AUTH_DIR, { recursive: true, force: true })
          }
          setTimeout(connectToWhatsApp, 2000)
        }
      } else if (connection === 'open') {
        connectionStatus = 'CONNECTED'
        latestQrCode = null
        connectedUser = sock.user
        console.log(`[WA-GATEWAY] ✅ Berhasil terhubung ke WhatsApp! User: ${sock.user?.id}`)
      }
    })
  } catch (err) {
    console.error('[WA-GATEWAY] Error saat menghubungkan:', err)
    connectionStatus = 'ERROR'
    setTimeout(connectToWhatsApp, 5000)
  }
}

// Format nomor HP ke format WhatsApp (e.g. 08123456789 -> 628123456789@s.whatsapp.net)
function formatToJid(phone) {
  let cleaned = phone.replace(/[^0-9]/g, '')
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1)
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned
  }
  return `${cleaned}@s.whatsapp.net`
}

// 1. API Status Gateway
app.get('/api/status', (req, res) => {
  res.json({
    status: connectionStatus,
    user: connectedUser,
    hasQr: !!latestQrCode,
    timestamp: new Date().toISOString()
  })
})

// 2. API QR Code untuk Scan
app.get('/api/qr', (req, res) => {
  res.json({
    qr: latestQrCode,
    status: connectionStatus
  })
})

// 3. API Kirim Struk Transaksi POS
app.post('/api/send-receipt', async (req, res) => {
  try {
    const { phone, customerName, orderId, total, subtotal, tax, paymentMethod, items, branchName } = req.body

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Nomor WhatsApp pembeli wajib diisi.' })
    }

    if (connectionStatus !== 'CONNECTED' || !sock) {
      return res.status(503).json({
        success: false,
        message: 'WhatsApp Gateway belum terhubung. Silakan scan QR code terlebih dahulu.'
      })
    }

    const jid = formatToJid(phone)

    // Susun item belanja
    let itemRows = ''
    if (items && Array.isArray(items)) {
      itemRows = items.map(it => `• ${it.name} (${it.qty}x) = Rp ${(it.price * it.qty).toLocaleString('id-ID')}`).join('\n')
    }

    const now = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })

    const receiptMessage = 
`🧾 *STRUK RESMI PEMBELIAN — CAKUE POS*
---------------------------------------
*No. Order*   : #${orderId || 'TRX-001'}
*Tanggal*     : ${now} WIB
*Cabang*      : ${branchName || 'Cabang Jakarta Selatan'}
*Pelanggan*   : ${customerName || 'Pelanggan Umum'}
---------------------------------------
*RINCIAN BELANJA:*
${itemRows || '• Item Produk'}
---------------------------------------
*Subtotal*    : Rp ${(subtotal || total).toLocaleString('id-ID')}
*PPN (11%)*   : Rp ${(tax || 0).toLocaleString('id-ID')}
*TOTAL BAYAR* : *Rp ${(total || 0).toLocaleString('id-ID')}*
*Metode*      : ${paymentMethod || 'CASH'} (LUNAS)
---------------------------------------
_Terima kasih telah berbelanja di CAKUE!_
_Simpan struk digital ini sebagai bukti transaksi sah._
_Sistem POS Terbuka & Zero-Cost Architecture._`

    await sock.sendMessage(jid, { text: receiptMessage })
    console.log(`[WA-GATEWAY] Struk #${orderId} berhasil dikirim ke ${phone}`)

    res.json({
      success: true,
      message: `Struk #${orderId} berhasil dikirim ke nomor ${phone}`,
      sentAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('[WA-GATEWAY] Gagal mengirim struk:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// 4. API Kirim Pesan Alert / Notifikasi Stok & Keuangan
app.post('/api/send-message', async (req, res) => {
  try {
    const { phone, message } = req.body

    if (!phone || !message) {
      return res.status(400).json({ success: false, message: 'Nomor telepon dan pesan wajib diisi.' })
    }

    if (connectionStatus !== 'CONNECTED' || !sock) {
      return res.status(503).json({ success: false, message: 'WhatsApp Gateway belum terhubung.' })
    }

    const jid = formatToJid(phone)
    await sock.sendMessage(jid, { text: message })

    res.json({ success: true, message: 'Pesan berhasil terkirim.' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// 5. API Reset / Logout Sesi
app.post('/api/logout', async (req, res) => {
  try {
    if (sock) {
      await sock.logout()
    }
    if (fs.existsSync(AUTH_DIR)) {
      fs.rmSync(AUTH_DIR, { recursive: true, force: true })
    }
    connectionStatus = 'DISCONNECTED'
    latestQrCode = null
    connectedUser = null
    setTimeout(connectToWhatsApp, 1500)
    res.json({ success: true, message: 'Berhasil logout dan mereset sesi WhatsApp.' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Start server and connect
app.listen(PORT, () => {
  console.log(`[WA-GATEWAY] Server berjalan di http://localhost:${PORT}`)
  connectToWhatsApp()
})
