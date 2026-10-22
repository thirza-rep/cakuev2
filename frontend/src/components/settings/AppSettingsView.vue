<template>
  <div class="space-y-6 max-w-6xl mx-auto pb-12">
    <!-- 1. RBAC FALLBACK GUARD: KASIR & STAFF GUDANG TERKUNCI TOTAL -->
    <div v-if="!canAccessSettings" class="p-8 bg-white border border-rose-200 rounded-3xl shadow-xs text-center space-y-4 max-w-xl mx-auto mt-12">
      <div class="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
        <Icon name="lock" custom-class="w-8 h-8 text-rose-600" />
      </div>
      <div>
        <h2 class="text-xl font-black text-slate-900">Akses Ditolak (RBAC Restriction)</h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
          Modul <strong>Pengaturan Aplikasi & Sistem Toko</strong> merupakan area terbatas yang hanya dapat diakses oleh tingkat manajemen usaha (<strong>Owner</strong> dan <strong>Manajer Cabang</strong>).
        </p>
      </div>
      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 inline-block text-xs font-mono font-bold text-slate-600">
        Peran Anda: <span class="capitalize text-rose-700">{{ authStore.activeBusinessRole }}</span> ({{ authStore.currentRoleConfig.title }})
      </div>
      <div class="pt-2">
        <button 
          @click="$emit('navigate', authStore.currentRoleConfig.defaultModule)" 
          type="button" 
          class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Kembali ke Modul Operasional Saya
        </button>
      </div>
    </div>

    <!-- 2. TAMPILAN PENGATURAN APLIKASI DENGAN INNER-SIDEBAR (POIN 2) -->
    <div v-else class="space-y-6">
      
      <!-- Top Header Page -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Icon name="settings" custom-class="w-5 h-5 text-white" />
            </div>
            <span>Pengaturan Aplikasi & Toko</span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Konfigurasi identitas master brand, alamat cabang, payment gateway, struk kasir thermal, dan integrasi WhatsApp.
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button 
            v-if="authStore.isOwner"
            @click="handleReset"
            type="button"
            class="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            title="Kembalikan semua ke default awal"
          >
            <Icon name="history" custom-class="w-4 h-4" />
            <span>Reset Default</span>
          </button>

          <button 
            @click="saveAllSettings"
            type="button"
            class="px-5 py-2 text-xs sm:text-sm font-extrabold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
          >
            <Icon name="check" custom-class="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      <!-- Alert Sukses Simpan -->
      <transition name="fade">
        <div v-if="alertMessage" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center justify-between text-xs sm:text-sm shadow-xs">
          <div class="flex items-center gap-2.5 font-bold">
            <Icon name="check" custom-class="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{{ alertMessage }}</span>
          </div>
          <button @click="alertMessage = ''" class="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer text-xs">
            Tutup
          </button>
        </div>
      </transition>

      <!-- LAYOUT INNER-SIDEBAR (DESKTOP: BILAH KIRI | MOBILE: HORIZONTAL TABS) -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        <!-- INNER SIDEBAR NAVIGATION (BILAH KIRI) -->
        <aside class="md:col-span-4 lg:col-span-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div class="px-3 py-2 text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider hidden md:block">
            Kategori Pengaturan
          </div>

          <!-- Navigasi Menu Inner-Sidebar -->
          <nav class="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
            <button
              v-for="cat in settingCategories"
              :key="cat.id"
              @click="activeCategory = cat.id"
              type="button"
              :class="[
                'w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-left shrink-0 md:shrink',
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              ]"
            >
              <div class="flex items-center gap-2.5 truncate">
                <Icon 
                  :name="cat.icon" 
                  custom-class="w-4 h-4 shrink-0" 
                  :class="activeCategory === cat.id ? 'text-white' : 'text-slate-500'" 
                />
                <span class="truncate">{{ cat.label }}</span>
              </div>

              <!-- Badge Status RBAC -->
              <span 
                v-if="cat.ownerOnly && !authStore.isOwner" 
                class="hidden md:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-600 shrink-0 ml-1"
                title="Khusus Owner (Read-Only untuk Manajer)"
              >
                🔒 Read
              </span>
            </button>
          </nav>

          <!-- Info RBAC Role Banner di Kaki Inner Sidebar -->
          <div class="p-3 bg-slate-50 border border-slate-100 rounded-xl mt-3 hidden md:block text-[11px] space-y-1">
            <div class="flex items-center justify-between text-slate-500">
              <span>Sesi Anda:</span>
              <span class="font-bold font-mono text-slate-800">{{ authStore.activeBusinessRole.toUpperCase() }}</span>
            </div>
            <div class="text-[10px] text-slate-400 leading-tight">
              {{ authStore.isOwner ? 'Wewenang penuh konfigurasi sistem.' : 'Wewenang terbatas: Alamat & Printer Cabang.' }}
            </div>
          </div>
        </aside>

        <!-- KONTEN KATEGORI AKTIF (BILAH KANAN) -->
        <main class="md:col-span-8 lg:col-span-9 bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-xs min-h-[460px]">
          
          <!-- KATEGORI 1: IDENTITAS BRAND & LOGO MASTER -->
          <div v-if="activeCategory === 'brand'" class="space-y-6">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 class="text-base sm:text-lg font-black text-slate-900">Identitas Brand & Logo Master</h2>
                <p class="text-xs text-slate-500">Nama usaha dan logo master aplikasi yang tercetak di header ERP & nota struk.</p>
              </div>
              <span v-if="!authStore.isOwner" class="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                🔒 Khusus Owner (Read-Only)
              </span>
            </div>

            <!-- Banner Peringatan jika bukan Owner -->
            <div v-if="!authStore.isOwner" class="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <Icon name="lock" custom-class="w-4 h-4 text-amber-700 shrink-0" />
              <span>Identitas Brand dan Logo Master hanya dapat diubah oleh <strong>Owner</strong> demi menjaga konsistensi identitas merek usaha.</span>
            </div>

            <!-- Logo Master Picker -->
            <div class="space-y-3">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Logo Usaha (Penyimpanan Lokal)</label>
              <div class="flex items-center gap-4">
                <!-- Preview Box -->
                <div class="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  <img 
                    v-if="formBranding.logo" 
                    :src="formBranding.logo" 
                    alt="App Logo" 
                    class="w-full h-full object-contain p-1"
                  />
                  <div v-else class="text-center p-2 text-slate-400">
                    <Icon name="box" custom-class="w-6 h-6 mx-auto mb-1 text-slate-400" />
                    <span class="text-[10px] font-bold block leading-tight">Default</span>
                  </div>
                </div>

                <!-- Upload Controls -->
                <div v-if="authStore.isOwner" class="space-y-2">
                  <input 
                    ref="logoFileInput"
                    type="file" 
                    accept="image/png, image/jpeg, image/svg+xml, image/webp" 
                    class="hidden" 
                    @change="handleLogoFileSelect"
                  />
                  <div class="flex flex-wrap gap-2">
                    <button 
                      @click="triggerLogoUpload" 
                      type="button" 
                      class="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Icon name="sparkles" custom-class="w-3.5 h-3.5" />
                      <span>Pilih Logo dari Perangkat</span>
                    </button>
                    <button 
                      v-if="formBranding.logo" 
                      @click="removeLogo" 
                      type="button" 
                      class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                  <p class="text-[11px] text-slate-400">Format: PNG, JPG, WebP, SVG (Maks. 2MB).</p>
                </div>
                <div v-else class="text-xs text-slate-400 font-medium">
                  Logo master usaha aktif (Terkunci untuk akun manajer).
                </div>
              </div>
            </div>

            <!-- Nama Aplikasi & Slogan -->
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold uppercase text-slate-600 mb-1.5">Nama Aplikasi / Usaha Master</label>
                <input 
                  v-model="formBranding.appName" 
                  :disabled="!authStore.isOwner"
                  type="text" 
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase text-slate-600 mb-1.5">Slogan / Deskripsi Usaha</label>
                <input 
                  v-model="formBranding.appSubtitle" 
                  :disabled="!authStore.isOwner"
                  type="text" 
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <!-- KATEGORI 2: ALAMAT USAHA & GOOGLE MAPS -->
          <div v-else-if="activeCategory === 'address'" class="space-y-6">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 class="text-base sm:text-lg font-black text-slate-900">Alamat Usaha & Google Maps</h2>
                <p class="text-xs text-slate-500">Lokasi resmi toko yang dicetak pada bagian footer nota struk kasir.</p>
              </div>
              <span class="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Akses: Owner & Manajer
              </span>
            </div>

            <!-- Banner Jalan Pintas ke Multi-Cabang & Outlet -->
            <div class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Icon name="building" custom-class="w-5 h-5 text-white" />
                </div>
                <div>
                  <div class="text-xs font-bold text-slate-900">Ingin Menambah Cabang Baru atau Kelola Multi-Outlet?</div>
                  <div class="text-[11px] text-slate-500">Penambahan cabang, penetapan manajer, dan status buka/tutup toko dapat diatur di modul khusus Cabang & Outlet.</div>
                </div>
              </div>
              <button 
                @click="$emit('navigate', 'branches')"
                type="button"
                class="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Buka Menu Cabang</span>
                <span>→</span>
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold uppercase text-slate-600 mb-1.5">Alamat Lengkap Toko</label>
                <textarea 
                  v-model="formAddress.address" 
                  rows="2"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label class="block text-xs font-bold uppercase text-slate-600 mb-1.5">Koordinat GPS (Lat, Long)</label>
                  <input 
                    v-model="formAddress.coordinates" 
                    type="text" 
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
                  />
                </div>
                <div class="flex items-end">
                  <a 
                    :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formAddress.coordinates || formAddress.address)}`" 
                    target="_blank" 
                    rel="noopener"
                    class="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-300"
                  >
                    <Icon name="chart" custom-class="w-4 h-4 text-emerald-700" />
                    <span>Buka di Google Maps ↗</span>
                  </a>
                </div>
              </div>

              <!-- Peta Interaktif Preview -->
              <div class="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-52 relative">
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameborder="0" 
                  scrolling="no" 
                  :src="`https://maps.google.com/maps?q=${encodeURIComponent(formAddress.coordinates || formAddress.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`"
                  class="w-full h-full filter saturate-150"
                ></iframe>
                <div class="absolute bottom-2 left-2 px-2.5 py-1 bg-white/90 backdrop-blur-xs rounded-lg text-[10px] font-bold text-slate-700 shadow-xs border border-slate-200">
                  📍 Pin Lokasi Toko
                </div>
              </div>
            </div>
          </div>

          <!-- KATEGORI 3: PAYMENT GATEWAY (QRIS, VA) & PAJAK PPN -->
          <div v-else-if="activeCategory === 'payment'" class="space-y-6">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 class="text-base sm:text-lg font-black text-slate-900">Payment Gateway & Pajak PPN</h2>
                <p class="text-xs text-slate-500">Integrasi otomatisasi settlement pembayaran QRIS dan tarif pajak penjualan kasir.</p>
              </div>
              <span v-if="!authStore.isOwner" class="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                🔒 Khusus Owner
              </span>
            </div>

            <!-- Kartu Status Payment Gateway (QRIS, VA) -->
            <div class="p-5 bg-gradient-to-br from-amber-50/60 to-slate-50 border border-amber-200/80 rounded-2xl space-y-3.5">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-start gap-3">
                  <div class="p-2 bg-amber-500 text-white rounded-xl shadow-xs mt-0.5">
                    <Icon name="sparkles" custom-class="w-5 h-5" />
                  </div>
                  <div>
                    <h3 class="text-sm font-extrabold text-slate-900">Integrasi Payment Gateway Otomatis</h3>
                    <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                      Fitur QRIS Dinamis & Virtual Account sedang dalam finalisasi arsitektur. Anda nantinya dapat menerima pembayaran QRIS langsung dari kasir POS dan uang otomatis masuk ke rekening bank Anda tanpa perlu cek mutasi manual.
                    </p>
                  </div>
                </div>
                <span class="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-mono font-extrabold text-[10px] rounded-lg tracking-wider shrink-0">
                  COMING SOON
                </span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                <div 
                  v-for="provider in settingsStore.paymentGateway.supportedProviders" 
                  :key="provider"
                  class="px-3 py-2 bg-white border border-slate-200 rounded-xl text-center font-bold text-xs text-slate-700 shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>{{ provider }}</span>
                </div>
              </div>
            </div>

            <!-- Pengaturan Pajak PPN Finansial -->
            <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input 
                    type="checkbox" 
                    v-model="formFinancial.taxEnabled" 
                    :disabled="!authStore.isOwner"
                    class="rounded text-emerald-600" 
                  />
                  <span>Terapkan Pajak PPN pada Transaksi Kasir POS</span>
                </label>
                <span class="text-xs font-mono font-bold text-emerald-700">
                  {{ formFinancial.taxEnabled ? `${formFinancial.taxRate}% Aktif` : 'Nonaktif (0%)' }}
                </span>
              </div>

              <div v-if="formFinancial.taxEnabled" class="space-y-2 pt-1">
                <div class="flex items-center gap-2">
                  <button 
                    v-for="rate in [0, 10, 11]" 
                    :key="rate"
                    type="button"
                    :disabled="!authStore.isOwner"
                    @click="formFinancial.taxRate = rate"
                    :class="[
                      'px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer',
                      formFinancial.taxRate === rate ? 'bg-emerald-700 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    ]"
                  >
                    {{ rate }}%
                  </button>
                  <div class="flex items-center gap-1 ml-auto">
                    <span class="text-xs text-slate-500">Kustom:</span>
                    <input 
                      v-model.number="formFinancial.taxRate" 
                      :disabled="!authStore.isOwner"
                      type="number" 
                      min="0" 
                      max="100" 
                      class="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-900"
                    />
                    <span class="text-xs font-bold text-slate-600">%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Rekening Settlement Bank -->
            <div class="space-y-3">
              <label class="block text-xs font-bold uppercase text-slate-600">Rekening Settlement Penerimaan Usaha</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] text-slate-500 mb-1">Nama Bank / Provider</label>
                  <input 
                    v-model="formFinancial.settlementBank" 
                    :disabled="!authStore.isOwner"
                    type="text" 
                    class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label class="block text-[11px] text-slate-500 mb-1">Nomor Rekening</label>
                  <input 
                    v-model="formFinancial.settlementAccountNo" 
                    :disabled="!authStore.isOwner"
                    type="text" 
                    class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label class="block text-[11px] text-slate-500 mb-1">Atas Nama Rekening</label>
                <input 
                  v-model="formFinancial.settlementAccountName" 
                  :disabled="!authStore.isOwner"
                  type="text" 
                  class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <!-- KATEGORI 4: STRUK KASIR & PRINTER POS THERMAL (58mm / 80mm) -->
          <div v-else-if="activeCategory === 'receipt'" class="space-y-6">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 class="text-base sm:text-lg font-black text-slate-900">Kustomisasi Struk Kasir & Printer POS</h2>
                <p class="text-xs text-slate-500">Pilih format kertas thermal (58mm vs 80mm) dan isi pesan nota transaksi.</p>
              </div>
              <span class="px-2.5 py-1 rounded-md text-xs font-mono font-extrabold bg-blue-100 text-blue-800">
                {{ formReceipt.paperSize.toUpperCase() }} THERMAL
              </span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <!-- Opsi Kustomisasi -->
              <div class="lg:col-span-7 space-y-4">
                <div>
                  <label class="block text-xs font-bold uppercase text-slate-600 mb-2">Ukuran Kertas Printer Thermal</label>
                  <div class="grid grid-cols-2 gap-3">
                    <button 
                      type="button" 
                      @click="formReceipt.paperSize = '58mm'"
                      :class="[
                        'p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between',
                        formReceipt.paperSize === '58mm' ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      ]"
                    >
                      <div>
                        <div class="font-extrabold text-xs">58 mm (Mobile)</div>
                        <div class="text-[10px] text-slate-500 mt-0.5">Printer Bluetooth mini kasir ritel</div>
                      </div>
                      <Icon v-if="formReceipt.paperSize === '58mm'" name="check" custom-class="w-4 h-4 text-blue-600 shrink-0" />
                    </button>

                    <button 
                      type="button" 
                      @click="formReceipt.paperSize = '80mm'"
                      :class="[
                        'p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between',
                        formReceipt.paperSize === '80mm' ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      ]"
                    >
                      <div>
                        <div class="font-extrabold text-xs">80 mm (Desktop)</div>
                        <div class="text-[10px] text-slate-500 mt-0.5">Printer USB/LAN supermarket lebar</div>
                      </div>
                      <Icon v-if="formReceipt.paperSize === '80mm'" name="check" custom-class="w-4 h-4 text-blue-600 shrink-0" />
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Pesan Sambutan Header</label>
                  <input 
                    v-model="formReceipt.headerMessage" 
                    type="text" 
                    placeholder="Contoh: Selamat Datang di Toko Berkah"
                    class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Pesan Garansi / Kebijakan Retur Footer</label>
                  <textarea 
                    v-model="formReceipt.footerMessage" 
                    rows="2"
                    placeholder="Contoh: Barang yang sudah dibeli tidak dapat ditukar kecuali ada garansi."
                    class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none resize-none"
                  ></textarea>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <label class="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 text-xs">
                    <input type="checkbox" v-model="formReceipt.showHeaderLogo" class="rounded text-blue-600" />
                    <span class="font-medium text-slate-700">Cetak Logo Toko</span>
                  </label>
                  <label class="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 text-xs">
                    <input type="checkbox" v-model="formReceipt.showQrCode" class="rounded text-blue-600" />
                    <span class="font-medium text-slate-700">Cetak QR Struk</span>
                  </label>
                  <label class="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 text-xs">
                    <input type="checkbox" v-model="formReceipt.showCashierName" class="rounded text-blue-600" />
                    <span class="font-medium text-slate-700">Nama Kasir</span>
                  </label>
                </div>
              </div>

              <!-- Live Thermal Paper Simulation Preview -->
              <div class="lg:col-span-5 bg-slate-100 p-4 rounded-2xl border border-slate-200 flex flex-col items-center">
                <div class="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Icon name="printer" custom-class="w-3.5 h-3.5 text-slate-600" />
                  <span>Simulasi Struk (Format {{ formReceipt.paperSize }})</span>
                </div>

                <div 
                  :class="[
                    'bg-white text-slate-900 p-4 rounded-lg shadow-md font-mono text-[10px] leading-tight select-none border border-slate-300 transition-all',
                    formReceipt.paperSize === '58mm' ? 'w-56' : 'w-72'
                  ]"
                >
                  <div class="text-center pb-2 border-b border-dashed border-slate-300 space-y-1">
                    <div v-if="formReceipt.showHeaderLogo && formBranding.logo" class="w-8 h-8 mx-auto overflow-hidden">
                      <img :src="formBranding.logo" class="w-full h-full object-contain" />
                    </div>
                    <div class="font-black text-xs">{{ formBranding.appName }}</div>
                    <div class="text-[9px] text-slate-500 truncate">{{ formAddress.address }}</div>
                    <div class="text-[8px] text-slate-400">{{ formReceipt.headerMessage }}</div>
                  </div>

                  <div class="py-1.5 border-b border-dashed border-slate-200 text-[8px] text-slate-500 space-y-0.5">
                    <div class="flex justify-between">
                      <span>No: INV-202610-001</span>
                      <span>15/10/26 10:45</span>
                    </div>
                    <div v-if="formReceipt.showCashierName" class="flex justify-between">
                      <span>Kasir: {{ authStore.businessUser.name }}</span>
                      <span>Cabang: Jkt-Sel</span>
                    </div>
                  </div>

                  <div class="py-2 border-b border-dashed border-slate-300 space-y-1 text-[9px]">
                    <div class="flex justify-between">
                      <span>Cakue Spesial Ayam x2</span>
                      <span class="font-bold">24.000</span>
                    </div>
                    <div class="flex justify-between">
                      <span>Es Teh Manis Jumbo x1</span>
                      <span class="font-bold">6.000</span>
                    </div>
                  </div>

                  <div class="py-1.5 border-b border-dashed border-slate-300 space-y-0.5 text-[9px]">
                    <div class="flex justify-between">
                      <span>Subtotal:</span>
                      <span>30.000</span>
                    </div>
                    <div v-if="formFinancial.taxEnabled" class="flex justify-between">
                      <span>PPN ({{ formFinancial.taxRate }}%):</span>
                      <span>{{ Math.round(30000 * formFinancial.taxRate / 100).toLocaleString('id-ID') }}</span>
                    </div>
                    <div class="flex justify-between font-bold text-xs pt-1 border-t border-slate-200">
                      <span>TOTAL:</span>
                      <span>Rp {{ (30000 + (formFinancial.taxEnabled ? Math.round(30000 * formFinancial.taxRate / 100) : 0)).toLocaleString('id-ID') }}</span>
                    </div>
                  </div>

                  <div class="text-center pt-2 text-[8px] text-slate-400 space-y-1">
                    <div>{{ formReceipt.footerMessage }}</div>
                    <div v-if="formReceipt.showQrCode" class="w-10 h-10 mx-auto bg-slate-900 text-white flex items-center justify-center font-bold text-[7px] rounded">
                      QR CODE
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- KATEGORI 5: NOTIFIKASI WHATSAPP GATEWAY (BAILEYS) -->
          <div v-else-if="activeCategory === 'whatsapp'" class="space-y-6">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 class="text-base sm:text-lg font-black text-slate-900">Notifikasi WhatsApp Gateway</h2>
                <p class="text-xs text-slate-500">Integrasi Baileys WA Gateway lokal mandiri untuk nota & alert stok kritis.</p>
              </div>
              <span class="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Gateway :3333
              </span>
            </div>

            <div class="space-y-4">
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input type="checkbox" v-model="formWhatsapp.criticalStockAlert" :disabled="!authStore.isOwner" class="rounded text-emerald-600" />
                  <span>Kirim Notifikasi Stok Kritis Otomatis ke WhatsApp Owner</span>
                </label>
                
                <div v-if="formWhatsapp.criticalStockAlert" class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label class="block text-[11px] text-slate-500 mb-1">Nomor WhatsApp Owner</label>
                    <input 
                      v-model="formWhatsapp.ownerPhoneAlert" 
                      :disabled="!authStore.isOwner"
                      type="tel" 
                      placeholder="081234567890"
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] text-slate-500 mb-1">Ambang Batas Minimum Peringatan</label>
                    <div class="flex items-center gap-1.5">
                      <input 
                        v-model.number="formWhatsapp.criticalStockThreshold" 
                        :disabled="!authStore.isOwner"
                        type="number" 
                        min="1" 
                        max="100"
                        class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                      />
                      <span class="text-xs text-slate-500 font-bold">unit</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Template Nota Struk WA -->
              <div>
                <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Template Struk WhatsApp ke Pelanggan</label>
                <textarea 
                  v-model="formWhatsapp.receiptTemplate" 
                  :disabled="!authStore.isOwner"
                  rows="4"
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none resize-none"
                ></textarea>
                <p class="text-[10px] text-slate-400 mt-1">Placeholder tersedia: {appName}, {invoiceNo}, {date}, {total}, {branchName}</p>
              </div>
            </div>
          </div>

          <!-- KATEGORI 6: GOOGLE OAUTH 2.0 & IDENTITY SERVICES -->
          <div v-if="activeCategory === 'oauth'" class="space-y-6">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google OAuth 2.0 & Identity Services</span>
                </h2>
                <p class="text-xs text-slate-500">Konfigurasi Google Client ID untuk login satu-klik dan daftar Authorized JavaScript Origins.</p>
              </div>
              <span class="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>Active</span>
              </span>
            </div>

            <!-- Banner Info -->
            <div class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1.5">
              <div class="font-bold flex items-center gap-2">
                <Icon name="shield-check" custom-class="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Terhubung ke Google Cloud Project: kelompok-464603</span>
              </div>
              <p class="text-[11px] text-emerald-800 leading-relaxed">
                Pengguna (Owner & Nasabah Pribadi) dapat langsung masuk menggunakan akun Google resmi tanpa perlu mengisi kata sandi secara manual.
              </p>
            </div>

            <!-- Form Client ID -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Google OAuth Client ID</label>
                <button 
                  v-if="authStore.isOwner"
                  type="button"
                  @click="formOAuth.googleClientId = '889806958266-7vki80et2obrnsp8ke79c24fd32ur99m.apps.googleusercontent.com'"
                  class="text-[11px] text-emerald-700 hover:underline font-semibold cursor-pointer"
                >
                  Gunakan Client ID Bawaan (kelompok-464603)
                </button>
              </div>
              <input 
                v-model="formOAuth.googleClientId" 
                :disabled="!authStore.isOwner"
                type="text" 
                placeholder="Contoh: 889806958266-xxxxxx.apps.googleusercontent.com" 
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
              <p class="text-[10px] text-slate-400">
                Client ID ini digunakan oleh library frontend Google Identity Services (GSI) untuk meminta token login.
              </p>
            </div>

            <!-- Whitelist Origins Card -->
            <div class="space-y-3 pt-2">
              <div>
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">Authorized JavaScript Origins (Google Cloud Console)</h3>
                <p class="text-[11px] text-slate-500 mt-0.5">
                  Daftar origin di bawah ini wajib dicantumkan pada Google Cloud Console agar Google mengizinkan dialog login:
                </p>
              </div>

              <div class="space-y-2">
                <div 
                  v-for="(item, idx) in authorizedOriginsList" 
                  :key="idx"
                  class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <div class="space-y-0.5">
                    <div class="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{{ item.url }}</span>
                      <span v-if="item.url === activeBrowserOrigin" class="px-1.5 py-0.5 rounded text-[9px] font-sans font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Browser Saat Ini
                      </span>
                    </div>
                    <div class="text-[11px] text-slate-500">{{ item.description }}</div>
                  </div>
                  <button 
                    type="button"
                    @click="copyOriginText(item.url, idx)"
                    class="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Icon :name="copiedOriginKey === String(idx) ? 'check' : 'copy'" custom-class="w-3.5 h-3.5" />
                    <span>{{ copiedOriginKey === String(idx) ? 'Tersalin' : 'Salin' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Test OAuth Button -->
            <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div class="text-xs font-bold text-slate-800">Uji Coba Dialog Google Sign-In</div>
                <div class="text-[11px] text-slate-500">Buka prompt Google Identity Services untuk memverifikasi kesiapan Client ID.</div>
              </div>
              <button 
                type="button"
                @click="testGoogleOAuth"
                :disabled="isTestingOAuth"
                class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <Icon name="sparkles" custom-class="w-4 h-4 text-amber-400" />
                <span>{{ isTestingOAuth ? 'Memeriksa...' : 'Uji Dialog Google Sekarang' }}</span>
              </button>
            </div>

            <div v-if="testOAuthResult" class="p-3 rounded-xl border text-xs" :class="testOAuthResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'">
              <div class="font-bold">{{ testOAuthResult.message }}</div>
            </div>
          </div>

        </main>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useSettingsStore } from '../../stores/settingsStore'
import Icon from '../common/Icon.vue'

defineEmits(['navigate'])

const authStore = useAuthStore()
const settingsStore = useSettingsStore()

const logoFileInput = ref(null)
const alertMessage = ref('')
const activeCategory = ref('brand')

// Kategori Menu di Inner-Sidebar
const settingCategories = [
  { id: 'brand', label: 'Identitas Brand & Logo', icon: 'cube', ownerOnly: true },
  { id: 'address', label: 'Alamat & Google Maps', icon: 'building', ownerOnly: false },
  { id: 'payment', label: 'Payment Gateway & Pajak', icon: 'credit-card', ownerOnly: true },
  { id: 'receipt', label: 'Struk Kasir & Printer', icon: 'printer', ownerOnly: false },
  { id: 'whatsapp', label: 'Notifikasi WhatsApp', icon: 'share', ownerOnly: true },
  { id: 'oauth', label: 'Google OAuth 2.0', icon: 'shield-check', ownerOnly: true }
]

// Hak Akses Settings: Hanya Owner dan Manager
const canAccessSettings = computed(() => {
  return authStore.isOwner || authStore.isManager
})

// State Form Lokal
const formBranding = reactive({
  appName: '',
  appSubtitle: '',
  logo: ''
})

const formAddress = reactive({
  address: '',
  coordinates: ''
})

const formReceipt = reactive({
  paperSize: '58mm',
  showHeaderLogo: true,
  headerMessage: '',
  footerMessage: '',
  showQrCode: true,
  showCashierName: true,
  showBranchAddress: true
})

const formFinancial = reactive({
  taxEnabled: true,
  taxRate: 11,
  settlementBank: '',
  settlementAccountNo: '',
  settlementAccountName: ''
})

const formWhatsapp = reactive({
  autoSendReceipt: true,
  ownerPhoneAlert: '',
  criticalStockAlert: true,
  criticalStockThreshold: 5,
  receiptTemplate: ''
})

const formOAuth = reactive({
  googleClientId: ''
})

const activeBrowserOrigin = ref(typeof window !== 'undefined' ? window.location.origin : 'http://192.168.1.13:5173')
const isTestingOAuth = ref(false)
const testOAuthResult = ref(null)
const copiedOriginKey = ref('')

const authorizedOriginsList = [
  {
    url: 'https://cakue.codevits.site',
    description: 'Domain Publik Resmi CAKUE (Cloudflare Tunnel HTTPS)'
  },
  {
    url: 'http://192.168.1.13:5173',
    description: 'Server Lokal / Akses LAN Rumah (Port 5173)'
  },
  {
    url: 'http://localhost:5173',
    description: 'Pengembangan / Dev Host Lokal'
  },
  {
    url: 'https://mini.codevits.site',
    description: 'Akses Portal CasaOS'
  }
]

onMounted(() => {
  loadStoreValues()
  if (typeof window !== 'undefined') {
    activeBrowserOrigin.value = window.location.origin
  }
  // Jika Manajer Cabang, otomatis arahkan default ke kategori 'address' yang memiliki hak akses penuh
  if (authStore.isManager && !authStore.isOwner) {
    activeCategory.value = 'address'
  }
})

function loadStoreValues() {
  formBranding.appName = settingsStore.appName
  formBranding.appSubtitle = settingsStore.appSubtitle
  formBranding.logo = settingsStore.appLogo

  formAddress.address = settingsStore.userAddress
  formAddress.coordinates = settingsStore.mapsCoordinates

  formOAuth.googleClientId = settingsStore.googleClientId

  if (settingsStore.receiptSettings) {
    Object.assign(formReceipt, settingsStore.receiptSettings)
  }

  if (settingsStore.financialSettings) {
    Object.assign(formFinancial, settingsStore.financialSettings)
  }

  if (settingsStore.whatsappSettings) {
    Object.assign(formWhatsapp, settingsStore.whatsappSettings)
  }
}

async function copyOriginText(text, key) {
  try {
    await navigator.clipboard.writeText(text)
    copiedOriginKey.value = String(key)
    setTimeout(() => {
      copiedOriginKey.value = ''
    }, 2500)
  } catch (err) {
    console.error('Copy failed:', err)
  }
}

async function testGoogleOAuth() {
  testOAuthResult.value = null
  isTestingOAuth.value = true
  try {
    const res = await authStore.loginWithGoogle(null, { accountTypeTarget: 'business', roleTarget: 'owner' })
    if (res.success) {
      testOAuthResult.value = { success: true, message: `Sukses! Terhubung sebagai ${res.user.name} (${res.user.email}).` }
    } else {
      testOAuthResult.value = { 
        success: false, 
        message: res.needsOriginWhitelist 
          ? `Perhatian: ${res.message}` 
          : `Hasil Uji: ${res.message}`
      }
    }
  } catch (err) {
    testOAuthResult.value = { success: false, message: `Error: ${err.message}` }
  } finally {
    isTestingOAuth.value = false
  }
}

function triggerLogoUpload() {
  logoFileInput.value?.click()
}

function handleLogoFileSelect(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    alert('Ukuran logo maksimal 2MB')
    return
  }
  const reader = new FileReader()
  reader.onload = (event) => {
    formBranding.logo = event.target.result
  }
  reader.readAsDataURL(file)
}

