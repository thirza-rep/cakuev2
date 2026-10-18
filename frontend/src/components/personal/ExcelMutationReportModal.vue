<template>
  <transition name="fade">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs font-sans">
      <div class="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10">
        
        <!-- 1. Header Dialog Modal (Sleek Excel Theme) -->
        <div class="px-5 sm:px-7 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Icon name="chart" custom-class="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 class="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Laporan Mutasi Keuangan</span>
                <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Spreadsheet Excel
                </span>
              </h2>
              <p class="text-xs text-slate-500">
                Pencatatan mutasi harian & bulanan pemasukan dan pengeluaran terperinci
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Tombol Download Excel Cepat -->
            <button 
              @click="downloadExcel"
              type="button"
              class="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              title="Unduh Lembar Kerja Excel (.xls)"
            >
              <svg class="w-4 h-4 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              <span>Download Excel (.xls)</span>
            </button>

            <!-- Tombol Tutup -->
            <button 
              @click="$emit('close')"
              type="button" 
              class="w-9 h-9 rounded-xl bg-slate-200/70 hover:bg-slate-300/80 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              title="Tutup"
            >
              <Icon name="close" custom-class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- 2. Controls Bar: Filter Periode (Harian vs Bulanan) & Pilihan Rekening -->
        <div class="p-4 sm:p-5 bg-white border-b border-slate-200 space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            <!-- Toggle Mode: Harian vs Bulanan -->
            <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold w-fit">
              <button 
                @click="reportMode = 'daily'"
                type="button"
                :class="[
                  'px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5',
                  reportMode === 'daily' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
                ]"
              >
                <span>Harian (1 Hari)</span>
              </button>
              <button 
                @click="reportMode = 'monthly'"
                type="button"
                :class="[
                  'px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5',
                  reportMode === 'monthly' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
                ]"
              >
                <span>Bulanan (Rekap)</span>
              </button>
            </div>

            <!-- Date / Month Picker Controls -->
            <div class="flex flex-wrap items-center gap-2 text-xs">
              <!-- Jika Mode Harian -->
              <template v-if="reportMode === 'daily'">
                <div class="flex items-center gap-1.5">
                  <label class="font-bold text-slate-600">Pilih Tanggal:</label>
                  <input 
                    v-model="selectedDate"
                    type="date"
                    class="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none cursor-pointer"
                  />
                </div>
                <button 
                  @click="setToToday" 
                  type="button"
                  class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Hari Ini
                </button>
                <button 
                  @click="setToYesterday" 
                  type="button"
                  class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Kemarin
                </button>
              </template>

              <!-- Jika Mode Bulanan -->
              <template v-else>
                <div class="flex items-center gap-1.5">
                  <label class="font-bold text-slate-600">Bulan & Tahun:</label>
                  <select 
                    v-model="selectedMonth" 
                    class="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option v-for="(m, idx) in monthNames" :key="idx" :value="idx">
                      {{ m }}
                    </option>
                  </select>
                  <select 
                    v-model="selectedYear" 
                    class="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none cursor-pointer font-mono"
                  >
                    <option v-for="y in [2025, 2026, 2027]" :key="y" :value="y">
                      {{ y }}
                    </option>
                  </select>
                </div>
                <button 
                  @click="setToCurrentMonth" 
                  type="button"
                  class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Bulan Ini
                </button>
              </template>
            </div>
          </div>

          <!-- Secondary Filters: Filter Rekening / Dompet & Jenis -->
          <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <div class="flex flex-wrap items-center gap-2">
              <select 
                v-model="filterAccount" 
                class="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Rekening & Dompet</option>
                <option v-for="acc in financeStore.accounts" :key="acc.id" :value="acc.name">
                  {{ acc.name }}
                </option>
              </select>

              <select 
                v-model="filterType" 
                class="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Jenis (Debet & Kredit)</option>
                <option value="income">Pemasukan Saja (Debet)</option>
                <option value="expense">Pengeluaran Saja (Kredit)</option>
              </select>
            </div>

            <div class="flex items-center gap-2 sm:hidden w-full pt-1">
              <button 
                @click="downloadExcel"
                type="button"
                class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>Unduh Excel (.xls)</span>
              </button>
              <button 
                @click="downloadCsv"
                type="button"
                class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer"
              >
                <span>CSV</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 3. KPI Stat Strip: Ringkasan Nilai Laporan Excel -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200">
          <!-- Total Pemasukan / Debet -->
          <div class="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div class="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Total Pemasukan (Debet)</div>
            <div class="text-sm sm:text-base font-extrabold text-emerald-800 font-sans tracking-tight mt-0.5">
              +Rp {{ formatNumber(summaryIncome) }}
            </div>
          </div>

          <!-- Total Pengeluaran / Kredit -->
          <div class="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div class="text-[10px] text-rose-700 font-bold uppercase tracking-wider">Total Pengeluaran (Kredit)</div>
            <div class="text-sm sm:text-base font-extrabold text-rose-800 font-sans tracking-tight mt-0.5">
              -Rp {{ formatNumber(summaryExpense) }}
            </div>
          </div>

          <!-- Arus Kas Bersih (Net Cashflow) -->
          <div class="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Arus Kas Bersih</div>
            <div :class="['text-sm sm:text-base font-extrabold font-sans tracking-tight mt-0.5', summaryNet >= 0 ? 'text-emerald-700' : 'text-amber-700']">
              {{ summaryNet >= 0 ? '+' : '' }}Rp {{ formatNumber(summaryNet) }}
            </div>
          </div>

          <!-- Total Transaksi -->
          <div class="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center justify-between">
            <div>
              <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Jumlah Mutasi</div>
              <div class="text-sm sm:text-base font-extrabold text-slate-900 font-sans tracking-tight mt-0.5">
                {{ reportRows.length }} Baris
              </div>
            </div>
            <button 
              @click="downloadCsv"
              type="button"
              class="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 cursor-pointer"
              title="Unduh versi CSV UTF-8"
            >
              <span>.CSV</span>
            </button>
          </div>
        </div>

        <!-- 4. Interactive In-App Excel Sheet Viewer (Dapat Dilihat Secara Langsung) -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/50">
          <div class="bg-white border border-slate-300 rounded-2xl shadow-xs overflow-hidden">
            
            <!-- Excel Title Bar Header Inside Table -->
            <div class="px-4 py-2.5 bg-emerald-800 text-white flex items-center justify-between text-xs">
              <div class="font-bold flex items-center gap-2">
                <span>Lembar Kerja: Mutasi_{{ reportMode === 'daily' ? selectedDate : `${selectedYear}_${selectedMonth + 1}` }}</span>
                <span class="text-[10px] opacity-80">• Format Sel Akuntansi</span>
              </div>
              <div class="text-[11px] opacity-90 hidden sm:block">
                Kop: CAKUE ERP - Mutasi Kas
              </div>
            </div>

            <!-- Table Spreadsheet Grid -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <tr>
                    <th class="py-2.5 px-3 border-r border-slate-200 text-center w-12 font-mono">No</th>
                    <th class="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">Tanggal & Jam</th>
                    <th class="py-2.5 px-3 border-r border-slate-200 font-mono whitespace-nowrap">ID Ref</th>
                    <th class="py-2.5 px-4 border-r border-slate-200 min-w-[200px]">Deskripsi / Keterangan</th>
                    <th class="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">Kategori</th>
                    <th class="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">Rekening / Dompet</th>
                    <th class="py-2.5 px-3 border-r border-slate-200 text-right text-emerald-800 font-extrabold whitespace-nowrap">Pemasukan (Debet)</th>
                    <th class="py-2.5 px-3 border-r border-slate-200 text-right text-rose-800 font-extrabold whitespace-nowrap">Pengeluaran (Kredit)</th>
                    <th class="py-2.5 px-3 text-right font-extrabold text-slate-900 whitespace-nowrap">Saldo Berjalan</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-slate-200 font-sans text-slate-800">
                  <tr v-if="reportRows.length === 0">
                    <td colspan="9" class="py-12 text-center text-slate-400">
                      <div class="space-y-1">
                        <div class="font-bold text-slate-600">Tidak ada catatan mutasi pada periode ini</div>
                        <div class="text-[11px]">Silakan pilih tanggal lain atau beralih ke rekapitulasi bulanan.</div>
                      </div>
                    </td>
                  </tr>

                  <tr 
                    v-for="(row, idx) in reportRows" 
                    :key="row.id"
                    :class="['hover:bg-emerald-50/40 transition-colors', idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60']"
                  >
                    <!-- No -->
                    <td class="py-2.5 px-3 border-r border-slate-200 text-center font-mono text-slate-400 text-[11px]">
                      {{ idx + 1 }}
                    </td>
                    <!-- Tanggal -->
                    <td class="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap font-medium text-slate-600">
                      {{ row.date }} {{ row.time || '' }}
                    </td>
                    <!-- ID Ref -->
                    <td class="py-2.5 px-3 border-r border-slate-200 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {{ row.id }}
                    </td>
                    <!-- Keterangan -->
                    <td class="py-2.5 px-4 border-r border-slate-200 font-semibold text-slate-900">
                      {{ row.desc }}
                      <span v-if="row.tag" class="ml-1.5 text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                        {{ row.tag }}
                      </span>
                    </td>
                    <!-- Kategori -->
                    <td class="py-2.5 px-3 border-r border-slate-200 text-slate-600 whitespace-nowrap">
                      {{ row.category }}
                    </td>
                    <!-- Rekening / Dompet -->
                    <td class="py-2.5 px-3 border-r border-slate-200 text-slate-700 font-medium whitespace-nowrap">
                      {{ row.account }}
                    </td>
                    <!-- Pemasukan (Debet) -->
                    <td class="py-2.5 px-3 border-r border-slate-200 text-right font-sans font-bold text-emerald-700 whitespace-nowrap">
                      {{ row.type === 'income' ? `Rp ${formatNumber(row.amount)}` : '-' }}
                    </td>
                    <!-- Pengeluaran (Kredit) -->
                    <td class="py-2.5 px-3 border-r border-slate-200 text-right font-sans font-bold text-rose-700 whitespace-nowrap">
                      {{ row.type === 'expense' ? `Rp ${formatNumber(row.amount)}` : '-' }}
                    </td>
                    <!-- Saldo Berjalan -->
                    <td class="py-2.5 px-3 text-right font-sans font-extrabold text-slate-900 whitespace-nowrap">
                      Rp {{ formatNumber(row.runningBalance) }}
                    </td>
                  </tr>
                </tbody>

                <!-- Grand Total Footer Row (Excel Double Bottom Border Style) -->
                <tfoot v-if="reportRows.length > 0" class="bg-slate-100/90 border-t-2 border-slate-400 border-b-4 border-double border-slate-900 font-bold text-slate-900">
                  <tr>
                    <td colspan="6" class="py-3 px-4 text-right uppercase tracking-wider text-[11px]">
                      TOTAL MUTASI ({{ reportPeriodTitle }}):
                    </td>
                    <td class="py-3 px-3 text-right font-sans font-black text-emerald-800 text-xs sm:text-sm whitespace-nowrap">
                      Rp {{ formatNumber(summaryIncome) }}
                    </td>
                    <td class="py-3 px-3 text-right font-sans font-black text-rose-800 text-xs sm:text-sm whitespace-nowrap">
                      Rp {{ formatNumber(summaryExpense) }}
                    </td>
                    <td class="py-3 px-3 text-right font-sans font-black text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                      {{ summaryNet >= 0 ? '+' : '' }}Rp {{ formatNumber(summaryNet) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <!-- 5. Footer Aksi & Informasi -->
        <div class="px-5 sm:px-7 py-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div class="text-slate-500 text-[11px] flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>File Excel kompatibel dengan Microsoft Excel, Apple Numbers, dan Google Spreadsheet.</span>
          </div>

          <div class="flex items-center gap-2">
            <button 
              @click="$emit('close')"
              type="button" 
              class="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button 
              @click="downloadExcel"
              type="button"
              class="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <svg class="w-4 h-4 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              <span>Download Excel (.xls)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFinanceStore } from '../../stores/financeStore'
