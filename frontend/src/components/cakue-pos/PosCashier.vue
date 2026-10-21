<template>
  <div class="space-y-4">
    <!-- Active POS Session Bar (RBAC & Multi-Branch Awareness) -->
    <div class="flex flex-wrap items-center justify-between gap-2.5 p-3 sm:p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
          <Icon name="store" custom-class="w-4 h-4" />
        </div>
        <div class="min-w-0">
          <div class="text-xs sm:text-sm font-bold text-slate-900 truncate">
            Mesin Kasir: <span class="text-emerald-700 font-extrabold">{{ currentBranchName }}</span>
          </div>
          <div class="text-[11px] text-slate-500 truncate">
            Petugas: <strong class="text-slate-700">{{ authStore.businessUser?.name }}</strong> ({{ authStore.currentRoleConfig?.title }})
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span 
          :class="[
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border',
            isBranchOpen 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border-rose-200'
          ]"
        >
          <span class="w-1.5 h-1.5 rounded-full" :class="isBranchOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'"></span>
          <span>{{ isBranchOpen ? 'Online POS (Buka)' : 'Toko Tutup' }}</span>
        </span>
      </div>
    </div>

    <!-- Banner Peringatan jika Cabang Berstatus Tutup -->
    <div v-if="!isBranchOpen" class="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-900 shadow-2xs">
      <div class="flex items-center gap-2.5">
        <Icon name="alert" custom-class="w-5 h-5 text-rose-600 shrink-0" />
        <div>
          <span class="font-extrabold">Status Operasional Cabang: TUTUP SEMENTARA.</span>
          <span class="text-rose-700 ml-1">Mesin kasir POS dinonaktifkan sementara untuk transaksi baru.</span>
        </div>
      </div>
      <button 
        v-if="authStore.isOwner || authStore.isManager" 
        @click="openBranchNow"
        type="button"
        class="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
      >
        Buka Operasional Toko
      </button>
    </div>

    <!-- Main POS Workspace -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
      <!-- Left: Product Catalog (Col 7 / 12) -->
      <div class="lg:col-span-7 space-y-4 sm:space-y-5">
        <!-- Search & Category Filters -->
        <div class="saas-card p-3.5 sm:p-5 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
          <div class="relative flex-1 min-w-0 w-full sm:w-auto">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Icon name="search" custom-class="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Cari produk, SKU, barcode..." 
              class="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
            <button 
              v-for="cat in categories" 
              :key="cat"
              @click="selectedCategory = cat"
              :class="[
                'px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all cursor-pointer',
                selectedCategory === cat ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              ]"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Products Grid (Fluid across all device sizes) -->
        <div v-if="filteredProducts.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
          <div 
            v-for="p in filteredProducts" 
            :key="p.id"
            @click="handleAddToCart(p)"
            class="saas-card p-3.5 sm:p-5 hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                <span class="font-bold truncate mr-1">{{ p.sku }}</span>
                <span :class="['px-1.5 py-0.5 rounded font-bold text-[10px] shrink-0', getBranchStock(p.id) <= 5 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700']">
                  Stok: {{ getBranchStock(p.id) }}
                </span>
              </div>
              <h4 class="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                {{ p.name }}
              </h4>
            </div>

            <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
              <span class="font-mono text-xs sm:text-sm font-extrabold text-slate-900">
                Rp {{ formatNumber(p.price) }}
              </span>
              <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 flex items-center justify-center transition-all shadow-xs shrink-0">
                <Icon name="plus" custom-class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State jika Katalog Kosong (Akun Baru / Master Admin) -->
        <div v-else class="saas-card p-8 sm:p-12 text-center space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Icon name="box" custom-class="w-6 h-6" />
          </div>
          <div class="space-y-1">
            <h4 class="text-sm font-bold text-slate-800">Katalog Produk Masih Bersih (0 Produk)</h4>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">
              Akun baru siap digunakan. Silakan tambahkan master produk dan atur stok di menu <strong>Inventaris & Stok</strong> agar produk dapat dipilih pada mesin kasir POS.
            </p>
          </div>
        </div>
      </div>

    <!-- Right: POS Register & Cart (Col 5 / 12) -->
    <div class="lg:col-span-5 space-y-5">
      <div class="saas-card p-5 sm:p-6 space-y-5 shadow-sm">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2.5">
            <span class="text-base font-bold text-slate-900">Keranjang Kasir</span>
            <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono text-xs font-bold">
              {{ posStore.cart.length }} Item
            </span>
          </div>
          <button 
            v-if="posStore.cart.length > 0"
            @click="posStore.clearCart" 
            class="text-xs text-slate-400 hover:text-rose-600 font-bold transition-colors cursor-pointer"
          >
            Kosongkan
          </button>
        </div>

        <!-- Customer & WhatsApp Phone -->
        <div class="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div>
            <label class="block text-xs font-bold text-slate-600 uppercase mb-1">Nama Pembeli</label>
            <input 
              v-model="posStore.customerName" 
              type="text" 
              placeholder="Pelanggan Umum" 
              class="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-emerald-800 uppercase mb-1">No. WhatsApp</label>
            <input 
              v-model="posStore.customerPhone" 
              type="tel" 
              placeholder="0812xxxxxxx" 
              class="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>
        </div>

        <!-- Cart Items List -->
        <div class="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
          <div v-if="posStore.cart.length === 0" class="text-center py-10 text-slate-400 text-sm">
            Keranjang belanja masih kosong.<br>Klik item produk di sebelah kiri untuk menambahkan.
          </div>

          <div 
            v-for="item in posStore.cart" 
            :key="item.id"
            class="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-sm font-mono"
          >
            <div class="flex-1 pr-2">
              <div class="font-bold text-slate-900 line-clamp-1 font-sans text-sm">{{ item.name }}</div>
              <div class="text-xs text-slate-500">@ Rp {{ formatNumber(item.price) }}</div>
            </div>

            <!-- Qty Stepper -->
            <div class="flex items-center gap-2">
              <button 
                @click="posStore.updateQty(item.id, -1)"
                class="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 flex items-center justify-center font-bold cursor-pointer transition-colors"
              >
                -
              </button>
              <span class="w-6 text-center font-bold text-slate-900 text-sm">{{ item.qty }}</span>
              <button 
                @click="posStore.updateQty(item.id, 1)"
                class="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 flex items-center justify-center font-bold cursor-pointer transition-colors"
              >
                +
              </button>
              <span class="w-24 text-right font-extrabold text-slate-900 text-sm sm:text-base">
                Rp {{ formatNumber(item.price * item.qty) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="space-y-2 pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold uppercase text-slate-600">Metode Pembayaran</label>
          <div class="grid grid-cols-3 gap-2">
            <button 
              v-for="m in ['CASH', 'QRIS', 'DEBIT']" 
              :key="m"
              @click="posStore.paymentMethod = m"
              :class="[
                'py-2.5 rounded-xl text-xs sm:text-sm font-extrabold font-mono transition-all border cursor-pointer',
                posStore.paymentMethod === m ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
              ]"
            >
              {{ m }}
            </button>
          </div>
        </div>

        <!-- Cash Details -->
        <div v-if="posStore.paymentMethod === 'CASH'" class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-sm font-mono">
          <div class="flex items-center justify-between">
            <span class="text-slate-700 font-sans font-medium">Uang Diterima:</span>
            <input 
              v-model.number="posStore.cashGiven" 
              type="number" 
              class="w-36 px-3 py-1.5 text-right bg-white border border-slate-300 rounded-lg font-bold text-slate-900 text-sm focus:outline-none"
            />
          </div>
          <!-- Cash Shortcuts -->
          <div class="flex gap-2 pt-1">
            <button 
              @click="posStore.cashGiven = posStore.grandTotal"
              class="flex-1 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800 font-bold cursor-pointer"
            >
              Uang Pas
            </button>
            <button 
              v-for="amt in [50000, 100000, 200000]" 
              :key="amt"
              @click="posStore.cashGiven = amt"
              class="flex-1 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800 font-bold cursor-pointer"
            >
              {{ amt / 1000 }}rb
            </button>
          </div>
          <div class="flex justify-between pt-1.5 border-t border-slate-200 font-bold font-sans">
            <span class="text-slate-600">Kembalian:</span>
            <span class="text-emerald-700 font-mono text-base">
              Rp {{ formatNumber(posStore.changeDue) }}
            </span>
          </div>
        </div>

        <!-- QRIS & Digital Payment Gateway (Coming Soon Card) -->
        <div v-else-if="posStore.paymentMethod === 'QRIS'" class="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-1.5 text-xs font-black text-amber-900">
              <Icon name="sparkles" custom-class="w-4 h-4 text-amber-600" />
              <span>QRIS Dinamis & Payment Gateway</span>
            </span>
            <span class="px-2 py-0.5 bg-amber-200 text-amber-900 font-mono text-[10px] font-extrabold rounded-md">
              COMING SOON
            </span>
          </div>
          <p class="text-[11px] text-slate-600 leading-relaxed">
            Integrasi otomatisasi pembayaran via QRIS dan Settlement ke rekening sedang disiapkan. Saat ini transaksi QRIS dapat dicatat langsung dan struk terkirim ke WhatsApp pelanggan.
          </p>
        </div>

        <!-- DEBIT / Transfer Card Details -->
        <div v-else-if="posStore.paymentMethod === 'DEBIT'" class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <div class="flex items-center justify-between font-bold text-slate-800">
            <span>Metode EDC / Transfer Bank</span>
            <span class="text-emerald-700 font-mono">Siap Gesek</span>
          </div>
          <p class="text-[11px] text-slate-500">
            Pastikan bukti struk mesin EDC / bukti transfer telah diverifikasi kasir sebelum menekan tombol Selesai & Kirim Struk.
          </p>
        </div>

        <!-- Financial Summary -->
        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-sm font-mono">
          <div class="flex justify-between text-slate-600 font-medium">
            <span>Subtotal:</span>
            <span>Rp {{ formatNumber(posStore.subtotal) }}</span>
          </div>
          <div class="flex justify-between text-slate-600 font-medium">
            <span>PPN (11%):</span>
            <span>Rp {{ formatNumber(posStore.taxAmount) }}</span>
          </div>
          <div class="flex justify-between text-lg font-black text-slate-900 pt-2 border-t border-slate-200">
            <span>TOTAL:</span>
            <span class="text-emerald-700 text-xl font-mono">Rp {{ formatNumber(posStore.grandTotal) }}</span>
          </div>
        </div>

        <!-- Checkout Action Button -->
        <button 
          @click="handleCheckout"
          :disabled="posStore.cart.length === 0 || !isBranchOpen"
          class="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-sm sm:text-base rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Icon name="check" custom-class="w-5 h-5" />
          <span>{{ !isBranchOpen ? 'Toko Tutup (Operasional Libur)' : 'Selesaikan Transaksi & Buat Struk' }}</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Receipt Modal Component -->
  <ReceiptModal 
    :show="showReceiptModal" 
    :order="completedOrder" 
    @close="showReceiptModal = false" 
  />
</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useStockStore } from '../../stores/stockStore'
import { usePosStore } from '../../stores/posStore'
import Icon from '../common/Icon.vue'
import ReceiptModal from './ReceiptModal.vue'

