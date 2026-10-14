<template>
  <div class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around select-none">
    <!-- Nav Items for Personal Mode -->
    <template v-if="authStore.appMode === 'personal'">
      <button 
        @click="activeTab = 'home'"
        :class="['flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors', activeTab === 'home' ? 'text-emerald-700' : 'text-slate-500']"
      >
        <Icon name="wallet" custom-class="w-5 h-5" />
        <span>Dompet</span>
      </button>

      <button 
        @click="activeTab = 'transactions'"
        :class="['flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors', activeTab === 'transactions' ? 'text-emerald-700' : 'text-slate-500']"
      >
        <Icon name="income" custom-class="w-5 h-5" />
        <span>Transaksi</span>
      </button>

      <button 
        @click="activeTab = 'debts'"
        :class="['flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors', activeTab === 'debts' ? 'text-emerald-700' : 'text-slate-500']"
      >
        <Icon name="debt" custom-class="w-5 h-5" />
        <span>Utang</span>
      </button>

      <button 
        @click="authStore.setAppMode('business')"
        class="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold text-slate-500 hover:text-slate-900"
      >
        <Icon name="store" custom-class="w-5 h-5" />
        <span>Mode Usaha</span>
      </button>
    </template>

    <!-- Nav Items for Business Mode -->
    <template v-else>
      <button 
        @click="authStore.activeSaaSTab = 'dashboard'"
        :class="['flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors', authStore.activeSaaSTab === 'dashboard' ? 'text-emerald-700' : 'text-slate-500']"
      >
        <Icon name="chart" custom-class="w-5 h-5" />
        <span>Ringkasan</span>
      </button>

      <button 
        @click="authStore.activeSaaSTab = 'pos'"
        :class="['flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors', authStore.activeSaaSTab === 'pos' ? 'text-emerald-700' : 'text-slate-500']"
      >
        <Icon name="store" custom-class="w-5 h-5" />
        <span>Kasir</span>
      </button>

      <button 
        @click="authStore.activeSaaSTab = 'inventory'"
        :class="['flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors', authStore.activeSaaSTab === 'inventory' ? 'text-emerald-700' : 'text-slate-500']"
      >
        <Icon name="box" custom-class="w-5 h-5" />
        <span>Stok</span>
      </button>

      <button 
        @click="authStore.setAppMode('personal')"
        class="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold text-slate-500 hover:text-slate-900"
      >
        <Icon name="wallet" custom-class="w-5 h-5" />
        <span>Pribadi</span>
      </button>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import Icon from '../common/Icon.vue'

const authStore = useAuthStore()
const activeTab = ref('home')
</script>
