import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// --- 1. DATA DUMMY / DEMO (Khusus untuk Akun Budi Santoso) ---
export const DUMMY_PRODUCTS = [
  { id: 'PRD-01', sku: 'CKU-KOP-01', name: 'Biji Kopi Arabika Gayo 1kg', category: 'Bahan Baku', hpp: 110000, price: 165000, centralStock: 250, minAlert: 50 },
  { id: 'PRD-02', sku: 'CKU-SSU-02', name: 'Susu UHT Plain 1 Liter', category: 'Bahan Baku', hpp: 16500, price: 24000, centralStock: 480, minAlert: 100 },
  { id: 'PRD-03', sku: 'CKU-SIR-03', name: 'Sirup Karamel Monin 750ml', category: 'Sirup', hpp: 145000, price: 195000, centralStock: 35, minAlert: 15 },
  { id: 'PRD-04', sku: 'CKU-CUP-04', name: 'Paper Cup Hot 8oz (Slop/50pcs)', category: 'Packaging', hpp: 28000, price: 45000, centralStock: 120, minAlert: 30 },
  { id: 'PRD-05', sku: 'CKU-CKU-05', name: 'Cakue Crispy Original (Pack 10)', category: 'Makanan Jadi', hpp: 18000, price: 30000, centralStock: 80, minAlert: 20 },
  { id: 'PRD-06', sku: 'CKU-CKU-06', name: 'Cakue Keju Mozzarella (Pack 10)', category: 'Makanan Jadi', hpp: 24000, price: 40000, centralStock: 65, minAlert: 20 }
]

export const DUMMY_BRANCH_STOCKS = {
  'jogja-1': { 'PRD-01': 32, 'PRD-02': 64, 'PRD-03': 8, 'PRD-04': 25, 'PRD-05': 18, 'PRD-06': 15 },
  'jogja-2': { 'PRD-01': 14, 'PRD-02': 28, 'PRD-03': 4, 'PRD-04': 10, 'PRD-05': 8, 'PRD-06': 5 },
  'jogja-3': { 'PRD-01': 5, 'PRD-02': 12, 'PRD-03': 2, 'PRD-04': 6, 'PRD-05': 4, 'PRD-06': 2 },
  'jogja-4': { 'PRD-01': 20, 'PRD-02': 30, 'PRD-03': 6, 'PRD-04': 15, 'PRD-05': 10, 'PRD-06': 8 },
  'jogja-5': { 'PRD-01': 12, 'PRD-02': 24, 'PRD-03': 3, 'PRD-04': 8, 'PRD-05': 6, 'PRD-06': 4 },
  'jogja-6': { 'PRD-01': 15, 'PRD-02': 25, 'PRD-03': 5, 'PRD-04': 10, 'PRD-05': 8, 'PRD-06': 6 },
  'br-1': { 'PRD-01': 32, 'PRD-02': 64, 'PRD-03': 8, 'PRD-04': 25, 'PRD-05': 18, 'PRD-06': 15 },
  'br-2': { 'PRD-01': 14, 'PRD-02': 28, 'PRD-03': 4, 'PRD-04': 10, 'PRD-05': 8, 'PRD-06': 5 },
  'br-3': { 'PRD-01': 5, 'PRD-02': 12, 'PRD-03': 2, 'PRD-04': 6, 'PRD-05': 4, 'PRD-06': 2 }
}

export const DUMMY_STOCK_TRANSFERS = [
  {
    id: 'SJ-2026-008',
    date: '2026-10-14 01:15',
    from: 'Gudang Pusat Jogja (Hub Distribusi)',
    to: 'Cabang 3 - Kaliurang',
    targetBranchId: 'jogja-3',
    items: [
      { productName: 'Biji Kopi Arabika Gayo 1kg', qty: 25, productId: 'PRD-01' },
      { productName: 'Sirup Karamel Monin 750ml', qty: 10, productId: 'PRD-03' }
    ],
    driver: 'Ekspedisi Logistik Truk 03',
    status: 'IN_TRANSIT'
  },
  {
    id: 'SJ-2026-007',
    date: '2026-10-12 09:30',
    from: 'Gudang Pusat Jogja (Hub Distribusi)',
    to: 'Cabang 1 - Malioboro',
    targetBranchId: 'jogja-1',
    items: [
      { productName: 'Susu UHT Plain 1 Liter', qty: 40, productId: 'PRD-02' },
      { productName: 'Cakue Crispy Original (Pack 10)', qty: 20, productId: 'PRD-05' }
    ],
    driver: 'Kurir Internal Pak Joko',
    status: 'RECEIVED'
  }
]

