# CAKUE (Catatan Keuangan & Usaha Enterprise)

> **Platform Terpadu Manajemen Keuangan Personal (Mobile Banking) & SaaS ERP Usaha Multi-Cabang (100% Free & Open-Source, $0 Cost)**

---

## 1. Ikhtisar Arsitektur Produk

Aplikasi **CAKUE** mengusung arsitektur **Pemisahan Mutlak Dua Pengalaman Pengguna (Opsi B)**:

1. **Personal Banking Portal (`PersonalPortal.vue`)**:
   - Beroperasi selayaknya aplikasi **Mobile Banking modern** berstandar perbankan (*Light Mode*, aksen emerald perbankan).
   - Pengelolaan kantong multi-rekening (Kas Tunai, Rekening Bank BCA/Mandiri, E-Wallet GoPay/ShopeePay) dengan indikator pembeda warna alami.
   - Pencatatan utang-piutang fleksibel dengan toggle sinkronisasi kas riil, progress bar cicilan, dan accordion riwayat pelunasan.
   - Modal Catat Keuangan Cepat (`QrisActionModal.vue`) untuk transaksi instan.
   - Fitur koreksi dan penghapusan transaksi mutasi langsung.
   - Analisis keuangan personal berbasis metode budgeting 50/30/20.

2. **Business SaaS ERP Workspace (`BusinessPortal.vue`)**:
   - Beroperasi sebagai **SaaS ERP Multi-Cabang** untuk operasional UMKM hingga korporasi ritel.
   - **Kasir POS Toko Cepat (`PosCashier.vue`)**: Katalog visual, pencarian produk, barcode scanner, multi-metode bayar (Tunai & QRIS), dan kalkulator kembalian otomatis.
   - **Multi-Cabang & Gudang Pusat (`BranchStockManager.vue`)**: Mekanisme Surat Jalan pengiriman stok *In-Transit* (Gudang Pusat -> Cabang Jakarta Selatan, Bandung Dago, Surabaya Gubeng) untuk mencegah kebocoran barang.
   - **Manajemen Aset Tetap (`AssetManager.vue`)**: Register aset inventaris fisik dan perhitungan otomatis depresiasi bulanan (garis lurus).
   - **Audit Trail Drilldown Interaktif**: Klik pada 4 kartu KPI untuk membuka modal rincian akuntansi formal (Audit Omset, Faktur Beban/HPP, Laporan Laba Rugi SAK EMKM multi-tingkat, dan Buku Register Aset).
   - **Kolom Inovasi Riset & Pengembangan (R&D)**: Alokasi otomatis 15% dari Laba Bersih Riil untuk 3 portofolio inovasi usaha.
   - **Ekspor Dokumen Resmi Akuntan**: Ekspor Spreadsheet Excel/CSV bertitik koma (`;`) dan Cetak PDF Ber-Kop Surat resmi dengan 3 kolom tanda tangan pengesahan (Disusun, Diperiksa, Disetujui).

---

## 2. Matriks Hak Akses Pengguna (Granular RBAC)

Sistem menerapkan **Role-Based Access Control (RBAC)** ketat di seluruh alur operasional:

| Fitur / Wewenang Modul | Owner (Super Admin) | Manajer Cabang | Kasir POS Toko | Staff Gudang & Logistik |
| :--- | :---: | :---: | :---: | :---: |
| **Ringkasan Usaha & KPI** | ✅ Akses Penuh | ✅ Akses Penuh | ❌ Diblokir | ❌ Diblokir |
| **Statistik & Analisis Bisnis** | ✅ Akses Penuh | ✅ Akses Penuh | ❌ Diblokir | ❌ Diblokir |
| **Modul Kasir POS (`pos`)** | ✅ Akses Penuh | ✅ Akses Penuh | ✅ Terkunci Cabang Sendiri | ❌ Diblokir |
| **Modul Inventaris & Cabang (`inventory`)** | ✅ Lintas Cabang | ✅ Cabang & Gudang | ❌ Diblokir | ✅ Gudang Pusat (Masking HPP) |
| **Modul Aset & Depresiasi (`assets`)** | ✅ Akses Penuh | ❌ Terkunci | ❌ Diblokir | ❌ Diblokir |
| **Jurnal Transaksi Kas (`journal`)** | ✅ Akses Penuh | ✅ Akses Penuh | ❌ Diblokir | ❌ Diblokir |
| **Audit Trail Drilldown & Ekspor** | ✅ Excel & PDF | ✅ Excel & PDF | ❌ Diblokir | ❌ Diblokir |
| **Ubah Harga Jual & HPP Produk** | ✅ Berwenang | ❌ Terkunci | ❌ Terkunci | ❌ Terkunci |
| **Sinkronisasi Stok ke Kas Riil** | ✅ Berwenang | ✅ Berwenang | ❌ Terkunci | ❌ Terkunci (*Segregation of Duties*) |
| **Modul Cabang & Multi-Outlet (`branches`)** | ✅ Akses Penuh | ✅ Buka/Tutup Cabang Sendiri | ❌ Diblokir | ❌ Diblokir |
| **Buka Cabang Baru & Hapus Cabang** | ✅ Berwenang | ❌ Terkunci | ❌ Diblokir | ❌ Diblokir |
| **Buka / Tutup Operasional Toko** | ✅ Semua Cabang | ✅ Cabang Sendiri | ❌ Terkunci | ❌ Terkunci |
| **Profil & PIN Otorisasi 6-Digit** | ✅ Profil Sendiri | ✅ Profil Sendiri | ✅ Profil Sendiri | ✅ Profil Sendiri |
| **Manajemen Staf Tim Usaha** | ✅ Semua Cabang | ✅ Staf Cabang Sendiri | ❌ Tersembunyi | ❌ Tersembunyi |
| **Pengaturan Aplikasi (`settings`)** | ✅ Akses Penuh | ⚠️ Cabang & Printer Saja | ❌ **DIBLOKIR TOTAL** | ❌ **DIBLOKIR TOTAL** |
| **Kustomisasi Brand Master & Logo** | ✅ Berwenang | 🔒 Read-Only | ❌ Diblokir | ❌ Diblokir |
| **Pengaturan Pajak PPN & Finansial** | ✅ Berwenang | 🔒 Read-Only | ❌ Diblokir | ❌ Diblokir |

