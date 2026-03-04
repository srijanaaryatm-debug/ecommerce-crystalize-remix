import React from 'react'
export default function PricingCard({tier, price, per, features}){
  return (
    <div className="p-6 rounded-2xl shadow bg-white">
      <div className="text-sm text-slate-500">{tier}</div>
      <div className="text-3xl font-bold mt-1">{price}<span className="text-sm font-normal">{per}</span></div>
      <ul className="mt-4 text-sm text-slate-600">{features.map((f,i)=>(<li key={i}>• {f}</li>))}</ul>
      <div className="mt-6"><button className="w-full px-4 py-3 rounded-lg bg-indigo-600 text-white">Choose {tier}</button></div>
    </div>
  )
}