export const DUMMY_ASSETS = [
  {
    id: 'AST-01',
    name: 'Mesin Espresso La Marzocco 2 Group',
    category: 'Mesin & Peralatan',
    branch: 'Cabang 1 - Malioboro',
    purchaseDate: '2025-01-15',
    cost: 125000000,
    usefulLifeYears: 5,
    salvageValue: 20000000,
    currentValue: 97000000,
    monthlyDepreciation: 1750000,
    accumulatedDepreciation: 28000000,
    notes: 'Unit operasional bar kopi utama'
  },
  {
    id: 'AST-02',
    name: 'Deep Fryer Komersial 20 Liter (Penggoreng Cakue)',
    category: 'Mesin & Peralatan',
    branch: 'Cabang 2 - Gejayan',
    purchaseDate: '2025-06-10',
    cost: 18500000,
    usefulLifeYears: 4,
    salvageValue: 2500000,
    currentValue: 14500000,
    monthlyDepreciation: 333333,
    accumulatedDepreciation: 4000000,
    notes: 'Penggoreng otomatis suhu presisi'
  }
]

export const DUMMY_STOCK_LEDGER = [
  {
    id: 'LED-001',
    timestamp: '2026-10-14 08:30',
    productId: 'PRD-01',
    productName: 'Biji Kopi Arabika Gayo 1kg',
    sku: 'CKU-KOP-01',
    locationName: 'Cabang 1 - Malioboro',
    branchId: 'jogja-1',
    type: 'IN',
    qty: 25,
    reason: 'Penerimaan Surat Jalan SJ-2026-007',
    actorRole: 'Manajer Cabang',
    balanceAfter: 32
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

function getStockStorageKey(email) {
  const e = (email || getActiveEmail()).toLowerCase()
  if (isDemoUser(e)) {
    return 'cakue_demo_stock'
  }
  const safeName = (e || 'admin').replace(/[^a-zA-Z0-9_-]/g, '_')
  return `cakue_stock_${safeName}`
}

function loadInitialStockData(email) {
  const isDemo = isDemoUser(email)
  const key = getStockStorageKey(email)
  const raw = localStorage.getItem(key)

  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      return {
        products: parsed.products || (isDemo ? DUMMY_PRODUCTS : []),
        branchStocks: parsed.branchStocks || (isDemo ? DUMMY_BRANCH_STOCKS : {}),
        stockTransfers: parsed.stockTransfers || (isDemo ? DUMMY_STOCK_TRANSFERS : []),
        assets: parsed.assets || (isDemo ? DUMMY_ASSETS : []),
        stockLedger: parsed.stockLedger || (isDemo ? DUMMY_STOCK_LEDGER : [])
      }
    } catch (e) {}
  }

  return {
    products: isDemo ? JSON.parse(JSON.stringify(DUMMY_PRODUCTS)) : [],
    branchStocks: isDemo ? JSON.parse(JSON.stringify(DUMMY_BRANCH_STOCKS)) : {},
    stockTransfers: isDemo ? JSON.parse(JSON.stringify(DUMMY_STOCK_TRANSFERS)) : [],
    assets: isDemo ? JSON.parse(JSON.stringify(DUMMY_ASSETS)) : [],
    stockLedger: isDemo ? JSON.parse(JSON.stringify(DUMMY_STOCK_LEDGER)) : []
  }
}