---

## 3. Pemisahan Modul Konfigurasi: Profil vs Pengaturan Aplikasi

Sesuai standar pemisahan hak akses:

### A. Pengaturan Profil Pengguna (`ProfileView.vue`)
- **Peruntukan**: Semua jenis user dan semua role (`OWNER`, `MANAGER`, `CASHIER`, `WAREHOUSE`, serta `Nasabah Pribadi`).
- **Data Diri & Avatar Lokal**: Pengunggahan foto dari perangkat, nama lengkap, email, nomor WhatsApp, serta kartu ringkasan hak akses aktif.
- **Keamanan & PIN Otorisasi Kasir 6-Digit**: Pengaturan PIN supervisor 6-digit untuk otorisasi void transaksi POS, diskon manual, dan buka laci kas (*cash drawer*).
- **Manajemen Staf & Tim Usaha (RBAC Master)**:
  - Hanya dapat diakses oleh `Owner` dan `Manajer Cabang` (`authStore.canManageStaff`).
  - Tersembunyi total dari pandangan Kasir dan Staff Gudang.
  - Tambah staf baru, ganti role, toggle status aktif/nonaktif, reset PIN kasir staf, dan filter per cabang.

### B. Pengaturan Aplikasi & Toko (`AppSettingsView.vue`)
- **Peruntukan**: Khusus level manajemen usaha (`Owner` dan `Manajer Cabang`).
- **RBAC Fallback Guard**: Kasir dan Staff Gudang diblokir total dengan tampilan *Akses Ditolak*.
- **Identitas Brand & Logo Master**: Pengunggahan logo master aplikasi dan slogan toko (Khusus Owner).
- **Alamat Usaha & Google Maps**: Alamat lengkap cabang dan koordinat GPS Lat-Long dengan preview peta interaktif.
- **Kustomisasi Struk Kasir & Printer Thermal POS**:
  - Pilihan ukuran kertas thermal: **58 mm (Mobile/Bluetooth mini)** vs **80 mm (Desktop/Supermarket wide)**.
  - Kustomisasi pesan ucapan sambutan Header dan ketentuan garansi Footer.
  - Toggle: Cetak Logo Toko, Cetak QR Struk, Cetak Nama Kasir, dan Cetak Alamat Toko.
  - **Live Virtual Thermal Paper Preview**: Simulasi struk kasir interaktif real-time sesuai lebar kertas yang dipilih.
  - Terhubung reaktif ke `ReceiptModal.vue` pada modul kasir POS.
- **Pengaturan Finansial & Pajak PPN**:
  - Pengaturan tarif PPN (Preset 0%, 10%, 11%, atau kustom persentase).
  - Terhubung reaktif ke `posStore.js` agar kalkulasi kasir POS selalu akurat mengikuti kebijakan Owner.
  - Rekening settlement bank/e-wallet untuk penerimaan pembayaran QRIS.
- **Integrasi WhatsApp Gateway (Baileys $0 Cost)**:
  - Peringatan stok kritis otomatis ke nomor WhatsApp Owner jika stok menyentuh ambang batas minimum.
  - Template pesan nota struk transaksi digital WhatsApp ke nomor pelanggan.

---

## 4. Arsitektur Layanan Microservices ($0 Cost)

Aplikasi berjalan di atas infrastruktur lokal mandiri tanpa ketergantungan cloud berbayar:

| Layanan | Teknologi | Port | Fungsi |
| :--- | :--- | :---: | :--- |
| **Frontend UI** | Vue 3, Vite, Tailwind CSS, Pinia | `:5173` | Antarmuka pengguna responsif (Mobile s/d Desktop) |
| **Backend API** | Node.js Express, PostgreSQL Client | `:3001` | REST API, orkestrator transaksi & sinkronisasi pembukuan |
| **WhatsApp Gateway** | Baileys WebSockets (Node.js) | `:3333` | Pengiriman struk & alert stok kritis ke WhatsApp ($0) |
| **Database Server** | PostgreSQL 16 (Docker Container) | `:5433` | Penyimpanan persisten Double-Entry Ledger & Inventory |

