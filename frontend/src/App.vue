<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
    <!-- View 1: Autentikasi / Onboarding (Jika belum login) -->
    <template v-if="!authStore.isAuthenticated">
      <!-- 1. Onboarding Utama (Landing & Feature Showcase) -->
      <OnboardingView 
        v-if="authView === 'onboarding'" 
        @go-login="authView = 'login'" 
        @go-register="authView = 'register'" 
      />

      <!-- 2. Form Login -->
      <LoginView 
        v-else-if="authView === 'login'" 
        @switch-view="v => authView = v" 
        @go-onboarding="authView = 'onboarding'" 
      />

      <!-- 3. Form Register -->
      <RegisterView 
        v-else-if="authView === 'register'" 
        @switch-view="v => authView = v" 
        @go-onboarding="authView = 'onboarding'" 
      />
    </template>

    <!-- View 2: Aplikasi Utama (Setelah Login - Opsi B: Pemisahan Mutlak) -->
    <template v-else>
      <!-- PORTAL 1: PRIBADI / PERORANGAN (Mobile Banking Style) -->
      <PersonalPortal 
        v-if="authStore.accountType === 'personal'" 
        @toggle-ai="isAiDrawerOpen = !isAiDrawerOpen"
      />

      <!-- PORTAL 2: USAHA / UMKM (Modern SaaS & ERP Suite) -->
      <BusinessPortal 
        v-else 
        @toggle-ai="isAiDrawerOpen = !isAiDrawerOpen"
      />

      <!-- Modals & Drawers -->
      <OnboardingModal />
      <ActivationGateModal />
      <AiCopilotDrawer :is-open="isAiDrawerOpen" @close="isAiDrawerOpen = false" />
    </template>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from './stores/authStore'
import OnboardingView from './components/onboarding/OnboardingView.vue'
import LoginView from './components/auth/LoginView.vue'
import RegisterView from './components/auth/RegisterView.vue'
import OnboardingModal from './components/onboarding/OnboardingModal.vue'
import ActivationGateModal from './components/auth/ActivationGateModal.vue'
import PersonalPortal from './components/personal/PersonalPortal.vue'
import BusinessPortal from './components/business/BusinessPortal.vue'
import AiCopilotDrawer from './components/ai/AiCopilotDrawer.vue'

const authStore = useAuthStore()
const authView = ref('onboarding')
const isAiDrawerOpen = ref(false)

// Jika user logout di mana pun, otomatis kembali ke Onboarding Utama
watch(() => authStore.isAuthenticated, (newVal) => {
  if (!newVal) {
    authView.value = 'onboarding'
  }
})
</script>
