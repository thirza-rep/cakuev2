<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md">
    <!-- Backdrop dismiss -->
    <div @click="$emit('close')" class="absolute inset-0"></div>

    <!-- Modal Box Container -->
    <div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh] animate-fade-in">
      <!-- 1. Header with Gradient Accent -->
      <div class="bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-800 p-5 text-white flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-emerald-400/30 flex items-center justify-center font-black text-xl text-emerald-300 shadow-inner">
            CK
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base sm:text-lg font-black tracking-tight">Tentang Aplikasi CAKUE</h2>
              <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-300/30 font-bold uppercase">
                v2.4 Live
              </span>
            </div>
            <p class="text-xs text-emerald-100/90">Catatan Keuangan Gue — Dompet Pribadi & ERP Usaha</p>
          </div>
        </div>

        <button 
          @click="$emit('close')" 
          type="button" 
          class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Tutup"
        >
          <Icon name="close" custom-class="w-4 h-4" />
        </button>
      </div>

      <!-- 2. Sub-Navigation Tabs -->
      <div class="grid grid-cols-4 bg-slate-100 p-1.5 border-b border-slate-200 text-xs font-bold text-center">
        <button 
          @click="activeTab = 'about'"
          type="button"
          :class="[
            'py-2 rounded-xl transition-all cursor-pointer truncate',
            activeTab === 'about' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          Mengenai CAKUE
        </button>

        <button 
          @click="activeTab = 'guide'"
          type="button"
          :class="[
            'py-2 rounded-xl transition-all cursor-pointer truncate',
            activeTab === 'guide' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          Panduan Pakai
        </button>

        <button 
          @click="activeTab = 'tech'"
          type="button"
          :class="[
            'py-2 rounded-xl transition-all cursor-pointer truncate',
            activeTab === 'tech' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          Arsitektur
        </button>

        <button 
          @click="activeTab = 'developer'"
          type="button"
          :class="[
            'py-2 rounded-xl transition-all cursor-pointer truncate',
            activeTab === 'developer' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          Pengembang
        </button>
      </div>

      <!-- 3. Modal Body (Scrollable) -->
      <div class="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        
        <!-- ============================================== -->
        <!-- TAB 1: MENGENAI CAKUE & LATAR BELAKANG -->
        <!-- ============================================== -->
        <div v-if="activeTab === 'about'" class="space-y-4">
          <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
            <div class="font-black text-sm text-emerald-900">Visi & Tujuan CAKUE</div>
            <p class="text-xs text-emerald-800">
              Mengakhiri masalah klasik UMKM dan nasabah pribadi: <strong>pencampuran uang belanja harian dengan perputaran modal usaha</strong> yang sering mengakibatkan usaha bangkrut tanpa disadari.
            </p>
          </div>

          <div class="space-y-3">
            <h3 class="font-extrabold text-sm text-slate-900">Dua Portal Mandiri (Pemisahan Mutlak)</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div class="font-bold text-slate-900 flex items-center gap-1.5">
                  <Icon name="wallet" custom-class="w-4 h-4 text-emerald-700" />
                  <span>Portal Nasabah Pribadi</span>
                </div>
                <p class="text-slate-600">
                  Pencatatan kas personal bergaya mobile banking: kartu rekening digital (BCA, Mandiri, Cash), pos kantong tabungan terencana, dan buku utang-piutang.
                </p>
              </div>

              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div class="font-bold text-slate-900 flex items-center gap-1.5">
                  <Icon name="store" custom-class="w-4 h-4 text-teal-700" />
                  <span>Portal Usaha & UMKM (ERP)</span>
                </div>
                <p class="text-slate-600">
                  Sistem ERP ritel lengkap: kasir POS cepat, multi-cabang & multi-gudang, manajemen stok dengan surat jalan, dan akuntansi double-entry seimbang.
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <h3 class="font-extrabold text-sm text-slate-900">Komitmen $0 Biaya Langganan</h3>
            <p class="text-slate-600">
              CAKUE dirancang untuk berjalan mandiri di infrastruktur Anda sendiri tanpa kewajiban membayar biaya SaaS bulanan ataupun komisi penjualan.
            </p>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- TAB 2: PANDUAN PENGGUNAAN LENGKAP -->
        <!-- ============================================== -->
        <div v-else-if="activeTab === 'guide'" class="space-y-5">
          <div class="space-y-3">
            <div class="flex items-center gap-2 font-black text-sm text-slate-900">
              <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">1</span>
              <span>Panduan Penggunaan Portal Pribadi</span>
            </div>
            <ul class="space-y-2 pl-4 border-l-2 border-emerald-300 text-xs text-slate-600">
              <li><strong>Tombol "Catat" (Tengah):</strong> Tekan tombol melayang hijau di dasar layar untuk mencatat pengeluaran atau pemasukan secara instan dengan chip nominal cepat.</li>
              <li><strong>Kantong Rekening:</strong> Masukkan dana ke pos tertentu (misal: Dana Darurat, Tabungan Liburan, Biaya Sekolah).</li>
              <li><strong>Buku Utang & Piutang:</strong> Catat pinjaman uang atau piutang rekanan lengkap dengan tanggal jatuh tempo.</li>
            </ul>
          </div>

          <div class="space-y-3 pt-2">
            <div class="flex items-center gap-2 font-black text-sm text-slate-900">
              <span class="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs">2</span>
              <span>Panduan Penggunaan Portal Usaha (ERP & POS)</span>
            </div>
            <ul class="space-y-2 pl-4 border-l-2 border-teal-300 text-xs text-slate-600">
              <li><strong>Kasir POS Toko:</strong> Pilih produk atau ketik barcode, tentukan diskon jika ada, dan proses transaksi pembayaran tunai/transfer.</li>
              <li><strong>Kirim Struk WhatsApp:</strong> Pada jendela struk, klik "Kirim via WhatsApp" untuk mengirim bukti transaksi digital ke HP pelanggan secara otomatis.</li>
              <li><strong>Multi-Cabang & Surat Jalan:</strong> Lakukan mutasi stok dari Gudang Pusat ke Cabang Toko. Stok in-transit tercatat rapi sampai dikonfirmasi sampai.</li>
              <li><strong>Simulasi Hak Akses (RBAC):</strong> Di pojok kanan atas, Anda dapat beralih peran antara Owner, Manajer, Kasir, atau Staff Gudang untuk menguji izin menu.</li>
            </ul>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- TAB 3: ARSITEKTUR TEKNOLOGI LOKAL -->
        <!-- ============================================== -->
        <div v-else-if="activeTab === 'tech'" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div class="font-bold text-slate-900">Frontend Web</div>
              <div class="text-xs text-slate-600">Vue 3, Vite, Tailwind CSS, Pinia State Management, Heroicons Vector.</div>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div class="font-bold text-slate-900">Backend API</div>
              <div class="text-xs text-slate-600">Node.js Express REST API Daemon (Port 3001) dengan proteksi CORS & RBAC.</div>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div class="font-bold text-slate-900">Database Engine</div>
              <div class="text-xs text-slate-600">PostgreSQL 16 ACID-compliant di Home Server CasaOS (`192.168.1.13:5433`).</div>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div class="font-bold text-slate-900">WhatsApp Gateway</div>
              <div class="text-xs text-slate-600">Baileys WebSocket WhatsApp Engine lokal (Port 3333) bebas biaya per pesan.</div>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div class="font-bold text-slate-900">Jaringan & Keamanan Cloudflare Tunnel</div>
            <p class="text-xs text-slate-600 leading-relaxed">
              Dapat diakses aman secara publik tanpa perlu membuka port router berbahaya atau menyewa IP publik statis yang mahal.
            </p>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- TAB 4: DEVELOPER & PENGEMBANG -->
        <!-- ============================================== -->
        <div v-else-if="activeTab === 'developer'" class="space-y-4">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
            <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-md">
              WS
            </div>
            <div>
              <div class="font-black text-base text-slate-900">Tim Pengembang CAKUE</div>
              <div class="text-xs text-slate-500 font-mono mt-0.5">Warga Sipil & Antigravity AI Pair Programmer</div>
            </div>
            <p class="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Aplikasi ini dikembangkan secara mandiri pada mesin Apple Silicon Mac dan Home Server CasaOS lokal untuk mewujudkan sistem keuangan yang berdaulat, bebas biaya sewa, dan mudah dipelihara.
            </p>
          </div>

          <div class="text-center text-xs text-slate-500 space-y-1">
            <div>Status Lisensi: <strong>Open Source & Bebas Komersialisasi Mandiri</strong></div>
            <div>Dibuat dengan dedikasi untuk kemajuan UMKM dan pencatatan kas di Indonesia.</div>
          </div>
        </div>

      </div>

      <!-- 4. Footer Action -->
      <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        <span class="text-[11px] font-mono text-slate-500">CAKUE v2.4 (Enterprise Edition)</span>
        <button 
          @click="$emit('close')"
          type="button" 
          class="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
        >
          Tutup Panduan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Icon from '../common/Icon.vue'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])

const activeTab = ref('about')
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.25s ease-out;
}
</style>
