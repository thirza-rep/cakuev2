<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
    
    <!-- 1. HEADER UTAMA: SLIM, MODERN & BERSIH -->
    <div class="flex items-center justify-between gap-3 p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-900 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Icon name="shield" custom-class="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
        </div>
        <div class="min-w-0">
          <h1 class="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span>Manajemen Owner & Tenant Platform</span>
            <span class="text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full border uppercase tracking-wider bg-indigo-100 text-indigo-900 border-indigo-300">
              Root Super Admin
            </span>
          </h1>
          <p class="text-[11px] sm:text-xs text-slate-500 font-medium truncate mt-0.5">
            Otoritas tertinggi pengawasan & manajemen akun pemilik usaha (tenant) multi-cabang
          </p>
        </div>
      </div>

      <!-- Tombol Aksi Tambah Owner Baru -->
      <div class="flex items-center gap-2 shrink-0">
        <button 
          v-if="authStore.canManageOwners"
          @click="openAddModal"
          type="button"
          class="flex items-center gap-1.5 px-3 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer active:scale-98"
        >
          <Icon name="plus" custom-class="w-3.5 h-3.5 text-white" />
          <span>Daftarkan Owner</span>
        </button>
      </div>
    </div>

    <!-- 2. BANNER SUPERVISI AKTIF (JIKA SEDANG MENGAUDIT SESI OWNER) -->
    <div 
      v-if="authStore.isSupervising"
      class="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white border border-indigo-700 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
          👑
        </div>
        <div>
          <div class="font-black text-sm text-amber-300 flex items-center gap-2">
            <span>Sedang Mensupervisi Sesi: {{ authStore.supervisingOwner?.name }}</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
              {{ authStore.supervisingOwner?.companyName }}
            </span>
          </div>
          <p class="text-xs text-slate-200 mt-0.5">
            Data transaksi kas, jurnal pembukuan, dan mutasi stok yang tampil di portal adalah milik owner ini untuk tujuan audit.
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0 self-end sm:self-auto">
        <button 
          @click="$emit('navigate', 'journal')"
          type="button"
          class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-lg transition-all border border-white/20 cursor-pointer"
        >
          Lihat Jurnal Kas Sesi
        </button>
        <button 
          @click="exitAuditMode"
          type="button"
          class="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg transition-all shadow-xs cursor-pointer active:scale-98"
        >
          Keluar Supervisi
        </button>
      </div>
    </div>

    <!-- 3. ALERT NOTIFIKASI -->
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

    <!-- 4. QUICK STATS KPI METRICS -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
      <!-- Total Owner -->
      <div class="p-3 bg-white border border-slate-200/90 rounded-xl shadow-2xs flex items-center justify-between">
        <div>
          <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Owner Terdaftar</div>
          <div class="text-base sm:text-lg font-black text-slate-900 font-mono mt-0.5">{{ authStore.ownersList.length }}</div>
        </div>
        <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
          <Icon name="users" custom-class="w-4 h-4" />
        </div>
      </div>

      <!-- Owner Aktif -->
      <div class="p-3 bg-white border border-slate-200/90 rounded-xl shadow-2xs flex items-center justify-between">
        <div>
          <div class="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Owner Aktif</div>
          <div class="text-base sm:text-lg font-black text-emerald-700 font-mono mt-0.5">{{ activeOwnersCount }}</div>
        </div>
        <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </div>

      <!-- Owner Ditangguhkan -->
      <div class="p-3 bg-white border border-slate-200/90 rounded-xl shadow-2xs flex items-center justify-between">
        <div>
          <div class="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Ditangguhkan</div>
          <div class="text-base sm:text-lg font-black text-amber-700 font-mono mt-0.5">{{ suspendedOwnersCount }}</div>
        </div>
        <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
        </div>
      </div>

      <!-- Tingkat Otoritas -->
      <div class="p-3 bg-white border border-slate-200/90 rounded-xl shadow-2xs flex items-center justify-between">
        <div>
          <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status Otoritas</div>
          <div class="text-xs sm:text-sm font-black text-indigo-900 mt-0.5 truncate">Root Super Admin</div>
        </div>
        <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-900 flex items-center justify-center shrink-0">
          <Icon name="shield" custom-class="w-4 h-4 text-indigo-800" />
        </div>
      </div>
    </div>

    <!-- 5. FILTER & PENCARIAN OWNER -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-2.5 p-3 sm:p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
      <div class="relative w-full sm:w-80">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari nama owner, email, perusahaan..."
          class="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-emerald-600 transition-all font-medium text-slate-800"
        />
        <Icon name="search" custom-class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
        <select 
          v-model="statusFilter"
          class="text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 text-slate-700 cursor-pointer focus:outline-emerald-600"
        >
          <option value="all">Semua Status ({{ authStore.ownersList.length }})</option>
          <option value="active">Aktif ({{ activeOwnersCount }})</option>
          <option value="suspended">Ditangguhkan ({{ suspendedOwnersCount }})</option>
        </select>
      </div>
    </div>

    <!-- 6. DAFTAR TABEL OWNER / TENANT -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between">
        <div class="font-black text-xs sm:text-sm text-slate-900 flex items-center gap-2">
          <span>Daftar Akun Mitra & Tenant Terdaftar</span>
          <span class="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {{ filteredOwners.length }} Akun
          </span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
              <th class="py-3 px-4">Owner & Identitas</th>
              <th class="py-3 px-4">Badan Usaha / Kontak</th>
              <th class="py-3 px-4">Cabang Penugasan</th>
              <th class="py-3 px-4">Status Akun</th>
              <th class="py-3 px-4 text-right">Aksi Super Admin</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
            <tr 
              v-for="owner in filteredOwners" 
              :key="owner.id"
              :class="[
                'hover:bg-slate-50/80 transition-colors',
                authStore.isSupervising && authStore.supervisingOwner?.id === owner.id ? 'bg-indigo-50/60 font-semibold' : ''
              ]"
            >
              <!-- Info Owner -->
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {{ owner.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-black text-slate-900 flex items-center gap-1.5">
                      <span>{{ owner.name }}</span>
                      <span v-if="owner.email.includes('budi')" class="text-[9px] font-mono px-1.5 py-0.2 rounded-sm bg-purple-100 text-purple-800 font-bold">
                        Demo
                      </span>
                    </div>
                    <div class="text-[11px] text-slate-500 font-mono">{{ owner.email }}</div>
                  </div>
                </div>
              </td>

              <!-- Badan Usaha & Telepon -->
              <td class="py-3.5 px-4">
                <div class="font-bold text-slate-900">{{ owner.companyName }}</div>
                <div class="text-[11px] text-slate-500 font-mono">{{ owner.phone }}</div>
              </td>

              <!-- Cabang Penugasan -->
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-1.5 font-bold text-slate-800">
                  <Icon name="building" custom-class="w-3.5 h-3.5 text-slate-400" />
                  <span>{{ owner.branchAssigned }}</span>
                </div>
                <div class="text-[10px] text-slate-400 mt-0.5">
                  Bergabung: {{ owner.joinedDate || '2026-10-21' }}
                </div>
              </td>

              <!-- Status -->
              <td class="py-3.5 px-4">
                <span 
                  :class="[
                    'inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border',
                    owner.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  ]"
                >
                  <span :class="['w-1.5 h-1.5 rounded-full', owner.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500']"></span>
                  <span>{{ owner.status === 'active' ? 'Aktif' : 'Ditangguhkan' }}</span>
                </span>
              </td>

              <!-- Aksi -->
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <!-- Tombol Supervisi / Audit Sesi Ini -->
                  <button 
                    @click="handleSupervisionToggle(owner)"
                    type="button"
                    :class="[
                      'px-2.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1 active:scale-98',
                      authStore.isSupervising && authStore.supervisingOwner?.id === owner.id
                        ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 font-black'
                        : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200'
                    ]"
                    :title="authStore.isSupervising && authStore.supervisingOwner?.id === owner.id ? 'Keluar dari audit' : 'Audit sesi owner ini'"
                  >
                    <span>{{ authStore.isSupervising && authStore.supervisingOwner?.id === owner.id ? '✓ Sedang Diaudit' : '👑 Supervisi / Audit' }}</span>
                  </button>

                  <!-- Tombol Ubah Status -->
                  <button 
                    @click="handleToggleStatus(owner)"
                    type="button"
                    class="px-2 py-1.5 rounded-lg font-bold text-xs text-slate-600 hover:bg-slate-100 transition-all border border-slate-200 cursor-pointer"
                    title="Ubah Status Aktif / Tangguhkan"
                  >
                    {{ owner.status === 'active' ? 'Tangguhkan' : 'Aktifkan' }}
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredOwners.length === 0">
              <td colspan="5" class="py-12 text-center text-slate-400">
                <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                  <Icon name="search" custom-class="w-6 h-6" />
                </div>
                <div class="font-bold text-slate-600">Tidak ada akun owner yang cocok</div>
                <div class="text-xs text-slate-400 mt-0.5">Coba gunakan kata kunci pencarian lain</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 7. KARTU ARSITEKTUR KEAMANAN RBAC MULTI-TENANT -->
    <div class="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white shadow-xs space-y-3">
      <div class="flex items-center gap-2">
        <Icon name="shield" custom-class="w-4.5 h-4.5 text-indigo-400" />
        <h3 class="font-black text-sm text-slate-100">Prinsip Keamanan & Isolasi Data Multi-Tenant RBAC</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
        <div class="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1">
          <div class="font-bold text-amber-300 flex items-center gap-1.5">
            <span>1. Otoritas Root Super Admin</span>
          </div>
          <p class="text-[11px] text-slate-400 leading-relaxed">
            Master Admin memiliki kedaulatan penuh membuat, mengaktifkan, atau mengaudit akun owner mitra tanpa risiko tumpang tindih pembukuan.
          </p>
        </div>
        <div class="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1">
          <div class="font-bold text-indigo-300 flex items-center gap-1.5">
            <span>2. Isolasi Mutlak Data Tenant</span>
          </div>
          <p class="text-[11px] text-slate-400 leading-relaxed">
            Data transaksi, rekening kas, dan stok akun mitra (Budi Santoso) tersubordinasi dan tidak dapat diakses atau diubah oleh publik.
          </p>
        </div>
        <div class="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1">
          <div class="font-bold text-emerald-300 flex items-center gap-1.5">
            <span>3. Audit Tanpa Polusi Data</span>
          </div>
          <p class="text-[11px] text-slate-400 leading-relaxed">
            Super Admin dapat melakukan supervisi menyeluruh secara transparan dan kembali ke saldo operasional bersih (Rp 0) seketika.
          </p>
        </div>
      </div>
    </div>

    <!-- 8. MODAL DAFTARKAN OWNER BARU -->
    <transition name="fade">
      <div 
        v-if="isAddModalOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      >
        <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 my-8">
          <!-- Header Modal -->
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-indigo-900 text-white flex items-center justify-center font-bold text-sm">
                <Icon name="shield" custom-class="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 class="font-black text-sm sm:text-base text-slate-900">Daftarkan Akun Owner Baru</h3>
                <p class="text-[11px] text-slate-400">Buat lisensi akun pemilik usaha / franchise tenant</p>
              </div>
            </div>
            <button 
              @click="isAddModalOpen = false"
              type="button"
              class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
            >
              <Icon name="close" custom-class="w-4 h-4" />
            </button>
          </div>

          <!-- Form Body -->
          <form @submit.prevent="submitAddOwner" class="space-y-3.5 text-xs font-bold text-slate-700">
            <!-- Nama Owner -->
            <div>
              <label class="block mb-1 text-[11px] text-slate-500 uppercase tracking-wider font-extrabold">Nama Lengkap Owner *</label>
              <input 
                v-model="newOwnerForm.name" 
                type="text" 
                required 
                placeholder="Contoh: Hendra Kusuma"
                class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-indigo-600 transition-all font-medium text-slate-900"
              />
            </div>

            <!-- Email Akun -->
            <div>
              <label class="block mb-1 text-[11px] text-slate-500 uppercase tracking-wider font-extrabold">Alamat Email Login *</label>
              <input 
                v-model="newOwnerForm.email" 
                type="email" 
                required 
                placeholder="hendra@mitra-cakue.id"
                class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-indigo-600 transition-all font-medium text-slate-900"
              />
            </div>

            <!-- Badan Usaha / Brand -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block mb-1 text-[11px] text-slate-500 uppercase tracking-wider font-extrabold">Nama Perusahaan / Mitra</label>
                <input 
                  v-model="newOwnerForm.companyName" 
                  type="text" 
                  placeholder="CV Mitra Berkah Jaya"
                  class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-indigo-600 transition-all font-medium text-slate-900"
                />
              </div>
              <div>
                <label class="block mb-1 text-[11px] text-slate-500 uppercase tracking-wider font-extrabold">Nomor WhatsApp / HP</label>
                <input 
                  v-model="newOwnerForm.phone" 
                  type="text" 
                  placeholder="0812-3344-5566"
                  class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-indigo-600 transition-all font-medium text-slate-900"
                />
              </div>
            </div>

            <!-- Alokasi Cabang Awal -->
            <div>
              <label class="block mb-1 text-[11px] text-slate-500 uppercase tracking-wider font-extrabold">Cabang Alokasi Awal</label>
              <select 
                v-model="newOwnerForm.branchAssigned"
                class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-indigo-600 transition-all font-bold text-slate-800 cursor-pointer"
              >
                <option v-for="b in authStore.branches" :key="b.id" :value="b.name">
                  {{ b.name }} ({{ b.city }})
                </option>
              </select>
            </div>

            <!-- Catatan Kemitraan -->
            <div>
              <label class="block mb-1 text-[11px] text-slate-500 uppercase tracking-wider font-extrabold">Catatan / Model Lisensi</label>
              <input 
                v-model="newOwnerForm.notes" 
                type="text" 
                placeholder="Lisensi Franchise Mitra Mandiri Jogja"
                class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-indigo-600 transition-all font-medium text-slate-900"
              />
            </div>

            <!-- Footer Action Buttons -->
            <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button 
                @click="isAddModalOpen = false" 
                type="button" 
                class="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button 
                type="submit" 
                class="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-98"
              >
                Simpan & Daftarkan
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import Icon from '../common/Icon.vue'

