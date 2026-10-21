import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// --- 1. DATA DUMMY / DEMO KHUSUS UNTUK AKUN BUDI SANTOSO ---
export const DUMMY_ACCOUNTS = [
  { id: 'acc-1', name: 'Dompet Tunai (Cash)', balance: 1850000, type: 'cash', icon: 'Wallet' },
  { id: 'acc-2', name: 'BCA Prioritas', balance: 24500000, type: 'bank', icon: 'Building' },
  { id: 'acc-3', name: 'Bank Mandiri Bisnis', balance: 48900000, type: 'bank', icon: 'Building2' },
  { id: 'acc-4', name: 'GoPay & OVO E-Wallet', balance: 920000, type: 'ewallet', icon: 'Smartphone' }
]

export const DUMMY_TRANSACTIONS = [
  { id: 'TRX-1007', date: '2026-10-16', time: '08:30', category: 'Penjualan / Omset', desc: 'Pendapatan Kasir & QRIS Pagi', type: 'income', amount: 4250000, account: 'BCA Prioritas', tag: 'Bisnis', verified: true },
  { id: 'TRX-1008', date: '2026-10-16', time: '11:15', category: 'Bahan Baku', desc: 'Pembelian Kopi & Bahan Pokok', type: 'expense', amount: 950000, account: 'Bank Mandiri Bisnis', tag: 'HPP', verified: true },
  { id: 'TRX-1009', date: '2026-10-16', time: '13:45', category: 'Makan & Minum', desc: 'Makan Siang & Snack Tim', type: 'expense', amount: 125000, account: 'GoPay & OVO E-Wallet', tag: 'Operasional', verified: true },
  { id: 'TRX-1010', date: '2026-10-15', time: '10:00', category: 'Jasa & Konsultasi', desc: 'Pelunasan Desain Digital Klien', type: 'income', amount: 2800000, account: 'BCA Prioritas', tag: 'Project', verified: true },
  { id: 'TRX-1011', date: '2026-10-15', time: '16:30', category: 'Transportasi', desc: 'Bahan Bakar & Tol Operasional', type: 'expense', amount: 320000, account: 'Dompet Tunai (Cash)', tag: 'Kendaraan', verified: true },
  { id: 'TRX-1001', date: '2026-10-14', time: '09:00', category: 'Penjualan / Omset', desc: 'Pendapatan Kasir Shift Pagi', type: 'income', amount: 3850000, account: 'BCA Prioritas', tag: 'Bisnis', verified: true },
  { id: 'TRX-1002', date: '2026-10-14', time: '14:20', category: 'Bahan Baku', desc: 'Restock Kopi & Susu UHT', type: 'expense', amount: 1450000, account: 'Bank Mandiri Bisnis', tag: 'HPP', verified: true },
  { id: 'TRX-1003', date: '2026-10-13', time: '10:15', category: 'Operasional', desc: 'Listrik & Wifi Cabang Jakarta', type: 'expense', amount: 650000, account: 'BCA Prioritas', tag: 'Utilitas', verified: true },
  { id: 'TRX-1004', date: '2026-10-13', time: '17:00', category: 'Gaji & Upah', desc: 'Uang Makan Karyawan Part-time', type: 'expense', amount: 200000, account: 'Dompet Tunai (Cash)', tag: 'Payroll', verified: true },
  { id: 'TRX-1005', date: '2026-10-12', time: '11:40', category: 'Investasi Pribadi', desc: 'Dividen Reksadana Pasar Uang', type: 'income', amount: 780000, account: 'BCA Prioritas', tag: 'Passive', verified: true },
  { id: 'TRX-1006', date: '2026-10-11', time: '15:10', category: 'Belanja Dapur', desc: 'Kebutuhan Mingguan Rumah', type: 'expense', amount: 480000, account: 'GoPay & OVO E-Wallet', tag: 'Pribadi', verified: true }
]