import { useAuthStore } from '../../stores/authStore'
import Icon from '../common/Icon.vue'

defineEmits(['close'])

const financeStore = useFinanceStore()
const authStore = useAuthStore()

// State Mode Laporan: 'daily' (Harian) atau 'monthly' (Bulanan)
const reportMode = ref('daily')

// State Pilihan Tanggal Harian
const todayStr = new Date().toISOString().slice(0, 10)
const selectedDate = ref(todayStr)

function setToToday() {
  selectedDate.value = new Date().toISOString().slice(0, 10)
}

function setToYesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  selectedDate.value = d.toISOString().slice(0, 10)
}

// State Pilihan Bulan & Tahun
const now = new Date()
const selectedMonth = ref(now.getMonth()) // 0 - 11
const selectedYear = ref(now.getFullYear()) // 2026

function setToCurrentMonth() {
  const d = new Date()
  selectedMonth.value = d.getMonth()
  selectedYear.value = d.getFullYear()
}

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

// Secondary Filters
const filterAccount = ref('all')
const filterType = ref('all')

// Judul Periode Laporan
const reportPeriodTitle = computed(() => {
  if (reportMode.value === 'daily') {
    return `Harian: ${selectedDate.value}`
  } else {
    return `Bulanan: ${monthNames[selectedMonth.value]} ${selectedYear.value}`
  }
})

