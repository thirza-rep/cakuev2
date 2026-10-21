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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import Icon from '../common/Icon.vue'

const emit = defineEmits(['switch-view', 'go-onboarding'])
const authStore = useAuthStore()

const accountType = ref('business')
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

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
