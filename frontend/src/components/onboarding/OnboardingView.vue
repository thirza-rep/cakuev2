<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white flex flex-col justify-between items-center relative overflow-hidden p-4 sm:p-8">
    <!-- Subtle Ambient Background -->
    <div class="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
    <div class="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Discreet Skip / Direct Login Button (Pojok Kanan Atas) -->
    <div class="w-full max-w-2xl flex justify-between items-center relative z-20">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-center p-1">
          <img src="/logo.png" alt="CAKUE" class="w-full h-full object-contain" />
        </div>
        <span class="text-xs font-black tracking-wider text-slate-800 uppercase">CAKUE</span>
      </div>

      <button 
        @click="handleSkip"
        type="button"
        class="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-slate-200/50 flex items-center gap-1"
        title="Masuk langsung jika sudah memiliki akun"
      >
        <span>Masuk Akun</span>
        <Icon name="chevron-right" custom-class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- MAIN ONBOARDING CARD CONTAINER -->
    <main class="relative z-10 w-full max-w-xl my-auto py-4">
      <div class="bg-white border border-slate-200/90 rounded-3xl shadow-xl p-6 sm:p-10 text-center min-h-[460px] flex flex-col justify-between transition-all">
        
        <!-- ============================================== -->
        <!-- SLIDE 1: FOKUS LOGO ANIMASI & NAMA BRAND -->
        <!-- ============================================== -->
        <div v-if="currentSlide === 0" class="my-auto space-y-6 animate-fade-in">
          <div class="relative inline-flex items-center justify-center">
            <div class="absolute inset-0 rounded-3xl bg-emerald-400/30 blur-xl animate-pulse"></div>
            
            <div class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-emerald-600/20 overflow-hidden flex items-center justify-center p-2.5 animate-logo-pop">
              <img src="/logo.png" alt="CAKUE Logo" class="w-full h-full object-contain" />
            </div>
          </div>

          <div class="space-y-2">
            <h1 class="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
              CAKUE
            </h1>
            <p class="text-sm sm:text-base font-bold text-emerald-700 tracking-wide">
              Catatan Keuangan Gue
            </p>
          </div>

          <p class="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
            Satu aplikasi cerdas untuk mengelola dompet pribadi dan pembukuan usaha Anda secara rapi dan presisi.
          </p>
        </div>

        <!-- ============================================== -->
        <!-- SLIDE 2: FITUR UTAMA 1 - DUA PORTAL TERPISAH -->
        <!-- ============================================== -->
        <div v-else-if="currentSlide === 1" class="my-auto space-y-5 animate-fade-in">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold mx-auto">
            <img src="/logo.png" alt="CAKUE" class="w-4 h-4 object-contain" />
            <span>CAKUE</span>
          </div>

          <div class="flex items-center justify-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
              <Icon name="wallet" custom-class="w-8 h-8" />
            </div>
            <div class="text-slate-300 font-bold text-lg">+</div>
            <div class="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-xs">
              <Icon name="store" custom-class="w-8 h-8" />
            </div>
          </div>

          <div class="space-y-2 max-w-md mx-auto">
            <span class="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Dua Dunia Finansial
            </span>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pemisahan Kas Mutlak
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              Keuangan belanja pribadi bergaya <strong>Mobile Banking</strong>, dan keuangan toko bergaya <strong>SaaS ERP</strong>. Nol risiko uang pribadi dan usaha tercampur.
            </p>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- SLIDE 3: FITUR UTAMA 2 - KASIR POS & STRUK WA -->
        <!-- ============================================== -->
        <div v-else-if="currentSlide === 2" class="my-auto space-y-5 animate-fade-in">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold mx-auto">
            <img src="/logo.png" alt="CAKUE" class="w-4 h-4 object-contain" />
            <span>CAKUE</span>
          </div>

          <div class="flex items-center justify-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-xs">
              <Icon name="receipt" custom-class="w-8 h-8" />
            </div>
            <div class="text-slate-300 font-bold text-lg">+</div>
            <div class="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
              <Icon name="share" custom-class="w-8 h-8" />
            </div>
          </div>

          <div class="space-y-2 max-w-md mx-auto">
            <span class="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Bebas Biaya Langganan ($0 Cost)
            </span>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Kasir POS & Struk WhatsApp
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              Catat penjualan ritel secara cepat, dan kirim bukti struk langsung ke nomor WhatsApp pembeli tanpa biaya langganan bulanan.
            </p>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- SLIDE 4: PILIH JENIS AKSES & GOOGLE OAUTH FIRST -->
        <!-- ============================================== -->
        <div v-else-if="currentSlide === 3" class="my-auto space-y-5 animate-fade-in text-left">
          
          <div class="text-center space-y-1">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold mx-auto mb-1">
              <img src="/logo.png" alt="CAKUE" class="w-4 h-4 object-contain" />
              <span>CAKUE</span>
            </div>

            <div>
              <span class="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Langkah 1: Tentukan Dunia Akses Anda
              </span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pilih Jenis Penggunaan
            </h2>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">
              Pilih mode utama yang ingin Anda gunakan, lalu lanjutkan dengan akun Google.
            </p>
          </div>

          <!-- Pilihan Jenis Akses: Personal vs ERP -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <!-- Pilihan 1: Keuangan Pribadi -->
            <button 
              type="button"
              @click="selectedAccountType = 'personal'"
              :class="[
                'p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden',
                selectedAccountType === 'personal' 
                  ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500 shadow-sm' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              ]"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Icon name="wallet" custom-class="w-5 h-5" />
                </div>
                <div v-if="selectedAccountType === 'personal'" class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Icon name="check" custom-class="w-3 h-3" />
                </div>
              </div>
              <div class="text-xs font-black text-slate-900">Catat Keuangan Pribadi</div>
              <div class="text-[11px] text-slate-500 mt-1 leading-snug">
                Mobile Banking style: kas dompet, mutasi transfer, pos tabungan & budget bulanan.
              </div>
            </button>

            <!-- Pilihan 2: ERP & Kasir Toko -->
            <button 
              type="button"
              @click="selectedAccountType = 'business'"
              :class="[
                'p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden',
                selectedAccountType === 'business' 
                  ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500 shadow-sm' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              ]"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <Icon name="store" custom-class="w-5 h-5" />
                </div>
                <div v-if="selectedAccountType === 'business'" class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Icon name="check" custom-class="w-3 h-3" />
                </div>
              </div>
              <div class="text-xs font-black text-slate-900">SaaS ERP & Kasir Usaha</div>
              <div class="text-[11px] text-slate-500 mt-1 leading-snug">
                Sistem kasir POS, stok inventaris multi-cabang, laba rugi & kirim struk WhatsApp.
              </div>
            </button>
          </div>

          <!-- Error Message Banner -->
          <div v-if="errorMessage" class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
            <Icon name="alert-circle" custom-class="w-4 h-4 shrink-0 mt-0.5" />
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Action Container: Google OAuth Primary Button -->
          <div class="space-y-3 pt-2 text-center">
            <button 
              @click="handleGoogleSignIn"
              type="button"
              :disabled="isGoogleLoading"
              class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 border-2 border-emerald-600/40 hover:border-emerald-600 rounded-xl text-xs sm:text-sm font-bold text-slate-800 transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
            >
              <svg v-if="!isGoogleLoading" class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <svg v-else class="animate-spin w-5 h-5 text-emerald-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="isGoogleLoading">Menghubungkan ke Google...</span>
              <span v-else>
                Lanjutkan dengan Akun Google ({{ selectedAccountType === 'personal' ? 'Pribadi' : 'ERP Usaha' }})
              </span>
            </button>

            <!-- Secondary Login Options -->
            <div class="flex items-center justify-center gap-4 text-xs pt-1">
              <button 
                type="button" 
                @click="$emit('go-login')"
                class="text-slate-600 hover:text-emerald-700 font-bold transition-colors cursor-pointer"
              >
                Sudah punya akun? Masuk
              </button>
              <span class="text-slate-300">•</span>
              <button 
                type="button" 
                @click="$emit('go-register')"
                class="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Daftar Manual
              </button>
            </div>
          </div>

        </div>

        <!-- ============================================== -->
        <!-- SLIDE FOOTER CONTROLS (SEBELUMNYA & LANJUT) -->
        <!-- ============================================== -->
        <div class="pt-5 border-t border-slate-100 flex items-center justify-between mt-5">
          <!-- Tombol Sebelumnya -->
          <button 
            @click="prevSlide"
            :disabled="currentSlide === 0"
            type="button"
            class="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 disabled:opacity-0 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1"
          >
            <Icon name="chevron-left" custom-class="w-3.5 h-3.5" />
            <span>Sebelumnya</span>
          </button>

          <!-- Step Dots -->
          <div class="flex items-center gap-2">
            <button 
              v-for="idx in totalSlides" 
              :key="idx" 
              @click="currentSlide = idx - 1"
              type="button"
              :class="[
                'h-2 rounded-full transition-all duration-300 cursor-pointer',
                currentSlide === idx - 1 ? 'w-6 bg-emerald-700' : 'w-2 bg-slate-200 hover:bg-slate-300'
              ]"
              :title="`Buka Slide ${idx}`"
            ></button>
          </div>

          <!-- Tombol Lanjut -->
          <button 
            v-if="currentSlide < totalSlides - 1"
            @click="nextSlide"
            type="button"
            class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1"
          >
            <span>Lanjut</span>
            <Icon name="chevron-right" custom-class="w-3.5 h-3.5 text-white" />
          </button>

          <div v-else class="w-16"></div>
        </div>

      </div>
    </main>

    <!-- Modal Kredensial (Username & Password) untuk User Baru dari Google OAuth -->
    <GoogleCredentialModal 
      :is-open="showCredentialModal"
      :google-data="pendingGoogleUser"
      :account-type="selectedAccountType"
      @close="showCredentialModal = false"
      @success="handleRegistrationSuccess"
    />

    <!-- Modal Peringatan Authorized Origins Google -->
    <div v-if="showOriginModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div class="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-4">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Icon name="alert-triangle" custom-class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900">Konfigurasi Domain Google OAuth</h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Domain saat ini belum didaftarkan di Google Cloud Console.
            </p>
          </div>
        </div>

        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
          <div class="font-bold text-slate-700">Origin Saat Ini:</div>
          <div class="flex items-center justify-between gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <code class="text-xs font-mono text-emerald-800 font-bold truncate">{{ detectedOrigin }}</code>
            <button 
              type="button" 
              @click="copyOrigin(detectedOrigin)"
              class="px-2.5 py-1 bg-slate-900 text-white rounded-md font-bold text-[10px]"
            >
              {{ copiedOrigin ? 'Tersalin' : 'Salin' }}
            </button>
          </div>
        </div>

        <div class="pt-2 flex justify-end gap-2">
          <button 
            type="button" 
            @click="showOriginModal = false"
            class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- Subtle Footer Attribution -->
    <div class="relative z-10 text-center text-[11px] text-slate-400 pb-2">
      <span>CAKUE • Platform Keuangan & Manajemen Bisnis Modern</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import Icon from '../common/Icon.vue'
