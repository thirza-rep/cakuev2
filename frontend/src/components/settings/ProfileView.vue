<template>
  <div class="space-y-6 max-w-5xl mx-auto pb-12">
    <!-- Header Page -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Icon name="user" custom-class="w-5 h-5 text-white" />
          </div>
          <span>Profil Pengguna & Keamanan</span>
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Kelola data pribadi, foto avatar, PIN otorisasi kasir 6-digit, serta manajemen hak akses staf tim (RBAC).
        </p>
      </div>

      <!-- Sesi Aktif Card Badge -->
      <div class="flex items-center gap-2 shrink-0">
        <div class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <div class="text-left">
            <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Peran Aktif</div>
            <div class="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <span>{{ authStore.currentRoleConfig.title }}</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold" :class="authStore.currentRoleConfig.color">
                {{ authStore.activeBusinessRole.toUpperCase() }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Notifikasi -->
    <transition name="fade">
      <div v-if="alertMessage" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center justify-between text-xs sm:text-sm shadow-xs">
        <div class="flex items-center gap-2.5 font-bold">
          <Icon name="check" custom-class="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{{ alertMessage }}</span>
        </div>
        <button @click="alertMessage = ''" class="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer text-xs">
          Tutup
        </button>
      </div>
    </transition>

    <!-- GRID UTAMA: PROFIL PRIBADI & KEAMANAN PIN -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      
      <!-- KARTU 1: DATA DIRI & AVATAR PENGGUNA -->
      <div class="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div class="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
            1
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-black text-slate-900">Identitas Diri & Foto</h2>
            <p class="text-xs text-slate-500">Avatar dan identitas pengguna aktif yang tercatat di audit log.</p>
          </div>
        </div>

        <!-- Avatar Upload -->
        <div class="space-y-3">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Foto Profil (Avatar Lokal)</label>
          <div class="flex items-center gap-4">
            <div class="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-2 border-emerald-600/30 p-1 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
              <img 
                v-if="formProfile.avatar" 
                :src="formProfile.avatar" 
                alt="User Avatar" 
                class="w-full h-full object-cover rounded-full"
              />
              <div v-else class="w-full h-full rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xl sm:text-2xl">
                {{ formProfile.name ? formProfile.name.charAt(0).toUpperCase() : 'U' }}
              </div>
            </div>

            <div class="space-y-2">
              <input 
                ref="avatarFileInput"
                type="file" 
                accept="image/png, image/jpeg, image/webp" 
                class="hidden" 
                @change="handleAvatarFileSelect"
              />
              <div class="flex flex-wrap gap-2">
                <button 
                  @click="triggerAvatarUpload" 
                  type="button" 
                  class="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Icon name="camera" custom-class="w-3.5 h-3.5" />
                  <span>Ambil Foto</span>
                </button>
                <button 
                  v-if="formProfile.avatar" 
                  @click="removeAvatar" 
                  type="button" 
                  class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Hapus
                </button>
              </div>
              <p class="text-[11px] text-slate-400">Tersimpan secara lokal di browser/perangkat Anda.</p>
            </div>
          </div>
        </div>

        <!-- Form Nama, Email, WhatsApp -->
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase text-slate-600 mb-1.5">Nama Lengkap</label>
            <input 
              v-model="formProfile.name" 
              type="text" 
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label class="block text-xs font-bold uppercase text-slate-600 mb-1.5">Email Pengguna</label>
              <input 
                v-model="formProfile.email" 
                type="email" 
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-slate-600 mb-1.5">No. WhatsApp / HP</label>
              <input 
                v-model="formProfile.phone" 
                type="tel" 
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <!-- Informasi Cabang & Hak Akses Pengguna -->
          <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-slate-500 font-medium">Cabang Penugasan:</span>
              <span class="font-bold text-slate-800">{{ authStore.businessUser.currentBranch }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500 font-medium">Otoritas RBAC:</span>
              <span class="font-bold text-emerald-700">{{ authStore.currentRoleConfig.description }}</span>
            </div>
          </div>

          <div class="pt-2 flex justify-end">
            <button 
              @click="saveProfileInfo" 
              type="button" 
              class="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <Icon name="check" custom-class="w-4 h-4" />
              <span>Simpan Profil Saya</span>
            </button>
          </div>
        </div>
      </div>

      <!-- KARTU 2: KEAMANAN & PIN OTORISASI KASIR (6 DIGIT) -->
      <div class="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div class="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm shrink-0">
            2
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-black text-slate-900">Keamanan & PIN Otorisasi Kasir</h2>
            <p class="text-xs text-slate-500">PIN 6-digit untuk otorisasi void transaksi, diskon, dan buka laci kas.</p>
          </div>
        </div>

        <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <div class="flex items-center gap-2 font-bold text-slate-800">
            <Icon name="shield" custom-class="w-4 h-4 text-emerald-600" />
            <span>Fungsi PIN Otorisasi 6-Digit:</span>
          </div>
          <ul class="list-disc list-inside text-slate-600 space-y-1 text-[11px] leading-relaxed">
            <li>Otorisasi Supervisor saat pembatalan (void) struk kasir yang sudah tercetak.</li>
            <li>Persetujuan diskon manual atau potongan harga khusus di kasir POS.</li>
            <li>Buka cash drawer tanpa transaksi bagi staf yang berwenang.</li>
          </ul>
        </div>

        <!-- Form Ubah PIN -->
        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-bold uppercase text-slate-600">PIN 6-Digit Anda</label>
              <button 
                @click="showPinInput = !showPinInput" 
                type="button" 
                class="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
              >
                {{ showPinInput ? 'Sembunyikan' : 'Perlihatkan PIN' }}
              </button>
            </div>

            <div class="relative">
              <input 
                v-model="formPin" 
                :type="showPinInput ? 'text' : 'password'" 
                maxlength="6"
                placeholder="••••••"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center text-xl font-mono font-extrabold tracking-widest text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-colors"
              />
              <div class="absolute right-3.5 top-3.5 text-slate-400 text-xs font-mono">
                {{ formPin.length }}/6
              </div>
            </div>
            <p class="text-[11px] text-slate-400 mt-1">Harus berupa 6 digit angka tanpa huruf atau simbol.</p>
          </div>

          <!-- Status Indikator PIN -->
          <div class="p-3 rounded-xl border flex items-center justify-between text-xs" :class="settingsStore.userPin ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'">
            <div class="flex items-center gap-2">
              <Icon :name="settingsStore.userPin ? 'check' : 'alert'" custom-class="w-4 h-4" />
              <span class="font-bold">
                {{ settingsStore.userPin ? 'PIN Keamanan Aktif & Terlindungi' : 'PIN Belum Diatur' }}
              </span>
            </div>
            <span class="font-mono text-[11px] font-bold">
              {{ settingsStore.userPin ? '••••••' : 'Default: 123456' }}
            </span>
          </div>

          <div class="pt-2 flex justify-end">
            <button 
              @click="savePin" 
              type="button" 
              class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <Icon name="lock" custom-class="w-4 h-4" />
              <span>Simpan PIN Keamanan</span>
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- SEKSI 3: MANAJEMEN STAF & TIM USAHA (RBAC MASTER) -->
    <!-- DILINDUNGI RBAC: HANYA OWNER & MANAGER YANG DAPAT MELIHAT & MENGELOLA SEKSI INI -->
    <div v-if="authStore.canManageStaff" class="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-6 mt-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm shrink-0">
            3
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base sm:text-lg font-black text-slate-900">Manajemen Staf & Hak Akses Tim</h2>
              <span class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-200">
                RBAC Level: {{ authStore.isOwner ? 'Master Admin' : 'Manager Cabang' }}
              </span>
            </div>
            <p class="text-xs text-slate-500">
              Kelola daftar kasir, staf logistik, dan manajer operasional. Atur penugasan cabang dan reset PIN kasir.
            </p>
          </div>
        </div>

        <button 
          @click="openAddStaffModal"
          type="button"
          class="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <Icon name="plus" custom-class="w-4 h-4" />
          <span>Tambah Staf Baru</span>
        </button>
      </div>

      <!-- FILTER CABANG & ISOLASI TIM (POIN 2) -->
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs font-bold text-slate-700">
          <span class="flex items-center gap-1.5">
            <Icon name="building" custom-class="w-4 h-4 text-emerald-700" />
            <span>Pilih Cabang untuk Kelola Tim:</span>
          </span>
          <span v-if="authStore.isManager && !authStore.isOwner" class="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            🔒 Terkunci pada: {{ authStore.businessUser.currentBranch }}
          </span>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto pb-1">
          <!-- Opsi Semua Cabang (Khusus Owner) -->
          <button 
            v-if="authStore.isOwner"
            @click="selectedBranchFilter = 'all'"
            type="button"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0',
              selectedBranchFilter === 'all' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            ]"
          >
            <span>Semua Cabang</span>
            <span class="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded" :class="selectedBranchFilter === 'all' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'">
              {{ settingsStore.staffList.length }}
            </span>
          </button>

          <!-- List Cabang -->
          <button
            v-for="b in selectableBranches"
            :key="b.id"
            @click="selectedBranchFilter = b.name"
            type="button"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0',
              selectedBranchFilter === b.name 
                ? 'bg-emerald-700 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            ]"
          >
            <span>📍 {{ b.name }}</span>
            <span class="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded" :class="selectedBranchFilter === b.name ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'">
              {{ getBranchStaffCount(b.name) }}
            </span>
          </button>
        </div>
      </div>

      <!-- Filter Role & Search Staf -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div class="relative w-full sm:w-64">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari nama atau email..."
            class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
          />
          <Icon name="search" custom-class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button 
            v-for="filter in roleFilters" 
            :key="filter.value"
            @click="activeRoleFilter = filter.value"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer',
              activeRoleFilter === filter.value 
                ? 'bg-slate-900 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            ]"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Tabel Daftar Staf Usaha (Responsive Table & Card View) -->
      <div class="overflow-x-auto border border-slate-200 rounded-xl">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase text-[10px] tracking-wider">
            <tr>
              <th class="px-4 py-3">Nama & Kontak</th>
              <th class="px-4 py-3">Peran (Role)</th>
              <th class="px-4 py-3">Cabang Kerja</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3 text-center">PIN Kasir</th>
              <th class="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="staff in filteredStaffList" :key="staff.id" class="hover:bg-slate-50/70 transition-colors">
              <td class="px-4 py-3.5">
                <div class="font-bold text-slate-900">{{ staff.name }}</div>
                <div class="text-[11px] text-slate-500">{{ staff.email }} • {{ staff.phone }}</div>
              </td>
              <td class="px-4 py-3.5">
                <span class="inline-block px-2.5 py-1 rounded-md text-[10px] font-mono font-bold capitalize" :class="getRoleColor(staff.role)">
                  {{ staff.role }}
                </span>
              </td>
              <td class="px-4 py-3.5 text-slate-700 font-medium">
                {{ staff.branch }}
              </td>
              <td class="px-4 py-3.5">
                <button 
                  @click="toggleStaff(staff.id)"
                  type="button"
                  :disabled="staff.role === 'owner' && !authStore.isOwner"
                  :class="[
                    'px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono transition-colors cursor-pointer',
                    staff.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500 line-through'
                  ]"
                >
                  {{ staff.active ? '● Aktif' : '○ Nonaktif' }}
                </button>
              </td>
              <td class="px-4 py-3.5 text-center font-mono font-bold text-slate-600">
                <span class="bg-slate-100 px-2 py-0.5 rounded text-[11px]">••••••</span>
              </td>
              <td class="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                <button 
                  @click="openResetPinModal(staff)"
                  type="button"
                  class="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                  title="Reset PIN Kasir 6 Digit"
                >
                  Reset PIN
                </button>
                <button 
                  v-if="canDeleteStaff(staff)"
                  @click="handleDeleteStaff(staff)"
                  type="button"
                  class="px-2.5 py-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                  title="Hapus Staf"
                >
                  Hapus
                </button>
              </td>
            </tr>

            <tr v-if="filteredStaffList.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-slate-400 text-xs">
                Tidak ada staf yang sesuai dengan kriteria pencarian.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Fallback Info untuk Kasir & Gudang (Bahwa mereka tidak memiliki izin kelola staf) -->
    <div v-else class="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 text-xs text-slate-600">
      <Icon name="shield" custom-class="w-5 h-5 text-slate-400 shrink-0" />
      <span>
        Manajemen staf dan hak akses tim dibatasi hanya untuk <strong>Owner</strong> dan <strong>Manajer Cabang</strong>. Akun Anda saat ini memiliki hak akses operasional mandiri.
      </span>
    </div>

    <!-- MODAL 1: TAMBAH STAF BARU -->
    <div v-if="showAddStaffModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="font-black text-base text-slate-900">Tambah Anggota Staf Baru</div>
          <button @click="showAddStaffModal = false" class="text-slate-400 hover:text-slate-600 cursor-pointer">
            <Icon name="close" custom-class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-bold uppercase text-slate-600 mb-1">Nama Lengkap</label>
            <input 
              v-model="newStaff.name" 
              type="text" 
              placeholder="Contoh: Maya Indah"
              class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold uppercase text-slate-600 mb-1">Email</label>
              <input 
                v-model="newStaff.email" 
                type="email" 
                placeholder="maya@cakue.id"
                class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label class="block font-bold uppercase text-slate-600 mb-1">No. WhatsApp</label>
              <input 
                v-model="newStaff.phone" 
                type="tel" 
                placeholder="08xxxxxxxxxx"
                class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold uppercase text-slate-600 mb-1">Peran (Role RBAC)</label>
              <select 
                v-model="newStaff.role" 
                class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
              >
                <option v-if="authStore.isOwner" value="owner">Owner (Super Admin)</option>
                <option value="manager">Manajer Cabang</option>
                <option value="cashier">Kasir POS Toko</option>
                <option value="warehouse">Staff Gudang</option>
              </select>
            </div>
            <div>
              <label class="block font-bold uppercase text-slate-600 mb-1">Cabang Penugasan</label>
              <select 
                v-model="newStaff.branch" 
                class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
              >
                <option v-for="b in authStore.branches" :key="b.id" :value="b.name">
                  {{ b.name }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-bold uppercase text-slate-600 mb-1">Default PIN Otorisasi (6 Digit)</label>
            <input 
              v-model="newStaff.pin" 
              type="text" 
              maxlength="6"
              placeholder="123456"
              class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-center text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button 
            @click="showAddStaffModal = false" 
            type="button" 
            class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button 
            @click="submitAddStaff" 
            type="button" 
            class="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer"
          >
            Tambahkan Staf
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL 2: RESET PIN STAF -->
    <div v-if="showResetPinModal && targetStaff" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="relative w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="font-black text-base text-slate-900">Reset PIN Otorisasi Kasir</div>
          <button @click="showResetPinModal = false" class="text-slate-400 hover:text-slate-600 cursor-pointer">
            <Icon name="close" custom-class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div class="font-bold text-slate-900">{{ targetStaff.name }}</div>
            <div class="text-[11px] text-slate-500">{{ targetStaff.role.toUpperCase() }} • {{ targetStaff.branch }}</div>
          </div>

          <div>
            <label class="block font-bold uppercase text-slate-600 mb-1">Masukkan PIN Baru (6 Digit)</label>
            <input 
              v-model="newResetPin" 
              type="text" 
              maxlength="6"
              placeholder="Contoh: 889900"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-center text-lg font-extrabold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button 
            @click="showResetPinModal = false" 
            type="button" 
            class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            Batal
          </button>
          <button 
            @click="submitResetPin" 
            type="button" 
            class="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl cursor-pointer"
          >
            Terapkan PIN Baru
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useSettingsStore } from '../../stores/settingsStore'
import Icon from '../common/Icon.vue'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()

