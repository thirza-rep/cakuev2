<template>
  <header class="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md select-none">
    <div class="px-4 py-2.5 flex items-center justify-between gap-4">
      <!-- Left: Logo & Subsystem Switcher -->
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center font-black text-sm text-emerald-400 shadow-inner">
            CK
          </div>
          <div>
            <div class="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
              <span>CAKUE</span>
              <span class="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">v1.0</span>
            </div>
            <div class="text-[10px] text-slate-400 font-mono -mt-0.5">Catatan Keuangan Gue</div>
          </div>
        </div>

        <!-- 3 Pilar Modul Tabs -->
        <nav class="hidden md:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
          <button 
            @click="authStore.setModule('cakue-ku')"
            :class="['px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5', authStore.currentModule === 'cakue-ku' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white']"
          >
            <span>💳</span>
            <span>Cakue Ku</span>
          </button>

          <button 
            @click="authStore.setModule('cakue-pos')"
            :class="['px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5', authStore.currentModule === 'cakue-pos' ? 'bg-teal-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white']"
          >
            <span>🛒</span>
            <span>CAKUE Pos</span>
          </button>

          <button 
            @click="authStore.setModule('cakue-manage')"
            :class="['px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5', authStore.currentModule === 'cakue-manage' ? 'bg-sky-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white']"
          >
            <span>🏢</span>
            <span>Cakue Manage</span>
          </button>
        </nav>
      </div>

      <!-- Right: Branch Selector, AI Advisor, User -->
      <div class="flex items-center gap-3">
        <!-- Branch Selector (Hanya muncul jika di modul bisnis/pos) -->
        <div v-if="authStore.currentModule !== 'cakue-ku'" class="relative hidden sm:block">
          <select 
            v-model="authStore.user.currentBranch"
            class="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option v-for="b in authStore.branches" :key="b.id" :value="b.name">
              {{ b.status === 'open' ? '🟢' : '🔴 [TUTUP]' }} {{ b.name }}
            </option>
          </select>
        </div>

        <!-- AI Advisor Drawer Trigger -->
        <button 
          @click="$emit('toggle-ai')"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-950/60 to-teal-950/60 hover:from-emerald-900/60 hover:to-teal-900/60 border border-emerald-500/40 rounded-lg text-xs font-semibold text-emerald-400 shadow-sm transition-all"
        >
          <span class="animate-pulse">✨</span>
          <span class="hidden sm:inline">AI Copilot</span>
        </button>

        <!-- Help / Onboarding Trigger -->
        <button 
          @click="authStore.showOnboarding = true" 
          title="Panduan Alur Sistem"
          class="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </button>

        <!-- User Profile & Logout -->
        <div class="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div class="hidden lg:block text-right">
            <div class="text-xs font-semibold text-white leading-tight">{{ authStore.user.name }}</div>
            <div class="text-[10px] font-mono text-emerald-400 capitalize">{{ authStore.user.role }}</div>
          </div>
          <button 
            @click="authStore.logout()" 
            title="Keluar Akun"
            class="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore'

defineEmits(['toggle-ai'])
const authStore = useAuthStore()
</script>
