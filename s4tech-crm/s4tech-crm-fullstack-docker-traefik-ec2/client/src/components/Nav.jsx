import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function Nav(){
  const { user } = useAuth()
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-400 flex items-center justify-center text-white font-bold">S4</div>
          <div className="font-semibold">S4Tech CRM</div>
        </Link>
        <nav className="hidden md:flex gap-4 items-center">
          <Link to="/features">Features</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/contact">Contact</Link>
          {user ? (<><Link to="/admin" className="text-sm mr-3">Admin</Link><div className="text-sm">{user.name}</div></>) : <Link to="/login" className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Login</Link>}
        </nav>
      </div>
    </header>
  )
}
