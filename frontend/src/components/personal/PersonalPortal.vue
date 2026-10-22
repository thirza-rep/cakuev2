<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 flex font-sans overflow-x-hidden">
    
    <!-- 1. COLLAPSIBLE MODERN SIDEBAR (PERSONAL PORTAL) -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out shadow-xs select-none',
        isSidebarCollapsed ? 'w-20' : 'w-64 sm:w-72',
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Sidebar Brand Header -->
      <div 
        :class="[
          'border-b border-slate-200 flex items-center h-16 transition-all duration-300',
          isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'
        ]"
      >
        <div 
          :class="[
            'flex items-center overflow-hidden',
            isSidebarCollapsed ? 'justify-center' : 'gap-3'
          ]"
        >
          <!-- Logo Brand Dinamis -->
          <div 
            @click="isSidebarCollapsed ? toggleSidebar() : null"
            :class="[
              'w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-slate-200/90 bg-white shadow-xs',
              isSidebarCollapsed ? 'cursor-pointer hover:ring-2 hover:ring-emerald-400 transition-all' : ''
            ]"
            :title="isSidebarCollapsed ? 'Klik untuk memperbesar sidebar' : ''"
          >
            <img 
              :src="settingsStore.appLogo || '/logo.png'" 
              alt="Brand Logo" 
              class="w-full h-full object-contain p-0.5" 
            />
          </div>

          <!-- App Title (Hidden when collapsed) -->
          <div v-if="!isSidebarCollapsed" class="overflow-hidden transition-opacity duration-200">
            <div class="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1.5 truncate">
              <span>{{ settingsStore.appName }}</span>
              <span class="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded font-bold uppercase">
                Pribadi
              </span>
            </div>
            <div class="text-[11px] text-slate-500 font-semibold truncate max-w-[150px]">
              Dompet & Keuangan
            </div>
          </div>
        </div>

        <!-- Collapse Toggle Button (Expanded mode on Desktop) -->
        <button 
          v-if="!isSidebarCollapsed"
          @click="toggleSidebar" 
          type="button" 
          class="hidden lg:flex w-8 h-8 rounded-lg items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          title="Tutup Sidebar"
        >
          <Icon name="chevron-left" custom-class="w-4 h-4" />
        </button>

        <!-- Close Button (Mobile & Tablet) -->
        <button 
          @click="isMobileSidebarOpen = false" 
          type="button" 
          class="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
        >
          <Icon name="close" custom-class="w-4 h-4" />
        </button>
      </div>

      <!-- Navigation Menu Links -->
      <div class="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div v-if="!isSidebarCollapsed" class="px-3 pb-2 text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">
            Menu Dompet
          </div>
          <nav class="space-y-1">
            <button 
              v-for="item in personalNavigation" 
              :key="item.id"
              @click="handleNavClick(item)"
              :class="[
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer group relative',
                activeTab === item.id 
                  ? 'bg-emerald-800 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
                isSidebarCollapsed ? 'justify-center px-0' : ''
              ]"
              :title="isSidebarCollapsed ? item.label : ''"
            >
              <Icon 
                :name="item.icon" 
                custom-class="w-5 h-5 shrink-0" 
                :class="activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-emerald-700'" 
              />
              
              <span v-if="!isSidebarCollapsed" class="truncate flex-1 text-left">
                {{ item.label }}
              </span>

              <span 
                v-if="!isSidebarCollapsed && item.badge" 
                class="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-100 text-emerald-800"
              >
                {{ item.badge }}
              </span>

              <!-- Floating Tooltip saat Sidebar Collapsed -->
              <span 
                v-if="isSidebarCollapsed" 
                class="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50"
              >
                {{ item.label }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Akun & Pengaturan Section -->
        <div>
          <div v-if="!isSidebarCollapsed" class="px-3 pb-2 text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">
            Akun & Preferensi
          </div>
          <nav class="space-y-1">
            <button 
              @click="activeTab = 'profile'; isMobileSidebarOpen = false"
              :class="[
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer group relative',
                activeTab === 'profile' 
                  ? 'bg-emerald-800 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
                isSidebarCollapsed ? 'justify-center px-0' : ''
              ]"
              :title="isSidebarCollapsed ? 'Profil Saya' : ''"
            >
              <Icon 
                name="user" 
                custom-class="w-5 h-5 shrink-0" 
                :class="activeTab === 'profile' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-700'" 
              />
              <span v-if="!isSidebarCollapsed" class="truncate flex-1 text-left">
                Profil Saya
              </span>

              <!-- Floating Tooltip saat Sidebar Collapsed -->
              <span 
                v-if="isSidebarCollapsed" 
                class="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50"
              >
                Profil Saya
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Sidebar Bottom Toggle Action Bar (Desktop) -->
      <div class="p-2 border-t border-slate-200 hidden lg:block bg-white">
        <button 
          @click="toggleSidebar" 
          type="button" 
          :class="[
            'w-full flex items-center rounded-xl p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer group',
            isSidebarCollapsed ? 'justify-center' : 'justify-between px-3'
          ]"
          :title="isSidebarCollapsed ? 'Buka Sidebar (⌘B)' : 'Ciutkan Sidebar (⌘B)'"
        >
          <div v-if="!isSidebarCollapsed" class="flex items-center gap-2 text-xs font-bold text-slate-600 group-hover:text-slate-900">
            <Icon name="chevron-left" custom-class="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Ciutkan Sidebar</span>
          </div>
          <div v-else class="flex items-center justify-center w-8 h-8 rounded-lg group-hover:bg-slate-200/70 transition-colors">
            <Icon name="chevron-right" custom-class="w-4 h-4 text-slate-600 transition-transform group-hover:translate-x-0.5" />
          </div>
          <span v-if="!isSidebarCollapsed" class="text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
            ⌘B
          </span>
        </button>
      </div>

      <!-- Sidebar Bottom Info (Nasabah Status) -->
      <div class="p-3 border-t border-slate-200 bg-slate-50/70">
        <div v-if="!isSidebarCollapsed" class="px-2 py-1.5 space-y-1 text-xs">
          <div class="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Rekening Terverifikasi</span>
          </div>
          <div class="text-[10px] text-slate-500 font-mono truncate">
            {{ authStore.personalUser.accountNumber }}
          </div>
        </div>
        <div v-else class="flex justify-center py-1">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Akun Terverifikasi"></span>
        </div>
      </div>
    </aside>

    <!-- Mobile & Tablet Backdrop -->
    <div 
      v-if="isMobileSidebarOpen" 
      @click="isMobileSidebarOpen = false" 
      class="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden"
    ></div>

    <!-- 2. MAIN CONTENT AREA (Offset by sidebar width on Desktop) -->
    <div 
      :class="[
        'flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out min-w-0',
        isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64 sm:lg:ml-72'
      ]"
    >
      <!-- Top Header Navbar -->
      <header class="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs h-16 flex items-center px-4 sm:px-6 lg:px-8">
        <div class="w-full flex items-center justify-between gap-4">
          <!-- Left: Mobile/Tablet Hamburger Toggle + Breadcrumb Title -->
          <div class="flex items-center gap-3">
            <!-- Mobile/Tablet Hamburger Toggle -->
            <button 
              @click="isMobileSidebarOpen = true" 
              type="button" 
              class="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
              title="Buka Menu"
            >
              <Icon name="menu" custom-class="w-5 h-5" />
            </button>

            <!-- Breadcrumb Title -->
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Keuangan Pribadi</div>
              <div class="text-sm font-black text-slate-900 leading-tight">
                {{ activeTabLabel }}
              </div>
            </div>
          </div>

          <!-- Right: Clean Profile Box (with Dropdown) -->
          <div class="relative">
            <button 
              @click="isProfileMenuOpen = !isProfileMenuOpen"
              type="button"
              class="flex items-center gap-2.5 sm:gap-3 p-1 sm:px-3 sm:py-2 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 rounded-2xl transition-all cursor-pointer shadow-2xs group"
              title="Klik untuk menu akun & pengaturan"
            >
              <!-- Avatar Foto Profil / Inisial -->
              <div class="w-9 h-9 rounded-full overflow-hidden border border-emerald-600/40 bg-white flex items-center justify-center shrink-0 shadow-xs">
                <img 
                  v-if="settingsStore.userAvatar" 
                  :src="settingsStore.userAvatar" 
                  alt="Avatar" 
                  class="w-full h-full object-cover"
                />
                <span v-else class="font-black text-sm text-emerald-800">
                  {{ (authStore.user?.name || authStore.personalUser?.name || 'M').charAt(0).toUpperCase() }}
                </span>
              </div>

              <!-- Nama & Status Sesi Aktif -->
              <div class="text-left hidden sm:block">
                <div class="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                  {{ authStore.user?.name || authStore.personalUser?.name || 'Master Administrator' }}
                </div>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span class="text-[11px] font-semibold text-slate-500">Nasabah Pribadi</span>
                </div>
              </div>

              <!-- Chevron Icon -->
              <svg 
                class="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ml-0.5 sm:ml-1" 
                :class="{ 'rotate-180': isProfileMenuOpen }" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Backdrop Click Outside -->
            <div 
              v-if="isProfileMenuOpen" 
              @click="isProfileMenuOpen = false" 
              class="fixed inset-0 z-40 bg-transparent"
            ></div>

            <!-- Dropdown Menu Tersembunyi (Clean & Modern) -->
            <transition name="dropdown">
              <div 
                v-if="isProfileMenuOpen" 
                class="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 space-y-1 text-xs sm:text-sm font-medium"
              >
                <!-- Info Sesi Card -->
                <div class="px-3.5 py-3 bg-slate-50/90 rounded-xl border border-slate-100">
                  <div class="text-xs font-black text-slate-900">{{ authStore.user?.name || authStore.personalUser?.name || 'Master Administrator' }}</div>
                  <div class="text-[11px] text-slate-500 truncate">{{ authStore.user?.email || authStore.personalUser?.email || 'admin@cakue.id' }}</div>
                  <div class="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Sesi: Nasabah Pribadi</span>
                  </div>
                </div>



                <!-- Menu 1: Profil & Keamanan Pribadi -->
                <button 
                  @click="activeTab = 'profile'; isProfileMenuOpen = false"
                  type="button"
                  :class="[
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors cursor-pointer font-bold text-left',
                    activeTab === 'profile' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                  ]"
                >
                  <Icon name="user" custom-class="w-4 h-4" :class="activeTab === 'profile' ? 'text-white' : 'text-slate-500'" />
                  <span>Profil & Keamanan</span>
                </button>

                <!-- Menu 2: Pengaturan Aplikasi -->
                <button 
                  @click="activeTab = 'settings'; isProfileMenuOpen = false"
                  type="button"
                  :class="[
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors cursor-pointer font-bold text-left',
                    activeTab === 'settings' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                  ]"
                >
                  <Icon name="settings" custom-class="w-4 h-4" :class="activeTab === 'settings' ? 'text-white' : 'text-slate-500'" />
                  <span>Pengaturan Aplikasi</span>
                </button>

                <!-- Menu 2: AI Asisten Keuangan -->
                <button 
                  @click="$emit('toggle-ai'); isProfileMenuOpen = false"
                  type="button"
                  class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer font-bold text-left"
                >
                  <Icon name="sparkles" custom-class="w-4 h-4 text-emerald-600" />
                  <span>AI Asisten Keuangan</span>
                </button>

                <div class="border-t border-slate-100 my-1"></div>

                <!-- Menu 3: Beralih ke Portal Usaha (ERP) -->
                <button 
                  @click="authStore.setAppMode('business'); isProfileMenuOpen = false"
                  type="button"
                  class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer font-bold text-left"
                >
                  <Icon name="building" custom-class="w-4 h-4 text-slate-600" />
                  <span>Beralih ke Portal Usaha (ERP)</span>
                </button>

                <!-- Menu 4: Tentang Aplikasi & Panduan -->
                <button 
                  @click="showAboutModal = true; isProfileMenuOpen = false"
                  type="button"
                  class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer font-bold text-left"
                >
                  <Icon name="sparkles" custom-class="w-4 h-4 text-emerald-600" />
                  <span>Tentang Aplikasi & Panduan</span>
                </button>

                <!-- Menu 5: Keluar Akun -->
                <button 
                  @click="authStore.logout(); isProfileMenuOpen = false"
                  type="button"
                  class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer font-bold text-left"
                >
                  <Icon name="logout" custom-class="w-4 h-4 text-rose-600" />
                  <span>Keluar dari Akun</span>
                </button>
              </div>
            </transition>
          </div>
        </div>
      </header>

      <!-- Main Workspace (Screen-filling, generous width) -->
      <main class="flex-1 max-w-[1600px] w-full mx-auto p-3.5 sm:p-5 lg:p-8 space-y-5 sm:space-y-6 pb-24 lg:pb-8">
        
        <!-- ========================================== -->
        <!-- TAB 1: TAMPILAN DEPAN (HOME RINGKASAN DOMPET) -->
        <!-- Hanya data keuangan secara bulat & shortcut cepat yang sering digunakan -->
        <!-- ========================================== -->
        <div v-if="activeTab === 'overview'" class="space-y-5 sm:space-y-6">
          
          <!-- 1. DATA KEUANGAN SECARA BULAT (Kartu Digital Saldo Utama & Cashflow) -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 items-stretch">
            
            <!-- Kartu Digital Utama (Col 7 / 12) - Sleek & Compact -->
            <div class="lg:col-span-7 p-4 sm:p-6 lg:p-7 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 text-white rounded-2xl sm:rounded-3xl relative overflow-hidden bank-card-shadow flex flex-col justify-between min-w-0">
              <!-- Decorative subtle glow circle -->
              <div class="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none"></div>

              <div class="relative z-10 space-y-3 sm:space-y-4">
                <!-- Top Header: Chip Rekening & Hide Toggle -->
                <div class="flex items-center justify-between gap-2">
                  <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[11px] font-medium text-emerald-200 border border-white/10 truncate">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                    <span class="truncate">Terverifikasi • {{ authStore.personalUser.accountNumber }}</span>
                  </div>
                  <button 
                    @click="isBalanceHidden = !isBalanceHidden"
                    class="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-emerald-200 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Sembunyikan/Tampilkan Saldo"
                  >
                    <svg v-if="!isBalanceHidden" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
                  </button>
                </div>

                <!-- Main Balance Display (Fluid Responsive Typography) -->
                <div class="pt-1 min-w-0">
                  <div class="text-[11px] sm:text-xs uppercase tracking-wider text-emerald-200/80 font-bold truncate">Total Saldo Kas Pribadi</div>
                  <div class="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-extrabold tracking-tight text-white mt-0.5 tabular-nums whitespace-nowrap overflow-hidden text-ellipsis">
                    {{ isBalanceHidden ? 'Rp ••••••••••' : `Rp ${formatNumber(financeStore.totalBalance)}` }}
                  </div>
                </div>
              </div>

              <!-- Snapshot Kas Masuk vs Kas Keluar (Clean Inline Split) -->
              <div class="relative z-10 grid grid-cols-2 divide-x divide-white/15 pt-3.5 mt-4 border-t border-white/15">
                <div class="pr-2.5 sm:pr-4 min-w-0">
                  <div class="flex items-center gap-1.5 text-emerald-200 text-[11px] font-medium truncate">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                    <span class="truncate">Pemasukan Bulan Ini</span>
                  </div>
                  <div class="font-bold text-xs sm:text-sm md:text-base text-white tracking-tight mt-0.5 tabular-nums whitespace-nowrap overflow-hidden text-ellipsis">
                    +Rp {{ formatNumber(financeStore.totalIncome) }}
                  </div>
                </div>

                <div class="pl-2.5 sm:pl-4 min-w-0">
                  <div class="flex items-center gap-1.5 text-rose-200 text-[11px] font-medium truncate">
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                    <span class="truncate">Pengeluaran Bulan Ini</span>
                  </div>
                  <div class="font-bold text-xs sm:text-sm md:text-base text-white tracking-tight mt-0.5 tabular-nums whitespace-nowrap overflow-hidden text-ellipsis">
                    -Rp {{ formatNumber(financeStore.totalExpense) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Ringkasan Angka Bulat Tambahan: 2 Kolom Sejajar Rapi di Mobile (Col 5 / 12) -->
            <div class="lg:col-span-5 grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
              <!-- Card 1: Surplus Tabungan -->
              <div class="saas-card p-3.5 sm:p-5 flex flex-col justify-between min-w-0">
                <div class="flex items-center justify-between text-slate-500 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                  <span class="truncate">Surplus Tabungan</span>
                  <div class="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Icon name="income" custom-class="w-3.5 h-3.5" />
                  </div>
                </div>
                <div class="my-1.5 sm:my-2 min-w-0">
                  <div class="text-sm sm:text-lg md:text-xl xl:text-2xl font-extrabold text-emerald-700 tracking-tight tabular-nums whitespace-nowrap overflow-hidden text-ellipsis">
                    Rp {{ formatNumber(financeStore.netSavings) }}
                  </div>
                </div>
                <div class="text-[10px] sm:text-[11px] text-emerald-700 font-semibold flex items-center gap-1 truncate">
                  <Icon name="check" custom-class="w-3.5 h-3.5 shrink-0" />
                  <span class="truncate">Rasio Sehat (39.9%)</span>
                </div>
              </div>

              <!-- Card 2: Kewajiban Utang -->
              <div class="saas-card p-3.5 sm:p-5 flex flex-col justify-between min-w-0">
                <div class="flex items-center justify-between text-slate-500 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                  <span class="truncate">Kewajiban Utang</span>
                  <div class="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Icon name="debt" custom-class="w-3.5 h-3.5" />
                  </div>
                </div>
                <div class="my-1.5 sm:my-2 min-w-0">
                  <div class="text-sm sm:text-lg md:text-xl xl:text-2xl font-extrabold text-amber-800 tracking-tight tabular-nums whitespace-nowrap overflow-hidden text-ellipsis">
                    Rp {{ formatNumber(financeStore.totalUtang) }}
                  </div>
                </div>
                <div class="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
                  Piutang: <strong class="text-slate-800 tabular-nums">Rp {{ formatNumber(financeStore.totalPiutang) }}</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. SHORTCUT CEPAT OPERASIONAL (Spacious 4-Grid Action Bar) -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">
                Shortcut Cepat & Transaksi
              </span>
              <span class="text-[11px] text-slate-400 hidden sm:inline">Sentuh cepat untuk aksi instan</span>
            </div>
            
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <!-- Shortcut 1: Catat Cepat (Elevated Green Primary) -->
              <button 
                @click="showQrisModal = true"
                type="button"
                class="p-3.5 sm:p-4 md:p-5 min-h-[96px] sm:min-h-[110px] rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-md shadow-emerald-900/10 hover:shadow-lg hover:from-emerald-800 hover:to-teal-900 active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between text-left group"
              >
                <div class="flex items-center justify-between w-full">
                  <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon name="plus" custom-class="w-5 h-5 text-white" stroke-width="2.5" />
                  </div>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-emerald-100 uppercase tracking-wider">
                    Instan
                  </span>
                </div>
                <div>
                  <div class="text-xs sm:text-sm md:text-base font-extrabold text-white leading-tight">Catat Cepat</div>
                  <div class="text-[11px] text-emerald-100/80 mt-0.5 hidden sm:block">Input kilat / Nota</div>
                </div>
              </button>

              <!-- Shortcut 2: Pemasukan (+ Masuk) -->
              <button 
                @click="openTransactionModal('income')"
                type="button"
                class="p-3.5 sm:p-4 md:p-5 min-h-[96px] sm:min-h-[110px] rounded-2xl bg-white hover:bg-emerald-50/40 border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between text-left group"
              >
                <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon name="income" custom-class="w-5 h-5" />
                </div>
                <div>
                  <div class="text-xs sm:text-sm md:text-base font-extrabold text-slate-800 group-hover:text-emerald-800 leading-tight">Pemasukan</div>
                  <div class="text-[11px] text-slate-500 mt-0.5 hidden sm:block">Gaji & Hasil Usaha</div>
                </div>
              </button>

              <!-- Shortcut 3: Pengeluaran (- Keluar) -->
              <button 
                @click="openTransactionModal('expense')"
                type="button"
                class="p-3.5 sm:p-4 md:p-5 min-h-[96px] sm:min-h-[110px] rounded-2xl bg-white hover:bg-rose-50/40 border border-slate-200/90 hover:border-rose-300 shadow-xs hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between text-left group"
              >
                <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon name="expense" custom-class="w-5 h-5" />
                </div>
                <div>
                  <div class="text-xs sm:text-sm md:text-base font-extrabold text-slate-800 group-hover:text-rose-800 leading-tight">Pengeluaran</div>
                  <div class="text-[11px] text-slate-500 mt-0.5 hidden sm:block">Belanja & Biaya Hidup</div>
                </div>
              </button>

              <!-- Shortcut 4: Utang & Piutang -->
              <button 
                @click="activeTab = 'debts'"
                type="button"
                class="p-3.5 sm:p-4 md:p-5 min-h-[96px] sm:min-h-[110px] rounded-2xl bg-white hover:bg-amber-50/40 border border-slate-200/90 hover:border-amber-300 shadow-xs hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between text-left group"
              >
                <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon name="debt" custom-class="w-5 h-5" />
                </div>
                <div>
                  <div class="text-xs sm:text-sm md:text-base font-extrabold text-slate-800 group-hover:text-amber-800 leading-tight">Utang Piutang</div>
                  <div class="text-[11px] text-slate-500 mt-0.5 hidden sm:block">Kewajiban & Tagihan</div>
                </div>
              </button>
            </div>
          </div>

          <!-- 3. MINI PRATINJAU MUTASI TERKINI (Hanya 3 Transaksi Terakhir, Bebas Clutter) -->
          <div class="saas-card p-4 sm:p-6 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-sm sm:text-base font-bold text-slate-900">Transaksi Kas Terakhir</h3>
                <p class="text-xs text-slate-500">Pratinjau mutasi singkat dompet pribadi</p>
              </div>
              <button 
                @click="activeTab = 'mutations'" 
                type="button" 
                class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
              >
                <span>Lihat Semua Mutasi</span>
                <Icon name="chevron-right" custom-class="w-3.5 h-3.5" />
              </button>
            </div>

            <div class="divide-y divide-slate-100">
              <div 
                v-for="tx in financeStore.transactions.slice(0, 3)" 
                :key="tx.id"
                class="py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm min-w-0"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs', tx.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700']">
                    <Icon :name="tx.type === 'income' ? 'income' : 'expense'" custom-class="w-4 h-4" />
                  </div>
                  <div class="min-w-0">
                    <div class="font-bold text-slate-900 truncate">{{ tx.desc }}</div>
                    <div class="text-[11px] text-slate-500 truncate">{{ tx.date }} • {{ tx.category }} • {{ tx.account }}</div>
                  </div>
                </div>
                <div :class="['font-extrabold text-xs sm:text-sm md:text-base text-right tracking-tight tabular-nums whitespace-nowrap shrink-0', tx.type === 'income' ? 'text-emerald-700' : 'text-slate-900']">
                  {{ tx.type === 'income' ? '+' : '-' }}Rp {{ formatNumber(tx.amount) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 2: STATISTIK & ANALISIS KEFINANSIALAN -->
        <!-- ========================================== -->
        <div v-else-if="activeTab === 'analytics'" class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Statistik & Analisis Keuangan Pribadi</h2>
              <p class="text-xs sm:text-sm text-slate-500">Evaluasi persentase pengeluaran harian, rasio tabungan, dan skor kesehatan finansial</p>
            </div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
              <Icon name="chart" custom-class="w-4 h-4 text-emerald-700" />
              <span>Periode: Bulan Berjalan</span>
            </div>
          </div>

          <!-- 3 Analytical Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
            <div class="saas-card p-5 sm:p-6 space-y-2 min-w-0">
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400">Rasio Tabungan (Savings Rate)</div>
              <div class="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight tabular-nums">39.9%</div>
              <p class="text-xs text-slate-500">Persentase surplus yang berhasil disisihkan dari total penghasilan</p>
            </div>

            <div class="saas-card p-5 sm:p-6 space-y-2 min-w-0">
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400">Rata-rata Pengeluaran Harian</div>
              <div class="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums whitespace-nowrap overflow-hidden text-ellipsis">Rp {{ formatNumber(92600) }}</div>
              <p class="text-xs text-slate-500">Estimasi konsumsi harian untuk kebutuhan primer</p>
            </div>

            <div class="saas-card p-5 sm:p-6 space-y-2 min-w-0">
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400">Kesehatan Finansial</div>
              <div class="text-2xl sm:text-3xl font-extrabold text-teal-700 tracking-tight">PRIMA (A+)</div>
              <p class="text-xs text-slate-500">Bebas dari defisit dan utang konsumtif yang berlebihan</p>
            </div>
          </div>

          <!-- Visual Bar Breakdown: Kategori Pengeluaran -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="saas-card p-6 space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 class="text-base font-bold text-slate-900">Breakdown Kategori Pengeluaran</h3>
                <span class="text-xs text-slate-500">Bulan Ini</span>
              </div>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Makan & Minum</span>
                    <span class="font-mono">45% (Rp 1.250.000)</span>
                  </div>
                  <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-600 rounded-full" style="width: 45%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Belanja Kebutuhan Harian</span>
                    <span class="font-mono">30% (Rp 834.000)</span>
                  </div>
                  <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 rounded-full" style="width: 30%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Tagihan Listrik & Utilitas</span>
                    <span class="font-mono">15% (Rp 417.000)</span>
                  </div>
                  <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-amber-500 rounded-full" style="width: 15%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Transportasi & Bensin</span>
                    <span class="font-mono">10% (Rp 279.000)</span>
                  </div>
                  <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-rose-500 rounded-full" style="width: 10%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Rekomendasi Finansial Pintar -->
            <div class="saas-card p-6 space-y-4 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Icon name="sparkles" custom-class="w-5 h-5 text-emerald-600" />
                  <h3 class="text-base font-bold text-slate-900">Insight Asisten Finansial Pintar</h3>
                </div>
                <div class="mt-4 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <div class="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl">
                    <strong class="text-emerald-950 block font-bold mb-1">Pola Tabungan Sangat Sehat</strong>
                    Anda telah menyisihkan 39.9% dari total pendapatan bulan ini ke tabungan. Pertahankan ritme ini untuk dana darurat 6 bulan.
                  </div>
                  <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <strong class="text-slate-900 block font-bold mb-1">Pengingat Utang Jatuh Tempo</strong>
                    Terdapat 1 kewajiban utang jatuh tempo dalam 2 minggu ke depan. Saldo di rekening Mandiri mencukupi untuk pelunasan.
                  </div>
                </div>
              </div>
              <button 
                @click="$emit('toggle-ai')"
                type="button"
                class="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Konsultasikan dengan AI Finansial
              </button>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 3: RIWAYAT MUTASI LENGKAP -->
        <!-- ========================================== -->
        <div v-else-if="activeTab === 'mutations'" class="space-y-6">
          <div class="saas-card p-6 sm:p-7 space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 class="text-lg sm:text-xl font-bold text-slate-900">Buku Kas & Riwayat Mutasi</h2>
                <p class="text-xs sm:text-sm text-slate-500">Pencatatan seluruh uang masuk dan keluar pada dompet Anda</p>
              </div>

              <!-- Action & Filter Pills -->
              <div class="flex flex-wrap items-center gap-2">
                <button 
                  @click="showExcelReportModal = true"
                  type="button"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  title="Lihat & Download Laporan Mutasi Harian / Bulanan Excel"
                >
                  <svg class="w-3.5 h-3.5 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <span>Laporan Mutasi Excel</span>
                </button>

                <button 
                  @click="openTransactionModal('expense')"
                  type="button"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Icon name="plus" custom-class="w-3.5 h-3.5" />
                  <span>Catat Manual</span>
                </button>

                <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs sm:text-sm">
                  <button 
                    v-for="f in ['all', 'income', 'expense']" 
                    :key="f"
                    @click="filterType = f"
                    :class="[
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      filterType === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    ]"
                  >
                    {{ f === 'all' ? 'Semua' : f === 'income' ? 'Masuk' : 'Keluar' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- List Mutasi Lengkap dengan Tombol Koreksi & Hapus -->
            <div class="space-y-2.5">
              <div v-if="filteredList.length === 0" class="text-center py-12 text-slate-400 text-sm">
                Belum ada catatan mutasi transaksi pada filter ini.
              </div>

              <div 
                v-for="tx in filteredList" 
                :key="tx.id"
                class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-white hover:bg-slate-50/80 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs"
              >
                <div class="flex items-center gap-3.5">
                  <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs', tx.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700']">
                    <Icon :name="tx.type === 'income' ? 'income' : 'expense'" custom-class="w-4 h-4" />
                  </div>
                  <div>
                    <div class="font-bold text-sm text-slate-900 leading-snug">{{ tx.desc }}</div>
                    <div class="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                      <span class="font-semibold text-slate-700">{{ tx.category }}</span>
                      <span>•</span>
                      <span>{{ tx.date }}</span>
                      <span>•</span>
                      <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">{{ tx.account }}</span>
                      <span v-if="tx.tag" class="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">{{ tx.tag }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <div :class="['font-extrabold text-sm sm:text-base tracking-tight tabular-nums whitespace-nowrap', tx.type === 'income' ? 'text-emerald-700' : 'text-slate-900']">
                    {{ tx.type === 'income' ? '+' : '-' }}Rp {{ formatNumber(tx.amount) }}
                  </div>
                  <div class="flex items-center gap-1.5">
                    <button 
                      @click="openEditTxModal(tx)"
                      title="Koreksi transaksi ini"
                      class="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Icon name="edit" custom-class="w-3.5 h-3.5" />
                      <span>Ubah</span>
                    </button>
                    <button 
                      @click="financeStore.deleteTransaction(tx.id)"
                      title="Hapus transaksi ini"
                      class="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Icon name="trash" custom-class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 4: KANTONG REKENING (PISAH TUNAI, BANK, E-WALLET) -->
        <!-- ========================================== -->
        <div v-else-if="activeTab === 'pockets'" class="space-y-6">
          <div class="saas-card p-4 sm:p-6 lg:p-7 space-y-6">
            <!-- Header Tab Kantong -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
              <div>
                <h2 class="text-base sm:text-xl font-bold text-slate-900 tracking-tight">Kantong Rekening & Dompet</h2>
                <p class="text-xs sm:text-sm text-slate-500">Pemisahan kas riil: Kas Tunai, Rekening Bank, dan Dompet Digital</p>
              </div>
              <button 
                @click="openAddAccountModal('bank')"
                type="button"
                class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer self-start sm:self-auto"
              >
                <Icon name="plus" custom-class="w-4 h-4" />
                <span>Tambah Kantong</span>
              </button>
            </div>

            <!-- 1. KAS TUNAI (CASH) - Clean Minimalist Accent, No Heavy Colored Box -->
            <div class="space-y-3">
              <div class="flex items-center justify-between py-2 border-b border-slate-200/70">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <h3 class="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">Kas Tunai</h3>
                  <span class="text-[11px] text-slate-600 hidden sm:inline">• Uang fisik dompet & laci kasir</span>
                </div>
                <div class="flex items-baseline gap-1.5 shrink-0 text-right">
                  <span class="text-[11px] uppercase font-bold text-slate-600">Subtotal</span>
                  <span class="text-sm sm:text-base font-extrabold text-slate-900 font-mono tracking-tight tabular-nums whitespace-nowrap">
                    Rp {{ formatNumber(financeStore.totalCash) }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div 
                  v-for="acc in financeStore.cashAccounts" 
                  :key="acc.id"
                  class="p-4 bg-white hover:bg-slate-50/60 border border-slate-200/80 hover:border-slate-300 rounded-2xl space-y-3 transition-all shadow-2xs group"
                >
                  <div class="flex items-center justify-between gap-2 min-w-0">
                    <div class="flex items-center gap-2 min-w-0">
                      <div class="w-7 h-7 rounded-lg bg-slate-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Icon name="cash" custom-class="w-3.5 h-3.5" />
                      </div>
                      <span class="text-xs sm:text-sm font-bold text-slate-800 truncate">{{ acc.name }}</span>
                    </div>
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Kas Tunai"></span>
                  </div>
                  <div>
                    <div class="text-[10px] uppercase font-semibold text-slate-600 tracking-wider">Saldo</div>
                    <div class="text-base sm:text-lg font-black text-slate-900 tracking-tight font-mono tabular-nums whitespace-nowrap overflow-hidden text-ellipsis">
                      Rp {{ formatNumber(acc.balance) }}
                    </div>
                  </div>
                  <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button 
                      @click="openEditAccountModal(acc)"
                      class="text-slate-500 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Icon name="edit" custom-class="w-3.5 h-3.5" />
                      <span>Ubah</span>
                    </button>
                    <button 
                      @click="deleteAccountConfirm(acc)"
                      class="text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Icon name="trash" custom-class="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
                <div 
                  v-if="financeStore.cashAccounts.length === 0" 
                  class="col-span-full p-4 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400"
                >
                  Belum ada kantong kas tunai. <button @click="openAddAccountModal('cash')" class="text-emerald-700 font-bold underline cursor-pointer">Tambah Kas Tunai</button>
                </div>
              </div>
            </div>

            <!-- 2. REKENING BANK - Clean Minimalist Accent, No Heavy Colored Box -->
            <div class="space-y-3 pt-3">
              <div class="flex items-center justify-between py-2 border-b border-slate-200/70">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0"></span>
                  <h3 class="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">Rekening Bank</h3>
                  <span class="text-[11px] text-slate-600 hidden sm:inline">• Tabungan resmi, giro & payroll</span>
                </div>
                <div class="flex items-baseline gap-1.5 shrink-0 text-right">
                  <span class="text-[11px] uppercase font-bold text-slate-600">Subtotal</span>
                  <span class="text-sm sm:text-base font-extrabold text-slate-900 font-mono tracking-tight tabular-nums whitespace-nowrap">
                    Rp {{ formatNumber(financeStore.totalBank) }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div 
                  v-for="acc in financeStore.bankAccounts" 
                  :key="acc.id"
                  class="p-4 bg-white hover:bg-slate-50/60 border border-slate-200/80 hover:border-slate-300 rounded-2xl space-y-3 transition-all shadow-2xs group"
                >
                  <div class="flex items-center justify-between gap-2 min-w-0">
                    <div class="flex items-center gap-2 min-w-0">
                      <div class="w-7 h-7 rounded-lg bg-slate-100 text-sky-700 flex items-center justify-center shrink-0">
                        <Icon name="credit-card" custom-class="w-3.5 h-3.5" />
                      </div>
                      <span class="text-xs sm:text-sm font-bold text-slate-800 truncate">{{ acc.name }}</span>
                    </div>
                    <span class="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" title="Rekening Bank"></span>
                  </div>
                  <div>
                    <div class="text-[10px] uppercase font-semibold text-slate-600 tracking-wider">Saldo</div>
                    <div class="text-base sm:text-lg font-black text-slate-900 tracking-tight font-mono tabular-nums whitespace-nowrap overflow-hidden text-ellipsis">
                      Rp {{ formatNumber(acc.balance) }}
                    </div>
                  </div>
                  <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button 
                      @click="openEditAccountModal(acc)"
                      class="text-slate-500 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Icon name="edit" custom-class="w-3.5 h-3.5" />
                      <span>Ubah</span>
                    </button>
                    <button 
                      @click="deleteAccountConfirm(acc)"
                      class="text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Icon name="trash" custom-class="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
                <div 
                  v-if="financeStore.bankAccounts.length === 0" 
                  class="col-span-full p-4 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400"
                >
                  Belum ada rekening bank. <button @click="openAddAccountModal('bank')" class="text-sky-700 font-bold underline cursor-pointer">Tambah Rekening Bank</button>
                </div>
              </div>
            </div>

            <!-- 3. DOMPET DIGITAL / E-WALLET - Clean Minimalist Accent, No Heavy Colored Box -->
            <div class="space-y-3 pt-3">
              <div class="flex items-center justify-between py-2 border-b border-slate-200/70">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="w-2.5 h-2.5 rounded-full bg-violet-500 shrink-0"></span>
                  <h3 class="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">Dompet Digital (E-Wallet)</h3>
                  <span class="text-[11px] text-slate-600 hidden sm:inline">• Saldo GoPay, OVO, Dana, ShopeePay</span>
                </div>
                <div class="flex items-baseline gap-1.5 shrink-0 text-right">
                  <span class="text-[11px] uppercase font-bold text-slate-600">Subtotal</span>
                  <span class="text-sm sm:text-base font-extrabold text-slate-900 font-mono tracking-tight tabular-nums whitespace-nowrap">
                    Rp {{ formatNumber(financeStore.totalEwallet) }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div 
                  v-for="acc in financeStore.ewalletAccounts" 
                  :key="acc.id"
                  class="p-4 bg-white hover:bg-slate-50/60 border border-slate-200/80 hover:border-slate-300 rounded-2xl space-y-3 transition-all shadow-2xs group"
                >
                  <div class="flex items-center justify-between gap-2 min-w-0">
                    <div class="flex items-center gap-2 min-w-0">
                      <div class="w-7 h-7 rounded-lg bg-slate-100 text-violet-700 flex items-center justify-center shrink-0">
                        <Icon name="smartphone" custom-class="w-3.5 h-3.5" />
                      </div>
                      <span class="text-xs sm:text-sm font-bold text-slate-800 truncate">{{ acc.name }}</span>
                    </div>
                    <span class="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" title="Dompet Digital"></span>
                  </div>
                  <div>
                    <div class="text-[10px] uppercase font-semibold text-slate-600 tracking-wider">Saldo</div>
                    <div class="text-base sm:text-lg font-black text-slate-900 tracking-tight font-mono tabular-nums whitespace-nowrap overflow-hidden text-ellipsis">
                      Rp {{ formatNumber(acc.balance) }}
                    </div>
                  </div>
                  <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button 
                      @click="openEditAccountModal(acc)"
                      class="text-slate-500 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Icon name="edit" custom-class="w-3.5 h-3.5" />
                      <span>Ubah</span>
                    </button>
                    <button 
                      @click="deleteAccountConfirm(acc)"
                      class="text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Icon name="trash" custom-class="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
                <div 
                  v-if="financeStore.ewalletAccounts.length === 0" 
                  class="col-span-full p-4 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400"
                >
                  Belum ada akun e-wallet. <button @click="openAddAccountModal('ewallet')" class="text-violet-700 font-bold underline cursor-pointer">Tambah E-Wallet</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 5: BUKU UTANG & PIUTANG (FLEKSIBEL SINKRON KAS) -->
        <!-- ========================================== -->
        <div v-else-if="activeTab === 'debts'" class="space-y-6">
          <div class="saas-card p-6 sm:p-7 space-y-6">
            <!-- Header Utang Piutang -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 class="text-lg sm:text-xl font-bold text-slate-900">Buku Utang & Piutang</h2>
                <p class="text-xs sm:text-sm text-slate-500">Kewajiban pinjaman dan hak tagih dengan opsi fleksibel sinkronisasi ke buku kas</p>
              </div>

              <!-- Tombol Aksi Tambah -->
              <div class="flex flex-wrap items-center gap-2">
                <button 
                  @click="openAddDebtModal('utang')"
                  type="button"
                  class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                >
                  <Icon name="plus" custom-class="w-4 h-4" />
                  <span>Catat Utang Saya</span>
                </button>
                <button 
                  @click="openAddDebtModal('piutang')"
                  type="button"
                  class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                >
                  <Icon name="plus" custom-class="w-4 h-4" />
                  <span>Catat Piutang</span>
                </button>
              </div>
            </div>

            <!-- 3 Kartu Ringkasan Posisi Keuangan -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div class="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1 min-w-0">
                <div class="text-[10px] font-bold uppercase text-amber-800">Total Utang Saya (Kewajiban)</div>
                <div class="text-lg sm:text-xl lg:text-2xl font-black text-amber-950 tracking-tight tabular-nums whitespace-nowrap overflow-hidden text-ellipsis">
                  Rp {{ formatNumber(financeStore.totalUtang) }}
                </div>
                <div class="text-[11px] text-amber-700 font-medium">Uang yang harus segera Anda bayarkan</div>
              </div>

              <div class="p-4 bg-sky-50/60 border border-sky-200 rounded-xl space-y-1 min-w-0">
                <div class="text-[10px] font-bold uppercase text-sky-800">Total Piutang (Hak Tagih)</div>
                <div class="text-lg sm:text-xl lg:text-2xl font-black text-sky-950 tracking-tight tabular-nums whitespace-nowrap overflow-hidden text-ellipsis">
                  Rp {{ formatNumber(financeStore.totalPiutang) }}
                </div>
                <div class="text-[11px] text-sky-700 font-medium">Uang Anda yang dipinjam pihak lain</div>
              </div>

              <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 min-w-0">
                <div class="text-[10px] font-bold uppercase text-slate-500">Posisi Bersih (Piutang - Utang)</div>
                <div :class="['text-lg sm:text-xl lg:text-2xl font-black tracking-tight tabular-nums whitespace-nowrap overflow-hidden text-ellipsis', financeStore.totalPiutang >= financeStore.totalUtang ? 'text-emerald-700' : 'text-rose-600']">
                  {{ financeStore.totalPiutang >= financeStore.totalUtang ? '+' : '' }}Rp {{ formatNumber(financeStore.totalPiutang - financeStore.totalUtang) }}
                </div>
                <div class="text-[11px] text-slate-500 font-medium">Selisih klaim tagihan vs pinjaman</div>
              </div>
            </div>

            <!-- Filter Sub-Tab (Semua, Utang, Piutang, Riwayat Pelunasan Sinkron) -->
            <div class="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2">
              <button 
                v-for="tab in [
                  { id: 'all', label: 'Semua Catatan' },
                  { id: 'utang', label: 'Utang Saya' },
                  { id: 'piutang', label: 'Piutang (Hak Tagih)' },
                  { id: 'history', label: 'Riwayat Pelunasan Sinkron' }
                ]"
                :key="tab.id"
                @click="debtFilter = tab.id"
                :class="[
                  'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                  debtFilter === tab.id 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                ]"
              >
                {{ tab.label }}
              </button>
            </div>

            <!-- Konten 1: Kartu Utang & Piutang Aktif -->
            <div v-if="debtFilter !== 'history'" class="space-y-3">
              <div v-if="filteredDebts.length === 0" class="text-center py-12 text-slate-400 text-sm">
                Belum ada catatan utang atau piutang pada filter ini.
              </div>

              <div 
                v-for="d in filteredDebts" 
                :key="d.id"
                :class="[
                  'p-4 sm:p-5 rounded-2xl border transition-all space-y-4 shadow-xs',
                  d.type === 'utang' ? 'bg-amber-50/20 border-amber-200/90' : 'bg-sky-50/20 border-sky-200/90'
                ]"
              >
                <!-- Baris Atas: Nama Kontak, Tipe, Status, dan Tombol Hapus -->
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <span :class="['px-2.5 py-0.5 text-[11px] font-extrabold rounded-full uppercase tracking-wider', d.type === 'utang' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-sky-100 text-sky-900 border border-sky-300']">
                      {{ d.type === 'utang' ? 'Utang Saya' : 'Hak Piutang' }}
                    </span>
                    <span :class="[
                      'px-2 py-0.5 text-[10px] font-bold rounded-md',
                      d.status === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : d.status === 'Sebagian' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    ]">
                      {{ d.status }}
                    </span>
                  </div>

                  <button 
                    @click="deleteDebtConfirm(d)"
                    class="text-xs text-slate-400 hover:text-rose-600 font-medium transition-colors cursor-pointer flex items-center gap-1"
                    title="Hapus catatan ini"
                  >
                    <Icon name="trash" custom-class="w-3.5 h-3.5" />
                    <span class="hidden sm:inline">Hapus</span>
                  </button>
                </div>

                <!-- Baris Tengah: Info Kontak, Pokok, Sisa, Progress Bar -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 class="text-base font-bold text-slate-900">{{ d.contact }}</h3>
                    <p v-if="d.note" class="text-xs text-slate-500 mt-0.5 italic">"{{ d.note }}"</p>
                    <div class="mt-2 text-xs text-slate-500 flex flex-wrap items-center gap-2">
                      <span>Jatuh Tempo: <strong class="text-slate-700">{{ d.dueDate }}</strong></span>
                      <span>•</span>
                      <span>Rekening Acuan: <strong class="text-slate-700">{{ d.accountName }}</strong></span>
                    </div>
                  </div>

                  <div class="sm:text-right space-y-1 min-w-0">
                    <div class="text-[11px] uppercase font-bold text-slate-400">Sisa Tagihan / Kewajiban</div>
                    <div :class="['text-xl sm:text-2xl font-black tracking-tight tabular-nums whitespace-nowrap overflow-hidden text-ellipsis', d.type === 'utang' ? 'text-amber-950' : 'text-sky-950']">
                      Rp {{ formatNumber(Math.max(0, d.total - d.paid)) }}
                    </div>
                    <div class="text-xs text-slate-500 tabular-nums">
                      Total Pokok: <strong>Rp {{ formatNumber(d.total) }}</strong> (Terbayar: Rp {{ formatNumber(d.paid) }})
                    </div>
                  </div>
                </div>

                <!-- Progress Bar Pelunasan -->
                <div class="space-y-1">
                  <div class="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>Progres Pembayaran</span>
                    <span>{{ Math.min(100, Math.round((d.paid / (d.total || 1)) * 100)) }}%</span>
                  </div>
                  <div class="w-full h-2.5 bg-slate-200/70 rounded-full overflow-hidden">
                    <div 
                      :class="['h-full rounded-full transition-all duration-300', d.status === 'Lunas' ? 'bg-emerald-600' : d.type === 'utang' ? 'bg-amber-500' : 'bg-sky-500']"
                      :style="{ width: `${Math.min(100, (d.paid / (d.total || 1)) * 100)}%` }"
                    ></div>
                  </div>
                </div>

                <!-- Baris Bawah: Tombol Aksi Cicilan & Toggle Riwayat Cicilan -->
                <div class="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
                  <button 
                    @click="toggleDebtHistory(d.id)"
                    class="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Icon name="history" custom-class="w-3.5 h-3.5 text-slate-400" />
                    <span>Riwayat Cicilan ({{ d.payments ? d.payments.length : 0 }})</span>
                    <Icon :name="expandedDebtIds.has(d.id) ? 'chevron-down' : 'chevron-right'" custom-class="w-3 h-3 text-slate-400" />
                  </button>

                  <div class="flex items-center gap-2">
                    <button 
                      v-if="d.paid < d.total"
                      @click="openSettleModal(d)"
                      type="button"
                      :class="[
                        'px-4 py-1.5 rounded-xl font-bold text-xs text-white shadow-xs transition-all cursor-pointer',
                        d.type === 'utang' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-sky-600 hover:bg-sky-700'
                      ]"
                    >
                      {{ d.type === 'utang' ? 'Bayar Cicilan / Lunasi' : 'Terima Pelunasan / Cicilan' }}
                    </button>
                    <span v-else class="text-xs font-bold text-emerald-700 px-3 py-1 bg-emerald-50 rounded-lg">
                      ✓ Telah Lunas
                    </span>
                  </div>
                </div>

                <!-- Bagian Detail Riwayat Pembayaran (Expandable Accordion) -->
                <div v-if="expandedDebtIds.has(d.id)" class="pt-3 border-t border-slate-200/80 space-y-2">
                  <div class="text-xs font-bold text-slate-700">Catatan Pelunasan & Cicilan:</div>
                  <div v-if="!d.payments || d.payments.length === 0" class="text-xs text-slate-400 italic">
                    Belum ada riwayat cicilan yang dicatat untuk item ini.
                  </div>
                  <div 
                    v-for="p in d.payments" 
                    :key="p.id"
                    class="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs shadow-2xs"
                  >
                    <div>
                      <div class="font-bold text-slate-800">{{ p.date }} • {{ p.account }}</div>
                      <div class="text-slate-500 text-[11px]">{{ p.note || 'Pelunasan bertahap' }}</div>
                    </div>
                    <div class="font-black text-slate-900 tracking-tight">
                      Rp {{ formatNumber(p.amount) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Konten 2: Log Riwayat Pelunasan Sinkron -->
            <div v-else class="space-y-3">
              <div v-if="allDebtPaymentHistory.length === 0" class="text-center py-12 text-slate-400 text-sm">
                Belum ada mutasi pelunasan utang atau piutang yang tercatat.
              </div>

              <div 
                v-for="p in allDebtPaymentHistory" 
                :key="p.id"
                class="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs"
              >
                <div class="flex items-center gap-3">
                  <div :class="['w-9 h-9 rounded-lg flex items-center justify-center font-bold', p.debtType === 'utang' ? 'bg-amber-100 text-amber-900' : 'bg-sky-100 text-sky-900']">
                    <Icon :name="p.debtType === 'utang' ? 'expense' : 'income'" custom-class="w-4 h-4" />
                  </div>
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-900">
                      {{ p.debtType === 'utang' ? 'Pelunasan Utang ke' : 'Terima Piutang dari' }} {{ p.contact }}
                    </div>
                    <div class="text-[11px] text-slate-500 mt-0.5">
                      {{ p.date }} • Rekening: <strong class="text-slate-700">{{ p.account }}</strong> • {{ p.note }}
                    </div>
                  </div>
                </div>

                <div :class="['font-extrabold text-sm sm:text-base tracking-tight', p.debtType === 'utang' ? 'text-amber-900' : 'text-sky-900']">
                  {{ p.debtType === 'utang' ? '-' : '+' }}Rp {{ formatNumber(p.amount) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 6: PROFIL PENGGUNA & PIN KEAMANAN -->
        <div v-else-if="activeTab === 'profile'" class="space-y-6">
          <ProfileView />
        </div>

        <!-- TAB 7: PENGATURAN APLIKASI -->
        <div v-else-if="activeTab === 'settings'" class="space-y-6">
          <AppSettingsView @navigate="activeTab = $event" />
        </div>
      </main>

      <!-- Minimalist Desktop Footer (Hidden on Mobile & Tablet to prevent clutter) -->
      <footer class="hidden lg:flex py-3 px-6 bg-white border-t border-slate-200/80 text-xs text-slate-400 items-center justify-between mt-auto select-none">
        <div>{{ settingsStore.appName }} &copy; 2026</div>
        <div class="text-[11px] font-medium text-slate-400">Dompet & Keuangan Terenkripsi</div>
      </footer>
    </div>

    <!-- Modal Form Tambah Transaksi -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 class="text-base sm:text-lg font-bold text-slate-900">
            {{ modalType === 'income' ? 'Catat Pemasukan Pribadi' : 'Catat Pengeluaran Pribadi' }}
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 cursor-pointer">
            <Icon name="close" custom-class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="saveTransaction" class="space-y-4">
          <div>
            <label class="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Nominal (Rupiah)</label>
            <input 
              v-model.number="formAmount" 
              type="number" 
              required
              placeholder="Contoh: 50000" 
              class="w-full px-4 py-2.5 text-base sm:text-lg font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Keterangan Transaksi</label>
            <input 
              v-model="formDesc" 
              type="text" 
              required
              placeholder="Contoh: Makan Siang, Bensin, Gaji Bulanan" 
              class="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Kategori</label>
              <select v-model="formCategory" class="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 font-medium">
                <option value="Makan & Minum">Makan & Minum</option>
                <option value="Transportasi">Transportasi</option>
                <option value="Tagihan & Utilitas">Tagihan & Utilitas</option>
                <option value="Gaji & Hasil Usaha">Gaji & Hasil Usaha</option>
                <option value="Belanja Kebutuhan">Belanja Kebutuhan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label class="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Pilih Rekening</label>
              <select v-model="formAccount" class="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 font-medium">
                <option v-for="acc in financeStore.accounts" :key="acc.id" :value="acc.name">
                  {{ acc.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" @click="showModal = false" class="px-5 py-2.5 text-sm text-slate-500 hover:text-slate-800 font-semibold cursor-pointer">Batal</button>
            <button 
              type="submit" 
              class="px-6 py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs cursor-pointer transition-all"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 1: Catat Utang / Piutang Baru (Point 2: Fleksibel Sinkron Kas) -->
    <div v-if="showAddDebtModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-base sm:text-lg font-bold text-slate-900">
              Catat {{ newDebtForm.type === 'utang' ? 'Utang Baru (Kewajiban)' : 'Piutang Baru (Hak Tagih)' }}
            </h3>
            <p class="text-xs text-slate-500">Pencatatan pinjaman dengan opsi fleksibel sinkronisasi kas</p>
          </div>
          <button @click="showAddDebtModal = false" class="text-slate-400 hover:text-slate-600 cursor-pointer">
            <Icon name="close" custom-class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="submitNewDebt" class="space-y-4">
          <!-- Pilihan Tipe Utang vs Piutang -->
          <div class="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button 
              type="button" 
              @click="newDebtForm.type = 'utang'"
              :class="['py-2 rounded-lg transition-all cursor-pointer text-center', newDebtForm.type === 'utang' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900']"
            >
              Utang Saya (Pinjaman)
            </button>
            <button 
              type="button" 
              @click="newDebtForm.type = 'piutang'"
              :class="['py-2 rounded-lg transition-all cursor-pointer text-center', newDebtForm.type === 'piutang' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900']"
            >
              Piutang (Hak Tagih)
            </button>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Nama Pihak / Kontak</label>
            <input 
              v-model="newDebtForm.contact" 
              type="text" 
              required
              placeholder="Contoh: Budi Santoso, Toko Sumber Makmur" 
              class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Total Nominal (Rp)</label>
              <input 
                v-model.number="newDebtForm.total" 
                type="number" 
                required
                placeholder="Contoh: 1500000" 
                class="w-full px-3.5 py-2.5 text-base font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Tanggal Jatuh Tempo</label>
              <input 
                v-model="newDebtForm.dueDate" 
                type="date" 
                required
                class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Rekening Acuan Pembayaran</label>
            <select v-model="newDebtForm.accountName" class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 font-medium">
              <option v-for="acc in financeStore.accounts" :key="acc.id" :value="acc.name">
                {{ acc.name }} (Saldo: Rp {{ formatNumber(acc.balance) }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Catatan / Keperluan (Opsional)</label>
            <input 
              v-model="newDebtForm.note" 
              type="text" 
              placeholder="Contoh: Pinjaman modal usaha, talangan belanja" 
              class="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <!-- Pilihan Fleksibel Point 2: Toggle Sinkronisasi Kas Riil -->
          <label class="flex items-start gap-3 p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl cursor-pointer transition-colors">
            <input 
              type="checkbox" 
              v-model="newDebtForm.syncToCash" 
              class="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
            />
            <div class="space-y-0.5">
              <div class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Sinkronkan ke Saldo Rekening Kas Riil</span>
                <span class="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold uppercase">Fleksibel</span>
              </div>
              <div class="text-[11px] text-slate-500 leading-relaxed">
                {{ newDebtForm.type === 'utang' ? 'Saldo rekening akan otomatis bertambah (uang pinjaman diterima di buku kas).' : 'Saldo rekening akan otomatis berkurang (uang kas riil keluar dipinjamkan).' }}
              </div>
            </div>
          </label>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" @click="showAddDebtModal = false" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer">
              Batal
            </button>
            <button 
              type="submit" 
              :class="[
                'px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs cursor-pointer transition-all',
                newDebtForm.type === 'utang' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-sky-600 hover:bg-sky-700'
              ]"
            >
              Simpan {{ newDebtForm.type === 'utang' ? 'Utang' : 'Piutang' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 2: Pelunasan / Cicilan (Point 2: Fleksibel Sinkron Kas) -->
    <div v-if="showSettleModal && selectedDebt" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-base sm:text-lg font-bold text-slate-900">
              {{ selectedDebt.type === 'utang' ? 'Bayar Cicilan / Pelunasan Utang' : 'Terima Pembayaran Piutang' }}
            </h3>
            <p class="text-xs text-slate-500">Pihak: <strong>{{ selectedDebt.contact }}</strong></p>
          </div>
          <button @click="showSettleModal = false" class="text-slate-400 hover:text-slate-600 cursor-pointer">
            <Icon name="close" custom-class="w-5 h-5" />
          </button>
        </div>

        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
          <div>
            <div class="text-slate-500">Sisa Tagihan Saat Ini</div>
            <div class="text-base font-extrabold text-slate-900 tracking-tight">
              Rp {{ formatNumber(Math.max(0, selectedDebt.total - selectedDebt.paid)) }}
            </div>
          </div>
          <button 
            type="button" 
            @click="settleForm.amount = Math.max(0, selectedDebt.total - selectedDebt.paid)"
            class="px-2.5 py-1 rounded bg-white border border-slate-300 hover:border-emerald-500 text-xs font-bold text-slate-700 hover:text-emerald-700 cursor-pointer"
          >
            Lunasi Penuh
          </button>
        </div>

        <form @submit.prevent="submitSettleDebt" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Nominal Pembayaran (Rp)</label>
            <input 
              v-model.number="settleForm.amount" 
              type="number" 
              required
              :max="Math.max(0, selectedDebt.total - selectedDebt.paid)"
              placeholder="Contoh: 500000" 
              class="w-full px-3.5 py-2.5 text-base font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Rekening Kas Pembayaran</label>
            <select v-model="settleForm.accountName" class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 font-medium">
              <option v-for="acc in financeStore.accounts" :key="acc.id" :value="acc.name">
                {{ acc.name }} (Saldo: Rp {{ formatNumber(acc.balance) }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Catatan Pembayaran (Opsional)</label>
            <input 
              v-model="settleForm.note" 
              type="text" 
              placeholder="Contoh: Cicilan tahap 2 via transfer BCA" 
              class="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <!-- Pilihan Fleksibel Point 2: Toggle Sinkronisasi Kas Riil -->
          <label class="flex items-start gap-3 p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl cursor-pointer transition-colors">
            <input 
              type="checkbox" 
              v-model="settleForm.syncToCash" 
              class="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
            />
            <div class="space-y-0.5">
              <div class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Sinkronkan ke Saldo Rekening Kas Riil</span>
                <span class="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold uppercase">Fleksibel</span>
              </div>
              <div class="text-[11px] text-slate-500 leading-relaxed">
                {{ selectedDebt.type === 'utang' ? 'Saldo kas rekening akan otomatis dipotong untuk membayar utang ini.' : 'Saldo kas rekening akan otomatis bertambah dari pelunasan piutang ini.' }}
              </div>
            </div>
          </label>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" @click="showSettleModal = false" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer">
              Batal
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs cursor-pointer transition-all"
            >
              Konfirmasi Pelunasan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 3: Manajemen Kantong Rekening (Tambah / Ubah) -->
    <div v-if="showAccountModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-base sm:text-lg font-bold text-slate-900">
              {{ isEditingAccount ? 'Ubah Kantong Rekening' : 'Tambah Kantong Rekening' }}
            </h3>
            <p class="text-xs text-slate-500">Kelola kas tunai, bank, atau dompet digital Anda</p>
          </div>
          <button @click="showAccountModal = false" class="text-slate-400 hover:text-slate-600 cursor-pointer">
            <Icon name="close" custom-class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="saveAccountModal" class="space-y-4">
          <!-- Pilihan Kategori Kantong (Tunai, Bank, E-Wallet) -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">Kategori Kantong</label>
            <div class="grid grid-cols-3 gap-2">
              <button 
                type="button" 
                @click="accountForm.type = 'cash'"
                :class="['p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all cursor-pointer', accountForm.type === 'cash' ? 'bg-white border-emerald-600 text-emerald-900 shadow-xs ring-2 ring-emerald-500/20' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100']"
              >
                <Icon name="cash" custom-class="w-4 h-4 text-emerald-600" />
                <span>Kas Tunai</span>
              </button>
              <button 
                type="button" 
                @click="accountForm.type = 'bank'"
                :class="['p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all cursor-pointer', accountForm.type === 'bank' ? 'bg-white border-sky-600 text-sky-900 shadow-xs ring-2 ring-sky-500/20' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100']"
              >
                <Icon name="credit-card" custom-class="w-4 h-4 text-sky-600" />
                <span>Rekening Bank</span>
              </button>
              <button 
                type="button" 
                @click="accountForm.type = 'ewallet'"
                :class="['p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all cursor-pointer', accountForm.type === 'ewallet' ? 'bg-white border-violet-600 text-violet-900 shadow-xs ring-2 ring-violet-500/20' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100']"
              >
                <Icon name="smartphone" custom-class="w-4 h-4 text-violet-600" />
                <span>E-Wallet</span>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Nama Kantong / Rekening</label>
            <input 
              v-model="accountForm.name" 
              type="text" 
              required
              placeholder="Contoh: Dompet Tunai Saku, BCA Bisnis, ShopeePay" 
              class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Saldo Tersedia (Rp)</label>
            <input 
              v-model.number="accountForm.balance" 
              type="number" 
              required
              placeholder="Contoh: 1000000" 
              class="w-full px-3.5 py-2.5 text-base font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" @click="showAccountModal = false" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer">
              Batal
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs cursor-pointer transition-all"
            >
              Simpan Kantong
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 4: Koreksi Transaksi Mutasi (Mengatasi Anomali Buku Kas) -->
    <div v-if="showEditTxModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-base sm:text-lg font-bold text-slate-900">Koreksi Transaksi Mutasi</h3>
            <p class="text-xs text-slate-500">Koreksi nominal atau detail mutasi jika terdapat anomali data</p>
          </div>
          <button @click="showEditTxModal = false" class="text-slate-400 hover:text-slate-600 cursor-pointer">
            <Icon name="close" custom-class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="saveTxEdit" class="space-y-4">
          <div class="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button 
              type="button" 
              @click="txEditForm.type = 'income'"
              :class="['py-2 rounded-lg transition-all cursor-pointer text-center', txEditForm.type === 'income' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900']"
            >
              Uang Masuk (+)
            </button>
            <button 
              type="button" 
              @click="txEditForm.type = 'expense'"
              :class="['py-2 rounded-lg transition-all cursor-pointer text-center', txEditForm.type === 'expense' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900']"
            >
              Uang Keluar (-)
            </button>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Keterangan Transaksi</label>
            <input 
              v-model="txEditForm.desc" 
              type="text" 
              required
              class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Nominal (Rp)</label>
              <input 
                v-model.number="txEditForm.amount" 
                type="number" 
                required
                class="w-full px-3.5 py-2.5 text-base font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Tanggal</label>
              <input 
                v-model="txEditForm.date" 
                type="date" 
                required
                class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
              <select v-model="txEditForm.category" class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 font-medium">
                <option value="Makan & Minum">Makan & Minum</option>
                <option value="Transportasi">Transportasi</option>
                <option value="Tagihan & Utilitas">Tagihan & Utilitas</option>
                <option value="Gaji & Hasil Usaha">Gaji & Hasil Usaha</option>
                <option value="Belanja Kebutuhan">Belanja Kebutuhan</option>
                <option value="Pembayaran Utang">Pembayaran Utang</option>
                <option value="Pengembalian Piutang">Pengembalian Piutang</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Rekening</label>
              <select v-model="txEditForm.account" class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 font-medium">
                <option v-for="acc in financeStore.accounts" :key="acc.id" :value="acc.name">
                  {{ acc.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" @click="showEditTxModal = false" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer">
              Batal
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs cursor-pointer transition-all"
            >
              Simpan Koreksi
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 3. MODERN MOBILE & TABLET BOTTOM NAVIGATION BAR (Khusus Mobile & Tablet di Bawah 1024px) -->
    <div class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)] border-t border-slate-200/80 text-slate-500 px-3 py-1.5 flex items-center justify-around pb-4">
      <!-- 1. Beranda -->
      <button 
        @click="activeTab = 'overview'" 
        type="button" 
        :class="['flex flex-col items-center gap-1 w-14 transition-all cursor-pointer', activeTab === 'overview' ? 'text-emerald-700 font-bold scale-105' : 'text-slate-400 hover:text-slate-700']"
      >
        <Icon name="wallet" custom-class="w-5 h-5" />
        <span class="text-[10px] tracking-tight">Dompet</span>
      </button>

      <!-- 2. Aktivitas Mutasi -->
      <button 
        @click="activeTab = 'mutations'" 
        type="button" 
        :class="['flex flex-col items-center gap-1 w-14 transition-all cursor-pointer', activeTab === 'mutations' ? 'text-emerald-700 font-bold scale-105' : 'text-slate-400 hover:text-slate-700']"
      >
        <Icon name="receipt" custom-class="w-5 h-5" />
        <span class="text-[10px] tracking-tight">Mutasi</span>
      </button>

      <!-- 3. CENTER ELEVATED FLOATING ACTION BUTTON (Catat Keuangan Cepat) -->
      <div class="relative flex flex-col items-center -mt-7">
        <button 
          @click="showQrisModal = true"
          type="button"
          class="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-lg shadow-emerald-600/30 border-4 border-white flex items-center justify-center transform active:scale-95 hover:scale-105 transition-all cursor-pointer group"
          title="Catat Keuangan Cepat (Pengeluaran, Pemasukan, Pindah Saldo)"
        >
          <Icon name="plus" custom-class="w-6 h-6 text-white drop-shadow-xs group-hover:scale-110 transition-transform" stroke-width="2.5" />
        </button>
        <span class="text-[10px] font-bold tracking-wider text-emerald-800 mt-0.5 uppercase">Catat</span>
      </div>

      <!-- 4. Kantong Rekening -->
      <button 
        @click="activeTab = 'pockets'" 
        type="button" 
        :class="['flex flex-col items-center gap-1 w-14 transition-all cursor-pointer', activeTab === 'pockets' ? 'text-emerald-700 font-bold scale-105' : 'text-slate-400 hover:text-slate-700']"
      >
        <Icon name="credit-card" custom-class="w-5 h-5" />
        <span class="text-[10px] tracking-tight">Kantong</span>
      </button>

      <!-- 5. Menu Drawer Selengkapnya -->
      <button 
        @click="isMobileSidebarOpen = true" 
        type="button" 
        class="flex flex-col items-center gap-1 w-14 transition-all cursor-pointer text-slate-400 hover:text-slate-700"
      >
        <Icon name="menu" custom-class="w-5 h-5" />
        <span class="text-[10px] tracking-tight">Menu</span>
      </button>
    </div>

    <!-- Desktop Floating Action Pill (Akses Cepat Catat Keuangan di Komputer) -->
    <div class="hidden lg:block fixed bottom-6 right-6 z-40">
      <button 
        @click="showQrisModal = true"
        type="button"
        class="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 text-white font-black text-sm shadow-xl shadow-emerald-950/40 hover:shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-400/40"
      >
        <div class="w-8 h-8 rounded-xl bg-emerald-500/20 backdrop-blur-xs flex items-center justify-center text-emerald-300">
          <Icon name="plus" custom-class="w-5 h-5 text-emerald-300" stroke-width="2.5" />
        </div>
        <div class="text-left">
          <div class="text-[10px] uppercase tracking-wider text-emerald-300 font-extrabold leading-none">Pencatatan Instan</div>
          <div class="text-sm font-black leading-tight text-white">Catat Keuangan Cepat</div>
        </div>
      </button>
    </div>

    <!-- Modal Dialog Super Hub QRIS -->
    <QrisActionModal 
      v-if="showQrisModal" 
      @close="showQrisModal = false" 
    />

    <!-- Modal Laporan Mutasi Excel Harian & Bulanan (Viewer & Downloader) -->
    <ExcelMutationReportModal 
      v-if="showExcelReportModal" 
      @close="showExcelReportModal = false" 
    />

    <!-- Modal Tentang Aplikasi & Panduan Lengkap -->
    <AboutModal 
      :is-open="showAboutModal" 
      @close="showAboutModal = false" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useFinanceStore } from '../../stores/financeStore'
import { useSettingsStore } from '../../stores/settingsStore'
import Icon from '../common/Icon.vue'
import ProfileView from '../settings/ProfileView.vue'
import AppSettingsView from '../settings/AppSettingsView.vue'
import QrisActionModal from './QrisActionModal.vue'
import ExcelMutationReportModal from './ExcelMutationReportModal.vue'
import AboutModal from '../about/AboutModal.vue'

defineEmits(['toggle-ai'])

const authStore = useAuthStore()
const financeStore = useFinanceStore()
const settingsStore = useSettingsStore()

const isBalanceHidden = ref(false)
const isProfileMenuOpen = ref(false)
const showQrisModal = ref(false)
const showExcelReportModal = ref(false)
const showAboutModal = ref(false)
const activeTab = ref('overview')
const filterType = ref('all')

// State Buka-Tutup Sidebar Personal (Persisten di LocalStorage)
const isSidebarCollapsed = ref(localStorage.getItem('cakue_personal_sidebar_collapsed') === 'true')
const isMobileSidebarOpen = ref(false)

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  localStorage.setItem('cakue_personal_sidebar_collapsed', isSidebarCollapsed.value)
}

// Pintasan Keyboard (Cmd+B / Ctrl+B) untuk Buka-Tutup Sidebar
function handleKeyDown(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
    e.preventDefault()
    toggleSidebar()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

// Menu Navigasi Sidebar Personal
const personalNavigation = [
  { id: 'overview', label: 'Ringkasan Dompet', icon: 'wallet', badge: null },
  { id: 'quick-record', label: 'Catat Keuangan Cepat', icon: 'plus', badge: 'Instan' },
  { id: 'analytics', label: 'Statistik & Analisis', icon: 'chart', badge: 'Grafik' },
  { id: 'mutations', label: 'Riwayat Mutasi', icon: 'receipt', badge: null },
  { id: 'excel-report', label: 'Laporan Mutasi Excel', icon: 'chart', badge: 'Excel' },
  { id: 'pockets', label: 'Kantong Rekening', icon: 'credit-card', badge: null },
  { id: 'debts', label: 'Buku Utang & Piutang', icon: 'debt', badge: null }
]

function handleNavClick(item) {
  if (item.id === 'quick-record' || item.id === 'qris') {
    showQrisModal.value = true
    isMobileSidebarOpen.value = false
    return
  }
  if (item.id === 'excel-report') {
    showExcelReportModal.value = true
    isMobileSidebarOpen.value = false
    return
  }
  activeTab.value = item.id
  isMobileSidebarOpen.value = false
}

const activeTabLabel = computed(() => {
  if (activeTab.value === 'profile') return 'Profil & Keamanan'
  if (activeTab.value === 'settings') return 'Pengaturan Aplikasi'
  const current = personalNavigation.find(t => t.id === activeTab.value)
  return current ? current.label : 'Dompet Pribadi'
})

// Format angka mata uang Rupiah
function formatNumber(num) {
  return (num || 0).toLocaleString('id-ID')
}

// ========================================================
// 1. MANAJEMEN TRANSAKSI & KOREKSI ANOMALI
// ========================================================
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

function openTransactionModal(type) {
  modalType.value = type
  formAmount.value = ''
  formDesc.value = ''
  formCategory.value = type === 'income' ? 'Gaji & Hasil Usaha' : 'Makan & Minum'
  formAccount.value = financeStore.accounts[0]?.name || 'BCA Prioritas'
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
    tag: 'Pribadi',
    updateBalance: true
  })
  showModal.value = false
}

// Modal Koreksi Transaksi Mutasi
const showEditTxModal = ref(false)
const editingTxId = ref(null)
const txEditForm = ref({
  desc: '',
  amount: '',
  type: 'expense',
  category: 'Makan & Minum',
  date: '',
  account: ''
})

function openEditTxModal(tx) {
  editingTxId.value = tx.id
  txEditForm.value = {
    desc: tx.desc,
    amount: tx.amount,
    type: tx.type,
    category: tx.category,
    date: tx.date,
    account: tx.account
  }
  showEditTxModal.value = true
}

function saveTxEdit() {
  if (!editingTxId.value || !txEditForm.value.desc || !txEditForm.value.amount) return
  financeStore.updateTransaction(editingTxId.value, {
    desc: txEditForm.value.desc,
    amount: Number(txEditForm.value.amount),
    type: txEditForm.value.type,
    category: txEditForm.value.category,
    date: txEditForm.value.date,
    account: txEditForm.value.account
  })
  showEditTxModal.value = false
}

// ========================================================
// 2. KANTONG REKENING (PISAH TUNAI, BANK, E-WALLET)
// ========================================================
const showAccountModal = ref(false)
const isEditingAccount = ref(false)
const editingAccountId = ref(null)
const accountForm = ref({
  name: '',
  balance: '',
  type: 'bank'
})

function openAddAccountModal(defaultType = 'bank') {
  isEditingAccount.value = false
  editingAccountId.value = null
  accountForm.value = {
    name: '',
    balance: '',
    type: defaultType
  }
  showAccountModal.value = true
}

function openEditAccountModal(acc) {
  isEditingAccount.value = true
  editingAccountId.value = acc.id
  accountForm.value = {
    name: acc.name,
    balance: acc.balance,
    type: acc.type
  }
  showAccountModal.value = true
}

function saveAccountModal() {
  if (!accountForm.value.name) return
  if (isEditingAccount.value && editingAccountId.value) {
    financeStore.updateAccount(editingAccountId.value, {
      name: accountForm.value.name,
      balance: accountForm.value.balance,
      type: accountForm.value.type
    })
  } else {
    financeStore.addAccount({
      name: accountForm.value.name,
      balance: accountForm.value.balance,
      type: accountForm.value.type
    })
  }
  showAccountModal.value = false
}

function deleteAccountConfirm(acc) {
  if (financeStore.accounts.length <= 1) {
    alert('Minimal harus tersisa 1 kantong rekening untuk operasional buku kas.')
    return
  }
  if (confirm(`Yakin ingin menghapus kantong "${acc.name}"? Data saldo rekening ini akan dihapus dari ringkasan.`)) {
    financeStore.deleteAccount(acc.id)
  }
}

// ========================================================
// 3. UTANG & PIUTANG (POINT 2: FLEKSIBEL SINKRON KAS)
// ========================================================
const debtFilter = ref('all') // 'all', 'utang', 'piutang', 'history'
const showAddDebtModal = ref(false)
const newDebtForm = ref({
  contact: '',
  type: 'utang',
  total: '',
  dueDate: new Date().toISOString().slice(0, 10),
  accountName: '',
  note: '',
  syncToCash: true
})

const showSettleModal = ref(false)
const selectedDebt = ref(null)
const settleForm = ref({
  amount: '',
  accountName: '',
  note: '',
  syncToCash: true
})

const expandedDebtIds = ref(new Set())

function toggleDebtHistory(id) {
  if (expandedDebtIds.value.has(id)) {
    expandedDebtIds.value.delete(id)
  } else {
    expandedDebtIds.value.add(id)
  }
}

const filteredDebts = computed(() => {
  if (debtFilter.value === 'utang') return financeStore.debts.filter(d => d.type === 'utang')
  if (debtFilter.value === 'piutang') return financeStore.debts.filter(d => d.type === 'piutang')
  return financeStore.debts
})

const allDebtPaymentHistory = computed(() => {
  const list = []
  financeStore.debts.forEach(d => {
    if (d.payments && d.payments.length > 0) {
      d.payments.forEach(p => {
        list.push({
          id: p.id,
          debtId: d.id,
          contact: d.contact,
          debtType: d.type,
          date: p.date,
          amount: p.amount,
          account: p.account,
          note: p.note
        })
      })
    }
  })
  return list.sort((a, b) => new Date(b.date) - new Date(a.date))
})

function openAddDebtModal(type = 'utang') {
  newDebtForm.value = {
    contact: '',
    type: type,
    total: '',
    dueDate: new Date().toISOString().slice(0, 10),
    accountName: financeStore.accounts[0]?.name || 'BCA Prioritas',
    note: '',
    syncToCash: true
  }
  showAddDebtModal.value = true
}

function submitNewDebt() {
  if (!newDebtForm.value.contact || !newDebtForm.value.total) return
  financeStore.addDebt({
    contact: newDebtForm.value.contact,
    type: newDebtForm.value.type,
    total: newDebtForm.value.total,
    dueDate: newDebtForm.value.dueDate,
    note: newDebtForm.value.note,
    accountName: newDebtForm.value.accountName,
    syncToCash: newDebtForm.value.syncToCash
  })
  showAddDebtModal.value = false
}

function openSettleModal(debt) {
  selectedDebt.value = debt
  const remaining = Math.max(0, debt.total - debt.paid)
  settleForm.value = {
    amount: remaining,
    accountName: debt.accountName || financeStore.accounts[0]?.name,
    note: '',
    syncToCash: true
  }
  showSettleModal.value = true
}

function submitSettleDebt() {
  if (!selectedDebt.value || !settleForm.value.amount) return
  financeStore.settleDebt({
    debtId: selectedDebt.value.id,
    amount: settleForm.value.amount,
    accountName: settleForm.value.accountName,
    note: settleForm.value.note,
    syncToCash: settleForm.value.syncToCash
  })
  showSettleModal.value = false
}

function deleteDebtConfirm(debt) {
  if (confirm(`Hapus catatan ${debt.type === 'utang' ? 'utang' : 'piutang'} kepada ${debt.contact}?`)) {
    financeStore.deleteDebt(debt.id)
  }
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease-out;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
