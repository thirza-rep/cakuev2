<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
    <!-- Background Subtle Dots -->
    <div class="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

    <div class="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-8 space-y-6">
      <div class="text-center space-y-1">
        <button 
          @click="$emit('go-onboarding')" 
          type="button" 
          class="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer mb-1"
        >
          <Icon name="chevron-left" custom-class="w-3.5 h-3.5" />
          <span>Kembali ke Beranda Utama</span>
        </button>
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-700 text-white font-extrabold text-xl shadow-sm mb-1">
          CK
        </div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900">Buat Akun CAKUE Baru</h2>
        <p class="text-xs text-slate-500">Pilih jenis penggunaan dan mulai pembukuan yang tertib dan presisi</p>
      </div>

      <!-- Account Type Selection -->
      <div class="grid grid-cols-2 gap-3">
        <button 
          type="button"
          @click="accountType = 'personal'"
          :class="['p-4 rounded-xl border text-left transition-all cursor-pointer', accountType === 'personal' ? 'bg-emerald-50/70 border-emerald-600 ring-1 ring-emerald-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300']"
        >
          <Icon name="wallet" custom-class="w-5 h-5 text-emerald-700 mb-1" />
          <div class="text-xs font-bold text-slate-900">Pribadi / Perorangan</div>
          <div class="text-[11px] text-slate-500 mt-0.5">Khusus pencatatan dompet pribadi, pengeluaran & utang.</div>
        </button>

        <button 
          type="button"
          @click="accountType = 'business'"
          :class="['p-4 rounded-xl border text-left transition-all cursor-pointer', accountType === 'business' ? 'bg-emerald-50/70 border-emerald-600 ring-1 ring-emerald-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300']"
        >
          <Icon name="store" custom-class="w-5 h-5 text-emerald-700 mb-1" />
          <div class="text-xs font-bold text-slate-900">Usaha / UMKM & Ritel</div>
          <div class="text-[11px] text-slate-500 mt-0.5">Kasir POS, multi-cabang, inventaris & manajemen aset.</div>
        </button>
      </div>

      <!-- Google One-Click Quick Registration -->
      <div class="space-y-3">
        <button 
          @click="handleGoogleRegister"
          type="button"
          :disabled="isLoading || isGoogleLoading"
          class="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 transition-all shadow-xs cursor-pointer disabled:opacity-50"
        >
          <svg v-if="!isGoogleLoading" class="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <svg v-else class="animate-spin w-4 h-4 text-emerald-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-if="isGoogleLoading">Menghubungkan ke Google...</span>
          <span v-else>
            Daftar Instan via Google ({{ accountType === 'personal' ? 'Portal Pribadi' : 'Portal Usaha' }})
          </span>
        </button>

        <div class="relative flex items-center justify-center py-1">
          <div class="border-t border-slate-200 w-full"></div>
          <span class="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">atau isi formulir manual</span>
        </div>
      </div>

      <!-- Error Message Banner -->
      <div v-if="errorMessage" class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
        <Icon name="alert-circle" custom-class="w-4 h-4 shrink-0 mt-0.5" />
        <span>{{ errorMessage }}</span>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-3.5">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
          <input 
            v-model="name" 
            type="text" 
            required
            placeholder="Contoh: Dimas Pratama" 
            class="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Alamat Email</label>
          <input 
            v-model="email" 
            type="email" 
            required
            placeholder="dimas@gmail.com" 
            class="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi</label>
            <input 
              v-model="password" 
              type="password" 
              required
              placeholder="••••••••" 
              class="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Konfirmasi Sandi</label>
            <input 
              v-model="confirmPassword" 
              type="password" 
              required
              placeholder="••••••••" 
              class="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span v-if="isLoading">Mendaftarkan ke Database...</span>
          <span v-else>Daftar Akun Baru (100% Bebas Biaya)</span>
        </button>
      </form>

      <div class="text-center text-xs text-slate-500">
        Sudah memiliki akun? 
        <button @click="$emit('switch-view', 'login')" class="text-emerald-700 font-bold hover:underline">
          Masuk di sini
        </button>
      </div>
    </div>

    <!-- Modal Origin Whitelist Helper (Google Cloud Console) -->
    <div v-if="showOriginModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-4">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <Icon name="shield-check" custom-class="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">Konfigurasi Origin Google OAuth</h3>
              <p class="text-xs text-slate-500">Daftarkan domain/IP aplikasi ini agar login Google diizinkan.</p>
            </div>
          </div>
          <button 
            @click="showOriginModal = false" 
            type="button" 
            class="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Icon name="x" custom-class="w-5 h-5" />
          </button>
        </div>

        <div class="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2 text-xs text-amber-900">
          <div class="font-bold flex items-center gap-1.5">
            <Icon name="alert-circle" custom-class="w-4 h-4 text-amber-700 shrink-0" />
            <span>Origin Web Belum Masuk Whitelist Google:</span>
          </div>
          <p class="text-[11px] leading-relaxed text-amber-800">
            Google Identity Services menolak inisialisasi pendaftaran jika domain / IP browser saat ini belum didaftarkan di <strong>Authorized JavaScript origins</strong> pada Google Cloud Console.
          </p>
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-slate-700">Origin Aplikasi Saat Ini:</label>
          <div class="flex items-center gap-2">
            <code class="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 select-all truncate">
              {{ detectedOrigin }}
            </code>
            <button 
              type="button"
              @click="copyOrigin(detectedOrigin)"
              class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <Icon :name="copiedOrigin ? 'check' : 'copy'" custom-class="w-3.5 h-3.5" />
              <span>{{ copiedOrigin ? 'Tersalin!' : 'Salin Origin' }}</span>
            </button>
          </div>
        </div>

        <div class="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div class="font-bold text-slate-800">Langkah Pendaftaran Cepat:</div>
          <ol class="list-decimal list-inside space-y-1 text-[11px] text-slate-600">
            <li>Buka menu <strong>APIs & Services &gt; Credentials</strong> di Google Cloud Console.</li>
            <li>Pilih Web Client ID Anda (Project: <code>kelompok-464603</code>).</li>
            <li>Tambahkan URL di atas ke kolom <strong>Authorized JavaScript origins</strong>.</li>
            <li>Pastikan juga menambahkan origin lokal: <code>http://localhost:5173</code> dan <code>http://192.168.1.13:5173</code>.</li>
            <li>Klik <strong>Save</strong> (biasanya berlaku dalam 1-2 menit), lalu refresh halaman ini.</li>
          </ol>
        </div>

        <div class="pt-2 flex items-center justify-end gap-2">
          <button 
            type="button" 
            @click="showOriginModal = false"
            class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
          <button 
            type="button" 
            @click="handleGoogleRegister"
            class="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Coba Daftar Lagi</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Google Credential Setup Modal -->
    <GoogleCredentialModal 
      :is-open="showCredentialModal"
      :google-data="pendingGoogleData"
      :account-type="accountType"
      @close="showCredentialModal = false"
      @success="showCredentialModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import Icon from '../common/Icon.vue'
