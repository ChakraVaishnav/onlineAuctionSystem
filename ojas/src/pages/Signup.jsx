import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !username.trim() || !password) { setError('All fields are required'); return }
    try {
      setLoading(true)
      await api.signup({ email, username: username.trim(), password })
      navigate('/')
    } catch (err) {
      setError(err.message || 'Signup failed')
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
        <div className="muted">Create your account</div>
      </div>

      <div className="card" style={{ maxWidth: 520, margin: '40px auto' }}>
        <h2 style={{ marginTop: 0, marginBottom: 14 }}>Sign up</h2>
        <form className="grid" onSubmit={handleSubmit}>
          <div className="grid">
            <label>Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
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
            <div className="muted">Have an account? <Link className="link" to="/">Login</Link></div>
            <button className="button" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}