const avatarFileInput = ref(null)
const alertMessage = ref('')

const showPinInput = ref(false)
const formPin = ref('')

const formProfile = reactive({
  name: '',
  email: '',
  phone: '',
  avatar: ''
})

// State Manajemen Staf
const searchQuery = ref('')
const activeRoleFilter = ref('all')
const selectedBranchFilter = ref(authStore.isManager && !authStore.isOwner ? authStore.businessUser.currentBranch : 'all')
const showAddStaffModal = ref(false)
const showResetPinModal = ref(false)
const targetStaff = ref(null)
const newResetPin = ref('')

const selectableBranches = computed(() => {
  if (authStore.isManager && !authStore.isOwner) {
    return authStore.branches.filter(b => b.name === authStore.businessUser.currentBranch)
  }
  return authStore.branches
})

function getBranchStaffCount(branchName) {
  return settingsStore.getStaffByBranch(branchName).length
}

const newStaff = reactive({
  name: '',
  email: '',
  phone: '',
  role: 'cashier',
  branch: 'Cabang Jakarta Selatan',
  pin: '123456'
})

const roleFilters = [
  { label: 'Semua Peran', value: 'all' },
  { label: 'Kasir POS', value: 'cashier' },
  { label: 'Manajer Cabang', value: 'manager' },
  { label: 'Gudang', value: 'warehouse' }
]