const authStore = useAuthStore()
const stockStore = useStockStore()
const posStore = usePosStore()

const searchQuery = ref('')
const selectedCategory = ref('Semua')
const categories = ['Semua', 'Bahan Baku', 'Sirup', 'Packaging', 'Makanan Jadi']

const showReceiptModal = ref(false)
const completedOrder = ref(null)

const currentBranchName = computed(() => {
  return authStore.businessUser?.currentBranch || 'Cabang 1 - Malioboro'
})

const currentBranchObj = computed(() => {
  return authStore.branches.find(x => x.name === currentBranchName.value)
})

const currentBranchId = computed(() => {
  return currentBranchObj.value?.id || 'jogja-1'
})

const isBranchOpen = computed(() => {
  return !currentBranchObj.value || currentBranchObj.value.status === 'open'
})

function openBranchNow() {
  if (currentBranchObj.value) {
    authStore.toggleBranchStatus(currentBranchObj.value.id)
  }
}

const filteredProducts = computed(() => {
  return stockStore.products.filter(p => {
    const matchCat = selectedCategory.value === 'Semua' || p.category === selectedCategory.value
    const matchQuery = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                       p.sku.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCat && matchQuery
  })
})

function getBranchStock(productId) {
  return stockStore.branchStocks[currentBranchId.value]?.[productId] || 0
}

function handleAddToCart(product) {
  const stock = getBranchStock(product.id)
  if (stock <= 0) {
    alert(`Stok produk "${product.name}" habis di ${currentBranchName.value}! Silakan lakukan transfer dari Stok Pusat.`)
    return
  }
  posStore.addToCart(product)
}

function handleCheckout() {
  const result = posStore.checkout(
    currentBranchId.value,
    currentBranchName.value,
    authStore.currentRoleConfig?.title || 'Kasir POS Toko'
  )
  if (result) {
    completedOrder.value = result
    showReceiptModal.value = true
  }
}

function formatNumber(num) {
  return (num || 0).toLocaleString('id-ID')
}
</script>
