const BASE_URL = 'http://localhost:8081'

function getAuthHeaders() {
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')
  const h = {}
  if (token) h['Authorization'] = `Bearer ${token}`
  if (username) h['X-Username'] = username
  return h
}

async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  })
  const text = await res.text()
  let data
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  if (!res.ok) {
    const message = (data && (data.error || data.message)) || res.statusText
    throw new Error(message)
  }
  return data
}

export const api = {
  // Auth
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // Items
  listItems: () => request('/items'),
  addItem: (payload, username) => 
    request(`/items?username=${encodeURIComponent(username)}`, { method: 'POST', body: payload }),  

  placeBid: (itemId, amount) => {
    const username = localStorage.getItem('username')
    return request(`/items/${itemId}/bid?username=${encodeURIComponent(username)}&amount=${encodeURIComponent(amount)}`, { method: 'POST' })
  }
  
  
  
  
}