onMounted(() => {
  loadProfileData()
})

function loadProfileData() {
  formProfile.name = settingsStore.userName
  formProfile.email = settingsStore.userEmail
  formProfile.phone = settingsStore.userPhone
  formProfile.avatar = settingsStore.userAvatar
  formPin.value = settingsStore.userPin || '123456'
}

function triggerAvatarUpload() {
  avatarFileInput.value?.click()
}

function handleAvatarFileSelect(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    alert('Ukuran foto maksimal 2MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    formProfile.avatar = event.target.result
  }
  reader.readAsDataURL(file)
}

function removeAvatar() {
  formProfile.avatar = ''
  if (avatarFileInput.value) avatarFileInput.value.value = ''
}

function saveProfileInfo() {
  settingsStore.saveProfile({
    name: formProfile.name,
    email: formProfile.email,
    phone: formProfile.phone
  })
  if (formProfile.avatar) {
    settingsStore.setUserAvatar(formProfile.avatar)
  } else {
    settingsStore.removeUserAvatar()
  }

  showAlert('Profil berhasil disimpan!')
}

function savePin() {
  const cleanPin = formPin.value.trim()
  if (!/^\d{6}$/.test(cleanPin)) {
    alert('PIN harus berupa 6 digit angka numerik!')
    return
  }
  settingsStore.updateUserPin(cleanPin)
  showAlert('PIN otorisasi kasir 6-digit berhasil diperbarui!')
}