function removeLogo() {
  formBranding.logo = ''
  if (logoFileInput.value) logoFileInput.value.value = ''
}

function saveAllSettings() {
  // Hanya simpan branding dan oauth jika Owner
  if (authStore.isOwner) {
    settingsStore.saveBranding({
      name: formBranding.appName,
      subtitle: formBranding.appSubtitle
    })
    if (formBranding.logo) {
      settingsStore.setAppLogo(formBranding.logo)
    } else {
      settingsStore.removeAppLogo()
    }

    settingsStore.saveFinancialSettings({ ...formFinancial })
    settingsStore.setGoogleClientId(formOAuth.googleClientId)
  }

  // Alamat & Lokasi
  settingsStore.saveProfile({
    address: formAddress.address,
    coordinates: formAddress.coordinates
  })

  // Format Struk & WhatsApp
  settingsStore.saveReceiptSettings({ ...formReceipt })
  settingsStore.saveWhatsappSettings({ ...formWhatsapp })

  showAlert('Semua pengaturan aplikasi berhasil disimpan!')
}

function handleReset() {
  if (confirm('Kembalikan semua pengaturan sistem ke konfigurasi default pabrik?')) {
    settingsStore.resetToDefault()
    loadStoreValues()
    showAlert('Pengaturan aplikasi berhasil direset ke default.')
  }
}

function showAlert(msg) {
  alertMessage.value = msg
  setTimeout(() => {
    alertMessage.value = ''
  }, 4000)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
