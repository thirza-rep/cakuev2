import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { api } from '../api/client.js'
import { useFinanceStore } from './financeStore'
import { useStockStore } from './stockStore'
import { usePosStore } from './posStore'
import { useSettingsStore } from './settingsStore'

// 1. DEFINISI ROLE & MATRIX HAK AKSES (RBAC) ENTERPRISE
export const ROLES = {
  OWNER: {
    id: 'owner',
    title: 'Owner & Direktur',
    badge: 'Owner (Super Admin)',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    allowedModules: ['dashboard', 'analytics', 'pos', 'inventory', 'assets', 'journal', 'branches', 'settings', 'profile'],
    defaultModule: 'dashboard',
    canSwitchBranch: true,
    canExportReports: true,
    canViewFinancialAudit: true,
    canManageStock: true,
    canAddProduct: true,
    canEditProductPrice: true,
    canSyncStockToFinance: true,
    canDeleteProduct: true,
    canManageStaff: true,
    canManageBranches: true,
    canDeleteBranch: true,
    canEditAppBranding: true,
    canEditFinancialSettings: true,
    canManageAssets: true,
    canDeleteAsset: true,
    canRunDepreciation: true,
    description: 'Akses penuh tanpa batas ke semua cabang, buka/tutup/hapus cabang, staf & konfigurasi sistem'
  },
  MANAGER: {
    id: 'manager',
    title: 'Manajer Cabang',
    badge: 'Manajer Cabang',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    allowedModules: ['dashboard', 'analytics', 'pos', 'inventory', 'journal', 'branches', 'settings', 'profile'],
    defaultModule: 'dashboard',
    canSwitchBranch: true,
    canExportReports: true,
    canViewFinancialAudit: true,
    canManageStock: true,
    canAddProduct: true,
    canEditProductPrice: false,
    canSyncStockToFinance: true,
    canDeleteProduct: false,
    canManageStaff: true,
    canManageBranches: true,
    canDeleteBranch: false,
    canEditAppBranding: false,
    canEditFinancialSettings: false,
    canManageAssets: false,
    canDeleteAsset: false,
    canRunDepreciation: false,
    description: 'Akses operasional, kasir POS, buka/tutup toko cabang, staf cabang, dan pengaturan cabang toko'
  },
  CASHIER: {
    id: 'cashier',
    title: 'Kasir POS Toko',
    badge: 'Kasir Toko',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    allowedModules: ['pos', 'profile'],
    defaultModule: 'pos',
    canSwitchBranch: false,
    canExportReports: false,
    canViewFinancialAudit: false,
    canManageStock: false,
    canAddProduct: false,
    canEditProductPrice: false,
    canSyncStockToFinance: false,
    canDeleteProduct: false,
    canManageStaff: false,
    canManageBranches: false,
    canDeleteBranch: false,
    canEditAppBranding: false,
    canEditFinancialSettings: false,
    canManageAssets: false,
    canDeleteAsset: false,
    canRunDepreciation: false,
    assignedBranch: 'Cabang Jakarta Selatan',
    description: 'Akses terbatas khusus modul Kasir POS dan profil akun pada cabang penugasan'
  },
  WAREHOUSE: {
    id: 'warehouse',
    title: 'Staff Gudang & Logistik',
    badge: 'Staff Gudang',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    allowedModules: ['inventory', 'profile'],
    defaultModule: 'inventory',
    canSwitchBranch: false,
    canExportReports: false,
    canViewFinancialAudit: false,
    canManageStock: true,
    canAddProduct: false,
    canEditProductPrice: false,
    canSyncStockToFinance: false,
    canDeleteProduct: false,
    canManageStaff: false,
    canManageBranches: false,
    canDeleteBranch: false,
    canEditAppBranding: false,
    canEditFinancialSettings: false,
    canManageAssets: false,
    canDeleteAsset: false,
    canRunDepreciation: false,
    assignedBranch: 'Gudang Pusat (Central Hub)',
    description: 'Akses terbatas khusus modul Inventaris Stok, Surat Jalan dan profil akun'
  }
}

