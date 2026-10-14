<template>
  <div v-if="show && order" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="relative w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
        <div class="flex items-center gap-2">
          <Icon name="check" custom-class="w-4 h-4 text-emerald-600" />
          <span class="text-xs font-bold text-slate-800">Bukti Pembayaran Transaksi</span>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 p-1">
          <Icon name="close" custom-class="w-4 h-4" />
        </button>
      </div>

      <!-- Thermal Paper Receipt Preview (58mm vs 80mm Adaptive) -->
      <div class="p-6 bg-slate-100/60 overflow-y-auto max-h-[60vh] flex justify-center">
        <div 
          :class="[
            'bg-white text-slate-900 p-5 rounded-lg border border-slate-200 shadow-sm font-mono text-[11px] leading-tight select-none transition-all',
            settingsStore.receiptSettings?.paperSize === '80mm' ? 'w-80 max-w-md' : 'w-64 max-w-xs'
          ]"
        >
          <!-- Receipt Header -->
          <div class="text-center pb-3 border-b border-dashed border-slate-300 space-y-1">
            <div v-if="settingsStore.receiptSettings?.showHeaderLogo && settingsStore.appLogo" class="w-10 h-10 mx-auto overflow-hidden">
              <img :src="settingsStore.appLogo" alt="Logo" class="w-full h-full object-contain" />
            </div>
            <div class="font-extrabold text-xs tracking-wider text-slate-900">{{ settingsStore.appName }} POS RETAIL</div>
            <div class="text-[10px] text-slate-500">{{ settingsStore.userAddress || order.branch }}</div>
            <div v-if="settingsStore.receiptSettings?.headerMessage" class="text-[9px] text-slate-400">
              {{ settingsStore.receiptSettings.headerMessage }}
            </div>
            <div class="text-[9px] text-slate-400">No: {{ order.id }} • {{ order.date }}</div>
          </div>

          <!-- Customer Info -->
          <div class="py-2 border-b border-dashed border-slate-200 text-[10px] space-y-0.5">
            <div class="flex justify-between">
              <span class="text-slate-500">Pelanggan:</span>
              <span class="font-bold text-slate-800">{{ order.customer }}</span>
            </div>
            <div v-if="order.phone && order.phone !== '-'" class="flex justify-between">
              <span class="text-slate-500">WhatsApp:</span>
              <span class="text-slate-800">{{ order.phone }}</span>
            </div>
            <div v-if="settingsStore.receiptSettings?.showCashierName && order.cashierName" class="flex justify-between">
              <span class="text-slate-500">Kasir:</span>
              <span class="text-slate-700">{{ order.cashierName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Metode Bayar:</span>
              <span class="font-bold text-slate-800">{{ order.paymentMethod }}</span>
            </div>
          </div>

          <!-- Items List -->
          <div class="py-3 border-b border-dashed border-slate-300 space-y-2">
            <div v-for="item in order.items" :key="item.id" class="space-y-0.5">
              <div class="font-bold text-slate-800">{{ item.name }}</div>
              <div class="flex justify-between text-slate-500">
                <span>{{ item.qty }}x @{{ formatNumber(item.price) }}</span>
                <span class="font-bold text-slate-900">Rp {{ formatNumber(item.price * item.qty) }}</span>
              </div>
            </div>
          </div>

          <!-- Financial Calculation -->
          <div class="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-slate-600">
            <div class="flex justify-between">
              <span>Subtotal:</span>
              <span>Rp {{ formatNumber(order.subtotal) }}</span>
            </div>
            <div v-if="order.tax > 0" class="flex justify-between">
              <span>PPN ({{ settingsStore.financialSettings?.taxRate || 11 }}%):</span>
              <span>Rp {{ formatNumber(order.tax) }}</span>
            </div>
            <div class="flex justify-between font-extrabold text-xs text-slate-900 pt-1 border-t border-slate-200">
              <span>TOTAL:</span>
              <span>Rp {{ formatNumber(order.total) }}</span>
            </div>
            <div v-if="order.paymentMethod === 'CASH'" class="flex justify-between pt-1 text-[10px]">
              <span>Uang Diterima:</span>
              <span>Rp {{ formatNumber(order.cashGiven) }}</span>
            </div>
            <div v-if="order.paymentMethod === 'CASH'" class="flex justify-between font-bold text-[10px]">
              <span>Kembalian:</span>
              <span>Rp {{ formatNumber(order.changeDue) }}</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="text-center pt-3 text-[9px] text-slate-400 space-y-1">
            <div class="text-[9px] text-slate-500 font-medium">
              {{ settingsStore.receiptSettings?.footerMessage || 'Terima kasih atas kunjungan Anda' }}
            </div>
            <div class="font-semibold text-slate-600">{{ settingsStore.appName }} — {{ settingsStore.appSubtitle }}</div>
            <div v-if="settingsStore.receiptSettings?.showQrCode" class="pt-1">
              <div class="w-12 h-12 mx-auto bg-slate-900 text-white flex items-center justify-center font-bold text-[8px] rounded">
                QR CODE
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions: Print Thermal & WhatsApp Direct Sender -->
      <div class="p-4 bg-white border-t border-slate-100 flex flex-col gap-2">
        <div class="grid grid-cols-2 gap-2">
          <!-- WhatsApp Receipt Sender -->
          <button 
            @click="sendWhatsAppReceipt"
            :disabled="!order.phone || order.phone === '-' || isSendingWa"
            class="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Icon name="share" custom-class="w-4 h-4" />
            <span>{{ isSendingWa ? 'Mengirim...' : 'Kirim via WA' }}</span>
          </button>

          <!-- Print Thermal Printer -->
          <button 
            @click="printReceipt"
            class="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-200 transition-all cursor-pointer"
          >
            <Icon name="printer" custom-class="w-4 h-4" />
            <span>Cetak Thermal</span>
          </button>
        </div>

        <!-- Sending Status Feedback -->
        <div v-if="waStatusMessage" :class="['text-center text-xs font-semibold py-1 rounded-lg', waStatusError ? 'text-rose-600 bg-rose-50' : 'text-emerald-700 bg-emerald-50']">
          {{ waStatusMessage }}
        </div>

        <button 
          @click="$emit('close')"
          class="w-full py-2.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          Tutup & Transaksi Baru
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '../../stores/settingsStore'
import Icon from '../common/Icon.vue'

const settingsStore = useSettingsStore()

const props = defineProps({
  show: Boolean,
  order: Object
})

const emit = defineEmits(['close'])

const isSendingWa = ref(false)
const waStatusMessage = ref('')
const waStatusError = ref(false)

function formatNumber(num) {
  return (num || 0).toLocaleString('id-ID')
}

async function sendWhatsAppReceipt() {
  if (!props.order || !props.order.phone) return
  
  isSendingWa.value = true
  waStatusMessage.value = 'Menghubungkan ke Baileys Gateway...'
  waStatusError.value = false

  try {
    // Coba kirim langsung melalui Baileys Gateway (port 3333)
    const response = await fetch('http://localhost:3333/api/send-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: props.order.phone,
        customerName: props.order.customer,
        orderId: props.order.id,
        subtotal: props.order.subtotal,
        tax: props.order.tax,
        total: props.order.total,
        paymentMethod: props.order.paymentMethod,
        branchName: props.order.branch,
        items: props.order.items
      })
    })

    const resData = await response.json()
    if (resData.success) {
      waStatusMessage.value = `✓ Struk berhasil terkirim ke WA ${props.order.phone} ($0 Cost)!`
      setTimeout(() => { waStatusMessage.value = '' }, 4000)
      return
    } else {
      throw new Error(resData.message)
    }
  } catch (err) {
    console.warn('[WA-DIRECT] Gateway lokal belum terhubung, membuka WhatsApp Web fallback...', err)
    waStatusMessage.value = 'Membuka WhatsApp Web...'
    
    // Fallback: Buka WhatsApp Web jika gateway belum pairing
    const text = `*CAKUE POS — BUKTI PEMBAYARAN RESMI*
Cabang: ${props.order.branch}
No. Transaksi: ${props.order.id}
Waktu: ${props.order.date}
Pelanggan: ${props.order.customer}
----------------------------------------
${props.order.items.map(i => `• ${i.name} (${i.qty}x) = Rp ${formatNumber(i.price * i.qty)}`).join('\n')}
----------------------------------------
Subtotal: Rp ${formatNumber(props.order.subtotal)}
PPN (11%): Rp ${formatNumber(props.order.tax)}
*TOTAL: Rp ${formatNumber(props.order.total)}*
Metode: ${props.order.paymentMethod}
----------------------------------------
Terima kasih telah berbelanja di CAKUE!`

    const encoded = encodeURIComponent(text)
    const phone = props.order.phone.replace(/^0/, '62').replace(/[^0-9]/g, '')
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`, '_blank')
    setTimeout(() => { waStatusMessage.value = '' }, 3000)
  } finally {
    isSendingWa.value = false
  }
}

function printReceipt() {
  window.print()
}
</script>