export const DUMMY_DEBTS = [
  { 
    id: 'DBT-01', 
    contact: 'PT Sumber Pangan Abadi', 
    type: 'utang', 
    total: 5000000, 
    paid: 2000000, 
    dueDate: '2026-10-25', 
    status: 'Sebagian',
    accountName: 'BCA Prioritas',
    note: 'Pinjaman bahan baku awal',
    payments: [
      { id: 'PAY-1', date: '2026-10-05', amount: 2000000, account: 'BCA Prioritas', note: 'Cicilan tahap 1' }
    ]
  },
  { 
    id: 'DBT-02', 
    contact: 'Toko Berkah Mitra', 
    type: 'piutang', 
    total: 3200000, 
    paid: 0, 
    dueDate: '2026-10-20', 
    status: 'Belum Lunas',
    accountName: 'Bank Mandiri Bisnis',
    note: 'Konsinyasi produk cake',
    payments: [] 
  },
  { 
    id: 'DBT-03', 
    contact: 'Reza Teman Kampus', 
    type: 'piutang', 
    total: 500000, 
    paid: 500000, 
    dueDate: '2026-10-10', 
    status: 'Lunas',
    accountName: 'Dompet Tunai (Cash)',
    note: 'Talangan beli tiket event',
    payments: [
      { id: 'PAY-2', date: '2026-10-10', amount: 500000, account: 'Dompet Tunai (Cash)', note: 'Pelunasan transfer penuh' }
    ]
  }
]

// --- 2. REKENING BERSIH STANDAR UNTUK AKUN BARU / MASTER ADMIN (Saldo Rp 0) ---
export const CLEAN_DEFAULT_ACCOUNTS = [
  { id: 'acc-1', name: 'Dompet Tunai (Kas Utama)', balance: 0, type: 'cash', icon: 'Wallet' },
  { id: 'acc-2', name: 'Bank Operasional', balance: 0, type: 'bank', icon: 'Building' },
  { id: 'acc-3', name: 'QRIS & E-Wallet', balance: 0, type: 'ewallet', icon: 'Smartphone' }
]

function getActiveEmail() {
  try {
    const raw = localStorage.getItem('cakue_current_user')
    if (raw) {
      const u = JSON.parse(raw)
      return (u?.email || '').toLowerCase()
    }
  } catch (e) {}
  return ''
}

function isDemoUser(email) {
  const e = (email || getActiveEmail()).toLowerCase()
  return e === 'budi.santoso@cakue.id' || e.includes('budi')
}

function getFinanceStorageKey(email) {
  const e = (email || getActiveEmail()).toLowerCase()
  if (isDemoUser(e)) {
    return 'cakue_demo_finance'
  }
  const safeName = (e || 'admin').replace(/[^a-zA-Z0-9_-]/g, '_')
  return `cakue_finance_${safeName}`
}

function loadInitialFinanceData(email) {
  const isDemo = isDemoUser(email)
  const key = getFinanceStorageKey(email)
  const raw = localStorage.getItem(key)

  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      return {
        accounts: parsed.accounts && parsed.accounts.length > 0 ? parsed.accounts : (isDemo ? DUMMY_ACCOUNTS : CLEAN_DEFAULT_ACCOUNTS),
        transactions: parsed.transactions || (isDemo ? DUMMY_TRANSACTIONS : []),
        debts: parsed.debts || (isDemo ? DUMMY_DEBTS : [])
      }
    } catch (e) {}
  }

  return {
    accounts: isDemo ? JSON.parse(JSON.stringify(DUMMY_ACCOUNTS)) : JSON.parse(JSON.stringify(CLEAN_DEFAULT_ACCOUNTS)),
    transactions: isDemo ? JSON.parse(JSON.stringify(DUMMY_TRANSACTIONS)) : [],
    debts: isDemo ? JSON.parse(JSON.stringify(DUMMY_DEBTS)) : []
  }
}

