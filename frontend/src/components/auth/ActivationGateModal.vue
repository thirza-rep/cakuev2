<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
    <div class="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-auto text-slate-900">
      
      <!-- Top Shield / Security Header -->
      <div class="text-center space-y-2">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 shadow-xs mb-1">
          <Icon name="shield-check" custom-class="w-7 h-7" />
        </div>
        
        <div class="space-y-1">
          <span class="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            Aktivasi Wajib Pengguna Baru
          </span>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Aktivasi Akun CAKUE Anda</h2>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            Selesaikan 3 langkah verifikasi di bawah ini untuk mengamankan data dan membuka akses penuh fitur portal Anda.
          </p>
        </div>
      </div>

      <!-- Step Progress Checklist Indicator -->
      <div class="grid grid-cols-3 gap-2 text-center text-[11px] font-bold">
        <div class="p-2.5 rounded-xl border transition-all" :class="avatarUrl ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'">
          <div class="flex items-center justify-center gap-1 mb-0.5">
            <Icon :name="avatarUrl ? 'check' : 'circle'" custom-class="w-3.5 h-3.5" />
            <span>1. Foto Profil</span>
          </div>
          <span class="text-[10px] font-normal block truncate">{{ avatarUrl ? 'Terpilih' : 'Wajib' }}</span>
        </div>

        <div class="p-2.5 rounded-xl border transition-all" :class="name.trim().length >= 3 ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'">
          <div class="flex items-center justify-center gap-1 mb-0.5">
            <Icon :name="name.trim().length >= 3 ? 'check' : 'circle'" custom-class="w-3.5 h-3.5" />
            <span>2. Nama Lengkap</span>
          </div>
          <span class="text-[10px] font-normal block truncate">{{ name.trim().length >= 3 ? 'Lengkap' : 'Wajib' }}</span>
        </div>

        <div class="p-2.5 rounded-xl border transition-all" :class="isOtpSuccess ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'">
          <div class="flex items-center justify-center gap-1 mb-0.5">
            <Icon :name="isOtpSuccess ? 'check' : 'circle'" custom-class="w-3.5 h-3.5" />
            <span>3. OTP WhatsApp</span>
          </div>
          <span class="text-[10px] font-normal block truncate">{{ isOtpSuccess ? 'Terverifikasi' : 'Wajib' }}</span>
        </div>
      </div>

      <!-- Error / Success Feedback Banner -->
      <div v-if="errorMessage" class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
        <Icon name="alert-circle" custom-class="w-4 h-4 shrink-0 mt-0.5" />
        <span>{{ errorMessage }}</span>
      </div>

      <div v-if="successMessage" class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-2">
        <Icon name="check" custom-class="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
        <span>{{ successMessage }}</span>
      </div>

      <!-- Main Form Sections -->
      <div class="space-y-5">
        
        <!-- SECTION 1: FOTO PROFIL -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>Langkah 1: Foto Profil Pengguna</span>
              <span class="text-[10px] font-normal text-rose-500 font-semibold">*Wajib</span>
            </label>
            <span class="text-[11px] text-slate-400">Pilih avatar atau upload</span>
          </div>

          <div class="flex items-center gap-4">
            <!-- Avatar Preview -->
            <div class="relative group shrink-0">
              <img 
                :src="avatarUrl || defaultAvatar" 
                alt="Avatar Pengguna"
                class="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md bg-white" 
              />
              <div class="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-1 shadow-xs">
                <Icon name="camera" custom-class="w-3 h-3" />
              </div>
            </div>

            <!-- Avatar Presets -->
            <div class="flex-1 space-y-1.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pilih Cepat Avatar:</span>
              <div class="flex flex-wrap gap-1.5">
                <button 
                  v-for="(av, idx) in avatarPresets" 
                  :key="idx"
                  type="button"
                  @click="avatarUrl = av"
                  class="w-8 h-8 rounded-lg overflow-hidden border transition-all cursor-pointer hover:scale-105"
                  :class="avatarUrl === av ? 'border-emerald-600 ring-2 ring-emerald-500 shadow-xs' : 'border-slate-200 opacity-75 hover:opacity-100'"
                >
                  <img :src="av" alt="Preset" class="w-full h-full object-cover" />
                </button>
              </div>

              <!-- Upload File Custom -->
              <div class="pt-1">
                <label class="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer inline-flex items-center gap-1">
                  <Icon name="upload" custom-class="w-3 h-3" />
                  <span>Upload Foto dari Perangkat</span>
                  <input type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 2: NAMA LENGKAP -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>Langkah 2: Nama Lengkap Pengguna</span>
              <span class="text-[10px] font-normal text-rose-500 font-semibold">*Wajib</span>
            </label>
            <span class="text-[11px] text-slate-400">Minimal 3 karakter</span>
          </div>

          <input 
            v-model="name"
            type="text"
            required
            placeholder="Contoh: Budi Santoso"
            class="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
          />
        </div>

        <!-- SECTION 3: NOMOR WHATSAPP & VERIFIKASI OTP -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>Langkah 3: Nomor WhatsApp & Verifikasi OTP</span>
              <span class="text-[10px] font-normal text-rose-500 font-semibold">*Wajib</span>
            </label>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-bold">
              WA Gateway $0
            </span>
          </div>

          <!-- Phone Number Input & Send OTP Button -->
          <div class="space-y-1.5">
            <label class="block text-[11px] font-bold text-slate-600">Nomor WhatsApp Aktif</label>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-bold text-xs">🇮🇩 +62</span>
                <input 
                  v-model="phoneInput"
                  type="tel"
                  placeholder="812-3456-7890"
                  :disabled="isOtpSuccess"
                  class="w-full pl-16 pr-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 disabled:bg-slate-100 disabled:text-slate-400 transition-all"
                />
              </div>

              <button 
                type="button"
                @click="handleSendOtp"
                :disabled="isSendingOtp || otpCooldown > 0 || isOtpSuccess"
                class="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                <svg v-if="isSendingOtp" class="animate-spin w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-if="otpCooldown > 0">{{ otpCooldown }}s</span>
                <span v-else>{{ otpSent ? 'Kirim Ulang' : 'Kirim OTP' }}</span>
              </button>
            </div>
          </div>

          <!-- OTP Input Field (Shows after OTP is dispatched or ready) -->
          <div v-if="otpSent || isOtpSuccess" class="space-y-2 pt-1 border-t border-slate-200">
            <div class="flex items-center justify-between">
              <label class="block text-[11px] font-bold text-slate-700">Masukkan 6 Digit Kode OTP</label>
              <span class="text-[10px] text-emerald-700 font-bold">Berlaku 5 Menit</span>
            </div>

            <div class="flex gap-2">
              <input 
                v-model="otpCode"
                type="text"
                maxlength="6"
                placeholder="••••••"
                :disabled="isOtpSuccess"
                class="w-full text-center tracking-[0.5em] font-mono text-base font-black px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-emerald-50 disabled:text-emerald-800 transition-all"
                @keyup.enter="handleVerifyAndActivate"
              />

              <button 
                type="button"
                @click="handleVerifyAndActivate"
                :disabled="isVerifying || otpCode.length < 6 || isOtpSuccess"
                class="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <svg v-if="isVerifying" class="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <Icon v-else-if="isOtpSuccess" name="check" custom-class="w-4 h-4 text-white" />
                <span>{{ isOtpSuccess ? 'Terverifikasi' : 'Verifikasi & Aktifkan' }}</span>
              </button>
            </div>

            <!-- Info & Testing Bypass Tip -->
            <p class="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Periksa notifikasi WhatsApp di nomor Anda.</span>
              <span class="text-[10px] text-slate-400 font-mono">(Kode darurat: 777888)</span>
            </p>
          </div>
        </div>

      </div>

      <!-- Action Footer: Logout / Switch Account -->
      <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span class="text-slate-400 text-[11px]">Akun: {{ authStore.currentUser?.email || authStore.currentUser?.username }}</span>
        
        <button 
          type="button"
          @click="handleLogout"
          class="font-bold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1"
        >
          <Icon name="log-out" custom-class="w-3.5 h-3.5" />
          <span>Keluar / Ganti Akun</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import Icon from '../common/Icon.vue'

