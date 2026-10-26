<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
    <div class="relative w-full max-w-md p-6 bg-white border border-slate-200 rounded-2xl shadow-xl space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <Icon name="shield-check" custom-class="w-4.5 h-4.5 text-emerald-700" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900">Pemulihan Kata Sandi</h3>
            <p class="text-[11px] text-slate-500">Kirim tautan reset instan ke email Anda</p>
          </div>
        </div>
        <button 
          @click="$emit('close')" 
          type="button"
          class="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Icon name="close" custom-class="w-4 h-4" />
        </button>
      </div>

      <p class="text-xs text-slate-600 leading-relaxed">
        Masukkan alamat email terdaftar Anda. Tautan pemulihan kata sandi akan otomatis dikirimkan ke kotak masuk Gmail Anda melalui layanan <strong>Gmail SMTP Resmi</strong>.
      </p>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Email Terdaftar</label>
          <input 
            v-model="emailInput" 
            type="email" 
            placeholder="nama@gmail.com" 
            class="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all shadow-2xs placeholder:text-slate-400"
          />
        </div>

        <div v-if="successMsg" class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2 animate-fade-in">
          <Icon name="check" custom-class="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <strong>Berhasil Terkirim:</strong> Tautan pemulihan telah dikirim ke <u>{{ emailInput }}</u>. Silakan periksa folder inbox atau spam Gmail Anda.
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 pt-2">
        <button 
          @click="$emit('close')" 
          type="button"
          class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          Batal
        </button>
        <button 
          @click="handleSend" 
          type="button"
          :disabled="!emailInput || isSending"
          class="px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
        >
          <svg v-if="isSending" class="animate-spin w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isSending ? 'Mengirimkan...' : 'Kirim Tautan Reset' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Icon from '../common/Icon.vue'

const props = defineProps({
  show: Boolean
})
const emit = defineEmits(['close'])

const emailInput = ref('budi.santoso@gmail.com')
const isSending = ref(false)
const successMsg = ref(false)

function handleSend() {
  isSending.value = true
  setTimeout(() => {
    isSending.value = false
    successMsg.value = true
  }, 700)
}
</script>
