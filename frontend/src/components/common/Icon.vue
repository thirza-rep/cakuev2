<template>
  <svg 
    :class="['inline-block shrink-0 fill-none stroke-current', customClass]" 
    :stroke-width="strokeWidth" 
    stroke-linecap="round" 
    stroke-linejoin="round" 
    viewBox="0 0 24 24"
  >
    <!-- Wallet / Dompet -->
    <path v-if="name === 'wallet'" d="M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M18 12a2 2 0 0 0 0 4h4v-4z" />

    <!-- Credit Card / Rekening -->
    <template v-else-if="name === 'credit-card'">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </template>

    <!-- Arrow Down Left (Pemasukan) -->
    <path v-else-if="name === 'income'" d="M17 7L7 17M7 17H17M7 17V7" />

    <!-- Arrow Up Right (Pengeluaran) -->
    <path v-else-if="name === 'expense'" d="M7 17L17 7M17 7H7M17 7V17" />

    <!-- Plus -->
    <path v-else-if="name === 'plus'" d="M12 5v14M5 12h14" />

    <!-- Minus -->
    <path v-else-if="name === 'minus'" d="M5 12h14" />

    <!-- Debt / Utang Piutang (Scale) -->
    <template v-else-if="name === 'debt'">
      <path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/>
      <path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/>
      <path d="M7 21h10"/>
      <path d="M12 3v18"/>
      <path d="M3 7h18"/>
    </template>

    <!-- Store / Toko POS -->
    <path v-else-if="name === 'store'" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />

    <!-- Building / Multi-Cabang -->
    <template v-else-if="name === 'building'">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>
    </template>

    <!-- Box / Inventaris Stok -->
    <template v-else-if="name === 'box'">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </template>

    <!-- Truck / Surat Jalan In-Transit -->
    <template v-else-if="name === 'truck'">
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </template>

    <!-- Receipt / Struk Kasir -->
    <template v-else-if="name === 'receipt'">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/>
      <line x1="8" y1="8" x2="16" y2="8"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
      <line x1="8" y1="16" x2="12" y2="16"/>
    </template>

    <!-- Sparkles / AI Copilot -->
    <path v-else-if="name === 'sparkles'" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />

    <!-- Check -->
    <polyline v-else-if="name === 'check'" points="20 6 9 17 4 12" />

    <!-- Alert / Warning -->
    <template v-else-if="name === 'alert'">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </template>

    <!-- Search -->
    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </template>

    <!-- Printer -->
    <template v-else-if="name === 'printer'">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
      <rect x="6" y="14" width="12" height="8"/>
    </template>

    <!-- Share (WhatsApp) -->
    <template v-else-if="name === 'share'">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </template>

    <!-- Trash -->
    <template v-else-if="name === 'trash'">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </template>

    <!-- Close / X -->
    <path v-else-if="name === 'close'" d="M18 6L6 18M6 6l12 12" />

    <!-- Users / Role -->
    <template v-else-if="name === 'users'">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </template>

    <!-- Pie Chart / Laporan -->
    <template v-else-if="name === 'chart'">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
      <path d="M22 12A10 10 0 0 0 12 2v10z"/>
    </template>

    <!-- Settings -->
    <template v-else-if="name === 'settings'">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </template>

    <!-- Logout -->
    <path v-else-if="name === 'logout'" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />

    <!-- Chevron Right -->
    <polyline v-else-if="name === 'chevron-right'" points="9 18 15 12 9 6" />

    <!-- Chevron Down -->
    <polyline v-else-if="name === 'chevron-down'" points="6 9 12 15 18 9" />

    <!-- Chevron Left -->
    <polyline v-else-if="name === 'chevron-left'" points="15 18 9 12 15 6" />

    <!-- Hamburger Menu -->
    <template v-else-if="name === 'menu'">
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </template>

    <!-- Sidebar Layout -->
    <template v-else-if="name === 'sidebar'">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="9" y1="3" x2="9" y2="21"/>
    </template>

    <!-- Lock / Terkunci -->
    <template v-else-if="name === 'lock'">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </template>

    <!-- Shield / Hak Akses Keamanan -->
    <path v-else-if="name === 'shield'" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />

    <!-- Home (Beranda) -->
    <template v-else-if="name === 'home'">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </template>

    <!-- QRIS / Scan Box Frame -->
    <template v-else-if="name === 'qris' || name === 'scan'">
      <path d="M3 8V5a2 2 0 0 1 2-2h3"/>
      <path d="M16 3h3a2 2 0 0 1 2 2v3"/>
      <path d="M21 16v3a2 2 0 0 1-2 2h-3"/>
      <path d="M8 21H5a2 2 0 0 1-2-2v-3"/>
      <rect x="7" y="7" width="10" height="10" rx="1.5"/>
      <rect x="10" y="10" width="4" height="4"/>
    </template>

    <!-- Star (Untukmu / Favorit) -->
    <polygon v-else-if="name === 'star'" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />

    <!-- User / Akun Saya -->
    <template v-else-if="name === 'user'">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </template>

    <!-- Camera / Scanner -->
    <template v-else-if="name === 'camera'">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </template>

    <!-- Transfer Antar Rekening -->
    <template v-else-if="name === 'transfer'">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </template>

    <!-- Edit (Pensil) -->
    <template v-else-if="name === 'edit'">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </template>

    <!-- Smartphone (E-Wallet) -->
    <template v-else-if="name === 'smartphone' || name === 'phone'">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
      <line x1="12" y1="18" x2="12.01" y2="18"/>
    </template>

    <!-- Cash / Banknote (Uang Tunai) -->
    <template v-else-if="name === 'cash' || name === 'money'">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <circle cx="12" cy="12" r="2"/>
      <path d="M6 12h.01M18 12h.01"/>
    </template>

    <!-- History (Riwayat / Jam) -->
    <template v-else-if="name === 'history'">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </template>
  </svg>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  customClass: {
    type: String,
    default: 'w-5 h-5'
  },
  strokeWidth: {
    type: [Number, String],
    default: 1.8
  }
})
</script>
