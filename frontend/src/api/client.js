// CAKUE Central API Client & Server Resolver
// Mendukung Browser, Mobile (Capacitor Android), dan Desktop (Electron)
import { Capacitor } from '@capacitor/core'

const DEFAULT_PUBLIC_SERVER = 'https://cakue.codevits.site'
const DEFAULT_HOME_SERVER = 'http://192.168.1.13:3001'
const DEFAULT_TAILSCALE_SERVER = 'http://100.88.200.16:3001'

export function getServerUrl() {
  const saved = localStorage.getItem('cakue_server_url')
  if (saved && saved.trim() !== '') {
    return saved.replace(/\/+$/, '')
  }

  // 1. Jika berjalan sebagai Native App (Capacitor Android / iOS)
  if (Capacitor.isNativePlatform()) {
    return DEFAULT_PUBLIC_SERVER
  }

  // 2. Jika di browser web
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname
    // Jika via domain publik Cloudflare Tunnel (https://cakue.codevits.site / mini.codevits.site)
    if (host !== 'localhost' && host !== '127.0.0.1' && !host.startsWith('192.168.') && !host.startsWith('100.')) {
      return window.location.origin
    }
    // Jika diakses via IP LAN atau Tailscale
    if (host.startsWith('192.168.') || host.startsWith('100.')) {
      return `http://${host}:3001`
    }
    // Jika localhost di browser macbook dev
    return 'http://localhost:3001'
  }

  // Fallback umum
  return DEFAULT_PUBLIC_SERVER
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
    const res = await fetch(healthUrl, { method: 'GET', signal: AbortSignal.timeout(3500) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return { ok: true, data, serverUrl: base }
  } catch (err) {
    // Failover cerdas: jika server utama gagal, uji server alternatif
    const fallbackCandidates = [DEFAULT_PUBLIC_SERVER, DEFAULT_HOME_SERVER, DEFAULT_TAILSCALE_SERVER]
      .filter(url => url !== base)

    for (const altUrl of fallbackCandidates) {
      try {
        const altHealthUrl = altUrl.endsWith('/api') ? `${altUrl}/health` : `${altUrl}/api/health`
        const resAlt = await fetch(altHealthUrl, { method: 'GET', signal: AbortSignal.timeout(3000) })
        if (resAlt.ok) {
          const dataAlt = await resAlt.json()
          setServerUrl(altUrl)
          return { ok: true, data: dataAlt, serverUrl: altUrl }
        }
      } catch (e) {
        // Coba kandidat berikutnya
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
