import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <section>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-extrabold">S4Tech CRM — power your sales with modern automation</h1>
          <p className="mt-4 text-slate-600">Centralize leads, automate follow-ups, and turn opportunities into revenue.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/contact" className="px-6 py-3 rounded-lg bg-indigo-600 text-white">Request a demo</Link>
            <Link to="/features" className="px-6 py-3 rounded-lg border">See features</Link>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="text-sm text-slate-500">Quick stats</div>
          <div className="mt-2 text-2xl font-semibold">$12,450 MRR</div>
        </div>
      </div>
    </section>
  )
}
