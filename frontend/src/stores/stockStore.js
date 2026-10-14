import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useStockStore = defineStore('stock', () => {
  // Master Produk & Stok Pusat (Warehouse)
  const products = ref([
    { id: 'PRD-01', sku: 'CKU-KOP-01', name: 'Biji Kopi Arabika Gayo 1kg', category: 'Bahan Baku', hpp: 110000, price: 165000, centralStock: 250, minAlert: 50 },
    { id: 'PRD-02', sku: 'CKU-SSU-02', name: 'Susu UHT Plain 1 Liter', category: 'Bahan Baku', hpp: 16500, price: 24000, centralStock: 480, minAlert: 100 },
    { id: 'PRD-03', sku: 'CKU-SIR-03', name: 'Sirup Karamel Monin 750ml', category: 'Sirup', hpp: 145000, price: 195000, centralStock: 35, minAlert: 15 },
    { id: 'PRD-04', sku: 'CKU-CUP-04', name: 'Paper Cup Hot 8oz (Slop/50pcs)', category: 'Packaging', hpp: 28000, price: 45000, centralStock: 120, minAlert: 30 },
    { id: 'PRD-05', sku: 'CKU-CKU-05', name: 'Cakue Crispy Original (Pack 10)', category: 'Makanan Jadi', hpp: 18000, price: 30000, centralStock: 80, minAlert: 20 },
    { id: 'PRD-06', sku: 'CKU-CKU-06', name: 'Cakue Keju Mozzarella (Pack 10)', category: 'Makanan Jadi', hpp: 24000, price: 40000, centralStock: 65, minAlert: 20 }
  ])

  // Distribusi Stok per Cabang (Persisten)
  const defaultBranchStocks = {
    'br-1': { // Jakarta Selatan
      'PRD-01': 32,
      'PRD-02': 64,
      'PRD-03': 8,
      'PRD-04': 25,
      'PRD-05': 18,
      'PRD-06': 15
    },
    'br-2': { // Bandung Dago
      'PRD-01': 14,
      'PRD-02': 28,
      'PRD-03': 4,
      'PRD-04': 10,
      'PRD-05': 8,
      'PRD-06': 5
    },
    'br-3': { // Surabaya Gubeng
      'PRD-01': 5, // Status: Low stock!
      'PRD-02': 12,
      'PRD-03': 2, // Status: Low stock!
      'PRD-04': 6,
      'PRD-05': 4,
      'PRD-06': 2
    }
  }

  const savedBranchStocks = localStorage.getItem('cakue_branch_stocks')
  const branchStocks = ref(savedBranchStocks ? JSON.parse(savedBranchStocks) : defaultBranchStocks)
  watch(branchStocks, (val) => localStorage.setItem('cakue_branch_stocks', JSON.stringify(val)), { deep: true })

  // Surat Jalan & Mutasi Penyaluran (In-Transit)
  const stockTransfers = ref([
    {
      id: 'SJ-2026-008',
      date: '2026-10-14 01:15',
      from: 'Gudang Pusat (Central Hub)',
      to: 'Cabang Surabaya Gubeng',
      items: [
        { productName: 'Biji Kopi Arabika Gayo 1kg', qty: 25 },
        { productName: 'Sirup Karamel Monin 750ml', qty: 10 }
      ],
      driver: 'Ekspedisi Logistik Truk 03',
      status: 'IN_TRANSIT' // IN_TRANSIT, RECEIVED
    },
    {
      id: 'SJ-2026-007',
      date: '2026-10-12 09:30',
      from: 'Gudang Pusat (Central Hub)',
      to: 'Cabang Bandung Dago',
      items: [
        { productName: 'Susu UHT Plain 1 Liter', qty: 40 },
        { productName: 'Cakue Crispy Original (Pack 10)', qty: 20 }
      ],
      driver: 'Kurir Internal Pak Joko',
      status: 'RECEIVED'
    }
  ])

  // Manajemen Data Aset & Depresiasi
  const assets = ref([
    {
      id: 'AST-01',
      name: 'Mesin Espresso La Marzocco 2 Group',
      branch: 'Cabang Jakarta Selatan',
      purchaseDate: '2025-01-15',
      cost: 125000000,
      usefulLifeYears: 5,
      salvageValue: 20000000,
      currentValue: 97000000,
      monthlyDepreciation: 1750000
    },
    {
      id: 'AST-02',
      name: 'Deep Fryer Komersial 20 Liter (Penggoreng Cakue)',
      branch: 'Cabang Bandung Dago',
      purchaseDate: '2025-06-10',
      cost: 18500000,
      usefulLifeYears: 4,
      salvageValue: 2500000,
      currentValue: 14500000,
      monthlyDepreciation: 333333
    },
    {
      id: 'AST-03',
      name: 'Tablet POS & Thermal Printer Sunmi',
      branch: 'Cabang Surabaya Gubeng',
      purchaseDate: '2026-02-01',
      cost: 6500000,
      usefulLifeYears: 3,
      salvageValue: 500000,
      currentValue: 5166000,
      monthlyDepreciation: 166666
    }
  ])

  // Buku Catatan Mutasi Stok Fisik (Inventory Movement Ledger)
  const stockLedger = ref([
    {
      id: 'LED-001',
      timestamp: '2026-10-15 03:30',
      productId: 'PRD-01',
      productName: 'Biji Kopi Arabika Gayo 1kg',
      sku: 'CKU-KOP-01',
      locationName: 'Gudang Pusat (Central Hub)',
      branchId: 'central',
      type: 'IN',
      qty: 50,
      reason: 'Restock Pembelian Supplier',
      actorRole: 'Owner & Direktur',
      balanceAfter: 250
    },
    {
      id: 'LED-002',
      timestamp: '2026-10-14 18:45',
      productId: 'PRD-02',
      productName: 'Susu UHT Plain 1 Liter',
      sku: 'CKU-SSU-02',
      locationName: 'Cabang Jakarta Selatan',
      branchId: 'br-1',
      type: 'OUT',
      qty: 2,
      reason: 'Kemasan Bocor Saat Bongkar Muat',
      actorRole: 'Staff Gudang & Logistik',
      balanceAfter: 64
    }
  ])

  // Kurangi stok di cabang saat POS transaksi (RBAC & Audit Trail Granular)
  function deductBranchStock(branchId, productId, qty, customLocationName = '', actorRole = 'Kasir POS Toko') {
    if (branchStocks.value[branchId] && branchStocks.value[branchId][productId] !== undefined) {
      branchStocks.value[branchId][productId] = Math.max(0, branchStocks.value[branchId][productId] - qty)
      
      const prod = products.value.find(p => p.id === productId)
      if (prod) {
        const resolvedLocationName = customLocationName || 
          (branchId === 'br-1' ? 'Cabang Jakarta Selatan' : branchId === 'br-2' ? 'Cabang Bandung Dago' : branchId === 'br-3' ? 'Cabang Surabaya Gubeng' : 'Cabang Toko')
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
    let locName = 'Gudang Pusat (Central Hub)'

    if (location === 'central') {
      if (type === 'in') {
        prod.centralStock += qty
      } else {
        prod.centralStock = Math.max(0, prod.centralStock - qty)
      }
      balanceAfter = prod.centralStock
      locName = 'Gudang Pusat (Central Hub)'
    } else {
      if (!branchStocks.value[location]) branchStocks.value[location] = {}
      const current = branchStocks.value[location][productId] || 0
      if (type === 'in') {
        branchStocks.value[location][productId] = current + qty
      } else {
        branchStocks.value[location][productId] = Math.max(0, current - qty)
      }
      balanceAfter = branchStocks.value[location][productId]
      locName = location === 'br-1' ? 'Cabang Jakarta Selatan' : location === 'br-2' ? 'Cabang Bandung Dago' : 'Cabang Surabaya Gubeng'
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

    // Inisialisasi stok cabang
    Object.keys(branchStocks.value).forEach(bId => {
      branchStocks.value[bId][newId] = 0
    })

    // Log awal jika ada stok awal
    if (newProd.centralStock > 0) {
      stockLedger.value.unshift({
        id: `LED-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        productId: newProd.id,
        productName: newProd.name,
        sku: newProd.sku,
        locationName: 'Gudang Pusat (Central Hub)',
        branchId: 'central',
        type: 'IN',
        qty: newProd.centralStock,
        reason: 'Pendaftaran Master Produk & Stok Awal',
        actorRole: 'Owner & Direktur',
        balanceAfter: newProd.centralStock
      })
    }

    return newProd
  }

  // Update Data Produk
  function updateProduct(productId, fields) {
    const prod = products.value.find(p => p.id === productId)
    if (prod) {
      Object.assign(prod, fields)
      return true
    }
    return false
  }

  // Hapus Produk
  function deleteProduct(productId) {
    const idx = products.value.findIndex(p => p.id === productId)
    if (idx !== -1) {
      products.value.splice(idx, 1)
      Object.keys(branchStocks.value).forEach(bId => {
        delete branchStocks.value[bId][productId]
      })
      return true
    }
    return false
  }

  // Kirim stok dari Pusat ke Cabang (Status: IN_TRANSIT)
  function createTransfer(toBranchId, branchName, items, driver) {
    // Kurangi stok pusat secara deterministik
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
      from: 'Gudang Pusat (Central Hub)',
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
      const bId = tf.targetBranchId || 'br-1'
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
    getBranchTotalStockUnits
  }
})