// Filter Transaksi Berdasarkan Periode yang Dipilih
const rawFilteredTransactions = computed(() => {
  return financeStore.transactions.filter(t => {
    // 1. Filter Tanggal / Bulan
    if (reportMode.value === 'daily') {
      if (t.date !== selectedDate.value) return false
    } else {
      // Monthly mode
      if (!t.date) return false
      const [y, m] = t.date.split('-').map(Number)
      if (y !== selectedYear.value || (m - 1) !== selectedMonth.value) return false
    }

    // 2. Filter Akun / Kantong
    if (filterAccount.value !== 'all' && t.account !== filterAccount.value) {
      return false
    }

    // 3. Filter Tipe
    if (filterType.value !== 'all' && t.type !== filterType.value) {
      return false
    }

    return true
  })
})

// Baris Laporan dengan Saldo Kumulatif Berjalan
const reportRows = computed(() => {
  // Urutkan dari transaksi paling awal ke transaksi terbaru untuk menghitung saldo berjalan
  const sorted = [...rawFilteredTransactions.value].sort((a, b) => {
    const da = new Date(`${a.date} ${a.time || '00:00'}`)
    const db = new Date(`${b.date} ${b.time || '00:00'}`)
    return da - db
  })

  let balance = 0
  return sorted.map(t => {
    const amt = Number(t.amount) || 0
    if (t.type === 'income') {
      balance += amt
    } else {
      balance -= amt
    }
    return {
      ...t,
      runningBalance: balance
    }
  })
})

