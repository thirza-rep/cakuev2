<template>
  <div class="space-y-6 font-sans">
    
    <!-- 1. HEADER UTAMA: MINIMALIS, BERSIH & RAMPING -->
    <div class="p-3.5 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
      <!-- Baris Atas: Ikon, Judul Ringkas, Badge Peran, & Tombol Cabang Cepat -->
      <div class="flex items-center justify-between gap-2.5">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 shadow-xs">
            <Icon name="box" custom-class="w-4.5 h-4.5 sm:w-5 sm:h-5 text-emerald-700" />
          </div>
          <div class="min-w-0">
            <h3 class="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span>Inventaris & Stok</span>
              <span :class="['text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full border uppercase tracking-wider', authStore.currentRoleConfig.color]">
                {{ authStore.currentRoleConfig.title }}
              </span>
            </h3>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <!-- Tombol Aksi Cepat ke Manajemen Cabang -->
          <button 
            v-if="authStore.canManageBranches"
            @click="emit('navigate', 'branches')"
            type="button"
            class="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/90 shadow-2xs transition-all cursor-pointer shrink-0"
            title="Kelola Multi-Cabang & Outlet"
          >
            <Icon name="building" custom-class="w-3.5 h-3.5 text-slate-600" />
            <span class="hidden sm:inline">Kelola</span>
            <span class="text-xs">Cabang</span>
          </button>
        </div>
      </div>

      <!-- In-Page Sub-View Switcher Tabs (Sinkron dengan Sidebar Sub-Menu) -->
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100 text-xs">
        <button
          @click="emit('update:activeSubTab', 'saldo')"
          type="button"
          :class="[
            'px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1.5',
            activeSubTab === 'saldo'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
          ]"
        >
          <Icon name="box" custom-class="w-3.5 h-3.5" />
          <span>Matriks Saldo</span>
        </button>

        <button
          @click="emit('update:activeSubTab', 'transfers')"
          type="button"
          :class="[
            'px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1.5',
            activeSubTab === 'transfers'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
          ]"
        >
          <Icon name="truck" custom-class="w-3.5 h-3.5" />
          <span>Surat Jalan</span>
          <span 
            v-if="stockStore.stockTransfers.length"
            :class="[
              'text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black',
              activeSubTab === 'transfers' ? 'bg-emerald-400 text-slate-950' : 'bg-slate-200 text-slate-700'
            ]"
          >
            {{ stockStore.stockTransfers.length }}
          </span>
        </button>

        <button
          @click="emit('update:activeSubTab', 'mutations')"
          type="button"
          :class="[
            'px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1.5',
            activeSubTab === 'mutations'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
          ]"
        >
          <Icon name="receipt" custom-class="w-3.5 h-3.5" />
          <span>Buku Mutasi</span>
        </button>

        <button
          @click="emit('update:activeSubTab', 'all')"
          type="button"
          :class="[
            'px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1.5',
            activeSubTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
          ]"
        >
          <span>Semua Bagian</span>
        </button>
      </div>
    </div>

    <!-- 2 & 3. BAGIAN MATRIKS SALDO & FILTER -->
    <div v-if="activeSubTab === 'saldo' || activeSubTab === 'all'" class="space-y-6">
      <!-- 2. FILTER & PENCARIAN CEPAT -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs">
      <!-- Search Input -->
      <div class="relative w-full sm:w-72">
        <span class="absolute left-3.5 top-2.5 text-slate-400">
          <Icon name="search" custom-class="w-4 h-4" />
        </span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari SKU atau nama barang..."
          class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
        />
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0 text-xs">
        <button 
          v-for="cat in ['Semua', 'Bahan Baku', 'Sirup', 'Packaging', 'Makanan Jadi']" 
          :key="cat"
          @click="selectedCategory = cat"
          type="button"
          :class="[
            'px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer text-xs shrink-0',
            selectedCategory === cat 
              ? 'bg-slate-900 text-white shadow-2xs' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- 3. STOCK MATRIX TABLE (RESPONSIF PENUH DENGAN QUICK ACTIONS) -->
    <div class="saas-card overflow-hidden">
      <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h4 class="font-bold text-sm sm:text-base text-slate-900">Matriks Saldo Fisik Stok Usaha</h4>
          <p class="text-xs text-slate-500">Perbandingan ketersediaan barang di Gudang Pusat vs 3 Cabang Ritel</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
            Total {{ filteredProducts.length }} Produk
          </span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm border-collapse">
          <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th class="py-3 px-4 sm:px-6">SKU / Nama Produk</th>
              <th class="py-3 px-4 text-right">HPP (Modal)</th>
              <th class="py-3 px-4 text-right">Harga Jual</th>
              <th class="py-3 px-4 text-center bg-emerald-50/70 text-emerald-950 font-extrabold">Stok Pusat</th>
              <th class="py-3 px-4 text-center">Cab. Jakarta</th>
              <th class="py-3 px-4 text-center">Cab. Bandung</th>
              <th class="py-3 px-4 text-center">Cab. Surabaya</th>
              <th class="py-3 px-4 text-center">Status</th>
              <th class="py-3 px-4 text-center">Aksi Cepat</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-800">
            <tr v-for="p in filteredProducts" :key="p.id" class="hover:bg-slate-50/80 transition-colors">
              <!-- Nama & SKU -->
              <td class="py-3.5 px-4 sm:px-6">
                <div class="font-bold text-slate-900 text-xs sm:text-sm">{{ p.name }}</div>
                <div class="text-[11px] text-slate-500 font-mono mt-0.5">{{ p.sku }} • {{ p.category }}</div>
              </td>

              <!-- HPP (RBAC Masking untuk Staff Gudang demi keamanan margin usaha) -->
              <td class="py-3.5 px-4 text-right text-slate-600 font-mono text-xs sm:text-sm">
                <template v-if="authStore.canEditProductPrice || authStore.isOwner || authStore.isManager">
                  Rp {{ formatNumber(p.hpp) }}
                </template>
                <span v-else class="text-slate-400 font-bold italic" title="HPP diproteksi khusus Manajemen">
                  Rp ***
                </span>
              </td>

              <!-- Harga Jual -->
              <td class="py-3.5 px-4 text-right font-bold text-slate-900 font-mono text-xs sm:text-sm">
                Rp {{ formatNumber(p.price) }}
              </td>

              <!-- Stok Pusat -->
              <td class="py-3.5 px-4 text-center bg-emerald-50/40 font-black text-emerald-800 text-xs sm:text-sm">
                {{ p.centralStock }} pcs
              </td>

              <!-- Stok Cabang Jakarta -->
              <td class="py-3.5 px-4 text-center font-bold">
                <span :class="['px-2 py-0.5 rounded-md text-xs', getStock(p.id, 'br-1') <= 5 ? 'bg-rose-100 text-rose-800' : 'text-slate-800']">
                  {{ getStock(p.id, 'br-1') }}
                </span>
              </td>

              <!-- Stok Cabang Bandung -->
              <td class="py-3.5 px-4 text-center font-bold">
                <span :class="['px-2 py-0.5 rounded-md text-xs', getStock(p.id, 'br-2') <= 5 ? 'bg-rose-100 text-rose-800' : 'text-slate-800']">
                  {{ getStock(p.id, 'br-2') }}
                </span>
              </td>

              <!-- Stok Cabang Surabaya -->
              <td class="py-3.5 px-4 text-center font-bold">
                <span :class="['px-2 py-0.5 rounded-md text-xs', getStock(p.id, 'br-3') <= 5 ? 'bg-rose-100 text-rose-800' : 'text-slate-800']">
                  {{ getStock(p.id, 'br-3') }}
                </span>
              </td>

              <!-- Status Alert -->
              <td class="py-3.5 px-4 text-center">
                <span v-if="hasLowStock(p.id)" class="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[10px] font-bold">
                  Restock
                </span>
                <span v-else class="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold">
                  Aman
                </span>
              </td>

              <!-- Quick Stock Actions (Tambah / Kurang) -->
              <td class="py-3.5 px-4 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <!-- Tombol Tambah Stok Masuk -->
                  <button 
                    v-if="authStore.canManageStock"
                    @click="openAdjustmentModal(p, 'in')"
                    type="button"
                    class="w-7 h-7 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                    title="Tambah Stok Masuk / Restock"
                  >
                    <Icon name="plus" custom-class="w-3.5 h-3.5" />
                  </button>

                  <!-- Tombol Kurangi Stok Keluar/Rusak -->
                  <button 
                    v-if="authStore.canManageStock"
                    @click="openAdjustmentModal(p, 'out')"
                    type="button"
                    class="w-7 h-7 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                    title="Kurangi Stok / Barang Rusak"
                  >
                    <Icon name="minus" custom-class="w-3.5 h-3.5" />
                  </button>

                  <!-- Tombol Hapus Produk (Khusus Owner) -->
                  <button 
                    v-if="authStore.canDeleteProduct"
                    @click="confirmDeleteProduct(p)"
                    type="button"
                    class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer"
                    title="Hapus Master Produk"
                  >
                    <Icon name="trash" custom-class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredProducts.length === 0">
              <td colspan="9" class="py-8 text-center text-xs text-slate-400">
                Tidak ada produk yang cocok dengan pencarian "{{ searchQuery }}".
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>

    <!-- 4. ACTIVE SURAT JALAN (IN-TRANSIT TRANSFERS) - PROGRESSIVE DISCLOSURE -->
    <div v-if="activeSubTab === 'transfers' || activeSubTab === 'all'" class="saas-card p-4 sm:p-6 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
            <Icon name="truck" custom-class="w-4 h-4" />
          </div>
          <div>
            <span class="text-sm sm:text-base font-bold text-slate-900">Daftar Surat Jalan Penyaluran Stok</span>
            <p class="text-[11px] text-slate-500">Klik kartu untuk melihat rincian muatan dan kurir</p>
          </div>
        </div>
        <span class="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg">
          {{ stockStore.stockTransfers.length }} Pengiriman
        </span>
      </div>

      <div class="space-y-2.5">
        <div 
          v-for="tf in stockStore.stockTransfers" 
          :key="tf.id"
          class="border border-slate-200/90 hover:border-slate-300 rounded-2xl bg-white hover:bg-slate-50/50 transition-all shadow-2xs overflow-hidden"
        >
          <!-- Compact Summary Row (At-a-glance, Tersirat & Esensial) -->
          <div 
            @click="toggleTransferDetails(tf.id)"
            class="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
          >
            <!-- Left Info: ID + Rute + Status -->
            <div class="flex items-center gap-3 min-w-0">
              <div :class="[
                'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-black shadow-2xs',
                tf.status === 'IN_TRANSIT' ? 'bg-sky-50 text-sky-700' : 'bg-emerald-50 text-emerald-700'
              ]">
                <Icon :name="tf.status === 'IN_TRANSIT' ? 'truck' : 'check'" custom-class="w-4 h-4" />
              </div>

              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-extrabold text-slate-900 font-mono text-xs sm:text-sm tracking-tight">{{ tf.id }}</span>
                  <span :class="[
                    'px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider',
                    tf.status === 'IN_TRANSIT' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                  ]">
                    {{ tf.status === 'IN_TRANSIT' ? 'Dalam Perjalanan' : 'Diterima' }}
                  </span>
                </div>
                <div class="text-xs text-slate-600 font-medium truncate mt-0.5">
                  <span class="text-slate-400">{{ tf.from ? tf.from.replace(' (Central Hub)', '') : 'Pusat' }}</span>
                  <span class="text-slate-400 mx-1">&rarr;</span>
                  <strong class="text-slate-800">{{ tf.to }}</strong>
                </div>
              </div>
            </div>

            <!-- Right Info: Summary Muatan & Chevron Toggle -->
            <div class="flex items-center gap-3 shrink-0">
              <div class="text-right hidden sm:block">
                <div class="text-xs font-extrabold text-slate-900 tabular-nums">
                  {{ getTransferTotalQty(tf.items) }} pcs
                </div>
                <div class="text-[11px] text-slate-400">
                  {{ tf.items ? tf.items.length : 0 }} jenis item
                </div>
              </div>

              <div class="text-right sm:hidden">
                <span class="text-xs font-extrabold text-slate-900 tabular-nums bg-slate-100 px-2 py-0.5 rounded-md">
                  {{ getTransferTotalQty(tf.items) }} pcs
                </span>
              </div>

              <div class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                <svg 
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-180': expandedTransferIds.has(tf.id) }"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Expandable Detail Drawer/Section (Muncul saat diklik) -->
          <div 
            v-if="expandedTransferIds.has(tf.id)"
            class="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/70 space-y-3.5 text-xs animate-fadeIn"
          >
            <!-- Meta Details: Kurir & Waktu -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-600">
              <div class="flex items-center gap-2">
                <span class="text-slate-400 text-[11px]">Waktu Kirim:</span>
                <span class="font-bold text-slate-800">{{ tf.date }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-slate-400 text-[11px]">Kurir / Armada:</span>
                <span class="font-bold text-slate-800">{{ tf.driver || 'Kurir Internal' }}</span>
              </div>
            </div>

            <!-- Detail List Muatan Barang -->
            <div class="border border-slate-200/90 rounded-xl bg-white overflow-hidden">
              <div class="bg-slate-100/70 px-3 py-1.5 font-bold text-[11px] text-slate-600 border-b border-slate-200/70 flex justify-between">
                <span>Rincian Barang Muatan</span>
                <span>Kuantitas</span>
              </div>
              <div class="divide-y divide-slate-100">
                <div 
                  v-for="(it, i) in tf.items" 
                  :key="i"
                  class="px-3 py-2 flex items-center justify-between text-xs hover:bg-slate-50/50"
                >
                  <span class="font-medium text-slate-800">{{ it.productName }}</span>
                  <span class="font-bold text-slate-900 tabular-nums bg-slate-100 px-2 py-0.5 rounded">
                    {{ it.qty }} pcs
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Button: Konfirmasi Terima -->
            <div v-if="tf.status === 'IN_TRANSIT' && authStore.canManageStock" class="pt-1 flex justify-end">
              <button 
                @click.stop="stockStore.receiveTransfer(tf.id)"
                type="button"
                class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Icon name="check" custom-class="w-3.5 h-3.5" />
                <span>Konfirmasi Barang Telah Sampai</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. BUKU RIWAYAT MUTASI STOK (STOCK MOVEMENT LEDGER AUDIT) -->
    <div v-if="activeSubTab === 'mutations' || activeSubTab === 'all'" class="saas-card p-5 sm:p-6 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
        <div class="flex items-center gap-2.5">
          <Icon name="receipt" custom-class="w-5 h-5 text-emerald-700" />
          <div>
            <span class="text-sm sm:text-base font-bold text-slate-900">Buku Riwayat Mutasi Stok Fisik (Inventory Ledger)</span>
            <p class="text-xs text-slate-500">Jejak audit akurat penambahan, pengurangan, dan perpindahan fisik barang</p>
          </div>
        </div>
        <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
          {{ stockStore.stockLedger.length }} Riwayat
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th class="py-2.5 px-3.5">Waktu</th>
              <th class="py-2.5 px-3.5">No Ref</th>
              <th class="py-2.5 px-3.5">Produk</th>
              <th class="py-2.5 px-3.5">Lokasi</th>
              <th class="py-2.5 px-3.5 text-center">Jenis Mutasi</th>
              <th class="py-2.5 px-3.5 text-right">Kuantitas</th>
              <th class="py-2.5 px-3.5">Alasan / Catatan</th>
              <th class="py-2.5 px-3.5">Petugas (Aktor)</th>
              <th class="py-2.5 px-3.5 text-right">Sisa Stok</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="log in stockStore.stockLedger" :key="log.id" class="hover:bg-slate-50/80 transition-colors">
              <td class="py-2.5 px-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">{{ log.timestamp }}</td>
              <td class="py-2.5 px-3.5 font-mono text-[11px] font-bold text-slate-700">{{ log.id }}</td>
              <td class="py-2.5 px-3.5 font-bold text-slate-900">{{ log.productName }}</td>
              <td class="py-2.5 px-3.5 text-slate-600">{{ log.locationName }}</td>
              <td class="py-2.5 px-3.5 text-center">
                <span :class="['px-2 py-0.5 rounded text-[10px] font-extrabold uppercase', log.type === 'IN' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800']">
                  {{ log.type === 'IN' ? 'MASUK (+)' : 'KELUAR (-)' }}
                </span>
              </td>
              <td :class="['py-2.5 px-3.5 text-right font-extrabold font-mono', log.type === 'IN' ? 'text-emerald-700' : 'text-rose-700']">
                {{ log.type === 'IN' ? '+' : '-' }}{{ log.qty }} pcs
              </td>
              <td class="py-2.5 px-3.5 text-slate-700">{{ log.reason }}</td>
              <td class="py-2.5 px-3.5 text-slate-500 font-semibold">{{ log.actorRole }}</td>
              <td class="py-2.5 px-3.5 text-right font-black text-slate-900 font-mono">{{ log.balanceAfter }} pcs</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- MODAL 1: PENYESUAIAN STOK CEPAT (TAMBAH / KURANG FISIK BARANG)  -->
    <!-- ============================================================== -->
    <div v-if="showAdjustModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div @click="showAdjustModal = false" class="absolute inset-0"></div>

      <div class="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-5 sm:p-7 space-y-4 z-10 font-sans max-h-[92vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <div :class="['w-9 h-9 rounded-xl flex items-center justify-center text-white font-black', adjustForm.type === 'in' ? 'bg-emerald-700' : 'bg-rose-600']">
              <Icon :name="adjustForm.type === 'in' ? 'income' : 'expense'" custom-class="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 class="text-base font-black text-slate-900">
                {{ adjustForm.type === 'in' ? 'Catat Barang Masuk (Restock)' : 'Catat Barang Keluar / Rusak' }}
              </h3>
              <p class="text-[11px] text-slate-500">Mutasi fisik terdata di Stock Movement Ledger</p>
            </div>
          </div>
          <button @click="showAdjustModal = false" type="button" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer">
            <Icon name="close" custom-class="w-4 h-4" />
          </button>
        </div>

        <!-- Toggle Type: Masuk vs Keluar -->
        <div class="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button 
            @click="adjustForm.type = 'in'"
            type="button"
            :class="['py-2 rounded-lg transition-all cursor-pointer', adjustForm.type === 'in' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600']"
          >
            Barang Masuk (Restock)
          </button>
          <button 
            @click="adjustForm.type = 'out'"
            type="button"
            :class="['py-2 rounded-lg transition-all cursor-pointer', adjustForm.type === 'out' ? 'bg-white text-rose-800 shadow-2xs font-extrabold' : 'text-slate-600']"
          >
            Barang Keluar (Rusak/Expired)
          </button>
        </div>

        <!-- Form Input Penyesuaian -->
        <div class="space-y-3 text-xs sm:text-sm">
          <!-- Pilih Produk -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Pilih Produk / Bahan</label>
            <select v-model="adjustForm.productId" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-emerald-500">
              <option v-for="p in stockStore.products" :key="p.id" :value="p.id">
                {{ p.name }} (Pusat: {{ p.centralStock }} pcs)
              </option>
            </select>
          </div>

          <!-- Lokasi Gudang / Cabang -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="font-bold text-slate-700">Lokasi Penyimpanan</label>
              <span v-if="authStore.isWarehouse" class="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                Staff Gudang Terkunci: Gudang Pusat
              </span>
            </div>
            <select 
              v-model="adjustForm.location" 
              :disabled="authStore.isWarehouse"
              class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-emerald-500 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <option value="central">Gudang Pusat (Central Hub)</option>
              <option v-for="b in authStore.branches" :key="b.id" :value="b.id">
                {{ b.name }} ({{ b.code }})
              </option>
            </select>
          </div>

          <!-- Kuantitas & Alasan -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Jumlah (Qty)</label>
              <input 
                v-model.number="adjustForm.qty" 
                type="number" 
                min="1" 
                placeholder="1"
                class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500 text-base"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Alasan Penyesuaian</label>
              <select v-model="adjustForm.reason" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-emerald-500">
                <template v-if="adjustForm.type === 'in'">
                  <option value="Restock Pembelian Supplier">Restock Pembelian Supplier</option>
                  <option value="Hasil Produksi Dapur Pusat">Hasil Produksi Dapur Pusat</option>
                  <option value="Koreksi Lebih Opname Fisik">Koreksi Lebih Opname Fisik</option>
                  <option value="Retur Barang Dari Cabang">Retur Barang Dari Cabang</option>
                  <option value="Lainnya">Lainnya</option>
                </template>
                <template v-else>
                  <option value="Barang Rusak / Pecah / Cacat">Barang Rusak / Pecah / Cacat</option>
                  <option value="Kadaluarsa (Expired)">Kadaluarsa (Expired)</option>
                  <option value="Sampel Promosi & Uji Rasa">Sampel Promosi & Uji Rasa</option>
                  <option value="Koreksi Kurang Opname Fisik">Koreksi Kurang Opname Fisik</option>
                  <option value="Lainnya">Lainnya</option>
                </template>
              </select>
            </div>
          </div>

          <!-- Opsi RBAC: Sinkronisasi ke Buku Kas Keuangan -->
          <div class="pt-2">
            <template v-if="authStore.canSyncStockToFinance && adjustForm.type === 'in'">
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <input v-model="adjustForm.syncFinance" type="checkbox" class="w-4 h-4 rounded text-emerald-600 focus:ring-0 cursor-pointer" />
                  <span class="font-bold text-xs text-slate-800">Sinkronkan Otomatis ke Buku Kas Usaha</span>
                </label>
                
                <div v-if="adjustForm.syncFinance" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 animate-fade-in">
                  <div>
                    <label class="block text-[11px] font-bold text-slate-600 mb-1">Total Biaya Beli (Rp)</label>
                    <input 
                      v-model.number="adjustForm.cost" 
                      type="number" 
                      placeholder="0"
                      class="w-full px-2.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-bold text-slate-600 mb-1">Rekening Sumber Kas</label>
                    <select v-model="adjustForm.accountName" class="w-full px-2.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-medium">
                      <option v-for="acc in financeStore.accounts" :key="acc.id" :value="acc.name">
                        {{ acc.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </template>

            <!-- Keterangan RBAC untuk Staff Gudang -->
            <div v-else-if="authStore.isWarehouse" class="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs">
              <span class="font-bold">Proteksi RBAC:</span> Staff Gudang hanya mencatat mutasi fisik barang. Pembukuan transaksi kas pengeluaran dicatat secara terpisah oleh Manajer Keuangan / Owner.
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button 
            @click="showAdjustModal = false" 
            type="button" 
            class="px-4 py-2.5 text-xs text-slate-600 hover:text-slate-800 font-semibold cursor-pointer"
          >
            Batal
          </button>
          <button 
            @click="handleSaveStockAdjustment" 
            type="button" 
            class="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer shadow-xs transition-all"
          >
            Simpan Mutasi Stok
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- MODAL 2: TAMBAH MASTER PRODUK BARU (KHUSUS OWNER & MANAJER)    -->
    <!-- ============================================================== -->
    <div v-if="showAddProductModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div @click="showAddProductModal = false" class="absolute inset-0"></div>

      <div class="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-5 sm:p-7 space-y-4 z-10 font-sans max-h-[92vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Icon name="plus" custom-class="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 class="text-base font-black text-slate-900">Tambah Master Produk / Bahan Baru</h3>
              <p class="text-[11px] text-slate-500">Hanya dapat didaftarkan oleh Owner atau Manajer</p>
            </div>
          </div>
          <button @click="showAddProductModal = false" type="button" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer">
            <Icon name="close" custom-class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3 text-xs sm:text-sm">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Nama Produk / Bahan Baku</label>
            <input 
              v-model="newProductForm.name" 
              type="text" 
              placeholder="Misal: Cokelat Meises Premium 1kg"
              class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">SKU Barang</label>
              <input 
                v-model="newProductForm.sku" 
                type="text" 
                placeholder="CKU-COK-07"
                class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Kategori</label>
              <select v-model="newProductForm.category" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-emerald-500">
                <option value="Bahan Baku">Bahan Baku</option>
                <option value="Sirup">Sirup</option>
                <option value="Packaging">Packaging</option>
                <option value="Makanan Jadi">Makanan Jadi</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">HPP Modal (Rp)</label>
              <input 
                v-model.number="newProductForm.hpp" 
                type="number" 
                placeholder="25000"
                class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Harga Jual (Rp)</label>
              <input 
                v-model.number="newProductForm.price" 
                type="number" 
                placeholder="40000"
                class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Stok Awal Gudang Pusat</label>
              <input 
                v-model.number="newProductForm.centralStock" 
                type="number" 
                placeholder="50"
                class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Batas Alert Min (pcs)</label>
              <input 
                v-model.number="newProductForm.minAlert" 
                type="number" 
                placeholder="15"
                class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button @click="showAddProductModal = false" type="button" class="px-4 py-2.5 text-xs text-slate-600 hover:text-slate-800 font-semibold cursor-pointer">Batal</button>
          <button 
            @click="handleSaveNewProduct" 
            :disabled="!newProductForm.name"
            type="button" 
            class="px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl cursor-pointer shadow-xs disabled:opacity-50"
          >
            Daftarkan Produk
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- MODAL 3: BUAT SURAT JALAN TRANSFER ANTAR-CABANG               -->
    <!-- ============================================================== -->
    <div v-if="showTransferModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div @click="showTransferModal = false" class="absolute inset-0"></div>

      <div class="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-5 sm:p-7 space-y-4 z-10 font-sans max-h-[92vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center">
              <Icon name="truck" custom-class="w-4 h-4 text-sky-700" />
            </div>
            <div>
              <h3 class="text-base font-black text-slate-900">Buat Surat Jalan Penyaluran Stok</h3>
              <p class="text-[11px] text-slate-500">Pengiriman dari Gudang Pusat ke Cabang Ritel</p>
            </div>
          </div>
          <button @click="showTransferModal = false" type="button" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer">
            <Icon name="close" custom-class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3 text-xs sm:text-sm">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Pilih Cabang Tujuan</label>
            <select v-model="selectedBranch" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-emerald-500">
              <option v-for="b in authStore.branches" :key="b.id" :value="b.id">
                {{ b.name }} ({{ b.code }})
              </option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Pilih Produk</label>
            <select v-model="selectedProduct" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-emerald-500">
              <option v-for="p in stockStore.products" :key="p.id" :value="p">
                {{ p.name }} (Stok Gudang: {{ p.centralStock }} pcs)
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Jumlah Transfer (Qty)</label>
              <input 
                v-model.number="transferQty" 
                type="number" 
                min="1" 
                :max="selectedProduct?.centralStock || 100"
                class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500" 
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Nama Kurir / Armada</label>
              <input 
                v-model="driverName" 
                type="text" 
                placeholder="Armada Truk 02" 
                class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 font-medium" 
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button @click="showTransferModal = false" type="button" class="px-4 py-2.5 text-xs text-slate-600 hover:text-slate-800 font-semibold cursor-pointer">Batal</button>
          <button 
            @click="handleCreateTransfer" 
            :disabled="!selectedProduct || transferQty <= 0 || transferQty > (selectedProduct?.centralStock || 0)"
            type="button" 
            class="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer shadow-xs disabled:opacity-50"
          >
            Kirimkan Stok (Buat SJ)
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStockStore } from '../../stores/stockStore'
import { useAuthStore } from '../../stores/authStore'
import { useFinanceStore } from '../../stores/financeStore'
import Icon from '../common/Icon.vue'

const props = defineProps({
  activeSubTab: {
    type: String,
    default: 'saldo' // 'saldo', 'transfers', 'mutations', 'all'
  },
  triggeredAction: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['navigate', 'update:activeSubTab'])

// Watcher untuk merespons aksi yang dipicu dari Sub-Menu Sidebar
watch(() => props.triggeredAction, (newVal) => {
  if (!newVal || !newVal.action) return
  if (newVal.action === 'action-inbound') {
    openAdjustmentModal(null, 'in')
  } else if (newVal.action === 'action-outbound') {
    openAdjustmentModal(null, 'out')
  } else if (newVal.action === 'action-product') {
    showAddProductModal.value = true
  } else if (newVal.action === 'action-transfer') {
    showTransferModal.value = true
  }
})

const stockStore = useStockStore()
const authStore = useAuthStore()
const financeStore = useFinanceStore()

// Filter State
const searchQuery = ref('')
const selectedCategory = ref('Semua')

// Modals State
const showAdjustModal = ref(false)
const showAddProductModal = ref(false)
const showTransferModal = ref(false)

// Expand/Collapse Detail Surat Jalan
const expandedTransferIds = ref(new Set())

function toggleTransferDetails(id) {
  if (expandedTransferIds.value.has(id)) {
    expandedTransferIds.value.delete(id)
  } else {
    expandedTransferIds.value.add(id)
  }
}

function getTransferTotalQty(items) {
  if (!items || !items.length) return 0
  return items.reduce((sum, it) => sum + (it.qty || 0), 0)
}

// Adjustment Form State
const adjustForm = ref({
  type: 'in', // 'in' or 'out'
  productId: stockStore.products[0]?.id || 'PRD-01',
  location: authStore.isWarehouse ? 'central' : 'central',
  qty: 10,
  reason: 'Restock Pembelian Supplier',
  syncFinance: false,
  cost: 0,
  accountName: financeStore.accounts[0]?.name || 'BCA Prioritas'
})

// New Product Form State
const newProductForm = ref({
  name: '',
  sku: '',
  category: 'Bahan Baku',
  hpp: 0,
  price: 0,
  centralStock: 0,
  minAlert: 20
})

// Transfer Form State
const selectedBranch = ref('br-3')
const selectedProduct = ref(stockStore.products[0])
const transferQty = ref(20)
const driverName = ref('Armada Logistik Truk 02')

const filteredProducts = computed(() => {
  return stockStore.products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCat = selectedCategory.value === 'Semua' || p.category === selectedCategory.value
    return matchesSearch && matchesCat
  })
})

function getStock(productId, branchId) {
  return stockStore.branchStocks[branchId]?.[productId] || 0
}

function hasLowStock(productId) {
  return ['br-1', 'br-2', 'br-3'].some(b => getStock(productId, b) <= 5)
}

function formatNumber(num) {
  return (num || 0).toLocaleString('id-ID')
}

// Buka Modal Tambah/Kurang Cepat
function openAdjustmentModal(product = null, type = 'in') {
  adjustForm.value.type = type
  if (product) {
    adjustForm.value.productId = product.id
  } else if (!adjustForm.value.productId && stockStore.products.length > 0) {
    adjustForm.value.productId = stockStore.products[0].id
  }
  adjustForm.value.reason = type === 'in' ? 'Restock Pembelian Supplier' : 'Barang Rusak / Pecah / Cacat'
  adjustForm.value.qty = 10
  adjustForm.value.syncFinance = false
  adjustForm.value.cost = 0
  showAdjustModal.value = true
}

// Simpan Penyesuaian Stok (Tambah atau Kurang)
function handleSaveStockAdjustment() {
  if (!adjustForm.value.productId || adjustForm.value.qty <= 0) {
    alert('Kuantitas stok harus lebih dari 0.')
    return
  }

  const result = stockStore.adjustStock({
    productId: adjustForm.value.productId,
    location: adjustForm.value.location,
    type: adjustForm.value.type,
    qty: adjustForm.value.qty,
    reason: adjustForm.value.reason,
    actorRole: authStore.currentRoleConfig.title
  })

  // Jika Owner/Manajer mencentang sinkronisasi kas keuangan
  if (adjustForm.value.syncFinance && adjustForm.value.type === 'in' && adjustForm.value.cost > 0 && authStore.canSyncStockToFinance) {
    financeStore.addTransaction({
      amount: adjustForm.value.cost,
      type: 'expense',
      desc: `Pembelian Stok ${result.productName} (${adjustForm.value.qty} pcs)`,
      category: 'Belanja Bahan Baku',
      account: adjustForm.value.accountName
    })
  }

  showAdjustModal.value = false
}

// Simpan Master Produk Baru
function handleSaveNewProduct() {
  if (!newProductForm.value.name) return

  stockStore.addProduct({
    name: newProductForm.value.name,
    sku: newProductForm.value.sku,
    category: newProductForm.value.category,
    hpp: newProductForm.value.hpp,
    price: newProductForm.value.price,
    centralStock: newProductForm.value.centralStock,
    minAlert: newProductForm.value.minAlert
  })

  // Reset form
  newProductForm.value = {
    name: '',
    sku: '',
    category: 'Bahan Baku',
    hpp: 0,
    price: 0,
    centralStock: 0,
    minAlert: 20
  }
  showAddProductModal.value = false
}

// Hapus Master Produk
function confirmDeleteProduct(product) {
  if (!authStore.canDeleteProduct) {
    alert('Hanya Owner yang memiliki wewenang menghapus produk.')
    return
  }
  if (confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"?`)) {
    stockStore.deleteProduct(product.id)
  }
}

// Buat Surat Jalan
function handleCreateTransfer() {
  if (!selectedProduct.value || transferQty.value <= 0) return
  
  const targetBranch = authStore.branches.find(b => b.id === selectedBranch.value)
  const branchName = targetBranch ? targetBranch.name : 'Cabang Toko'

  stockStore.createTransfer(
    selectedBranch.value,
    branchName,
    [{ productId: selectedProduct.value.id, name: selectedProduct.value.name, qty: transferQty.value }],
    driverName.value
  )

  showTransferModal.value = false
}
</script>
