<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
    
    <!-- 1. HEADER UTAMA & RBAC INDICATOR -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
      <div class="space-y-1">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Icon name="building" custom-class="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 class="text-base sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
              <span>Manajemen Cabang & Multi-Outlet</span>
              <span :class="['text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider', authStore.currentRoleConfig.color]">
                Peran: {{ authStore.currentRoleConfig.title }}
              </span>
            </h1>
            <p class="text-xs text-slate-500">
              Pusat kendali penambahan cabang, status operasional buka/tutup toko, alokasi inventaris, dan pengawasan tim cabang terisolasi.
            </p>
          </div>
        </div>
      </div>

      <!-- Tombol Aksi Buka Cabang Baru (Khusus Owner) -->
      <div class="flex items-center gap-2.5">
        <button 
          v-if="authStore.isOwner"
          @click="openAddBranchModal"
          type="button"
          class="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Icon name="plus" custom-class="w-4 h-4 text-white" />
          <span>+ Buka Cabang Baru</span>
        </button>

        <div v-else class="text-right">
          <span class="text-[11px] font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            Akses Terbatas: Hanya Pengaturan Status Cabang
          </span>
        </div>
      </div>
    </div>

    <!-- 2. ALERT NOTIFIKASI -->
    <transition name="fade">
      <div v-if="alertMessage" :class="['p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm shadow-xs border', alertType === 'error' ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900']">
        <div class="flex items-center gap-2.5 font-bold">
          <Icon :name="alertType === 'error' ? 'alert' : 'check'" :custom-class="['w-5 h-5 shrink-0', alertType === 'error' ? 'text-rose-700' : 'text-emerald-700']" />
          <span>{{ alertMessage }}</span>
        </div>
        <button @click="alertMessage = ''" class="font-bold cursor-pointer text-xs underline">
          Tutup
        </button>
      </div>
    </transition>

    <!-- 3. QUICK STATS KPI METRICS -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <!-- Total Cabang & Hub -->
      <div class="p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
          <span>Total Outlet & Hub</span>
          <Icon name="building" custom-class="w-4 h-4 text-slate-400" />
        </div>
        <div class="text-xl sm:text-2xl font-black text-slate-900 font-mono">
          {{ authStore.branches.length }}
        </div>
        <div class="text-[11px] text-slate-400 font-medium">
          {{ storeBranchesCount }} Toko Ritel • {{ warehouseCount }} Gudang Hub
        </div>
      </div>

      <!-- Cabang Buka (Aktif) -->
      <div class="p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
          <span>Operasional Buka</span>
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <div class="text-xl sm:text-2xl font-black text-emerald-700 font-mono">
          {{ openBranchesCount }}
        </div>
        <div class="text-[11px] text-emerald-600 font-medium">
          Siap melayani transaksi kasir POS
        </div>
      </div>

      <!-- Cabang Tutup Sementara -->
      <div class="p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
          <span>Tutup / Libur</span>
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
        </div>
        <div class="text-xl sm:text-2xl font-black text-rose-700 font-mono">
          {{ closedBranchesCount }}
        </div>
        <div class="text-[11px] text-rose-600 font-medium">
          Toko libur atau tutup sementara
        </div>
      </div>

      <!-- Total Staf & Kasir Terdaftar -->
      <div class="p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
          <span>Total Personil Tim</span>
          <Icon name="users" custom-class="w-4 h-4 text-slate-400" />
        </div>
        <div class="text-xl sm:text-2xl font-black text-slate-900 font-mono">
          {{ settingsStore.staffList.length }}
        </div>
        <div class="text-[11px] text-slate-400 font-medium">
          Tim mandiri per cabang kerja
        </div>
      </div>
    </div>

    <!-- 4. FILTER & PENCARIAN CABANG -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs">
      <div class="relative w-full sm:w-80">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari cabang, kota, kode, atau manajer..."
          class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none font-medium"
        />
        <Icon name="search" custom-class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
      </div>

      <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
        <!-- Filter Status Operasional -->
        <select 
          v-model="statusFilter"
          class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none"
        >
          <option value="all">Semua Status</option>
          <option value="open">🟢 Buka Saja</option>
          <option value="closed">🔴 Tutup Saja</option>
        </select>

        <!-- Filter Tipe -->
        <select 
          v-model="typeFilter"
          class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none"
        >
          <option value="all">Semua Tipe</option>
          <option value="branch">Toko Cabang</option>
          <option value="warehouse">Gudang Hub</option>
        </select>
      </div>
    </div>

    <!-- 5. GRID DAFTAR CABANG & OUTLET USAHA -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div 
        v-for="branch in filteredBranches" 
        :key="branch.id"
        class="bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
      >
        <!-- Card Top Bar: Status Badge & Code -->
        <div class="p-5 space-y-4">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[10px] font-mono font-extrabold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-md">
              {{ branch.code }}
            </span>

            <div class="flex items-center gap-1.5">
              <span 
                :class="[
                  'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono uppercase tracking-wider border flex items-center gap-1',
                  branch.status === 'open' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                ]"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="branch.status === 'open' ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                <span>{{ branch.status === 'open' ? 'BUKA' : 'TUTUP' }}</span>
              </span>

              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {{ branch.type === 'warehouse' ? 'Gudang Hub' : 'Toko Cabang' }}
              </span>
            </div>
          </div>

          <!-- Branch Name & Location -->
          <div>
            <h3 class="text-base font-black text-slate-900 flex items-center gap-1.5">
              <span>{{ branch.name }}</span>
            </h3>
            <p class="text-xs text-slate-500 mt-1 flex items-start gap-1">
              <span class="shrink-0 text-slate-400">📍</span>
              <span class="line-clamp-2">{{ branch.address }} ({{ branch.city }})</span>
            </p>
          </div>

          <!-- Operating Hours & Contact Phone -->
          <div class="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl text-[11px] border border-slate-100">
            <div>
              <div class="text-slate-400 font-bold uppercase text-[9px]">Jam Buka</div>
              <div class="font-bold text-slate-800">{{ branch.operatingHours }}</div>
            </div>
            <div>
              <div class="text-slate-400 font-bold uppercase text-[9px]">Telepon / WA</div>
              <div class="font-mono font-bold text-slate-800">{{ branch.phone }}</div>
            </div>
          </div>

          <!-- Tim Manajemen Cabang (Isolated Team) -->
          <div class="space-y-2 pt-2 border-t border-slate-100">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-slate-700 flex items-center gap-1">
                <Icon name="users" custom-class="w-3.5 h-3.5 text-slate-500" />
                <span>Tim Cabang:</span>
              </span>
              <span class="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded">
                {{ getStaffCount(branch.name) }} Personel
              </span>
            </div>

            <!-- Manajer Cabang -->
            <div class="p-2 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  {{ (branch.managerName || 'M').charAt(0) }}
                </div>
                <div>
                  <div class="text-[10px] text-slate-400 font-bold uppercase leading-none">Manajer Cabang</div>
                  <div class="font-bold text-slate-900 leading-tight">{{ branch.managerName || 'Belum Ditunjuk' }}</div>
                </div>
              </div>
            </div>

            <!-- Chips Staf / Kasir Cabang -->
            <div class="flex flex-wrap gap-1.5 pt-1">
              <span 
                v-for="st in getBranchStaff(branch.name).slice(0, 4)" 
                :key="st.id"
                class="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-[10px] font-medium"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="st.role === 'manager' ? 'bg-emerald-500' : 'bg-blue-500'"></span>
                <span>{{ st.name }} ({{ st.role }})</span>
              </span>
              <span 
                v-if="getBranchStaff(branch.name).length > 4"
                class="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-bold"
              >
                +{{ getBranchStaff(branch.name).length - 4 }} staf lainnya
              </span>
            </div>

            <!-- Tombol Kelola Tim Cabang Ini -->
            <button 
              @click="manageBranchTeam(branch.name)"
              type="button"
              class="w-full mt-1 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Icon name="users" custom-class="w-3.5 h-3.5 text-slate-600" />
              <span>Kelola Tim Cabang Ini</span>
            </button>
          </div>

          <!-- Total Stok Fisik di Cabang -->
          <div class="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <span class="text-slate-600 font-medium">Stok Barang Cabang:</span>
            <div class="flex items-center gap-2">
              <span class="font-mono font-black text-slate-900">
                {{ formatNumber(stockStore.getBranchTotalStockUnits(branch.id)) }} unit
              </span>
              <button 
                @click="$emit('navigate', 'inventory')" 
                class="text-[10px] text-emerald-700 font-bold underline cursor-pointer"
              >
                Cek Stok ↗
              </button>
            </div>
          </div>
        </div>

        <!-- Card Footer Actions: Buka/Tutup Toggle, Edit, Hapus -->
        <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
          <!-- Toggle Buka / Tutup Operasional Toko -->
          <button 
            @click="handleToggleStatus(branch)"
            type="button"
            :disabled="!canManageThisBranch(branch)"
            :class="[
              'flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5',
              branch.status === 'open' 
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200' 
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200',
              !canManageThisBranch(branch) ? 'opacity-50 cursor-not-allowed' : ''
            ]"
            :title="branch.status === 'open' ? 'Tutup Operasional Toko Hari Ini' : 'Buka Operasional Toko'"
          >
            <span class="w-2 h-2 rounded-full" :class="branch.status === 'open' ? 'bg-rose-600' : 'bg-emerald-600'"></span>
            <span>{{ branch.status === 'open' ? 'Tutup Toko' : 'Buka Toko' }}</span>
          </button>

          <!-- Edit Cabang (Owner & Manajer) -->
          <button 
            v-if="canManageThisBranch(branch)"
            @click="openEditBranchModal(branch)"
            type="button"
            class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Edit Data Cabang"
          >
            <Icon name="edit" custom-class="w-4 h-4" />
          </button>

          <!-- Hapus Cabang (Khusus Owner) -->
          <button 
            v-if="authStore.isOwner && branch.id !== 'wh-1'"
            @click="openDeleteConfirmModal(branch)"
            type="button"
            class="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
            title="Tutup Permanen / Hapus Cabang Ini"
          >
            <Icon name="trash" custom-class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State jika pencarian tidak ditemukan -->
    <div v-if="filteredBranches.length === 0" class="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-3">
      <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        <Icon name="building" custom-class="w-6 h-6" />
      </div>
      <div class="text-sm font-bold text-slate-700">Tidak ada cabang yang sesuai filter pencarian</div>
      <p class="text-xs text-slate-400">Silakan ubah kata kunci atau bersihkan filter status.</p>
    </div>

    <!-- MODAL 1: BUKA CABANG BARU (KHUSUS OWNER) -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Icon name="building" custom-class="w-4 h-4" />
            </div>
            <div>
              <h2 class="text-base font-black text-slate-900">Buka Cabang Baru</h2>
              <p class="text-[11px] text-slate-500">Pendaftaran outlet ritel atau hub distribusi baru.</p>
            </div>
          </div>
          <button @click="showAddModal = false" class="text-slate-400 hover:text-slate-600 cursor-pointer">
            <Icon name="close" custom-class="w-4 h-4" />
          </button>
        </div>

        <form @submit.prevent="submitAddBranch" class="space-y-3 text-xs">
          <div>
            <label class="block font-bold uppercase text-slate-600 mb-1">Nama Cabang / Outlet</label>
            <input 
              v-model="newBranchForm.name" 
              type="text" 
              required
              placeholder="Contoh: Cabang Medan Merdeka"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold uppercase text-slate-600 mb-1">Kode Cabang</label>
              <input 
                v-model="newBranchForm.code" 
                type="text" 
                required
                placeholder="MDN-01"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 font-bold focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label class="block font-bold uppercase text-slate-600 mb-1">Tipe Unit</label>
              <select 
                v-model="newBranchForm.type"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
              >
                <option value="branch">Toko Cabang (Ritel POS)</option>
                <option value="warehouse">Gudang Distribusi (Hub)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold uppercase text-slate-600 mb-1">Kota</label>
              <input 
                v-model="newBranchForm.city" 
                type="text" 
                required
                placeholder="Contoh: Medan"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label class="block font-bold uppercase text-slate-600 mb-1">Nomor Telepon / WA</label>
              <input 
                v-model="newBranchForm.phone" 
                type="tel" 
                placeholder="08xxxxxxxxxx"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold uppercase text-slate-600 mb-1">Alamat Lengkap</label>
            <textarea 
              v-model="newBranchForm.address" 
              rows="2"
              required
              placeholder="Jl. Merdeka No. 88, Medan Petisah"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block font-bold uppercase text-slate-600 mb-1">Jam Operasional</label>
            <input 
              v-model="newBranchForm.operatingHours" 
              type="text" 
              placeholder="08:00 - 22:00 WIB"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <!-- Bagian Tim Manajemen Awal Cabang -->
          <div class="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2.5">
            <div class="font-bold text-emerald-950 flex items-center gap-1.5">
              <Icon name="users" custom-class="w-4 h-4 text-emerald-700" />
              <span>Inisialisasi Tim Manajemen Cabang Baru</span>
            </div>
            
            <div class="grid grid-cols-2 gap-2.5">
              <div>
                <label class="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">Nama Manajer Cabang</label>
                <input 
                  v-model="newBranchForm.managerName" 
                  type="text" 
                  placeholder="Contoh: Surya Pratama"
                  class="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-slate-900 font-bold focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">Nama Kasir Utama</label>
                <input 
                  v-model="newBranchForm.cashierName" 
                  type="text" 
                  placeholder="Contoh: Rina Anggraini"
                  class="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-slate-900 font-bold focus:outline-none"
                />
              </div>
            </div>
            <p class="text-[10px] text-emerald-800">
              Sistem akan otomatis mendaftarkan akun Manajer dan Kasir khusus yang terisolasi untuk cabang baru ini.
            </p>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button 
              @click="showAddModal = false" 
              type="button" 
              class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Buka Cabang Sekarang
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL 2: EDIT CABANG -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="font-black text-base text-slate-900">Edit Data Cabang: {{ editingBranch?.name }}</div>
          <button @click="showEditModal = false" class="text-slate-400 hover:text-slate-600 cursor-pointer">
            <Icon name="close" custom-class="w-4 h-4" />
          </button>
        </div>

        <form @submit.prevent="submitUpdateBranch" class="space-y-3 text-xs">
          <div>
            <label class="block font-bold uppercase text-slate-600 mb-1">Nama Cabang</label>
            <input 
              v-model="editForm.name" 
              type="text" 
              required
              class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold uppercase text-slate-600 mb-1">Kota</label>
              <input 
                v-model="editForm.city" 
                type="text" 
                required
                class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label class="block font-bold uppercase text-slate-600 mb-1">Nomor Telepon / WA</label>
              <input 
                v-model="editForm.phone" 
                type="tel" 
                class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold uppercase text-slate-600 mb-1">Alamat Lengkap</label>
            <textarea 
              v-model="editForm.address" 
              rows="2"
              required
              class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold uppercase text-slate-600 mb-1">Jam Operasional</label>
              <input 
                v-model="editForm.operatingHours" 
                type="text" 
                class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label class="block font-bold uppercase text-slate-600 mb-1">Manajer Cabang</label>
              <input 
                v-model="editForm.managerName" 
                type="text" 
                class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button 
              @click="showEditModal = false" 
              type="button" 
              class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL 3: KONFIRMASI HAPUS CABANG (VALIDASI SISA STOK) -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="relative w-full max-w-md bg-white border border-rose-200 rounded-2xl shadow-2xl p-6 space-y-4">
        <div class="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Icon name="alert" custom-class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-base font-black text-slate-900">Hapus Cabang Permanen</h2>
            <p class="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
        </div>

        <div class="space-y-3 text-xs">
          <p class="text-slate-700">
            Anda akan menghapus cabang <strong>{{ deletingBranch?.name }}</strong>.
          </p>

          <!-- Peringatan jika masih ada sisa stok barang fisik -->
          <div v-if="stockStore.hasRemainingStock(deletingBranch?.id)" class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 space-y-1">
            <div class="font-bold flex items-center gap-1.5">
              <span>⚠️ Peringatan Sisa Stok Fisik!</span>
            </div>
            <p class="text-[11px] leading-relaxed">
              Cabang ini masih tercatat memiliki <strong>{{ stockStore.getBranchTotalStockUnits(deletingBranch?.id) }} unit stok barang</strong>. Pastikan fisik barang telah diretur atau dialihkan ke Gudang Pusat sebelum dihapus.
            </p>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">
              Ketik nama cabang <span class="font-mono text-rose-700 underline">{{ deletingBranch?.name }}</span> untuk konfirmasi:
            </label>
            <input 
              v-model="deleteConfirmInput" 
              type="text" 
              placeholder="Ketik persis nama cabang..."
              class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-rose-600 focus:outline-none"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button 
            @click="showDeleteModal = false" 
            type="button" 
            class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button 
            @click="executeDeleteBranch" 
            :disabled="deleteConfirmInput !== deletingBranch?.name"
            type="button" 
            class="px-5 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Hapus Cabang Sekarang
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useStockStore } from '../../stores/stockStore'
import { useSettingsStore } from '../../stores/settingsStore'
import Icon from '../common/Icon.vue'