const emit = defineEmits(['navigate'])
const authStore = useAuthStore()

// State Filter & Pencarian
const searchQuery = ref('')
const statusFilter = ref('all')

// State Notifikasi
const alertMessage = ref('')
const alertType = ref('success')

function triggerAlert(msg, type = 'success') {
  alertMessage.value = msg
  alertType.value = type
  setTimeout(() => {
    if (alertMessage.value === msg) {
      alertMessage.value = ''
    }
  }, 4000)
}

// Komputasi Metrik
const activeOwnersCount = computed(() => {
  return authStore.ownersList.filter(o => o.status === 'active').length
})

const suspendedOwnersCount = computed(() => {
  return authStore.ownersList.filter(o => o.status === 'suspended').length
})

const filteredOwners = computed(() => {
  return authStore.ownersList.filter(owner => {
    // Filter status
    if (statusFilter.value !== 'all' && owner.status !== statusFilter.value) {
      return false
    }
    // Filter pencarian
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const matchName = owner.name?.toLowerCase().includes(q)
      const matchEmail = owner.email?.toLowerCase().includes(q)
      const matchCompany = owner.companyName?.toLowerCase().includes(q)
      const matchBranch = owner.branchAssigned?.toLowerCase().includes(q)
      return matchName || matchEmail || matchCompany || matchBranch
    }
    return true
  })
})