// Staf Helpers
const filteredStaffList = computed(() => {
  let list = settingsStore.staffList || []

  // Jika Manager Cabang, batasi hanya melihat staf pada cabangnya sendiri (kecuali Owner)
  if (authStore.isManager && !authStore.isOwner) {
    const managerBranch = authStore.businessUser.currentBranch
    list = list.filter(s => s.branch === managerBranch || s.role === 'owner')
  } else if (selectedBranchFilter.value !== 'all') {
    list = list.filter(s => s.branch === selectedBranchFilter.value || (s.role === 'owner' && selectedBranchFilter.value === 'Semua Cabang (Kantor Pusat)'))
  }

  if (activeRoleFilter.value !== 'all') {
    list = list.filter(s => s.role === activeRoleFilter.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q))
  }

  return list
})

function getRoleColor(role) {
  switch (role) {
    case 'owner': return 'bg-purple-100 text-purple-800'
    case 'manager': return 'bg-emerald-100 text-emerald-800'
    case 'cashier': return 'bg-blue-100 text-blue-800'
    case 'warehouse': return 'bg-amber-100 text-amber-800'
    default: return 'bg-slate-100 text-slate-800'
  }
}

function canDeleteStaff(staff) {
  if (staff.role === 'owner') return false
  if (authStore.isOwner) return true
  if (authStore.isManager && staff.role !== 'owner' && staff.role !== 'manager') return true
  return false
}

