import React from 'react'
export default function FeatureCard({title, desc}){ return (
  <div className="bg-white rounded-lg p-5 shadow-sm"><h4 className="font-semibold">{title}</h4><p className="mt-2 text-sm text-slate-600">{desc}</p></div>
)}