// Modal Daftarkan Owner Baru
const isAddModalOpen = ref(false)
const newOwnerForm = ref({
  name: '',
  email: '',
  companyName: '',
  phone: '',
  branchAssigned: 'Cabang 1 - Malioboro',
  notes: ''
})

function openAddModal() {
  newOwnerForm.value = {
    name: '',
    email: '',
    companyName: '',
    phone: '',
    branchAssigned: authStore.branches[0]?.name || 'Cabang 1 - Malioboro',
    notes: ''
  }
  isAddModalOpen.value = true
}

function submitAddOwner() {
  const res = authStore.addOwner(newOwnerForm.value)
  if (res.success) {
    triggerAlert(`Owner ${res.owner.name} (${res.owner.companyName}) berhasil didaftarkan!`, 'success')
    isAddModalOpen.value = false
  } else {
    triggerAlert(res.message || 'Gagal mendaftarkan owner', 'error')
  }
}

function handleToggleStatus(owner) {
  const newStatus = authStore.toggleOwnerStatus(owner.id)
  if (newStatus) {
    triggerAlert(`Status akun ${owner.name} diubah menjadi ${newStatus === 'active' ? 'Aktif' : 'Ditangguhkan'}!`, 'success')
  }
}

function handleSupervisionToggle(owner) {
  if (authStore.isSupervising && authStore.supervisingOwner?.id === owner.id) {
    exitAuditMode()
  } else {
    const res = authStore.startSupervision(owner)
    if (res.success) {
      triggerAlert(`👑 Mode Supervisi Aktif: Mengaudit data ${owner.name} (${owner.companyName}).`, 'success')
    } else {
      triggerAlert(res.message, 'error')
    }
  }
}

function exitAuditMode() {
  const res = authStore.exitSupervision()
  triggerAlert(res.message, 'success')
}
</script>
