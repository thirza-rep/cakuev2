# 📖 DOKUMEN MASTER ARSITEKTUR & SPESIFIKASI LENGKAP CAKUE

> **Aplikasi:** CAKUE (Catatan Keuangan Gue / Catatan Keuangan & Usaha Enterprise)  
> **Versi:** 2.4.0 (Commercial Onboarding, Google OAuth 2.0 & WhatsApp OTP Activated)  
> **Lisensi:** Open-Source ($0 Cost / Self-Hosted Architecture)  
> **Live Production URL:** [https://cakue.codevits.site](https://cakue.codevits.site)  
> **Home Server Local URL:** `http://192.168.1.13:5173`  
> **GitHub Repository:** [github.com/thirza-rep/cakuev2](https://github.com/thirza-rep/cakuev2) (Branch: `main`)  
> **Terakhir Diperbarui:** 23 Oktober 2026  

---

## DAFTAR ISI
1. [Ikhtisar Produk & Filosofi Arsitektur](#1-ikhtisar-produk--filosofi-arsitektur)
2. [Pemisahan Dua Dunia Finansial (Opsi B)](#2-pemisahan-dua-dunia-finansial-opsi-b)
3. [Alur Komersial: Onboarding, Google OAuth, Kredensial & OTP](#3-alur-komersial-onboarding-google-oauth-kredensial--otp)
4. [Matriks Hak Akses Pengguna (Granular RBAC)](#4-matriks-hak-akses-pengguna-granular-rbac)
5. [Skema Database Lengkap (PostgreSQL 16 ACID)](#5-skema-database-lengkap-postgresql-16-acid)
6. [Katalog Lengkap REST API Engine](#6-katalog-lengkap-rest-api-engine)
   - [API Autentikasi & Keamanan](#a-api-autentikasi--keamanan)
   - [API Master Data & Transaksi](#b-api-master-data--transaksi)
   - [API Microservice WhatsApp Gateway (Baileys)](#c-api-microservice-whatsapp-gateway-baileys)
7. [Infrastruktur Server, Docker & Panduan Deployment](#7-infrastruktur-server-docker--panduan-deployment)

---

## 1. IKHTISAR PRODUK & FILOSOFI ARSITEKTUR

**CAKUE** adalah platform manajemen keuangan cerdas yang memadukan dua kebutuhan mendasar masyarakat dalam satu ekosistem: pencatatan dompet belanja pribadi bergaya perbankan modern dan sistem Enterprise Resource Planning (ERP) kasir toko multi-cabang untuk pelaku usaha/UMKM.

### Prinsip Utama ($0 Cost Architecture):
1. **Nol Biaya Langganan (Zero SaaS Fees):** Seluruh infrastruktur dirancang untuk dapat dijalankan secara mandiri (*self-hosted*) di atas Mini PC rumahan / Home Server menggunakan CasaOS, Docker, dan Cloudflare Tunnel tanpa perlu sewa VPS bulanan mahal.
2. **Kirim Struk WhatsApp Tanpa Kuota API Berbayar:** Menggunakan microservice berbasis Baileys WebSockets yang langsung terhubung ke nomor WhatsApp toko, mengirimkan struk digital resmi ke pembeli dengan biaya Rp 0 per pesan.
3. **100% ACID Ledger (Bebas Halusinasi Data):** Seluruh pencatatan saldo dan mutasi kas menggunakan prinsip akuntansi Double-Entry berstandar SAK EMKM di atas database PostgreSQL 16.
4. **Rich Aesthetics & Zero-Emoticon Policy:** Tampilan bersih (*Light Mode* dominan dengan aksen emerald perbankan), menggunakan tipografi Inter & JetBrains Mono, serta 100% ikon vektor SVG tanpa emoji sistem operasi yang tidak formal.

---

## 2. PEMISAHAN DUA DUNIA FINANSIAL (OPSI B)

Untuk menjamin tidak ada pencampuran dana antara kebutuhan rumah tangga dan operasional usaha, sistem memisahkan pengalaman pengguna menjadi 2 portal mutlak:

### A. Portal Catat Keuangan Pribadi (`PersonalPortal.vue`)
* **Gaya Visual:** Aplikasi Mobile Banking modern (mirip BCA Mobile, Livin', atau Jenius).
* **Fitur Utama:**
  * **Manajemen Multi-Rekening:** Pengelompokan kas fisik tunai, rekening bank (BCA, Mandiri, BRI), dan e-wallet (GoPay, OVO, ShopeePay) dengan indikator visual alami.
  * **Catat Pengeluaran & Pemasukan Cepat:** Modal pop-up responsif (`QrisActionModal.vue`) untuk transaksi instan.
  * **Manajemen Utang & Piutang:** Riwayat cicilan, progress bar pelunasan, dan toggle sinkronisasi otomatis ke kas riil dompet.
  * **Analisis Budgeting 50/30/20:** Pembagian otomatis antara kebutuhan primer (*Needs 50%*), keinginan (*Wants 30%*), dan tabungan/investasi (*Savings 20%*).

### B. Portal SaaS ERP & Kasir Toko (`BusinessPortal.vue`)
* **Gaya Visual:** Enterprise ERP Suite dengan Ribbon & Sidebar bersarang (*Anti-Clutter Constitution*).
* **Fitur Utama:**
  * **Kasir POS Toko Cepat (`PosCashier.vue`):** Katalog produk visual, pencarian instan, integrasi barcode scanner, multi-metode pembayaran (Tunai, QRIS, Transfer), kalkulator uang kembalian, dan cetak struk thermal 58mm/80mm.
  * **Inventaris Multi-Cabang & Gudang Pusat (`BranchStockManager.vue`):** Pengawasan stok di 6 cabang aktif wilayah Yogyakarta + Gudang Pusat Sleman, dengan sistem Surat Jalan Pengiriman stok (*Draft* $\rightarrow$ *In-Transit* $\rightarrow$ *Received*).
  * **Manajemen Aset Tetap & Depresiasi (`AssetManager.vue`):** Inventarisasi aset fisik perusahaan dan kalkulasi beban penyusutan garis lurus bulanan otomatis.
  * **Laporan Mutasi Kas & Ekspor Akuntan:** Penampil spreadsheet in-app, ekspor file Microsoft Excel XML (`.xls`) resmi, CSV UTF-8 bertitik-koma (`;`), serta cetak pratinjau PDF ber-Kop Surat resmi dengan 3 kolom tanda tangan pengesahan.
  * **Kolom Inovasi R&D Bisnis:** Alokasi otomatis 15% laba bersih riil untuk cadangan pengembangan produk baru.

---

## 3. ALUR KOMERSIAL: ONBOARDING, GOOGLE OAUTH, KREDENSIAL & OTP

Aplikasi CAKUE menerapkan standar onboarding komersial 4 tahap yang aman dan terstruktur:

```
+-----------------------------------------------------------------------------------+
| 1. ONBOARDING & PILIH DUNIA AKSES (OnboardingView.vue)                            |
|    - Pilih: Catat Keuangan Pribadi (personal) ATAU SaaS ERP Usaha (business)      |
|    - Klik: "Lanjutkan dengan Akun Google" (Google Identity Services)              |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| 2. GOOGLE OAUTH 2.0 TOKEN VERIFICATION (POST /api/auth/google)                     |
|    - Validasi token ID Google via Google Public API Client ID                     |
|    - Jika User Lama: Langsung login -> Masuk ke Dashboard                         |
|    - Jika User Baru: Kirim status is_new = true -> Buka Modal Kredensial          |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| 3. SETUP KREDENSIAL GANDA (GoogleCredentialModal.vue)                             |
|    - Username unik (@username, min 3 karakter, alfanumerik & underscore)          |
|    - Kata Sandi ganda (minimal 6 karakter kombinasi huruf dan angka)              |
|    - POST /api/auth/register-google -> Simpan password hash (SHA-256)             |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| 4. GERBANG AKTIVASI WAJIB DASHBOARD (ActivationGateModal.vue)                     |
|    - Step 1: Foto Profil (Avatar Google / Preset Modern / Upload File)            |
|    - Step 2: Nama Lengkap Pengguna (minimal 3 karakter)                           |
|    - Step 3: Nomor WhatsApp & Verifikasi OTP (POST /api/auth/send-otp)            |
|              -> Kirim kode 6-digit via Baileys WA Gateway ($0 Cost)               |
|              -> POST /api/auth/verify-otp (Bypass testing: 777888)                |
|    - Selesai: is_profile_complete = true -> Dashboard Terbuka Penuh               |
+-----------------------------------------------------------------------------------+
```

### Detail Kunci Kredensial Google Cloud:
* **Tipe Kredensial:** Web Application Client ID
* **Google Client ID:** `889806958266-7vki80et2obrnsp8ke79c24fd32ur99m.apps.googleusercontent.com`
* **Authorized JavaScript Origins:**
  * `https://cakue.codevits.site` (Akses Publik Cloudflare Tunnel)
  * `http://localhost:5173` (Akses Lokal Mesin Pengembangan)
  * `http://192.168.1.13:5173` (Akses LAN Home Server)

---

## 4. MATRIKS HAK AKSES PENGGUNA (GRANULAR RBAC)

Sistem menerapkan penegakan wewenang mutlak (*Role-Based Access Control*):

| Fitur / Modul Operasional | Super Admin | Owner (Direktur) | Manajer Cabang | Kasir POS Toko | Staff Gudang | Nasabah Personal |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Pilihan Portal Aktif** | Business | Business | Business | Business | Business | Personal |
| **Ringkasan KPI & Omset** | ✅ Penuh | ✅ Penuh | 🔒 Cabang Sendiri | ❌ Diblokir | ❌ Diblokir | ❌ N/A |
| **Kasir POS Toko (`pos`)** | ✅ Semua Cabang | ✅ Semua Cabang | ✅ Cabang Sendiri | ✅ Terkunci Cabang | ❌ Diblokir | ❌ N/A |
| **Inventaris & Logistik** | ✅ Semua Cabang | ✅ Semua Cabang | ✅ Cabang & Gudang | ❌ Diblokir | ✅ Gudang (Masking HPP)| ❌ N/A |
| **Manajemen Aset Tetap** | ✅ Penuh | ✅ Penuh | ❌ Diblokir | ❌ Diblokir | ❌ Diblokir | ❌ N/A |
| **Eksekusi Depresiasi Aset** | ✅ Berwenang | ✅ Berwenang | ❌ Diblokir | ❌ Diblokir | ❌ Diblokir | ❌ N/A |
| **Buka/Tutup Cabang Baru** | ✅ Berwenang | ✅ Berwenang | ❌ Diblokir | ❌ Diblokir | ❌ Diblokir | ❌ N/A |
| **Ubah Harga Master Produk** | ✅ Berwenang | ✅ Berwenang | ❌ Diblokir | ❌ Diblokir | ❌ Diblokir | ❌ N/A |
| **Sinkronisasi Stok ke Kas** | ✅ Berwenang | ✅ Berwenang | ✅ Berwenang | ❌ Diblokir | ❌ Diblokir | ❌ N/A |
| **Manajemen Tim & Staf** | ✅ Semua Cabang | ✅ Semua Cabang | ✅ Staf Cabangnya | ❌ Diblokir | ❌ Diblokir | ❌ N/A |
| **Pengaturan Pajak & Brand** | ✅ Berwenang | ✅ Berwenang | 🔒 Read-Only | ❌ Diblokir | ❌ Diblokir | ❌ N/A |
| **Supervisi Akun Tenant** | ✅ Berwenang | ❌ N/A | ❌ N/A | ❌ N/A | ❌ N/A | ❌ N/A |

---

## 5. SKEMA DATABASE LENGKAP (POSTGRESQL 16 ACID)

Database PostgreSQL berjalan di container Docker `cakue-postgres` pada port internal `5432` (diexpose ke port host `5433`).

```sql
-- 1. CABANG USAHA & GUDANG PUSAT
CREATE TABLE IF NOT EXISTS branches (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('warehouse', 'branch')),
    city VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(30),
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'renovation')),
    manager_name VARCHAR(100),
    operating_hours VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USER SESSIONS, KEAMANAN & OTENTIKASI (RBAC)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    phone_verified BOOLEAN DEFAULT FALSE,
    otp_code VARCHAR(10),
    otp_expires_at TIMESTAMP,
    is_profile_complete BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255),
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('personal', 'business')),
    role VARCHAR(30) NOT NULL CHECK (role IN ('superadmin', 'owner', 'manager', 'cashier', 'warehouse', 'personal')),
    branch_id VARCHAR(50) REFERENCES branches(id) ON DELETE SET NULL,
    avatar_url TEXT,
    pin_hash VARCHAR(255),
    last_login TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. MASTER PRODUK & KATALOG
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    cost_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    unit VARCHAR(20) NOT NULL DEFAULT 'pcs',
    min_stock INTEGER NOT NULL DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ALOKASI STOK MULTI-CABANG (RELASI PRODUK & CABANG)
CREATE TABLE IF NOT EXISTS branch_stock (
    product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
    branch_id VARCHAR(50) REFERENCES branches(id) ON DELETE CASCADE,
    stock INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id, branch_id)
);

-- 5. BAGAN AKUN STANDAR (CHART OF ACCOUNTS - SAK EMKM)
CREATE TABLE IF NOT EXISTS accounts (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
    normal_balance VARCHAR(10) NOT NULL CHECK (normal_balance IN ('debit', 'credit')),
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. DOUBLE-ENTRY JOURNAL ENTRIES (BUKU BESAR AKUNTANSI)
CREATE TABLE IF NOT EXISTS journal_entries (
    id VARCHAR(50) PRIMARY KEY,
    entry_number VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL,
    ref_type VARCHAR(50) NOT NULL,
    ref_id VARCHAR(50),
    branch_id VARCHAR(50) REFERENCES branches(id) ON DELETE SET NULL,
    notes TEXT,
    created_by VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. BARIS JURNAL DEBET & KREDIT (MUTLAK SEIMBANG)
CREATE TABLE IF NOT EXISTS journal_lines (
    id BIGSERIAL PRIMARY KEY,
    entry_id VARCHAR(50) REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id VARCHAR(50) REFERENCES accounts(id) ON DELETE RESTRICT,
    debit NUMERIC(15, 2) NOT NULL DEFAULT 0,
    credit NUMERIC(15, 2) NOT NULL DEFAULT 0
);

-- 8. MANAJEMEN ASET TETAP & REGISTER DEPRESIASI
CREATE TABLE IF NOT EXISTS assets (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    branch_id VARCHAR(50) REFERENCES branches(id) ON DELETE SET NULL,
    purchase_date DATE NOT NULL,
    purchase_price NUMERIC(15, 2) NOT NULL,
    salvage_value NUMERIC(15, 2) NOT NULL DEFAULT 0,
    useful_life_years INTEGER NOT NULL DEFAULT 4,
    accumulated_depreciation NUMERIC(15, 2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disposed', 'maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. PENCATATAN UTANG & PIUTANG (PERSONAL & BUSINESS)
CREATE TABLE IF NOT EXISTS debts (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('payable', 'receivable')),
    person_name VARCHAR(100) NOT NULL,
    total_amount NUMERIC(15, 2) NOT NULL,
    paid_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    due_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partial', 'paid')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 6. KATALOG LENGKAP REST API ENGINE

Semua endpoint backend REST API berjalan di port `3001` dengan base URL:  
* **Eksternal / Domain:** `https://cakue.codevits.site/api`
* **Internal Server / LAN:** `http://192.168.1.13:3001/api`

---

### A. API AUTENTIKASI & KEAMANAN

#### 1. Diagnostik Kesehatan Server
* **Method:** `GET`
* **Endpoint:** `/api/health`
* **Deskripsi:** Memeriksa kesiapan Express API, konektivitas database PostgreSQL, dan status URL WhatsApp Gateway.
* **Response Contoh (200 OK):**
```json
{
  "status": "ONLINE",
  "service": "CAKUE Backend & Inventory Ledger Engine",
  "database": "PostgreSQL (Connected)",
  "dbDetails": {
    "connected": true,
    "details": {
      "current_time": "2026-10-22T21:27:20.429Z",
      "db_name": "cakue_db"
    }
  },
  "waGatewayUrl": "http://wa-gateway:3333",
  "timestamp": "2026-10-22T21:27:20.431Z"
}
```

#### 2. Autentikasi Pengguna (Login Email / Username)
* **Method:** `POST`
* **Endpoint:** `/api/auth/login`
* **Deskripsi:** Menerima login menggunakan alamat email atau username akun, mencocokkan hash password SHA-256.
* **Request Body:**
```json
{
  "identifier": "budi_santoso",
  "password": "Password123"
}
```
*Catatan: Parameter `email` atau `username` juga diterima sebagai alias `identifier`.*
* **Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "Selamat datang kembali, Budi Santoso!",
  "user": {
    "id": "usr-personal",
    "username": "budi_santoso",
    "email": "budi.santoso@cakue.id",
    "name": "Budi Santoso",
    "phone": "6281234567890",
    "phone_verified": true,
    "is_profile_complete": true,
    "account_type": "business",
    "role": "owner",
    "branch_id": "jogja-1",
    "branch_name": "Cabang 1 - Malioboro",
    "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    "created_at": "2026-10-14T13:25:23.000Z"
  }
}
```
* **Response Gagal (401 / 404):**
```json
{
  "success": false,
  "message": "Kata sandi tidak sesuai. Silakan periksa kembali!"
}
```

#### 3. Autentikasi Google OAuth 2.0 (ID Token Verify)
* **Method:** `POST`
* **Endpoint:** `/api/auth/google`
* **Deskripsi:** Menerima ID Token Google dari Google Identity Services (`window.google.accounts.id`), memverifikasi ke Google OAuth API, dan mengecek ketersediaan akun di database.
* **Request Body:**
```json
{
  "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6...",
  "account_type": "business",
  "role": "owner",
  "branch_id": "jogja-1"
}
```
* **Response Kasus 1: Pengguna Baru (`is_new: true`):**
```json
{
  "success": true,
  "is_new": true,
  "message": "Autentikasi Google berhasil! Silakan tentukan username dan kata sandi Anda.",
  "google_data": {
    "email": "dimas.pratama@gmail.com",
    "name": "Dimas Pratama",
    "avatar_url": "https://lh3.googleusercontent.com/a/ACg8oc...",
    "google_id": "108392019482019482019"
  }
}
```
* **Response Kasus 2: Pengguna Terdaftar (`is_new: false`):**
```json
{
  "success": true,
  "is_new": false,
  "message": "Selamat datang kembali, Dimas Pratama!",
  "user": {
    "id": "usr-g-mvk07i1x",
    "username": "dimas_pratama",
    "email": "dimas.pratama@gmail.com",
    "name": "Dimas Pratama",
    "phone_verified": true,
    "is_profile_complete": true
  }
}
```

#### 4. Pendaftaran Akun Google dengan Kredensial Baru
* **Method:** `POST`
* **Endpoint:** `/api/auth/register-google`
* **Deskripsi:** Menyimpan akun baru dari Google OAuth dengan username dan kata sandi yang telah ditentukan pengguna.
* **Request Body:**
```json
{
  "email": "dimas.pratama@gmail.com",
  "name": "Dimas Pratama",
  "avatar_url": "https://lh3.googleusercontent.com/a/ACg8oc...",
  "username": "dimas_cakue",
  "password": "Password123",
  "account_type": "business",
  "role": "owner",
  "branch_id": "jogja-1"
}
```
* **Aturan Validasi:**
  * `username`: Minimal 3 karakter, hanya boleh berupa huruf, angka, dan garis bawah (`/^[a-zA-Z0-9_]+$/`).
  * `password`: Minimal 6 karakter, wajib mengombinasikan huruf dan angka (`/^(?=.*[A-Za-z])(?=.*\d)/`).
* **Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "Selamat datang di CAKUE, Dimas Pratama! Akun Anda berhasil dibuat.",
  "user": {
    "id": "usr-g-1763910",
    "username": "dimas_cakue",
    "email": "dimas.pratama@gmail.com",
    "name": "Dimas Pratama",
    "phone_verified": false,
    "is_profile_complete": false,
    "account_type": "business",
    "role": "owner"
  }
}
```

#### 5. Kirim Kode Verifikasi WhatsApp OTP
* **Method:** `POST`
* **Endpoint:** `/api/auth/send-otp`
* **Deskripsi:** Menormalisasi nomor telepon Indonesia (`08xx` $\rightarrow$ `628xx`), menegakkan rate-limit 60 detik, membuat kode OTP 6-digit acak (berlaku 5 menit), dan mengirimkannya via WhatsApp Gateway internal.
* **Request Body:**
```json
{
  "user_id": "usr-g-1763910",
  "phone": "081234567890"
}
```
* **Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "Kode OTP 6-digit telah dikirim ke nomor WhatsApp 081234567890.",
  "phone": "6281234567890",
  "expiresInSeconds": 300,
  "wa_dispatched": true
}
```
* **Response Rate Limit (429 Too Many Requests):**
```json
{
  "success": false,
  "message": "Mohon tunggu 48 detik lagi sebelum meminta kode OTP baru."
}
```

#### 6. Verifikasi Kode OTP WhatsApp
* **Method:** `POST`
* **Endpoint:** `/api/auth/verify-otp`
* **Deskripsi:** Memvalidasi kode OTP 6-digit yang diterima user. Jika cocok dan belum kedaluwarsa, mengaktifkan `phone_verified = true` dan mengecek kesiapan profil lengkap. Mendukung kode bypass darurat testing: `777888`.
* **Request Body:**
```json
{
  "user_id": "usr-g-1763910",
  "otp": "491823"
}
```
* **Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "Nomor WhatsApp Anda berhasil diverifikasi!",
  "user": {
    "id": "usr-g-1763910",
    "phone": "6281234567890",
    "phone_verified": true,
    "is_profile_complete": true
  }
}
```

#### 7. Update Foto Profil & Nama Lengkap
* **Method:** `PUT`
* **Endpoint:** `/api/auth/update-profile`
* **Deskripsi:** Memperbarui nama lengkap, foto avatar (URL / base64), dan username. Jika nama lengkap ada, foto ada, dan nomor WA telah diverifikasi, sistem otomatis menyetel `is_profile_complete = true`.
* **Request Body:**
```json
{
  "user_id": "usr-g-1763910",
  "name": "Dimas Pratama, S.E.",
  "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
  "username": "dimas_pratama"
}
```
* **Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "Profil berhasil diperbarui!",
  "user": {
    "id": "usr-g-1763910",
    "name": "Dimas Pratama, S.E.",
    "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    "username": "dimas_pratama",
    "phone_verified": true,
    "is_profile_complete": true
  }
}
```

---

### B. API MASTER DATA & TRANSAKSI

#### 1. Ambil Katalog Produk & Stok Cabang
* **Method:** `GET`
* **Endpoint:** `/api/products`
* **Deskripsi:** Mengambil seluruh daftar produk berserta kategori, harga jual, harga pokok (HPP), dan agregasi total stok riil.
* **Response Contoh (200 OK):**
```json
{
  "success": true,
  "count": 4,
  "products": [
    {
      "id": "prod-1",
      "name": "Cakue Original Gurih",
      "category": "Makanan Siap Saji",
      "price": 5000,
      "cost_price": 2500,
      "unit": "pcs",
      "min_stock": 20,
      "is_active": true,
      "total_stock": 350
    }
  ]
}
```

#### 2. Ambil Daftar Jaringan Multi-Cabang
* **Method:** `GET`
* **Endpoint:** `/api/branches`
* **Deskripsi:** Mengambil seluruh data cabang operasional dan hub distribusi gudang pusat.
* **Response Contoh (200 OK):**
```json
{
  "success": true,
  "branches": [
    {
      "id": "jogja-wh",
      "code": "WH-JOG",
      "name": "Gudang Pusat Jogja (Hub Distribusi)",
      "type": "warehouse",
      "city": "Sleman, DIY",
      "status": "open",
      "manager_name": "Hendra Wijaya"
    },
    {
      "id": "jogja-1",
      "code": "JOG-01",
      "name": "Cabang 1 - Malioboro",
      "type": "branch",
      "city": "Kota Yogyakarta",
      "status": "open",
      "manager_name": "Ahmad Fauzi"
    }
  ]
}
```

#### 3. Ambil Riwayat Transaksi Penjualan & Pembukuan
* **Method:** `GET`
* **Endpoint:** `/api/transactions`
* **Deskripsi:** Mengambil daftar transaksi buku besar kas/bank yang tercatat di database PostgreSQL.

#### 4. Ringkasan Metrik AI R&D Business Growth
* **Method:** `GET`
* **Endpoint:** `/api/ai/metrics-summary`
* **Deskripsi:** Menghitung ringkasan laba bersih, alokasi 15% cadangan riset dan pengembangan (R&D), serta data pendukung untuk AI Copilot Advisor.
* **Response Contoh (200 OK):**
```json
{
  "success": true,
  "metrics": {
    "totalOmset": 37500000,
    "operationalExpense": 12800000,
    "netProfit": 24700000,
    "rdBudget15Percent": 3705000,
    "healthStatus": "Sangat Sehat (Margin 65.8%)"
  }
}
```

---

### C. API MICROSERVICE WHATSAPP GATEWAY (BAILEYS)

WhatsApp Gateway berjalan sebagai microservice mandiri pada port `3333` (`http://wa-gateway:3333`):

#### 1. Periksa Status Koneksi WhatsApp
* **Method:** `GET`
* **Endpoint:** `http://192.168.1.13:3333/api/status`
* **Response Saat Terhubung:**
```json
{
  "status": "CONNECTED",
  "user": {
    "id": "6285171739541:5@s.whatsapp.net",
    "name": "CAKUE Official Bot"
  },
  "hasQr": false,
  "timestamp": "2026-10-23T04:20:00.000Z"
}
```

#### 2. Dapatkan QR Code Pairing Baru
* **Method:** `GET`
* **Endpoint:** `http://192.168.1.13:3333/api/qr`
* **Deskripsi:** Mengembalikan gambar QR Code (format Data URL Base64 PNG) jika koneksi berada pada status `WAITING_QR`.

#### 3. Kirim Pesan Teks / Notifikasi Sistem
* **Method:** `POST`
* **Endpoint:** `http://192.168.1.13:3333/api/send-message`
* **Request Body:**
```json
{
  "phone": "6281234567890",
  "message": "🔐 *KODE OTP CAKUE: 491823*\n\nJangan bagikan kode ini kepada siapapun."
}
```

#### 4. Kirim Struk Digital Resmi Transaksi POS
* **Method:** `POST`
* **Endpoint:** `http://192.168.1.13:3333/api/send-receipt`
* **Request Body:**
```json
{
  "phone": "081234567890",
  "customerName": "Ibu Ratna Dewi",
  "orderId": "TRX-20261023-0042",
  "total": 45000,
  "subtotal": 40540,
  "tax": 4460,
  "paymentMethod": "QRIS",
  "branchName": "Cabang 1 - Malioboro",
  "items": [
    { "name": "Cakue Original", "qty": 5, "price": 5000 },
    { "name": "Roti Bantal Cokelat", "qty": 4, "price": 5000 }
  ]
}
```
* **Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "Struk #TRX-20261023-0042 berhasil dikirim ke nomor 081234567890",
  "sentAt": "2026-10-23T04:22:15.120Z"
}
```

---

## 7. INFRASTRUKTUR SERVER, DOCKER & PANDUAN DEPLOYMENT

### A. Pemetaan Port Container Home Server (Mini PC 192.168.1.13)
* **Frontend Web App (Nginx SPA):** `0.0.0.0:5173` $\rightarrow$ Container port `80`
* **Backend REST API (Node Express):** `0.0.0.0:3001` $\rightarrow$ Container port `3001`
* **WhatsApp Gateway (Baileys):** `0.0.0.0:3333` $\rightarrow$ Container port `3333`
* **PostgreSQL Database Engine:** `0.0.0.0:5433` $\rightarrow$ Container port `5432`
* **Adminer Web Database GUI:** `0.0.0.0:8088` $\rightarrow$ Container port `8080`

### B. Konfigurasi Lingkungan (`docker-compose.server.yml`)
```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: cakue-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: cakue_db
      POSTGRES_USER: cakue_user
      POSTGRES_PASSWORD: cakue_password_secure2026
    ports:
      - "5433:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./backend/schema.sql:/docker-entrypoint-initdb.d/01_schema.sql:ro

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: cakue-backend
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
      - DATABASE_URL=postgresql://cakue_user:cakue_password_secure2026@postgres:5432/cakue_db
      - WA_GATEWAY_URL=http://wa-gateway:3333
    depends_on:
      postgres:
        condition: service_healthy

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: cakue-frontend
    restart: unless-stopped
    ports:
      - "5173:80"
```

### C. Alur 1-Click Update & Auto-Deploy (`./update.sh`)
Untuk mempublikasikan pembaruan fitur ke Home Server dan GitHub sekaligus, cukup jalankan satu perintah:

```bash
cd /Users/macbookpro/server/cakue
./update.sh "pesan rilis pembaruan"
```

Skrip ini secara otomatis mengeksekusi:
1. Mendeteksi rute koneksi server lokal (`192.168.1.13`) maupun jaringan Tailscale Mesh (`100.88.200.16`).
2. Mensinkronkan seluruh file kode sumber via `rsync`.
3. Membangun ulang (*build & recreate*) container `cakue-backend` dan `cakue-frontend` di Mini PC tanpa henti.
4. Membuat commit Git rapi dan mengunggah (*push*) ke repositori GitHub `thirza-rep/cakuev2`.
5. Memicu GitHub Actions untuk mem-build file installer Android APK dan Windows EXE di cloud.

---

> 🏛️ **Dokumen ini adalah referensi kebenaran tunggal (*Single Source of Truth*) untuk pengembangan, audit, dan integrasi API CAKUE.**
