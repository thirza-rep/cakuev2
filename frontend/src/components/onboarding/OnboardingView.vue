<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white flex flex-col justify-between items-center relative overflow-hidden p-4 sm:p-8">
    <!-- Subtle Ambient Background -->
    <div class="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
    <div class="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Top Bar: Logo & Direct Action Buttons -->
    <div class="w-full max-w-2xl flex justify-between items-center relative z-20">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-center p-1">
          <img src="/logo.png" alt="CAKUE" class="w-full h-full object-contain" />
        </div>
        <span class="text-xs font-black tracking-wider text-slate-800 uppercase">CAKUE</span>
      </div>

      <div class="flex items-center gap-2">
        <button 
          @click="$emit('go-register')"
          type="button"
          class="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-slate-100"
        >
          Daftar Akun
        </button>
        <button 
          @click="handleSkip"
          type="button"
          class="text-xs font-bold text-emerald-800 hover:text-emerald-900 transition-colors cursor-pointer px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1"
          title="Masuk langsung ke akun Anda"
        >
          <span>Masuk</span>
          <Icon name="chevron-right" custom-class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- MAIN ONBOARDING CARD CONTAINER -->
    <main class="relative z-10 w-full max-w-xl my-auto py-4">
      <div class="bg-white border border-slate-200/90 rounded-3xl shadow-xl p-6 sm:p-10 text-center min-h-[440px] flex flex-col justify-between transition-all">
        
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

          <!-- Quick Action CTA: Langsung Masuk ke Login Akses -->
          <div class="pt-3 flex flex-col items-center gap-2 max-w-xs mx-auto">
            <button 
              @click="$emit('go-login')"
              type="button"
              class="w-full py-2.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Masuk ke Akun CAKUE</span>
              <Icon name="chevron-right" custom-class="w-4 h-4 text-white" />
            </button>
            
            <button 
              @click="$emit('go-register')"
              type="button"
              class="text-xs text-slate-500 hover:text-emerald-700 font-medium transition-colors cursor-pointer"
            >
              Belum memiliki akun? <span class="font-bold text-emerald-700 underline underline-offset-2">Daftar Akun Baru</span>
            </button>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- SLIDE FOOTER CONTROLS (SEBELUMNYA & LANJUT/MASUK) -->
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

          <!-- Tombol Lanjut / Masuk -->
          <button 
            v-if="currentSlide < totalSlides - 1"
            @click="nextSlide"
            type="button"
            class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1"
          >
            <span>Lanjut</span>
            <Icon name="chevron-right" custom-class="w-3.5 h-3.5 text-white" />
          </button>

          <button 
            v-else
            @click="handleSkip"
            type="button"
            class="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1"
          >
            <span>Masuk</span>
            <Icon name="chevron-right" custom-class="w-3.5 h-3.5 text-white" />
          </button>
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
import Icon from '../common/Icon.vue'

const emit = defineEmits(['go-login', 'go-register'])

const currentSlide = ref(0)
const totalSlides = 3

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
