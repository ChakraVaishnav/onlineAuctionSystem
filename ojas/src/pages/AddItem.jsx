import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'

export default function AddItem({ items, setItems }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startingPrice, setStartingPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const username = localStorage.getItem('username')
if (!username) {
  setError('You must be logged in to add an item')
  return
}


    const price = Number(startingPrice)
    if (!name.trim()) return
    if (Number.isNaN(price) || price < 0) {
      window.alert('Starting price must be a non-negative number.')
      return
    }

    try {
      setLoading(true)
      await api.addItem({ name, description, startingPrice }, username)
      // Always refetch to ensure we have server-generated IDs
      const refreshed = await api.listItems()
      const normalizeItem = (x) => ({
        id: x.id ?? x.itemId ?? x.auctionItemId ?? x.itemID ?? x.item_id,
        name: x.name ?? x.title ?? 'Untitled',
        description: x.description ?? x.details ?? '',
        currentHighestBid: x.currentHighestBid ?? x.highestBid ?? x.currentBid ?? x.startingPrice ?? 0,
        status: x.status ?? x.state ?? 'Open',
      })
      setItems(Array.isArray(refreshed) ? refreshed.map(normalizeItem) : [])
      navigate('/items')
    } catch (e) {
      setError(e.message || 'Failed to add item')
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
        <Link className="link" to="/items">Back to Items</Link>
      </div>
      <div className="card" style={{ maxWidth: 640, margin: '0 auto' }}>
        <h2 style={{ marginTop: 0, marginBottom: 14 }}>Add Item</h2>
        <form className="grid" onSubmit={handleSubmit}>
          <label className="grid">
            <span>Item Name</span>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vintage Clock"
            />
          </label>
          <label className="grid">
            <span>Description</span>
            <textarea
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </label>
          <label className="grid">
            <span>Starting Price</span>
            <input
              className="input"
              type="number"
              min="0"
              step="1"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              placeholder="0"
            />
          </label>
          {error && <div className="error">{error}</div>}
          <div className="space-between">
            <div />
            <button className="button" type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
