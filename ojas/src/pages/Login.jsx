import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Login() {
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const trimmed = username.trim()
    if (!trimmed || !password) { setError('Username and password are required'); return }
    try {
      setLoading(true)
      await api.login({ username: trimmed, password })
      localStorage.setItem('username', trimmed)
      navigate('/items')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
    
  }

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <div className="brand-logo" />
          <div className="brand-title">Online Auction</div>
        </div>
        <div className="muted">Welcome back</div>
      </div>

      <div className="card" style={{ maxWidth: 460, margin: '40px auto' }}>
        <h2 style={{ marginTop: 0, marginBottom: 14 }}>Login</h2>
        <form className="grid" onSubmit={handleSubmit}>
          <div className="grid">
            <label>Username</label>
            <input className="input" type="text" placeholder="john_doe" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="grid">
            <label>Password</label>
            <input className="input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div className="error">{error}</div>}
          <div className="space-between">
            <div className="muted">No account? <Link className="link" to="/signup">Sign up</Link></div>
            <button className="button" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}


