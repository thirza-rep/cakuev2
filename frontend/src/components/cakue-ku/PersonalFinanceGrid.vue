<template>
  <div class="space-y-6">
    <!-- Financial Metric Summary Cards (Excel Stat Summary) -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      <!-- Total Saldo -->
      <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden">
        <div class="text-[11px] font-mono uppercase text-slate-400">Total Saldo Aktif</div>
        <div class="text-lg font-extrabold text-white font-mono mt-1">
          Rp {{ formatNumber(financeStore.totalBalance) }}
        </div>
        <div class="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
          <span>●</span> 4 Akun Terhubung
        </div>
      </div>

      <!-- Pemasukan -->
      <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div class="text-[11px] font-mono uppercase text-slate-400">Total Pemasukan</div>
        <div class="text-lg font-extrabold text-emerald-400 font-mono mt-1">
          +Rp {{ formatNumber(financeStore.totalIncome) }}
        </div>
        <div class="text-[10px] text-slate-500 mt-1">Bulan Berjalan</div>
      </div>

      <!-- Pengeluaran -->
      <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div class="text-[11px] font-mono uppercase text-slate-400">Total Pengeluaran</div>
        <div class="text-lg font-extrabold text-rose-400 font-mono mt-1">
          -Rp {{ formatNumber(financeStore.totalExpense) }}
        </div>
        <div class="text-[10px] text-slate-500 mt-1">Bulan Berjalan</div>
      </div>

      <!-- Tabungan Bersih -->
      <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div class="text-[11px] font-mono uppercase text-slate-400">Surplus / Defisit</div>
        <div :class="['text-lg font-extrabold font-mono mt-1', financeStore.netSavings >= 0 ? 'text-teal-400' : 'text-amber-400']">
          Rp {{ formatNumber(financeStore.netSavings) }}
        </div>
        <div class="text-[10px] text-slate-500 mt-1">Net Cashflow</div>
      </div>

      <!-- Total Piutang (Uang di orang lain) -->
      <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div class="text-[11px] font-mono uppercase text-slate-400">Piutang (Hak Uang)</div>
        <div class="text-lg font-extrabold text-sky-400 font-mono mt-1">
          Rp {{ formatNumber(financeStore.totalPiutang) }}
        </div>
        <div class="text-[10px] text-slate-500 mt-1">Tagihan Belum Lunas</div>
      </div>

      <!-- Total Utang (Kewajiban) -->
      <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div class="text-[11px] font-mono uppercase text-slate-400">Utang (Kewajiban)</div>
        <div class="text-lg font-extrabold text-amber-400 font-mono mt-1">
          Rp {{ formatNumber(financeStore.totalUtang) }}
        </div>
        <div class="text-[10px] text-slate-500 mt-1">Wajib Dilunasi</div>
      </div>
    </div>

    <!-- Excel-like Spreadsheet Data Grid Container -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div class="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div class="flex items-center gap-2">
          <span class="text-base font-bold text-white">Buku Besar Transaksi Keuangan</span>
          <span class="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Editable Spreadsheet Mode</span>
        </div>
        <div class="text-xs text-slate-400 flex items-center gap-2">
          <span>💡 <em>Klik sel mana saja untuk mengedit langsung layaknya Microsoft Excel</em></span>
        </div>
      </div>

      <!-- The Table Grid -->
      <div class="overflow-x-auto max-h-[500px]">
        <table class="w-full text-left border-collapse font-sans text-xs">
          <!-- Excel Column Headers (A, B, C...) -->
          <thead class="bg-slate-950/80 sticky top-0 z-20 border-b border-slate-800 text-[11px] font-mono text-slate-400">
            <tr>
              <th class="w-12 text-center py-2.5 px-2 border-r border-slate-800 bg-slate-950">#</th>
              <th class="py-2.5 px-3 border-r border-slate-800 min-w-[110px]">A : Tanggal</th>
              <th class="py-2.5 px-3 border-r border-slate-800 min-w-[140px]">B : Kategori</th>
              <th class="py-2.5 px-3 border-r border-slate-800 min-w-[220px]">C : Keterangan Transaksi</th>
              <th class="py-2.5 px-3 border-r border-slate-800 min-w-[100px]">D : Jenis</th>
              <th class="py-2.5 px-3 border-r border-slate-800 min-w-[150px] text-right">E : Nominal (IDR)</th>
              <th class="py-2.5 px-3 border-r border-slate-800 min-w-[150px]">F : Akun / Dompet</th>
              <th class="py-2.5 px-3 border-r border-slate-800 min-w-[100px]">G : Tag</th>
              <th class="py-2.5 px-2 text-center w-14">Aksi</th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-slate-800/60 font-mono">
            <tr 
              v-for="(row, idx) in filteredTransactions" 
              :key="row.id" 
              class="hover:bg-slate-850/60 transition-colors group"
            >
              <!-- Row Index -->
              <td class="text-center py-2 px-2 text-slate-500 bg-slate-950/40 border-r border-slate-800/80 text-[10px]">
                {{ idx + 1 }}
              </td>

              <!-- Tanggal (Editable) -->
              <td class="excel-cell">
                <input 
                  type="date"
                  :value="row.date" 
                  @input="e => financeStore.updateCell(row.id, 'date', e.target.value)"
                  class="bg-transparent text-slate-300 w-full focus:outline-none"
                />
              </td>

              <!-- Kategori (Editable) -->
              <td class="excel-cell">
                <input 
                  type="text"
                  :value="row.category" 
                  @input="e => financeStore.updateCell(row.id, 'category', e.target.value)"
                  class="bg-transparent text-slate-300 w-full focus:outline-none font-sans"
                />
              </td>

              <!-- Keterangan (Editable) -->
              <td class="excel-cell">
                <input 
                  type="text"
                  :value="row.desc" 
                  @input="e => financeStore.updateCell(row.id, 'desc', e.target.value)"
                  class="bg-transparent text-slate-200 w-full focus:outline-none font-sans"
                />
              </td>

              <!-- Jenis (Income/Expense Badge) -->
              <td class="excel-cell">
                <select 
                  :value="row.type"
                  @change="e => financeStore.updateCell(row.id, 'type', e.target.value)"
                  :class="['px-2 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer border', row.type === 'income' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-rose-950 text-rose-400 border-rose-800']"
                >
                  <option value="income">Masuk (+)</option>
                  <option value="expense">Keluar (-)</option>
                </select>
              </td>

              <!-- Nominal (Editable, Precision Math) -->
              <td class="excel-cell text-right">
                <input 
                  type="number"
                  :value="row.amount" 
                  @input="e => financeStore.updateCell(row.id, 'amount', e.target.value)"
                  :class="['bg-transparent w-full text-right font-bold focus:outline-none', row.type === 'income' ? 'text-emerald-400' : 'text-slate-100']"
                />
              </td>

              <!-- Akun Sumber (Select) -->
              <td class="excel-cell">
                <select 
                  :value="row.account"
                  @change="e => financeStore.updateCell(row.id, 'account', e.target.value)"
                  class="bg-transparent text-slate-300 w-full focus:outline-none text-xs font-sans cursor-pointer"
                >
                  <option v-for="acc in financeStore.accounts" :key="acc.id" :value="acc.name">
                    {{ acc.name }}
                  </option>
                </select>
              </td>

              <!-- Tag -->
              <td class="excel-cell">
                <span class="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] font-sans">
                  #{{ row.tag }}
                </span>
              </td>

              <!-- Delete Button -->
              <td class="py-1 px-2 text-center">
                <button 
                  @click="financeStore.deleteTransaction(row.id)" 
                  title="Hapus Baris"
                  class="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition-opacity"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Quick Add Row Footer -->
      <div class="p-3 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-xs">
        <button 
          @click="addNewBlankRow"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg font-semibold transition-colors"
        >
          <span>+</span>
          <span>Tambah Baris Baru (Shortcut: Alt+N)</span>
        </button>

        <div class="font-mono text-slate-400 text-xs">
          Total Baris: <strong class="text-white">{{ financeStore.transactions.length }} baris</strong>
        </div>
      </div>
    </div>

    <!-- Catatan Utang & Piutang Card Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Utang (Hutang Saya) -->
      <div class="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="p-1 rounded bg-amber-500/10 text-amber-400 font-bold">⚠️</span>
            <span class="font-bold text-sm text-white">Daftar Utang (Kewajiban Bayar)</span>
          </div>
          <span class="text-xs font-mono text-amber-400 font-bold">Total: Rp {{ formatNumber(financeStore.totalUtang) }}</span>
        </div>

        <div class="space-y-2">
          <div 
            v-for="d in financeStore.debts.filter(d => d.type === 'utang')" 
            :key="d.id"
            class="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between text-xs font-mono"
          >
            <div>
              <div class="font-bold text-slate-200">{{ d.contact }}</div>
              <div class="text-[10px] text-slate-500">Jatuh Tempo: {{ d.dueDate }}</div>
            </div>
            <div class="text-right">
              <div class="text-amber-400 font-bold">Rp {{ formatNumber(d.total - d.paid) }}</div>
              <span class="text-[9px] px-1.5 py-0.5 bg-amber-950 text-amber-300 rounded border border-amber-800">{{ d.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Piutang (Orang Utang ke Saya) -->
      <div class="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="p-1 rounded bg-sky-500/10 text-sky-400 font-bold">📋</span>
            <span class="font-bold text-sm text-white">Daftar Piutang (Tagihan Pelanggan)</span>
          </div>
          <span class="text-xs font-mono text-sky-400 font-bold">Total: Rp {{ formatNumber(financeStore.totalPiutang) }}</span>
        </div>

        <div class="space-y-2">
          <div 
            v-for="d in financeStore.debts.filter(d => d.type === 'piutang')" 
            :key="d.id"
            class="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between text-xs font-mono"
          >
            <div>
              <div class="font-bold text-slate-200">{{ d.contact }}</div>
              <div class="text-[10px] text-slate-500">Jatuh Tempo: {{ d.dueDate }}</div>
            </div>
            <div class="text-right">
              <div class="text-sky-400 font-bold">Rp {{ formatNumber(d.total - d.paid) }}</div>
              <span :class="['text-[9px] px-1.5 py-0.5 rounded border', d.status === 'Lunas' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-sky-950 text-sky-300 border-sky-800']">
                {{ d.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFinanceStore } from '../../stores/financeStore'

const props = defineProps({
  filter: {
    type: String,
    default: 'all'
  }
})

const financeStore = useFinanceStore()

const filteredTransactions = computed(() => {
  if (props.filter === 'income') {
    return financeStore.transactions.filter(t => t.type === 'income')
  }
  if (props.filter === 'expense') {
    return financeStore.transactions.filter(t => t.type === 'expense')
  }
  return financeStore.transactions
})

function formatNumber(num) {
  return (num || 0).toLocaleString('id-ID')
}

function addNewBlankRow() {
  financeStore.addTransaction({
    category: 'Operasional',
    desc: 'Catatan Baru',
    type: 'expense',
    amount: 50000,
    account: 'Dompet Tunai (Cash)',
    tag: 'Manual'
  })
}
</script>