---

## 5. Struktur Direktori Proyek

```
/Users/macbookpro/server/cakue/
├── docker-compose.server.yml           # Orkestrasi Docker (PostgreSQL & Gateway)
├── wa-gateway/                         # Microservice WhatsApp Baileys Gateway
│   ├── src/index.js                    # Server WebSocket Baileys (Port 3333)
│   └── package.json
├── backend/                            # Express Backend REST API
│   ├── src/index.js                    # API Routes (Ledger, Mutasi, Port 3001)
│   ├── schema.sql                      # Skema PostgreSQL Akuntansi & Multi-Cabang
│   └── package.json
└── frontend/                           # Client Application (Vue 3 + Vite)
    ├── index.html                      # HTML Entry Point
    ├── vite.config.js
    ├── src/
    │   ├── App.vue                     # Root Orchestrator (Personal vs Business Switcher)
    │   ├── main.js                     # Inisialisasi Pinia & Vue
    │   ├── style.css                   # Tailwind CSS Global & Typography
    │   ├── stores/                     # Pinia State Management
    │   │   ├── authStore.js            # RBAC Matrix, Role Switcher, Sesi Pengguna
    │   │   ├── financeStore.js         # Double-Entry Ledger, Transaksi, R&D Allocation
    │   │   ├── stockStore.js           # Multi-Cabang, Gudang Pusat, Surat Jalan In-Transit
    │   │   ├── posStore.js             # Kasir POS, Cart, Kalkulasi PPN Dinamis
    │   │   └── settingsStore.js        # Branding, Profil, PIN Kasir, Staf, Struk & WA
    │   └── components/
    │       ├── common/
    │       │   └── Icon.vue            # Zero-Emoticon SVG Vector Icon Library (40+ Icons)
    │       ├── layout/
    │       │   └── ExcelRibbon.vue     # Formula Bar & Toolbar Desktop
    │       ├── onboarding/
    │       │   └── OnboardingModal.vue # 3-Slide Visual Onboarding Interaktif
    │       ├── auth/
    │       │   ├── LoginView.vue       # Form Login & Register Dual Mode
    │       │   └── ForgotPasswordModal.vue # Reset Password via Gmail SMTP
    │       ├── personal/               # Modul Cakue Ku (Mobile Banking)
    │       │   ├── PersonalPortal.vue  # Dashboard Rekening, Utang-Piutang, Mutasi
    │       │   └── QrisActionModal.vue # Modal Catat Keuangan Cepat 100% Light Mode
    │       ├── business/               # Modul Cakue Manage & ERP
    │       │   └── BusinessPortal.vue  # Master ERP Workspace, KPI, Audit Trail Drilldown
    │       ├── cakue-pos/              # Modul Kasir POS
    │       │   ├── PosCashier.vue      # Kasir Cepat, Barcode, Multi-Metode Bayar
    │       │   └── ReceiptModal.vue    # Modal Cetak Thermal (58mm/80mm) & Kirim WA
    │       ├── cakue-manage/           # Modul Manajemen Backoffice
    │       │   ├── BranchStockManager.vue # Mutasi Stok Cabang & Surat Jalan In-Transit
    │       │   ├── BranchManagementView.vue # Manajemen Multi-Cabang, Buka/Tutup & Tim Mandiri
    │       │   └── AssetManager.vue    # Register Aset Fisik & Depresiasi Bulanan
    │       ├── settings/               # Modul Konfigurasi Terpisah (RBAC)
    │       │   ├── ProfileView.vue     # Profil Pengguna, PIN 6-Digit & Manajemen Staf
    │       │   ├── AppSettingsView.vue # Pengaturan Brand Master, Struk 58/80mm & PPN
    │       │   └── SettingsView.vue    # Kompatibilitas Transisi
    │       └── ai/
    │           └── AiCopilotDrawer.vue # AI R&D Business Advisor Slide-Over
```

---

## 6. Panduan Menjalankan Sistem

### 1. Jalankan Frontend (Development Server):
```bash
cd /Users/macbookpro/server/cakue/frontend
npm run dev -- --host
```
> Antarmuka dapat diakses di browser: `http://localhost:5173`

### 2. Jalankan Backend API:
```bash
cd /Users/macbookpro/server/cakue/backend
node src/index.js
```
> Berjalan di port `3001`

### 3. Jalankan Baileys WhatsApp Gateway:
```bash
cd /Users/macbookpro/server/cakue/wa-gateway
node src/index.js
```
> Berjalan di port `3333`

### 4. Build Verifikasi Produksi:
```bash
cd /Users/macbookpro/server/cakue/frontend
npm run build
```
> Menghasilkan bundle produksi statis tanpa error (`dist/`).
