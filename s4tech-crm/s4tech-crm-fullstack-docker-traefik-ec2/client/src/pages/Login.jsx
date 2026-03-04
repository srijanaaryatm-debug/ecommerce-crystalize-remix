import React from 'react'
import { useAuth } from '../auth/AuthProvider'

export default function Login(){
  const { user, login, logout } = useAuth()
  return (
    <section>
      <h2 className="text-2xl font-bold">Account</h2>
      <div className="mt-4">
        {!user ? (
          <div>
            <p className="text-sm text-slate-600">Sign in with Google (Firebase)</p>
            <button onClick={login} className="px-4 py-2 bg-indigo-600 text-white rounded-lg mt-2">Sign in</button>
          </div>
        ) : (
          <div>
            <div className="font-medium">Signed in as {user.name || user.email}</div>
            <div className="text-xs text-slate-500 mt-1">UID: {user.uid}</div>
            <button onClick={logout} className="mt-2 px-4 py-2 border rounded-lg">Sign out</button>
          </div>
        )}
      </div>
    </section>
  )
}
