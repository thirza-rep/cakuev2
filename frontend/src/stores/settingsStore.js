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
  const defaultUserName = 'Budi Santoso'
  const defaultUserEmail = 'budi.santoso@cakue.id'
  const defaultUserPhone = '081234567890'
  const defaultUserAddress = 'Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan'
  const defaultMapsCoordinates = '-6.225014, 106.809653'
  const defaultUserPin = '123456'

  const userName = ref(localStorage.getItem('cakue_user_name') || defaultUserName)
  const userAvatar = ref(localStorage.getItem('cakue_user_avatar') || '')
  const userEmail = ref(localStorage.getItem('cakue_user_email') || defaultUserEmail)
  const userPhone = ref(localStorage.getItem('cakue_user_phone') || defaultUserPhone)
  const userAddress = ref(localStorage.getItem('cakue_user_address') || defaultUserAddress)
  const mapsCoordinates = ref(localStorage.getItem('cakue_maps_coordinates') || defaultMapsCoordinates)
  const userPin = ref(localStorage.getItem('cakue_user_pin') || defaultUserPin)

  // 3. Manajemen Staf & Tim Usaha (RBAC Master - Tim Terisolasi per Cabang)
  const defaultStaffList = [
    // Tim Kantor Pusat & Logistik Central Hub
    { id: 'usr-1', name: 'Budi Santoso', email: 'owner@cakuenusantara.com', phone: '081234567890', role: 'owner', branch: 'Semua Cabang (Kantor Pusat)', active: true, pin: '123456', joinedAt: '2025-01-10' },
    { id: 'usr-4', name: 'Riko Pratama', email: 'riko.gudang@cakue.id', phone: '081722223333', role: 'warehouse', branch: 'Gudang Pusat (Central Hub)', active: true, pin: '998877', joinedAt: '2025-08-20' },
    { id: 'usr-5', name: 'Hendra Kurniawan', email: 'hendra.logistik@cakue.id', phone: '081911223344', role: 'warehouse', branch: 'Gudang Pusat (Central Hub)', active: true, pin: '554433', joinedAt: '2025-09-01' },
    
    // Tim Cabang Jakarta Selatan
    { id: 'usr-2', name: 'Ahmad Fauzi', email: 'ahmad.fauzi@cakue.id', phone: '081388889999', role: 'manager', branch: 'Cabang Jakarta Selatan', active: true, pin: '654321', joinedAt: '2025-03-15' },
    { id: 'usr-3', name: 'Siti Rahma', email: 'siti.kasir@cakue.id', phone: '081255554444', role: 'cashier', branch: 'Cabang Jakarta Selatan', active: true, pin: '112233', joinedAt: '2025-06-01' },
    { id: 'usr-6', name: 'Dimas Wicaksono', email: 'dimas.kasir@cakue.id', phone: '081277889900', role: 'cashier', branch: 'Cabang Jakarta Selatan', active: true, pin: '334455', joinedAt: '2025-07-10' },

    // Tim Cabang Bandung Dago
    { id: 'usr-7', name: 'Ridwan Sanjaya', email: 'ridwan.bdg@cakue.id', phone: '081377665544', role: 'manager', branch: 'Cabang Bandung Dago', active: true, pin: '778899', joinedAt: '2025-03-01' },
    { id: 'usr-8', name: 'Neng Maya Anggraini', email: 'maya.bdg@cakue.id', phone: '081366554433', role: 'cashier', branch: 'Cabang Bandung Dago', active: true, pin: '223344', joinedAt: '2025-04-12' },
    { id: 'usr-9', name: 'Fajar Pratama', email: 'fajar.bdg@cakue.id', phone: '081355443322', role: 'cashier', branch: 'Cabang Bandung Dago', active: true, pin: '667788', joinedAt: '2025-05-20' },

    // Tim Cabang Surabaya Gubeng
    { id: 'usr-10', name: 'Bambang Sutrisno', email: 'bambang.sby@cakue.id', phone: '081544332211', role: 'manager', branch: 'Cabang Surabaya Gubeng', active: true, pin: '889900', joinedAt: '2025-05-10' },
    { id: 'usr-11', name: 'Dewi Anggraeni', email: 'dewi.sby@cakue.id', phone: '081533221100', role: 'cashier', branch: 'Cabang Surabaya Gubeng', active: true, pin: '445566', joinedAt: '2025-06-15' },
    { id: 'usr-12', name: 'Tri Wahyudi', email: 'tri.sby@cakue.id', phone: '081522110099', role: 'cashier', branch: 'Cabang Surabaya Gubeng', active: true, pin: '990011', joinedAt: '2025-07-01' }
  ]

  const savedStaffList = localStorage.getItem('cakue_staff_list')
  let initialStaffList = defaultStaffList
  if (savedStaffList) {
    try {
      const parsed = JSON.parse(savedStaffList)
      // Jika data lama hanya 4 staff atau kurang (belum ada tim Bandung/Surabaya), perbarui ke defaultStaffList
      const hasBandung = Array.isArray(parsed) && parsed.some(s => s.branch === 'Cabang Bandung Dago')
      if (hasBandung && parsed.length >= 8) {
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
