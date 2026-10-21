import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useStockStore } from './stockStore'
import { useFinanceStore } from './financeStore'
import { useSettingsStore } from './settingsStore'

// --- DATA DUMMY ORDER (Khusus Akun Demo Budi Santoso) ---
export const DUMMY_ORDERS = [
  {
    id: 'ORD-20261014-001',
    date: '2026-10-14 02:40',
    branch: 'Cabang 1 - Malioboro',
    customer: 'Dimas Wicaksono',
    phone: '081234567890',
    items: [
      { name: 'Cakue Crispy Original (Pack 10)', price: 30000, qty: 2 },
      { name: 'Kopi Susu Gula Aren 250ml', price: 22000, qty: 2 }
    ],
    total: 115440,
    paymentMethod: 'QRIS',
    status: 'PAID'
  }
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

function getPosStorageKey(email) {
  const e = (email || getActiveEmail()).toLowerCase()
  if (isDemoUser(e)) {
    return 'cakue_demo_pos'
  }
  const safeName = (e || 'admin').replace(/[^a-zA-Z0-9_-]/g, '_')
  return `cakue_pos_${safeName}`
}

function loadInitialOrders(email) {
  const isDemo = isDemoUser(email)
  const key = getPosStorageKey(email)
  const raw = localStorage.getItem(key)

  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    } catch (e) {}
  }

  return isDemo ? JSON.parse(JSON.stringify(DUMMY_ORDERS)) : []
}

export const usePosStore = defineStore('pos', () => {
  const stockStore = useStockStore()
  const financeStore = useFinanceStore()
  const settingsStore = useSettingsStore()

  const cart = ref([])
  const discountPercent = ref(0)
  const taxPercent = computed(() => {
    if (!settingsStore.financialSettings?.taxEnabled) return 0
    return Number(settingsStore.financialSettings?.taxRate ?? 11)
  })
  const customerName = ref('')
  const customerPhone = ref('')
  const paymentMethod = ref('CASH') // CASH, QRIS, DEBIT
  const cashGiven = ref(0)

  const recentOrders = ref(loadInitialOrders())

  // Auto-save recent orders per-user
  function saveCurrentState() {
    const key = getPosStorageKey()
    localStorage.setItem(key, JSON.stringify(recentOrders.value))
  }

  watch(recentOrders, () => {
    saveCurrentState()
  }, { deep: true })

  // Sinkronisasi Dinamis saat Pengguna Login / Beralih Akun
  function syncUserData(userObj) {
    const email = userObj?.email || getActiveEmail()
    recentOrders.value = loadInitialOrders(email)
    clearCart()
  }

  const subtotal = computed(() => {
    return cart.value.reduce((sum, item) => sum + (item.price * item.qty), 0)
  })

  const discountAmount = computed(() => {
    return (subtotal.value * discountPercent.value) / 100
  })

  const taxAmount = computed(() => {
    const afterDiscount = subtotal.value - discountAmount.value
    return (afterDiscount * taxPercent.value) / 100
  })

  const grandTotal = computed(() => {
    return Math.round(subtotal.value - discountAmount.value + taxAmount.value)
  })

  const changeDue = computed(() => {
    if (paymentMethod.value !== 'CASH') return 0
    return Math.max(0, cashGiven.value - grandTotal.value)
  })

  function addToCart(product) {
    const existing = cart.value.find(item => item.id === product.id)
    if (existing) {
      existing.qty++
    } else {
      cart.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        qty: 1
      })
    }
  }

  function updateQty(id, delta) {
    const item = cart.value.find(i => i.id === id)
    if (item) {
      item.qty += delta
      if (item.qty <= 0) {
        removeFromCart(id)
      }
    }
  }

  function removeFromCart(id) {
    cart.value = cart.value.filter(i => i.id !== id)
  }

  function clearCart() {
    cart.value = []
    cashGiven.value = 0
    customerName.value = ''
    customerPhone.value = ''
    discountPercent.value = 0
  }

  function checkout(branchId = 'jogja-1', branchName = 'Cabang 1 - Malioboro', cashierRole = 'Kasir POS Toko') {
    if (cart.value.length === 0) return null

    const orderId = `ORD-${Date.now().toString().slice(-8)}`
    const newOrder = {
      id: orderId,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      branch: branchName,
      customer: customerName.value || 'Pelanggan Umum',
      phone: customerPhone.value || '-',
      items: JSON.parse(JSON.stringify(cart.value)),
      subtotal: subtotal.value,
      discount: discountAmount.value,
      tax: taxAmount.value,
      total: grandTotal.value,
      paymentMethod: paymentMethod.value,
      cashGiven: cashGiven.value,
      changeDue: changeDue.value,
      cashierName: cashierRole || 'Kasir POS Toko',
      status: 'PAID'
    }

    // 1. Potong stok cabang secara deterministik & catat ledger
    cart.value.forEach(item => {
      stockStore.deductBranchStock(branchId, item.id, item.qty, branchName, cashierRole)
    })

    // 2. Tambahkan ke pembukuan keuangan (income)
    const targetAccount = paymentMethod.value === 'CASH' 
      ? (financeStore.cashAccounts[0]?.name || financeStore.accounts[0]?.name || 'Dompet Tunai (Kas Utama)')
      : (financeStore.bankAccounts[0]?.name || financeStore.ewalletAccounts[0]?.name || financeStore.accounts[0]?.name || 'Bank Operasional')

    financeStore.addTransaction({
      category: 'Penjualan / Omset',
      desc: `POS Order ${orderId} (${newOrder.customer}) - ${branchName}`,
      type: 'income',
      amount: grandTotal.value,
      account: targetAccount,
      tag: 'POS Sales',
      updateBalance: true
    })

    recentOrders.value.unshift(newOrder)
    const completedOrder = JSON.parse(JSON.stringify(newOrder))
    clearCart()
    return completedOrder
  }

  return {
    cart,
    discountPercent,
    taxPercent,
    customerName,
    customerPhone,
    paymentMethod,
    cashGiven,
    recentOrders,
    subtotal,
    discountAmount,
    taxAmount,
    grandTotal,
    changeDue,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    checkout,
    syncUserData
  }
})
