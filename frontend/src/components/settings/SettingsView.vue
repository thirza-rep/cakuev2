<template>
  <div class="space-y-6 max-w-5xl mx-auto pb-12">
    <!-- Header Page -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Icon name="settings" custom-class="w-7 h-7 text-emerald-700" />
          <span>Pengaturan & Kustomisasi Brand</span>
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Sesuaikan identitas aplikasi, profil pribadi, foto, logo brand, dan lokasi sesuai preferensi Anda.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button 
          @click="handleReset"
          type="button"
          class="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          title="Kembalikan semua ke default awal"
        >
          <Icon name="refresh" custom-class="w-4 h-4" />
          <span>Reset Default</span>
        </button>

        <button 
          @click="saveAllChanges"
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
      <div v-if="showSuccessAlert" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center justify-between text-sm shadow-xs">
        <div class="flex items-center gap-2.5 font-bold">
          <Icon name="check" custom-class="w-5 h-5 text-emerald-700" />
          <span>Pengaturan berhasil disimpan dan langsung diterapkan ke seluruh sistem!</span>
        </div>
        <button @click="showSuccessAlert = false" class="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer">
          Tutup
        </button>
      </div>
    </transition>

    <!-- 4-Section Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      
      <!-- SEKSI 1: BRANDING & IDENTITAS APLIKASI -->
      <div class="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div class="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-black text-slate-900">Identitas Brand & Logo</h2>
            <p class="text-xs text-slate-500">Kustomisasi nama dan logo aplikasi sesuai nama usaha Anda.</p>
          </div>
        </div>

        <!-- Logo Picker dari Penyimpanan Perangkat -->
        <div class="space-y-3">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Logo Aplikasi (Penyimpanan Lokal)</label>
          <div class="flex items-center gap-4">
            <!-- Preview Box -->
            <div class="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
              <img 
                v-if="tempBranding.logo" 
                :src="tempBranding.logo" 
                alt="App Logo" 
                class="w-full h-full object-contain p-1"
              />
              <div v-else class="text-center p-2 text-slate-400">
                <Icon name="cube" custom-class="w-6 h-6 mx-auto mb-1 text-slate-400" />
                <span class="text-[10px] font-bold block leading-tight">Default</span>
              </div>
            </div>

            <!-- Upload Controls -->
            <div class="space-y-2">
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
                  v-if="tempBranding.logo" 
                  @click="removeLogo" 
                  type="button" 
                  class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Hapus
                </button>
              </div>
              <p class="text-[11px] text-slate-400">Format: PNG, JPG, WebP atau SVG (Maks. 2MB).</p>
            </div>
          </div>
        </div>

        <!-- Nama Aplikasi & Slogan -->
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase text-slate-600 mb-1.5">Nama Aplikasi</label>
            <input 
              v-model="tempBranding.appName" 
              type="text" 
              placeholder="Contoh: CAKUE, CatatanKu, Toko Berkah"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-600 mb-1.5">Slogan / Deskripsi Aplikasi</label>
            <input 
              v-model="tempBranding.appSubtitle" 
              type="text" 
              placeholder="Contoh: Catatan Keuangan & Kasir Ritel"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <!-- SEKSI 2: PROFIL PENGGUNA & FOTO -->
      <div class="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div class="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-black text-slate-900">Profil & Data Diri</h2>
            <p class="text-xs text-slate-500">Identitas pemilik akun untuk struk kasir dan personal banking.</p>
          </div>
        </div>

        <!-- Foto Profil dari Galeri Perangkat -->
        <div class="space-y-3">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Foto Profil (Avatar Lokal)</label>
          <div class="flex items-center gap-4">
            <!-- Circular Avatar Preview -->
            <div class="w-20 h-20 rounded-full border-2 border-emerald-600/30 p-1 bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
              <img 
                v-if="tempProfile.avatar" 
                :src="tempProfile.avatar" 
                alt="User Avatar" 
                class="w-full h-full object-cover rounded-full"
              />
              <div v-else class="w-full h-full rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xl">
                {{ tempProfile.name ? tempProfile.name.charAt(0).toUpperCase() : 'U' }}
              </div>
            </div>

            <!-- Upload Controls -->
            <div class="space-y-2">
              <input 
                ref="avatarFileInput"
                type="file" 
                accept="image/png, image/jpeg, image/webp" 
                class="hidden" 
                @change="handleAvatarFileSelect"
              />
              <div class="flex flex-wrap gap-2">
                <button 
                  @click="triggerAvatarUpload" 
                  type="button" 
                  class="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Icon name="user" custom-class="w-3.5 h-3.5" />
                  <span>Ambil Foto dari Galeri</span>
                </button>
                <button 
                  v-if="tempProfile.avatar" 
                  @click="removeAvatar" 
                  type="button" 
                  class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Hapus
                </button>
              </div>
              <p class="text-[11px] text-slate-400">Tersimpan di perangkat lokal. Tidak memerlukan cloud publik.</p>
            </div>
          </div>
        </div>

        <!-- Form Nama, Email, No HP -->
        <div class="space-y-3.5">
          <div>
            <label class="block text-xs font-bold uppercase text-slate-600 mb-1.5">Nama Lengkap</label>
            <input 
              v-model="tempProfile.name" 
              type="text" 
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label class="block text-xs font-bold uppercase text-slate-600 mb-1.5">Email Akun</label>
              <input 
                v-model="tempProfile.email" 
                type="email" 
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-slate-600 mb-1.5">Nomor WhatsApp / HP</label>
              <input 
                v-model="tempProfile.phone" 
                type="tel" 
                placeholder="08xxxxxxxxxx"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- SEKSI 3: ALAMAT & GOOGLE MAPS -->
      <div class="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div class="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-black text-slate-900">Alamat Usaha & Google Maps</h2>
            <p class="text-xs text-slate-500">Lokasi resmi toko yang tercetak di bagian footer nota struk.</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase text-slate-600 mb-1.5">Alamat Lengkap</label>
            <textarea 
              v-model="tempProfile.address" 
              rows="2"
              placeholder="Contoh: Jl. Sudirman Kav 52-53, Kebayoran Baru, Jakarta Selatan"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label class="block text-xs font-bold uppercase text-slate-600 mb-1.5">Koordinat GPS (Lat, Long)</label>
              <input 
                v-model="tempProfile.coordinates" 
                type="text" 
                placeholder="-6.225014, 106.809653"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
              />
            </div>
            <div class="flex items-end">
              <a 
                :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tempProfile.coordinates || tempProfile.address)}`" 
                target="_blank" 
                rel="noopener"
                class="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-300"
              >
                <Icon name="chart" custom-class="w-4 h-4 text-emerald-700" />
                <span>Buka di Google Maps ↗</span>
              </a>
            </div>
          </div>

          <!-- Peta Interaktif Preview (Zero Cost OpenStreetMap Embed) -->
          <div class="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-44 relative">
            <iframe 
              width="100%" 
              height="100%" 
              frameborder="0" 
              scrolling="no" 
              marginheight="0" 
              marginwidth="0" 
              :src="`https://maps.google.com/maps?q=${encodeURIComponent(tempProfile.coordinates || tempProfile.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`"
              class="w-full h-full filter saturate-150"
            ></iframe>
            <div class="absolute bottom-2 left-2 px-2.5 py-1 bg-white/90 backdrop-blur-xs rounded-lg text-[10px] font-bold text-slate-700 shadow-xs border border-slate-200">
              📍 Pin Lokasi Live
            </div>
          </div>
        </div>
      </div>

      <!-- SEKSI 4: PAYMENT GATEWAY (COMING SOON) -->
      <div class="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div>
              <h2 class="text-base sm:text-lg font-black text-slate-900">Payment Gateway (QRIS, VA)</h2>
              <p class="text-xs text-slate-500">Otomatisasi settlement pembayaran pelanggan langsung ke rekening.</p>
            </div>
          </div>
          <span class="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-mono font-extrabold text-[11px] rounded-lg tracking-wider">
            COMING SOON
          </span>
        </div>

        <div class="p-5 bg-gradient-to-br from-amber-50/60 to-slate-50 border border-amber-200/80 rounded-2xl space-y-3.5">
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

        <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
          <div class="flex items-center gap-2 text-slate-600">
            <Icon name="check" custom-class="w-4 h-4 text-emerald-600" />
            <span>Saat ini kasir mendukung metode pembayaran <strong>Tunai (Cash)</strong> dan <strong>QRIS Manual</strong>.</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useSettingsStore } from '../../stores/settingsStore'
