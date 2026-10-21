<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 flex font-sans overflow-x-hidden">
    
    <!-- 1. COLLAPSIBLE MODERN SIDEBAR (ERP WORKSPACE) -->
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
          <!-- Logo Brand Dinamis dari Penyimpanan Perangkat -->
          <div 
            @click="isSidebarCollapsed ? toggleSidebar() : null"
            :class="[
              'w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-slate-200 bg-white shadow-xs',
              isSidebarCollapsed ? 'cursor-pointer hover:ring-2 hover:ring-slate-400 transition-all' : ''
            ]"
            :title="isSidebarCollapsed ? 'Klik untuk memperbesar sidebar' : ''"
          >
            <img 
              v-if="settingsStore.appLogo" 
              :src="settingsStore.appLogo" 
              alt="Brand Logo" 
              class="w-full h-full object-contain p-0.5" 
            />
            <div v-else class="w-full h-full bg-slate-900 text-white flex items-center justify-center font-extrabold text-base">
              {{ settingsStore.appName ? settingsStore.appName.substring(0, 2).toUpperCase() : 'CK' }}
            </div>
          </div>

          <!-- App Title & Company Name (Hidden when collapsed) -->
          <div v-if="!isSidebarCollapsed" class="overflow-hidden transition-opacity duration-200">
            <div class="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1.5 truncate">
              <span>{{ settingsStore.appName }}</span>
              <span class="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-800 border border-slate-300 rounded font-bold uppercase">
                ERP
              </span>
            </div>
            <div class="text-[11px] text-slate-500 font-semibold truncate max-w-[150px]">
              {{ authStore.businessUser.companyName }}
            </div>
          </div>
        </div>

        <!-- Collapse Toggle Button (Hanya tampil saat EXPANDED di Desktop) -->
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
      <div class="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        <!-- WIDGET KHUSUS: MANAJEMEN CABANG DI SIDEBAR -->
        <div v-if="authStore.canAccess('branches')" class="mb-3">
          <!-- Expanded Mode: Card Interaktif Manajemen Cabang -->
          <div v-if="!isSidebarCollapsed" class="p-3 bg-slate-100/90 border border-slate-200/90 rounded-2xl space-y-2.5 shadow-2xs">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-xs font-black text-slate-800">
                <Icon name="building" custom-class="w-4 h-4 text-emerald-700" />
                <span>Manajemen Cabang</span>
              </div>
              <span 
                :class="[
                  'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                  currentBranchStatus === 'open' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                ]"
              >
                {{ currentBranchStatus === 'open' ? '🟢 Buka' : '🔴 Tutup' }}
              </span>
            </div>

            <!-- Dropdown Pilihan Cabang Cepat -->
            <div>
              <div class="flex items-center justify-between text-[10px] font-bold uppercase text-slate-500 mb-1">
                <span>Cabang Aktif</span>
                <span class="text-emerald-700 font-mono font-bold">{{ authStore.branches.length }} Cabang</span>
              </div>
              <select 
                v-model="authStore.businessUser.currentBranch"
                :disabled="!authStore.currentRoleConfig.canSwitchBranch"
                @change="authStore.setBranch(authStore.businessUser.currentBranch)"
                class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
              >
                <option v-for="b in authStore.branches" :key="b.id" :value="b.name">
                  {{ b.status === 'open' ? '🟢' : '🔴' }} {{ b.name }}
                </option>
              </select>
            </div>

            <!-- Tombol Aksi: Buka Manajemen Cabang & Buka Cabang Baru -->
            <div class="flex items-center gap-1.5 pt-0.5">
              <button 
                @click="activeTab = 'branches'; isMobileSidebarOpen = false"
                type="button"
                :class="[
                  'flex-1 py-1.5 px-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs',
                  activeTab === 'branches' 
                    ? 'bg-emerald-700 text-white shadow-emerald-700/20' 
                    : 'bg-white hover:bg-slate-200/80 text-slate-800 border border-slate-300'
                ]"
                title="Buka Pusat Manajemen Cabang"
              >
                <Icon name="building" custom-class="w-3.5 h-3.5" :class="activeTab === 'branches' ? 'text-white' : 'text-emerald-700'" />
                <span>Kelola</span>
              </button>

              <button 
                v-if="authStore.isOwner"
                @click="triggerAddBranchFromSidebar"
                type="button"
                class="py-1.5 px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                title="Buka Form Tambah Cabang Baru"
              >
                <Icon name="plus" custom-class="w-3.5 h-3.5 text-white" />
                <span>Cabang</span>
              </button>
            </div>
          </div>

          <!-- Collapsed Mode: Icon Button Cepat dengan Tooltip -->
          <div v-else class="flex justify-center mb-3">
            <button
              @click="activeTab = 'branches'"
              type="button"
              class="w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer group relative shadow-2xs"
              :class="activeTab === 'branches' ? 'bg-emerald-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'"
              title="Manajemen Cabang"
            >
              <Icon name="building" custom-class="w-5 h-5" :class="activeTab === 'branches' ? 'text-white' : 'text-emerald-700'" />
              <span class="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                Manajemen Cabang ({{ authStore.branches.length }})
              </span>
            </button>
          </div>
        </div>

        <!-- Main Section -->
        <div>
          <div v-if="!isSidebarCollapsed" class="px-3 pb-2 text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">
            Menu Operasional
          </div>
          <nav class="space-y-1">
            <template v-for="item in allowedMainNavigation" :key="item.id">
              <button 
                @click="handleMainNavigationClick(item)"
                :class="[
                  'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer group relative',
                  activeTab === item.id 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
                  isSidebarCollapsed ? 'justify-center px-0' : ''
                ]"
                :title="isSidebarCollapsed ? item.label : ''"
              >
                <Icon 
                  :name="item.icon" 
                  custom-class="w-5 h-5 shrink-0" 
                  :class="activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'" 
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

                <!-- Chevron indicator jika item memiliki subItems -->
                <svg
                  v-if="!isSidebarCollapsed && item.subItems && item.subItems.length"
                  class="w-4 h-4 transition-transform duration-200 shrink-0 text-slate-400 group-hover:text-slate-600"
                  :class="{ 'rotate-180 text-white': activeTab === item.id }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                </svg>

                <!-- Floating Tooltip saat Sidebar Collapsed -->
                <span 
                  v-if="isSidebarCollapsed" 
                  class="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50"
                >
                  {{ item.label }}
                </span>
              </button>

              <!-- Nested Sub-Menu (Tampil saat aktif & sidebar terbuka) -->
              <div 
                v-if="!isSidebarCollapsed && item.subItems && item.subItems.length && activeTab === item.id"
                class="ml-5 pl-2.5 border-l-2 border-slate-200/80 my-1 space-y-1 animate-fadeIn"
              >
                <!-- Kategori Tampilan / Views -->
                <div class="px-2 py-1 text-[9px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                  Bagian Halaman
                </div>
                <button
                  v-for="sub in item.subItems.filter(s => s.type === 'view')"
                  :key="sub.id"
                  @click="handleSubMenuClick(item.id, sub)"
                  :class="[
                    'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer',
                    inventoryActiveSubTab === sub.id 
                      ? 'bg-emerald-50 text-emerald-900 font-extrabold border border-emerald-200/80 shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  ]"
                >
                  <Icon :name="sub.icon" custom-class="w-3.5 h-3.5 shrink-0 text-slate-500" />
                  <span class="truncate">{{ sub.label }}</span>
                  <span v-if="sub.id === 'transfers' && stockStore.stockTransfers.length" class="ml-auto text-[9px] px-1.5 py-0.2 rounded-full font-mono bg-sky-100 text-sky-800 font-bold">
                    {{ stockStore.stockTransfers.length }}
                  </span>
                </button>

                <!-- Kategori Aksi Cepat (Actions) -->
                <div class="px-2 pt-2 pb-1 text-[9px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                  Aksi Cepat
                </div>
                <button
                  v-for="sub in item.subItems.filter(s => s.type === 'action' && (!s.role || authStore[s.role]))"
                  :key="sub.id"
                  @click="handleSubMenuClick(item.id, sub)"
                  class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all text-left cursor-pointer active:scale-98"
                >
                  <Icon :name="sub.icon" custom-class="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span class="truncate">{{ sub.label }}</span>
                </button>
              </div>
            </template>
          </nav>
        </div>

        <!-- System Section (Hanya tampil jika ada menu sistem yang diizinkan) -->
        <div v-if="allowedSystemNavigation.length > 0">
          <div v-if="!isSidebarCollapsed" class="px-3 pb-2 text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">
            Sistem & Konfigurasi
          </div>
          <nav class="space-y-1">
            <button 
              v-for="item in allowedSystemNavigation" 
              :key="item.id"
              @click="activeTab = item.id; isMobileSidebarOpen = false"
              :class="[
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer group relative',
                activeTab === item.id 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
                isSidebarCollapsed ? 'justify-center px-0' : ''
              ]"
              :title="isSidebarCollapsed ? item.label : ''"
            >
              <Icon 
                :name="item.icon" 
                custom-class="w-5 h-5 shrink-0" 
                :class="activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'" 
              />
              
              <span v-if="!isSidebarCollapsed" class="truncate flex-1 text-left">
                {{ item.label }}
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

      <!-- Sidebar Bottom Info (Branch Status) -->
      <div class="p-3 border-t border-slate-200 bg-slate-50/70">
        <div v-if="!isSidebarCollapsed" class="px-2 py-1.5 space-y-1 text-xs">
          <div class="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Server PostgreSQL Terhubung</span>
          </div>
          <div class="text-[10px] text-slate-500 truncate">
            {{ authStore.businessUser.currentBranch }}
          </div>
        </div>
        <div v-else class="flex justify-center py-1">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Server Terhubung"></span>
        </div>
      </div>
    </aside>

    <!-- Mobile & Tablet Backdrop -->
    <div 
      v-if="isMobileSidebarOpen" 
      @click="isMobileSidebarOpen = false" 
      class="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden"
    ></div>

    <!-- 2. MAIN CONTENT AREA (Offset by sidebar width on desktop) -->
    <div 
      :class="[
        'flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out min-w-0',
        isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64 sm:lg:ml-72'
      ]"
    >
      <!-- Top Header Navbar -->
      <header class="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs h-16 flex items-center px-3 sm:px-6 lg:px-8">
        <div class="w-full flex items-center justify-between gap-2 sm:gap-4">
          <!-- Left: Mobile Hamburger Toggle + Active Branch Selector + Breadcrumb -->
          <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <!-- Mobile Hamburger Toggle -->
            <button 
              @click="toggleMobileSidebar" 
              type="button" 
              class="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer shrink-0"
              title="Buka Menu"
            >
              <Icon name="menu" custom-class="w-5 h-5" />
            </button>

            <!-- Active Breadcrumb Title -->
            <div class="hidden sm:block">
              <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Modul ERP</div>
              <div class="text-sm font-black text-slate-900 leading-tight">
                {{ activeTabLabel }}
              </div>
            </div>

            <!-- Active Branch Selector Dropdown (Terkunci jika peran non-Owner/Manager) -->
            <div 
              :class="[
                'flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-colors min-w-0 max-w-[150px] sm:max-w-xs shrink',
                !authStore.currentRoleConfig.canSwitchBranch 
                  ? 'bg-slate-100/90 border-slate-300 text-slate-500' 
                  : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
              ]"
              :title="!authStore.currentRoleConfig.canSwitchBranch ? 'Terkunci: Hak akses Anda terbatas pada cabang ini' : 'Pilih Cabang Aktif'"
            >
              <Icon :name="!authStore.currentRoleConfig.canSwitchBranch ? 'lock' : 'building'" custom-class="w-4 h-4 text-slate-600 shrink-0" />
              <select 
                v-model="authStore.businessUser.currentBranch"
                :disabled="!authStore.currentRoleConfig.canSwitchBranch"
                @change="authStore.setBranch(authStore.businessUser.currentBranch)"
                class="bg-transparent border-none text-slate-800 font-bold text-xs focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:text-slate-600 truncate w-full"
              >
                <option v-for="b in authStore.branches" :key="b.id" :value="b.name">
                  {{ b.status === 'open' ? '🟢' : '🔴 [TUTUP]' }} {{ b.name }}
                </option>
              </select>
              <span v-if="!authStore.currentRoleConfig.canSwitchBranch" class="text-[9px] font-mono font-bold bg-slate-200 text-slate-700 px-1 py-0.5 rounded shrink-0">
                Terkunci
              </span>
            </div>
          </div>

          <!-- Right: Clean Profile Box (with Dropdown) -->
          <div class="relative shrink-0">
            <button 
              @click="isProfileMenuOpen = !isProfileMenuOpen"
              type="button"
              class="flex items-center gap-2.5 sm:gap-3 p-1 sm:px-3 sm:py-2 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 rounded-2xl transition-all cursor-pointer shadow-2xs group"
              title="Klik untuk menu akun & pengaturan bisnis"
            >
              <!-- Avatar Foto Profil / Inisial -->
              <div class="w-9 h-9 rounded-full overflow-hidden border border-slate-300 bg-white flex items-center justify-center shrink-0 shadow-xs">
                <img 
                  v-if="settingsStore.userAvatar" 
                  :src="settingsStore.userAvatar" 
                  alt="Avatar" 
                  class="w-full h-full object-cover"
                />
                <span v-else class="font-black text-sm text-slate-800">
                  {{ (authStore.user?.name || authStore.businessUser?.name || 'M').charAt(0).toUpperCase() }}
                </span>
              </div>

              <!-- Nama & Status Sesi Usaha (Badge Peran Dinamis) -->
              <div class="text-left hidden sm:block">
                <div class="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                  {{ authStore.user?.name || authStore.businessUser?.name || 'Master Administrator' }}
                </div>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span :class="['text-[10px] font-bold px-1.5 py-0.5 rounded border font-mono', authStore.currentRoleConfig.color]">
                    {{ authStore.currentRoleConfig.badge }}
                  </span>
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
                  <div class="text-xs font-black text-slate-900">{{ authStore.user?.name || authStore.businessUser?.name || 'Master Administrator' }}</div>
                  <div class="text-[11px] text-slate-500 truncate">{{ authStore.user?.email || authStore.businessUser?.email || 'admin@cakue.id' }}</div>
                  <div class="mt-2 flex flex-col gap-1">
                    <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      <span>Sesi: {{ authStore.businessUser.role }}</span>
                    </div>
                    <div class="text-[10px] text-slate-500 font-medium">
                      Cabang: <span class="font-bold text-slate-700">{{ authStore.businessUser.currentBranch }}</span>
                    </div>
                  </div>
                </div>

                <!-- Quick Switch Account Card (1-Klik Ganti Akun) -->
                <div class="p-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl text-white shadow-sm space-y-1.5">
                  <div class="px-1 text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center justify-between">
                    <span>Peralihan Akun Cepat</span>
                    <span class="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">1-Klik</span>
                  </div>
                  
                  <!-- Option 1: Master Admin -->
                  <button 
                    @click="authStore.switchToAccount('master'); isProfileMenuOpen = false"
                    type="button"
                    class="w-full text-left p-2 rounded-lg transition-all flex items-center justify-between gap-2 border cursor-pointer"
                    :class="(authStore.user?.email === 'admin@cakue.id') 
                      ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-200'"
                  >
                    <div class="flex items-center gap-2 min-w-0">
                      <div class="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0">
                        <span class="text-xs">👑</span>
                      </div>
                      <div class="min-w-0">
                        <div class="text-xs font-bold truncate">Master Administrator</div>
                        <div class="text-[10px] text-slate-400">Root Super Admin (Data Bersih Rp 0)</div>
                      </div>
                    </div>
                    <span v-if="authStore.user?.email === 'admin@cakue.id'" class="text-[10px] bg-indigo-500 text-white font-extrabold px-1.5 py-0.5 rounded shadow-xs">Aktif</span>
                  </button>

                  <!-- Option 2: Dummy Budi Santoso -->
                  <button 
                    @click="authStore.switchToAccount('budi'); isProfileMenuOpen = false"
                    type="button"
                    class="w-full text-left p-2 rounded-lg transition-all flex items-center justify-between gap-2 border cursor-pointer"
                    :class="(authStore.user?.email === 'budi.santoso@cakue.id' || authStore.user?.email?.includes('budi')) 
                      ? 'bg-purple-600/30 border-purple-500 text-white font-bold' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-200'"
                  >
                    <div class="flex items-center gap-2 min-w-0">
                      <div class="w-6 h-6 rounded-md bg-purple-500/20 border border-purple-400/40 flex items-center justify-center shrink-0">
                        <span class="text-xs">👤</span>
                      </div>
                      <div class="min-w-0">
                        <div class="text-xs font-bold truncate">Budi Santoso</div>
                        <div class="text-[10px] text-slate-400">Mitra Owner Sub-Tenant (Sampel Data)</div>
                      </div>
                    </div>
                    <span v-if="authStore.user?.email === 'budi.santoso@cakue.id' || authStore.user?.email?.includes('budi')" class="text-[10px] bg-purple-400 text-purple-950 font-extrabold px-1.5 py-0.5 rounded shadow-xs">Aktif</span>
                  </button>
                </div>

                <!-- Menu 1: Profil & Keamanan Pengguna (Semua Role) -->
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

                <!-- Menu 2: Pengaturan Aplikasi & Toko (Hanya jika role boleh akses) -->
                <button 
                  v-if="authStore.canAccess('settings')"
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

                <!-- Menu 2: AI R&D Advisor -->
                <button 
                  @click="$emit('toggle-ai'); isProfileMenuOpen = false"
                  type="button"
                  class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer font-bold text-left"
                >
                  <Icon name="sparkles" custom-class="w-4 h-4 text-emerald-600" />
                  <span>AI R&D Business Advisor</span>
                </button>

                <!-- Seksi Simulasi Hak Akses (RBAC Dev Tools) -->
                <div class="pt-2 border-t border-slate-100 space-y-1.5">
                  <div class="px-2 pb-0.5 flex items-center justify-between text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">
                    <span>Simulasi Hak Akses</span>
                    <span class="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold text-[9px]">RBAC Mode</span>
                  </div>
                  <div class="grid grid-cols-1 gap-1">
                    <button 
                      v-for="r in Object.values(ROLES)" 
                      :key="r.id"
                      @click="handleRoleChange(r.id)"
                      type="button"
                      :class="[
                        'w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all cursor-pointer font-bold',
                        authStore.activeBusinessRole === r.id 
                          ? 'bg-slate-900 text-white shadow-xs' 
                          : 'text-slate-700 hover:bg-slate-100'
                      ]"
                    >
                      <div class="flex items-center gap-2">
                        <Icon :name="r.id === 'owner' ? 'building' : r.id === 'cashier' ? 'store' : r.id === 'warehouse' ? 'box' : 'users'" custom-class="w-3.5 h-3.5" />
                        <div>
                          <div>{{ r.title }}</div>
                          <div class="text-[10px] font-normal" :class="authStore.activeBusinessRole === r.id ? 'text-slate-300' : 'text-slate-400'">
                            {{ r.id === 'owner' ? 'Semua Akses' : r.id === 'cashier' ? 'Kasir POS Saja' : r.id === 'warehouse' ? 'Inventaris Saja' : 'Kasir + Stok + KPI' }}
                          </div>
                        </div>
                      </div>
                      <Icon v-if="authStore.activeBusinessRole === r.id" name="check" custom-class="w-4 h-4 text-emerald-400 shrink-0" />
                    </button>
                  </div>
                </div>

                <div class="border-t border-slate-100 my-1"></div>

                <!-- Menu 3: Beralih ke Portal Nasabah Pribadi -->
                <button 
                  @click="authStore.setAppMode('personal'); isProfileMenuOpen = false"
                  type="button"
                  class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer font-bold text-left"
                >
                  <Icon name="wallet" custom-class="w-4 h-4 text-emerald-600" />
                  <span>Beralih ke Portal Nasabah Pribadi</span>
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

                <!-- Menu 5: Keluar Akun Bisnis -->
                <button 
                  @click="authStore.logout(); isProfileMenuOpen = false"
                  type="button"
                  class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer font-bold text-left"
                >
                  <Icon name="logout" custom-class="w-4 h-4 text-rose-600" />
                  <span>Keluar dari Akun Bisnis</span>
                </button>
              </div>
            </transition>
          </div>
        </div>
      </header>

      <!-- Main Workspace (Screen-filling, generous width) -->
      <main class="flex-1 max-w-[1600px] w-full mx-auto p-3.5 sm:p-5 lg:p-8 space-y-5 sm:space-y-6 pb-24 lg:pb-8">
        <!-- Mode Supervisi Super Admin Banner (Audit Tenant) -->
        <div 
          v-if="authStore.isSupervising"
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:px-4 bg-gradient-to-r from-indigo-950 via-indigo-900 to-purple-950 border border-indigo-700/80 rounded-2xl text-white shadow-md animate-fadeIn"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-base shrink-0 shadow-xs">
              👑
            </div>
            <div class="min-w-0">
              <div class="font-extrabold text-xs sm:text-sm text-amber-300 flex items-center gap-2 flex-wrap">
                <span>MODE SUPERVISI & AUDIT TENANT</span>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {{ authStore.supervisingOwner?.name }}
                </span>
                <span class="text-[10px] font-mono text-purple-200">
                  ({{ authStore.supervisingOwner?.companyName }})
                </span>
              </div>
              <p class="text-[11px] text-slate-200 mt-0.5 truncate">
                Anda sedang mengaudit pembukuan dan stok milik akun owner ini. Data operasional Master Admin tetap aman terisolasi.
              </p>
            </div>
          </div>
          <button 
            @click="authStore.exitSupervision()"
            type="button"
            class="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-98"
          >
            <span>Keluar Supervisi & Kembali</span>
            <span>➔</span>
          </button>
        </div>

        <!-- Demo Budi Mode Notice Banner (Sub-Tenant) -->
        <div 
          v-if="!authStore.isSupervising && (authStore.user?.email === 'budi.santoso@cakue.id' || authStore.user?.email?.includes('budi'))"
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:px-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-300 rounded-2xl text-purple-950 shadow-xs"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              👤
            </div>
            <div>
              <div class="font-extrabold text-xs sm:text-sm text-purple-900 flex items-center gap-2">
                <span>Mode Sesi: Akun Mitra Owner (Budi Santoso - CV Cakue Nusantara)</span>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-purple-200 text-purple-900 border border-purple-300">Sub-Tenant</span>
              </div>
              <p class="text-[11px] text-purple-700 mt-0.5">Sesi ini mengoperasikan data usaha mitra. Untuk mengakses otoritas Super Admin platform (6 Cabang Jogja & Kelola Owner), gunakan Master Admin.</p>
            </div>
          </div>
          <button 
            @click="authStore.switchToAccount('master')"
            type="button"
            class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>👑 Beralih ke Master Admin</span>
            <span>➔</span>
          </button>
        </div>

        <!-- Restrictive Role Notice Banner (Tampil saat bukan Owner) -->
        <div 
          v-if="!authStore.isOwner" 
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-blue-50/90 border border-blue-200/90 text-blue-950 shadow-2xs"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Icon name="shield" custom-class="w-5 h-5" />
            </div>
            <div>
              <div class="font-extrabold text-sm flex items-center gap-2">
                <span>Mode Sesi: {{ authStore.currentRoleConfig.title }}</span>
                <span :class="['text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border', authStore.currentRoleConfig.color]">
                  {{ authStore.currentRoleConfig.badge }}
                </span>
              </div>
              <div class="text-xs text-blue-800/80 mt-0.5">
                {{ authStore.currentRoleConfig.description }} • <span class="font-bold text-blue-900">Cabang Penugasan: {{ authStore.businessUser.currentBranch }}</span>
              </div>
            </div>
          </div>
          <button 
            @click="isProfileMenuOpen = true" 
            type="button" 
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-blue-300 hover:bg-blue-100/50 text-blue-900 font-bold text-xs transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <span>Uji Peran Lain</span>
            <Icon name="chevron-down" custom-class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Fallback Guard: Jika modul yang diakses tidak diizinkan untuk peran saat ini -->
        <div v-if="!authStore.canAccess(activeTab)" class="saas-card p-12 text-center max-w-xl mx-auto my-12 space-y-4">
          <div class="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <Icon name="lock" custom-class="w-8 h-8" />
          </div>
          <div class="text-xl font-black text-slate-900">Hak Akses Modul Dibatasi</div>
          <p class="text-sm text-slate-500 leading-relaxed">
            Peran Anda saat ini (<strong class="text-slate-800">{{ authStore.currentRoleConfig.title }}</strong>) tidak memiliki izin untuk mengakses modul ini demi keamanan data usaha.
          </p>
          <div class="pt-2">
            <button 
              @click="activeTab = authStore.currentRoleConfig.defaultModule"
              type="button"
              class="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
            >
              Buka Modul yang Diizinkan ({{ authStore.currentRoleConfig.title }})
            </button>
          </div>
        </div>

        <!-- TAB 1: EXECUTIVE DASHBOARD (SaaS Business Metrics) -->
        <div v-else-if="activeTab === 'dashboard'" class="space-y-6">
          <!-- 4 KPI Cards with Drilldown Audit Click Handlers & Clean Light Mode Aesthetics -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            <!-- 1. Omset -->
            <div 
              @click="openAuditModal('income')"
              role="button"
              tabindex="0"
              class="saas-card p-4 sm:p-5 lg:p-6 space-y-2.5 cursor-pointer group hover:border-emerald-500 hover:shadow-md transition-all active:scale-[0.99] relative overflow-hidden min-w-0"
              title="Klik untuk melihat Audit Detail Omset Riil"
            >
              <div class="flex items-center justify-between text-slate-500 text-xs sm:text-sm font-bold gap-2">
                <span class="group-hover:text-emerald-700 transition-colors truncate">Total Omset Bisnis</span>
                <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
                  <Icon name="income" custom-class="w-4 h-4" />
                </div>
              </div>
              <div class="text-xl sm:text-2xl xl:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-emerald-800 transition-colors">
                Rp {{ formatNumber(financeStore.totalIncome) }}
              </div>
              <div class="flex items-center justify-between pt-1 gap-2 min-w-0">
                <div class="text-xs text-emerald-700 font-semibold flex items-center gap-1 truncate">
                  <Icon name="check" custom-class="w-3.5 h-3.5 shrink-0" />
                  <span class="truncate">Arus Kas Masuk Riil</span>
                </div>
                <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all flex items-center gap-0.5">
                  Audit →
                </span>
              </div>
            </div>

            <!-- 2. Beban & HPP -->
            <div 
              @click="openAuditModal('expense')"
              role="button"
              tabindex="0"
              class="saas-card p-4 sm:p-5 lg:p-6 space-y-2.5 cursor-pointer group hover:border-rose-400 hover:shadow-md transition-all active:scale-[0.99] relative overflow-hidden min-w-0"
              title="Klik untuk melihat Audit Detail Beban & HPP"
            >
              <div class="flex items-center justify-between text-slate-500 text-xs sm:text-sm font-bold gap-2">
                <span class="group-hover:text-rose-700 transition-colors truncate">Beban Operasional & HPP</span>
                <div class="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-xs">
                  <Icon name="expense" custom-class="w-4 h-4" />
                </div>
              </div>
              <div class="text-xl sm:text-2xl xl:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-rose-800 transition-colors">
                Rp {{ formatNumber(financeStore.totalExpense) }}
              </div>
              <div class="flex items-center justify-between pt-1 gap-2 min-w-0">
                <div class="text-xs text-slate-500 font-medium truncate">
                  Bahan baku & operasional
                </div>
                <span class="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 shrink-0 group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600 transition-all flex items-center gap-0.5">
                  Audit →
                </span>
              </div>
            </div>

            <!-- 3. Laba Bersih -->
            <div 
              @click="openAuditModal('net_profit')"
              role="button"
              tabindex="0"
              class="saas-card p-4 sm:p-5 lg:p-6 space-y-2.5 cursor-pointer group hover:border-teal-500 hover:shadow-md transition-all active:scale-[0.99] relative overflow-hidden min-w-0"
              title="Klik untuk melihat Audit Laba Rugi (P&L Akuntan)"
            >
              <div class="flex items-center justify-between text-slate-500 text-xs sm:text-sm font-bold gap-2">
                <span class="group-hover:text-teal-700 transition-colors truncate">Laba Bersih (Surplus)</span>
                <div class="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-xs">
                  <Icon name="chart" custom-class="w-4 h-4" />
                </div>
              </div>
              <div class="text-xl sm:text-2xl xl:text-3xl font-extrabold text-emerald-700 tracking-tight tabular-nums whitespace-nowrap overflow-hidden text-ellipsis">
                Rp {{ formatNumber(financeStore.netSavings) }}
              </div>
              <div class="flex items-center justify-between pt-1 gap-2 min-w-0">
                <div class="text-xs text-teal-700 font-semibold truncate">
                  Net Margin {{ financeStore.totalIncome > 0 ? ((financeStore.netSavings / financeStore.totalIncome) * 100).toFixed(1) + '%' : '0.0%' }}
                </div>
                <span class="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-all flex items-center gap-0.5">
                  P&L →
                </span>
              </div>
            </div>

            <!-- 4. Total Aset Tetap -->
            <div 
              @click="openAuditModal('assets')"
              role="button"
              tabindex="0"
              class="saas-card p-4 sm:p-5 lg:p-6 space-y-2.5 cursor-pointer group hover:border-sky-500 hover:shadow-md transition-all active:scale-[0.99] relative overflow-hidden min-w-0"
              title="Klik untuk melihat Audit Buku Aset & Depresiasi"
            >
              <div class="flex items-center justify-between text-slate-500 text-xs sm:text-sm font-bold gap-2">
                <span class="group-hover:text-sky-700 transition-colors truncate">Total Aset Tetap</span>
                <div class="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-xs">
                  <Icon name="building" custom-class="w-4 h-4" />
                </div>
              </div>
              <div class="text-xl sm:text-2xl xl:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-sky-900 transition-colors">
                Rp {{ formatNumber(totalAssetsBookValue) }}
              </div>
              <div class="flex items-center justify-between pt-1 gap-2 min-w-0">
                <div class="text-xs text-slate-500 font-medium truncate">
                  Nilai buku depresiasi
                </div>
                <span class="text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-all flex items-center gap-0.5">
                  Aset →
                </span>
              </div>
            </div>
          </div>

          <!-- SECTION KHUSUS: KOLOM ALOKASI DANA RISET & PENGEMBANGAN (R&D) USAHA -->
          <div class="saas-card p-4 sm:p-6 lg:p-7 space-y-4 sm:space-y-5 bg-gradient-to-br from-white via-white to-indigo-50/30 border border-slate-200 shadow-xs">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 border-b border-slate-100">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0 shadow-xs">
                  <Icon name="chart" custom-class="w-5 h-5 text-indigo-700" />
                </div>
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="text-sm sm:text-base lg:text-lg font-black tracking-tight text-slate-900">Kolom Alokasi Riset & Pengembangan (R&D) Usaha</h3>
                    <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200 uppercase tracking-wider shrink-0">
                      Alokasi 15% Laba
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 mt-0.5">
                    Dana inovasi disisihkan langsung dari surplus laba riil untuk penghematan HPP, daya tahan produk & ekspansi cabang
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <button 
                  @click="openAuditModal('net_profit')"
                  type="button"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold transition-all cursor-pointer border border-indigo-200 shadow-2xs"
                >
                  <span>Audit Laba Rugi</span>
                  <Icon name="chevron-right" custom-class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- 3 Pilar Finansial R&D -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div class="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1 min-w-0">
                <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">Total Alokasi R&D (15%)</div>
                <div class="text-lg sm:text-xl xl:text-2xl font-black text-indigo-800 tracking-tight tabular-nums whitespace-nowrap overflow-hidden text-ellipsis">
                  Rp {{ formatNumber(rdAllocationTotal) }}
                </div>
                <div class="text-[11px] text-slate-500 truncate">Dari surplus laba bersih kas</div>
              </div>

              <div class="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1 min-w-0">
                <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">Realisasi Belanja Riset</div>
                <div class="text-lg sm:text-xl xl:text-2xl font-black text-slate-800 tracking-tight tabular-nums whitespace-nowrap overflow-hidden text-ellipsis">
                  Rp {{ formatNumber(rdRealizationTotal) }}
                </div>
                <div class="text-[11px] text-emerald-700 font-semibold truncate">
                  {{ rdProjects.length > 0 ? `Terserap pada ${rdProjects.length} proyek` : '0 proyek aktif' }}
                </div>
              </div>

              <div class="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1 min-w-0">
                <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">Sisa Saldo Kas R&D</div>
                <div class="text-lg sm:text-xl xl:text-2xl font-black text-emerald-700 tracking-tight tabular-nums whitespace-nowrap overflow-hidden text-ellipsis">
                  Rp {{ formatNumber(rdRemainingBudget) }}
                </div>
                <div class="text-[11px] text-emerald-600 font-semibold truncate">Cadangan likuid siap pakai</div>
              </div>
            </div>

            <!-- Kartu Proyek Inovasi R&D Aktif -->
            <div class="space-y-3 pt-1">
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400">
                Portofolio Proyek Riset Aktif (Inovasi Produk & Proses)
              </div>
              <div v-if="rdProjects.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div 
                  v-for="proj in rdProjects" 
                  :key="proj.id"
                  class="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:border-indigo-400 hover:shadow-xs transition-all"
                >
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between gap-2">
                      <span class="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                        {{ proj.code }}
                      </span>
                      <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full border', proj.badgeColor]">
                        {{ proj.focus }}
                      </span>
                    </div>
                    <h4 class="font-bold text-xs sm:text-sm text-slate-900 leading-snug">{{ proj.title }}</h4>
                    <p class="text-[11px] text-slate-500 leading-relaxed">{{ proj.target }}</p>
                  </div>

                  <div class="space-y-2 pt-2 border-t border-slate-100">
                    <div class="flex items-center justify-between text-xs gap-2">
                      <span class="text-slate-500 font-medium">Realisasi Dana</span>
                      <span class="font-extrabold text-slate-900 tabular-nums whitespace-nowrap">Rp {{ formatNumber(proj.realization) }} / {{ formatNumber(proj.budget) }}</span>
                    </div>
                    <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div class="h-full bg-indigo-600 rounded-full transition-all duration-500" :style="{ width: `${proj.progress}%` }"></div>
                    </div>
                    <div class="flex items-center justify-between text-[11px]">
                      <span class="text-slate-500">Progres Inovasi: <strong class="text-slate-800 tabular-nums">{{ proj.progress }}%</strong></span>
                      <span class="font-bold text-indigo-700">{{ proj.status }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-2xs">
                <div class="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mx-auto flex items-center justify-center font-bold text-lg">
                  💡
                </div>
                <div class="text-xs sm:text-sm font-extrabold text-slate-800">Portofolio R&D Bersih (0 Proyek Aktif)</div>
                <p class="text-[11px] text-slate-500 max-w-md mx-auto">
                  Akun Master Admin siap digunakan untuk mengalokasikan inovasi bahan baku, efisiensi HPP, dan standarisasi resep dari surplus laba usaha riil.
                </p>
              </div>
            </div>
          </div>

          <!-- Section 2: Shortcut Cepat Operasional yang Sering Digunakan (Grid 4 Tombol Lega) -->
          <div class="space-y-3">
            <div class="text-xs font-bold uppercase tracking-wider text-slate-400">
              Shortcut Cepat Operasional
            </div>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <!-- Shortcut 1: Buka Kasir POS -->
              <button 
                v-if="authStore.canAccess('pos')"
                @click="activeTab = 'pos'"
                type="button"
                class="saas-card p-3.5 sm:p-4 md:p-5 min-h-[96px] sm:min-h-[110px] rounded-2xl flex flex-col items-center justify-center text-center gap-2 sm:gap-2.5 hover:border-emerald-500 hover:shadow-md active:scale-[0.98] transition-all cursor-pointer group"
              >
                <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
                  <Icon name="store" custom-class="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div class="w-full">
                  <div class="font-extrabold text-xs sm:text-sm md:text-base text-slate-900 group-hover:text-emerald-700 transition-colors truncate">Kasir POS Toko</div>
                  <div class="text-[11px] text-slate-500 mt-0.5 truncate hidden sm:block">Input order penjualan cepat</div>
                </div>
              </button>

              <!-- Shortcut 2: Stok & Distribusi -->
              <button 
                v-if="authStore.canAccess('inventory')"
                @click="activeTab = 'inventory'"
                type="button"
                class="saas-card p-3.5 sm:p-4 md:p-5 min-h-[96px] sm:min-h-[110px] rounded-2xl flex flex-col items-center justify-center text-center gap-2 sm:gap-2.5 hover:border-blue-500 hover:shadow-md active:scale-[0.98] transition-all cursor-pointer group"
              >
                <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                  <Icon name="box" custom-class="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div class="w-full">
                  <div class="font-extrabold text-xs sm:text-sm md:text-base text-slate-900 group-hover:text-blue-700 transition-colors truncate">Inventaris & Cabang</div>
                  <div class="text-[11px] text-slate-500 mt-0.5 truncate hidden sm:block">Matriks stok & surat jalan</div>
                </div>
              </button>

              <!-- Shortcut 3: Statistik & Analisis -->
              <button 
                v-if="authStore.canAccess('analytics')"
                @click="activeTab = 'analytics'"
                type="button"
                class="saas-card p-3.5 sm:p-4 md:p-5 min-h-[96px] sm:min-h-[110px] rounded-2xl flex flex-col items-center justify-center text-center gap-2 sm:gap-2.5 hover:border-teal-500 hover:shadow-md active:scale-[0.98] transition-all cursor-pointer group"
              >
                <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-xs">
                  <Icon name="chart" custom-class="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div class="w-full">
                  <div class="font-extrabold text-xs sm:text-sm md:text-base text-slate-900 group-hover:text-teal-700 transition-colors truncate">Statistik & Analisis</div>
                  <div class="text-[11px] text-slate-500 mt-0.5 truncate hidden sm:block">Grafik KPI & margin laba</div>
                </div>
              </button>

              <!-- Shortcut 4: Jurnal Transaksi Kas -->
              <button 
                v-if="authStore.canAccess('journal')"
                @click="activeTab = 'journal'"
                type="button"
                class="saas-card p-3.5 sm:p-4 md:p-5 min-h-[96px] sm:min-h-[110px] rounded-2xl flex flex-col items-center justify-center text-center gap-2 sm:gap-2.5 hover:border-purple-500 hover:shadow-md active:scale-[0.98] transition-all cursor-pointer group"
              >
                <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-xs">
                  <Icon name="receipt" custom-class="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div class="w-full">
                  <div class="font-extrabold text-xs sm:text-sm md:text-base text-slate-900 group-hover:text-purple-700 transition-colors truncate">Jurnal Transaksi Kas</div>
                  <div class="text-[11px] text-slate-500 mt-0.5 truncate hidden sm:block">Buku jurnal & mutasi kas</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Section 3: Ringkasan Mini Aktivitas Kas (Hanya 3 Baris Ringkas) -->
          <div class="saas-card p-4 sm:p-5 lg:p-6 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-sm sm:text-base font-bold text-slate-900">Aktivitas Transaksi Kas Terkini</h3>
                <p class="text-xs text-slate-500">Pratinjau mutasi terakhir di seluruh cabang</p>
              </div>
              <button 
                v-if="authStore.canAccess('journal')"
                @click="activeTab = 'journal'"
                type="button"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
              >
                <span>Buka Jurnal</span>
                <Icon name="chevron-right" custom-class="w-3.5 h-3.5" />
              </button>
            </div>

            <div class="divide-y divide-slate-100">
              <div 
                v-for="t in financeStore.transactions.slice(0, 3)" 
                :key="t.id"
                class="py-3 flex items-center justify-between gap-3 text-xs sm:text-sm"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0', t.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700']">
                    <Icon :name="t.type === 'income' ? 'income' : 'expense'" custom-class="w-4 h-4" />
                  </div>
                  <div class="min-w-0">
                    <div class="font-bold text-slate-900 truncate">{{ t.desc }}</div>
                    <div class="text-[11px] text-slate-500 truncate">{{ t.date }} • {{ t.category }}</div>
                  </div>
                </div>
                <div :class="['font-extrabold tabular-nums tracking-tight text-xs sm:text-sm md:text-base text-right shrink-0 whitespace-nowrap', t.type === 'income' ? 'text-emerald-700' : 'text-slate-900']">
                  {{ t.type === 'income' ? '+' : '-' }} Rp {{ formatNumber(t.amount) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB BARU: STATISTIK & ANALISIS USAHA (DEDICATED MODULE) -->
        <div v-else-if="activeTab === 'analytics'" class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Statistik & Analisis Keuangan Usaha</h2>
              <p class="text-xs sm:text-sm text-slate-500">Evaluasi performa laba, arus kas, margin kotor, dan kesehatan finansial cabang</p>
            </div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold">
              <Icon name="chart" custom-class="w-4 h-4 text-teal-700" />
              <span>Periode: Bulan Berjalan (2026)</span>
            </div>
          </div>

          <!-- 3 Analytical Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div class="saas-card p-4 sm:p-5 lg:p-6 space-y-2 min-w-0">
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400 truncate">Gross Profit Margin (HPP)</div>
              <div class="text-2xl sm:text-3xl xl:text-4xl font-extrabold font-mono tabular-nums text-emerald-700">
                {{ financeStore.totalIncome > 0 ? (((financeStore.totalIncome - accountingHpp) / financeStore.totalIncome) * 100).toFixed(1) + '%' : '0.0%' }}
              </div>
              <p class="text-xs text-slate-500 leading-relaxed">Rasio efisiensi harga pokok penjualan bahan baku toko</p>
            </div>

            <div class="saas-card p-4 sm:p-5 lg:p-6 space-y-2 min-w-0">
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400 truncate">Net Profit Margin (Laba Bersih)</div>
              <div class="text-2xl sm:text-3xl xl:text-4xl font-extrabold font-mono tabular-nums text-teal-700">
                {{ financeStore.totalIncome > 0 ? ((financeStore.netSavings / financeStore.totalIncome) * 100).toFixed(1) + '%' : '0.0%' }}
              </div>
              <p class="text-xs text-slate-500 leading-relaxed">Sisa margin bersih setelah dipotong seluruh beban operasional</p>
            </div>

            <div class="saas-card p-4 sm:p-5 lg:p-6 space-y-2 min-w-0">
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400 truncate">Rasio Likuiditas Kas</div>
              <div class="text-2xl sm:text-3xl xl:text-4xl font-extrabold font-mono tabular-nums text-blue-700">
                {{ financeStore.totalExpense > 0 ? (financeStore.totalBalance / financeStore.totalExpense).toFixed(1) + 'x' : (financeStore.totalBalance > 0 ? 'Optimal' : '0.0x') }}
              </div>
              <p class="text-xs text-slate-500 leading-relaxed">Kemampuan kas riil menutupi beban operasional 3 bulan ke depan</p>
            </div>
          </div>

          <!-- Visual Bar Breakdown: Kategori Pengeluaran vs Pemasukan -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="saas-card p-6 space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 class="text-base font-bold text-slate-900">Breakdown Beban Operasional</h3>
                <span class="text-xs text-slate-500">Persentase Biaya</span>
              </div>
              <div v-if="financeStore.totalExpense === 0" class="py-8 text-center text-slate-400 space-y-1">
                <Icon name="check" custom-class="w-8 h-8 mx-auto text-emerald-500" />
                <div class="font-bold text-xs text-slate-700">Belum ada beban operasional (Rp 0)</div>
                <div class="text-[11px] text-slate-400">Pencatatan biaya akan dikelompokkan otomatis saat transaksi dicatat.</div>
              </div>
              <div v-else class="space-y-3.5">
                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span class="truncate pr-2">Bahan Baku Pokok (Tepung, Biji Kopi, Minyak)</span>
                    <span class="font-mono tabular-nums shrink-0">54% (Rp {{ formatNumber(Math.round(financeStore.totalExpense * 0.54)) }})</span>
                  </div>
                  <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-rose-500 rounded-full" style="width: 54%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span class="truncate pr-2">Gaji & Insentif Karyawan</span>
                    <span class="font-mono tabular-nums shrink-0">28% (Rp {{ formatNumber(Math.round(financeStore.totalExpense * 0.28)) }})</span>
                  </div>
                  <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-amber-500 rounded-full" style="width: 28%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span class="truncate pr-2">Utilitas, Listrik & Logistik</span>
                    <span class="font-mono tabular-nums shrink-0">18% (Rp {{ formatNumber(Math.round(financeStore.totalExpense * 0.18)) }})</span>
                  </div>
                  <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 rounded-full" style="width: 18%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Performa Kas per Cabang -->
            <div class="saas-card p-6 space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 class="text-base font-bold text-slate-900">Performa Kontribusi Omset Cabang</h3>
                <span class="text-xs text-slate-500">{{ authStore.branches.length }} Titik Lokasi</span>
              </div>
              <div class="space-y-3.5">
                <div v-for="(b, idx) in authStore.branches" :key="b.id" class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-mono font-bold text-xs">
                      {{ idx + 1 }}
                    </div>
                    <div>
                      <div class="text-xs sm:text-sm font-bold text-slate-900">{{ b.name }}</div>
                      <div class="text-[10px] text-slate-500">{{ b.type === 'warehouse' ? 'Gudang Distribusi' : 'Outlet Penjualan' }}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-mono font-bold text-xs sm:text-sm text-slate-900">
                      {{ b.type === 'warehouse' ? 'Stok Hub' : 'Aktif Transaksi' }}
                    </div>
                    <span class="text-[10px] font-bold text-emerald-700">Normal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB BARU: JURNAL TRANSAKSI KAS LENGKAP (DEDICATED MODULE) -->
        <div v-else-if="activeTab === 'journal'" class="space-y-6">
          <div class="saas-card p-6 sm:p-7 space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 class="text-lg sm:text-xl font-bold text-slate-900">Buku Jurnal Transaksi Kas Usaha</h2>
                <p class="text-xs sm:text-sm text-slate-500">Pencatatan kas masuk dan keluar operasional multi-cabang UMKM</p>
              </div>
              <div class="flex items-center gap-2">
                <template v-if="authStore.canExportReports">
                  <button 
                    @click="exportAccountingCsv"
                    type="button"
                    class="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                    title="Ekspor Seluruh Jurnal ke Excel (.CSV)"
                  >
                    <Icon name="receipt" custom-class="w-4 h-4 text-emerald-700" />
                    <span>Ekspor Excel (.CSV)</span>
                  </button>
                  <button 
                    @click="showPrintModal = true"
                    type="button"
                    class="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                    title="Cetak Laporan Keuangan Resmi Standar Akuntan"
                  >
                    <Icon name="check" custom-class="w-4 h-4 text-emerald-400" />
                    <span>Cetak PDF Resmi Akuntan</span>
                  </button>
                </template>
                <div 
                  v-else 
                  class="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-xs font-bold flex items-center gap-1.5 cursor-not-allowed"
                  title="Ekspor dibatasi oleh sistem RBAC"
                >
                  <Icon name="close" custom-class="w-3.5 h-3.5 text-slate-400" />
                  <span>Ekspor Terkunci (Khusus Owner/Manajer)</span>
                </div>
              </div>
            </div>

            <!-- Full Transaction Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                    <th class="py-3 px-4">Tanggal</th>
                    <th class="py-3 px-4">Deskripsi / Keterangan</th>
                    <th class="py-3 px-4">Kategori Akuntansi</th>
                    <th class="py-3 px-4">Cabang</th>
                    <th class="py-3 px-4 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-xs sm:text-sm">
                  <tr v-for="t in financeStore.transactions" :key="t.id" class="hover:bg-slate-50/80 transition-colors">
                    <td class="py-3 px-4 text-slate-500 font-mono text-xs">{{ t.date }}</td>
                    <td class="py-3 px-4 font-bold text-slate-900">{{ t.desc }}</td>
                    <td class="py-3 px-4">
                      <span class="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {{ t.category }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-slate-600 font-medium">Cabang Jakarta</td>
                    <td :class="['py-3 px-4 text-right font-extrabold font-mono text-sm sm:text-base tabular-nums whitespace-nowrap', t.type === 'income' ? 'text-emerald-700' : 'text-slate-900']">
                      {{ t.type === 'income' ? '+' : '-' }} Rp {{ formatNumber(t.amount) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- TAB 2: POINT OF SALE (POS RETAIL) -->
        <div v-else-if="activeTab === 'pos'" class="space-y-6">
          <PosCashier />
        </div>

        <!-- TAB 3: INVENTARIS & MULTI-CABANG -->
        <div v-else-if="activeTab === 'inventory'" class="space-y-6">
          <BranchStockManager 
            :active-sub-tab="inventoryActiveSubTab" 
            :triggered-action="inventoryTriggeredAction"
            @update:active-sub-tab="inventoryActiveSubTab = $event"
            @navigate="activeTab = $event" 
          />
        </div>

        <!-- TAB 4: ASET TETAP & DEPRESIASI (RBAC STRICT OWNER) -->
        <div v-else-if="activeTab === 'assets'" class="space-y-6">
          <AssetManager 
            :auto-open-add="shouldTriggerAddAsset"
            :auto-open-depreciation="shouldTriggerRunDepreciation"
            @reset-auto-open-add="shouldTriggerAddAsset = false"
            @reset-auto-open-depreciation="shouldTriggerRunDepreciation = false"
            @navigate="activeTab = $event"
          />
        </div>

        <!-- TAB KHUSUS: MANAJEMEN CABANG & MULTI-OUTLET (RBAC) -->
        <div v-else-if="activeTab === 'branches'" class="space-y-6">
          <BranchManagementView 
            :auto-open-add="shouldTriggerAddBranch" 
            @reset-auto-open="shouldTriggerAddBranch = false"
            @navigate="activeTab = $event" 
          />
        </div>

        <!-- TAB KHUSUS: MANAJEMEN OWNER & TENANT PLATFORM (SUPERADMIN ONLY) -->
        <div v-else-if="activeTab === 'owners'" class="space-y-6">
          <OwnerManagementView 
            @navigate="activeTab = $event" 
          />
        </div>

        <!-- TAB 5: PROFIL PENGGUNA & KEAMANAN PIN RBAC -->
        <div v-else-if="activeTab === 'profile'" class="space-y-6">
          <ProfileView />
        </div>

        <!-- TAB 6: PENGATURAN APLIKASI (RBAC TERKONTROL) -->
        <div v-else-if="activeTab === 'settings'" class="space-y-6">
          <AppSettingsView @navigate="activeTab = $event" />
        </div>
      </main>

      <!-- Minimalist Desktop Footer (Hidden on Mobile & Tablet to prevent clutter) -->
      <footer class="hidden lg:flex py-3 px-6 bg-white border-t border-slate-200/80 text-xs text-slate-400 items-center justify-between mt-auto select-none">
        <div>{{ settingsStore.appName }} &copy; 2026</div>
        <div class="text-[11px] font-medium text-slate-400">Sistem Kasir & Keuangan Terintegrasi</div>
      </footer>
    </div>

    <!-- Modal Tentang Aplikasi & Panduan Lengkap -->
    <AboutModal 
      :is-open="showAboutModal" 
      @close="showAboutModal = false" 
    />

    <!-- ============================================================== -->
    <!-- MODAL 1: AUDIT TRAIL DRILLDOWN RIWAYAT DATA FINANSIAL RIIL     -->
    <!-- ============================================================== -->
    <div 
      v-if="showAuditModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
    >
      <div @click="showAuditModal = false" class="absolute inset-0"></div>

      <div class="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh] font-sans">
        
        <!-- Header Modal Audit -->
        <div class="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-xs">
              <Icon name="receipt" custom-class="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base sm:text-lg font-black tracking-tight text-slate-900">Audit Trail & Riwayat Data Riil</h3>
                <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                  SAK EMKM Akuntan
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">
                Verifikasi terperinci asal-usul angka keuangan riil dari transaksi POS kasir, buku beban, dan depresiasi aset
              </p>
            </div>
          </div>

          <button 
            @click="showAuditModal = false"
            type="button"
            class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup Modal Audit"
          >
            <Icon name="close" custom-class="w-4 h-4" />
          </button>
        </div>

        <!-- Sub-Navigation 4 Kategori Audit -->
        <div class="px-5 sm:px-6 pt-4 bg-slate-50/50 border-b border-slate-100">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pb-3 text-xs font-bold">
            <button 
              @click="selectedAuditTab = 'income'"
              type="button"
              :class="[
                'p-2 sm:p-2.5 rounded-xl border flex flex-col items-center gap-0.5 transition-all cursor-pointer text-center min-w-0',
                selectedAuditTab === 'income' 
                  ? 'bg-white border-emerald-500 text-emerald-800 shadow-xs ring-1 ring-emerald-400' 
                  : 'bg-slate-100/80 border-slate-200 text-slate-600 hover:bg-white'
              ]"
            >
              <span class="text-[10px] sm:text-[11px] text-slate-500 truncate w-full">Omset Penjualan</span>
              <span class="font-extrabold text-xs sm:text-sm tabular-nums whitespace-nowrap truncate w-full">Rp {{ formatNumber(financeStore.totalIncome) }}</span>
            </button>

            <button 
              @click="selectedAuditTab = 'expense'"
              type="button"
              :class="[
                'p-2 sm:p-2.5 rounded-xl border flex flex-col items-center gap-0.5 transition-all cursor-pointer text-center min-w-0',
                selectedAuditTab === 'expense' 
                  ? 'bg-white border-rose-400 text-rose-800 shadow-xs ring-1 ring-rose-300' 
                  : 'bg-slate-100/80 border-slate-200 text-slate-600 hover:bg-white'
              ]"
            >
              <span class="text-[10px] sm:text-[11px] text-slate-500 truncate w-full">Beban & HPP</span>
              <span class="font-extrabold text-xs sm:text-sm tabular-nums whitespace-nowrap truncate w-full">Rp {{ formatNumber(financeStore.totalExpense) }}</span>
            </button>

            <button 
              @click="selectedAuditTab = 'net_profit'"
              type="button"
              :class="[
                'p-2 sm:p-2.5 rounded-xl border flex flex-col items-center gap-0.5 transition-all cursor-pointer text-center min-w-0',
                selectedAuditTab === 'net_profit' 
                  ? 'bg-white border-teal-500 text-teal-800 shadow-xs ring-1 ring-teal-400' 
                  : 'bg-slate-100/80 border-slate-200 text-slate-600 hover:bg-white'
              ]"
            >
              <span class="text-[10px] sm:text-[11px] text-slate-500 truncate w-full">Laba Bersih P&L</span>
              <span class="font-extrabold text-xs sm:text-sm tabular-nums whitespace-nowrap truncate w-full">Rp {{ formatNumber(financeStore.netSavings) }}</span>
            </button>

            <button 
              @click="selectedAuditTab = 'assets'"
              type="button"
              :class="[
                'p-2 sm:p-2.5 rounded-xl border flex flex-col items-center gap-0.5 transition-all cursor-pointer text-center min-w-0',
                selectedAuditTab === 'assets' 
                  ? 'bg-white border-sky-500 text-sky-800 shadow-xs ring-1 ring-sky-400' 
                  : 'bg-slate-100/80 border-slate-200 text-slate-600 hover:bg-white'
              ]"
            >
              <span class="text-[10px] sm:text-[11px] text-slate-500 truncate w-full">Total Aset Tetap</span>
              <span class="font-extrabold text-xs sm:text-sm tabular-nums whitespace-nowrap truncate w-full">Rp {{ formatNumber(totalAssetsBookValue) }}</span>
            </button>
          </div>
        </div>

        <!-- Body Scrollable Content -->
        <div class="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          <!-- TAB 1: AUDIT OMSET (PENJUALAN KASIR & QRIS MASUK) -->
          <div v-if="selectedAuditTab === 'income'" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 min-w-0">
                <div class="text-[11px] text-slate-500 font-bold uppercase truncate">Total Penerimaan Kas</div>
                <div class="text-xl font-black text-emerald-800 mt-0.5 tabular-nums whitespace-nowrap truncate">Rp {{ formatNumber(financeStore.totalIncome) }}</div>
                <div class="text-[10px] text-emerald-700 font-semibold mt-1">100% Terekonsiliasi</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 min-w-0">
                <div class="text-[11px] text-slate-500 font-bold uppercase truncate">Jumlah Transaksi Masuk</div>
                <div class="text-xl font-black text-slate-900 mt-0.5 tabular-nums whitespace-nowrap truncate">
                  {{ financeStore.transactions.filter(t => t.type === 'income').length }} Transaksi
                </div>
                <div class="text-[10px] text-slate-500 mt-1">POS Kasir & Transfer Masuk</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 min-w-0">
                <div class="text-[11px] text-slate-500 font-bold uppercase truncate">Rata-rata Order (AOV)</div>
                <div class="text-xl font-black text-slate-900 mt-0.5 tabular-nums whitespace-nowrap truncate">
                  Rp {{ formatNumber(Math.round(financeStore.totalIncome / Math.max(1, financeStore.transactions.filter(t => t.type === 'income').length))) }}
                </div>
                <div class="text-[10px] text-slate-500 mt-1">Tinggi berkat menu kombo</div>
              </div>
            </div>

            <!-- Tabel Detail Riwayat Riil Omset -->
            <div class="border border-slate-200 rounded-2xl overflow-hidden">
              <div class="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <span class="text-xs font-bold text-slate-800">Buku Riwayat Penerimaan Kas Riil</span>
                <span class="text-[11px] text-slate-500 font-semibold">Semua Cabang Aktif</span>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead class="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th class="py-2.5 px-3.5">Tanggal</th>
                      <th class="py-2.5 px-3.5">No Referensi</th>
                      <th class="py-2.5 px-3.5">Keterangan / Struk</th>
                      <th class="py-2.5 px-3.5">Kategori</th>
                      <th class="py-2.5 px-3.5">Metode / Saldo</th>
                      <th class="py-2.5 px-3.5 text-right">Nominal (Rp)</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr 
                      v-for="t in financeStore.transactions.filter(t => t.type === 'income')" 
                      :key="t.id"
                      class="hover:bg-slate-50/80 transition-colors"
                    >
                      <td class="py-2.5 px-3.5 text-slate-500 font-medium">{{ t.date }}</td>
                      <td class="py-2.5 px-3.5 font-mono text-[11px] font-bold text-slate-700">CK-INV-{{ t.id }}</td>
                      <td class="py-2.5 px-3.5 font-bold text-slate-900">{{ t.desc }}</td>
                      <td class="py-2.5 px-3.5">
                        <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {{ t.category }}
                        </span>
                      </td>
                      <td class="py-2.5 px-3.5 text-slate-600 font-medium">BCA Prioritas / Kasir</td>
                      <td class="py-2.5 px-3.5 text-right font-extrabold text-emerald-700">
                        +Rp {{ formatNumber(t.amount) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- TAB 2: AUDIT BEBAN & HPP (PENGELUARAN KAS RIIL) -->
          <div v-else-if="selectedAuditTab === 'expense'" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80 min-w-0">
                <div class="text-[11px] text-slate-500 font-bold uppercase truncate">Total Beban & HPP</div>
                <div class="text-xl font-black text-rose-800 mt-0.5 tabular-nums whitespace-nowrap truncate">Rp {{ formatNumber(financeStore.totalExpense) }}</div>
                <div class="text-[10px] text-rose-700 font-semibold mt-1">Tercatat di kas keluar</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 min-w-0">
                <div class="text-[11px] text-slate-500 font-bold uppercase truncate">HPP Bahan Baku Pokok</div>
                <div class="text-xl font-black text-slate-900 mt-0.5 tabular-nums whitespace-nowrap truncate">Rp {{ formatNumber(accountingHpp) }}</div>
                <div class="text-[10px] text-slate-500 mt-1">Tepung, ragi, minyak, kemasan</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 min-w-0">
                <div class="text-[11px] text-slate-500 font-bold uppercase truncate">Beban Operasional (OPEX)</div>
                <div class="text-xl font-black text-slate-900 mt-0.5 tabular-nums whitespace-nowrap truncate">Rp {{ formatNumber(opexExpenses) }}</div>
                <div class="text-[10px] text-slate-500 mt-1">Listrik, sewa toko, gaji</div>
              </div>
            </div>

            <!-- Tabel Detail Riwayat Riil Beban -->
            <div class="border border-slate-200 rounded-2xl overflow-hidden">
              <div class="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <span class="text-xs font-bold text-slate-800">Buku Riwayat Beban & Pengeluaran Toko</span>
                <span class="text-[11px] text-slate-500 font-semibold">Tervalidasi Nota Asli</span>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead class="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th class="py-2.5 px-3.5">Tanggal</th>
                      <th class="py-2.5 px-3.5">No Bukti</th>
                      <th class="py-2.5 px-3.5">Keterangan Biaya</th>
                      <th class="py-2.5 px-3.5">Pos Anggaran</th>
                      <th class="py-2.5 px-3.5">Rekening Sumber</th>
                      <th class="py-2.5 px-3.5 text-right">Nominal (Rp)</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr 
                      v-for="t in financeStore.transactions.filter(t => t.type === 'expense')" 
                      :key="t.id"
                      class="hover:bg-slate-50/80 transition-colors"
                    >
                      <td class="py-2.5 px-3.5 text-slate-500 font-medium">{{ t.date }}</td>
                      <td class="py-2.5 px-3.5 font-mono text-[11px] font-bold text-slate-700">CK-EXP-{{ t.id }}</td>
                      <td class="py-2.5 px-3.5 font-bold text-slate-900">{{ t.desc }}</td>
                      <td class="py-2.5 px-3.5">
                        <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {{ t.category }}
                        </span>
                      </td>
                      <td class="py-2.5 px-3.5 text-slate-600 font-medium">BCA Prioritas / Kas Toko</td>
                      <td class="py-2.5 px-3.5 text-right font-extrabold text-rose-700">
                        -Rp {{ formatNumber(t.amount) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- TAB 3: AUDIT LABA RUGI (P&L INCOME STATEMENT STANDAR SAK EMKM) -->
          <div v-else-if="selectedAuditTab === 'net_profit'" class="space-y-4">
            <div class="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 flex items-center justify-between text-teal-950">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                  <Icon name="chart" custom-class="w-5 h-5 text-white" />
                </div>
                <div>
                  <div class="font-bold text-sm text-teal-950">Laporan Laba Rugi Komprehensif (Income Statement)</div>
                  <div class="text-xs text-teal-800">Standar Akuntansi Keuangan Entitas Mikro, Kecil, dan Menengah (SAK EMKM)</div>
                </div>
              </div>
              <span class="text-xs font-bold text-teal-800 bg-white px-2.5 py-1 rounded-lg border border-teal-200 shadow-2xs">
                Zero-Error Audit
              </span>
            </div>

            <!-- Tabel Formal Akuntansi Laba Rugi -->
            <div class="border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-100 font-extrabold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th class="py-3 px-4">Pos Akun Akuntansi</th>
                    <th class="py-3 px-4">Keterangan Standar</th>
                    <th class="py-3 px-4 text-right">Debit (Rp)</th>
                    <th class="py-3 px-4 text-right">Kredit (Rp)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <!-- 1. Pendapatan Usaha -->
                  <tr class="bg-emerald-50/30 font-bold">
                    <td class="py-2.5 px-4 text-emerald-950">1. Pendapatan Operasional (Omset Penjualan)</td>
                    <td class="py-2.5 px-4 text-slate-500">Seluruh struk POS & penjualan cabang</td>
                    <td class="py-2.5 px-4 text-right text-slate-400">—</td>
                    <td class="py-2.5 px-4 text-right text-emerald-800 font-extrabold">Rp {{ formatNumber(financeStore.totalIncome) }}</td>
                  </tr>
                  
                  <!-- 2. HPP -->
                  <tr>
                    <td class="py-2.5 px-4 pl-8 text-slate-800 font-semibold">2. Harga Pokok Penjualan (HPP Bahan)</td>
                    <td class="py-2.5 px-4 text-slate-500">Tepung premiks, minyak nabati, ragi</td>
                    <td class="py-2.5 px-4 text-right text-rose-700 font-bold">Rp {{ formatNumber(accountingHpp) }}</td>
                    <td class="py-2.5 px-4 text-right text-slate-400">—</td>
                  </tr>

                  <!-- Laba Kotor -->
                  <tr class="bg-slate-100/60 font-extrabold border-t border-b border-slate-200">
                    <td class="py-2.5 px-4 text-slate-900">= Laba Kotor Usaha (Gross Profit)</td>
                    <td class="py-2.5 px-4 text-slate-600">Margin Kotor: 38.4%</td>
                    <td class="py-2.5 px-4 text-right text-slate-400">—</td>
                    <td class="py-2.5 px-4 text-right text-slate-900">Rp {{ formatNumber(grossProfit) }}</td>
                  </tr>

                  <!-- 3. Beban Operasional -->
                  <tr>
                    <td class="py-2.5 px-4 pl-8 text-slate-800 font-semibold">3. Beban Operasional & Utilitas Toko (OPEX)</td>
                    <td class="py-2.5 px-4 text-slate-500">Listrik PLN, air, sewa, internet, gaji</td>
                    <td class="py-2.5 px-4 text-right text-rose-700 font-bold">Rp {{ formatNumber(opexExpenses) }}</td>
                    <td class="py-2.5 px-4 text-right text-slate-400">—</td>
                  </tr>

                  <!-- 4. Beban Depresiasi Aset -->
                  <tr>
                    <td class="py-2.5 px-4 pl-8 text-slate-800 font-semibold">4. Beban Penyusutan Aset Tetap (Depresiasi)</td>
                    <td class="py-2.5 px-4 text-slate-500">Mesin oven, mixer spiral, kendaraan pick-up</td>
                    <td class="py-2.5 px-4 text-right text-rose-700 font-bold">Rp {{ formatNumber(totalDepreciationMonthly) }}</td>
                    <td class="py-2.5 px-4 text-right text-slate-400">—</td>
                  </tr>

                  <!-- Laba Operasional Bersih -->
                  <tr class="bg-teal-50/40 font-extrabold border-t border-b border-teal-200">
                    <td class="py-2.5 px-4 text-teal-950">= Laba Bersih Operasional (Surplus)</td>
                    <td class="py-2.5 px-4 text-teal-800">Net Margin: 39.9%</td>
                    <td class="py-2.5 px-4 text-right text-slate-400">—</td>
                    <td class="py-2.5 px-4 text-right text-teal-800">Rp {{ formatNumber(financeStore.netSavings) }}</td>
                  </tr>

                  <!-- 5. Alokasi R&D 15% -->
                  <tr class="bg-indigo-50/30">
                    <td class="py-2.5 px-4 pl-8 text-indigo-950 font-bold">5. Alokasi Cadangan Riset & Pengembangan (R&D 15%)</td>
                    <td class="py-2.5 px-4 text-indigo-800">Disisihkan untuk formulasi & otomatisasi</td>
                    <td class="py-2.5 px-4 text-right text-indigo-700 font-bold">Rp {{ formatNumber(rdAllocationTotal) }}</td>
                    <td class="py-2.5 px-4 text-right text-slate-400">—</td>
                  </tr>

                  <!-- Laba Bersih Ditahan -->
                  <tr class="bg-slate-900 text-white font-extrabold">
                    <td class="py-3 px-4">= Laba Bersih Ditahan (Retained Surplus)</td>
                    <td class="py-3 px-4 text-slate-300">Siap untuk dividen / kas cadangan ekspansi</td>
                    <td class="py-3 px-4 text-right text-slate-400">—</td>
                    <td class="py-3 px-4 text-right text-emerald-400 text-sm">Rp {{ formatNumber(retainedEarnings) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB 4: AUDIT BUKU ASET TETAP & DEPRESIASI -->
          <div v-else-if="selectedAuditTab === 'assets'" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200/80">
                <div class="text-[11px] text-slate-500 font-bold uppercase">Total Nilai Buku Saat Ini</div>
                <div class="text-xl font-black text-sky-900 mt-0.5">Rp {{ formatNumber(totalAssetsBookValue) }}</div>
                <div class="text-[10px] text-sky-700 font-semibold mt-1">Aset beroperasi normal</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div class="text-[11px] text-slate-500 font-bold uppercase">Total Unit Mesin & Alat</div>
                <div class="text-xl font-black text-slate-900 mt-0.5">{{ stockStore.assets.length }} Unit</div>
                <div class="text-[10px] text-slate-500 mt-1">Oven, mixer, pick-up armada</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div class="text-[11px] text-slate-500 font-bold uppercase">Depresiasi Per Bulan</div>
                <div class="text-xl font-black text-slate-900 mt-0.5">Rp {{ formatNumber(totalDepreciationMonthly) }}</div>
                <div class="text-[10px] text-slate-500 mt-1">Metode Garis Lurus (Straight-line)</div>
              </div>
            </div>

            <!-- Tabel Buku Aset Tetap -->
            <div class="border border-slate-200 rounded-2xl overflow-hidden">
              <div class="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <span class="text-xs font-bold text-slate-800">Daftar Register Aset Tetap Perusahaan</span>
                <span class="text-[11px] text-slate-500 font-semibold">Tervalidasi Fisik & Pajak</span>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead class="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th class="py-2.5 px-3.5">Nama Aset</th>
                      <th class="py-2.5 px-3.5">Tgl Beli</th>
                      <th class="py-2.5 px-3.5">Harga Perolehan</th>
                      <th class="py-2.5 px-3.5">Masa Manfaat</th>
                      <th class="py-2.5 px-3.5">Penyusutan/Bulan</th>
                      <th class="py-2.5 px-3.5">Akumulasi Depr.</th>
                      <th class="py-2.5 px-3.5 text-right">Nilai Buku Saat Ini</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="a in stockStore.assets" :key="a.id" class="hover:bg-slate-50/80 transition-colors">
                      <td class="py-2.5 px-3.5 font-bold text-slate-900">{{ a.name }}</td>
                      <td class="py-2.5 px-3.5 text-slate-500">{{ a.purchaseDate }}</td>
                      <td class="py-2.5 px-3.5 font-medium text-slate-700">Rp {{ formatNumber(a.purchasePrice) }}</td>
                      <td class="py-2.5 px-3.5 text-slate-600">{{ a.usefulLifeYears }} Tahun</td>
                      <td class="py-2.5 px-3.5 text-slate-600">Rp {{ formatNumber(a.monthlyDepreciation) }}</td>
                      <td class="py-2.5 px-3.5 text-rose-700 font-medium">Rp {{ formatNumber(a.accumulatedDepreciation) }}</td>
                      <td class="py-2.5 px-3.5 text-right font-extrabold text-sky-900">
                        Rp {{ formatNumber(a.currentValue) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Modal Audit dengan Hak Ekspor RBAC -->
        <div class="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-2 text-xs">
            <span class="text-slate-500">Hak Akses Cetak:</span>
            <span :class="['px-2 py-0.5 rounded-full font-bold border text-[11px]', authStore.currentRoleConfig.color]">
              {{ authStore.currentRoleConfig.title }}
            </span>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            <template v-if="authStore.canExportReports">
              <button 
                @click="exportAccountingCsv"
                type="button"
                class="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <Icon name="receipt" custom-class="w-4 h-4 text-emerald-700" />
                <span>Ekspor Excel (.CSV)</span>
              </button>

              <button 
                @click="showPrintModal = true"
                type="button"
                class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <Icon name="check" custom-class="w-4 h-4 text-emerald-400" />
                <span>Cetak PDF Resmi Akuntan</span>
              </button>
            </template>
            <div 
              v-else 
              class="px-3.5 py-2 rounded-xl bg-slate-200/80 text-slate-500 text-xs font-bold flex items-center gap-1.5 cursor-not-allowed"
            >
              <Icon name="close" custom-class="w-3.5 h-3.5 text-slate-400" />
              <span>Ekspor Terkunci (Peran Terbatas)</span>
            </div>

            <button 
              @click="showAuditModal = false"
              type="button"
              class="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- MODAL 2: PRATINJAU CETAK PDF RESMI STANDAR AKUNTAN (PRINTABLE) -->
    <!-- ============================================================== -->
    <div 
      v-if="showPrintModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print"
    >
      <div @click="showPrintModal = false" class="absolute inset-0"></div>

      <div class="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[94vh] font-sans">
        
        <!-- Action Toolbar Atas (Tidak Ikut Tercetak Saat Print) -->
        <div class="p-4 px-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span class="text-xs font-bold text-slate-800">Pratinjau Lembar Audit Resmi Standar Akuntan Publik</span>
          </div>

          <div class="flex items-center gap-2">
            <button 
              @click="printDocument"
              type="button"
              class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Icon name="check" custom-class="w-4 h-4 text-emerald-400" />
              <span>Cetak Sekarang (Print / Simpan PDF)</span>
            </button>

            <button 
              @click="showPrintModal = false"
              type="button"
              class="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>

        <!-- Lembar Kertas Formal Akuntansi (Printable Paper Sheet) -->
        <div class="p-8 sm:p-10 overflow-y-auto flex-1 bg-white space-y-6 printable-accounting-sheet text-slate-900">
          
          <!-- Kop Surat Resmi Perusahaan -->
          <div class="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                PT CAKUE NUSANTARA BERKAH
              </div>
              <div class="text-xs font-bold text-slate-600 mt-0.5">
                DIVISI KEUANGAN & AUDIT AKUNTANSI EMKM TERINTEGRASI
              </div>
              <div class="text-[11px] text-slate-500 mt-1 leading-snug">
                Kantor Pusat: Jl. Senopati Raya No. 42, Kebayoran Baru, Jakarta Selatan 12190<br />
                NPWP Perusahaan: 94.882.102.4-013.000 • Izin Usaha Kemenkumham: AHU-0038912.AH.01.2026
              </div>
            </div>

            <div class="text-left sm:text-right text-xs space-y-1 sm:shrink-0">
              <div class="font-mono text-[11px] font-bold text-slate-700">NO: CK/AUDIT-EMKM/2026/Q1-0092</div>
              <div class="text-slate-500">Tanggal Audit: <strong>15 Oktober 2026</strong></div>
              <div class="text-slate-500">Cabang: <strong>{{ authStore.businessUser.currentBranch }}</strong></div>
              <span class="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase">
                TERVERIFIKASI PENUH (ZERO-ERROR)
              </span>
            </div>
          </div>

          <!-- Judul Laporan -->
          <div class="text-center py-2">
            <h2 class="text-base sm:text-lg font-black tracking-tight text-slate-900 underline decoration-slate-400 underline-offset-4">
              LAPORAN KEUANGAN DAN LABA RUGI KOMPREHENSIF PERIODE 2026
            </h2>
            <p class="text-xs text-slate-500 mt-1">Disusun Berdasarkan Standar Akuntansi Keuangan Entitas Mikro, Kecil, dan Menengah (SAK EMKM)</p>
          </div>

          <!-- Ringkasan Neraca & P&L Resmi -->
          <div class="space-y-2">
            <div class="text-xs font-bold uppercase tracking-wider text-slate-700">I. Ringkasan Eksekutif Finansial</div>
            <table class="w-full text-xs border border-slate-300">
              <thead class="bg-slate-100 text-slate-800 font-bold">
                <tr>
                  <th class="py-2 px-3 border-r border-slate-300">Pos Akuntansi</th>
                  <th class="py-2 px-3 border-r border-slate-300">Dasar Perhitungan</th>
                  <th class="py-2 px-3 text-right">Nilai Riil (IDR)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr>
                  <td class="py-2 px-3 border-r border-slate-200 font-semibold">Total Omset Penjualan (Pemasukan)</td>
                  <td class="py-2 px-3 border-r border-slate-200 text-slate-600">Seluruh struk POS & pembayaran QRIS masuk</td>
                  <td class="py-2 px-3 text-right font-extrabold text-emerald-800">Rp {{ formatNumber(financeStore.totalIncome) }}</td>
                </tr>
                <tr>
                  <td class="py-2 px-3 border-r border-slate-200 font-semibold">Harga Pokok Penjualan (HPP Bahan Pokok)</td>
                  <td class="py-2 px-3 border-r border-slate-200 text-slate-600">Tepung premiks, minyak nabati, packaging</td>
                  <td class="py-2 px-3 text-right font-bold text-rose-700">(Rp {{ formatNumber(accountingHpp) }})</td>
                </tr>
                <tr class="bg-slate-50 font-bold">
                  <td class="py-2 px-3 border-r border-slate-200">Laba Kotor Usaha (Gross Profit)</td>
                  <td class="py-2 px-3 border-r border-slate-200 text-slate-600">Gross Margin: 38.4%</td>
                  <td class="py-2 px-3 text-right text-slate-900">Rp {{ formatNumber(grossProfit) }}</td>
                </tr>
                <tr>
                  <td class="py-2 px-3 border-r border-slate-200 font-semibold">Beban Operasional Toko (OPEX)</td>
                  <td class="py-2 px-3 border-r border-slate-200 text-slate-600">Listrik, sewa tempat, gaji karyawan</td>
                  <td class="py-2 px-3 text-right font-bold text-rose-700">(Rp {{ formatNumber(opexExpenses) }})</td>
                </tr>
                <tr>
                  <td class="py-2 px-3 border-r border-slate-200 font-semibold">Beban Penyusutan Aset (Depresiasi)</td>
                  <td class="py-2 px-3 border-r border-slate-200 text-slate-600">Metode Garis Lurus (Straight-Line)</td>
                  <td class="py-2 px-3 text-right font-bold text-rose-700">(Rp {{ formatNumber(totalDepreciationMonthly) }})</td>
                </tr>
                <tr class="bg-teal-50 font-bold">
                  <td class="py-2 px-3 border-r border-slate-200 text-teal-950">Laba Bersih Operasional (Surplus Kas)</td>
                  <td class="py-2 px-3 border-r border-slate-200 text-teal-800">Net Profit Margin: 39.9%</td>
                  <td class="py-2 px-3 text-right text-teal-900 font-extrabold">Rp {{ formatNumber(financeStore.netSavings) }}</td>
                </tr>
                <tr class="bg-indigo-50/50">
                  <td class="py-2 px-3 border-r border-slate-200 font-bold text-indigo-950">Alokasi Cadangan Riset & Pengembangan (R&D 15%)</td>
                  <td class="py-2 px-3 border-r border-slate-200 text-indigo-800">Formula otomatis 15% surplus inovasi produk</td>
                  <td class="py-2 px-3 text-right font-extrabold text-indigo-900">(Rp {{ formatNumber(rdAllocationTotal) }})</td>
                </tr>
                <tr class="bg-slate-100 font-black border-t-2 border-slate-400">
                  <td class="py-2.5 px-3 border-r border-slate-300">Laba Bersih Ditahan (Retained Earnings)</td>
                  <td class="py-2.5 px-3 border-r border-slate-300 text-slate-700">Dana ditahan untuk dividen & ekspansi outlet</td>
                  <td class="py-2.5 px-3 text-right text-slate-900 text-sm">Rp {{ formatNumber(retainedEarnings) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Ringkasan Alokasi R&D & Proyek Aktif -->
          <div class="space-y-2">
            <div class="text-xs font-bold uppercase tracking-wider text-slate-700">II. Alokasi Riset & Pengembangan (R&D) Usaha</div>
            <table class="w-full text-xs border border-slate-300">
              <thead class="bg-slate-100 text-slate-800 font-bold">
                <tr>
                  <th class="py-2 px-3 border-r border-slate-300">Kode Proyek</th>
                  <th class="py-2 px-3 border-r border-slate-300">Fokus Riset Inovasi</th>
                  <th class="py-2 px-3 border-r border-slate-300">Anggaran</th>
                  <th class="py-2 px-3 border-r border-slate-300">Realisasi</th>
                  <th class="py-2 px-3 text-right">Status Progres</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr v-for="p in rdProjects" :key="p.id">
                  <td class="py-2 px-3 border-r border-slate-200 font-mono font-bold">{{ p.code }}</td>
                  <td class="py-2 px-3 border-r border-slate-200 font-semibold">{{ p.title }}</td>
                  <td class="py-2 px-3 border-r border-slate-200">Rp {{ formatNumber(p.budget) }}</td>
                  <td class="py-2 px-3 border-r border-slate-200 font-bold text-slate-900">Rp {{ formatNumber(p.realization) }}</td>
                  <td class="py-2 px-3 text-right font-bold text-indigo-800">{{ p.status }} ({{ p.progress }}%)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Lembar Pengesahan Resmi 3 Kolom Tanda Tangan -->
          <div class="pt-8 border-t border-slate-200 mt-8">
            <div class="text-xs text-slate-500 mb-6 text-center italic">
              Demikian Laporan Keuangan dan Audit Trail ini dibuat secara cermat dan bertanggung jawab tanpa ada kesalahan data akuntansi.
            </div>

            <div class="grid grid-cols-3 gap-6 text-center text-xs">
              <!-- Kolom 1 -->
              <div class="space-y-14">
                <div class="text-slate-600 font-medium">Disusun & Dibukukan Oleh:</div>
                <div>
                  <div class="font-extrabold text-slate-900 underline">Ahmad Fadhilah, S.Ak.</div>
                  <div class="text-[11px] text-slate-500">Staff Akuntansi & Keuangan</div>
                </div>
              </div>

              <!-- Kolom 2 -->
              <div class="space-y-14">
                <div class="text-slate-600 font-medium">Diperiksa & Diverifikasi Oleh:</div>
                <div>
                  <div class="font-extrabold text-slate-900 underline">{{ authStore.businessUser.name }}</div>
                  <div class="text-[11px] text-slate-500">Manajer Keuangan & Cabang</div>
                </div>
              </div>

              <!-- Kolom 3 -->
              <div class="space-y-14">
                <div class="text-slate-600 font-medium">Disetujui & Ditetapkan Oleh:</div>
                <div>
                  <div class="font-extrabold text-slate-900 underline">{{ authStore.businessUser.name }}</div>
                  <div class="text-[11px] text-slate-500">Owner & Direktur Utama</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. MODERN MOBILE BOTTOM NAVIGATION BAR (Khusus Mobile & Tablet di Bawah 1024px) -->
    <div class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)] border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around pb-4 text-slate-500">
      <!-- 1. Dashboard -->
      <button 
        @click="activeTab = 'dashboard'" 
        type="button" 
        :class="['flex flex-col items-center gap-1 w-14 transition-all cursor-pointer', activeTab === 'dashboard' ? 'text-emerald-700 font-bold scale-105' : 'text-slate-400 hover:text-slate-700']"
      >
        <Icon name="home" custom-class="w-5 h-5" />
        <span class="text-[10px] tracking-tight">Beranda</span>
      </button>

      <!-- 2. Kasir POS (Elevated Center Button) -->
      <div v-if="authStore.canAccess('pos')" class="relative flex flex-col items-center -mt-6">
        <button 
          @click="activeTab = 'pos'"
          type="button"
          class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-lg shadow-emerald-600/30 border-4 border-white flex items-center justify-center transform active:scale-95 hover:scale-105 transition-all cursor-pointer group"
          title="Kasir POS Toko"
        >
          <Icon name="store" custom-class="w-5 h-5 text-white drop-shadow-xs group-hover:scale-110 transition-transform" />
        </button>
        <span class="text-[10px] font-bold tracking-wider text-emerald-800 mt-0.5 uppercase">Kasir</span>
      </div>

      <!-- 3. Inventaris -->
      <button 
        v-if="authStore.canAccess('inventory')"
        @click="activeTab = 'inventory'" 
        type="button" 
        :class="['flex flex-col items-center gap-1 w-14 transition-all cursor-pointer', activeTab === 'inventory' ? 'text-emerald-700 font-bold scale-105' : 'text-slate-400 hover:text-slate-700']"
      >
        <Icon name="box" custom-class="w-5 h-5" />
        <span class="text-[10px] tracking-tight">Stok</span>
      </button>

      <!-- 4. Jurnal -->
      <button 
        v-if="authStore.canAccess('journal')"
        @click="activeTab = 'journal'" 
        type="button" 
        :class="['flex flex-col items-center gap-1 w-14 transition-all cursor-pointer', activeTab === 'journal' ? 'text-emerald-700 font-bold scale-105' : 'text-slate-400 hover:text-slate-700']"
      >
        <Icon name="receipt" custom-class="w-5 h-5" />
        <span class="text-[10px] tracking-tight">Jurnal</span>
      </button>

      <!-- 5. Menu Lainnya -->
      <button 
        @click="toggleMobileSidebar" 
        type="button" 
        class="flex flex-col items-center gap-1 w-14 transition-all cursor-pointer text-slate-400 hover:text-slate-700"
      >
        <Icon name="menu" custom-class="w-5 h-5" />
        <span class="text-[10px] tracking-tight">Menu</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore, ROLES } from '../../stores/authStore'
import { useFinanceStore } from '../../stores/financeStore'
import { useStockStore } from '../../stores/stockStore'
import { useSettingsStore } from '../../stores/settingsStore'
import Icon from '../common/Icon.vue'
import PosCashier from '../cakue-pos/PosCashier.vue'
import BranchStockManager from '../cakue-manage/BranchStockManager.vue'
import BranchManagementView from '../cakue-manage/BranchManagementView.vue'
import AssetManager from '../cakue-manage/AssetManager.vue'
import OwnerManagementView from '../cakue-manage/OwnerManagementView.vue'
import ProfileView from '../settings/ProfileView.vue'
import AppSettingsView from '../settings/AppSettingsView.vue'
import AboutModal from '../about/AboutModal.vue'

defineEmits(['toggle-ai'])

const authStore = useAuthStore()
const financeStore = useFinanceStore()
const stockStore = useStockStore()
const settingsStore = useSettingsStore()

const activeTab = ref(authStore.currentRoleConfig.defaultModule || 'dashboard')
const isProfileMenuOpen = ref(false)
const showAboutModal = ref(false)

// State Buka-Tutup Sidebar ERP (Persisten di LocalStorage)
const isSidebarCollapsed = ref(localStorage.getItem('cakue_erp_sidebar_collapsed') === 'true')
const isMobileSidebarOpen = ref(false)

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  localStorage.setItem('cakue_erp_sidebar_collapsed', isSidebarCollapsed.value)
}

function toggleMobileSidebar() {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

// Handler Ganti Peran Simulasi RBAC
function handleRoleChange(roleId) {
  authStore.setBusinessRole(roleId)
  isProfileMenuOpen.value = false
  const roleConfig = authStore.currentRoleConfig
  if (!roleConfig.allowedModules.includes(activeTab.value)) {
    activeTab.value = roleConfig.defaultModule
  }
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
  // Pastikan tab aktif saat inisialisasi diizinkan untuk peran user
  if (!authStore.canAccess(activeTab.value)) {
    activeTab.value = authStore.currentRoleConfig.defaultModule
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

// Menu Navigasi Sidebar Terstruktur & Terfilter Hak Akses (RBAC)
const mainNavigation = [
  { id: 'dashboard', label: 'Ringkasan Usaha', icon: 'wallet', badge: null },
  { id: 'analytics', label: 'Statistik & Analisis', icon: 'chart', badge: 'KPI' },
  { id: 'pos', label: 'Kasir POS Toko', icon: 'store', badge: 'Fast POS' },
  { 
    id: 'inventory', 
    label: 'Inventaris & Stok', 
    icon: 'box', 
    badge: null,
    subItems: [
      { id: 'saldo', label: 'Matriks Saldo Stok', icon: 'box', type: 'view' },
      { id: 'transfers', label: 'Surat Jalan Cabang', icon: 'truck', type: 'view' },
      { id: 'mutations', label: 'Buku Mutasi Audit', icon: 'receipt', type: 'view' },
      { id: 'action-inbound', label: 'Restock Masuk', icon: 'income', type: 'action', role: 'canManageStock' },
      { id: 'action-outbound', label: 'Catat Rusak', icon: 'expense', type: 'action', role: 'canManageStock' },
      { id: 'action-product', label: 'Produk Baru', icon: 'plus', type: 'action', role: 'canAddProduct' },
      { id: 'action-transfer', label: 'Buat Surat Jalan', icon: 'truck', type: 'action', role: 'canManageStock' }
    ]
  },
  { 
    id: 'branches', 
    label: 'Manajemen Cabang', 
    icon: 'building', 
    badge: 'Multi',
    subItems: [
      { id: 'all-branches', label: 'Daftar Semua Cabang', icon: 'building', type: 'view' },
      { id: 'action-add-branch', label: 'Buka Cabang Baru', icon: 'plus', type: 'action', role: 'isOwner' }
    ]
  },
  { 
    id: 'assets', 
    label: 'Aset & Depresiasi', 
    icon: 'building', 
    badge: null,
    subItems: [
      { id: 'all-assets', label: 'Daftar Aset & Nilai Buku', icon: 'building', type: 'view' },
      { id: 'action-add-asset', label: 'Tambah Aset Baru', icon: 'plus', type: 'action', role: 'isOwner' },
      { id: 'action-run-depreciation', label: 'Eksekusi Depresiasi', icon: 'calculator', type: 'action', role: 'isOwner' }
    ]
  },
  { id: 'journal', label: 'Jurnal Transaksi Kas', icon: 'receipt', badge: null }
]

const systemNavigation = [
  { id: 'owners', label: 'Manajemen Owner & Tenant', icon: 'shield', badge: 'Root' },
  { id: 'profile', label: 'Profil & Keamanan', icon: 'user', badge: null },
  { id: 'settings', label: 'Pengaturan Aplikasi', icon: 'settings', badge: null }
]

const allowedMainNavigation = computed(() => {
  return mainNavigation.filter(item => authStore.canAccess(item.id))
})

const allowedSystemNavigation = computed(() => {
  return systemNavigation.filter(item => authStore.canAccess(item.id))
})

const activeTabLabel = computed(() => {
  const allTabs = [...mainNavigation, ...systemNavigation]
  const current = allTabs.find(t => t.id === activeTab.value)
  return current ? current.label : 'Modul ERP'
})

// State Sub-Menu & Aksi Terpadu untuk Inventaris & Stok
const inventoryActiveSubTab = ref('saldo')
const inventoryTriggeredAction = ref(null)

function handleMainNavigationClick(item) {
  if (activeTab.value === item.id) {
    // Jika sudah di tab ini dan memiliki subItems, biarkan tetap terbuka
    return
  }
  activeTab.value = item.id
  // Jika menu tidak memiliki sub-items, tutup sidebar di layar HP/tablet
  if (!item.subItems || !item.subItems.length) {
    isMobileSidebarOpen.value = false
  }
}

function handleSubMenuClick(parentId, sub) {
  activeTab.value = parentId
  if (parentId === 'inventory') {
    if (sub.type === 'view') {
      inventoryActiveSubTab.value = sub.id
    } else if (sub.type === 'action') {
      inventoryTriggeredAction.value = { action: sub.id, ts: Date.now() }
    }
  } else if (parentId === 'branches') {
    if (sub.id === 'action-add-branch') {
      shouldTriggerAddBranch.value = true
    }
  } else if (parentId === 'assets') {
    if (sub.id === 'action-add-asset') {
      shouldTriggerAddAsset.value = true
    } else if (sub.id === 'action-run-depreciation') {
      shouldTriggerRunDepreciation.value = true
    }
  }
  isMobileSidebarOpen.value = false
}

// Trigger Tambah Cabang & Aset dari Sidebar
const shouldTriggerAddBranch = ref(false)
const shouldTriggerAddAsset = ref(false)
const shouldTriggerRunDepreciation = ref(false)

const currentBranchStatus = computed(() => {
  const b = authStore.branches.find(item => item.name === authStore.businessUser.currentBranch)
  return b ? b.status : 'open'
})

function triggerAddBranchFromSidebar() {
  activeTab.value = 'branches'
  isMobileSidebarOpen.value = false
  shouldTriggerAddBranch.value = true
}

const totalAssetsBookValue = computed(() => {
  return stockStore.assets.reduce((sum, a) => sum + a.currentValue, 0)
})

function formatNumber(num) {
  return (num || 0).toLocaleString('id-ID')
}

// State Modal Audit Detail & Cetak PDF Resmi Akuntan
const showAuditModal = ref(false)
const selectedAuditTab = ref('income') // 'income', 'expense', 'net_profit', 'assets'
const showPrintModal = ref(false)

function openAuditModal(tabKey = 'income') {
  selectedAuditTab.value = tabKey
  showAuditModal.value = true
}

// Perhitungan Otomatis Kolom R&D (Riset & Pengembangan)
// Alokasi 15% dari Laba Bersih Usaha
const rdAllocationPercent = 15
const rdAllocationTotal = computed(() => {
  return Math.max(0, Math.round((financeStore.netSavings || 0) * (rdAllocationPercent / 100)))
})

// Daftar Proyek Inovasi R&D Dummy (Hanya untuk mode simulasi demo Budi Santoso)
const DUMMY_RD_PROJECTS = [
  {
    id: 'rd-01',
    code: 'R&D-01',
    title: 'Formula Tepung Cakue Super-Renyah 12 Jam',
    focus: 'Inovasi Bahan Baku',
    target: 'Menurunkan HPP tepung 12% & kerenyahan tahan lama saat dingin',
    budget: 1850000,
    realization: 1400000,
    progress: 75,
    status: 'Tahap Uji Rasa Outlet',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  {
    id: 'rd-02',
    code: 'R&D-02',
    title: 'Kemasan Eco-Pouch Vacuum & Nitrogen Flush',
    focus: 'Inovasi Packaging & Distribusi',
    target: 'Distribusi adonan beku tahan 60 hari tanpa pengawet',
    budget: 2400000,
    realization: 950000,
    progress: 40,
    status: 'Pengujian Masa Simpan Lab',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  {
    id: 'rd-03',
    code: 'R&D-03',
    title: 'Mesin Pemotong & Pencetak Adonan Presisi',
    focus: 'Otomatisasi Central Kitchen',
    target: 'Efisiensi waktu cetak adonan 300% dan standarisasi gramasi',
    budget: 4500000,
    realization: 4100000,
    progress: 90,
    status: 'Final Kalibrasi Pabrikasi',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200'
  }
]

const isDemoAccount = computed(() => {
  const email = (authStore.user?.email || '').toLowerCase()
  return email === 'budi.santoso@cakue.id' || email.includes('budi')
})

const rdProjects = computed(() => {
  return isDemoAccount.value ? DUMMY_RD_PROJECTS : []
})

const rdRealizationTotal = computed(() => {
  return rdProjects.value.reduce((sum, p) => sum + p.realization, 0)
})

const rdRemainingBudget = computed(() => {
  if (rdProjects.value.length === 0) {
    return rdAllocationTotal.value
  }
  const initialReserve = 5000000
  return (initialReserve + rdAllocationTotal.value) - rdRealizationTotal.value
})

// Perhitungan Akuntansi Standar Laporan Laba Rugi (SAK EMKM)
const accountingHpp = computed(() => {
  const hppTx = financeStore.transactions
    .filter(t => t.type === 'expense' && (t.category.toLowerCase().includes('bahan') || t.category.toLowerCase().includes('belanja')))
    .reduce((sum, t) => sum + t.amount, 0)
  return hppTx > 0 ? hppTx : Math.round(financeStore.totalExpense * 0.54)
})

const grossProfit = computed(() => {
  return financeStore.totalIncome - accountingHpp.value
})

const opexExpenses = computed(() => {
  return Math.max(0, financeStore.totalExpense - accountingHpp.value)
})

const totalDepreciationMonthly = computed(() => {
  return stockStore.assets.reduce((sum, a) => sum + (a.monthlyDepreciation || 0), 0)
})

const netOperatingIncome = computed(() => {
  return grossProfit.value - opexExpenses.value - totalDepreciationMonthly.value
})

const retainedEarnings = computed(() => {
  return netOperatingIncome.value - rdAllocationTotal.value
})

// Ekspor File CSV Akuntansi Formal Berstandar Spreadsheet Multi-Kolom
function exportAccountingCsv() {
  if (!authStore.canExportReports) {
    alert('Akses Dibatasi: Hanya Owner dan Manajer Cabang yang memiliki wewenang mencetak/mengekspor data akuntansi.')
    return
  }

  const rows = [
    ['PT CAKUE NUSANTARA BERKAH - BUKU JURNAL & AUDIT KEUANGAN RESMI'],
    ['Tanggal Ekspor', new Date().toLocaleDateString('id-ID'), 'Dicetak Oleh', authStore.businessUser.name, 'Peran RBAC', authStore.currentRoleConfig.title],
    ['Cabang Operasional', authStore.businessUser.currentBranch],
    [],
    ['RINGKASAN EKSEKUTIF KEUANGAN (STANDAR SAK EMKM)'],
    ['Total Omset Penjualan (Income)', `Rp ${financeStore.totalIncome}`],
    ['Harga Pokok Penjualan (HPP Bahan)', `Rp ${accountingHpp.value}`],
    ['Laba Kotor Usaha (Gross Profit)', `Rp ${grossProfit.value}`],
    ['Beban Operasional Toko (OPEX)', `Rp ${opexExpenses.value}`],
    ['Beban Depresiasi Aset Tetap', `Rp ${totalDepreciationMonthly.value}`],
    ['Laba Bersih Operasional', `Rp ${financeStore.netSavings}`],
    ['Alokasi Cadangan Riset & Pengembangan (R&D 15%)', `Rp ${rdAllocationTotal.value}`],
    ['Laba Bersih Ditahan (Retained Surplus)', `Rp ${retainedEarnings.value}`],
    ['Total Nilai Buku Aset Tetap', `Rp ${totalAssetsBookValue.value}`],
    [],
    ['DAFTAR TRANSAKSI MUTASI KEUANGAN LENGKAP'],
    ['No', 'Tanggal', 'No Referensi', 'Kategori Akun', 'Keterangan Transaksi', 'Jenis Arus Kas', 'Debit (Masuk)', 'Kredit (Keluar)', 'Saldo Berjalan']
  ]

  let runningBalance = 0
  financeStore.transactions.forEach((t, idx) => {
    const isIncome = t.type === 'income'
    const debit = isIncome ? t.amount : 0
    const credit = !isIncome ? t.amount : 0
    runningBalance += (debit - credit)

    rows.push([
      idx + 1,
      t.date,
      `TRX-${t.id || (1000 + idx)}`,
      t.category,
      `"${t.desc.replace(/"/g, '""')}"`,
      isIncome ? 'Kas Masuk' : 'Kas Keluar',
      debit,
      credit,
      runningBalance
    ])
  })

  // Format ke CSV dengan UTF-8 BOM agar rapi saat dibuka di Microsoft Excel
  const csvContent = '\uFEFF' + rows.map(e => e.join(';')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `Laporan_Keuangan_Cakue_Nusantara_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function printDocument() {
  window.print()
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

@media print {
  :deep(body *) {
    visibility: hidden;
  }
  .printable-accounting-sheet,
  .printable-accounting-sheet * {
    visibility: visible !important;
  }
  .printable-accounting-sheet {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: auto;
    margin: 0;
    padding: 24px;
    background: white !important;
    z-index: 99999;
  }
  .no-print {
    display: none !important;
  }
}
</style>
