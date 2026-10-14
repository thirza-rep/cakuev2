<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      <!-- Left: Logo & Role Mode Selector -->
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center font-black text-sm text-white shadow-sm">
            CK
          </div>
          <div>
            <div class="font-extrabold text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>CAKUE</span>
              <span class="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded font-semibold">
                {{ authStore.appMode === 'personal' ? 'Personal Banking' : 'SaaS / UMKM' }}
              </span>
            </div>
            <div class="text-[10px] text-slate-500 font-medium">Catatan Keuangan Gue</div>
          </div>
        </div>

        <!-- Mode Switcher (Perorangan vs Usaha UMKM) -->
        <div class="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200">
          <button 
            @click="authStore.setAppMode('personal')"
            :class="['px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all', authStore.appMode === 'personal' ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900']"
          >
            <Icon name="wallet" custom-class="w-3.5 h-3.5" />
            <span>Pribadi (Perorangan)</span>
          </button>

          <button 
            @click="authStore.setAppMode('business')"
            :class="['px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all', authStore.appMode === 'business' ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900']"
          >
            <Icon name="store" custom-class="w-3.5 h-3.5" />
            <span>Usaha / UMKM (SaaS)</span>
          </button>
        </div>
      </div>

      <!-- Right: AI Copilot & User Profile -->
      <div class="flex items-center gap-3">
        <!-- AI Copilot Button -->
        <button 
          @click="$emit('toggle-ai')"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Icon name="sparkles" custom-class="w-4 h-4 text-emerald-600" />
          <span class="hidden sm:inline">AI Analis</span>
        </button>

        <!-- User Profile Dropdown / Info -->
        <div class="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-300">
            {{ authStore.user.name.charAt(0) }}
          </div>
          <div class="hidden md:block text-left text-xs leading-tight">
            <div class="font-bold text-slate-900">{{ authStore.user.name }}</div>
            <div class="text-[10px] text-slate-500 capitalize">{{ authStore.appMode === 'personal' ? 'Nasabah Personal' : 'Owner Usaha' }}</div>
          </div>
          <button 
            @click="authStore.logout()" 
            title="Keluar"
            class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors ml-1"
          >
            <Icon name="logout" custom-class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Segmented Bar (Di bawah navbar khusus di HP) -->
    <div class="sm:hidden px-4 py-2 bg-slate-50 border-t border-slate-200 flex">
      <div class="grid grid-cols-2 gap-1 w-full bg-slate-200 p-0.5 rounded-lg text-xs">
        <button 
          @click="authStore.setAppMode('personal')"
          :class="['py-1.5 rounded-md font-semibold text-center transition-all', authStore.appMode === 'personal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600']"
        >
          Pribadi (Keuangan)
        </button>
        <button 
          @click="authStore.setAppMode('business')"
          :class="['py-1.5 rounded-md font-semibold text-center transition-all', authStore.appMode === 'business' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600']"
        >
          Usaha (SaaS/POS)
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore'
import Icon from '../common/Icon.vue'

defineEmits(['toggle-ai'])
const authStore = useAuthStore()
</script>
