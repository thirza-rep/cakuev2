<template>
  <div class="space-y-6">
    <!-- Header Summary -->
    <div class="p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
      <div>
        <h3 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
          <Icon name="building" custom-class="w-5 h-5 text-emerald-700" />
          <span>Manajemen Aset Tetap & Depresiasi Bulanan</span>
        </h3>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Pencatatan nilai perolehan, umur ekonomis, dan akumulasi penyusutan per cabang</p>
      </div>

      <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl text-right">
        <div class="text-xs uppercase font-bold text-slate-500">Total Nilai Buku Aset</div>
        <div class="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono mt-0.5">
          Rp {{ formatNumber(totalBookValue) }}
        </div>
      </div>
    </div>

    <!-- Asset Table (Clean SaaS) -->
    <div class="saas-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th class="py-3.5 px-6">Kode & Nama Aset</th>
              <th class="py-3.5 px-4">Cabang Penempatan</th>
              <th class="py-3.5 px-4 text-center">Tgl Perolehan</th>
              <th class="py-3.5 px-4 text-right">Harga Beli</th>
              <th class="py-3.5 px-4 text-center">Umur Ekonomis</th>
              <th class="py-3.5 px-4 text-right">Penyusutan/Bln</th>
              <th class="py-3.5 px-6 text-right font-bold text-slate-900">Nilai Buku Terkini</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-mono text-slate-800">
            <tr v-for="ast in stockStore.assets" :key="ast.id" class="hover:bg-slate-50/80 transition-colors">
              <td class="py-4 px-6 font-sans">
                <div class="font-bold text-slate-900 text-sm sm:text-base">{{ ast.name }}</div>
                <div class="text-xs text-slate-500 font-mono mt-0.5">{{ ast.id }}</div>
              </td>
              <td class="py-4 px-4 text-slate-700 font-sans text-sm">
                {{ ast.branch }}
              </td>
              <td class="py-4 px-4 text-center text-slate-500 text-xs sm:text-sm">
                {{ ast.purchaseDate }}
              </td>
              <td class="py-4 px-4 text-right text-slate-700 text-sm sm:text-base">
                Rp {{ formatNumber(ast.cost) }}
              </td>
              <td class="py-4 px-4 text-center text-slate-700 font-sans text-sm font-semibold">
                {{ ast.usefulLifeYears }} Tahun
              </td>
              <td class="py-4 px-4 text-right text-amber-700 font-bold text-sm sm:text-base">
                -Rp {{ formatNumber(ast.monthlyDepreciation) }}
              </td>
              <td class="py-4 px-6 text-right font-extrabold text-slate-900 text-sm sm:text-base">
                Rp {{ formatNumber(ast.currentValue) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStockStore } from '../../stores/stockStore'
import Icon from '../common/Icon.vue'

const stockStore = useStockStore()

const totalBookValue = computed(() => {
  return stockStore.assets.reduce((sum, a) => sum + a.currentValue, 0)
})

function formatNumber(num) {
  return (num || 0).toLocaleString('id-ID')
}
</script>
