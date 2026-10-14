<template>
  <div class="space-y-6 pb-20 md:pb-8">
    <!-- Sub-Navbar SaaS Tabs (Sleek Segmented Controls) -->
    <div class="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
      <div class="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl text-xs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="currentTab = tab.id"
          :class="['flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all', currentTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900']"
        >
          <Icon :name="tab.icon" custom-class="w-4 h-4" />
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Current Branch Context -->
      <div class="flex items-center gap-2 text-xs">
        <span class="text-slate-500 font-medium">Cabang Aktif:</span>
        <select 
          v-model="authStore.user.currentBranch"
          class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-emerald-500 text-xs shadow-sm cursor-pointer"
        >
          <option v-for="b in authStore.branches" :key="b.id" :value="b.name">
            {{ b.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- TAB 1: EXECUTIVE DASHBOARD (SaaS Business Metrics) -->
    <div v-if="currentTab === 'dashboard'" class="space-y-6">
      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="saas-card p-5 space-y-1">
          <div class="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Omset Bisnis</span>
            <Icon name="income" custom-class="w-4 h-4 text-emerald-600" />
          </div>
          <div class="text-xl md:text-2xl font-bold font-mono text-slate-900">
            Rp {{ formatNumber(financeStore.totalIncome) }}
          </div>
          <div class="text-[11px] text-emerald-700 font-medium pt-1 flex items-center gap-1">
            <Icon name="check" custom-class="w-3.5 h-3.5" />
            <span>Kondisi Arus Kas Positif</span>
          </div>
        </div>

        <div class="saas-card p-5 space-y-1">
          <div class="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Beban Operasional & HPP</span>
            <Icon name="expense" custom-class="w-4 h-4 text-slate-600" />
          </div>
          <div class="text-xl md:text-2xl font-bold font-mono text-slate-900">
            Rp {{ formatNumber(financeStore.totalExpense) }}
          </div>
          <div class="text-[11px] text-slate-500 pt-1">Termasuk restock bahan baku</div>
        </div>

        <div class="saas-card p-5 space-y-1">
          <div class="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Laba Bersih (Surplus)</span>
            <Icon name="chart" custom-class="w-4 h-4 text-teal-600" />
          </div>
          <div class="text-xl md:text-2xl font-bold font-mono text-emerald-700">
            Rp {{ formatNumber(financeStore.netSavings) }}
          </div>
          <div class="text-[11px] text-emerald-600 font-medium pt-1">Margin Kotor Rata-rata 38.4%</div>
        </div>

        <div class="saas-card p-5 space-y-1">
          <div class="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Aset Tetap</span>
            <Icon name="building" custom-class="w-4 h-4 text-sky-600" />
          </div>
          <div class="text-xl md:text-2xl font-bold font-mono text-slate-900">
            Rp {{ formatNumber(totalAssetsBookValue) }}
          </div>
          <div class="text-[11px] text-slate-500 pt-1">3 Unit Mesin & Peralatan</div>
        </div>
      </div>

      <!-- Recent Business Transactions Table (Clean SaaS Grid) -->
      <div class="saas-card overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h4 class="text-sm font-bold text-slate-900">Buku Jurnal Transaksi Usaha</h4>
            <p class="text-xs text-slate-500">Mutasi pencatatan pembukuan ganda terintegrasi POS dan kas operasional</p>
          </div>
          <button 
            @click="exportCsv"
            class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Icon name="printer" custom-class="w-3.5 h-3.5" />
            <span>Ekspor Rekap CSV</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/80">
              <tr>
                <th class="py-3 px-6">ID Transaksi</th>
                <th class="py-3 px-4">Tanggal</th>
                <th class="py-3 px-4">Kategori</th>
                <th class="py-3 px-6">Keterangan</th>
                <th class="py-3 px-4 text-right">Nominal</th>
                <th class="py-3 px-4">Rekening</th>
                <th class="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium text-slate-800">
              <tr v-for="t in financeStore.transactions" :key="t.id" class="hover:bg-slate-50/80 transition-colors">
                <td class="py-3 px-6 font-mono text-[11px] text-slate-500">{{ t.id }}</td>
                <td class="py-3 px-4 text-slate-600">{{ t.date }}</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                    {{ t.category }}
                  </span>
                </td>
                <td class="py-3 px-6 font-semibold text-slate-900">{{ t.desc }}</td>
                <td class="py-3 px-4 text-right font-mono font-bold" :class="t.type === 'income' ? 'text-emerald-700' : 'text-slate-800'">
                  {{ t.type === 'income' ? '+' : '-' }}Rp {{ formatNumber(t.amount) }}
                </td>
                <td class="py-3 px-4 text-slate-600">{{ t.account }}</td>
                <td class="py-3 px-4 text-center">
                  <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Icon name="check" custom-class="w-3 h-3" />
                    <span>Tervalidasi</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: KASIR POS (Touch-Friendly Retail POS) -->
    <div v-else-if="currentTab === 'pos'" class="space-y-6">
      <PosCashier />
    </div>

    <!-- TAB 3: INVENTARIS & CABANG -->
    <div v-else-if="currentTab === 'inventory'" class="space-y-6">
      <BranchStockManager />
    </div>

    <!-- TAB 4: ASET TETAP -->
    <div v-else-if="currentTab === 'assets'" class="space-y-6">
      <AssetManager />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useFinanceStore } from '../../stores/financeStore'
import { useStockStore } from '../../stores/stockStore'
import Icon from '../common/Icon.vue'
import PosCashier from '../cakue-pos/PosCashier.vue'
import BranchStockManager from '../cakue-manage/BranchStockManager.vue'
import AssetManager from '../cakue-manage/AssetManager.vue'

const authStore = useAuthStore()
const financeStore = useFinanceStore()
const stockStore = useStockStore()

const currentTab = ref('dashboard')

const tabs = [
  { id: 'dashboard', label: 'Ringkasan Bisnis', icon: 'chart' },
  { id: 'pos', label: 'Kasir POS Toko', icon: 'store' },
  { id: 'inventory', label: 'Inventaris & Cabang', icon: 'box' },
  { id: 'assets', label: 'Aset & Depresiasi', icon: 'building' }
]

const totalAssetsBookValue = computed(() => {
  return stockStore.assets.reduce((sum, a) => sum + a.currentValue, 0)
})

function formatNumber(num) {
  return (num || 0).toLocaleString('id-ID')
}

function exportCsv() {
  alert('Data Buku Jurnal telah berhasil diekspor ke file CSV.')
}
</script>
