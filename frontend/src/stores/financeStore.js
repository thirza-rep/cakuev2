import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFinanceStore = defineStore('finance', () => {
  // Akun Dompet / Rekening
  const accounts = ref([
    { id: 'acc-1', name: 'Dompet Tunai (Cash)', balance: 1850000, type: 'cash', icon: 'Wallet' },
    { id: 'acc-2', name: 'BCA Prioritas', balance: 24500000, type: 'bank', icon: 'Building' },
    { id: 'acc-3', name: 'Bank Mandiri Bisnis', balance: 48900000, type: 'bank', icon: 'Building2' },
    { id: 'acc-4', name: 'GoPay & OVO E-Wallet', balance: 920000, type: 'ewallet', icon: 'Smartphone' }
  ])

  // Baris Transaksi Buku Besar (Excel Grid Data)
  const transactions = ref([
    { id: 'TRX-1001', date: '2026-10-14', category: 'Penjualan / Omset', desc: 'Pendapatan Kasir Shift Pagi', type: 'income', amount: 3850000, account: 'BCA Prioritas', tag: 'Bisnis', verified: true },
    { id: 'TRX-1002', date: '2026-10-14', category: 'Bahan Baku', desc: 'Restock Kopi & Susu UHT', type: 'expense', amount: 1450000, account: 'Bank Mandiri Bisnis', tag: 'HPP', verified: true },
    { id: 'TRX-1003', date: '2026-10-13', category: 'Operasional', desc: 'Listrik & Wifi Cabang Jakarta', type: 'expense', amount: 650000, account: 'BCA Prioritas', tag: 'Utilitas', verified: true },
    { id: 'TRX-1004', date: '2026-10-13', category: 'Gaji & Upah', desc: 'Uang Makan Karyawan Part-time', type: 'expense', amount: 200000, account: 'Dompet Tunai (Cash)', tag: 'Payroll', verified: true },
    { id: 'TRX-1005', date: '2026-10-12', category: 'Investasi Pribadi', desc: 'Dividen Reksadana Pasar Uang', type: 'income', amount: 780000, account: 'BCA Prioritas', tag: 'Passive', verified: true },
    { id: 'TRX-1006', date: '2026-10-11', category: 'Belanja Dapur', desc: 'Kebutuhan Mingguan Rumah', type: 'expense', amount: 480000, account: 'GoPay & OVO E-Wallet', tag: 'Pribadi', verified: true }
  ])

  // Catatan Utang & Piutang (dengan Riwayat Pembayaran Sinkron)
  const debts = ref([
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
  ])

  // Perhitungan Keuangan Presisi (Nol Halusinasi)
  const totalBalance = computed(() => {
    return accounts.value.reduce((sum, a) => sum + a.balance, 0)
  })

  const totalIncome = computed(() => {
    return transactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  })

  const totalExpense = computed(() => {
    return transactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  })

  const netSavings = computed(() => totalIncome.value - totalExpense.value)

  const totalUtang = computed(() => {
    return debts.value
      .filter(d => d.type === 'utang')
      .reduce((sum, d) => sum + Math.max(0, d.total - d.paid), 0)
  })

  const totalPiutang = computed(() => {
    return debts.value
      .filter(d => d.type === 'piutang')
      .reduce((sum, d) => sum + Math.max(0, d.total - d.paid), 0)
  })

  // Pengelompokan Kantong: Kas Tunai, Bank, dan E-Wallet
  const cashAccounts = computed(() => accounts.value.filter(a => a.type === 'cash'))
  const bankAccounts = computed(() => accounts.value.filter(a => a.type === 'bank'))
  const ewalletAccounts = computed(() => accounts.value.filter(a => a.type === 'ewallet'))

  const totalCash = computed(() => cashAccounts.value.reduce((sum, a) => sum + a.balance, 0))
  const totalBank = computed(() => bankAccounts.value.reduce((sum, a) => sum + a.balance, 0))
  const totalEwallet = computed(() => ewalletAccounts.value.reduce((sum, a) => sum + a.balance, 0))

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
      account: tx.account || 'BCA Prioritas',
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
    const chosenAcc = accountName || accounts.value[0]?.name || 'BCA Prioritas'
    const newDebt = {
      id: `DBT-${Date.now().toString().slice(-4)}`,
      contact: contact || 'Pihak Terkait',
      type: type || 'utang', // 'utang' atau 'piutang'
      total: amt,
      paid: 0,
      dueDate: dueDate || new Date().toISOString().slice(0, 10),
      note: note || '',
      status: 'Belum Lunas',
      accountName: chosenAcc,
      payments: []
    }
    debts.value.unshift(newDebt)

    // Opsi Fleksibel: Jika dicentang sinkron ke saldo kas riil
    if (syncToCash) {
      const acc = accounts.value.find(a => a.name === chosenAcc)
      if (type === 'utang') {
        // Kita berutang / pinjam uang -> Saldo kas bertambah (Pemasukan)
        if (acc) acc.balance += amt
        transactions.value.unshift({
          id: `TRX-${Date.now().toString().slice(-4)}`,
          date: new Date().toISOString().slice(0, 10),
          category: 'Penerimaan Pinjaman',
          desc: `Terima Pinjaman dari ${contact}${note ? ` (${note})` : ''}`,
          type: 'income',
          amount: amt,
          account: chosenAcc,
          tag: 'Utang Masuk',
          verified: true
        })
      } else {
        // Kita meminjamkan uang -> Saldo kas berkurang (Pengeluaran)
        if (acc) acc.balance = Math.max(0, acc.balance - amt)
        transactions.value.unshift({
          id: `TRX-${Date.now().toString().slice(-4)}`,
          date: new Date().toISOString().slice(0, 10),
          category: 'Pemberian Pinjaman',
          desc: `Pinjamkan Dana ke ${contact}${note ? ` (${note})` : ''}`,
          type: 'expense',
          amount: amt,
          account: chosenAcc,
          tag: 'Piutang Keluar',
          verified: true
        })
      }
    }
    return newDebt
  }

  function settleDebt({ debtId, amount, accountName, note, syncToCash }) {
    const debt = debts.value.find(d => d.id === debtId)
    if (!debt) return false

    const amt = Number(amount) || 0
    if (amt <= 0) return false

    const chosenAcc = accountName || debt.accountName || accounts.value[0]?.name
    debt.paid += amt
    
    // Status pelunasan
    if (debt.paid >= debt.total) {
      debt.status = 'Lunas'
    } else {
      debt.status = 'Sebagian'
    }

    // Catat ke riwayat pembayaran pada debt
    debt.payments.unshift({
      id: `PAY-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      amount: amt,
      account: chosenAcc,
      note: note || (debt.paid >= debt.total ? 'Pelunasan penuh' : 'Cicilan sebagian')
    })

    // Opsi Fleksibel: Jika dicentang sinkron ke kas riil
    if (syncToCash) {
      const acc = accounts.value.find(a => a.name === chosenAcc)
      if (debt.type === 'utang') {
        // Bayar utang -> Kas berkurang (Pengeluaran)
        if (acc) acc.balance = Math.max(0, acc.balance - amt)
        transactions.value.unshift({
          id: `TRX-${Date.now().toString().slice(-4)}`,
          date: new Date().toISOString().slice(0, 10),
          category: 'Pembayaran Utang',
          desc: `Bayar Utang ke ${debt.contact}${note ? ` (${note})` : ''}`,
          type: 'expense',
          amount: amt,
          account: chosenAcc,
          tag: 'Pelunasan Utang',
          verified: true
        })
      } else {
        // Terima pengembalian piutang -> Kas bertambah (Pemasukan)
        if (acc) acc.balance += amt
        transactions.value.unshift({
          id: `TRX-${Date.now().toString().slice(-4)}`,
          date: new Date().toISOString().slice(0, 10),
          category: 'Pengembalian Piutang',
          desc: `Terima Pelunasan dari ${debt.contact}${note ? ` (${note})` : ''}`,
          type: 'income',
          amount: amt,
          account: chosenAcc,
          tag: 'Pelunasan Piutang',
          verified: true
        })
      }
    }
    return true
  }

  function deleteDebt(debtId) {
    const idx = debts.value.findIndex(d => d.id === debtId)
    if (idx !== -1) {
      debts.value.splice(idx, 1)
      return true
    }
    return false
  }

  // ========================================================
  // 3. MANAJEMEN KANTONG REKENING & WALLET (TAMBAH/EDIT/HAPUS)
  // ========================================================
  function addAccount({ name, balance, type, icon }) {
    if (!name) return false
    const newAcc = {
      id: `acc-${Date.now().toString().slice(-4)}`,
      name,
      balance: Number(balance) || 0,
      type: type || 'bank',
      icon: icon || (type === 'ewallet' ? 'Smartphone' : type === 'cash' ? 'Wallet' : 'Building')
    }
    accounts.value.push(newAcc)
    return newAcc
  }

  function updateAccount(id, updated) {
    const acc = accounts.value.find(a => a.id === id)
    if (acc) {
      if (updated.name !== undefined) acc.name = updated.name
      if (updated.balance !== undefined) acc.balance = Number(updated.balance) || 0
      if (updated.type !== undefined) acc.type = updated.type
      if (updated.icon !== undefined) acc.icon = updated.icon
      return true
    }
    return false
  }

  function deleteAccount(id) {
    const idx = accounts.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      accounts.value.splice(idx, 1)
      return true
    }
    return false
  }

  // ========================================================
  // 4. FITUR TRANSAKSI CEPAT & TRANSFER DANA
  // ========================================================
  function payQris({ merchant, amount, accountName, category }) {
    const amt = Number(amount) || 0
    const acc = accounts.value.find(a => a.name === accountName)
    if (acc) {
      acc.balance = Math.max(0, acc.balance - amt)
    }
    const newTx = {
      id: `QRIS-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      category: category || 'Makan & Minum',
      desc: `Bayar QRIS - ${merchant || 'Merchant QRIS'}`,
      type: 'expense',
      amount: amt,
      account: accountName || 'BCA Prioritas',
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
      account: acc.name,
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
    transferFunds
  }
})
