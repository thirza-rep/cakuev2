<template>
  <div class="max-w-4xl mx-auto space-y-6 pb-20 md:pb-8">
    <!-- Top Greeting & Main Digital Card (Banking Look) -->
    <div class="saas-card p-6 md:p-8 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 text-white rounded-2xl relative overflow-hidden bank-card-shadow">
      <!-- Background Subtle Pattern -->
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-2 text-xs font-medium text-emerald-200">
            <Icon name="shield-check" custom-class="w-4 h-4 text-emerald-400" />
            <span>Rekening Personal Terverifikasi • {{ authStore.user.accountNumber }}</span>
          </div>

          <div class="mt-3">
            <div class="text-xs uppercase tracking-wider text-emerald-200/80 font-medium">Total Saldo Keuangan Pribadi</div>
            <div class="flex items-center gap-3 mt-1">
              <span class="text-3xl md:text-4xl font-extrabold tracking-tight font-mono">
                {{ isBalanceHidden ? 'Rp ••••••••••' : `Rp ${formatNumber(financeStore.totalBalance)}` }}
              </span>
              <button 
                @click="isBalanceHidden = !isBalanceHidden"
                class="p-1 text-emerald-300 hover:text-white transition-colors"
                title="Tampilkan/Sembunyikan Saldo"
              >
                <svg v-if="!isBalanceHidden" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Monthly Cashflow Snapshot -->
        <div class="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10 text-xs">
          <div class="text-right">
            <div class="text-emerald-200 text-[11px]">Masuk Bulan Ini</div>
            <div class="font-bold text-white font-mono">+Rp {{ formatNumber(financeStore.totalIncome) }}</div>
          </div>
          <div class="h-8 w-px bg-white/20"></div>
          <div class="text-right">
            <div class="text-rose-200 text-[11px]">Keluar Bulan Ini</div>
            <div class="font-bold text-white font-mono">-Rp {{ formatNumber(financeStore.totalExpense) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Action Bar (Floating Banking Actions) -->
    <div class="grid grid-cols-3 gap-3 md:gap-4">
      <button 
        @click="openTransactionModal('income')"
        class="saas-card p-4 hover:border-emerald-500 flex flex-col sm:flex-row items-center justify-center gap-2.5 text-center sm:text-left group cursor-pointer"
      >
        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
          <Icon name="income" custom-class="w-5 h-5" />
        </div>
        <div>
          <div class="font-bold text-xs md:text-sm text-slate-800">Catat Masuk</div>
          <div class="text-[11px] text-slate-500 hidden sm:block">Gaji, penjualan, dividen</div>
        </div>
      </button>

      <button 
        @click="openTransactionModal('expense')"
        class="saas-card p-4 hover:border-rose-500 flex flex-col sm:flex-row items-center justify-center gap-2.5 text-center sm:text-left group cursor-pointer"
      >
        <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all">
          <Icon name="expense" custom-class="w-5 h-5" />
        </div>
        <div>
          <div class="font-bold text-xs md:text-sm text-slate-800">Catat Keluar</div>
          <div class="text-[11px] text-slate-500 hidden sm:block">Belanja, makan, tagihan</div>
        </div>
      </button>

      <button 
        @click="activeViewTab = 'debts'"
        :class="['saas-card p-4 flex flex-col sm:flex-row items-center justify-center gap-2.5 text-center sm:text-left group cursor-pointer transition-all', activeViewTab === 'debts' ? 'border-emerald-600 bg-emerald-50/30' : 'hover:border-slate-300']"
      >
        <div class="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-all">
          <Icon name="debt" custom-class="w-5 h-5" />
        </div>
        <div>
          <div class="font-bold text-xs md:text-sm text-slate-800">Utang & Piutang</div>
          <div class="text-[11px] text-slate-500 hidden sm:block">Catatan pinjaman & tagihan</div>
        </div>
      </button>
    </div>

    <!-- Multi-Account Pocket Cards (Dompet & Rekening) -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-slate-800">Kantong Rekening & Dompet</h3>
        <span class="text-xs text-slate-500 font-medium">{{ financeStore.accounts.length }} Akun Aktif</span>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div 
          v-for="acc in financeStore.accounts" 
          :key="acc.id"
          class="saas-card p-3.5 space-y-2 hover:border-slate-400 cursor-pointer"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-600 truncate">{{ acc.name }}</span>
            <Icon name="credit-card" custom-class="w-4 h-4 text-slate-400" />
          </div>
          <div class="text-sm font-bold font-mono text-slate-900">
            Rp {{ formatNumber(acc.balance) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Tabs: Riwayat Transaksi vs Utang Piutang -->
    <div class="saas-card p-5 md:p-6 space-y-4">
      <!-- Tabs Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div class="flex items-center gap-4">
          <button 
            @click="activeViewTab = 'transactions'"
            :class="['text-sm font-bold pb-1 border-b-2 transition-all', activeViewTab === 'transactions' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400 hover:text-slate-600']"
          >
            Riwayat Transaksi Terakhir
          </button>
          <button 
            @click="activeViewTab = 'debts'"
            :class="['text-sm font-bold pb-1 border-b-2 transition-all', activeViewTab === 'debts' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400 hover:text-slate-600']"
          >
            Buku Utang & Piutang
          </button>
        </div>

        <div v-if="activeViewTab === 'transactions'" class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
          <button 
            v-for="f in ['all', 'income', 'expense']" 
            :key="f"
            @click="filterType = f"
            :class="['px-2.5 py-1 rounded text-xs font-medium transition-colors', filterType === f ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-900']"
          >
            {{ f === 'all' ? 'Semua' : f === 'income' ? 'Masuk' : 'Keluar' }}
          </button>
        </div>
      </div>

      <!-- Tab 1: Clean Transaction Feed -->
      <div v-if="activeViewTab === 'transactions'" class="space-y-3">
        <div v-if="filteredList.length === 0" class="text-center py-8 text-slate-400 text-xs">
          Tidak ada transaksi yang cocok.
        </div>

        <div 
          v-for="tx in filteredList" 
          :key="tx.id"
          class="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-all"
        >
          <div class="flex items-center gap-3">
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0', tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600']">
              <Icon :name="tx.type === 'income' ? 'income' : 'expense'" custom-class="w-5 h-5" />
            </div>
            <div>
              <div class="font-bold text-xs text-slate-900 leading-tight">{{ tx.desc }}</div>
              <div class="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                <span>{{ tx.category }}</span>
                <span>•</span>
                <span>{{ tx.date }}</span>
                <span>•</span>
                <span class="text-slate-400">{{ tx.account }}</span>
              </div>
            </div>
          </div>

          <div class="text-right">
            <div :class="['font-bold font-mono text-xs md:text-sm', tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900']">
              {{ tx.type === 'income' ? '+' : '-' }}Rp {{ formatNumber(tx.amount) }}
            </div>
            <button 
              @click="financeStore.deleteTransaction(tx.id)"
              class="text-[10px] text-slate-400 hover:text-rose-500 mt-0.5 inline-block"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>

      <!-- Tab 2: Buku Utang & Piutang (Clean Banking Cards) -->
      <div v-else class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Utang (Kewajiban) -->
          <div class="p-4 bg-amber-50/40 border border-amber-200/80 rounded-xl space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-amber-200/60">
              <span class="text-xs font-bold text-amber-900">Utang Saya (Wajib Dibayar)</span>
              <span class="text-xs font-bold font-mono text-amber-700">Rp {{ formatNumber(financeStore.totalUtang) }}</span>
            </div>

            <div class="space-y-2">
              <div 
                v-for="d in financeStore.debts.filter(d => d.type === 'utang')" 
                :key="d.id"
                class="p-3 bg-white border border-amber-200/60 rounded-lg flex items-center justify-between text-xs"
              >
                <div>
                  <div class="font-bold text-slate-800">{{ d.contact }}</div>
                  <div class="text-[11px] text-slate-500">Jatuh Tempo: {{ d.dueDate }}</div>
                </div>
                <div class="text-right">
                  <div class="font-bold font-mono text-amber-700">Rp {{ formatNumber(d.total - d.paid) }}</div>
                  <span class="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-medium">{{ d.status }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Piutang (Hak Uang) -->
          <div class="p-4 bg-sky-50/40 border border-sky-200/80 rounded-xl space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-sky-200/60">
              <span class="text-xs font-bold text-sky-900">Piutang (Orang Utang ke Saya)</span>
              <span class="text-xs font-bold font-mono text-sky-700">Rp {{ formatNumber(financeStore.totalPiutang) }}</span>
            </div>

            <div class="space-y-2">
              <div 
                v-for="d in financeStore.debts.filter(d => d.type === 'piutang')" 
                :key="d.id"
                class="p-3 bg-white border border-sky-200/60 rounded-lg flex items-center justify-between text-xs"
              >
                <div>
                  <div class="font-bold text-slate-800">{{ d.contact }}</div>
                  <div class="text-[11px] text-slate-500">Jatuh Tempo: {{ d.dueDate }}</div>
                </div>
                <div class="text-right">
                  <div class="font-bold font-mono text-sky-700">Rp {{ formatNumber(d.total - d.paid) }}</div>
                  <span class="text-[10px] px-1.5 py-0.5 bg-sky-100 text-sky-800 rounded font-medium">{{ d.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form Tambah Transaksi Cepat -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 class="text-sm font-bold text-slate-900">
            {{ modalType === 'income' ? 'Catat Pemasukan Baru' : 'Catat Pengeluaran Baru' }}
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600">
            <Icon name="close" custom-class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="saveTransaction" class="space-y-3">
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-bold text-slate-700">Nominal (Rupiah)</label>
              <span v-if="formAmount > 0" class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-mono">
                Rp {{ (formAmount || 0).toLocaleString('id-ID') }}
              </span>
            </div>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-400 font-mono">Rp</span>
              <input 
                v-model.number="formAmount" 
                type="number" 
                min="1000"
                required
                placeholder="50000" 
                class="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Keterangan Transaksi</label>
            <input 
              v-model="formDesc" 
              type="text" 
              required
              placeholder="Contoh: Makan Siang, Bensin, Gaji" 
              class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all font-medium"
            />
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
              <select v-model="formCategory" class="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all">
                <option value="Makan & Minum">Makan & Minum</option>
                <option value="Transportasi">Transportasi</option>
                <option value="Tagihan & Utilitas">Tagihan & Utilitas</option>
                <option value="Gaji & Omset">Gaji & Omset</option>
                <option value="Belanja Harian">Belanja Harian</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Pilih Rekening</label>
              <select v-model="formAccount" class="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all">
                <option v-for="acc in financeStore.accounts" :key="acc.id" :value="acc.name">
                  {{ acc.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer">Batal</button>
            <button 
              type="submit" 
              class="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useFinanceStore } from '../../stores/financeStore'
import Icon from '../common/Icon.vue'

const authStore = useAuthStore()
const financeStore = useFinanceStore()

const isBalanceHidden = ref(false)
const activeViewTab = ref('transactions')
const filterType = ref('all')

const showModal = ref(false)
const modalType = ref('expense')
const formAmount = ref('')
const formDesc = ref('')
const formCategory = ref('Makan & Minum')
const formAccount = ref('BCA Prioritas')

const filteredList = computed(() => {
  if (filterType.value === 'income') return financeStore.transactions.filter(t => t.type === 'income')
  if (filterType.value === 'expense') return financeStore.transactions.filter(t => t.type === 'expense')
  return financeStore.transactions
})

function formatNumber(num) {
  return (num || 0).toLocaleString('id-ID')
}

function openTransactionModal(type) {
  modalType.value = type
  formAmount.value = ''
  formDesc.value = ''
  formCategory.value = type === 'income' ? 'Gaji & Omset' : 'Makan & Minum'
  showModal.value = true
}

function saveTransaction() {
  if (!formAmount.value || !formDesc.value) return
  financeStore.addTransaction({
    desc: formDesc.value,
    category: formCategory.value,
    type: modalType.value,
    amount: formAmount.value,
    account: formAccount.value,
    tag: 'Personal'
  })
  showModal.value = false
}
</script>
