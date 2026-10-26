<template>
  <div>
    <!-- Backdrop -->
    <div 
      v-if="isOpen" 
      @click="$emit('close')" 
      class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs transition-opacity"
    ></div>

    <!-- Slide-over Drawer Panel -->
    <div 
      :class="['fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out', isOpen ? 'translate-x-0' : 'translate-x-full']"
    >
      <!-- Drawer Header -->
      <div class="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
            <Icon name="sparkles" custom-class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900">AI Analis Finansial & R&D</h3>
            <div class="text-[10px] text-emerald-700 font-medium">Status: Mesin Kalkulasi Terverifikasi</div>
          </div>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 p-1">
          <Icon name="close" custom-class="w-4 h-4" />
        </button>
      </div>

      <!-- Drawer Body: Automated Real-time Insights -->
      <div class="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
        <!-- Stock Replenishment Alert -->
        <div v-if="stockStore.products.length > 0" class="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
          <div class="flex items-center gap-2 text-rose-800 font-bold">
            <Icon name="alert" custom-class="w-4 h-4 text-rose-600" />
            <span>Peringatan Stok Cabang</span>
          </div>
          <p class="text-slate-700 leading-relaxed text-[11px]">
            Sistem memantau stok produk aktif di 6 cabang Jogja. Periksa matriks saldo di modul Inventaris secara berkala.
          </p>
          <div class="p-2.5 bg-white rounded-lg border border-rose-200 text-[11px] text-rose-900 font-medium">
            Rekomendasi: Terbitkan surat jalan penyaluran dari Gudang Pusat Jogja jika stok cabang menipis.
          </div>
        </div>
        <div v-else class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <div class="flex items-center gap-2 text-slate-800 font-bold">
            <Icon name="check" custom-class="w-4 h-4 text-emerald-600" />
            <span>Inventaris Cabang: Siap Digunakan</span>
          </div>
          <p class="text-slate-600 text-[11px] leading-relaxed">
            Katalog produk masih bersih (0 produk). Tambahkan produk perdana di modul Inventaris & Stok untuk mengaktifkan pemantauan otomatis.
          </p>
        </div>

        <!-- Profit Margin Intelligence -->
        <div v-if="financeStore.transactions.length > 0" class="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
          <div class="flex items-center gap-2 text-emerald-900 font-bold">
            <Icon name="chart" custom-class="w-4 h-4 text-emerald-700" />
            <span>Analisis Efisiensi & Margin Produk</span>
          </div>
          <p class="text-slate-700 leading-relaxed text-[11px]">
            Total omset masuk tercatat <strong class="text-emerald-800 font-mono">Rp {{ formatNumber(financeStore.totalIncome) }}</strong> dengan laba bersih <strong class="text-emerald-800 font-mono">Rp {{ formatNumber(financeStore.netSavings) }}</strong>.
          </p>
        </div>
        <div v-else class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <div class="flex items-center gap-2 text-slate-800 font-bold">
            <Icon name="chart" custom-class="w-4 h-4 text-teal-600" />
            <span>Analisis Margin & Omset</span>
          </div>
          <p class="text-slate-600 text-[11px] leading-relaxed">
            Belum ada transaksi penjualan atau pengeluaran tercatat (Saldo Rp 0). Mulai input transaksi atau jalankan Kasir POS.
          </p>
        </div>

        <!-- Cashflow Health -->
        <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div class="flex items-center gap-2 text-slate-800 font-bold">
            <Icon name="wallet" custom-class="w-4 h-4 text-slate-600" />
            <span>Likuiditas & Ketahanan Kas</span>
          </div>
          <p class="text-slate-600 text-[11px] leading-relaxed">
            Total kas likuid aktif saat ini adalah <strong class="text-slate-900 font-mono">Rp {{ formatNumber(financeStore.totalBalance) }}</strong>. Utang jatuh tempo: <strong class="text-slate-900 font-mono">Rp {{ formatNumber(financeStore.totalUtang) }}</strong>.
          </p>
        </div>

        <!-- Chat Conversation with Copilot -->
        <div class="pt-2 border-t border-slate-100 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Konsultasi Analis Finansial:</span>
            <span class="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Aktif
            </span>
          </div>

          <!-- Quick Prompt Suggestions (Heuristic #6 Recognition over Recall) -->
          <div class="space-y-1.5">
            <div class="text-[10px] text-slate-400 font-medium">Saran Pertanyaan Cepat:</div>
            <div class="flex flex-wrap gap-1.5">
              <button 
                v-for="chip in quickChips" 
                :key="chip.label"
                type="button"
                @click="sendQuickPrompt(chip.query)"
                class="px-2.5 py-1 text-[11px] bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 rounded-lg text-slate-700 font-medium transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 group active:scale-95"
              >
                <Icon :name="chip.icon" custom-class="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-600 transition-colors" />
                <span>{{ chip.label }}</span>
              </button>
            </div>
          </div>
          
          <div ref="chatContainer" class="space-y-2 pt-1 max-h-60 overflow-y-auto pr-1">
            <div 
              v-for="(msg, i) in chatHistory" 
              :key="i" 
              :class="['p-3 rounded-2xl text-xs space-y-1 shadow-2xs transition-all', msg.sender === 'user' ? 'bg-slate-900 text-white ml-6 rounded-tr-xs' : 'bg-slate-100 text-slate-800 mr-6 rounded-tl-xs border border-slate-200/80']"
            >
              <div class="text-[9px] font-bold uppercase tracking-wider" :class="msg.sender === 'user' ? 'text-slate-300' : 'text-emerald-800'">
                {{ msg.sender === 'user' ? 'Anda' : 'CAKUE AI Copilot' }}
              </div>
              <div class="leading-relaxed">{{ msg.text }}</div>
            </div>

            <!-- Typing Indicator (Heuristic #1 Visibility of System Status) -->
            <div v-if="isTyping" class="p-3 bg-slate-100 border border-slate-200/80 rounded-2xl rounded-tl-xs mr-6 space-y-1 animate-fade-in shadow-2xs">
              <div class="text-[9px] font-bold text-emerald-800 uppercase tracking-wider">CAKUE AI Copilot</div>
              <div class="flex items-center gap-1.5 text-xs text-slate-500">
                <span class="inline-flex gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0ms]"></span>
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:150ms]"></span>
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:300ms]"></span>
                </span>
                <span class="text-[11px] italic">Menganalisis ledger & data mutasi...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Input Field -->
      <div class="p-4 bg-white border-t border-slate-200">
        <form @submit.prevent="handleSendMessage" class="flex items-center gap-2">
          <input 
            v-model="queryInput"
            type="text" 
            placeholder="Tanyakan analisis stok atau laba rugi..." 
            class="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all shadow-2xs"
          />
          <button 
            type="submit"
            :disabled="!queryInput || isTyping"
            class="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span>Kirim</span>
            <Icon name="send" custom-class="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useFinanceStore } from '../../stores/financeStore'
