import React, {useEffect, useState} from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import axios from 'axios'

export default function Dashboard(){
  const [data, setData] = useState([])
  useEffect(()=>{ axios.get('/api/metrics').then(r=>setData(r.data)).catch(()=>setData([])) },[])
  return (
    <section>
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="mt-4 bg-white p-6 rounded-lg shadow">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