export const useStockStore = defineStore('stock', () => {
  const initial = loadInitialStockData()

  // State Reaktif
  const products = ref(initial.products)
  const branchStocks = ref(initial.branchStocks)
  const stockTransfers = ref(initial.stockTransfers)
  const assets = ref(initial.assets)
  const stockLedger = ref(initial.stockLedger)

  // Auto-save State per-User
  function saveCurrentState() {
    const key = getStockStorageKey()
    localStorage.setItem(key, JSON.stringify({
      products: products.value,
      branchStocks: branchStocks.value,
      stockTransfers: stockTransfers.value,
      assets: assets.value,
      stockLedger: stockLedger.value
    }))
  }

  watch([products, branchStocks, stockTransfers, assets, stockLedger], () => {
    saveCurrentState()
  }, { deep: true })

  // Sinkronisasi Dinamis saat Pengguna Login / Beralih Akun
  function syncUserData(userObj) {
    const email = userObj?.email || getActiveEmail()
    const data = loadInitialStockData(email)
    products.value = data.products
    branchStocks.value = data.branchStocks
    stockTransfers.value = data.stockTransfers
    assets.value = data.assets
    stockLedger.value = data.stockLedger
  }

  // Kurangi stok di cabang saat POS transaksi (RBAC & Audit Trail Granular)
  function deductBranchStock(branchId, productId, qty, customLocationName = '', actorRole = 'Kasir POS Toko') {
    if (!branchStocks.value[branchId]) branchStocks.value[branchId] = {}
    if (branchStocks.value[branchId][productId] !== undefined) {
      branchStocks.value[branchId][productId] = Math.max(0, branchStocks.value[branchId][productId] - qty)
      
      const prod = products.value.find(p => p.id === productId)
      if (prod) {
        const resolvedLocationName = customLocationName || branchId
        stockLedger.value.unshift({
          id: `LED-${Date.now().toString().slice(-6)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          locationName: resolvedLocationName,
          branchId,
          type: 'OUT',
          qty,
          reason: 'Penjualan Kasir POS Ritel',
          actorRole,
          balanceAfter: branchStocks.value[branchId][productId]
        })
      }
    }
  }

  // Aksi Tambah / Kurang Stok Fleksibel (RBAC-compliant)
  function adjustStock({ productId, location = 'central', type = 'in', qty = 1, reason = '', actorRole = 'Owner & Direktur' }) {
    const prod = products.value.find(p => p.id === productId)
    if (!prod || qty <= 0) return { success: false, message: 'Produk tidak ditemukan atau kuantitas tidak valid' }

    let balanceAfter = 0
    let locName = 'Gudang Pusat (Hub Distribusi)'

    if (location === 'central' || location === 'jogja-wh') {
      if (type === 'in') {
        prod.centralStock += qty
      } else {
        prod.centralStock = Math.max(0, prod.centralStock - qty)
      }
      balanceAfter = prod.centralStock
      locName = 'Gudang Pusat (Hub Distribusi)'
    } else {
      if (!branchStocks.value[location]) branchStocks.value[location] = {}
      const current = branchStocks.value[location][productId] || 0
      if (type === 'in') {
        branchStocks.value[location][productId] = current + qty
      } else {
        branchStocks.value[location][productId] = Math.max(0, current - qty)
      }
      balanceAfter = branchStocks.value[location][productId]
      locName = location
    }

    // Catat ke Buku Log Mutasi Stok
    stockLedger.value.unshift({
      id: `LED-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      locationName: locName,
      branchId: location,
      type: type.toUpperCase(),
      qty,
      reason: reason || (type === 'in' ? 'Restock Barang Masuk' : 'Penyesuaian Fisik / Rusak'),
      actorRole,
      balanceAfter
    })

    return { success: true, balanceAfter, productName: prod.name }
  }

  // Tambah Master Produk Baru
  function addProduct(item) {
    const newId = `PRD-0${products.value.length + 1}`
    const newProd = {
      id: newId,
      sku: item.sku || `CKU-${Date.now().toString().slice(-4)}`,
      name: item.name,
      category: item.category || 'Bahan Baku',
      hpp: Number(item.hpp) || 0,
      price: Number(item.price) || 0,
      centralStock: Number(item.centralStock) || 0,
      minAlert: Number(item.minAlert) || 20
    }
    products.value.push(newProd)

    // Inisialisasi stok di semua cabang
    Object.keys(branchStocks.value).forEach(bId => {
      branchStocks.value[bId][newId] = 0
    })

    return newProd
  }

  // Update Master Produk
  function updateProduct(id, updatedData) {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      products.value[idx] = { ...products.value[idx], ...updatedData }
      return true
    }
    return false
  }

  // Hapus Master Produk
  function deleteProduct(id) {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      products.value.splice(idx, 1)
      // Hapus referensi dari branchStocks
      Object.keys(branchStocks.value).forEach(bId => {
        if (branchStocks.value[bId]?.[id] !== undefined) {
          delete branchStocks.value[bId][id]
        }
      })
      return true
    }
    return false
  }

  // Kirim stok dari Pusat ke Cabang (Status: IN_TRANSIT)
  function createTransfer(toBranchId, branchName, items, driver) {
    items.forEach(item => {
      const p = products.value.find(prod => prod.id === item.productId)
      if (p) {
        p.centralStock = Math.max(0, p.centralStock - item.qty)
        
        stockLedger.value.unshift({
          id: `LED-${Date.now().toString().slice(-6)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          productId: p.id,
          productName: p.name,
          sku: p.sku,
          locationName: 'Gudang Pusat (Penyaluran In-Transit)',
          branchId: 'central',
          type: 'OUT',
          qty: item.qty,
          reason: `Penyaluran Surat Jalan ke ${branchName}`,
          actorRole: 'Staff Gudang & Logistik',
          balanceAfter: p.centralStock
        })
      }
    })

    stockTransfers.value.unshift({
      id: `SJ-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      from: 'Gudang Pusat Jogja (Hub Distribusi)',
      to: branchName,
      targetBranchId: toBranchId,
      items: items.map(i => ({ productName: i.name, qty: i.qty, productId: i.productId })),
      driver: driver || 'Armada Logistik Pusat',
      status: 'IN_TRANSIT'
    })
  }

  // Cabang Konfirmasi Penerimaan Barang
  function receiveTransfer(transferId) {
    const tf = stockTransfers.value.find(t => t.id === transferId)
    if (tf && tf.status === 'IN_TRANSIT') {
      tf.status = 'RECEIVED'
      const bId = tf.targetBranchId || 'jogja-1'
      if (!branchStocks.value[bId]) branchStocks.value[bId] = {}
      tf.items.forEach(item => {
        if (item.productId) {
          branchStocks.value[bId][item.productId] = (branchStocks.value[bId][item.productId] || 0) + item.qty

          const p = products.value.find(prod => prod.id === item.productId)
          stockLedger.value.unshift({
            id: `LED-${Date.now().toString().slice(-6)}`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            productId: item.productId,
            productName: item.productName,
            sku: p ? p.sku : 'CKU-GEN',
            locationName: tf.to,
            branchId: bId,
            type: 'IN',
            qty: item.qty,
            reason: `Penerimaan Barang Surat Jalan ${tf.id}`,
            actorRole: 'Manajer Cabang',
            balanceAfter: branchStocks.value[bId][item.productId]
          })
        }
      })
    }
  }

  // Inisialisasi slot stok cabang baru
  function initBranchStock(branchId) {
    if (!branchStocks.value[branchId]) {
      branchStocks.value[branchId] = {}
      products.value.forEach(p => {
        branchStocks.value[branchId][p.id] = 0
      })
    }
  }

  // Hapus data stok cabang
  function removeBranchStock(branchId) {
    if (branchStocks.value[branchId]) {
      delete branchStocks.value[branchId]
    }
  }

  // Cek apakah cabang masih memiliki sisa stok fisik
  function hasRemainingStock(branchId) {
    if (!branchStocks.value[branchId]) return false
    return Object.values(branchStocks.value[branchId]).some(qty => Number(qty) > 0)
  }

  // Hitung total unit stok tersimpan di cabang
  function getBranchTotalStockUnits(branchId) {
    if (!branchStocks.value[branchId]) return 0
    return Object.values(branchStocks.value[branchId]).reduce((sum, q) => sum + (Number(q) || 0), 0)
  }

  // --- MANAJEMEN ASET TETAP & DEPRESIASI BULANAN ---
  function addAsset({ name, category = 'Mesin & Peralatan', branch, purchaseDate, cost, usefulLifeYears, salvageValue = 0, notes = '' }) {
    const numCost = Math.max(0, Number(cost) || 0)
    const numSalvage = Math.max(0, Number(salvageValue) || 0)
    const numYears = Math.max(1, Number(usefulLifeYears) || 1)
    const monthlyDepr = Math.round((numCost - numSalvage) / (numYears * 12))
    
    const newId = `AST-${Date.now().toString(36).toUpperCase()}`
    const newAsset = {
      id: newId,
      name: name.trim(),
      category: category || 'Mesin & Peralatan',
      branch: branch || 'Cabang 1 - Malioboro',
      purchaseDate: purchaseDate || new Date().toISOString().slice(0, 10),
      cost: numCost,
      usefulLifeYears: numYears,
      salvageValue: numSalvage,
      currentValue: numCost,
      monthlyDepreciation: monthlyDepr,
      accumulatedDepreciation: 0,
      notes: notes.trim()
    }
    assets.value.unshift(newAsset)
    return newAsset
  }

  function updateAsset(id, updatedData) {
    const idx = assets.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      const existing = assets.value[idx]
      const numCost = Number(updatedData.cost !== undefined ? updatedData.cost : existing.cost)
      const numSalvage = Number(updatedData.salvageValue !== undefined ? updatedData.salvageValue : existing.salvageValue)
      const numYears = Number(updatedData.usefulLifeYears !== undefined ? updatedData.usefulLifeYears : existing.usefulLifeYears)
      const monthlyDepr = Math.round((numCost - numSalvage) / (numYears * 12))

      assets.value[idx] = {
        ...existing,
        ...updatedData,
        cost: numCost,
        salvageValue: numSalvage,
        usefulLifeYears: numYears,
        monthlyDepreciation: monthlyDepr
      }
      return true
    }
    return false
  }

  function deleteAsset(id) {
    const idx = assets.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      assets.value.splice(idx, 1)
      return true
    }
    return false
  }

  function depreciateAsset(id) {
    const ast = assets.value.find(a => a.id === id)
    if (!ast) return { success: false, message: 'Aset tidak ditemukan' }
    
    const minVal = ast.salvageValue || 0
    if (ast.currentValue <= minVal) {
      return { success: false, message: `Nilai buku ${ast.name} sudah mencapai nilai residu minimal (Rp ${minVal.toLocaleString('id-ID')}).` }
    }

    const deprAmount = Math.min(ast.monthlyDepreciation, ast.currentValue - minVal)
    ast.currentValue -= deprAmount
    ast.accumulatedDepreciation = (ast.accumulatedDepreciation || 0) + deprAmount

    return { 
      success: true, 
      amount: deprAmount, 
      currentValue: ast.currentValue,
      message: `Penyusutan Rp ${deprAmount.toLocaleString('id-ID')} berhasil dicatat untuk ${ast.name}`
    }
  }

  function runBatchDepreciation() {
    let totalDepreciated = 0
    let count = 0
    assets.value.forEach(ast => {
      const minVal = ast.salvageValue || 0
      if (ast.currentValue > minVal) {
        const deprAmount = Math.min(ast.monthlyDepreciation, ast.currentValue - minVal)
        ast.currentValue -= deprAmount
        ast.accumulatedDepreciation = (ast.accumulatedDepreciation || 0) + deprAmount
        totalDepreciated += deprAmount
        count++
      }
    })
    return { count, totalDepreciated }
  }

  return {
    products,
    branchStocks,
    stockTransfers,
    stockLedger,
    assets,
    deductBranchStock,
    adjustStock,
    addProduct,
    updateProduct,
    deleteProduct,
    createTransfer,
    receiveTransfer,
    initBranchStock,
    removeBranchStock,
    hasRemainingStock,
    getBranchTotalStockUnits,
    addAsset,
    updateAsset,
    deleteAsset,
    depreciateAsset,
    runBatchDepreciation,
    syncUserData
  }
})