import Icon from '../common/Icon.vue'

const settingsStore = useSettingsStore()

const logoFileInput = ref(null)
const avatarFileInput = ref(null)
const showSuccessAlert = ref(false)

// State form lokal sementara
const tempBranding = reactive({
  appName: '',
  appSubtitle: '',
  logo: ''
})

const tempProfile = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  coordinates: '',
  avatar: ''
})

onMounted(() => {
  loadStoreValues()
})

function loadStoreValues() {
  tempBranding.appName = settingsStore.appName
  tempBranding.appSubtitle = settingsStore.appSubtitle
  tempBranding.logo = settingsStore.appLogo

  tempProfile.name = settingsStore.userName
  tempProfile.email = settingsStore.userEmail
  tempProfile.phone = settingsStore.userPhone
  tempProfile.address = settingsStore.userAddress
  tempProfile.coordinates = settingsStore.mapsCoordinates
  tempProfile.avatar = settingsStore.userAvatar
}

// Handler Logo dari Storage Perangkat
function triggerLogoUpload() {
  logoFileInput.value?.click()
}

function handleLogoFileSelect(event) {
  const file = event.target.files?.[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    alert('Ukuran file maksimal 2MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    tempBranding.logo = e.target.result
  }
  reader.readAsDataURL(file)
}

function removeLogo() {
  tempBranding.logo = ''
  if (logoFileInput.value) logoFileInput.value.value = ''
}

// Handler Avatar Foto Profil dari Storage Perangkat
function triggerAvatarUpload() {
  avatarFileInput.value?.click()
}

function handleAvatarFileSelect(event) {
  const file = event.target.files?.[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    alert('Ukuran file maksimal 2MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    tempProfile.avatar = e.target.result
  }
  reader.readAsDataURL(file)
}

function removeAvatar() {
  tempProfile.avatar = ''
  if (avatarFileInput.value) avatarFileInput.value.value = ''
}

// Simpan Semua Perubahan
function saveAllChanges() {
  settingsStore.saveBranding({
    name: tempBranding.appName,
    subtitle: tempBranding.appSubtitle
  })
  if (tempBranding.logo) {
    settingsStore.setAppLogo(tempBranding.logo)
  } else {
    settingsStore.removeAppLogo()
  }

  settingsStore.saveProfile({
    name: tempProfile.name,
    email: tempProfile.email,
    phone: tempProfile.phone,
    address: tempProfile.address,
    coordinates: tempProfile.coordinates
  })
  if (tempProfile.avatar) {
    settingsStore.setUserAvatar(tempProfile.avatar)
  } else {
    settingsStore.removeUserAvatar()
  }

  showSuccessAlert.value = true
  setTimeout(() => {
    showSuccessAlert.value = false
  }, 4000)
}

function handleReset() {
  if (confirm('Apakah Anda yakin ingin mengembalikan semua data pengaturan ke default awal?')) {
    settingsStore.resetToDefault()
    loadStoreValues()
    showSuccessAlert.value = true
    setTimeout(() => {
      showSuccessAlert.value = false
    }, 3000)
  }
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
