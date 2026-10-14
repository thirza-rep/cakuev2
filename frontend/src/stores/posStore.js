import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStockStore } from './stockStore'
import { useFinanceStore } from './financeStore'
import { useSettingsStore } from './settingsStore'

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
  const customerPhone = ref('') // WhatsApp number
  const paymentMethod = ref('CASH') // CASH, QRIS, DEBIT
  const cashGiven = ref(0)

  const recentOrders = ref([
    {
      id: 'ORD-20261014-001',
      date: '2026-10-14 02:40',
      branch: 'Cabang Jakarta Selatan',
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
  ])

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

  function checkout(branchId = 'br-1', branchName = 'Cabang Jakarta Selatan', cashierRole = 'Kasir POS Toko') {
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

    // 1. Potong stok cabang secara deterministik & catat ledger sesuai peran kasir
    cart.value.forEach(item => {
      stockStore.deductBranchStock(branchId, item.id, item.qty, branchName, cashierRole)
    })

    // 2. Tambahkan ke pembukuan keuangan (income)
    financeStore.addTransaction({
      category: 'Penjualan / Omset',
      desc: `POS Order ${orderId} (${newOrder.customer}) - ${branchName}`,
      type: 'income',
      amount: grandTotal.value,
      account: paymentMethod.value === 'CASH' ? 'Dompet Tunai (Cash)' : 'BCA Prioritas',
      tag: 'POS Sales'
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
    checkout
  }
})
