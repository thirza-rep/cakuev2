<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
    <div class="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5">
      <!-- Header -->
      <div class="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
            <Icon name="building" custom-class="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-black text-slate-900 tracking-tight">Daftarkan Profil Usaha (Portal Bisnis)</h3>
            <p class="text-xs text-slate-500">Upgrade akun Anda untuk membuka modul kasir POS, stok barang, & multi-cabang.</p>
          </div>
        </div>
        <button 
          @click="$emit('close')" 
          type="button" 
          class="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Icon name="close" custom-class="w-4 h-4" />
        </button>
      </div>

      <!-- RBAC Notice Banner -->
      <div class="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-950">
        <Icon name="shield-check" custom-class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div class="space-y-0.5">
          <span class="font-bold">Otoritas RBAC Resmi:</span>
          <p class="text-[11px] text-emerald-800 leading-relaxed">
            Anda akan terdaftar sebagai <strong>Owner & Direktur Bisnis</strong> resmi. Pembukuan dompet pribadi Anda tetap tersimpan rapi dan terisolasi dari kas usaha.
          </p>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
        <Icon name="alert-circle" custom-class="w-4 h-4 shrink-0 mt-0.5" />
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Upgrade Form -->
      <form @submit.prevent="handleUpgrade" class="space-y-3.5">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Nama Usaha / Perusahaan <span class="text-rose-500">*</span></label>
          <input 
            v-model="companyName" 
            type="text" 
            required 
            placeholder="Contoh: Dapur Berkah Nusantara" 
            class="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Nama Cabang Pertama</label>
            <input 
              v-model="branchName" 
              type="text" 
              placeholder="Contoh: Cabang Utama" 
              class="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Kota / Domisili Usaha</label>
            <input 
              v-model="city" 
              type="text" 
              placeholder="Contoh: D.I. Yogyakarta" 
              class="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Alamat Operasional Cabang</label>
          <textarea 
            v-model="address" 
            rows="2" 
            placeholder="Contoh: Jl. Kaliurang KM 5 No. 12, Sleman" 
            class="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs resize-none"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp Usaha (Untuk Notifikasi)</label>
          <input 
            v-model="phone" 
            type="tel" 
            placeholder="0812-3456-7890" 
            class="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
          />
        </div>

        <!-- Action Buttons -->
        <div class="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button 
            type="submit" 
            :disabled="isLoading || !companyName.trim()"
            class="px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
          >
            <svg v-if="isLoading" class="animate-spin w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Mendaftarkan Usaha...' : 'Upgrade & Buka Portal ERP' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import Icon from '../common/Icon.vue'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'success'])
const authStore = useAuthStore()

const companyName = ref('')
const branchName = ref('')
const city = ref('')
const address = ref('')
const phone = ref(authStore.personalUser?.accountNumber?.startsWith('08') ? authStore.personalUser.accountNumber : '')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleUpgrade() {
  if (!companyName.value.trim()) return
  errorMessage.value = ''
  isLoading.value = true

  try {
    const res = await authStore.upgradeToBusiness({
      companyName: companyName.value.trim(),
      branchName: branchName.value.trim() || `Cabang Utama - ${companyName.value.trim()}`,
      city: city.value.trim(),
      address: address.value.trim(),
      phone: phone.value.trim()
    })

    if (res.success) {
      emit('success', res.user)
      emit('close')
    } else {
      errorMessage.value = res.message || 'Gagal upgrade ke akun bisnis.'
    }
  } catch (err) {
    errorMessage.value = `Terjadi kesalahan: ${err.message}`
  } finally {
    isLoading.value = false
  }
}
</script>
