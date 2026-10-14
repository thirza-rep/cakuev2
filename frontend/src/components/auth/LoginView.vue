<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
    <!-- Background Subtle Dots -->
    <div class="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

    <div class="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8 space-y-6">
      <!-- Brand Header -->
      <div class="text-center space-y-2">
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
        <h2 class="text-2xl font-bold tracking-tight text-slate-900">Masuk ke CAKUE</h2>
        <p class="text-xs text-slate-500">Catatan Keuangan Gue — Terpercaya, Bebas Biaya & Aman</p>
      </div>

      <!-- Google One-Click Login -->
      <div class="space-y-4">
        <button 
          @click="authStore.loginWithGoogle()"
          class="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 transition-all shadow-xs cursor-pointer"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Lanjutkan dengan Akun Google</span>
        </button>

        <div class="relative flex items-center justify-center py-1">
          <div class="border-t border-slate-200 w-full"></div>
          <span class="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">atau email</span>
        </div>

        <!-- Form Email & Password -->
        <form @submit.prevent="handleSubmit" class="space-y-3.5">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input 
              v-model="email" 
              type="email" 
              required
              placeholder="budi.santoso@cakue.id" 
              class="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-semibold text-slate-700">Kata Sandi</label>
              <button 
                type="button" 
                @click="showForgotModal = true" 
                class="text-[11px] text-emerald-700 hover:underline font-medium"
              >
                Lupa kata sandi?
              </button>
            </div>
            <input 
              v-model="password" 
              type="password" 
              required
              placeholder="••••••••" 
              class="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button 
            type="submit" 
            class="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Masuk ke Aplikasi
          </button>
        </form>

        <!-- Quick Demo Profiles -->
        <div class="pt-4 border-t border-slate-100 space-y-2">
          <div class="text-[11px] font-semibold text-slate-500 text-center uppercase tracking-wide">Pilih Mode Masuk Cepat:</div>
          <div class="grid grid-cols-2 gap-2">
            <button 
              @click="quickAccess('personal')" 
              class="p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div class="flex items-center gap-1.5 font-bold text-xs text-slate-800 group-hover:text-emerald-800">
                <Icon name="wallet" custom-class="w-3.5 h-3.5 text-emerald-700" />
                <span>Perorangan</span>
              </div>
              <div class="text-[10px] text-slate-500 mt-0.5">Catatan Keuangan Pribadi</div>
            </button>

            <button 
              @click="quickAccess('business')" 
              class="p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div class="flex items-center gap-1.5 font-bold text-xs text-slate-800 group-hover:text-emerald-800">
                <Icon name="store" custom-class="w-3.5 h-3.5 text-emerald-700" />
                <span>Usaha / UMKM</span>
              </div>
              <div class="text-[10px] text-slate-500 mt-0.5">SaaS POS & Multi-Cabang</div>
            </button>
          </div>
        </div>

        <!-- Switch to Register -->
        <div class="text-center pt-2 text-xs text-slate-500">
          Belum memiliki akun? 
          <button @click="$emit('switch-view', 'register')" class="text-emerald-700 font-bold hover:underline">
            Daftar Akun Baru
          </button>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <ForgotPasswordModal :show="showForgotModal" @close="showForgotModal = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import Icon from '../common/Icon.vue'
import ForgotPasswordModal from './ForgotPasswordModal.vue'

const emit = defineEmits(['switch-view', 'go-onboarding'])
const authStore = useAuthStore()

const email = ref('budi.santoso@cakue.id')
const password = ref('password123')
const showForgotModal = ref(false)

function handleSubmit() {
  if (email.value.includes('owner') || email.value.includes('cakuenusantara') || email.value.includes('bisnis') || email.value.includes('toko')) {
    authStore.loginAs('business')
  } else {
    authStore.loginAs('personal')
  }
}

function quickAccess(mode) {
  authStore.loginAs(mode)
}
</script>
