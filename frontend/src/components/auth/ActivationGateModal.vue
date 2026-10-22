<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
    <div class="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-auto text-slate-900 transition-all">
      
      <!-- TOP HEADER: LOGO RESMI CAKUE DENGAN AKSEN BERSIH -->
      <div class="text-center space-y-2">
        <div class="relative inline-flex items-center justify-center">
          <!-- Subtle Soft Halo Glow -->
          <div class="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-lg animate-pulse pointer-events-none"></div>
          
          <!-- Logo Badge Rapi & Jelas -->
          <div class="relative w-16 h-16 rounded-2xl bg-white border border-slate-200/90 shadow-md shadow-emerald-700/10 flex items-center justify-center p-2.5">
            <img src="/logo.png" alt="CAKUE Logo" class="w-full h-full object-contain" />
          </div>
        </div>
        
        <div class="space-y-1">
          <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold uppercase tracking-wider">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Aktivasi Wajib Pengguna Baru</span>
          </div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Aktivasi Akun CAKUE</h2>
          <p class="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Selesaikan 3 fase aktivasi berikut untuk membuka akses penuh ke fitur transaksi portal Anda.
          </p>
        </div>
      </div>

      <!-- STEP PROGRESS INDICATOR PILLS (FASE 1 - FASE 2 - FASE 3) -->
      <div class="flex items-center justify-between gap-1.5 p-1.5 bg-slate-50 rounded-2xl border border-slate-200">
        <!-- Pill 1: Foto Profil -->
        <button 
          type="button"
          @click="currentStep = 1"
          class="flex-1 py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-0.5"
          :class="[
            currentStep === 1 
              ? 'bg-white text-emerald-800 font-extrabold shadow-xs border border-slate-200/80 ring-1 ring-emerald-500/20' 
              : avatarUrl ? 'text-emerald-700 hover:bg-slate-200/50 font-bold' : 'text-slate-400 hover:bg-slate-200/40 font-medium'
          ]"
        >
          <div class="flex items-center gap-1 text-[11px]">
            <Icon v-if="avatarUrl && currentStep !== 1" name="check" custom-class="w-3 h-3 text-emerald-600" />
            <span v-else class="w-3.5 h-3.5 rounded-full bg-slate-200 text-slate-700 text-[9px] flex items-center justify-center font-bold" :class="currentStep === 1 ? 'bg-emerald-700 text-white' : ''">1</span>
            <span class="truncate">Foto</span>
          </div>
          <span class="text-[9px] text-slate-400 font-normal">Fase 1</span>
        </button>

        <span class="text-slate-300 text-xs font-bold">•</span>

        <!-- Pill 2: Nama Lengkap -->
        <button 
          type="button"
          @click="goToStep(2)"
          :disabled="!avatarUrl"
          class="flex-1 py-2 px-1 rounded-xl text-center transition-all cursor-pointer disabled:cursor-not-allowed flex flex-col items-center gap-0.5"
          :class="[
            currentStep === 2 
              ? 'bg-white text-emerald-800 font-extrabold shadow-xs border border-slate-200/80 ring-1 ring-emerald-500/20' 
              : (name.trim().length >= 3) ? 'text-emerald-700 hover:bg-slate-200/50 font-bold' : 'text-slate-400 font-medium'
          ]"
        >
          <div class="flex items-center gap-1 text-[11px]">
            <Icon v-if="name.trim().length >= 3 && currentStep !== 2" name="check" custom-class="w-3 h-3 text-emerald-600" />
            <span v-else class="w-3.5 h-3.5 rounded-full bg-slate-200 text-slate-700 text-[9px] flex items-center justify-center font-bold" :class="currentStep === 2 ? 'bg-emerald-700 text-white' : ''">2</span>
            <span class="truncate">Nama</span>
          </div>
          <span class="text-[9px] text-slate-400 font-normal">Fase 2</span>
        </button>

        <span class="text-slate-300 text-xs font-bold">•</span>

        <!-- Pill 3: OTP WhatsApp -->
        <button 
          type="button"
          @click="goToStep(3)"
          :disabled="!avatarUrl || name.trim().length < 3"
          class="flex-1 py-2 px-1 rounded-xl text-center transition-all cursor-pointer disabled:cursor-not-allowed flex flex-col items-center gap-0.5"
          :class="[
            currentStep === 3 
              ? 'bg-white text-emerald-800 font-extrabold shadow-xs border border-slate-200/80 ring-1 ring-emerald-500/20' 
              : isOtpSuccess ? 'text-emerald-700 hover:bg-slate-200/50 font-bold' : 'text-slate-400 font-medium'
          ]"
        >
          <div class="flex items-center gap-1 text-[11px]">
            <Icon v-if="isOtpSuccess" name="check" custom-class="w-3 h-3 text-emerald-600" />
            <span v-else class="w-3.5 h-3.5 rounded-full bg-slate-200 text-slate-700 text-[9px] flex items-center justify-center font-bold" :class="currentStep === 3 ? 'bg-emerald-700 text-white' : ''">3</span>
            <span class="truncate">OTP WA</span>
          </div>
          <span class="text-[9px] text-slate-400 font-normal">Fase 3</span>
        </button>
      </div>

      <!-- Feedback Banners -->
      <div v-if="errorMessage" class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2 animate-fade-in">
        <Icon name="alert-circle" custom-class="w-4 h-4 shrink-0 mt-0.5" />
        <span>{{ errorMessage }}</span>
      </div>

      <div v-if="successMessage" class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-2 animate-fade-in">
        <Icon name="check" custom-class="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
        <span>{{ successMessage }}</span>
      </div>

      <!-- ============================================================== -->
      <!-- FASE 1: FOTO PROFIL PENGGUNA -->
      <!-- ============================================================== -->
      <div v-if="currentStep === 1" class="space-y-5 animate-fade-in">
        <div class="text-left space-y-1 border-b border-slate-100 pb-3">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Fase 1 / 3
            </span>
            <span class="text-[11px] text-slate-400">Identitas Visual</span>
          </div>
          <h3 class="text-base font-bold text-slate-900">Tentukan Foto Profil Anda</h3>
          <p class="text-xs text-slate-500">
            Pilih avatar representatif atau unggah foto asli untuk profil akun Anda.
          </p>
        </div>

        <!-- Aksen Grafik: Avatar Studio Card -->
        <div class="relative p-4 rounded-2xl bg-gradient-to-b from-emerald-50/50 to-slate-50 border border-slate-200/80 flex flex-col items-center justify-center space-y-3">
          <div class="relative group">
            <div class="absolute -inset-1 rounded-3xl bg-emerald-500/20 blur-md group-hover:bg-emerald-500/30 transition-all"></div>
            <img 
              :src="avatarUrl || defaultAvatar" 
              alt="Avatar Pengguna"
              class="relative w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-lg bg-white transition-transform group-hover:scale-105" 
            />
            <label class="absolute -bottom-1 -right-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2 shadow-md cursor-pointer transition-colors" title="Ganti Foto">
              <Icon name="camera" custom-class="w-3.5 h-3.5" />
              <input type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
            </label>
          </div>
          <div class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
            <Icon name="check" custom-class="w-3 h-3 text-emerald-600" />
            <span>Foto Profil Aktif</span>
          </div>
        </div>

        <!-- Avatar Presets -->
        <div class="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <span class="text-[11px] font-bold text-slate-700 block text-left">Pilih Cepat Avatar:</span>
          <div class="grid grid-cols-6 gap-2">
            <button 
              v-for="(av, idx) in avatarPresets" 
              :key="idx"
              type="button"
              @click="avatarUrl = av"
              class="w-full aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer hover:scale-110 shadow-xs"
              :class="avatarUrl === av ? 'border-emerald-600 ring-2 ring-emerald-500 shadow-md scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'"
            >
              <img :src="av" alt="Preset" class="w-full h-full object-cover" />
            </button>
          </div>

          <!-- File Upload Option -->
          <div class="pt-2 text-center border-t border-slate-200/70">
            <label class="text-xs text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer inline-flex items-center gap-1.5 transition-colors">
              <Icon name="upload" custom-class="w-3.5 h-3.5" />
              <span>Upload Foto dari Galeri / Laptop</span>
              <input type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
            </label>
          </div>
        </div>

        <!-- Next Step Button -->
        <div class="pt-2">
          <button 
            type="button"
            @click="goToStep(2)"
            :disabled="!avatarUrl"
            class="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Lanjut ke Fase 2: Nama Lengkap</span>
            <Icon name="chevron-right" custom-class="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- FASE 2: NAMA LENGKAP PENGGUNA -->
      <!-- ============================================================== -->
      <div v-else-if="currentStep === 2" class="space-y-5 animate-fade-in">
        <div class="text-left space-y-1 border-b border-slate-100 pb-3">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Fase 2 / 3
            </span>
            <span class="text-[11px] text-slate-400">Identitas Resmi</span>
          </div>
          <h3 class="text-base font-bold text-slate-900">Konfirmasi Nama Lengkap</h3>
          <p class="text-xs text-slate-500">
            Nama ini akan dicantumkan pada struk transaksi, laporan akuntansi, dan tanda tangan resmi.
          </p>
        </div>

        <!-- Aksen Grafik: Sleek Live Member ID Card Preview -->
        <div class="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white shadow-lg relative overflow-hidden border border-slate-700/80">
          <div class="absolute -right-6 -bottom-6 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
          
          <div class="flex items-center justify-between mb-3 border-b border-white/10 pb-2.5">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center p-1">
                <img src="/logo.png" alt="CAKUE" class="w-full h-full object-contain" />
              </div>
              <span class="text-[10px] font-mono tracking-widest uppercase font-bold text-emerald-400">CAKUE ID CARD</span>
            </div>
            <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              TERVERIFIKASI
            </span>
          </div>
          
          <div class="flex items-center gap-3.5">
            <img 
              :src="avatarUrl || defaultAvatar" 
              alt="Preview Avatar"
              class="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-400/60 shadow-md bg-white/10 shrink-0"
            />
            <div class="space-y-0.5 text-left min-w-0">
              <div class="text-[10px] text-slate-400 font-medium">Pemilik Akun Resmi:</div>
              <div class="text-sm font-black text-white truncate tracking-wide">
                {{ name.trim() || 'Nama Lengkap Anda' }}
              </div>
              <div class="text-[10px] text-emerald-300 font-mono truncate">
                {{ authStore.currentUser?.email || 'email@cakue.id' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Name Input Field -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-left">
          <label class="block text-xs font-bold text-slate-700">
            Nama Lengkap Anda <span class="text-rose-500">*</span>
          </label>
          
          <input 
            v-model="name"
            type="text"
            required
            maxlength="70"
            placeholder="Contoh: Budi Santoso"
            class="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-bold transition-all shadow-xs"
            @keyup.enter="goToStep(3)"
          />

          <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Gunakan nama asli atau nama usaha resmi.</span>
            <span :class="name.trim().length >= 3 ? 'text-emerald-700 font-bold' : 'text-amber-600'">
              {{ name.trim().length }}/3 karakter min.
            </span>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex items-center gap-3 pt-2">
          <button 
            type="button"
            @click="currentStep = 1"
            class="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Icon name="chevron-left" custom-class="w-3.5 h-3.5" />
            <span>Sebelumnya</span>
          </button>

          <button 
            type="button"
            @click="goToStep(3)"
            :disabled="name.trim().length < 3"
            class="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Lanjut ke Fase 3: WhatsApp OTP</span>
            <Icon name="chevron-right" custom-class="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- FASE 3: NOMOR WHATSAPP & VERIFIKASI OTP -->
      <!-- ============================================================== -->
      <div v-else-if="currentStep === 3" class="space-y-5 animate-fade-in">
        <div class="text-left space-y-1 border-b border-slate-100 pb-3">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Fase 3 / 3
            </span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-bold">
              WhatsApp Gateway
            </span>
          </div>
          <h3 class="text-base font-bold text-slate-900">Verifikasi Nomor WhatsApp</h3>
          <p class="text-xs text-slate-500">
            Nomor WhatsApp digunakan untuk autentikasi keamanan, alert transaksi, dan pengiriman nota struk.
          </p>
        </div>

        <!-- Aksen Grafik: WhatsApp Gateway Security Badge -->
        <div class="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/80 rounded-2xl flex items-center gap-3 text-left">
          <div class="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Icon name="share" custom-class="w-5 h-5 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h4 class="text-xs font-bold text-slate-900">Enkripsi WhatsApp Gateway</h4>
              <span class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 border border-teal-200">Aktif</span>
            </div>
            <p class="text-[11px] text-slate-500 leading-tight">Keamanan multi-faktor untuk pengiriman kode OTP dan proteksi aset kas Anda.</p>
          </div>
        </div>

        <!-- Phone Input & OTP Sender -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-left">
          <label class="block text-xs font-bold text-slate-700">Nomor WhatsApp Aktif</label>
          <div class="flex gap-2">
            <div class="relative flex-1">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-bold text-xs">🇮🇩 +62</span>
              <input 
                v-model="phoneInput"
                type="tel"
                placeholder="812-3456-7890"
                :disabled="isOtpSuccess"
                class="w-full pl-16 pr-3 py-2.5 text-xs font-mono bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 disabled:bg-slate-100 disabled:text-slate-400 font-bold transition-all shadow-xs"
              />
            </div>

            <button 
              type="button"
              @click="handleSendOtp"
              :disabled="isSendingOtp || otpCooldown > 0 || isOtpSuccess"
              class="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs"
            >
              <svg v-if="isSendingOtp" class="animate-spin w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="otpCooldown > 0">{{ otpCooldown }}s</span>
              <span v-else>{{ otpSent ? 'Kirim Ulang' : 'Kirim OTP' }}</span>
            </button>
          </div>

          <!-- 6-Digit OTP Box (Muncul saat OTP sudah dikirim atau siap) -->
          <div v-if="otpSent || isOtpSuccess" class="space-y-2 pt-2 border-t border-slate-200 animate-fade-in">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-slate-700">Masukkan 6 Digit Kode OTP</label>
              <span class="text-[10px] text-emerald-700 font-bold">Berlaku 5 Menit</span>
            </div>

            <input 
              v-model="otpCode"
              type="text"
              maxlength="6"
              placeholder="••••••"
              :disabled="isOtpSuccess"
              class="w-full text-center tracking-[0.6em] font-mono text-xl font-black px-4 py-2.5 bg-white border-2 border-emerald-500/40 focus:border-emerald-600 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 disabled:bg-emerald-50 disabled:text-emerald-800 transition-all shadow-xs"
              @keyup.enter="handleVerifyAndActivate"
            />

            <div class="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <span>Periksa pesan masuk WhatsApp Anda.</span>
              <span class="text-[10px] text-slate-400 font-mono">(Bypass testing: 777888)</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-3 pt-2">
          <button 
            type="button"
            @click="currentStep = 2"
            class="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Icon name="chevron-left" custom-class="w-3.5 h-3.5" />
            <span>Sebelumnya</span>
          </button>

          <button 
            type="button"
            @click="handleVerifyAndActivate"
            :disabled="isVerifying || otpCode.length < 6 || isOtpSuccess"
            class="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg v-if="isVerifying" class="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <Icon v-else-if="isOtpSuccess" name="check" custom-class="w-4 h-4 text-white" />
            <span>{{ isOtpSuccess ? 'Akun Terverifikasi' : 'Verifikasi & Aktifkan Akun' }}</span>
          </button>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- FASE 4: SUKSES AKTIVASI (ANIMASI CHECKMARK & PERAYAAN) -->
      <!-- ============================================================== -->
      <div v-else-if="currentStep === 4" class="py-6 space-y-4 text-center animate-fade-in">
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md animate-bounce">
          <Icon name="check" custom-class="w-8 h-8" stroke-width="3" />
        </div>

        <div class="space-y-1">
          <h3 class="text-xl font-black text-slate-900 tracking-tight">Akun Berhasil Diaktivasi!</h3>
          <p class="text-xs text-slate-600 max-w-xs mx-auto">
            Selamat datang di CAKUE! Seluruh fitur transaksi dan dashboard kini terbuka penuh untuk Anda.
          </p>
        </div>

        <div class="pt-2 text-xs text-emerald-700 font-bold flex items-center justify-center gap-2">
          <svg class="animate-spin w-4 h-4 text-emerald-700" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Mengalihkan ke dashboard...</span>
        </div>
      </div>

      <!-- ACTION FOOTER: KELUAR / GANTI AKUN -->
      <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span class="text-slate-400 text-[11px] truncate max-w-[200px]">
          Akun: {{ authStore.currentUser?.email || authStore.currentUser?.username }}
        </span>
        
        <button 
          type="button"
          @click="handleLogout"
          class="font-bold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
        >
          <Icon name="logout" custom-class="w-3.5 h-3.5" />
          <span>Keluar / Ganti Akun</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import Icon from '../common/Icon.vue'

const authStore = useAuthStore()

// Modal otomatis aktif jika user terautentikasi namun belum melengkapi profil & OTP
const isOpen = computed(() => {
  return Boolean(authStore.isAuthenticated && !authStore.isProfileComplete)
})

// Fase Onboarding Terpisah:
// 1 = Foto Profil
// 2 = Nama Lengkap
// 3 = WhatsApp OTP
// 4 = Sukses
const currentStep = ref(1)

const name = ref(authStore.currentUser?.name || '')
const avatarUrl = ref(authStore.currentUser?.avatar_url || '')
const phoneInput = ref(authStore.currentUser?.phone ? authStore.currentUser.phone.replace(/^62/, '') : '')
const otpCode = ref('')
const otpSent = ref(false)
const otpCooldown = ref(0)
const isSendingOtp = ref(false)
const isVerifying = ref(false)
const isOtpSuccess = ref(Boolean(authStore.currentUser?.phone_verified))
const errorMessage = ref('')
const successMessage = ref('')

let cooldownInterval = null

const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'

const avatarPresets = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
]

// Sinkronisasi data awal user
watch(() => authStore.currentUser, (val) => {
  if (val) {
    if (!name.value) name.value = val.name || ''
    if (!avatarUrl.value) avatarUrl.value = val.avatar_url || ''
    if (!phoneInput.value && val.phone) {
      phoneInput.value = val.phone.replace(/^62/, '')
    }
    if (val.phone_verified) {
      isOtpSuccess.value = true
    }
  }
}, { immediate: true })

function goToStep(step) {
  errorMessage.value = ''
  if (step === 2 && !avatarUrl.value) {
    errorMessage.value = 'Silakan pilih foto profil terlebih dahulu.'
    return
  }
  if (step === 3 && name.value.trim().length < 3) {
    errorMessage.value = 'Nama lengkap minimal 3 karakter.'
    return
  }
  currentStep.value = step
}

function handleFileUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    errorMessage.value = 'Ukuran foto maksimal 2MB.'
    return
  }
  const reader = new FileReader()
  reader.onload = (event) => {
    avatarUrl.value = event.target.result
  }
  reader.readAsDataURL(file)
}

