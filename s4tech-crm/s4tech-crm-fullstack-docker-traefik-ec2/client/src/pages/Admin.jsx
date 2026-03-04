import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../auth/AuthProvider'

export default function Admin(){
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  useEffect(()=>{
    if(!user) return
    axios.get('/api/users', { headers: { Authorization: 'Bearer ' + user.token } }).then(r=>setUsers(r.data)).catch(()=>setUsers([]))
  },[user])

  const changeRole = (id, role)=>{
    axios.post(`/api/users/${id}/role`, { role }, { headers: { Authorization: 'Bearer ' + user.token } }).then(()=>{
      setUsers(u=>u.map(x=> x.id===id ? {...x, role} : x))
    }).catch(err=>alert('error: '+ (err?.response?.data?.error || err.message)))
  }

  if(!user) return <div>Please sign in as an admin to access this page.</div>
  return (
    <section>
      <h2 className="text-2xl font-bold">Admin — Team & Roles</h2>
      <div className="mt-4 bg-white p-4 rounded shadow">
        <table className="w-full text-left">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u=> (
              <tr key={u.id} className="border-t">
                <td className="py-2">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button onClick={()=>changeRole(u.id,'admin')} className="mr-2 px-2 py-1 rounded border">Admin</button>
                  <button onClick={()=>changeRole(u.id,'manager')} className="mr-2 px-2 py-1 rounded border">Manager</button>
                  <button onClick={()=>changeRole(u.id,'sales')} className="px-2 py-1 rounded border">Sales</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
