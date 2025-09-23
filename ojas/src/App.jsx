import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles.css'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Items from './pages/Items.jsx'
import AddItem from './pages/AddItem.jsx'
import { api } from './api'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const normalizeItem = (x) => ({
    id: x.id ?? x.itemId ?? x.itemid ?? x.itemID ?? x.item_id ?? x.auctionItemId ?? x.auctionItemID ?? x.auction_item_id,
    name: x.name ?? x.title ?? 'Untitled',
    description: x.description ?? x.details ?? '',
    currentHighestBid: x.currentHighestBid ?? x.highestBid ?? x.currentBid ?? x.startingPrice ?? 0,
    status: x.status ?? x.state ?? 'Open',
  })

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        const data = await api.listItems()
        if (!active) return
        const list = Array.isArray(data) ? data.map(normalizeItem) : []
        setItems(list)
      } catch (e) {
        if (!active) return
        setError(e.message || 'Failed to load items')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/items" element={<Items items={items} setItems={setItems} loading={loading} error={error} />} />
        <Route path="/add" element={<AddItem items={items} setItems={setItems} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
