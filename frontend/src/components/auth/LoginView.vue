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

        <!-- Error Message Banner -->
        <div v-if="errorMessage" class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
          <Icon name="alert-circle" custom-class="w-4 h-4 shrink-0 mt-0.5" />
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Form Email & Password -->
        <form @submit.prevent="handleSubmit" class="space-y-3.5">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input 
              v-model="email" 
              type="email" 
              required
              placeholder="admin@cakue.id atau budi.santoso@cakue.id" 
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
            :disabled="isLoading"
            class="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span v-if="isLoading">Menghubungkan ke Server...</span>
            <span v-else>Masuk ke Aplikasi</span>
          </button>
        </form>

        <!-- Quick Demo Profiles -->
        <div class="pt-4 border-t border-slate-100 space-y-2">
          <div class="text-[11px] font-semibold text-slate-500 text-center uppercase tracking-wide">Pilih Profil Akses Cepat:</div>
          <div class="grid grid-cols-2 gap-2">
            <button 
              @click="quickAccess('master')" 
              type="button"
              class="p-2.5 bg-purple-50/60 hover:bg-purple-100 border border-purple-200 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div class="flex items-center gap-1.5 font-bold text-xs text-purple-900">
                <Icon name="shield-check" custom-class="w-3.5 h-3.5 text-purple-700" />
                <span>Master Admin</span>
              </div>
              <div class="text-[10px] text-purple-700/80 mt-0.5">Owner (Akses Penuh 6 Cabang)</div>
            </button>

            <button 
              @click="quickAccess('dummy')" 
              type="button"
              class="p-2.5 bg-amber-50/60 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div class="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                <Icon name="user" custom-class="w-3.5 h-3.5 text-amber-700" />
                <span>Budi Santoso</span>
              </div>
              <div class="text-[10px] text-amber-700/80 mt-0.5">Akun Dummy / Demo</div>
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

        <!-- Server IP Indicator & Settings -->
        <div class="pt-3 border-t border-slate-100 text-center">
          <button 
            type="button"
            @click="showServerConfig = !showServerConfig"
            class="text-[11px] text-slate-400 hover:text-slate-600 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span class="w-2 h-2 rounded-full" :class="isServerOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'"></span>
            <span>Server: {{ currentServerUrl }}</span>
            <Icon name="settings" custom-class="w-3 h-3" />
          </button>

          <!-- Drawer Mini Konfigurasi Server -->
          <div v-if="showServerConfig" class="mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2">
            <div class="text-[11px] font-bold text-slate-700">Endpoint Server Mini PC:</div>
            <div class="flex gap-1.5">
              <input 
                v-model="customServerUrl" 
                type="text" 
                placeholder="http://192.168.1.13:3001" 
                class="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <button 
                type="button" 
                @click="saveServerUrl"
                class="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg"
              >
                Simpan
              </button>
            </div>
            <div class="flex gap-1 text-[10px] text-slate-500 flex-wrap">
              <span>Preset:</span>
              <button type="button" @click="customServerUrl = 'http://192.168.1.13:3001'" class="text-emerald-700 hover:underline">Wi-Fi Rumah</button>
              <span>•</span>
              <button type="button" @click="customServerUrl = 'http://100.88.200.16:3001'" class="text-emerald-700 hover:underline">Tailscale</button>
              <span>•</span>
              <button type="button" @click="customServerUrl = 'http://localhost:3001'" class="text-emerald-700 hover:underline">Localhost</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <ForgotPasswordModal :show="showForgotModal" @close="showForgotModal = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { getServerUrl, setServerUrl, checkServerHealth } from '../../api/client.js'
import Icon from '../common/Icon.vue'
import ForgotPasswordModal from './ForgotPasswordModal.vue'

const emit = defineEmits(['switch-view', 'go-onboarding'])
const authStore = useAuthStore()

const email = ref('admin@cakue.id')
const password = ref('admin123')
const errorMessage = ref('')
const isLoading = ref(false)
const showForgotModal = ref(false)
const showServerConfig = ref(false)
const currentServerUrl = ref('')
const customServerUrl = ref('')
const isServerOnline = ref(false)

onMounted(async () => {
  currentServerUrl.value = getServerUrl()
  customServerUrl.value = currentServerUrl.value
  const health = await checkServerHealth()
  isServerOnline.value = health.ok
})

async function handleSubmit() {
  errorMessage.value = ''
  isLoading.value = true
  try {
    const res = await authStore.login(email.value, password.value)
    if (!res.success) {
      errorMessage.value = res.message || 'Gagal masuk. Periksa kembali email dan kata sandi.'
    }
  } catch (err) {
    errorMessage.value = `Terjadi kesalahan: ${err.message}`
  } finally {
    isLoading.value = false
  }
}

async function quickAccess(mode) {
  errorMessage.value = ''
  if (mode === 'master') {
    email.value = 'admin@cakue.id'
    password.value = 'admin123'
  } else {
    email.value = 'budi.santoso@cakue.id'
    password.value = 'password123'
  }
  await handleSubmit()
}

function saveServerUrl() {
  setServerUrl(customServerUrl.value)
  currentServerUrl.value = getServerUrl()
  showServerConfig.value = false
  checkServerHealth().then(h => {
    isServerOnline.value = h.ok
  })
}
</script>