export const useFinanceStore = defineStore('finance', () => {
  const initial = loadInitialFinanceData()

  // State Reaktif
  const accounts = ref(initial.accounts)
  const transactions = ref(initial.transactions)
  const debts = ref(initial.debts)

  // Auto-save State ke LocalStorage Terisolasi per-User
  function saveCurrentState() {
    const key = getFinanceStorageKey()
    localStorage.setItem(key, JSON.stringify({
      accounts: accounts.value,
      transactions: transactions.value,
      debts: debts.value
    }))
  }

  watch([accounts, transactions, debts], () => {
    saveCurrentState()
  }, { deep: true })

  // Sinkronisasi Dinamis saat Pengguna Login / Beralih Akun
  function syncUserData(userObj) {
    const email = userObj?.email || getActiveEmail()
    const data = loadInitialFinanceData(email)
    accounts.value = data.accounts
    transactions.value = data.transactions
    debts.value = data.debts
  }

  // Perhitungan Keuangan Presisi (Nol Halusinasi)
  const totalBalance = computed(() => {
    return accounts.value.reduce((sum, a) => sum + (Number(a.balance) || 0), 0)
  })

  const totalIncome = computed(() => {
    return transactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)
  })

  const totalExpense = computed(() => {
    return transactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)
  })

  const netSavings = computed(() => totalIncome.value - totalExpense.value)

  const totalUtang = computed(() => {
    return debts.value
      .filter(d => d.type === 'utang')
      .reduce((sum, d) => sum + Math.max(0, (Number(d.total) || 0) - (Number(d.paid) || 0)), 0)
  })

  const totalPiutang = computed(() => {
    return debts.value
      .filter(d => d.type === 'piutang')
      .reduce((sum, d) => sum + Math.max(0, (Number(d.total) || 0) - (Number(d.paid) || 0)), 0)
  })

  // Pengelompokan Kantong: Kas Tunai, Bank, dan E-Wallet
  const cashAccounts = computed(() => accounts.value.filter(a => a.type === 'cash'))
  const bankAccounts = computed(() => accounts.value.filter(a => a.type === 'bank'))
  const ewalletAccounts = computed(() => accounts.value.filter(a => a.type === 'ewallet'))

  const totalCash = computed(() => cashAccounts.value.reduce((sum, a) => sum + (Number(a.balance) || 0), 0))
  const totalBank = computed(() => bankAccounts.value.reduce((sum, a) => sum + (Number(a.balance) || 0), 0))
  const totalEwallet = computed(() => ewalletAccounts.value.reduce((sum, a) => sum + (Number(a.balance) || 0), 0))

  // ========================================================
  // 1. MANAJEMEN TRANSAKSI & KOREKSI ANOMALI
  // ========================================================
  function addTransaction(tx) {
    const newTx = {
      id: tx.id || `TRX-${Date.now().toString().slice(-4)}`,
      date: tx.date || new Date().toISOString().slice(0, 10),
      category: tx.category || 'Umum',
      desc: tx.desc || 'Transaksi Baru',
      type: tx.type || 'expense',
      amount: Number(tx.amount) || 0,
      account: tx.account || accounts.value[0]?.name || 'Dompet Tunai (Kas Utama)',
      tag: tx.tag || 'Reguler',
      verified: true
    }
    transactions.value.unshift(newTx)

    // Update saldo akun terkait jika diinginkan
    if (tx.updateBalance) {
      const acc = accounts.value.find(a => a.name === newTx.account)
      if (acc) {
        if (newTx.type === 'income') acc.balance += newTx.amount
        else acc.balance = Math.max(0, acc.balance - newTx.amount)
      }
    }
    return newTx
  }

  function updateTransaction(id, updated) {
    const tx = transactions.value.find(t => t.id === id)
    if (tx) {
      Object.assign(tx, updated)
      if (updated.amount !== undefined) {
        tx.amount = Number(updated.amount) || 0
      }
      return true
    }
    return false
  }

  function updateCell(id, field, value) {
    const tx = transactions.value.find(t => t.id === id)
    if (tx) {
      if (field === 'amount') {
        tx[field] = Number(value) || 0
      } else {
        tx[field] = value
      }
    }
  }

  function deleteTransaction(id) {
    const idx = transactions.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      transactions.value.splice(idx, 1)
    }
  }

  // ========================================================
  // 2. MANAJEMEN UTANG & PIUTANG (FLEKSIBEL SINKRON KAS)
  // ========================================================
  function addDebt({ contact, type, total, dueDate, note, accountName, syncToCash }) {
    const amt = Number(total) || 0
    const chosenAcc = accountName || accounts.value[0]?.name || 'Dompet Tunai (Kas Utama)'
    const newDebt = {
      id: `DBT-${Date.now().toString().slice(-4)}`,
      contact: contact || 'Pihak Terkait',
      type: type || 'utang',
      total: amt,
      paid: 0,
      dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: 'Belum Lunas',
      accountName: chosenAcc,
      note: note || '',
      payments: []
    }
    debts.value.unshift(newDebt)

    if (syncToCash) {
      const acc = accounts.value.find(a => a.name === chosenAcc)
      if (acc) {
        if (type === 'utang') {
          acc.balance += amt
          transactions.value.unshift({
            id: `TRX-${Date.now().toString().slice(-4)}`,
            date: new Date().toISOString().slice(0, 10),
            category: 'Pinjaman Masuk (Utang)',
            desc: `Penerimaan pinjaman dari ${contact}`,
            type: 'income',
            amount: amt,
            account: chosenAcc,
            tag: 'Hutang',
            verified: true
          })
        } else {
          acc.balance = Math.max(0, acc.balance - amt)
          transactions.value.unshift({
            id: `TRX-${Date.now().toString().slice(-4)}`,
            date: new Date().toISOString().slice(0, 10),
            category: 'Pemberian Pinjaman (Piutang)',
            desc: `Talangan dana kepada ${contact}`,
            type: 'expense',
            amount: amt,
            account: chosenAcc,
            tag: 'Piutang',
            verified: true
          })
        }
      }
    }
    return newDebt
  }

  function settleDebt(debtId, amount, paymentAccount, note) {
    const d = debts.value.find(item => item.id === debtId)
    if (!d) return false

    const payAmt = Number(amount) || (d.total - d.paid)
    if (payAmt <= 0) return false

    d.paid = Math.min(d.total, d.paid + payAmt)
    d.status = d.paid >= d.total ? 'Lunas' : 'Sebagian'

    const chosenAcc = paymentAccount || d.accountName || accounts.value[0]?.name || 'Dompet Tunai (Kas Utama)'
    
    if (!d.payments) d.payments = []
    d.payments.push({
      id: `PAY-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      amount: payAmt,
      account: chosenAcc,
      note: note || (d.type === 'utang' ? 'Pembayaran Cicilan Utang' : 'Penerimaan Cicilan Piutang')
    })

    const acc = accounts.value.find(a => a.name === chosenAcc)
    if (acc) {
      if (d.type === 'utang') {
        acc.balance = Math.max(0, acc.balance - payAmt)
        transactions.value.unshift({
          id: `TRX-${Date.now().toString().slice(-4)}`,
          date: new Date().toISOString().slice(0, 10),
          category: 'Pelunasan Utang',
          desc: `Bayar utang ke ${d.contact}${note ? ` (${note})` : ''}`,
          type: 'expense',
          amount: payAmt,
          account: chosenAcc,
          tag: 'Pelunasan',
          verified: true
        })
      } else {
        acc.balance += payAmt
        transactions.value.unshift({
          id: `TRX-${Date.now().toString().slice(-4)}`,
          date: new Date().toISOString().slice(0, 10),
          category: 'Penerimaan Piutang',
          desc: `Terima pelunasan dari ${d.contact}${note ? ` (${note})` : ''}`,
          type: 'income',
          amount: payAmt,
          account: chosenAcc,
          tag: 'Pelunasan',
          verified: true
        })
      }
    }
    return true
  }

  function deleteDebt(id) {
    const idx = debts.value.findIndex(d => d.id === id)
    if (idx !== -1) {
      debts.value.splice(idx, 1)
      return true
    }
    return false
  }

  // ========================================================
  // 3. MANAJEMEN AKUN REKENING & KANTONG
  // ========================================================
  function addAccount({ name, balance = 0, type = 'cash', icon = 'Wallet' }) {
    const newAcc = {
      id: `acc-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      balance: Math.max(0, Number(balance) || 0),
      type,
      icon
    }
    accounts.value.push(newAcc)
    return newAcc
  }

  function updateAccount(id, updated) {
    const acc = accounts.value.find(a => a.id === id)
    if (acc) {
      Object.assign(acc, updated)
      if (updated.balance !== undefined) {
        acc.balance = Math.max(0, Number(updated.balance) || 0)
      }
      return true
    }
    return false
  }

  function deleteAccount(id) {
    if (accounts.value.length <= 1) {
      return { success: false, message: 'Tidak dapat menghapus satu-satunya rekening aktif.' }
    }
    const idx = accounts.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      accounts.value.splice(idx, 1)
      return { success: true }
    }
    return { success: false, message: 'Rekening tidak ditemukan.' }
  }

  // ========================================================
  // 4. PEMBAYARAN QRIS & TRANSFER ANTAR REKENING
  // ========================================================
  function payQris({ merchantName, amount, accountName }) {
    const amt = Number(amount) || 0
    const acc = accounts.value.find(a => a.name === accountName) || accounts.value[0]
    if (acc) {
      acc.balance = Math.max(0, acc.balance - amt)
    }
    const newTx = {
      id: `QRIS-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      category: 'Pembayaran QRIS',
      desc: `Bayar QRIS ke ${merchantName || 'Merchant'}`,
      type: 'expense',
      amount: amt,
      account: acc ? acc.name : 'Dompet Tunai (Kas Utama)',
      tag: 'QRIS',
      verified: true
    }
    transactions.value.unshift(newTx)
    return newTx
  }

  function receiveQris({ payerName, amount, accountName }) {
    const amt = Number(amount) || 0
    const acc = accounts.value.find(a => a.name === accountName) || accounts.value[0]
    if (acc) {
      acc.balance += amt
    }
    const newTx = {
      id: `QRIS-IN-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      category: 'Penerimaan QRIS',
      desc: `Terima QRIS dari ${payerName || 'Pelanggan'}`,
      type: 'income',
      amount: amt,
      account: acc ? acc.name : 'Dompet Tunai (Kas Utama)',
      tag: 'QRIS Masuk',
      verified: true
    }
    transactions.value.unshift(newTx)
    return newTx
  }

  function transferFunds({ fromAccount, toAccount, amount, note }) {
    const amt = Number(amount) || 0
    const fromAcc = accounts.value.find(a => a.name === fromAccount)
    const toAcc = accounts.value.find(a => a.name === toAccount)
    if (fromAcc && toAcc && fromAcc.balance >= amt) {
      fromAcc.balance -= amt
      toAcc.balance += amt
      transactions.value.unshift({
        id: `TRF-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().slice(0, 10),
        category: 'Transfer Saldo',
        desc: `Pindah Dana ${fromAccount} ➔ ${toAccount}${note ? ` (${note})` : ''}`,
        type: 'expense',
        amount: amt,
        account: fromAccount,
        tag: 'Internal Transfer',
        verified: true
      })
      return true
    }
    return false
  }

  return {
    accounts,
    transactions,
    debts,
    totalBalance,
    totalIncome,
    totalExpense,
    netSavings,
    totalUtang,
    totalPiutang,
    cashAccounts,
    bankAccounts,
    ewalletAccounts,
    totalCash,
    totalBank,
    totalEwallet,
    addTransaction,
    updateTransaction,
    updateCell,
    deleteTransaction,
    addDebt,
    settleDebt,
    deleteDebt,
    addAccount,
    updateAccount,
    deleteAccount,
    payQris,
    receiveQris,
    transferFunds,
    syncUserData
  }
})
