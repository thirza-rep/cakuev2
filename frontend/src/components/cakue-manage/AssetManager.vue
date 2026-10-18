<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12 font-sans">

    <!-- 0. FALLBACK PROTEKSI RBAC: HANYA OWNER & DIREKTUR (STRICT OWNER ONLY) -->
    <div 
      v-if="!authStore.isOwner" 
      class="p-8 sm:p-12 bg-white border border-slate-200 rounded-3xl shadow-xs text-center space-y-4 max-w-xl mx-auto mt-6"
    >
      <div class="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
        <Icon name="lock" custom-class="w-8 h-8 text-amber-600" />
      </div>
      <div class="space-y-1.5">
        <h2 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Akses Khusus Owner & Direktur</h2>
        <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Modul <strong>Manajemen Aset Tetap & Depresiasi Bulanan</strong> dilindungi oleh sistem RBAC (*Role-Based Access Control*). Peran aktif Anda (<strong>{{ authStore.currentRoleConfig.title }}</strong>) tidak memiliki otorisasi untuk melihat atau mengelola nilai buku aset modal perusahaan.
        </p>
      </div>
      <div class="pt-2">
        <button 
          @click="$emit('navigate', 'dashboard')" 
          type="button"
          class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
        >
          Kembali ke Dashboard Utama
        </button>
      </div>
    </div>

    <!-- AREA UTAMA KHUSUS OWNER -->
    <template v-else>
      <!-- 1. HEADER UTAMA: SLIM & BERSIH -->
      <div class="flex items-center justify-between gap-3 p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Icon name="building" custom-class="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
          </div>
          <div class="min-w-0">
            <h1 class="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span>Manajemen Aset & Depresiasi</span>
              <span class="text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full border uppercase tracking-wider bg-purple-100 text-purple-800 border-purple-200">
                Owner & Direktur
              </span>
            </h1>
          </div>
        </div>

        <!-- Tombol Aksi Cepat Header -->
        <div class="flex items-center gap-2 shrink-0">
          <button 
            @click="openDepreciationModal"
            type="button"
            class="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer border border-slate-300 shadow-2xs"
            title="Hitung Depresiasi Bulanan Semua Aset"
          >
            <Icon name="calculator" custom-class="w-3.5 h-3.5 text-slate-700" />
            <span>Eksekusi Depresiasi</span>
          </button>

          <button 
            @click="openAddModal"
            type="button"
            class="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Icon name="plus" custom-class="w-3.5 h-3.5 text-white" />
            <span>Tambah Aset</span>
          </button>
        </div>
      </div>

      <!-- 2. ALERT NOTIFIKASI -->
      <transition name="fade">
        <div v-if="alertMessage" :class="['p-3.5 rounded-2xl flex items-center justify-between text-xs shadow-xs border', alertType === 'error' ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900']">
          <div class="flex items-center gap-2.5 font-bold">
            <Icon :name="alertType === 'error' ? 'alert' : 'check'" :custom-class="['w-4 h-4 shrink-0', alertType === 'error' ? 'text-rose-700' : 'text-emerald-700']" />
            <span>{{ alertMessage }}</span>
          </div>
          <button @click="alertMessage = ''" class="font-bold cursor-pointer text-xs underline">
            Tutup
          </button>
        </div>
      </transition>

      <!-- 3. QUICK STATS KPI METRICS (COMPACT HORIZONTAL STRIP) -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <!-- Total Nilai Buku -->
        <div class="p-3 bg-white border border-slate-200/90 rounded-xl shadow-2xs flex items-center justify-between">
          <div>
            <div class="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Total Nilai Buku</div>
            <div class="text-sm sm:text-base font-black text-emerald-700 font-mono mt-0.5">
              Rp {{ formatNumber(totalBookValue) }}
            </div>
          </div>
          <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Icon name="money" custom-class="w-4 h-4" />
          </div>
        </div>

        <!-- Total Harga Perolehan -->
        <div class="p-3 bg-white border border-slate-200/90 rounded-xl shadow-2xs flex items-center justify-between">
          <div>
            <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Perolehan</div>
            <div class="text-sm sm:text-base font-black text-slate-900 font-mono mt-0.5">
              Rp {{ formatNumber(totalCostValue) }}
            </div>
          </div>
          <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Icon name="building" custom-class="w-4 h-4" />
          </div>
        </div>

        <!-- Akumulasi Penyusutan -->
        <div class="p-3 bg-white border border-slate-200/90 rounded-xl shadow-2xs flex items-center justify-between">
          <div>
            <div class="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Akumulasi Susut</div>
            <div class="text-sm sm:text-base font-black text-amber-700 font-mono mt-0.5">
              -Rp {{ formatNumber(totalDepreciationValue) }}
            </div>
          </div>
          <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Icon name="calculator" custom-class="w-4 h-4" />
          </div>
        </div>

        <!-- Total Unit Aset -->
        <div class="p-3 bg-white border border-slate-200/90 rounded-xl shadow-2xs flex items-center justify-between">
          <div>
            <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Unit Aset</div>
            <div class="text-sm sm:text-base font-black text-slate-900 font-mono mt-0.5">
              {{ stockStore.assets.length }} Unit
            </div>
          </div>
          <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <span class="text-xs font-black">{{ stockStore.assets.length }}</span>
          </div>
        </div>
      </div>

      <!-- 4. FILTER & PENCARIAN ASET -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-2.5 p-3 sm:p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
        <div class="relative w-full sm:w-80">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari aset, kode AST, cabang..."
            class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none font-medium"
          />
          <Icon name="search" custom-class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-0.5 sm:pb-0 text-xs">
          <!-- Filter Cabang -->
          <select 
            v-model="branchFilter"
            class="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Cabang</option>
            <option v-for="b in authStore.branches" :key="b.id" :value="b.name">
              {{ b.name }}
            </option>
          </select>

          <!-- Filter Kategori -->
          <select 
            v-model="categoryFilter"
            class="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            <option value="Mesin & Peralatan">Mesin & Peralatan</option>
            <option value="Elektronik & POS">Elektronik & POS</option>
            <option value="Kendaraan">Kendaraan</option>
            <option value="Inventaris Toko">Inventaris Toko</option>
          </select>

          <!-- Tombol Eksekusi Cepat di Mobile -->
          <button 
            @click="openDepreciationModal"
            type="button"
            class="sm:hidden px-2.5 py-1.5 bg-slate-100 border border-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Icon name="calculator" custom-class="w-3.5 h-3.5" />
            <span>Susutkan</span>
          </button>
        </div>
      </div>

      <!-- 5. DAFTAR ASET (PROGRESSIVE DISCLOSURE: AT-A-GLANCE, KLIK UNTUK DETAIL LENGKAP) -->
      <div class="space-y-3">
        <div 
          v-if="filteredAssets.length === 0" 
          class="p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-2"
        >
          <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Icon name="search" custom-class="w-5 h-5" />
          </div>
          <div class="font-bold text-slate-700 text-xs">Tidak ada aset tetap yang sesuai kriteria pencarian</div>
          <p class="text-[11px] text-slate-400">Gunakan tombol "Tambah Aset" untuk mendaftarkan aset tetap modal baru.</p>
        </div>

        <div 
          v-for="ast in filteredAssets" 
          :key="ast.id"
          class="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl shadow-2xs transition-all overflow-hidden"
        >
          <!-- Compact Summary Row (At-a-glance, Tersirat & Esensial) -->
          <div 
            @click="toggleAssetDetails(ast.id)"
            class="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-50/60 transition-colors"
          >
            <!-- Left Info: Ikon + Nama Aset + Kode + Cabang & Kategori -->
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Icon name="building" custom-class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800" />
              </div>

              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight truncate">{{ ast.name }}</span>
                  <span class="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded border border-slate-200">
                    {{ ast.id }}
                  </span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80">
                    {{ ast.category || 'Aset Tetap' }}
                  </span>
                </div>
                <div class="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1.5">
                  <span class="text-slate-700 font-semibold">{{ ast.branch }}</span>
                  <span>•</span>
                  <span>Umur {{ ast.usefulLifeYears }} Thn</span>
                  <span>•</span>
                  <span class="text-amber-700 font-medium">-Rp {{ formatNumber(ast.monthlyDepreciation) }}/bln</span>
                </div>
              </div>
            </div>

            <!-- Right Info: Nilai Buku Terkini & Chevron Toggle -->
            <div class="flex items-center gap-3 shrink-0">
              <div class="text-right">
                <div class="text-xs sm:text-sm font-extrabold text-slate-900 font-mono tabular-nums">
                  Rp {{ formatNumber(ast.currentValue) }}
                </div>
                <div class="text-[10px] text-slate-400 font-medium hidden sm:block">
                  Nilai Buku Terkini
                </div>
              </div>

              <div class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                <svg 
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-180': expandedAssetIds.has(ast.id) }"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Expandable Detail Drawer (Muncul saat baris diklik) -->
          <div 
            v-if="expandedAssetIds.has(ast.id)"
            class="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/60 space-y-3.5 text-xs animate-fadeIn"
          >
            <!-- Progress Bar Nilai Buku vs Harga Perolehan -->
            <div class="p-3 bg-white border border-slate-200/80 rounded-xl space-y-1.5">
              <div class="flex items-center justify-between text-[11px]">
                <span class="text-slate-500 font-medium">Sisa Nilai Buku vs Modal Awal</span>
                <span class="font-mono font-bold text-slate-800">
                  {{ calculateRemainingPercent(ast) }}% Tersisa
                </span>
              </div>
              <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                  :style="{ width: `${calculateRemainingPercent(ast)}%` }"
                ></div>
              </div>
            </div>

            <!-- Matriks Rincian Keuangan Aset -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-slate-600">
              <div class="p-2.5 bg-white border border-slate-200/80 rounded-xl space-y-1">
                <div class="text-[10px] text-slate-400 font-bold uppercase">Tgl Perolehan</div>
                <div class="font-bold text-slate-800">{{ ast.purchaseDate || '-' }}</div>
              </div>

              <div class="p-2.5 bg-white border border-slate-200/80 rounded-xl space-y-1">
                <div class="text-[10px] text-slate-400 font-bold uppercase">Harga Beli Awal</div>
                <div class="font-mono font-bold text-slate-800">Rp {{ formatNumber(ast.cost) }}</div>
              </div>

              <div class="p-2.5 bg-white border border-slate-200/80 rounded-xl space-y-1">
                <div class="text-[10px] text-slate-400 font-bold uppercase">Nilai Residu</div>
                <div class="font-mono font-bold text-slate-800">Rp {{ formatNumber(ast.salvageValue || 0) }}</div>
              </div>

              <div class="p-2.5 bg-white border border-slate-200/80 rounded-xl space-y-1">
                <div class="text-[10px] text-amber-600 font-bold uppercase">Akumulasi Susut</div>
                <div class="font-mono font-bold text-amber-700">
                  -Rp {{ formatNumber(ast.accumulatedDepreciation || (ast.cost - ast.currentValue)) }}
                </div>
              </div>
            </div>

            <!-- Catatan Tambahan Jika Ada -->
            <div v-if="ast.notes" class="p-2.5 bg-white border border-slate-200/80 rounded-xl text-slate-600 text-[11px]">
              <strong class="text-slate-800">Catatan:</strong> {{ ast.notes }}
            </div>

            <!-- Tombol Aksi RBAC (Khusus Owner & Direktur) -->
            <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
              <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Icon name="shield" custom-class="w-3.5 h-3.5 text-purple-600" />
                <span>Otoritas Pemilik</span>
              </div>

              <div class="flex items-center gap-2">
                <!-- Susutkan 1 Bulan -->
                <button 
                  @click.stop="handleSingleDepreciate(ast)"
                  type="button"
                  :disabled="ast.currentValue <= (ast.salvageValue || 0)"
                  :class="[
                    'px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-2xs',
                    ast.currentValue <= (ast.salvageValue || 0)
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                  ]"
                  title="Catat penyusutan 1 periode bulanan untuk aset ini"
                >
                  <Icon name="calculator" custom-class="w-3.5 h-3.5" />
                  <span>Susutkan 1 Bln</span>
                </button>

                <!-- Edit Aset -->
                <button 
                  @click.stop="openEditModal(ast)"
                  type="button"
                  class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer border border-slate-200 shadow-2xs"
                >
                  <Icon name="edit" custom-class="w-3.5 h-3.5 text-slate-600" />
                  <span>Edit</span>
                </button>

                <!-- Hapus Aset -->
                <button 
                  @click.stop="openDeleteConfirm(ast)"
                  type="button"
                  class="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer border border-rose-200 shadow-2xs"
                >
                  <Icon name="trash" custom-class="w-3.5 h-3.5 text-rose-600" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- MODAL 1: FORM TAMBAH / EDIT ASET TETAP -->
    <transition name="fade">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto font-sans">
          <!-- Modal Header -->
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <Icon name="building" custom-class="w-4 h-4 text-white" />
              </div>
              <h3 class="text-sm sm:text-base font-black text-slate-900">
                {{ isEditing ? 'Edit Aset Tetap' : 'Pendaftaran Aset Tetap Baru' }}
              </h3>
            </div>
            <button @click="showModal = false" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
              <Icon name="close" custom-class="w-5 h-5" />
            </button>
          </div>

          <!-- Form Body -->
          <form @submit.prevent="saveAsset" class="space-y-3.5 text-xs">
            <!-- Nama Aset -->
            <div>
              <label class="block text-slate-600 font-bold mb-1">Nama Aset Tetap *</label>
              <input 
                v-model="form.name"
                type="text" 
                required
                placeholder="Contoh: Mesin Espresso La Marzocco 2 Group"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none font-semibold"
              />
            </div>

            <!-- Kategori & Cabang Penempatan -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-600 font-bold mb-1">Kategori Aset</label>
                <select 
                  v-model="form.category"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none cursor-pointer"
                >
                  <option value="Mesin & Peralatan">Mesin & Peralatan</option>
                  <option value="Elektronik & POS">Elektronik & POS</option>
                  <option value="Kendaraan">Kendaraan Operasional</option>
                  <option value="Inventaris Toko">Inventaris & Furniture Toko</option>
                </select>
              </div>

              <div>
                <label class="block text-slate-600 font-bold mb-1">Cabang Penempatan *</label>
                <select 
                  v-model="form.branch"
                  required
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none cursor-pointer"
                >
                  <option v-for="b in authStore.branches" :key="b.id" :value="b.name">
                    {{ b.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Tanggal Perolehan & Umur Ekonomis -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-600 font-bold mb-1">Tanggal Pembelian / Perolehan</label>
                <input 
                  v-model="form.purchaseDate"
                  type="date"
                  required
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none font-semibold cursor-pointer"
                />
              </div>

              <div>
                <label class="block text-slate-600 font-bold mb-1">Umur Ekonomis (Tahun) *</label>
                <input 
                  v-model.number="form.usefulLifeYears"
                  type="number"
                  min="1"
                  max="50"
                  required
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none font-semibold font-mono"
                />
              </div>
            </div>

            <!-- Harga Beli & Nilai Residu -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-600 font-bold mb-1">Harga Beli / Perolehan (Rp) *</label>
                <input 
                  v-model.number="form.cost"
                  type="number"
                  min="10000"
                  required
                  placeholder="Contoh: 125000000"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none font-semibold font-mono"
                />
              </div>

              <div>
                <label class="block text-slate-600 font-bold mb-1">Nilai Residu Sisa (Rp)</label>
                <input 
                  v-model.number="form.salvageValue"
                  type="number"
                  min="0"
                  placeholder="Contoh: 20000000"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none font-semibold font-mono"
                />
              </div>
            </div>

            <!-- Live Depreciation Calculation Preview -->
            <div class="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-1">
              <div class="text-[10px] text-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1">
                <Icon name="calculator" custom-class="w-3.5 h-3.5 text-emerald-700" />
                <span>Kalkulasi Otomatis Metode Garis Lurus:</span>
              </div>
              <div class="flex items-center justify-between text-xs pt-1">
                <span class="text-slate-600">Estimasi Beban Depresiasi / Bulan:</span>
                <span class="font-mono font-black text-emerald-800 text-sm">
                  Rp {{ formatNumber(estimatedMonthlyDepreciation) }}
                </span>
              </div>
              <div class="text-[10px] text-slate-500">
                Dasar: (Rp {{ formatNumber(form.cost || 0) }} - Rp {{ formatNumber(form.salvageValue || 0) }}) ÷ {{ (form.usefulLifeYears || 1) * 12 }} Bulan
              </div>
            </div>

            <!-- Catatan -->
            <div>
              <label class="block text-slate-600 font-bold mb-1">Catatan Penempatan / Nomor Seri (Opsional)</label>
              <textarea 
                v-model="form.notes"
                rows="2"
                placeholder="Contoh: Terpasang di meja bar utama, SN: LMC-2025-9921"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
              ></textarea>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button 
                type="button" 
                @click="showModal = false"
                class="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button 
                type="submit"
                class="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Icon name="check" custom-class="w-4 h-4 text-white" />
                <span>{{ isEditing ? 'Simpan Perubahan' : 'Daftarkan Aset' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- MODAL 2: KONFIRMASI DEPRESIASI BULANAN MASSAL -->
    <transition name="fade">
      <div v-if="showDepreciationModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 font-sans text-xs">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
              <Icon name="calculator" custom-class="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 class="text-sm sm:text-base font-black text-slate-900">Eksekusi Depresiasi Bulanan</h3>
              <p class="text-[11px] text-slate-500">Pencatatan beban penyusutan reguler semua cabang</p>
            </div>
          </div>

          <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-slate-600">Total Aset yang Terdaftar:</span>
              <strong class="font-mono text-slate-900">{{ stockStore.assets.length }} Unit</strong>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-600">Total Beban Susut Periode Ini:</span>
              <strong class="font-mono text-amber-700 text-sm">
                -Rp {{ formatNumber(totalMonthlyDepreciationRate) }}
              </strong>
            </div>
          </div>

          <p class="text-slate-500 leading-relaxed text-[11px]">
            Tindakan ini akan memotong 1 bulan nilai buku pada seluruh aset yang belum mencapai nilai residu minimal secara otomatis.
          </p>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button 
              type="button" 
              @click="showDepreciationModal = false"
              class="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="button" 
              @click="confirmBatchDepreciation"
              class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Icon name="calculator" custom-class="w-4 h-4 text-white" />
              <span>Jalankan Penyusutan</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- MODAL 3: KONFIRMASI HAPUS ASET -->
    <transition name="fade">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 font-sans text-xs">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center shrink-0">
              <Icon name="alert" custom-class="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 class="text-sm sm:text-base font-black text-slate-900">Hapus Data Aset?</h3>
              <p class="text-[11px] text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
            </div>
          </div>

          <p class="text-slate-600 leading-relaxed">
            Apakah Anda yakin ingin menghapus aset <strong>{{ assetToDelete?.name }}</strong> (Kode: {{ assetToDelete?.id }}) dari pembukuan aset perusahaan?
          </p>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button 
              type="button" 
              @click="showDeleteModal = false"
              class="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="button" 
              @click="confirmDeleteAsset"
              class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Icon name="trash" custom-class="w-4 h-4 text-white" />
              <span>Ya, Hapus Aset</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStockStore } from '../../stores/stockStore'
import { useAuthStore } from '../../stores/authStore'
import Icon from '../common/Icon.vue'

const props = defineProps({
  autoOpenAdd: {
    type: Boolean,
    default: false
  },
  autoOpenDepreciation: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'resetAutoOpenAdd',
  'resetAutoOpenDepreciation',
  'navigate'
])

const stockStore = useStockStore()
const authStore = useAuthStore()

// State Alert & Notifikasi
const alertMessage = ref('')
const alertType = ref('success') // 'success' | 'error'

function triggerAlert(msg, type = 'success') {
  alertMessage.value = msg
  alertType.value = type
  setTimeout(() => {
    if (alertMessage.value === msg) {
      alertMessage.value = ''
    }
  }, 4500)
}

// State Pencarian & Filter
const searchQuery = ref('')
const branchFilter = ref('all')
const categoryFilter = ref('all')

// Accordion Expand State
const expandedAssetIds = ref(new Set())

function toggleAssetDetails(id) {
  if (expandedAssetIds.value.has(id)) {
    expandedAssetIds.value.delete(id)
  } else {
    expandedAssetIds.value.add(id)
  }
}

// Perhitungan Metrik KPI
const totalBookValue = computed(() => {
  return stockStore.assets.reduce((sum, a) => sum + (Number(a.currentValue) || 0), 0)
})

const totalCostValue = computed(() => {
  return stockStore.assets.reduce((sum, a) => sum + (Number(a.cost) || 0), 0)
})

const totalDepreciationValue = computed(() => {
  return stockStore.assets.reduce((sum, a) => {
    const acc = Number(a.accumulatedDepreciation) || (Number(a.cost || 0) - Number(a.currentValue || 0))
    return sum + Math.max(0, acc)
  }, 0)
})

const totalMonthlyDepreciationRate = computed(() => {
  return stockStore.assets.reduce((sum, a) => {
    const minVal = Number(a.salvageValue) || 0
    if (Number(a.currentValue) > minVal) {
      return sum + (Number(a.monthlyDepreciation) || 0)
    }
    return sum
  }, 0)
})

function calculateRemainingPercent(ast) {
  if (!ast.cost || ast.cost === 0) return 0
  const pct = Math.round((ast.currentValue / ast.cost) * 100)
  return Math.min(100, Math.max(0, pct))
}

// Filtered Assets
const filteredAssets = computed(() => {
  return stockStore.assets.filter(a => {
    // Filter Branch
    if (branchFilter.value !== 'all' && a.branch !== branchFilter.value) {
      return false
    }
    // Filter Category
    if (categoryFilter.value !== 'all' && a.category !== categoryFilter.value) {
      return false
    }
    // Search Query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const matchName = a.name.toLowerCase().includes(q)
      const matchId = a.id.toLowerCase().includes(q)
      const matchBranch = (a.branch || '').toLowerCase().includes(q)
      const matchNotes = (a.notes || '').toLowerCase().includes(q)
      if (!matchName && !matchId && !matchBranch && !matchNotes) {
        return false
      }
    }
    return true
  })
})

// Modal State & Form
const showModal = ref(false)
const isEditing = ref(false)
const currentAssetId = ref(null)

const form = ref({
  name: '',
  category: 'Mesin & Peralatan',
  branch: '',
  purchaseDate: new Date().toISOString().slice(0, 10),
  cost: null,
  usefulLifeYears: 4,
  salvageValue: 0,
  notes: ''
})

const estimatedMonthlyDepreciation = computed(() => {
  const c = Math.max(0, Number(form.value.cost) || 0)
  const s = Math.max(0, Number(form.value.salvageValue) || 0)
  const y = Math.max(1, Number(form.value.usefulLifeYears) || 1)
  return Math.round((c - s) / (y * 12))
})

function openAddModal() {
  isEditing.value = false
  currentAssetId.value = null
  const defaultBranch = authStore.branches.length > 0 ? authStore.branches[0].name : 'Cabang Jakarta Selatan'
  form.value = {
    name: '',
    category: 'Mesin & Peralatan',
    branch: defaultBranch,
    purchaseDate: new Date().toISOString().slice(0, 10),
    cost: null,
    usefulLifeYears: 4,
    salvageValue: 0,
    notes: ''
  }
  showModal.value = true
}

function openEditModal(ast) {
  isEditing.value = true
  currentAssetId.value = ast.id
  form.value = {
    name: ast.name,
    category: ast.category || 'Mesin & Peralatan',
    branch: ast.branch,
    purchaseDate: ast.purchaseDate,
    cost: ast.cost,
    usefulLifeYears: ast.usefulLifeYears,
    salvageValue: ast.salvageValue || 0,
    notes: ast.notes || ''
  }
  showModal.value = true
}

function saveAsset() {
  if (!form.value.name.trim()) {
    triggerAlert('Nama aset tidak boleh kosong', 'error')
    return
  }
  if (!form.value.cost || form.value.cost <= 0) {
    triggerAlert('Harga perolehan harus lebih dari 0', 'error')
    return
  }

  if (isEditing.value && currentAssetId.value) {
    const success = stockStore.updateAsset(currentAssetId.value, { ...form.value })
    if (success) {
      triggerAlert(`Aset "${form.value.name}" berhasil diperbarui.`)
      showModal.value = false
    } else {
      triggerAlert('Gagal memperbarui data aset', 'error')
    }
  } else {
    const newAsset = stockStore.addAsset({ ...form.value })
    triggerAlert(`Aset baru "${newAsset.name}" berhasil didaftarkan.`)
    expandedAssetIds.value.add(newAsset.id)
    showModal.value = false
  }
}

// Depresiasi Aset Tunggal
function handleSingleDepreciate(ast) {
  const res = stockStore.depreciateAsset(ast.id)
  if (res.success) {
    triggerAlert(res.message, 'success')
  } else {
    triggerAlert(res.message, 'error')
  }
}

// Modal Eksekusi Depresiasi Massal
const showDepreciationModal = ref(false)

function openDepreciationModal() {
  showDepreciationModal.value = true
}

function confirmBatchDepreciation() {
  const result = stockStore.runBatchDepreciation()
  showDepreciationModal.value = false
  triggerAlert(`Penyusutan berhasil dieksekusi untuk ${result.count} aset (Total nilai susut: Rp ${formatNumber(result.totalDepreciated)}).`)
}

// Modal Hapus Aset
const showDeleteModal = ref(false)
const assetToDelete = ref(null)

function openDeleteConfirm(ast) {
  assetToDelete.value = ast
  showDeleteModal.value = true
}

function confirmDeleteAsset() {
  if (!assetToDelete.value) return
  const name = assetToDelete.value.name
  const success = stockStore.deleteAsset(assetToDelete.value.id)
  showDeleteModal.value = false
  if (success) {
    triggerAlert(`Aset "${name}" telah dihapus dari daftar.`)
  } else {
    triggerAlert('Gagal menghapus aset', 'error')
  }
}

// Watchers untuk Auto Open dari Sidebar Sub-Menu
watch(() => props.autoOpenAdd, (val) => {
  if (val) {
    openAddModal()
    emit('resetAutoOpenAdd')
  }
})

watch(() => props.autoOpenDepreciation, (val) => {
  if (val) {
    openDepreciationModal()
    emit('resetAutoOpenDepreciation')
  }
})

function formatNumber(num) {
  return (num || 0).toLocaleString('id-ID')
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
