-- ==============================================================
-- CAKUE DATABASE SCHEMA (PostgreSQL - 100% ACID & Zero-Hallucination)
-- ==============================================================

-- 1. Tabel Cabang & Lokasi
CREATE TABLE IF NOT EXISTS branches (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('warehouse', 'branch')),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Master Produk
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    cost_price NUMERIC(15, 2) NOT NULL, -- HPP
    selling_price NUMERIC(15, 2) NOT NULL,
    min_alert_qty INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. INVENTORY MOVEMENT LEDGER (Mutasi Stok Presisi)
-- Mencegah selisih stok / balapan transaksi
CREATE TABLE IF NOT EXISTS inventory_ledger (
    id BIGSERIAL PRIMARY KEY,
    product_id VARCHAR(50) REFERENCES products(id),
    branch_id VARCHAR(50) REFERENCES branches(id),
    change_qty INT NOT NULL, -- positif = masuk, negatif = keluar
    reference_type VARCHAR(50) NOT NULL, -- 'POS_SALE', 'TRANSFER_IN', 'TRANSFER_OUT', 'PURCHASE', 'OPNAME'
    reference_id VARCHAR(100), -- ID Order POS atau ID Surat Jalan
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. SURAT JALAN & TRANSFER ANTAR CABANG
CREATE TABLE IF NOT EXISTS stock_transfers (
    id VARCHAR(50) PRIMARY KEY,
    from_branch_id VARCHAR(50) REFERENCES branches(id),
    to_branch_id VARCHAR(50) REFERENCES branches(id),
    driver_name VARCHAR(100),
    status VARCHAR(20) NOT NULL CHECK (status IN ('DRAFT', 'IN_TRANSIT', 'RECEIVED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    received_at TIMESTAMP
);

-- 5. DOUBLE-ENTRY FINANCIAL BOOKKEEPING (Buku Besar Keuangan)
CREATE TABLE IF NOT EXISTS accounts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('CASH', 'BANK', 'EWALLET', 'RECEIVABLE', 'PAYABLE', 'EQUITY', 'REVENUE', 'EXPENSE')),
    current_balance NUMERIC(15, 2) DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS journal_entries (
    id BIGSERIAL PRIMARY KEY,
    transaction_date DATE NOT NULL,
    description TEXT NOT NULL,
    reference_no VARCHAR(100), -- No Order / No Invoice
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS journal_lines (
    id BIGSERIAL PRIMARY KEY,
    journal_id BIGINT REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id VARCHAR(50) REFERENCES accounts(id),
    debit NUMERIC(15, 2) DEFAULT 0.00,
    credit NUMERIC(15, 2) DEFAULT 0.00
);

-- 6. USER SESSIONS & HAK AKSES (RBAC)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    password_hash VARCHAR(255),
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('personal', 'business')),
    role VARCHAR(30) NOT NULL CHECK (role IN ('owner', 'manager', 'cashier', 'warehouse', 'personal')),
    branch_id VARCHAR(50) REFERENCES branches(id),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Seed Data Cabang & Gudang
INSERT INTO branches (id, name, type, address) VALUES
('wh-1', 'Gudang Pusat (Central Hub)', 'warehouse', 'Kawasan Industri Pulogadung, Jakarta Timur'),
('br-1', 'Cabang Jakarta Selatan', 'branch', 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan'),
('br-2', 'Cabang Bandung Dago', 'branch', 'Jl. Ir. H. Juanda No. 108, Dago, Bandung'),
('br-3', 'Cabang Surabaya Gubeng', 'branch', 'Jl. Pemuda No. 15, Gubeng, Surabaya')
ON CONFLICT (id) DO NOTHING;

-- Seed Data Pengguna untuk Simulasi Hak Akses (RBAC)
INSERT INTO users (id, email, name, phone, account_type, role, branch_id) VALUES
('usr-owner', 'owner@cakuenusantara.com', 'Budi Santoso', '081234567890', 'business', 'owner', 'br-1'),
('usr-manager', 'manager.dago@cakuenusantara.com', 'Siti Rahmawati', '081298765432', 'business', 'manager', 'br-2'),
('usr-cashier', 'kasir.jaksel@cakuenusantara.com', 'Andi Pratama', '081311223344', 'business', 'cashier', 'br-1'),
('usr-warehouse', 'gudang.pusat@cakuenusantara.com', 'Hendra Wijaya', '081355667788', 'business', 'warehouse', 'wh-1'),
('usr-personal', 'budi.santoso@cakue.id', 'Budi Santoso', '081234567890', 'personal', 'personal', NULL)
ON CONFLICT (id) DO NOTHING;