const props = defineProps({
  autoOpenAdd: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['navigate', 'reset-auto-open'])

const authStore = useAuthStore()
const stockStore = useStockStore()
const settingsStore = useSettingsStore()

const searchQuery = ref('')
const statusFilter = ref('all')
const typeFilter = ref('all')

const alertMessage = ref('')
const alertType = ref('success')

// Helper counts
const storeBranchesCount = computed(() => {
  return authStore.branches.filter(b => b.type === 'branch').length
})

const warehouseCount = computed(() => {
  return authStore.branches.filter(b => b.type === 'warehouse').length
})

const openBranchesCount = computed(() => {
  return authStore.branches.filter(b => b.status === 'open').length
})

const closedBranchesCount = computed(() => {
  return authStore.branches.filter(b => b.status === 'closed').length
})

// Filtered Branches List
const filteredBranches = computed(() => {
  return authStore.branches.filter(b => {
    const q = searchQuery.value.toLowerCase().trim()
    const matchesQuery = !q || 
      b.name.toLowerCase().includes(q) || 
      (b.code && b.code.toLowerCase().includes(q)) ||
      (b.city && b.city.toLowerCase().includes(q)) ||
      (b.managerName && b.managerName.toLowerCase().includes(q))

    const matchesStatus = statusFilter.value === 'all' || b.status === statusFilter.value
    const matchesType = typeFilter.value === 'all' || b.type === typeFilter.value

    return matchesQuery && matchesStatus && matchesType
  })
})

function formatNumber(num) {
  return (num || 0).toLocaleString('id-ID')
}

function getBranchStaff(branchName) {
  return settingsStore.getStaffByBranch(branchName)
}

function getStaffCount(branchName) {
  return settingsStore.getStaffByBranch(branchName).length
}

// Hak Akses RBAC: apakah user berhak mengelola cabang ini
function canManageThisBranch(branch) {
  if (authStore.isOwner) return true
  if (authStore.isManager) {
    // Manajer hanya bisa mengelola cabang penugasannya sendiri
    return authStore.businessUser.currentBranch === branch.name
  }
  return false
}

// Aksi Toggle Status Buka / Tutup Toko
function handleToggleStatus(branch) {
  if (!canManageThisBranch(branch)) {
    showAlert('Anda tidak memiliki wewenang untuk mengubah status cabang ini!', 'error')
    return
  }
  const newStatus = authStore.toggleBranchStatus(branch.id)
  if (newStatus === 'open') {
    showAlert(`Status operasional ${branch.name} berhasil diubah menjadi BUKA! Toko siap melayani kasir POS.`, 'success')
  } else {
    showAlert(`Status operasional ${branch.name} berhasil diubah menjadi TUTUP SEMENTARA.`, 'success')
  }
}

// Navigasi ke Halaman Profil Staf dengan filter cabang terpilih
function manageBranchTeam(branchName) {
  emit('navigate', 'profile')
}

// Modal State Buka Cabang Baru
const showAddModal = ref(false)
const newBranchForm = ref({
  name: '',
  code: '',
  type: 'branch',
  city: '',
  address: '',
  phone: '',
  operatingHours: '08:00 - 22:00 WIB',
  managerName: '',
  cashierName: ''
})

function openAddBranchModal() {
  newBranchForm.value = {
    name: '',
    code: `CBG-0${authStore.branches.length + 1}`,
    type: 'branch',
    city: '',
    address: '',
    phone: '',
    operatingHours: '08:00 - 22:00 WIB',
    managerName: '',
    cashierName: ''
  }
  showAddModal.value = true
}

onMounted(() => {
  if (props.autoOpenAdd && authStore.isOwner) {
    openAddBranchModal()
    emit('reset-auto-open')
  }
})

watch(() => props.autoOpenAdd, (newVal) => {
  if (newVal && authStore.isOwner) {
    openAddBranchModal()
    emit('reset-auto-open')
  }
})

function submitAddBranch() {
  if (!newBranchForm.value.name.trim()) return

  // 1. Tambah cabang di authStore
  const createdBranch = authStore.addBranch({
    name: newBranchForm.value.name,
    code: newBranchForm.value.code,
    type: newBranchForm.value.type,
    city: newBranchForm.value.city,
    address: newBranchForm.value.address,
    phone: newBranchForm.value.phone,
    managerName: newBranchForm.value.managerName,
    operatingHours: newBranchForm.value.operatingHours
  })

  // 2. Inisialisasi slot stok cabang di stockStore
  stockStore.initBranchStock(createdBranch.id)

  // 3. Daftarkan Tim Manajemen Mandiri (Manajer & Kasir) jika diisi
  if (newBranchForm.value.managerName.trim()) {
    settingsStore.addStaff({
      name: newBranchForm.value.managerName.trim(),
      email: `${newBranchForm.value.managerName.toLowerCase().replace(/\s+/g, '.')}@cakue.id`,
      phone: newBranchForm.value.phone || '081233445566',
      role: 'manager',
      branch: createdBranch.name,
      pin: '123456'
    })
  }

  if (newBranchForm.value.cashierName.trim()) {
    settingsStore.addStaff({
      name: newBranchForm.value.cashierName.trim(),
      email: `${newBranchForm.value.cashierName.toLowerCase().replace(/\s+/g, '.')}@cakue.id`,
      phone: '081299887766',
      role: 'cashier',
      branch: createdBranch.name,
      pin: '112233'
    })
  }

  showAddModal.value = false
  showAlert(`Cabang baru "${createdBranch.name}" berhasil dibuka dan didaftarkan dengan tim mandiri!`, 'success')
}

// Modal State Edit Cabang
const showEditModal = ref(false)
const editingBranch = ref(null)
const editForm = ref({
  name: '',
  city: '',
  address: '',
  phone: '',
  operatingHours: '',
  managerName: ''
})

function openEditBranchModal(branch) {
  editingBranch.value = branch
  editForm.value = {
    name: branch.name,
    city: branch.city || '',
    address: branch.address || '',
    phone: branch.phone || '',
    operatingHours: branch.operatingHours || '08:00 - 22:00 WIB',
    managerName: branch.managerName || ''
  }
  showEditModal.value = true
}

function submitUpdateBranch() {
  if (!editingBranch.value) return
  authStore.updateBranch(editingBranch.value.id, {
    name: editForm.value.name,
    city: editForm.value.city,
    address: editForm.value.address,
    phone: editForm.value.phone,
    operatingHours: editForm.value.operatingHours,
    managerName: editForm.value.managerName
  })

  showEditModal.value = false
  showAlert(`Informasi cabang "${editForm.value.name}" berhasil diperbarui!`, 'success')
}

// Modal State Hapus Cabang
const showDeleteModal = ref(false)
const deletingBranch = ref(null)
const deleteConfirmInput = ref('')

function openDeleteConfirmModal(branch) {
  deletingBranch.value = branch
  deleteConfirmInput.value = ''
  showDeleteModal.value = true
}

function executeDeleteBranch() {
  if (!deletingBranch.value) return
  if (deleteConfirmInput.value !== deletingBranch.value.name) return

  const bId = deletingBranch.value.id
  const bName = deletingBranch.value.name

  // Hapus dari authStore
  const res = authStore.deleteBranch(bId)
  if (res.success) {
    // Hapus alokasi stok di stockStore
    stockStore.removeBranchStock(bId)

    showDeleteModal.value = false
    showAlert(`Cabang "${bName}" telah berhasil dihapus secara permanen.`, 'success')
  } else {
    showAlert(res.message || 'Gagal menghapus cabang.', 'error')
  }
}

function showAlert(msg, type = 'success') {
  alertMessage.value = msg
  alertType.value = type
  setTimeout(() => {
    if (alertMessage.value === msg) {
      alertMessage.value = ''
    }
  }, 4000)
}
</script>