import GoogleCredentialModal from '../auth/GoogleCredentialModal.vue'

const emit = defineEmits(['go-login', 'go-register'])
const authStore = useAuthStore()

const currentSlide = ref(0)
const totalSlides = 4
const selectedAccountType = ref('personal')
const isGoogleLoading = ref(false)
const errorMessage = ref('')
const showCredentialModal = ref(false)
const pendingGoogleUser = ref(null)

const showOriginModal = ref(false)
const detectedOrigin = ref(typeof window !== 'undefined' ? window.location.origin : 'https://cakue.codevits.site')
const copiedOrigin = ref(false)

function nextSlide() {
  if (currentSlide.value < totalSlides - 1) {
    currentSlide.value++
  }
}

function prevSlide() {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

function handleSkip() {
  emit('go-login')
}

async function handleGoogleSignIn() {
  errorMessage.value = ''
  isGoogleLoading.value = true

  try {
    const res = await authStore.loginWithGoogle(null, {
      accountTypeTarget: selectedAccountType.value,
      roleTarget: selectedAccountType.value === 'personal' ? 'personal' : 'owner',
      branchIdTarget: 'jogja-1'
    })

    if (res.success) {
      if (res.is_new) {
        // User baru: Buka modal untuk setup Username dan Kata Sandi
        pendingGoogleUser.value = res.google_data
        showCredentialModal.value = true
      }
      // Jika res.is_new === false, loginWithGoogle sudah otomatis login dan redirect ke dashboard di App.vue
    } else {
      if (res.needsOriginWhitelist) {
        showOriginModal.value = true
      } else {
        errorMessage.value = res.message || 'Login dengan Google dibatalkan atau gagal.'
      }
    }
  } catch (err) {
    errorMessage.value = `Terjadi kesalahan saat menghubungkan Google: ${err.message}`
  } finally {
    isGoogleLoading.value = false
  }
}

function handleRegistrationSuccess(user) {
  showCredentialModal.value = false
  // User otomatis terotentikasi dan diarahkan ke App.vue dashboard
}

async function copyOrigin(text) {
  try {
    await navigator.clipboard.writeText(text)
    copiedOrigin.value = true
    setTimeout(() => { copiedOrigin.value = false }, 2000)
  } catch (e) {}
}

// Keyboard Navigation
function handleKeydown(e) {
  if (showCredentialModal.value || showOriginModal.value) return
  if (e.key === 'ArrowRight') {
    nextSlide()
  } else if (e.key === 'ArrowLeft') {
    prevSlide()
  } else if (e.key === 'Escape') {
    handleSkip()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  if (typeof window !== 'undefined') {
    detectedOrigin.value = window.location.origin
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes logoPop {
  0% { transform: scale(0.92); }
  50% { transform: scale(1.04); }
  100% { transform: scale(1); }
}

.animate-fade-in {
  animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-logo-pop {
  animation: logoPop 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