export const useAuthStore = defineStore('auth', () => {
  // Session Persistence via LocalStorage (Default ke false agar pengguna baru disambut Onboarding Utama)
  const savedAuth = localStorage.getItem('cakue_is_authenticated')
  const isAuthenticated = ref(savedAuth !== null ? savedAuth === 'true' : false)
  const showOnboarding = ref(false)

  // Jenis akun terpisah mutlak (Opsi B): 'personal' atau 'business'
  const savedAccountType = localStorage.getItem('cakue_account_type')
  const accountType = ref(savedAccountType || 'business')

  // Peran Bisnis Aktif (RBAC)
  const savedRole = localStorage.getItem('cakue_business_role')
  const activeBusinessRole = ref(savedRole || 'owner')

  const appMode = computed({
    get: () => accountType.value,
    set: (val) => { 
      accountType.value = val 
      localStorage.setItem('cakue_account_type', val)
    }
  })

  // Membaca Data Pengguna Aktif dari Sesi LocalStorage
  const savedUserJson = localStorage.getItem('cakue_current_user')
  let parsedUser = null
  if (savedUserJson) {
    try {
      parsedUser = JSON.parse(savedUserJson)
    } catch (e) {}
  }

  // Migrasi otomatis ke Master Administrator (Full Akses & Bersih) jika sesi browser masih Budi Santoso
  const activeAccountMode = localStorage.getItem('cakue_active_account_mode')
  const isLegacyBudi = !parsedUser || 
    parsedUser.email === 'budi.santoso@cakue.id' || 
    parsedUser.email === 'owner@cakuenusantara.com' || 
    parsedUser.name === 'Budi Santoso' ||
    !parsedUser.email

  if (isLegacyBudi && activeAccountMode !== 'dummy') {
    parsedUser = {
      id: 'usr-master-admin',
      name: 'Master Administrator',
      email: 'admin@cakue.id',
      phone: '0812-0000-0001',
      account_type: 'business',
      role: 'owner',
      branch_id: 'jogja-1',
      branch_name: 'Cabang 1 - Malioboro'
    }
    localStorage.setItem('cakue_current_user', JSON.stringify(parsedUser))
    localStorage.setItem('cakue_is_authenticated', 'true')
    localStorage.setItem('cakue_account_type', 'business')
    localStorage.setItem('cakue_user_name', 'Master Administrator')
    localStorage.setItem('cakue_user_email', 'admin@cakue.id')
    localStorage.setItem('cakue_current_branch', 'Cabang 1 - Malioboro')
    localStorage.setItem('cakue_active_account_mode', 'master')
  }

  // Data Pengguna Sesuai Jenis Akun
  const personalUser = ref({
    name: parsedUser?.account_type === 'personal' ? parsedUser.name : 'Budi Santoso (Dummy / Demo)',
    email: parsedUser?.account_type === 'personal' ? parsedUser.email : 'budi.santoso@cakue.id',
    accountNumber: parsedUser?.phone || '5420-8819-2041',
    role: 'Nasabah Pribadi',
    joinedDate: 'Oktober 2026'
  })

  const businessUser = ref({
    name: parsedUser?.name || 'Master Administrator',
    email: parsedUser?.email || 'admin@cakue.id',
    companyName: 'PT CAKUE Nusantara Berkah (Jogja)',
    role: ROLES[(parsedUser?.role || activeBusinessRole.value).toUpperCase()]?.title || 'Owner & Direktur',
    currentBranch: localStorage.getItem('cakue_current_branch') || parsedUser?.branch_name || 'Cabang 1 - Malioboro'
  })

  const user = computed(() => {
    return accountType.value === 'personal' ? personalUser.value : businessUser.value
  })

  // Master 6 Cabang Wilayah Jogja + Gudang Pusat Jogja
  const defaultBranches = [
    {
      id: 'jogja-wh',
      code: 'WH-JOG',
      name: 'Gudang Pusat Jogja (Hub Distribusi)',
      type: 'warehouse',
      city: 'Sleman, DIY',
      address: 'Kawasan Pergudangan Maguwoharjo, Sleman, D.I. Yogyakarta',
      phone: '0811-2233-4455',
      status: 'open',
      managerName: 'Hendra Wijaya',
      operatingHours: '24 Jam Operasional',
      createdAt: '2026-10-21'
    },
    {
      id: 'jogja-1',
      code: 'JOG-01',
      name: 'Cabang 1 - Malioboro',
      type: 'branch',
      city: 'Kota Yogyakarta',
      address: 'Jl. Malioboro No. 12, Danurejan, Kota Yogyakarta',
      phone: '0812-9988-7711',
      status: 'open',
      managerName: 'Ahmad Fauzi',
      operatingHours: '08:00 - 23:00 WIB',
      createdAt: '2026-10-21'
    },
    {
      id: 'jogja-2',
      code: 'JOG-02',
      name: 'Cabang 2 - Gejayan',
      type: 'branch',
      city: 'Sleman, DIY',
      address: 'Jl. Affandi (Gejayan) No. 45, Caturtunggal, Sleman',
      phone: '0813-7766-5544',
      status: 'open',
      managerName: 'Siti Rahmawati',
      operatingHours: '08:00 - 22:30 WIB',
      createdAt: '2026-10-21'
    },
    {
      id: 'jogja-3',
      code: 'JOG-03',
      name: 'Cabang 3 - Kaliurang',
      type: 'branch',
      city: 'Sleman, DIY',
      address: 'Jl. Kaliurang KM 5.2 No. 8, Sinduadi, Mlati, Sleman',
      phone: '0815-4433-2211',
      status: 'open',
      managerName: 'Rian Santoso',
      operatingHours: '07:30 - 23:00 WIB',
      createdAt: '2026-10-21'
    },
    {
      id: 'jogja-4',
      code: 'JOG-04',
      name: 'Cabang 4 - Seturan',
      type: 'branch',
      city: 'Sleman, DIY',
      address: 'Jl. Seturan Raya No. 23, Kledokan, Caturtunggal, Sleman',
      phone: '0816-1234-5678',
      status: 'open',
      managerName: 'Dimas Kurniawan',
      operatingHours: '09:00 - 24:00 WIB',
      createdAt: '2026-10-21'
    },
    {
      id: 'jogja-5',
      code: 'JOG-05',
      name: 'Cabang 5 - Kotagede',
      type: 'branch',
      city: 'Kota Yogyakarta',
      address: 'Jl. Mondorakan No. 17, Kotagede, Kota Yogyakarta',
      phone: '0817-9876-5432',
      status: 'open',
      managerName: 'Tri Haryanto',
      operatingHours: '08:00 - 21:30 WIB',
      createdAt: '2026-10-21'
    },
    {
      id: 'jogja-6',
      code: 'JOG-06',
      name: 'Cabang 6 - Bantul',
      type: 'branch',
      city: 'Bantul, DIY',
      address: 'Jl. Jend. Sudirman No. 88, Nyeparan, Bantul',
      phone: '0818-5544-3322',
      status: 'open',
      managerName: 'Bambang Sutrisno',
      operatingHours: '08:00 - 22:00 WIB',
      createdAt: '2026-10-21'
    }
  ]

  const savedBranches = localStorage.getItem('cakue_branches')
  let initialBranches = defaultBranches
  if (savedBranches) {
    try {
      const parsed = JSON.parse(savedBranches)
      if (Array.isArray(parsed) && parsed.length > 0) {
        initialBranches = parsed.map(b => {
          const def = defaultBranches.find(d => d.id === b.id)
          return {
            status: 'open',
            code: b.code || (def ? def.code : 'OUT-01'),
            city: b.city || (def ? def.city : 'Kota'),
            address: b.address || (def ? def.address : 'Alamat Toko Cabang'),
            phone: b.phone || (def ? def.phone : '0812-0000-0000'),
            managerName: b.managerName || (def ? def.managerName : 'Manajer Cabang'),
            operatingHours: b.operatingHours || (def ? def.operatingHours : '08:00 - 22:00 WIB'),
            createdAt: b.createdAt || (def ? def.createdAt : '2025-01-01'),
            ...b
          }
        })
      }
    } catch (e) {
      initialBranches = defaultBranches
    }
  }

  const branches = ref(initialBranches)
  watch(branches, (val) => localStorage.setItem('cakue_branches', JSON.stringify(val)), { deep: true })

  // RBAC Helpers & Getters
  const currentRoleConfig = computed(() => {
    return ROLES[activeBusinessRole.value.toUpperCase()] || ROLES.OWNER
  })

  const isOwner = computed(() => activeBusinessRole.value === 'owner')
  const isManager = computed(() => activeBusinessRole.value === 'manager')
  const isCashier = computed(() => activeBusinessRole.value === 'cashier')
  const isWarehouse = computed(() => activeBusinessRole.value === 'warehouse')

  const canExportReports = computed(() => Boolean(currentRoleConfig.value.canExportReports))
  const canViewFinancialAudit = computed(() => Boolean(currentRoleConfig.value.canViewFinancialAudit))

  const canManageStock = computed(() => Boolean(currentRoleConfig.value.canManageStock))
  const canAddProduct = computed(() => Boolean(currentRoleConfig.value.canAddProduct))
  const canEditProductPrice = computed(() => Boolean(currentRoleConfig.value.canEditProductPrice))
  const canSyncStockToFinance = computed(() => Boolean(currentRoleConfig.value.canSyncStockToFinance))
  const canDeleteProduct = computed(() => Boolean(currentRoleConfig.value.canDeleteProduct))
  const canManageStaff = computed(() => Boolean(currentRoleConfig.value.canManageStaff))
  const canManageBranches = computed(() => Boolean(currentRoleConfig.value.canManageBranches))
  const canDeleteBranch = computed(() => Boolean(currentRoleConfig.value.canDeleteBranch))
  const canEditAppBranding = computed(() => Boolean(currentRoleConfig.value.canEditAppBranding))
  const canEditFinancialSettings = computed(() => Boolean(currentRoleConfig.value.canEditFinancialSettings))
  const canManageAssets = computed(() => Boolean(currentRoleConfig.value.canManageAssets))
  const canDeleteAsset = computed(() => Boolean(currentRoleConfig.value.canDeleteAsset))
  const canRunDepreciation = computed(() => Boolean(currentRoleConfig.value.canRunDepreciation))

  function canAccess(moduleId) {
    if (moduleId === 'profile') return true
    if (accountType.value === 'personal') {
      return moduleId === 'profile' || moduleId === 'settings'
    }
    return currentRoleConfig.value.allowedModules.includes(moduleId)
  }

  // Aksi CRUD Cabang (Buka Cabang Baru, Tutup Toko, Hapus Cabang)
  function addBranch({ name, code, type = 'branch', city = '', address = '', phone = '', managerName = '', operatingHours = '08:00 - 22:00 WIB' }) {
    const newId = `br-${Date.now().toString(36)}`
    const newBranch = {
      id: newId,
      code: code ? code.trim().toUpperCase() : `CBG-${branches.value.length + 1}`,
      name: name.trim(),
      type: type || 'branch',
      city: city.trim() || 'Kota Baru',
      address: address.trim() || 'Alamat Toko Cabang',
      phone: phone.trim() || '0812-0000-0000',
      status: 'open', // 'open' | 'closed'
      managerName: managerName.trim() || 'Manajer Baru',
      operatingHours: operatingHours.trim() || '08:00 - 22:00 WIB',
      createdAt: new Date().toISOString().split('T')[0]
    }
    branches.value.push(newBranch)
    return newBranch
  }

  function toggleBranchStatus(branchId) {
    const b = branches.value.find(item => item.id === branchId)
    if (b) {
      b.status = b.status === 'open' ? 'closed' : 'open'
      return b.status
    }
    return null
  }

  function updateBranch(branchId, updatedFields) {
    const idx = branches.value.findIndex(item => item.id === branchId)
    if (idx !== -1) {
      branches.value[idx] = { ...branches.value[idx], ...updatedFields }
      return true
    }
    return false
  }

  function deleteBranch(branchId) {
    // Larang menghapus Gudang Pusat
    if (branchId === 'wh-1') {
      return { success: false, message: 'Gudang Pusat tidak dapat dihapus!' }
    }
    const idx = branches.value.findIndex(item => item.id === branchId)
    if (idx !== -1) {
      const removed = branches.value.splice(idx, 1)[0]
      // Jika cabang yang dihapus adalah cabang aktif saat ini, kembalikan ke Cabang Jakarta Selatan
      if (businessUser.value.currentBranch === removed.name) {
        businessUser.value.currentBranch = 'Cabang Jakarta Selatan'
        localStorage.setItem('cakue_current_branch', 'Cabang Jakarta Selatan')
      }
      return { success: true, removed }
    }
    return { success: false, message: 'Cabang tidak ditemukan' }
  }

  // Ganti Peran Bisnis (Live Role Switcher untuk simulasi dev)
  function setBusinessRole(roleKey) {
    const normalized = (roleKey || '').toLowerCase()
    if (['owner', 'manager', 'cashier', 'warehouse'].includes(normalized)) {
      activeBusinessRole.value = normalized
      localStorage.setItem('cakue_business_role', normalized)

      const roleDef = ROLES[normalized.toUpperCase()]
      businessUser.value.role = roleDef.title
      
      // Jika peran terkunci pada cabang tertentu, sesuaikan cabang aktif
      if (!roleDef.canSwitchBranch && roleDef.assignedBranch) {
        businessUser.value.currentBranch = roleDef.assignedBranch
        localStorage.setItem('cakue_current_branch', roleDef.assignedBranch)
      }
    }
  }

  function setBranch(branchName) {
    if (currentRoleConfig.value.canSwitchBranch) {
      businessUser.value.currentBranch = branchName
      localStorage.setItem('cakue_current_branch', branchName)
    }
  }

  function setAppMode(type) {
    accountType.value = type
    localStorage.setItem('cakue_account_type', type)
  }

  async function loadBranchesFromServer() {
    try {
      const res = await api.get('/api/branches')
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        branches.value = res.data.map(b => ({
          id: b.id,
          code: b.id.toUpperCase(),
          name: b.name,
          type: b.type,
          city: b.address ? b.address.split(',').pop().trim() : 'D.I. Yogyakarta',
          address: b.address,
          phone: '0812-3456-7890',
          status: 'open',
          managerName: 'Kepala Cabang',
          operatingHours: '08:00 - 22:00 WIB',
          createdAt: b.created_at ? new Date(b.created_at).toISOString().split('T')[0] : '2026-10-21'
        }))
        localStorage.setItem('cakue_branches', JSON.stringify(branches.value))
      }
    } catch (e) {
      console.warn('Gagal memuat cabang dari server, menggunakan default lokal:', e)
    }
  }

  async function login(email, password) {
    if (!email) {
      return { success: false, message: 'Alamat email wajib diisi!' }
    }

    try {
      // 1. Coba koneksi ke backend API riil
      const res = await api.post('/api/auth/login', { email: email.trim(), password })
      if (res.success && res.user) {
        const u = res.user
        isAuthenticated.value = true
        accountType.value = u.account_type || 'business'
        localStorage.setItem('cakue_is_authenticated', 'true')
        localStorage.setItem('cakue_account_type', accountType.value)
        localStorage.setItem('cakue_current_user', JSON.stringify(u))

        if (u.account_type === 'personal') {
          personalUser.value = {
            id: u.id,
            name: u.name,
            email: u.email,
            accountNumber: u.phone || '5420-8819-2041',
            role: 'Nasabah Pribadi',
            joinedDate: 'Oktober 2026'
          }
        } else {
          businessUser.value = {
            id: u.id,
            name: u.name,
            email: u.email,
            companyName: 'PT CAKUE Nusantara Berkah (Jogja)',
            role: ROLES[(u.role || 'owner').toUpperCase()]?.title || u.role,
            currentBranch: u.branch_name || 'Cabang 1 - Malioboro'
          }
          setBusinessRole(u.role || 'owner')
        }

        // Muat cabang terbaru jika terhubung
        loadBranchesFromServer()
        syncAllStores(u)
        return { success: true, message: res.message || 'Login berhasil', user: u }
      }

      // Jika server mengembalikan error (kata sandi salah / belum terdaftar)
      if (res.status === 401 || res.status === 404) {
        return { success: false, message: res.message }
      }
    } catch (err) {
      console.warn('Backend server offline, beralih ke simulasi lokal:', err)
    }

    // 2. Fallback cerdas jika server offline / standby
    const lower = (email || '').toLowerCase().trim()
    if (lower === 'admin@cakue.id' || lower.includes('admin') || lower.includes('master')) {
      const u = {
        id: 'usr-master-admin',
        name: 'Master Administrator',
        email: 'admin@cakue.id',
        account_type: 'business',
        role: 'owner',
        branch_name: 'Cabang 1 - Malioboro'
      }
      isAuthenticated.value = true
      accountType.value = 'business'
      businessUser.value = { ...businessUser.value, ...u }
      setBusinessRole('owner')
      localStorage.setItem('cakue_current_user', JSON.stringify(u))
      localStorage.setItem('cakue_is_authenticated', 'true')
      syncAllStores(u)
      return { success: true, message: 'Masuk sebagai Master Administrator', user: u }
    }

    if (lower === 'budi.santoso@cakue.id' || lower.includes('budi')) {
      const u = {
        id: 'usr-dummy-budi',
        name: 'Budi Santoso (Dummy / Demo)',
        email: 'budi.santoso@cakue.id',
        account_type: 'business',
        role: 'owner',
        branch_name: 'Cabang 1 - Malioboro'
      }
      isAuthenticated.value = true
      accountType.value = 'business'
      businessUser.value = { ...businessUser.value, ...u }
      setBusinessRole('owner')
      localStorage.setItem('cakue_current_user', JSON.stringify(u))
      localStorage.setItem('cakue_is_authenticated', 'true')
      syncAllStores(u)
      return { success: true, message: 'Masuk sebagai Akun Dummy Budi Santoso', user: u }
    }

    return { 
      success: false, 
      message: 'Gagal terhubung ke database server atau akun tidak ditemukan. Pastikan email & password benar.' 
    }
  }

  function loginWithGoogle() {
    login('admin@cakue.id', 'admin123')
  }

  function loginAs(type) {
    if (type === 'personal') {
      login('budi.santoso@cakue.id', 'password123')
    } else {
      login('admin@cakue.id', 'admin123')
    }
  }

  async function register(name, email, password, type = 'business', role = 'owner', branchId = 'jogja-1') {
    if (!name || !email) {
      return { success: false, message: 'Nama dan email wajib diisi!' }
    }

    try {
      const res = await api.post('/api/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
        account_type: type,
        role,
        branch_id: branchId
      })

      if (res.success && res.user) {
        const u = res.user
        isAuthenticated.value = true
        accountType.value = type
        localStorage.setItem('cakue_is_authenticated', 'true')
        localStorage.setItem('cakue_account_type', type)
        localStorage.setItem('cakue_current_user', JSON.stringify(u))

        if (type === 'personal') {
          personalUser.value = {
            id: u.id,
            name: u.name,
            email: u.email,
            accountNumber: u.phone || '5420-8819-2041',
            role: 'Nasabah Pribadi',
            joinedDate: 'Oktober 2026'
          }
        } else {
          businessUser.value = {
            id: u.id,
            name: u.name,
            email: u.email,
            companyName: 'PT CAKUE Nusantara Berkah (Jogja)',
            role: ROLES[(u.role || 'owner').toUpperCase()]?.title || u.role,
            currentBranch: 'Cabang 1 - Malioboro'
          }
          setBusinessRole(u.role || 'owner')
        }
        syncAllStores(u)
        return { success: true, message: res.message || 'Pendaftaran berhasil!', user: u }
      }

      return { success: false, message: res.message || 'Pendaftaran gagal' }
    } catch (err) {
      return { success: false, message: `Gagal mendaftar: ${err.message}` }
    }
  }

  function syncAllStores(userObj) {
    try {
      const fStore = useFinanceStore()
      const sStore = useStockStore()
      const pStore = usePosStore()
      const setStore = useSettingsStore()
      fStore.syncUserData(userObj)
      sStore.syncUserData(userObj)
      pStore.syncUserData(userObj)
      setStore.syncUser(userObj)
    } catch (e) {
      console.warn('[AUTH] Could not sync stores:', e)
    }
  }

  async function switchToAccount(target) {
    const isMaster = target === 'master' || target === 'admin' || target === 'admin@cakue.id'
    
    if (isMaster) {
      const u = {
        id: 'usr-master-admin',
        name: 'Master Administrator',
        email: 'admin@cakue.id',
        phone: '0812-0000-0001',
        account_type: 'business',
        role: 'owner',
        branch_id: 'jogja-1',
        branch_name: 'Cabang 1 - Malioboro'
      }
      isAuthenticated.value = true
      accountType.value = 'business'
      businessUser.value = {
        id: u.id,
        name: u.name,
        email: u.email,
        companyName: 'PT CAKUE Nusantara Berkah (Jogja)',
        role: 'Owner & Direktur',
        currentBranch: 'Cabang 1 - Malioboro'
      }
      setBusinessRole('owner')
      localStorage.setItem('cakue_active_account_mode', 'master')
      localStorage.setItem('cakue_current_user', JSON.stringify(u))
      localStorage.setItem('cakue_is_authenticated', 'true')
      localStorage.setItem('cakue_account_type', 'business')
      localStorage.setItem('cakue_current_branch', 'Cabang 1 - Malioboro')
      syncAllStores(u)
      return { success: true, user: u, message: 'Berhasil beralih ke Master Administrator (Data Bersih Rp 0)' }
    } else {
      const u = {
        id: 'usr-personal',
        name: 'Budi Santoso (Dummy / Demo)',
        email: 'budi.santoso@cakue.id',
        phone: '081234567890',
        account_type: 'business',
        role: 'owner',
        branch_id: 'jogja-1',
        branch_name: 'Cabang 1 - Malioboro'
      }
      isAuthenticated.value = true
      accountType.value = 'business'
      businessUser.value = {
        id: u.id,
        name: u.name,
        email: u.email,
        companyName: 'PT CAKUE Nusantara Berkah (Jogja)',
        role: 'Owner & Direktur',
        currentBranch: 'Cabang 1 - Malioboro'
      }
      setBusinessRole('owner')
      localStorage.setItem('cakue_active_account_mode', 'dummy')
      localStorage.setItem('cakue_current_user', JSON.stringify(u))
      localStorage.setItem('cakue_is_authenticated', 'true')
      localStorage.setItem('cakue_account_type', 'business')
      syncAllStores(u)
      return { success: true, user: u, message: 'Berhasil beralih ke Akun Dummy Budi Santoso (Data Sampel)' }
    }
  }

  function logout() {
    isAuthenticated.value = false
    showOnboarding.value = false
    localStorage.removeItem('cakue_is_authenticated')
    localStorage.removeItem('cakue_current_user')
    syncAllStores(null)
  }

  return {
    isAuthenticated,
    showOnboarding,
    accountType,
    appMode,
    activeBusinessRole,
    currentRoleConfig,
    isOwner,
    isManager,
    isCashier,
    isWarehouse,
    canExportReports,
    canViewFinancialAudit,
    canManageStock,
    canAddProduct,
    canEditProductPrice,
    canSyncStockToFinance,
    canDeleteProduct,
    canManageStaff,
    canManageBranches,
    canDeleteBranch,
    canEditAppBranding,
    canEditFinancialSettings,
    canManageAssets,
    canDeleteAsset,
    canRunDepreciation,
    user,
    personalUser,
    businessUser,
    branches,
    canAccess,
    addBranch,
    toggleBranchStatus,
    updateBranch,
    deleteBranch,
    setBusinessRole,
    setBranch,
    setAppMode,
    login,
    loginWithGoogle,
    loginAs,
    switchToAccount,
    register,
    logout,
    loadBranchesFromServer
  }
})
