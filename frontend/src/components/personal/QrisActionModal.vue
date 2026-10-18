<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
    <!-- Backdrop dismiss -->
    <div @click="$emit('close')" class="absolute inset-0"></div>

    <!-- Modal Box Container -->
    <div class="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh] font-sans">
      
      <!-- 1. Top Header (Clean Light Mode with Emerald Accent) -->
      <div class="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white">
        <div class="flex items-center gap-3.5">
          <div class="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shadow-xs">
            <Icon name="plus" custom-class="w-5 h-5 text-emerald-700" stroke-width="2.5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base sm:text-lg font-black tracking-tight text-slate-900">Catat Keuangan Cepat</h2>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                INSTAN
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">Catat pengeluaran harian, pemasukan, dan mutasi saldo</p>
          </div>
        </div>

        <button 
          @click="$emit('close')"
          type="button"
          class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          title="Tutup"
        >
          <Icon name="close" custom-class="w-4 h-4" />
        </button>
      </div>

      <!-- 2. Sub-Navigation Tabs (Pengeluaran, Pemasukan, Pindah Saldo, & QRIS Bank) -->
      <div class="px-3 sm:px-6 pt-4">
        <div class="flex items-stretch gap-1 sm:gap-1.5 bg-slate-100 p-1 sm:p-1.5 rounded-2xl border border-slate-200/80">
          <!-- Tab 1: Pengeluaran (-) -->
          <button 
            @click="activeMode = 'expense'; resetSuccessState()"
            type="button"
            :class="[
              'flex-1 min-w-0 py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-center overflow-hidden select-none',
              activeMode === 'expense' 
                ? 'bg-white text-rose-700 shadow-2xs font-extrabold ring-1 ring-slate-200/80 z-10' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            ]"
          >
            <Icon name="expense" custom-class="w-4 h-4 shrink-0" :class="activeMode === 'expense' ? 'text-rose-600' : 'text-slate-400'" />
            <span class="text-[10px] sm:text-xs font-bold leading-3.5 sm:leading-tight tracking-tight text-center w-full break-words line-clamp-2">
              Pengeluaran
            </span>
          </button>

          <!-- Tab 2: Pemasukan (+) -->
          <button 
            @click="activeMode = 'income'; resetSuccessState()"
            type="button"
            :class="[
              'flex-1 min-w-0 py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-center overflow-hidden select-none',
              activeMode === 'income' 
                ? 'bg-white text-emerald-800 shadow-2xs font-extrabold ring-1 ring-slate-200/80 z-10' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            ]"
          >
            <Icon name="income" custom-class="w-4 h-4 shrink-0" :class="activeMode === 'income' ? 'text-emerald-600' : 'text-slate-400'" />
            <span class="text-[10px] sm:text-xs font-bold leading-3.5 sm:leading-tight tracking-tight text-center w-full break-words line-clamp-2">
              Pemasukan
            </span>
          </button>

          <!-- Tab 3: Pindah Saldo -->
          <button 
            @click="activeMode = 'transfer'; resetSuccessState()"
            type="button"
            :class="[
              'flex-1 min-w-0 py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-center overflow-hidden select-none',
              activeMode === 'transfer' 
                ? 'bg-white text-blue-800 shadow-2xs font-extrabold ring-1 ring-slate-200/80 z-10' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            ]"
          >
            <Icon name="transfer" custom-class="w-4 h-4 shrink-0" :class="activeMode === 'transfer' ? 'text-blue-600' : 'text-slate-400'" />
            <span class="text-[10px] sm:text-xs font-bold leading-3.5 sm:leading-tight tracking-tight text-center w-full break-words line-clamp-2">
              Pindah Saldo
            </span>
          </button>

          <!-- Tab 4: QRIS (Coming Soon) -->
          <button 
            @click="activeMode = 'qris_info'; resetSuccessState()"
            type="button"
            :class="[
              'flex-1 min-w-0 py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-center overflow-hidden select-none relative',
              activeMode === 'qris_info' 
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold ring-1 ring-slate-200/80 z-10' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
            ]"
          >
            <div class="relative">
              <Icon name="qris" custom-class="w-4 h-4 shrink-0" :class="activeMode === 'qris_info' ? 'text-emerald-600' : 'text-slate-400'" />
              <span class="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-amber-500 text-white text-[8px] font-black leading-tight">SOON</span>
            </div>
            <span class="text-[10px] sm:text-xs font-bold leading-3.5 sm:leading-tight tracking-tight text-center w-full break-words line-clamp-2">
              QRIS Bank
            </span>
          </button>
        </div>
      </div>

      <!-- 3. Modal Body Content (Scrollable) -->
      <div class="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
        <!-- ============================================== -->
        <!-- NOTIFIKASI SUKSES INTERAKTIF -->
        <!-- ============================================== -->
        <div v-if="successMessage" class="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-3 animate-fade-in text-center">
          <div class="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <Icon name="check" custom-class="w-6 h-6" />
          </div>
          <div>
            <div class="font-extrabold text-base text-emerald-950">Catatan Berhasil Disimpan!</div>
            <p class="text-xs text-emerald-800 mt-1">{{ successMessage }}</p>
          </div>
          <div class="pt-2 flex items-center justify-center gap-2">
            <button 
              @click="resetSuccessState" 
              type="button" 
              class="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              Catat Transaksi Lain
            </button>
            <button 
              @click="$emit('close')" 
              type="button" 
              class="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-900 text-xs font-bold hover:bg-emerald-100 transition-all cursor-pointer"
            >
              Selesai & Tutup
            </button>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- TAB 1: CATAT PENGELUARAN CEPAT (-) -->
        <!-- ============================================== -->
        <div v-else-if="activeMode === 'expense'" class="space-y-4">
          <!-- Info Banner Pengeluaran -->
          <div class="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-center justify-between text-rose-950">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                <Icon name="expense" custom-class="w-4 h-4" />
              </div>
              <div>
                <div class="text-xs font-extrabold text-rose-950">Catat Pengeluaran Uang</div>
                <div class="text-[11px] text-rose-700">Saldo rekening sumber akan otomatis berkurang</div>
              </div>
            </div>
            <span class="text-xs font-bold text-rose-800 bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs">
              Kas Keluar
            </span>
          </div>

          <!-- Quick Amount Chips (10rb, 25rb, 50rb, 100rb, 250rb, 500rb) - Font Sans Modern -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Pilih Nominal Cepat</label>
            <div class="grid grid-cols-3 gap-2">
              <button 
                v-for="amt in [10000, 25000, 50000, 100000, 250000, 500000]"
                :key="amt"
                @click="expenseForm.amount = amt"
                type="button"
                :class="[
                  'py-2.5 rounded-xl border text-xs font-extrabold tracking-tight transition-all cursor-pointer text-center',
                  expenseForm.amount === amt 
                    ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-2xs ring-1 ring-rose-400' 
                    : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                ]"
              >
                Rp {{ formatNumber(amt) }}
              </button>
            </div>
          </div>

          <!-- Form Detail Pengeluaran -->
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Nominal Pengeluaran (Rp)</label>
              <div class="relative">
                <span class="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                <input 
                  v-model.number="expenseForm.amount"
                  type="number"
                  placeholder="0"
                  class="w-full pl-10 pr-3 py-2.5 text-base font-extrabold tracking-tight bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-rose-500 font-sans"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Keterangan / Keperluan</label>
              <input 
                v-model="expenseForm.desc"
                type="text"
                placeholder="Misal: Makan Siang, Beli Bensin, Belanja Supermarket"
                class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-rose-500 font-medium"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Kategori Pengeluaran</label>
                <select 
                  v-model="expenseForm.category"
                  class="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-rose-500"
                >
                  <option value="Makan & Minum">Makan & Minum</option>
                  <option value="Transportasi">Transportasi</option>
                  <option value="Belanja Kebutuhan">Belanja Kebutuhan</option>
                  <option value="Tagihan & Utilitas">Tagihan & Utilitas</option>
                  <option value="Hiburan & Rekreasi">Hiburan & Rekreasi</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-xs font-bold text-slate-700">Sumber Rekening</label>
                  <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    Saldo: Rp {{ formatNumber(expenseAccountBalance) }}
                  </span>
                </div>
                <select 
                  v-model="expenseForm.account"
                  class="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-rose-500"
                >
                  <option v-for="acc in financeStore.accounts" :key="acc.id" :value="acc.name">
                    {{ acc.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Tombol Simpan Pengeluaran -->
          <button 
            @click="handleExpenseSave"
            :disabled="!expenseForm.amount || expenseForm.amount <= 0 || !expenseForm.desc"
            type="button"
            class="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm transition-all shadow-xs hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            <Icon name="check" custom-class="w-5 h-5 text-white" />
            <span>Simpan Pengeluaran (Rp {{ formatNumber(expenseForm.amount || 0) }})</span>
          </button>
        </div>

        <!-- ============================================== -->
        <!-- TAB 2: CATAT PEMASUKAN CEPAT (+) -->
        <!-- ============================================== -->
        <div v-else-if="activeMode === 'income'" class="space-y-4">
          <!-- Info Banner Pemasukan -->
          <div class="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-emerald-950">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                <Icon name="income" custom-class="w-4 h-4" />
              </div>
              <div>
                <div class="text-xs font-extrabold text-emerald-950">Catat Pemasukan Uang</div>
                <div class="text-[11px] text-emerald-700">Saldo rekening tujuan akan otomatis bertambah</div>
              </div>
            </div>
            <span class="text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
              Kas Masuk
            </span>
          </div>

          <!-- Quick Amount Chips Pemasukan - Font Sans Modern -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Pilih Nominal Cepat</label>
            <div class="grid grid-cols-3 gap-2">
              <button 
                v-for="amt in [50000, 100000, 250000, 500000, 1000000, 5000000]"
                :key="amt"
                @click="incomeForm.amount = amt"
                type="button"
                :class="[
                  'py-2.5 rounded-xl border text-xs font-extrabold tracking-tight transition-all cursor-pointer text-center',
                  incomeForm.amount === amt 
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs ring-1 ring-emerald-500' 
                    : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                ]"
              >
                Rp {{ formatNumber(amt) }}
              </button>
            </div>
          </div>

          <!-- Form Detail Pemasukan -->
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Nominal Pemasukan (Rp)</label>
              <div class="relative">
                <span class="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                <input 
                  v-model.number="incomeForm.amount"
                  type="number"
                  placeholder="0"
                  class="w-full pl-10 pr-3 py-2.5 text-base font-extrabold tracking-tight bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Keterangan / Sumber Dana</label>
              <input 
                v-model="incomeForm.desc"
                type="text"
                placeholder="Misal: Gaji Bulanan, Bonus Proyek, Transfer Masuk"
                class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Kategori Pemasukan</label>
                <select 
                  v-model="incomeForm.category"
                  class="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="Gaji & Upah">Gaji & Upah</option>
                  <option value="Penjualan Bisnis">Penjualan Bisnis</option>
                  <option value="Investasi & Dividen">Investasi & Dividen</option>
                  <option value="Hadiah & Bonus">Hadiah & Bonus</option>
                  <option value="Pengembalian Dana">Pengembalian Dana</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-xs font-bold text-slate-700">Masuk ke Rekening</label>
                  <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    Saldo: Rp {{ formatNumber(incomeAccountBalance) }}
                  </span>
                </div>
                <select 
                  v-model="incomeForm.account"
                  class="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option v-for="acc in financeStore.accounts" :key="acc.id" :value="acc.name">
                    {{ acc.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Tombol Simpan Pemasukan -->
          <button 
            @click="handleIncomeSave"
            :disabled="!incomeForm.amount || incomeForm.amount <= 0 || !incomeForm.desc"
            type="button"
            class="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm transition-all shadow-xs hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            <Icon name="check" custom-class="w-5 h-5 text-white" />
            <span>Simpan Pemasukan (+Rp {{ formatNumber(incomeForm.amount || 0) }})</span>
          </button>
        </div>

        <!-- ============================================== -->
        <!-- TAB 3: PINDAH SALDO (TRANSFER ANTAR REKENING) -->
        <!-- ============================================== -->
        <div v-else-if="activeMode === 'transfer'" class="space-y-4">
          <div class="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center gap-3 text-blue-950">
            <div class="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Icon name="transfer" custom-class="w-4 h-4" />
            </div>
            <div>
              <div class="font-extrabold text-xs sm:text-sm text-blue-950">Pindah Dana Antar Rekening</div>
              <p class="text-[11px] text-blue-800">Tarik tunai, isi e-wallet, atau mutasi internal bebas biaya</p>
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-xs font-bold text-slate-700">Dari Rekening Sumber</label>
                <span class="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                  Saldo: Rp {{ formatNumber(transferFromBalance) }}
                </span>
              </div>
              <select 
                v-model="transferForm.fromAccount" 
                class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-blue-500"
              >
                <option v-for="acc in financeStore.accounts" :key="acc.id" :value="acc.name">
                  {{ acc.name }}
                </option>
              </select>
            </div>

            <!-- Direction Indicator -->
            <div class="flex justify-center -my-1">
              <div class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shadow-2xs">
                <Icon name="chevron-down" custom-class="w-4 h-4" />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-xs font-bold text-slate-700">Ke Rekening Tujuan</label>
                <span class="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                  Saldo: Rp {{ formatNumber(transferToBalance) }}
                </span>
              </div>
              <select 
                v-model="transferForm.toAccount" 
                class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-blue-500"
              >
                <option 
                  v-for="acc in financeStore.accounts.filter(a => a.name !== transferForm.fromAccount)" 
                  :key="acc.id" 
                  :value="acc.name"
                >
                  {{ acc.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Nominal yang Dipindahkan (Rp)</label>
              <input 
                v-model.number="transferForm.amount" 
                type="number" 
                placeholder="0" 
                class="w-full px-3.5 py-2.5 text-base font-extrabold tracking-tight bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Catatan Transfer (Opsional)</label>
              <input 
                v-model="transferForm.note" 
                type="text" 
                placeholder="Misal: Tarik tunai untuk belanja pasar" 
                class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <!-- Transfer Action Button -->
          <button 
            @click="handleTransferFunds" 
            :disabled="!transferForm.amount || transferForm.amount <= 0 || transferForm.amount > transferFromBalance" 
            type="button" 
            class="w-full py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm transition-all shadow-xs hover:shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            <Icon name="check" custom-class="w-5 h-5 text-white" />
            <span>Pindahkan Saldo Sekarang</span>
          </button>
          <div v-if="transferForm.amount > transferFromBalance" class="text-xs text-rose-600 font-bold text-center">
            Saldo rekening sumber tidak mencukupi!
          </div>
        </div>

        <!-- ============================================== -->
        <!-- TAB 4: QRIS & INTEGRASI PERBANKAN (COMING SOON & TAHAP RISET) -->
        <!-- ============================================== -->
        <div v-else-if="activeMode === 'qris_info'" class="space-y-4">
          <!-- Official Coming Soon Header Banner in Light Mode -->
          <div class="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/90 text-slate-900 relative overflow-hidden shadow-xs">
            <div class="flex items-start gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs font-black">
                <Icon name="qris" custom-class="w-7 h-7 text-white" />
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-extrabold text-base text-slate-900">QRIS & Scan Perbankan</h3>
                  <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-sans font-bold text-[9px] uppercase tracking-wider">
                    COMING SOON
                  </span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">
                  Fitur pembayaran scan QRIS dan pembuatan kode bayar dinamis sedang dalam tahap riset regulasi perbankan Indonesia (ASPI & Bank Indonesia).
                </p>
              </div>
            </div>
          </div>

          <!-- R&D Explanation & Education Cards -->
          <div class="space-y-2.5">
            <div class="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Kenapa Fitur Ini Masuk Tahap Riset?
            </div>

            <!-- Point 1: Regulasi Bank Indonesia -->
            <div class="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
              <div class="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                <Icon name="building" custom-class="w-4 h-4 text-blue-700" />
              </div>
              <div class="text-xs space-y-0.5">
                <div class="font-extrabold text-slate-900">Regulasi Lisensi PJP & SNAP BI</div>
                <p class="text-slate-600 leading-relaxed">
                  Di Indonesia, memotong saldo antar bank secara langsung memerlukan lisensi <b>PJP (Penyelenggara Jasa Pembayaran)</b> dari Bank Indonesia atau integrasi resmi via Payment Gateway berlisensi.
                </p>
              </div>
            </div>

            <!-- Point 2: Rencana Kemitraan Payment Gateway -->
            <div class="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
              <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                <Icon name="credit-card" custom-class="w-4 h-4 text-emerald-700" />
              </div>
              <div class="text-xs space-y-0.5">
                <div class="font-extrabold text-slate-900">Rencana Integrasi: Payment Gateway Resmi</div>
                <p class="text-slate-600 leading-relaxed">
                  Pada tahap pengembangan berikutnya, kami akan mengintegrasikan API resmi seperti <b>Midtrans, Xendit, atau DOKU</b> untuk generate Dynamic QRIS dan webhook settlement otomatis.
                </p>
              </div>
            </div>

            <!-- Point 3: Catat Manual Tetap Aktif -->
            <div class="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
              <div class="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                <Icon name="plus" custom-class="w-4 h-4 text-white" />
              </div>
              <div class="text-xs space-y-0.5">
                <div class="font-extrabold text-emerald-950">Solusi Sekarang: Catat Keuangan Cepat</div>
                <p class="text-emerald-800 leading-relaxed">
                  Anda tetap bisa mencatat pengeluaran yang dibayar lewat QRIS BCA/Mandiri/GoPay secara instan di tab <b>Pengeluaran</b> agar mutasi dan saldo Anda tercatat rapi.
                </p>
              </div>
            </div>
          </div>

          <!-- Switch Back Button -->
          <div class="pt-2">
            <button 
              @click="activeMode = 'expense'"
              type="button"
              class="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Icon name="expense" custom-class="w-4 h-4 text-emerald-400" />
              <span>Kembali ke Catat Pengeluaran Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFinanceStore } from '../../stores/financeStore'
import { useSettingsStore } from '../../stores/settingsStore'
import Icon from '../common/Icon.vue'

defineEmits(['close'])

const financeStore = useFinanceStore()
const settingsStore = useSettingsStore()

// Default tab: Langsung ke Catat Pengeluaran Cepat
const activeMode = ref('expense')
const successMessage = ref('')

// Form Catat Pengeluaran
const expenseForm = ref({
  amount: 25000,
  desc: 'Makan Siang',
  category: 'Makan & Minum',
  account: 'BCA Prioritas'
})

// Form Catat Pemasukan
const incomeForm = ref({
  amount: 500000,
  desc: 'Gaji / Hasil Penjualan',
  category: 'Gaji & Upah',
  account: 'BCA Prioritas'
})

// Form Pindah Saldo
const transferForm = ref({
  fromAccount: 'BCA Prioritas',
  toAccount: 'Dompet Tunai (Cash)',
  amount: 100000,
  note: 'Tarik Tunai'
})

// Saldo Rekening untuk Validasi Real-Time
const expenseAccountBalance = computed(() => {
  const acc = financeStore.accounts.find(a => a.name === expenseForm.value.account)
  return acc ? acc.balance : 0
})

const incomeAccountBalance = computed(() => {
  const acc = financeStore.accounts.find(a => a.name === incomeForm.value.account)
  return acc ? acc.balance : 0
})

const transferFromBalance = computed(() => {
  const acc = financeStore.accounts.find(a => a.name === transferForm.value.fromAccount)
  return acc ? acc.balance : 0
})

const transferToBalance = computed(() => {
  const acc = financeStore.accounts.find(a => a.name === transferForm.value.toAccount)
  return acc ? acc.balance : 0
})

function formatNumber(num) {
  return (num || 0).toLocaleString('id-ID')
}

function resetSuccessState() {
  successMessage.value = ''
}

// Simpan Pengeluaran Instan
function handleExpenseSave() {
  if (!expenseForm.value.amount || !expenseForm.value.desc) return
  financeStore.addTransaction({
    desc: expenseForm.value.desc,
    category: expenseForm.value.category,
    type: 'expense',
    amount: expenseForm.value.amount,
    account: expenseForm.value.account,
    tag: 'Catat Cepat',
    updateBalance: true
  })
  successMessage.value = `Pengeluaran sebesar Rp ${formatNumber(expenseForm.value.amount)} ("${expenseForm.value.desc}") berhasil dipotong dari ${expenseForm.value.account}.`
}

// Simpan Pemasukan Instan
function handleIncomeSave() {
  if (!incomeForm.value.amount || !incomeForm.value.desc) return
  financeStore.addTransaction({
    desc: incomeForm.value.desc,
    category: incomeForm.value.category,
    type: 'income',
    amount: incomeForm.value.amount,
    account: incomeForm.value.account,
    tag: 'Catat Cepat',
    updateBalance: true
  })
  successMessage.value = `Pemasukan sebesar Rp ${formatNumber(incomeForm.value.amount)} ("${incomeForm.value.desc}") berhasil ditambahkan ke ${incomeForm.value.account}.`
}

// Pindah Saldo Antar Rekening
function handleTransferFunds() {
  if (!transferForm.value.amount || transferForm.value.amount > transferFromBalance.value) return
  const ok = financeStore.transferFunds({
    fromAccount: transferForm.value.fromAccount,
    toAccount: transferForm.value.toAccount,
    amount: transferForm.value.amount,
    note: transferForm.value.note
  })
  if (ok) {
    successMessage.value = `Pindah dana Rp ${formatNumber(transferForm.value.amount)} dari ${transferForm.value.fromAccount} ke ${transferForm.value.toAccount} berhasil diselesaikan.`
  }
}
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
