<template>
  <div v-if="authStore.showOnboarding" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md">
    <!-- Backdrop dismiss -->
    <div @click="authStore.showOnboarding = false" class="absolute inset-0"></div>

    <div class="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-fade-in">
      <!-- 1. Header Bar with Luxury Emerald Gradient Accent -->
      <div class="bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-800 p-4 sm:p-5 text-white flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-emerald-400/30 flex items-center justify-center font-black text-emerald-300 shadow-inner">
            <Icon name="sparkles" custom-class="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base font-black tracking-tight">Panduan Alur Sistem CAKUE</h2>
              <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-300/30 font-bold uppercase">
                TUTORIAL
              </span>
            </div>
            <p class="text-xs text-emerald-100/90">Eksplorasi fitur dompet pribadi, kasir POS & inventaris ERP</p>
          </div>
        </div>

        <button 
          @click="authStore.showOnboarding = false" 
          type="button" 
          class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Tutup"
        >
          <Icon name="close" custom-class="w-4 h-4" />
        </button>
      </div>

      <!-- 2. Slide Content -->
      <div class="p-6 sm:p-8 flex-1 min-h-[350px] flex flex-col justify-between space-y-6">
        <!-- Slide 1: Dua Dunia Terpisah -->
        <div v-if="currentSlide === 0" class="space-y-5 animate-fade-in">
          <div class="flex justify-center">
            <div class="grid grid-cols-2 gap-3 text-center max-w-sm w-full">
              <div class="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-300/80 shadow-xs">
                <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 shadow-xs">
                  <Icon name="wallet" custom-class="w-5 h-5" />
                </div>
                <div class="font-extrabold text-xs text-slate-900">Perorangan</div>
                <div class="text-[10px] text-emerald-800 font-medium mt-0.5">Mobile Banking Style</div>
              </div>

              <div class="p-4 bg-teal-50/80 rounded-2xl border border-teal-300/80 shadow-xs">
                <div class="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center mx-auto mb-2 shadow-xs">
                  <Icon name="store" custom-class="w-5 h-5" />
                </div>
                <div class="font-extrabold text-xs text-slate-900">Usaha / UMKM</div>
                <div class="text-[10px] text-teal-800 font-medium mt-0.5">SaaS ERP & POS</div>
              </div>
            </div>
          </div>

          <div class="text-center space-y-2">
            <h3 class="text-lg sm:text-xl font-black text-slate-900">Pemisahan Mutlak Sesuai Kebutuhan</h3>
            <p class="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Gunakan mode <strong>Perorangan</strong> untuk mengelola rekening, tabungan, dan mutasi harian pribadi. Beralih ke mode <strong>Usaha UMKM</strong> saat menjalankan kasir POS, stok cabang, dan aset toko.
            </p>
          </div>
        </div>

        <!-- Slide 2: Nol Selisih Stok & Multi-Cabang -->
        <div v-if="currentSlide === 1" class="space-y-5 animate-fade-in">
          <div class="flex justify-center">
            <div class="w-full max-w-sm p-4 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs space-y-2 shadow-xs">
              <div class="flex items-center justify-between pb-2 border-b border-slate-200 text-slate-600">
                <span class="font-medium">Gudang Pusat (Central Hub)</span>
                <span class="font-bold text-slate-900 font-mono">250 Pcs</span>
              </div>
              <div class="flex items-center justify-center gap-2 py-1.5 text-teal-700 font-bold text-[11px] bg-teal-50/60 rounded-lg">
                <Icon name="truck" custom-class="w-4 h-4 text-teal-600" />
                <span>Surat Jalan (In-Transit): 25 Pcs</span>
              </div>
              <div class="flex items-center justify-between pt-2 border-t border-slate-200 text-slate-600">
                <span class="font-medium">Cabang Jakarta Selatan</span>
                <span class="font-bold text-emerald-700 font-mono">+25 Pcs (Real-time)</span>
              </div>
            </div>
          </div>

          <div class="text-center space-y-2">
            <h3 class="text-lg sm:text-xl font-black text-slate-900">Perhitungan Presisi & Nol Selisih</h3>
            <p class="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Pencatatan mutasi stok dan kas menerapkan kaidah <strong>Inventory Movement Ledger</strong> dan <strong>Double-Entry Bookkeeping</strong> deterministik seimbang tanpa risiko human error.
            </p>
          </div>
        </div>

        <!-- Slide 3: Struk WhatsApp $0 Cost & AI Finansial -->
        <div v-if="currentSlide === 2" class="space-y-5 animate-fade-in">
          <div class="flex justify-center">
            <div class="w-full max-w-sm p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-2.5 shadow-xs">
              <div class="flex items-center gap-2 text-xs font-black text-emerald-950">
                <div class="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Icon name="sparkles" custom-class="w-4 h-4" />
                </div>
                <span>Struk WhatsApp & AI Copilot</span>
              </div>
              <p class="text-[11px] text-emerald-900/90 leading-relaxed">
                Struk kasir dikirim otomatis ke nomor pembeli via Baileys WhatsApp Gateway lokal secara instan. Asisten AI membaca data mutasi untuk mendeteksi stok tipis dan analisis margin laba kotor.
              </p>
            </div>
          </div>

          <div class="text-center space-y-2">
            <h3 class="text-lg sm:text-xl font-black text-slate-900">Kecerdasan Buatan & Otomasi Finansial</h3>
            <p class="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Seluruh sistem berjalan di server lokal Anda sendiri (PostgreSQL 16 @ CasaOS) dengan integritas data aman secara mandiri dan efisien.
            </p>
          </div>
        </div>

        <!-- 3. Navigation Controls -->
        <div class="flex items-center justify-between pt-4 border-t border-slate-100">
          <!-- Step Dots -->
          <div class="flex items-center gap-1.5">
            <button 
              v-for="idx in 3" 
              :key="idx" 
              @click="currentSlide = idx - 1"
              type="button"
              :class="['h-2 rounded-full transition-all duration-300 cursor-pointer', currentSlide === idx - 1 ? 'w-8 bg-emerald-700' : 'w-2 bg-slate-300 hover:bg-slate-400']"
            ></button>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <button 
              v-if="currentSlide < 2" 
              @click="authStore.showOnboarding = false" 
              type="button"
              class="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Lewati
            </button>
            <button 
              v-if="currentSlide < 2" 
              @click="currentSlide++" 
              type="button"
              class="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span>Lanjut</span>
              <Icon name="chevron-right" custom-class="w-3.5 h-3.5" />
            </button>
            <button 
              v-else 
              @click="authStore.showOnboarding = false" 
              type="button"
              class="px-6 py-2.5 text-xs font-black text-white bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Icon name="check" custom-class="w-4 h-4 text-emerald-200" />
              <span>Selesai & Lanjut Bekerja</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import Icon from '../common/Icon.vue'

const authStore = useAuthStore()
const currentSlide = ref(0)
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.25s ease-out;
}
</style>
