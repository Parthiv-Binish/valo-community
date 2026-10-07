import { supabase } from './supabase'

const DEFAULT_API = 'https://valo-community-backend-1.onrender.com'
const ADMIN_API = 'https://valo-community-backend-1.onrender.com'

// Admin requests are intentionally isolated from the normal API route so a
// stale/legacy backend URL cannot break the management console.
const ADMIN_PATH_PREFIX = '/api/admin/'

export const API_BASE = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL_PRIMARY ||
  DEFAULT_API
).replace(/\/$/, '')

function buildHeaders(options = {}, token) {
  return {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: 'Bearer ' + token } : {}),
    ...(options.headers || {}),
  }
}

async function readResponse(response) {
  const text = await response.text()
  let body = {}
  try { body = text ? JSON.parse(text) : {} } catch { body = { message: text } }
  if (!response.ok) {
    const error = new Error(body.detail || body.message || ('Request failed (' + response.status + ')'))
    error.status = response.status
    error.body = body
    throw error
  }
  return body
}

export async function apiRequest(path, options = {}) {
  const isAdminRequest = path.startsWith(ADMIN_PATH_PREFIX)
  const baseUrl = isAdminRequest ? ADMIN_API : API_BASE

  const request = async (token) => {
    try {
      return await fetch(baseUrl + path, {
        ...options,
        headers: buildHeaders(options, token),
      })
    } catch {
      const error = new Error('Community API is unreachable. Check the backend HTTPS certificate or API URL.')
      error.status = 0
      throw error
    }
  }

  let { data: { session } } = await supabase.auth.getSession()

  if (!session && options.auth !== false) {
    const refreshed = await supabase.auth.refreshSession()
    session = refreshed.data?.session || null
  }

  if (options.auth !== false && !session) {
    const error = new Error('Your session has expired. Please sign in again.')
    error.status = 401
    throw error
  }

  let response = await request(session?.access_token)

  if (response.status === 401 && options.auth !== false) {
    const refreshed = await supabase.auth.refreshSession()
    const nextSession = refreshed.data?.session
    if (nextSession?.access_token) response = await request(nextSession.access_token)
  }

  return readResponse(response)
}

export const apiGet = (path, options = {}) => apiRequest(path, { ...options, method: 'GET' })
export const apiPost = (path, body, options = {}) => apiRequest(path, { ...options, method: 'POST', body: JSON.stringify(body) })
export const apiPatch = (path, body, options = {}) => apiRequest(path, { ...options, method: 'PATCH', body: JSON.stringify(body) })
export const apiDelete = (path, options = {}) => apiRequest(path, { ...options, method: 'DELETE' })
