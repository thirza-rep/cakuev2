<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
    <div class="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
      <!-- Header with Google Account Badge -->
      <div class="text-center space-y-3">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Google OAuth Terhubung</span>
        </div>

        <div class="flex items-center justify-center gap-3 pt-1">
          <img 
            :src="googleData?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'" 
            alt="Google Avatar"
            class="w-12 h-12 rounded-full border-2 border-emerald-500 shadow-sm object-cover" 
          />
          <div class="text-left">
            <h3 class="text-sm font-bold text-slate-900 leading-tight">{{ googleData?.name || 'Pengguna Baru' }}</h3>
            <p class="text-xs text-slate-500 font-mono">{{ googleData?.email || 'email@gmail.com' }}</p>
          </div>
        </div>

        <div>
          <h2 class="text-xl font-black text-slate-900 tracking-tight">Tentukan Kredensial Akun</h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Buat username dan kata sandi untuk keamanan ganda akun Anda di CAKUE.
          </p>
        </div>
      </div>

      <!-- Error Banner -->
      <div v-if="errorMessage" class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
        <Icon name="alert-circle" custom-class="w-4 h-4 shrink-0 mt-0.5" />
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Credential Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Username Field -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-xs font-bold text-slate-700">Username Akun</label>
            <span class="text-[10px] text-slate-400">Huruf, angka & underscore</span>
          </div>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-xs">@</span>
            <input 
              v-model="username"
              type="text"
              required
              maxlength="30"
              placeholder="contoh: budi_santoso"
              class="w-full pl-7 pr-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              @input="cleanUsernameInput"
            />
          </div>
          <p v-if="username && username.length < 3" class="text-[11px] text-amber-600 mt-1 font-medium">
            Username minimal 3 karakter.
          </p>
        </div>

        <!-- Password Field -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-xs font-bold text-slate-700">Kata Sandi</label>
            <button 
              type="button" 
              @click="showPassword = !showPassword" 
              class="text-[11px] text-emerald-700 font-semibold hover:underline"
            >
              {{ showPassword ? 'Sembunyikan' : 'Lihat' }}
            </button>
          </div>
          <input 
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="Minimal 6 karakter kombinasi huruf & angka"
            class="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
          />
        </div>

        <!-- Confirm Password Field -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Konfirmasi Kata Sandi</label>
          <input 
            v-model="confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="Ketik ulang kata sandi"
            class="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
          />
        </div>

        <!-- Password Requirement Checklist -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
          <div class="font-bold text-slate-700 mb-1">Syarat Kata Sandi:</div>
          <div class="flex items-center gap-1.5" :class="isLengthValid ? 'text-emerald-700 font-semibold' : 'text-slate-400'">
            <Icon :name="isLengthValid ? 'check' : 'circle'" custom-class="w-3.5 h-3.5 shrink-0" />
            <span>Minimal 6 karakter</span>
          </div>
          <div class="flex items-center gap-1.5" :class="hasLetter ? 'text-emerald-700 font-semibold' : 'text-slate-400'">
            <Icon :name="hasLetter ? 'check' : 'circle'" custom-class="w-3.5 h-3.5 shrink-0" />
            <span>Mengandung huruf (a-z, A-Z)</span>
          </div>
          <div class="flex items-center gap-1.5" :class="hasNumber ? 'text-emerald-700 font-semibold' : 'text-slate-400'">
            <Icon :name="hasNumber ? 'check' : 'circle'" custom-class="w-3.5 h-3.5 shrink-0" />
            <span>Mengandung angka (0-9)</span>
          </div>
          <div class="flex items-center gap-1.5" :class="isMatched ? 'text-emerald-700 font-semibold' : 'text-slate-400'">
            <Icon :name="isMatched ? 'check' : 'circle'" custom-class="w-3.5 h-3.5 shrink-0" />
            <span>Konfirmasi kata sandi cocok</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2 pt-2">
          <button 
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg v-if="isLoading" class="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="isLoading">Mendaftarkan Akun Anda...</span>
            <span v-else>Simpan & Lanjutkan ke Dashboard</span>
          </button>

          <button 
            type="button"
            @click="handleCancel"
            class="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Batal & Gunakan Akun Lain
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import Icon from '../common/Icon.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  googleData: {
    type: Object,
    default: () => null
  },
  accountType: {
    type: String,
    default: 'business'
  }
})

const emit = defineEmits(['close', 'success'])
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// Pre-fill username kandidat dari email pengguna
watch(() => props.googleData, (val) => {
  if (val?.email) {
    const raw = val.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase()
    username.value = raw
  }
}, { immediate: true })

function cleanUsernameInput() {
  username.value = username.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase()
}

// Validasi Password Realtime
const isLengthValid = computed(() => password.value.length >= 6)
const hasLetter = computed(() => /[A-Za-z]/.test(password.value))
const hasNumber = computed(() => /\d/.test(password.value))
const isMatched = computed(() => password.value.length > 0 && password.value === confirmPassword.value)

const isFormValid = computed(() => {
  return username.value.length >= 3 &&
    isLengthValid.value &&
    hasLetter.value &&
    hasNumber.value &&
    isMatched.value
})

async function handleSubmit() {
  if (!isFormValid.value) return
  errorMessage.value = ''
  isLoading.value = true

  try {
    const res = await authStore.registerWithGoogle({
      username: username.value,
      password: password.value,
      accountType: props.accountType || props.googleData?.account_type || 'business'
    })

    if (res.success) {
      emit('success', res.user)
      emit('close')
    } else {
      errorMessage.value = res.message || 'Gagal mendaftar akun. Silakan periksa kembali data Anda.'
    }
  } catch (err) {
    errorMessage.value = `Terjadi kesalahan: ${err.message}`
  } finally {
    isLoading.value = false
  }
}

function handleCancel() {
  emit('close')
}
</script>