function startCooldown(seconds = 60) {
  otpCooldown.value = seconds
  if (cooldownInterval) clearInterval(cooldownInterval)
  cooldownInterval = setInterval(() => {
    if (otpCooldown.value > 0) {
      otpCooldown.value--
    } else {
      clearInterval(cooldownInterval)
    }
  }, 1000)
}

async function handleSendOtp() {
  errorMessage.value = ''
  successMessage.value = ''

  let cleanPhone = phoneInput.value.replace(/[^0-9]/g, '')
  if (cleanPhone.startsWith('0')) {
    cleanPhone = cleanPhone.substring(1)
  }
  if (cleanPhone.length < 8) {
    errorMessage.value = 'Silakan masukkan nomor WhatsApp yang valid.'
    return
  }

  isSendingOtp.value = true
  try {
    const fullPhone = '62' + cleanPhone
    const res = await authStore.sendOtp(fullPhone)
    if (res.success) {
      otpSent.value = true
      startCooldown(60)
      successMessage.value = res.message || 'Kode OTP 6-digit berhasil dikirim ke WhatsApp Anda!'
    } else {
      errorMessage.value = res.message || 'Gagal mengirim OTP ke nomor tersebut.'
    }
  } catch (err) {
    errorMessage.value = `Kesalahan: ${err.message}`
  } finally {
    isSendingOtp.value = false
  }
}

