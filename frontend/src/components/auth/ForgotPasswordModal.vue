<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
    <div class="relative w-full max-w-md p-6 bg-white border border-slate-200 rounded-2xl shadow-xl space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div class="flex items-center gap-2">
          <Icon name="shield-check" custom-class="w-5 h-5 text-emerald-700" />
          <h3 class="text-sm font-bold text-slate-900">Pemulihan Kata Sandi</h3>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 p-1">
          <Icon name="close" custom-class="w-4 h-4" />
        </button>
      </div>

      <p class="text-xs text-slate-600 leading-relaxed">
        Masukkan alamat email terdaftar Anda. Tautan pemulihan kata sandi akan otomatis dikirimkan ke kotak masuk Gmail Anda melalui layanan <strong>Gmail SMTP (Nodemailer 100% Gratis)</strong>.
      </p>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Email Terdaftar</label>
          <input 
            v-model="emailInput" 
            type="email" 
            placeholder="nama@gmail.com" 
            class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div v-if="successMsg" class="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
          <Icon name="check" custom-class="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <strong>Berhasil Terkirim:</strong> Tautan pemulihan telah dikirim ke <u>{{ emailInput }}</u>. Silakan periksa folder inbox atau spam Gmail Anda.
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 pt-2">
        <button @click="$emit('close')" class="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800">
          Batal
        </button>
        <button 
          @click="handleSend" 
          :disabled="!emailInput || isSending"
          class="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 rounded-lg shadow-xs transition-all cursor-pointer"
        >
          {{ isSending ? 'Mengirimkan...' : 'Kirim Tautan Reset' }}
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
