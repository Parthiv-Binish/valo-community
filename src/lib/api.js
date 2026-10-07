import { supabase } from './supabase'

const DEFAULT_PRIMARY_API = 'https://valo-community-backend-1.onrender.com'
const DEFAULT_BACKUP_API = 'https://valo-community-backend.onrender.com'

// Requests are distributed across both Render backend instances.
// Environment variables can override the defaults:
// VITE_BACKEND_URL_PRIMARY and VITE_BACKEND_URL_BACKUP.
const BACKEND_INSTANCES = [
  import.meta.env.VITE_BACKEND_URL_PRIMARY || import.meta.env.VITE_API_URL || DEFAULT_PRIMARY_API,
  import.meta.env.VITE_BACKEND_URL_BACKUP || DEFAULT_BACKUP_API,
].filter(Boolean).map((url) => url.replace(/\/$/, ''))

const ADMIN_PATH_PREFIX = '/api/admin/'

let nextBackendIndex = 0

function getNextBackendIndex() {
  const index = nextBackendIndex % BACKEND_INSTANCES.length
  nextBackendIndex = (nextBackendIndex + 1) % BACKEND_INSTANCES.length
  return index
}

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

async function requestToBackend(index, path, options, token) {
  const baseUrl = BACKEND_INSTANCES[index]
  return fetch(baseUrl + path, {
    ...options,
    headers: buildHeaders(options, token),
  })
}

export async function apiRequest(path, options = {}) {
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

  const primaryIndex = getNextBackendIndex()
  const backupIndex = (primaryIndex + 1) % BACKEND_INSTANCES.length

  let response

  try {
    response = await requestToBackend(primaryIndex, path, options, session?.access_token)
  } catch (error) {
    if (BACKEND_INSTANCES.length < 2) {
      const unreachable = new Error('Community API is unreachable. Check the backend HTTPS certificate or API URL.')
      unreachable.status = 0
      throw unreachable
    }

    console.warn('[Backend Load Balancer] Primary instance unreachable; failing over to backup.')
    try {
      response = await requestToBackend(backupIndex, path, options, session?.access_token)
    } catch {
      const unreachable = new Error('Community API is unreachable. Both backend instances are unavailable.')
      unreachable.status = 0
      throw unreachable
    }
  }

  if (response.status === 401 && options.auth !== false) {
    const refreshed = await supabase.auth.refreshSession()
    const nextSession = refreshed.data?.session
    if (nextSession?.access_token) {
      response = await requestToBackend(primaryIndex, path, options, nextSession.access_token)
    }
  }

  return readResponse(response)
}

export const apiGet = (path, options = {}) => apiRequest(path, { ...options, method: 'GET' })
export const apiPost = (path, body, options = {}) => apiRequest(path, { ...options, method: 'POST', body: JSON.stringify(body) })
export const apiPatch = (path, body, options = {}) => apiRequest(path, { ...options, method: 'PATCH', body: JSON.stringify(body) })
export const apiDelete = (path, options = {}) => apiRequest(path, { ...options, method: 'DELETE' })
