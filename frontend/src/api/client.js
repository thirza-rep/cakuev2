// CAKUE Central API Client & Server Resolver
// Mendukung Browser, Mobile (Capacitor), dan Desktop (Electron)

const DEFAULT_HOME_SERVER = 'http://192.168.1.13:3001'
const DEFAULT_TAILSCALE_SERVER = 'http://100.88.200.16:3001'

export function getServerUrl() {
  const saved = localStorage.getItem('cakue_server_url')
  if (saved && saved.trim() !== '') {
    return saved.replace(/\/+$/, '')
  }

  // Jika di browser standar (bukan file:/// atau capacitor://)
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname
    if (host !== 'localhost' && host !== '127.0.0.1' && !host.startsWith('192.168.') && !host.startsWith('100.')) {
      // Misal via domain publik Cloudflare Tunnel (https://mini.codevits.site)
      return window.location.origin
    }
    if (host.startsWith('192.168.') || host.startsWith('100.')) {
      return `http://${host}:3001`
    }
    // Jika localhost di browser macbook
    return 'http://localhost:3001'
  }

  // Default fallback untuk APK Android & EXE Windows
  return DEFAULT_HOME_SERVER
}

export function setServerUrl(url) {
  if (!url || url.trim() === '') {
    localStorage.removeItem('cakue_server_url')
  } else {
    localStorage.setItem('cakue_server_url', url.trim().replace(/\/+$/, ''))
  }
}

export async function checkServerHealth() {
  const base = getServerUrl()
  const healthUrl = base.endsWith('/api') ? `${base}/health` : `${base}/api/health`
  try {
    const res = await fetch(healthUrl, { method: 'GET', signal: AbortSignal.timeout(3000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return { ok: true, data, serverUrl: base }
  } catch (err) {
    // Jika gagal dan base adalah 192.168.1.13, coba Tailscale
    if (base === DEFAULT_HOME_SERVER) {
      try {
        const res2 = await fetch(`${DEFAULT_TAILSCALE_SERVER}/api/health`, { method: 'GET', signal: AbortSignal.timeout(3000) })
        if (res2.ok) {
          const data2 = await res2.json()
          setServerUrl(DEFAULT_TAILSCALE_SERVER)
          return { ok: true, data: data2, serverUrl: DEFAULT_TAILSCALE_SERVER }
        }
      } catch (e) {
        // ignore
      }
    }
    return { ok: false, error: err.message, serverUrl: base }
  }
}

export async function apiFetch(path, options = {}) {
  let base = getServerUrl()
  let cleanPath = path.startsWith('/') ? path : `/${path}`
  if (base.endsWith('/api') && cleanPath.startsWith('/api/')) {
    cleanPath = cleanPath.substring(4)
  }
  const url = `${base}${cleanPath}`

  const token = typeof window !== 'undefined' ? localStorage.getItem('cakue_auth_token') : null

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        message: data.message || `Request gagal dengan status ${res.status}`,
        ...data
      }
    }
    return {
      success: true,
      status: res.status,
      ...data
    }
  } catch (err) {
    return {
      success: false,
      message: `Gagal terhubung ke Server (${base}): ${err.message}`
    }
  }
}

export const api = {
  get: (path) => apiFetch(path, { method: 'GET' }),
  post: (path, body) => apiFetch(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => apiFetch(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => apiFetch(path, { method: 'DELETE' })
}
