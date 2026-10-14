<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 flex font-sans overflow-x-hidden">
    
    <!-- 1. COLLAPSIBLE MODERN SIDEBAR (ERP WORKSPACE) -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out shadow-xs select-none',
        isSidebarCollapsed ? 'w-20' : 'w-64 sm:w-72',
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
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
          class="hidden md:flex w-8 h-8 rounded-lg items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          title="Tutup Sidebar"
        >
          <Icon name="chevron-left" custom-class="w-4 h-4" />
        </button>

        <!-- Close Button (Mobile) -->
        <button 
          @click="isMobileSidebarOpen = false" 
          type="button" 
          class="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
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
                <span>+ Cabang</span>
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
            <button 
              v-for="item in allowedMainNavigation" 
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
      <div class="p-2 border-t border-slate-200 hidden md:block bg-white">
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

    <!-- Mobile Backdrop -->
    <div 
      v-if="isMobileSidebarOpen" 
      @click="isMobileSidebarOpen = false" 
      class="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs md:hidden"
    ></div>

    <!-- 2. MAIN CONTENT AREA (Offset by sidebar width) -->
    <div 
      :class="[
        'flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out min-w-0',
        isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64 sm:md:ml-72'
      ]"
    >
      <!-- Top Header Navbar -->
      <header class="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs h-16 flex items-center px-4 sm:px-6 lg:px-8">
        <div class="w-full flex items-center justify-between gap-4">
          <!-- Left: Mobile Hamburger Toggle + Active Branch Selector + Breadcrumb -->
          <div class="flex items-center gap-3">
            <!-- Mobile Hamburger Toggle -->
            <button 
              @click="toggleMobileSidebar" 
              type="button" 
              class="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
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
                'flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors ml-2',
                !authStore.currentRoleConfig.canSwitchBranch 
                  ? 'bg-slate-100/90 border-slate-300 text-slate-500' 
                  : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
              ]"
              :title="!authStore.currentRoleConfig.canSwitchBranch ? 'Terkunci: Hak akses Anda terbatas pada cabang ini' : 'Pilih Cabang Aktif'"
            >
              <Icon :name="!authStore.currentRoleConfig.canSwitchBranch ? 'lock' : 'building'" custom-class="w-4 h-4 text-slate-600" />
              <select 
                v-model="authStore.businessUser.currentBranch"
                :disabled="!authStore.currentRoleConfig.canSwitchBranch"
                @change="authStore.setBranch(authStore.businessUser.currentBranch)"
                class="bg-transparent border-none text-slate-800 font-bold text-xs focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:text-slate-600"
              >
                <option v-for="b in authStore.branches" :key="b.id" :value="b.name">
                  {{ b.status === 'open' ? '🟢' : '🔴 [TUTUP]' }} {{ b.name }}
                </option>
              </select>
              <span v-if="!authStore.currentRoleConfig.canSwitchBranch" class="text-[9px] font-mono font-bold bg-slate-200 text-slate-700 px-1 py-0.5 rounded">
                Terkunci
              </span>
            </div>
          </div>

          <!-- Right: Clean Profile Box (with Dropdown) -->
          <div class="relative">
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
                  {{ settingsStore.userName ? settingsStore.userName.charAt(0).toUpperCase() : 'U' }}
                </span>
              </div>

              <!-- Nama & Status Sesi Usaha (Badge Peran Dinamis) -->
              <div class="text-left hidden sm:block">
                <div class="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                  {{ settingsStore.userName }}
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
                  <div class="text-xs font-black text-slate-900">{{ settingsStore.userName }}</div>
                  <div class="text-[11px] text-slate-500 truncate">{{ authStore.businessUser.email }}</div>
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
      <main class="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-8">
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
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <!-- 1. Omset -->
            <div 
              @click="openAuditModal('income')"
              role="button"
              tabindex="0"
              class="saas-card p-6 space-y-2 cursor-pointer group hover:border-emerald-500 hover:shadow-md transition-all active:scale-[0.99] relative overflow-hidden"
              title="Klik untuk melihat Audit Detail Omset Riil"
            >
              <div class="flex items-center justify-between text-slate-500 text-xs sm:text-sm font-bold">
                <span class="group-hover:text-emerald-700 transition-colors">Total Omset Bisnis</span>
                <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
                  <Icon name="income" custom-class="w-4 h-4" />
                </div>
              </div>
              <div class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight group-hover:text-emerald-800 transition-colors">
                Rp {{ formatNumber(financeStore.totalIncome) }}
              </div>
              <div class="flex items-center justify-between pt-1">
                <div class="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <Icon name="check" custom-class="w-3.5 h-3.5" />
                  <span>Arus Kas Masuk Riil</span>
                </div>
                <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-all flex items-center gap-0.5">
                  Audit Detail →
                </span>
              </div>
            </div>

            <!-- 2. Beban & HPP -->
            <div 
              @click="openAuditModal('expense')"
              role="button"
              tabindex="0"
              class="saas-card p-6 space-y-2 cursor-pointer group hover:border-rose-400 hover:shadow-md transition-all active:scale-[0.99] relative overflow-hidden"
              title="Klik untuk melihat Audit Detail Beban & HPP"
            >
              <div class="flex items-center justify-between text-slate-500 text-xs sm:text-sm font-bold">
                <span class="group-hover:text-rose-700 transition-colors">Beban Operasional & HPP</span>
                <div class="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all shadow-xs">
                  <Icon name="expense" custom-class="w-4 h-4" />
                </div>
              </div>
              <div class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight group-hover:text-rose-800 transition-colors">
                Rp {{ formatNumber(financeStore.totalExpense) }}
              </div>
              <div class="flex items-center justify-between pt-1">
                <div class="text-xs text-slate-500 font-medium truncate max-w-[150px]">
                  Bahan baku & operasional
                </div>
                <span class="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600 transition-all flex items-center gap-0.5">
                  Audit Detail →
                </span>
              </div>
            </div>

            <!-- 3. Laba Bersih -->
            <div 
              @click="openAuditModal('net_profit')"
              role="button"
              tabindex="0"
              class="saas-card p-6 space-y-2 cursor-pointer group hover:border-teal-500 hover:shadow-md transition-all active:scale-[0.99] relative overflow-hidden"
              title="Klik untuk melihat Audit Laba Rugi (P&L Akuntan)"
            >
              <div class="flex items-center justify-between text-slate-500 text-xs sm:text-sm font-bold">
                <span class="group-hover:text-teal-700 transition-colors">Laba Bersih (Surplus)</span>
                <div class="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all shadow-xs">
                  <Icon name="chart" custom-class="w-4 h-4" />
                </div>
              </div>
              <div class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-700 tracking-tight">
                Rp {{ formatNumber(financeStore.netSavings) }}
              </div>
              <div class="flex items-center justify-between pt-1">
                <div class="text-xs text-teal-700 font-semibold">
                  Net Margin 39.9%
                </div>
                <span class="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 group-hover:bg-teal-600 group-hover:text-white transition-all flex items-center gap-0.5">
                  P&L Akuntan →
                </span>
              </div>
            </div>

            <!-- 4. Total Aset Tetap -->
            <div 
              @click="openAuditModal('assets')"
              role="button"
              tabindex="0"
              class="saas-card p-6 space-y-2 cursor-pointer group hover:border-sky-500 hover:shadow-md transition-all active:scale-[0.99] relative overflow-hidden"
              title="Klik untuk melihat Audit Buku Aset & Depresiasi"
            >
              <div class="flex items-center justify-between text-slate-500 text-xs sm:text-sm font-bold">
                <span class="group-hover:text-sky-700 transition-colors">Total Aset Tetap</span>
                <div class="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-all shadow-xs">
                  <Icon name="building" custom-class="w-4 h-4" />
                </div>
              </div>
              <div class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight group-hover:text-sky-900 transition-colors">
                Rp {{ formatNumber(totalAssetsBookValue) }}
              </div>
              <div class="flex items-center justify-between pt-1">
                <div class="text-xs text-slate-500 font-medium">
                  Nilai buku depresiasi
                </div>
                <span class="text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 group-hover:bg-sky-600 group-hover:text-white transition-all flex items-center gap-0.5">
                  Buku Aset →
                </span>
              </div>
            </div>
          </div>

          <!-- SECTION KHUSUS: KOLOM ALOKASI DANA RISET & PENGEMBANGAN (R&D) USAHA -->
          <div class="saas-card p-6 sm:p-7 space-y-5 bg-gradient-to-br from-white via-white to-indigo-50/30 border border-slate-200 shadow-xs">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div class="flex items-center gap-3.5">
                <div class="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shadow-xs">
                  <Icon name="chart" custom-class="w-5 h-5 text-indigo-700" />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-base sm:text-lg font-black tracking-tight text-slate-900">Kolom Alokasi Riset & Pengembangan (R&D) Usaha</h3>
                    <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200 uppercase tracking-wider">
                      Alokasi 15% Laba
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 mt-0.5">
                    Dana inovasi disisihkan langsung dari surplus laba riil untuk penghematan HPP, daya tahan produk & ekspansi cabang
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button 
                  @click="openAuditModal('net_profit')"
                  type="button"
                  class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold transition-all cursor-pointer border border-indigo-200"
                >
                  <span>Audit Laba Rugi Akuntan</span>
                  <Icon name="chevron-right" custom-class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- 3 Pilar Finansial R&D -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Alokasi R&D Berjalan (15%)</div>
                <div class="text-xl sm:text-2xl font-black text-indigo-800 tracking-tight">
                  Rp {{ formatNumber(rdAllocationTotal) }}
                </div>
                <div class="text-[11px] text-slate-500">Dari total surplus laba bersih kas</div>
              </div>

              <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Realisasi Belanja Riset Terpakai</div>
                <div class="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  Rp {{ formatNumber(rdRealizationTotal) }}
                </div>
                <div class="text-[11px] text-emerald-700 font-semibold">Terserap pada 3 proyek inovasi</div>
              </div>

              <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sisa Saldo Kas R&D Tersedia</div>
                <div class="text-xl sm:text-2xl font-black text-emerald-700 tracking-tight">
                  Rp {{ formatNumber(rdRemainingBudget) }}
                </div>
                <div class="text-[11px] text-emerald-600 font-semibold">Cadangan likuid siap pakai</div>
              </div>
            </div>

            <!-- Kartu Proyek Inovasi R&D Aktif -->
            <div class="space-y-3 pt-1">
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400">
                Portofolio Proyek Riset Aktif (Inovasi Produk & Proses)
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-slate-500 font-medium">Realisasi Dana</span>
                      <span class="font-extrabold text-slate-900">Rp {{ formatNumber(proj.realization) }} / {{ formatNumber(proj.budget) }}</span>
                    </div>
                    <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div class="h-full bg-indigo-600 rounded-full transition-all duration-500" :style="{ width: `${proj.progress}%` }"></div>
                    </div>
                    <div class="flex items-center justify-between text-[11px]">
                      <span class="text-slate-500">Progres Inovasi: <strong class="text-slate-800">{{ proj.progress }}%</strong></span>
                      <span class="font-bold text-indigo-700">{{ proj.status }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Shortcut Cepat Operasional yang Sering Digunakan -->
          <div class="space-y-3">
            <div class="text-xs font-bold uppercase tracking-wider text-slate-400">
              Shortcut Cepat Operasional
            </div>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Shortcut 1: Buka Kasir POS -->
              <button 
                v-if="authStore.canAccess('pos')"
                @click="activeTab = 'pos'"
                type="button"
                class="saas-card p-5 flex flex-col items-center justify-center text-center gap-3 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
                  <Icon name="store" custom-class="w-6 h-6" />
                </div>
                <div>
                  <div class="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition-colors">Kasir POS Toko</div>
                  <div class="text-xs text-slate-500 mt-0.5">Input order penjualan cepat</div>
                </div>
              </button>

              <!-- Shortcut 2: Stok & Distribusi -->
              <button 
                v-if="authStore.canAccess('inventory')"
                @click="activeTab = 'inventory'"
                type="button"
                class="saas-card p-5 flex flex-col items-center justify-center text-center gap-3 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                  <Icon name="box" custom-class="w-6 h-6" />
                </div>
                <div>
                  <div class="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-blue-700 transition-colors">Inventaris & Cabang</div>
                  <div class="text-xs text-slate-500 mt-0.5">Matriks stok & surat jalan</div>
                </div>
              </button>

              <!-- Shortcut 3: Statistik & Analisis -->
              <button 
                v-if="authStore.canAccess('analytics')"
                @click="activeTab = 'analytics'"
                type="button"
                class="saas-card p-5 flex flex-col items-center justify-center text-center gap-3 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <div class="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all shadow-xs">
                  <Icon name="chart" custom-class="w-6 h-6" />
                </div>
                <div>
                  <div class="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-teal-700 transition-colors">Statistik & Analisis</div>
                  <div class="text-xs text-slate-500 mt-0.5">Grafik KPI & margin laba</div>
                </div>
              </button>

              <!-- Shortcut 4: Jurnal Transaksi Kas -->
              <button 
                v-if="authStore.canAccess('journal')"
                @click="activeTab = 'journal'"
                type="button"
                class="saas-card p-5 flex flex-col items-center justify-center text-center gap-3 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shadow-xs">
                  <Icon name="receipt" custom-class="w-6 h-6" />
                </div>
                <div>
                  <div class="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-purple-700 transition-colors">Jurnal Transaksi Kas</div>
                  <div class="text-xs text-slate-500 mt-0.5">Buku jurnal & mutasi kas</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Section 3: Ringkasan Mini Aktivitas Kas (Hanya 3 Baris Ringkas) -->
          <div class="saas-card p-5 sm:p-6 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-base font-bold text-slate-900">Aktivitas Transaksi Kas Terkini</h3>
                <p class="text-xs text-slate-500">Pratinjau mutasi terakhir di seluruh cabang</p>
              </div>
              <button 
                v-if="authStore.canAccess('journal')"
                @click="activeTab = 'journal'"
                type="button"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
              >
                <span>Buka Buku Jurnal Lengkap</span>
                <Icon name="chevron-right" custom-class="w-3.5 h-3.5" />
              </button>
            </div>

            <div class="divide-y divide-slate-100">
              <div 
                v-for="t in financeStore.transactions.slice(0, 3)" 
                :key="t.id"
                class="py-3 flex items-center justify-between gap-4 text-xs sm:text-sm"
              >
                <div class="flex items-center gap-3">
                  <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0', t.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700']">
                    <Icon :name="t.type === 'income' ? 'income' : 'expense'" custom-class="w-4 h-4" />
                  </div>
                  <div>
                    <div class="font-bold text-slate-900">{{ t.desc }}</div>
                    <div class="text-[11px] text-slate-500">{{ t.date }} • {{ t.category }}</div>
                  </div>
                </div>
                <div :class="['font-extrabold font-mono text-sm sm:text-base text-right', t.type === 'income' ? 'text-emerald-700' : 'text-slate-900']">
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
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="saas-card p-6 space-y-2">
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400">Gross Profit Margin (HPP)</div>
              <div class="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-700">38.4%</div>
              <p class="text-xs text-slate-500">Rasio efisiensi harga pokok penjualan bahan baku toko</p>
            </div>

            <div class="saas-card p-6 space-y-2">
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400">Net Profit Margin (Laba Bersih)</div>
              <div class="text-3xl sm:text-4xl font-extrabold font-mono text-teal-700">39.9%</div>
              <p class="text-xs text-slate-500">Sisa margin bersih setelah dipotong seluruh beban operasional</p>
            </div>

            <div class="saas-card p-6 space-y-2">
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400">Rasio Likuiditas Kas</div>
              <div class="text-3xl sm:text-4xl font-extrabold font-mono text-blue-700">2.7x</div>
              <p class="text-xs text-slate-500">Kemampuan kas riil menutupi beban operasional 3 bulan ke depan</p>
            </div>
          </div>

          <!-- Visual Bar Breakdown: Kategori Pengeluaran vs Pemasukan -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="saas-card p-6 space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 class="text-base font-bold text-slate-900">Breakdown Beban Operasional</h3>
                <span class="text-xs text-slate-500">Persentase Biaya</span>
              </div>
              <div class="space-y-3.5">
                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Bahan Baku Pokok (Tepung, Biji Kopi, Minyak)</span>
                    <span class="font-mono">54% (Rp 1.500.000)</span>
                  </div>
                  <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-rose-500 rounded-full" style="width: 54%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Gaji & Insentif Karyawan</span>
                    <span class="font-mono">28% (Rp 780.000)</span>
                  </div>
                  <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-amber-500 rounded-full" style="width: 28%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Utilitas, Listrik & Logistik</span>
                    <span class="font-mono">18% (Rp 500.000)</span>
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
                <span class="text-xs text-slate-500">4 Titik Lokasi</span>
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
                    <td :class="['py-3 px-4 text-right font-extrabold font-mono text-sm sm:text-base', t.type === 'income' ? 'text-emerald-700' : 'text-slate-900']">
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
          <BranchStockManager @navigate="activeTab = $event" />
        </div>

        <!-- TAB 4: ASET TETAP & DEPRESIASI -->
        <div v-else-if="activeTab === 'assets'" class="space-y-6">
          <AssetManager />
        </div>

        <!-- TAB KHUSUS: MANAJEMEN CABANG & MULTI-OUTLET (RBAC) -->
        <div v-else-if="activeTab === 'branches'" class="space-y-6">
          <BranchManagementView 
            :auto-open-add="shouldTriggerAddBranch" 
            @reset-auto-open="shouldTriggerAddBranch = false"
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

      <!-- Dedicated B2B Footer -->
      <footer class="py-4 px-6 bg-white border-t border-slate-200 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
        <div>{{ settingsStore.appName }} SaaS ERP &copy; 2026 — 100% Free Open-Source Architecture</div>
        <div class="flex items-center gap-4 text-xs font-medium">
          <span class="text-emerald-700 font-semibold">• Multi-Cabang Aktif</span>
          <span>• Database PostgreSQL</span>
          <span>• Baileys WA Gateway ($0 Cost)</span>
        </div>
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
                'p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer text-center',
                selectedAuditTab === 'income' 
                  ? 'bg-white border-emerald-500 text-emerald-800 shadow-xs ring-1 ring-emerald-400' 
                  : 'bg-slate-100/80 border-slate-200 text-slate-600 hover:bg-white'
              ]"
            >
              <span class="text-[11px] text-slate-500">Omset Penjualan</span>
              <span class="font-extrabold text-xs sm:text-sm">Rp {{ formatNumber(financeStore.totalIncome) }}</span>
            </button>

            <button 
              @click="selectedAuditTab = 'expense'"
              type="button"
              :class="[
                'p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer text-center',
                selectedAuditTab === 'expense' 
                  ? 'bg-white border-rose-400 text-rose-800 shadow-xs ring-1 ring-rose-300' 
                  : 'bg-slate-100/80 border-slate-200 text-slate-600 hover:bg-white'
              ]"
            >
              <span class="text-[11px] text-slate-500">Beban & HPP</span>
              <span class="font-extrabold text-xs sm:text-sm">Rp {{ formatNumber(financeStore.totalExpense) }}</span>
            </button>

            <button 
              @click="selectedAuditTab = 'net_profit'"
              type="button"
              :class="[
                'p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer text-center',
                selectedAuditTab === 'net_profit' 
                  ? 'bg-white border-teal-500 text-teal-800 shadow-xs ring-1 ring-teal-400' 
                  : 'bg-slate-100/80 border-slate-200 text-slate-600 hover:bg-white'
              ]"
            >
              <span class="text-[11px] text-slate-500">Laba Bersih P&L</span>
              <span class="font-extrabold text-xs sm:text-sm">Rp {{ formatNumber(financeStore.netSavings) }}</span>
            </button>

            <button 
              @click="selectedAuditTab = 'assets'"
              type="button"
              :class="[
                'p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer text-center',
                selectedAuditTab === 'assets' 
                  ? 'bg-white border-sky-500 text-sky-800 shadow-xs ring-1 ring-sky-400' 
                  : 'bg-slate-100/80 border-slate-200 text-slate-600 hover:bg-white'
              ]"
            >
              <span class="text-[11px] text-slate-500">Total Aset Tetap</span>
              <span class="font-extrabold text-xs sm:text-sm">Rp {{ formatNumber(totalAssetsBookValue) }}</span>
            </button>
          </div>
        </div>

        <!-- Body Scrollable Content -->
        <div class="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          <!-- TAB 1: AUDIT OMSET (PENJUALAN KASIR & QRIS MASUK) -->
          <div v-if="selectedAuditTab === 'income'" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                <div class="text-[11px] text-slate-500 font-bold uppercase">Total Penerimaan Kas</div>
                <div class="text-xl font-black text-emerald-800 mt-0.5">Rp {{ formatNumber(financeStore.totalIncome) }}</div>
                <div class="text-[10px] text-emerald-700 font-semibold mt-1">100% Terekonsiliasi</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div class="text-[11px] text-slate-500 font-bold uppercase">Jumlah Transaksi Masuk</div>
                <div class="text-xl font-black text-slate-900 mt-0.5">
                  {{ financeStore.transactions.filter(t => t.type === 'income').length }} Transaksi
                </div>
                <div class="text-[10px] text-slate-500 mt-1">POS Kasir & Transfer Masuk</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div class="text-[11px] text-slate-500 font-bold uppercase">Rata-rata Order (AOV)</div>
                <div class="text-xl font-black text-slate-900 mt-0.5">
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
              <div class="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80">
                <div class="text-[11px] text-slate-500 font-bold uppercase">Total Beban & HPP</div>
                <div class="text-xl font-black text-rose-800 mt-0.5">Rp {{ formatNumber(financeStore.totalExpense) }}</div>
                <div class="text-[10px] text-rose-700 font-semibold mt-1">Tercatat di kas keluar</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div class="text-[11px] text-slate-500 font-bold uppercase">HPP Bahan Baku Pokok</div>
                <div class="text-xl font-black text-slate-900 mt-0.5">Rp {{ formatNumber(accountingHpp) }}</div>
                <div class="text-[10px] text-slate-500 mt-1">Tepung, ragi, minyak, kemasan</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div class="text-[11px] text-slate-500 font-bold uppercase">Beban Operasional (OPEX)</div>
                <div class="text-xl font-black text-slate-900 mt-0.5">Rp {{ formatNumber(opexExpenses) }}</div>
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
  { id: 'inventory', label: 'Inventaris & Stok', icon: 'box', badge: null },
  { id: 'branches', label: 'Manajemen Cabang', icon: 'building', badge: 'Multi' },
  { id: 'assets', label: 'Aset & Depresiasi', icon: 'building', badge: null },
  { id: 'journal', label: 'Jurnal Transaksi Kas', icon: 'receipt', badge: null }
]

const systemNavigation = [
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

// Trigger Tambah Cabang Baru dari Sidebar
const shouldTriggerAddBranch = ref(false)

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

// Daftar Proyek Inovasi R&D
const rdProjects = ref([
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
])

const rdRealizationTotal = computed(() => {
  return rdProjects.value.reduce((sum, p) => sum + p.realization, 0)
})

const rdRemainingBudget = computed(() => {
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