const authStore = useAuthStore()

// Modal otomatis aktif jika user terautentikasi namun belum melengkapi profil & OTP
const isOpen = computed(() => {
  return Boolean(authStore.isAuthenticated && !authStore.isProfileComplete)
})

const name = ref(authStore.currentUser?.name || '')
const avatarUrl = ref(authStore.currentUser?.avatar_url || '')
const phoneInput = ref(authStore.currentUser?.phone ? authStore.currentUser.phone.replace(/^62/, '') : '')
const otpCode = ref('')
const otpSent = ref(false)
const otpCooldown = ref(0)
const isSendingOtp = ref(false)
const isVerifying = ref(false)
const isOtpSuccess = ref(Boolean(authStore.currentUser?.phone_verified))
const errorMessage = ref('')
const successMessage = ref('')

let cooldownInterval = null

const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'

const avatarPresets = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
]

watch(() => authStore.currentUser, (val) => {
  if (val) {
    if (!name.value) name.value = val.name || ''
    if (!avatarUrl.value) avatarUrl.value = val.avatar_url || ''
    if (!phoneInput.value && val.phone) {
      phoneInput.value = val.phone.replace(/^62/, '')
    }
    if (val.phone_verified) {
      isOtpSuccess.value = true
    }
  }
}, { immediate: true })

function handleFileUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    errorMessage.value = 'Ukuran foto maksimal 2MB.'
    return
  }
  const reader = new FileReader()
  reader.onload = (event) => {
    avatarUrl.value = event.target.result
  }
  reader.readAsDataURL(file)
}

function startCooldown(seconds = 60) {
  otpCooldown.value = seconds
  if (cooldownInterval) clearInterval(cooldownInterval)
  cooldownInterval = setInterval(() => {
    if (otpCooldown.value > 0) {
      otpCooldown.value--
    } else {
      clearInterval(cooldownInterval)
    }
  }, 1000)
}

async function handleSendOtp() {
  errorMessage.value = ''
  successMessage.value = ''

  let cleanPhone = phoneInput.value.replace(/[^0-9]/g, '')
  if (cleanPhone.startsWith('0')) {
    cleanPhone = cleanPhone.substring(1)
  }
  if (cleanPhone.length < 8) {
    errorMessage.value = 'Silakan masukkan nomor WhatsApp yang valid.'
    return
  }

  isSendingOtp.value = true
  try {
    const fullPhone = '62' + cleanPhone
    const res = await authStore.sendOtp(fullPhone)
    if (res.success) {
      otpSent.value = true
      startCooldown(60)
      successMessage.value = res.message || 'Kode OTP 6-digit berhasil dikirim ke WhatsApp Anda!'
    } else {
      errorMessage.value = res.message || 'Gagal mengirim OTP ke nomor tersebut.'
    }
  } catch (err) {
    errorMessage.value = `Kesalahan: ${err.message}`
  } finally {
    isSendingOtp.value = false
  }
}

async function handleVerifyAndActivate() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!avatarUrl.value) {
    errorMessage.value = 'Silakan pilih atau upload Foto Profil Anda terlebih dahulu.'
    return
  }
  if (!name.value || name.value.trim().length < 3) {
    errorMessage.value = 'Nama lengkap minimal 3 karakter.'
    return
  }
  if (!otpCode.value || otpCode.value.trim().length < 6) {
    errorMessage.value = 'Masukkan 6 digit kode OTP yang Anda terima di WhatsApp.'
    return
  }

  isVerifying.value = true
  try {
    // 1. Simpan Foto Profil & Nama Lengkap
    await authStore.updateProfile({
      name: name.value.trim(),
      avatar_url: avatarUrl.value
    })

    // 2. Verifikasi Kode OTP
    const res = await authStore.verifyOtp(otpCode.value.trim())
    if (res.success) {
      isOtpSuccess.value = true
      successMessage.value = 'Selamat! Akun Anda telah aktif sepenuhnya. Mengalihkan ke dashboard...'
      setTimeout(() => {
        // Modal akan tertutup otomatis karena authStore.isProfileComplete menjadi true
      }, 1200)
    } else {
      errorMessage.value = res.message || 'Kode OTP tidak sesuai atau sudah kedaluwarsa.'
    }
  } catch (err) {
    errorMessage.value = `Gagal verifikasi: ${err.message}`
  } finally {
    isVerifying.value = false
  }
}

function handleLogout() {
  authStore.logout()
}
</script>
