import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Features from './pages/Features'
import Pricing from './pages/Pricing'
import Dashboard from './pages/Dashboard'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Admin from './pages/Admin'
import ThemeToggle from './components/ThemeToggle'

export default function App(){
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Nav />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-end"><ThemeToggle /></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </div>
  )
}