async function handleVerifyAndActivate() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!avatarUrl.value) {
    errorMessage.value = 'Silakan pilih atau upload Foto Profil Anda terlebih dahulu.'
    currentStep.value = 1
    return
  }
  if (!name.value || name.value.trim().length < 3) {
    errorMessage.value = 'Nama lengkap minimal 3 karakter.'
    currentStep.value = 2
    return
  }
  if (!otpCode.value || otpCode.value.trim().length < 6) {
    errorMessage.value = 'Masukkan 6 digit kode OTP yang Anda terima di WhatsApp.'
    return
  }

  isVerifying.value = true
  try {
    // 1. Simpan Foto Profil & Nama Lengkap ke PostgreSQL
    await authStore.updateProfile({
      name: name.value.trim(),
      avatar_url: avatarUrl.value
    })

    // 2. Verifikasi Kode OTP WhatsApp
    const res = await authStore.verifyOtp(otpCode.value.trim())
    if (res.success) {
      isOtpSuccess.value = true
      currentStep.value = 4 // Tampilkan layar perayaan sukses
      successMessage.value = 'Selamat! Akun Anda telah aktif sepenuhnya.'
      setTimeout(() => {
        // Modal akan tertutup otomatis saat authStore.isProfileComplete menjadi true
      }, 1500)
    } else {
      errorMessage.value = res.message || 'Kode OTP tidak sesuai atau sudah kedaluwarsa.'
    }
  } catch (err) {
    errorMessage.value = `Gagal verifikasi: ${err.message}`
  } finally {
    isVerifying.value = false
  }
}

function handleLogout() {
  authStore.logout()
}
</script>