// Ringkasan KPI Finansial
const summaryIncome = computed(() => {
  return reportRows.value
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0)
})

const summaryExpense = computed(() => {
  return reportRows.value
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0)
})

const summaryNet = computed(() => {
  return summaryIncome.value - summaryExpense.value
})

function formatNumber(num) {
  return (num || 0).toLocaleString('id-ID')
}

// ========================================================
// 1. GENERATOR & DOWNLOAD FILE MICROSOFT EXCEL (.XLS)
// ========================================================
function downloadExcel() {
  const periodLabel = reportMode.value === 'daily' 
    ? `Harian_${selectedDate.value}` 
    : `Bulanan_${selectedYear.value}_${selectedMonth.value + 1}`

  const fileName = `Laporan_Mutasi_${periodLabel}.xls`
  const titleText = reportMode.value === 'daily'
    ? `LAPORAN MUTASI KEUANGAN HARIAN (${selectedDate.value})`
    : `LAPORAN MUTASI KEUANGAN BULANAN (${monthNames[selectedMonth.value]} ${selectedYear.value})`

  const xmlContent = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Author>CAKUE Financial System</Author>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="TitleStyle">
   <Font ss:FontName="Calibri" ss:Size="15" ss:Bold="1" ss:Color="#107C41"/>
  </Style>
  <Style ss:ID="SubTitleStyle">
   <Font ss:FontName="Calibri" ss:Size="10" ss:Italic="1" ss:Color="#555555"/>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#107C41" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="DataText">
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="DataCenter">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="DataNumberIncome">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Color="#008000" ss:Bold="1"/>
   <NumberFormat ss:Format="#,##0"/>
  </Style>
  <Style ss:ID="DataNumberExpense">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Color="#C00000" ss:Bold="1"/>
   <NumberFormat ss:Format="#,##0"/>
  </Style>
  <Style ss:ID="DataNumberBalance">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Bold="1"/>
   <NumberFormat ss:Format="#,##0"/>
  </Style>
  <Style ss:ID="TotalLabel">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Bold="1"/>
   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="TotalNumber">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Bold="1"/>
   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="#,##0"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Mutasi Transaksi">
  <Table>
   <Column ss:Width="35"/>
   <Column ss:Width="110"/>
   <Column ss:Width="80"/>
   <Column ss:Width="220"/>
   <Column ss:Width="110"/>
   <Column ss:Width="120"/>
   <Column ss:Width="110"/>
   <Column ss:Width="110"/>
   <Column ss:Width="110"/>
   
   <!-- Title Block -->
   <Row ss:Height="24">
    <Cell ss:MergeAcross="8" ss:StyleID="TitleStyle"><Data ss:Type="String">${escapeXml(titleText)}</Data></Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="8" ss:StyleID="SubTitleStyle"><Data ss:Type="String">Pemilik: ${escapeXml(authStore.personalUser?.name || 'Budi Santoso')} | Dicetak: ${new Date().toLocaleString('id-ID')}</Data></Cell>
   </Row>
   <Row ss:Height="12"></Row>

   <!-- Header Row -->
   <Row ss:Height="24">
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">No</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Tanggal &amp; Waktu</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">ID Ref</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Deskripsi / Keterangan</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Kategori</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Rekening / Dompet</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Pemasukan (Debet)</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Pengeluaran (Kredit)</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Saldo Kumulatif</Data></Cell>
   </Row>

   <!-- Data Rows -->
   ${reportRows.value.map((r, i) => `
   <Row ss:Height="20">
    <Cell ss:StyleID="DataCenter"><Data ss:Type="Number">${i + 1}</Data></Cell>
    <Cell ss:StyleID="DataText"><Data ss:Type="String">${escapeXml(r.date)} ${escapeXml(r.time || '')}</Data></Cell>
    <Cell ss:StyleID="DataCenter"><Data ss:Type="String">${escapeXml(r.id)}</Data></Cell>
    <Cell ss:StyleID="DataText"><Data ss:Type="String">${escapeXml(r.desc)}</Data></Cell>
    <Cell ss:StyleID="DataText"><Data ss:Type="String">${escapeXml(r.category)}</Data></Cell>
    <Cell ss:StyleID="DataText"><Data ss:Type="String">${escapeXml(r.account)}</Data></Cell>
    <Cell ss:StyleID="${r.type === 'income' ? 'DataNumberIncome' : 'DataCenter'}"><Data ss:Type="${r.type === 'income' ? 'Number' : 'String'}">${r.type === 'income' ? r.amount : '-'}</Data></Cell>
    <Cell ss:StyleID="${r.type === 'expense' ? 'DataNumberExpense' : 'DataCenter'}"><Data ss:Type="${r.type === 'expense' ? 'Number' : 'String'}">${r.type === 'expense' ? r.amount : '-'}</Data></Cell>
    <Cell ss:StyleID="DataNumberBalance"><Data ss:Type="Number">${r.runningBalance}</Data></Cell>
   </Row>
   `).join('')}

   <!-- Grand Total Row -->
   <Row ss:Height="24">
    <Cell ss:MergeAcross="5" ss:StyleID="TotalLabel"><Data ss:Type="String">TOTAL KESELURUHAN:</Data></Cell>
    <Cell ss:StyleID="TotalNumber"><Data ss:Type="Number">${summaryIncome.value}</Data></Cell>
    <Cell ss:StyleID="TotalNumber"><Data ss:Type="Number">${summaryExpense.value}</Data></Cell>
    <Cell ss:StyleID="TotalNumber"><Data ss:Type="Number">${summaryNet.value}</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`

  const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' })
  triggerBlobDownload(blob, fileName)
}

// ========================================================
// 2. GENERATOR & DOWNLOAD FILE CSV UTF-8
// ========================================================
function downloadCsv() {
  const periodLabel = reportMode.value === 'daily' 
    ? `Harian_${selectedDate.value}` 
    : `Bulanan_${selectedYear.value}_${selectedMonth.value + 1}`

  const fileName = `Laporan_Mutasi_${periodLabel}.csv`
  
  const headers = [
    'No',
    'Tanggal & Waktu',
    'ID Ref',
    'Keterangan / Deskripsi',
    'Kategori',
    'Rekening / Dompet',
    'Pemasukan (Debet)',
    'Pengeluaran (Kredit)',
    'Saldo Kumulatif'
  ]

  const rows = reportRows.value.map((r, idx) => [
    idx + 1,
    `"${r.date} ${r.time || ''}"`,
    `"${r.id}"`,
    `"${(r.desc || '').replace(/"/g, '""')}"`,
    `"${r.category || ''}"`,
    `"${r.account || ''}"`,
    r.type === 'income' ? r.amount : 0,
    r.type === 'expense' ? r.amount : 0,
    r.runningBalance
  ])

  // Baris Total
  rows.push([
    '',
    '"TOTAL"',
    '""',
    '""',
    '""',
    '""',
    summaryIncome.value,
    summaryExpense.value,
    summaryNet.value
  ])

  const csvContent = '\uFEFF' + [
    headers.join(';'),
    ...rows.map(e => e.join(';'))
  ].join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  triggerBlobDownload(blob, fileName)
}

function triggerBlobDownload(blob, fileName) {
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function escapeXml(unsafe) {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