function toggleStaff(id) {
  settingsStore.toggleStaffStatus(id)
  showAlert('Status staf berhasil diperbarui!')
}

function handleDeleteStaff(staff) {
  if (confirm(`Yakin ingin menghapus ${staff.name} dari sistem tim?`)) {
    settingsStore.deleteStaff(staff.id)
    showAlert(`Staf ${staff.name} berhasil dihapus.`)
  }
}

function openAddStaffModal() {
  newStaff.name = ''
  newStaff.email = ''
  newStaff.phone = ''
  newStaff.role = 'cashier'
  newStaff.branch = (selectedBranchFilter.value && selectedBranchFilter.value !== 'all') 
    ? selectedBranchFilter.value 
    : (authStore.businessUser.currentBranch || 'Cabang Jakarta Selatan')
  newStaff.pin = '123456'
  showAddStaffModal.value = true
}

function submitAddStaff() {
  if (!newStaff.name.trim() || !newStaff.email.trim()) {
    alert('Nama dan Email staf wajib diisi!')
    return
  }
  if (!/^\d{6}$/.test(newStaff.pin)) {
    alert('Default PIN harus 6 digit angka!')
    return
  }
  settingsStore.addStaff({ ...newStaff })
  showAddStaffModal.value = false
  showAlert(`Staf ${newStaff.name} berhasil ditambahkan!`)
}

function openResetPinModal(staff) {
  targetStaff.value = staff
  newResetPin.value = ''
  showResetPinModal.value = true
}

function submitResetPin() {
  if (!/^\d{6}$/.test(newResetPin.value)) {
    alert('PIN baru harus berupa 6 digit angka!')
    return
  }
  settingsStore.resetStaffPin(targetStaff.value.id, newResetPin.value)
  showResetPinModal.value = false
  showAlert(`PIN untuk ${targetStaff.value.name} berhasil diubah ke: ${newResetPin.value}`)
}

function showAlert(msg) {
  alertMessage.value = msg
  setTimeout(() => {
    alertMessage.value = ''
  }, 4000)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
