import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

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

  // Data Pengguna Sesuai Jenis Akun
  const personalUser = ref({
    name: 'Budi Santoso',
    email: 'budi.santoso@cakue.id',
    accountNumber: '5420-8819-2041',
    role: 'Nasabah Pribadi',
    joinedDate: 'Januari 2026'
  })

  const businessUser = ref({
    name: 'Budi Santoso',
    email: 'owner@cakuenusantara.com',
    companyName: 'PT Cakue Nusantara Berkah',
    role: ROLES[activeBusinessRole.value.toUpperCase()]?.title || 'Owner & Direktur',
    currentBranch: localStorage.getItem('cakue_current_branch') || 'Cabang Jakarta Selatan'
  })

  const user = computed(() => {
    return accountType.value === 'personal' ? personalUser.value : businessUser.value
  })

  // Master Cabang & Multi-Outlet Usaha Terpadu (Persisten di LocalStorage)
  const defaultBranches = [
    {
      id: 'wh-1',
      code: 'PST-01',
      name: 'Gudang Pusat (Central Hub)',
      type: 'warehouse',
      city: 'Jakarta Timur',
      address: 'Kawasan Industri Pulogadung Blok B No. 12',
      phone: '0811-2233-4455',
      status: 'open',
      managerName: 'Riko Pratama',
      operatingHours: '24 Jam Operasional',
      createdAt: '2025-01-01'
    },
    {
      id: 'br-1',
      code: 'JKT-01',
      name: 'Cabang Jakarta Selatan',
      type: 'branch',
      city: 'Jakarta Selatan',
      address: 'Jl. Senopati No. 42, Kebayoran Baru',
      phone: '0812-9988-7711',
      status: 'open',
      managerName: 'Ahmad Fauzi',
      operatingHours: '08:00 - 22:00 WIB',
      createdAt: '2025-01-15'
    },
    {
      id: 'br-2',
      code: 'BDG-01',
      name: 'Cabang Bandung Dago',
      type: 'branch',
      city: 'Bandung',
      address: 'Jl. Ir. H. Juanda No. 108, Dago',
      phone: '0813-7766-5544',
      status: 'open',
      managerName: 'Ridwan Sanjaya',
      operatingHours: '07:30 - 22:00 WIB',
      createdAt: '2025-03-01'
    },
    {
      id: 'br-3',
      code: 'SBY-01',
      name: 'Cabang Surabaya Gubeng',
      type: 'branch',
      city: 'Surabaya',
      address: 'Jl. Raya Gubeng No. 64, Gubeng',
      phone: '0815-4433-2211',
      status: 'open',
      managerName: 'Bambang Sutrisno',
      operatingHours: '08:00 - 21:30 WIB',
      createdAt: '2025-05-10'
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

  function login(email, password) {
    isAuthenticated.value = true
    localStorage.setItem('cakue_is_authenticated', 'true')
  }

  function loginWithGoogle() {
    isAuthenticated.value = true
    localStorage.setItem('cakue_is_authenticated', 'true')
  }

  function loginAs(type) {
    accountType.value = type
    isAuthenticated.value = true
    localStorage.setItem('cakue_account_type', type)
    localStorage.setItem('cakue_is_authenticated', 'true')
  }

  function register(name, email, type, companyName = '') {
    accountType.value = type
    if (type === 'personal') {
      personalUser.value.name = name
      personalUser.value.email = email
    } else {
      businessUser.value.name = name
      businessUser.value.email = email
      businessUser.value.companyName = companyName || 'Usaha Mandiri'
    }
    isAuthenticated.value = true
    localStorage.setItem('cakue_account_type', type)
    localStorage.setItem('cakue_is_authenticated', 'true')
  }

  function logout() {
    isAuthenticated.value = false
    showOnboarding.value = false
    localStorage.setItem('cakue_is_authenticated', 'false')
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
    register,
    logout
  }
})
