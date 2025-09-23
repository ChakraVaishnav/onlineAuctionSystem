import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export default function Items({ items, setItems }) {
  const username = localStorage.getItem('username') || ''
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [amountById, setAmountById] = useState({})
  const [submittingId, setSubmittingId] = useState(null)
  const [submitError, setSubmitError] = useState('')

  // Normalize item IDs and structure
  const normalizeItem = (x) => ({
    id: x.id ?? x.itemId ?? x.auctionItemId ?? x.itemID ?? x.item_id,
    name: x.name ?? x.title ?? 'Untitled',
    description: x.description ?? x.details ?? '',
    currentHighestBid: x.currentHighestBid ?? x.highestBid ?? x.currentBid ?? x.startingPrice ?? 0,
    status: x.status ?? x.state ?? 'Open',
  })

  // Fetch items from backend
  const fetchItems = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetch('http://localhost:8081/items', { credentials: 'include' }).then(res => res.json())
      if (Array.isArray(data)) setItems(data.map(normalizeItem))
    } catch (e) {
      setError('Failed to fetch items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  // Start editing bid
  const startBid = (id, currentHighestBid) => {
    if (!id) return
    setSubmitError('')
    setEditingId(id)
    const next = typeof currentHighestBid === 'number' && !Number.isNaN(currentHighestBid)
      ? String(currentHighestBid + 1)
      : ''
    setAmountById((prev) => ({ ...prev, [id]: next }))
  }

  // Submit bid
  const submitBid = async (id) => {
    setSubmitError('')
    const raw = amountById[id]
    const amount = Number(raw)
    if (!id || Number.isNaN(amount) || amount <= 0) { setSubmitError('Enter a valid positive amount'); return }
    const item = items.find(it => it.id === id)
    const current = item ? (item.currentHighestBid ?? 0) : 0
    if (amount <= current) { setSubmitError(`Bid must be greater than current highest ($${current})`); return }
    if (!username) { setSubmitError('You must be logged in'); return }

    try {
      setSubmittingId(id)
      await api.placeBid(id, amount)
      // Optimistic update
      setItems((prev) => prev.map(it => it.id === id ? { ...it, currentHighestBid: amount } : it))
      setEditingId(null)
      setAmountById((prev) => { const n = { ...prev }; delete n[id]; return n })
      setSubmitError('')
    } catch (e) {
      console.error('Bid failed', e)
      setSubmitError(e.message || 'Failed to place bid')
    } finally {
      setSubmittingId(null)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <div className="brand-logo" />
          <div className="brand-title">Auction Items</div>
        </div>
        <div className="row">
          <span className="muted">Welcome, {username || 'Guest'}</span>
          <Link className="button secondary" to="/add">Add Item</Link>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        {loading && <div className="muted">Loading items...</div>}
        {error && <div className="error">{error}</div>}
      </div>

      <div className="list">
        {items.length === 0 && (
          <div style={{ color: '#666' }}>No items yet. Click "Add Item" to create one.</div>
        )}
        {items.map((item, idx) => {
          const isSubmitting = submittingId === item.id
          return (
            <div key={item.id ?? `idx-${idx}`} className="card">
              <div className="space-between">
                <h3 className="item-title">{item.name}</h3>
                <span className="badge">{item.status || 'Open'}</span>
              </div>
              <p className="muted" style={{ margin: '8px 0' }}>{item.description}</p>
              <div className="space-between">
                <div>
                  <strong>Current Highest Bid:</strong> ${item.currentHighestBid ?? 0}
                </div>
                {editingId === item.id ? (
                  <div className="row" style={{ gap: 8 }}>
                    <input
                      className="input"
                      type="number"
                      min="0"
                      step="0.01"
                      value={amountById[item.id] ?? ''}
                      onChange={(e) => setAmountById((prev) => ({ ...prev, [item.id]: e.target.value }))}
                      style={{ width: 140 }}
                    />
                    <button type="button" className="button" onClick={() => submitBid(item.id)} disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting…' : 'Submit'}
                    </button>
                    <button type="button" className="button secondary" onClick={() => {
                      setEditingId(null)
                      setAmountById((prev) => { const n = { ...prev }; delete n[item.id]; return n })
                      setSubmitError('')
                    }} disabled={isSubmitting}>Cancel</button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="button"
                    onClick={() => startBid(item.id, item.currentHighestBid)}
                    disabled={item.status?.toLowerCase() === 'closed' || !item.id}
                  >
                    Place Bid
                  </button>
                )}
              </div>
              {editingId === item.id && submitError && (
                <div className="error" style={{ marginTop: 8 }}>{submitError}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
