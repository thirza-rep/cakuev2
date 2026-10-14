<template>
  <div class="bg-slate-900/95 border-b border-slate-800 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 text-xs select-none">
    <!-- Left: Excel Formula Bar & Cell Indicator -->
    <div class="flex items-center gap-2 flex-1 min-w-0 sm:min-w-[220px]">
      <div class="px-2 sm:px-2.5 py-1 bg-slate-950 border border-slate-800 rounded font-mono text-[10px] sm:text-[11px] font-bold text-emerald-400 shrink-0">
        {{ activeCell || 'A1' }}
      </div>
      <div class="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-slate-950 border border-slate-800 rounded flex-1 min-w-0">
        <span class="font-mono text-slate-500 font-bold italic text-xs shrink-0">fx</span>
        <input 
          :value="formulaValue" 
          readonly
          class="bg-transparent text-slate-300 font-mono text-[11px] sm:text-xs w-full focus:outline-none truncate"
        />
      </div>
    </div>

    <!-- Right: Quick Spreadsheet Action Buttons -->
    <div class="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
      <button 
        @click="$emit('add-row')"
        class="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all shadow-sm text-xs shrink-0 cursor-pointer"
      >
        <span>+</span>
        <span class="hidden xs:inline sm:inline">Tambah Baris</span>
      </button>

      <div class="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
        <button 
          v-for="f in ['all', 'income', 'expense']" 
          :key="f"
          @click="$emit('filter-change', f)"
          :class="['px-2.5 py-1 rounded text-[11px] capitalize font-medium transition-colors', activeFilter === f ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white']"
        >
          {{ f === 'all' ? 'Semua' : f === 'income' ? 'Masuk' : 'Keluar' }}
        </button>
      </div>

      <button 
        @click="$emit('export-csv')"
        class="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
        <span>Export</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activeCell: {
    type: String,
    default: 'E2'
  },
  formulaValue: {
    type: String,
    default: '=SUM(E2:E20) [Total Transaksi Aktif]'
  },
  activeFilter: {
    type: String,
    default: 'all'
  }
})

defineEmits(['add-row', 'filter-change', 'export-csv'])
</script>