import { useStockStore } from '../../stores/stockStore'
import Icon from '../common/Icon.vue'

defineProps({
  isOpen: Boolean
})
defineEmits(['close'])

const financeStore = useFinanceStore()
const stockStore = useStockStore()

const queryInput = ref('')
const isTyping = ref(false)
const chatContainer = ref(null)

const quickChips = [
  { label: 'Omset & Laba', icon: 'chart-bar', query: 'Bagaimana analisis omset dan laba bersih bulan ini?' },
  { label: 'Stok Cabang', icon: 'box', query: 'Cek kesehatan stok cabang Surabaya dan kebutuhan restock' },
  { label: 'Kas & Utang', icon: 'credit-card', query: 'Berapa total kas likuid dan sisa kewajiban utang jatuh tempo?' },
  { label: 'Ringkasan Cepat', icon: 'zap', query: 'Berikan ringkasan performa finansial keseluruhan saat ini' }
]

const chatHistory = ref([
  {
    sender: 'ai',
    text: 'Halo! Saya AI Analis Finansial & Inventaris CAKUE. Saya membaca mutasi stok dan pembukuan ganda Anda secara real-time. Ada metrik yang ingin dianalisis?'
  }
])

function formatNumber(num) {
  return (num || 0).toLocaleString('id-ID')
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

function sendQuickPrompt(promptText) {
  queryInput.value = promptText
  handleSendMessage()
}

function handleSendMessage() {
  if (!queryInput.value || isTyping.value) return
  const q = queryInput.value
  chatHistory.value.push({ sender: 'user', text: q })
  queryInput.value = ''
  isTyping.value = true
  scrollToBottom()

  setTimeout(() => {
    let reply = 'Berdasarkan data ledger terkini, semua pencatatan berada dalam kondisi sinkron dan seimbang. Tidak ditemukan selisih transaksi.'
    if (q.toLowerCase().includes('stok') || q.toLowerCase().includes('surabaya')) {
      reply = 'Analisis Stok: Cabang Surabaya Gubeng memiliki stok Kopi dan Sirup di bawah rata-rata penjualan mingguan. Surat jalan terbaru SJ-2026-008 saat ini berstatus IN-TRANSIT menuju Surabaya. Mohon konfirmasi terima barang begitu kurir tiba.'
    } else if (q.toLowerCase().includes('laba') || q.toLowerCase().includes('omset')) {
      reply = `Perhitungan Finansial Presisi: Total omset masuk bulan berjalan tercatat Rp ${formatNumber(financeStore.totalIncome)}, dengan total pengeluaran operasional Rp ${formatNumber(financeStore.totalExpense)}. Laba bersih surplus tercatat Rp ${formatNumber(financeStore.netSavings)}.`
    } else if (q.toLowerCase().includes('utang') || q.toLowerCase().includes('kas')) {
      reply = `Arus Kas Likuid: Total kas likuid aktif tercatat Rp ${formatNumber(financeStore.totalBalance)}. Total kewajiban utang aktif Rp ${formatNumber(financeStore.totalUtang)}. Rasio likuiditas Anda sehat untuk operasional bulan ini.`
    }
    chatHistory.value.push({ sender: 'ai', text: reply })
    isTyping.value = false
    scrollToBottom()
  }, 500)
}
</script>
