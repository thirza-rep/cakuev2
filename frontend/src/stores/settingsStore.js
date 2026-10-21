import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // 1. Branding & Identitas Aplikasi
  const defaultAppName = 'CAKUE'
  const defaultAppSubtitle = 'Catatan Keuangan & Usaha'

  const appName = ref(localStorage.getItem('cakue_app_name') || defaultAppName)
  const appSubtitle = ref(localStorage.getItem('cakue_app_subtitle') || defaultAppSubtitle)
  const appLogo = ref(localStorage.getItem('cakue_app_logo') || '')

  // 2. Profil Pengguna & Keamanan
  const defaultUserName = 'Master Administrator'
  const defaultUserEmail = 'admin@cakue.id'
  const defaultUserPhone = '0812-0000-0001'
  const defaultUserAddress = 'Jl. Malioboro No. 12, Danurejan, Kota Yogyakarta'
  const defaultMapsCoordinates = '-7.7928, 110.3658'
  const defaultUserPin = '123456'

  const userName = ref(localStorage.getItem('cakue_user_name') || defaultUserName)
  const userAvatar = ref(localStorage.getItem('cakue_user_avatar') || '')
  const userEmail = ref(localStorage.getItem('cakue_user_email') || defaultUserEmail)
  const userPhone = ref(localStorage.getItem('cakue_user_phone') || defaultUserPhone)
  const userAddress = ref(localStorage.getItem('cakue_user_address') || defaultUserAddress)
  const mapsCoordinates = ref(localStorage.getItem('cakue_maps_coordinates') || defaultMapsCoordinates)
  const userPin = ref(localStorage.getItem('cakue_user_pin') || defaultUserPin)

  // 3. Manajemen Staf & Tim Usaha (RBAC Master - Tim 6 Cabang Jogja & Hub Distribusi)
  const defaultStaffList = [
    // Kantor Pusat & Gudang Hub Jogja
    { id: 'usr-1', name: 'Master Administrator', email: 'admin@cakue.id', phone: '0812-0000-0001', role: 'owner', branch: 'Semua Cabang (Kantor Pusat Jogja)', active: true, pin: '123456', joinedAt: '2026-10-21' },
    { id: 'usr-demo-budi', name: 'Budi Santoso (Dummy / Demo)', email: 'budi.santoso@cakue.id', phone: '081234567890', role: 'owner', branch: 'Cabang 1 - Malioboro', active: true, pin: '123456', joinedAt: '2026-10-14' },
    { id: 'usr-wh-jog', name: 'Hendra Wijaya', email: 'hendra.gudang@cakue.id', phone: '0811-2233-4455', role: 'warehouse', branch: 'Gudang Pusat Jogja (Hub Distribusi)', active: true, pin: '998877', joinedAt: '2026-10-21' },
    
    // Cabang 1 - Malioboro
    { id: 'usr-jog-1m', name: 'Ahmad Fauzi', email: 'fauzi.malioboro@cakue.id', phone: '0812-9988-7711', role: 'manager', branch: 'Cabang 1 - Malioboro', active: true, pin: '654321', joinedAt: '2026-10-21' },
    { id: 'usr-jog-1k', name: 'Siti Rahma', email: 'siti.malioboro@cakue.id', phone: '0812-5555-4444', role: 'cashier', branch: 'Cabang 1 - Malioboro', active: true, pin: '112233', joinedAt: '2026-10-21' },

    // Cabang 2 - Gejayan
    { id: 'usr-jog-2m', name: 'Siti Rahmawati', email: 'rahma.gejayan@cakue.id', phone: '0813-7766-5544', role: 'manager', branch: 'Cabang 2 - Gejayan', active: true, pin: '778899', joinedAt: '2026-10-21' },
    { id: 'usr-jog-2k', name: 'Dewi Lestari', email: 'dewi.gejayan@cakue.id', phone: '0813-6655-4433', role: 'cashier', branch: 'Cabang 2 - Gejayan', active: true, pin: '223344', joinedAt: '2026-10-21' },

    // Cabang 3 - Kaliurang
    { id: 'usr-jog-3m', name: 'Rian Santoso', email: 'rian.kaliurang@cakue.id', phone: '0815-4433-2211', role: 'manager', branch: 'Cabang 3 - Kaliurang', active: true, pin: '889900', joinedAt: '2026-10-21' },
    { id: 'usr-jog-3k', name: 'Doni Saputra', email: 'doni.kaliurang@cakue.id', phone: '0815-3322-1100', role: 'cashier', branch: 'Cabang 3 - Kaliurang', active: true, pin: '334455', joinedAt: '2026-10-21' },

    // Cabang 4 - Seturan
    { id: 'usr-jog-4m', name: 'Dimas Kurniawan', email: 'dimas.seturan@cakue.id', phone: '0816-1234-5678', role: 'manager', branch: 'Cabang 4 - Seturan', active: true, pin: '445566', joinedAt: '2026-10-21' },

    // Cabang 5 - Kotagede
    { id: 'usr-jog-5m', name: 'Tri Haryanto', email: 'tri.kotagede@cakue.id', phone: '0817-9876-5432', role: 'manager', branch: 'Cabang 5 - Kotagede', active: true, pin: '556677', joinedAt: '2026-10-21' },

    // Cabang 6 - Bantul
    { id: 'usr-jog-6m', name: 'Bambang Sutrisno', email: 'bambang.bantul@cakue.id', phone: '0818-5544-3322', role: 'manager', branch: 'Cabang 6 - Bantul', active: true, pin: '667788', joinedAt: '2026-10-21' }
  ]

  const savedStaffList = localStorage.getItem('cakue_staff_list')
  let initialStaffList = defaultStaffList
  if (savedStaffList) {
    try {
      const parsed = JSON.parse(savedStaffList)
      const hasJogja = Array.isArray(parsed) && parsed.some(s => (s.branch || '').includes('Cabang 1') || (s.branch || '').includes('Malioboro'))
      if (hasJogja && parsed.length >= 6) {
        initialStaffList = parsed
      } else {
        initialStaffList = defaultStaffList
        localStorage.setItem('cakue_staff_list', JSON.stringify(defaultStaffList))
      }
    } catch (e) {
      initialStaffList = defaultStaffList
    }
  }

  const staffList = ref(initialStaffList)

  // 4. Kustomisasi Struk Kasir & Printer Thermal POS (58mm / 80mm)
  const defaultReceiptSettings = {
    paperSize: '58mm', // '58mm' | '80mm'
    showHeaderLogo: true,
    headerMessage: 'Terima kasih atas kunjungan Anda!',
    footerMessage: 'Barang yang sudah dibeli tidak dapat ditukar kecuali ada perjanjian garansi.',
    showQrCode: true,
    showCashierName: true,
    showBranchAddress: true,
    autoPrint: false
  }

  const savedReceipt = localStorage.getItem('cakue_receipt_settings')
  const receiptSettings = ref(savedReceipt ? JSON.parse(savedReceipt) : defaultReceiptSettings)

  // 5. Pengaturan Finansial & Pajak PPN
  const defaultFinancialSettings = {
    taxEnabled: true,
    taxRate: 11, // PPN 11%
    serviceChargeEnabled: false,
    serviceChargeRate: 0,
    roundingMethod: 'nearest100', // 'none' | 'nearest100' | 'nearest500'
    settlementBank: 'BCA (Bank Central Asia)',
    settlementAccountNo: '5420-8819-2041',
    settlementAccountName: 'PT Cakue Nusantara Berkah'
  }

  const savedFinancial = localStorage.getItem('cakue_financial_settings')
  const financialSettings = ref(savedFinancial ? JSON.parse(savedFinancial) : defaultFinancialSettings)

  // 6. Notifikasi Otomatis WhatsApp (Baileys WA Gateway $0 Cost)
  const defaultWhatsappSettings = {
    autoSendReceipt: true,
    ownerPhoneAlert: '081234567890',
    criticalStockAlert: true,
    criticalStockThreshold: 5,
    receiptTemplate: `🧾 *NOTA TRANSAKSI - {appName}*\nNo: {invoiceNo}\nTanggal: {date}\nTotal: Rp {total}\nTerima kasih telah berbelanja di {branchName}!`
  }

  const savedWhatsapp = localStorage.getItem('cakue_whatsapp_settings')
  const whatsappSettings = ref(savedWhatsapp ? JSON.parse(savedWhatsapp) : defaultWhatsappSettings)

  // 7. Payment Gateway Status
  const paymentGateway = ref({
    status: 'COMING_SOON',
    title: 'Payment Gateway (QRIS Dinamis, VA & E-Wallet)',
    supportedProviders: ['QRIS Dinamis', 'BCA Virtual Account', 'Mandiri Livin', 'GoPay', 'ShopeePay'],
    description: 'Integrasi otomatisasi settlement pembayaran langsung ke rekening bank Anda sedang dalam tahap finalisasi keamanan.'
  })

  // Watchers untuk persistensi otomatis ke LocalStorage
  watch(appName, (val) => localStorage.setItem('cakue_app_name', val))
  watch(appSubtitle, (val) => localStorage.setItem('cakue_app_subtitle', val))
  watch(appLogo, (val) => {
    if (val) localStorage.setItem('cakue_app_logo', val)
    else localStorage.removeItem('cakue_app_logo')
  })

  watch(userName, (val) => localStorage.setItem('cakue_user_name', val))
  watch(userAvatar, (val) => {
    if (val) localStorage.setItem('cakue_user_avatar', val)
    else localStorage.removeItem('cakue_user_avatar')
  })
  watch(userEmail, (val) => localStorage.setItem('cakue_user_email', val))
  watch(userPhone, (val) => localStorage.setItem('cakue_user_phone', val))
  watch(userAddress, (val) => localStorage.setItem('cakue_user_address', val))
  watch(mapsCoordinates, (val) => localStorage.setItem('cakue_maps_coordinates', val))
  watch(userPin, (val) => localStorage.setItem('cakue_user_pin', val))

  watch(staffList, (val) => localStorage.setItem('cakue_staff_list', JSON.stringify(val)), { deep: true })
  watch(receiptSettings, (val) => localStorage.setItem('cakue_receipt_settings', JSON.stringify(val)), { deep: true })
  watch(financialSettings, (val) => localStorage.setItem('cakue_financial_settings', JSON.stringify(val)), { deep: true })
  watch(whatsappSettings, (val) => localStorage.setItem('cakue_whatsapp_settings', JSON.stringify(val)), { deep: true })

  // Aksi Update Logo & Avatar
  function setAppLogo(dataUrl) {
    appLogo.value = dataUrl
  }

  function removeAppLogo() {
    appLogo.value = ''
  }

  function setUserAvatar(dataUrl) {
    userAvatar.value = dataUrl
  }

  function removeUserAvatar() {
    userAvatar.value = ''
  }

  // Aksi Profil
  function saveProfile({ name, email, phone, address, coordinates }) {
    if (name !== undefined) userName.value = name
    if (email !== undefined) userEmail.value = email
    if (phone !== undefined) userPhone.value = phone
    if (address !== undefined) userAddress.value = address
    if (coordinates !== undefined) mapsCoordinates.value = coordinates
  }

  function updateUserPin(newPin) {
    userPin.value = String(newPin).trim()
  }

  // Aksi Branding
  function saveBranding({ name, subtitle }) {
    if (name !== undefined) appName.value = name
    if (subtitle !== undefined) appSubtitle.value = subtitle
  }

  // Aksi Manajemen Staf (RBAC)
  function addStaff({ name, email, phone, role, branch, pin }) {
    const newStaff = {
      id: `usr-${Date.now().toString(36)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: role || 'cashier',
      branch: branch || 'Cabang Jakarta Selatan',
      active: true,
      pin: pin ? String(pin).trim() : '123456',
      joinedAt: new Date().toISOString().split('T')[0]
    }
    staffList.value.push(newStaff)
    return newStaff
  }

  function updateStaff(staffId, updatedFields) {
    const idx = staffList.value.findIndex(s => s.id === staffId)
    if (idx !== -1) {
      staffList.value[idx] = { ...staffList.value[idx], ...updatedFields }
    }
  }

  function resetStaffPin(staffId, newPin) {
    const staff = staffList.value.find(s => s.id === staffId)
    if (staff) {
      staff.pin = String(newPin).trim()
    }
  }

  function toggleStaffStatus(staffId) {
    const staff = staffList.value.find(s => s.id === staffId)
    if (staff) {
      staff.active = !staff.active
    }
  }

  function deleteStaff(staffId) {
    staffList.value = staffList.value.filter(s => s.id !== staffId)
  }

  // Helper filter staf per cabang penugasan
  function getStaffByBranch(branchName) {
    if (!branchName || branchName === 'Semua Cabang (Kantor Pusat)') {
      return staffList.value
    }
    return staffList.value.filter(s => s.branch === branchName || s.branch === 'Semua Cabang (Kantor Pusat)')
  }

  // Aksi Kustomisasi Struk Kasir
  function saveReceiptSettings(settings) {
    receiptSettings.value = { ...receiptSettings.value, ...settings }
  }

  // Aksi Finansial & Pajak
  function saveFinancialSettings(settings) {
    financialSettings.value = { ...financialSettings.value, ...settings }
  }

  // Aksi WhatsApp Gateway Settings
  function saveWhatsappSettings(settings) {
    whatsappSettings.value = { ...whatsappSettings.value, ...settings }
  }

  function syncUser(userObj) {
    if (!userObj) return
    if (userObj.name) {
      userName.value = userObj.name
      localStorage.setItem('cakue_user_name', userObj.name)
    }
    if (userObj.email) {
      userEmail.value = userObj.email
      localStorage.setItem('cakue_user_email', userObj.email)
    }
    if (userObj.phone) {
      userPhone.value = userObj.phone
      localStorage.setItem('cakue_user_phone', userObj.phone)
    }
    if (userObj.avatar_url) {
      userAvatar.value = userObj.avatar_url
      localStorage.setItem('cakue_user_avatar', userObj.avatar_url)
    }
  }

  function resetToDefault() {
    appName.value = defaultAppName
    appSubtitle.value = defaultAppSubtitle
    appLogo.value = ''
    userName.value = defaultUserName
    userAvatar.value = ''
    userEmail.value = defaultUserEmail
    userPhone.value = defaultUserPhone
    userAddress.value = defaultUserAddress
    mapsCoordinates.value = defaultMapsCoordinates
    userPin.value = defaultUserPin
    staffList.value = [...defaultStaffList]
    receiptSettings.value = { ...defaultReceiptSettings }
    financialSettings.value = { ...defaultFinancialSettings }
    whatsappSettings.value = { ...defaultWhatsappSettings }
  }

  return {
    syncUser,
    appName,
    appSubtitle,
    appLogo,
    userName,
    userAvatar,
    userEmail,
    userPhone,
    userAddress,
    mapsCoordinates,
    userPin,
    staffList,
    receiptSettings,
    financialSettings,
    whatsappSettings,
    paymentGateway,
    setAppLogo,
    removeAppLogo,
    setUserAvatar,
    removeUserAvatar,
    saveProfile,
    updateUserPin,
    saveBranding,
    addStaff,
    updateStaff,
    resetStaffPin,
    toggleStaffStatus,
    deleteStaff,
    getStaffByBranch,
    saveReceiptSettings,
    saveFinancialSettings,
    saveWhatsappSettings,
    resetToDefault
  }
})