import GoogleCredentialModal from './GoogleCredentialModal.vue'

const emit = defineEmits(['switch-view', 'go-onboarding'])
const authStore = useAuthStore()

const accountType = ref('business')
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const isGoogleLoading = ref(false)
const showOriginModal = ref(false)
const showCredentialModal = ref(false)
const pendingGoogleData = ref(null)
const detectedOrigin = ref(typeof window !== 'undefined' ? window.location.origin : 'http://192.168.1.13:5173')
const copiedOrigin = ref(false)

onMounted(() => {
  if (typeof window !== 'undefined') {
    detectedOrigin.value = window.location.origin
  }
})

async function handleGoogleRegister() {
  errorMessage.value = ''
  isGoogleLoading.value = true
  try {
    const roleTarget = accountType.value === 'personal' ? 'personal' : 'owner'
    const res = await authStore.loginWithGoogle(null, {
      accountTypeTarget: accountType.value,
      roleTarget: roleTarget,
      branchIdTarget: 'jogja-1'
    })
    if (res.success) {
      if (res.is_new) {
        pendingGoogleData.value = res.google_data
        showCredentialModal.value = true
      }
    } else {
      if (res.needsOriginWhitelist) {
        showOriginModal.value = true
      } else {
        errorMessage.value = res.message || 'Pendaftaran via Google dibatalkan atau gagal.'
      }
    }
  } catch (err) {
    errorMessage.value = `Terjadi kesalahan pendaftaran Google: ${err.message}`
  } finally {
    isGoogleLoading.value = false
  }
}

async function copyOrigin(text) {
  try {
    await navigator.clipboard.writeText(text)
    copiedOrigin.value = true
    setTimeout(() => {
      copiedOrigin.value = false
    }, 2500)
  } catch (err) {
    console.error('Failed to copy origin:', err)
  }
}

async function handleRegister() {
  errorMessage.value = ''
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Konfirmasi kata sandi tidak cocok!'
    return
  }

  isLoading.value = true
  try {
    const role = accountType.value === 'personal' ? 'personal' : 'owner'
    const branchId = 'jogja-1'
    const res = await authStore.register(name.value, email.value, password.value, accountType.value, role, branchId)
    if (!res.success) {
      errorMessage.value = res.message || 'Pendaftaran gagal'
    }
  } catch (err) {
    errorMessage.value = `Terjadi kesalahan: ${err.message}`
  } finally {
    isLoading.value = false
  }
}
</script>
