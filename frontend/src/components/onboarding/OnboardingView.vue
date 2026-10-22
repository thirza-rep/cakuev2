<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white flex flex-col justify-between items-center relative overflow-hidden p-4 sm:p-8">
    <!-- Subtle Ambient Background (Clean & Light) -->
    <div class="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
    <div class="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Discreet Skip Button (Pojok Kanan Atas - Tanpa Navbar Rapat) -->
    <div class="w-full max-w-2xl flex justify-end relative z-20">
      <button 
        @click="handleSkip"
        type="button"
        class="text-xs font-semibold text-slate-400 hover:text-slate-800 transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-slate-200/50 flex items-center gap-1"
        title="Lewati pengenalan dan langsung ke aplikasi"
      >
        <span>Lewati</span>
        <Icon name="chevron-right" custom-class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- MAIN ONBOARDING CARD CONTAINER (Spacious, Minimalist, Light Mode) -->
    <main class="relative z-10 w-full max-w-xl my-auto py-6">
      <div class="bg-white border border-slate-200/90 rounded-3xl shadow-xl p-8 sm:p-12 text-center min-h-[440px] flex flex-col justify-between transition-all">
        
        <!-- ============================================== -->
        <!-- SLIDE 1: FOKUS LOGO ANIMASI & NAMA BRAND -->
        <!-- ============================================== -->
        <div v-if="currentSlide === 0" class="my-auto space-y-6 animate-fade-in">
          <!-- Animated Logo Badge -->
          <div class="relative inline-flex items-center justify-center">
            <!-- Pulsing Halo Accent -->
            <div class="absolute inset-0 rounded-3xl bg-emerald-400/30 blur-xl animate-pulse"></div>
            
            <div class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-emerald-600/20 overflow-hidden flex items-center justify-center p-2.5 animate-logo-pop">
              <img src="/logo.png" alt="CAKUE Logo" class="w-full h-full object-contain" />
            </div>
          </div>

          <!-- Brand Typography -->
          <div class="space-y-2">
            <h1 class="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
              CAKUE
            </h1>
            <p class="text-sm sm:text-base font-bold text-emerald-700 tracking-wide">
              Catatan Keuangan Gue
            </p>
          </div>

          <!-- Short Crisp Intro -->
          <p class="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
            Satu aplikasi cerdas untuk mengelola dompet pribadi dan pembukuan usaha Anda secara rapi dan presisi.
          </p>
        </div>

        <!-- ============================================== -->
        <!-- SLIDE 2: FITUR UTAMA 1 - DUA PORTAL TERPISAH -->
        <!-- ============================================== -->
        <div v-else-if="currentSlide === 1" class="my-auto space-y-6 animate-fade-in">
          <!-- Icon Illustration (Pribadi & Bisnis) -->
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
              Keuangan belanja pribadi bergaya <strong>Mobile Banking</strong>, dan keuangan toko bergaya <strong>SaaS ERP</strong>. Nol risiko uang tercampur aduk.
            </p>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- SLIDE 3: FITUR UTAMA 2 - KASIR POS & STRUK WA -->
        <!-- ============================================== -->
        <div v-else-if="currentSlide === 2" class="my-auto space-y-6 animate-fade-in">
          <!-- Icon Illustration -->
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
        <!-- SLIDE 4: SIAP MULAI - PILIH JALUR MASUK -->
        <!-- ============================================== -->
        <div v-else-if="currentSlide === 3" class="my-auto space-y-6 animate-fade-in">
          <div class="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
            <Icon name="check" custom-class="w-8 h-8" stroke-width="2.5" />
          </div>

          <div class="space-y-1 max-w-md mx-auto">
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Siap Memulai?
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mulai pembukuan tertib dan nikmati kemudahan mencatat keuangan sekarang juga.
            </p>
          </div>

          <!-- Clean Action Buttons -->
          <div class="space-y-2.5 max-w-xs mx-auto pt-2">
            <button 
              @click="$emit('go-login')"
              type="button"
              class="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Masuk ke Akun Anda
            </button>

            <button 
              @click="$emit('go-register')"
              type="button"
              class="w-full py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Daftar Akun Baru (Bebas Biaya)
            </button>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- SLIDE FOOTER CONTROLS (SEBELUMNYA & LANJUT) -->
        <!-- ============================================== -->
        <div class="pt-6 border-t border-slate-100 flex items-center justify-between mt-6">
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

          <!-- Placeholder to maintain flex space on slide 4 -->
          <div v-else class="w-16"></div>
        </div>

      </div>
    </main>

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

const emit = defineEmits(['go-login', 'go-register'])
const authStore = useAuthStore()

const currentSlide = ref(0)
const totalSlides = 4

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

// Keyboard Navigation
function handleKeydown(e) {
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
