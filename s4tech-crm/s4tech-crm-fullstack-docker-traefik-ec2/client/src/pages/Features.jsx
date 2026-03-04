import React from 'react'
import FeatureCard from '../components/FeatureCard'
export default function Features(){
  const features = [['Lead Capture','Auto-capture leads'],['Automation','Sequences & triggers'],['Unified Inbox','Email, SMS, Chat']]
  return (
    <section>
      <h2 className="text-2xl font-bold">Features</h2>
      <div className="mt-6 grid md:grid-cols-3 gap-4">{features.map((f,i)=>(<FeatureCard key={i} title={f[0]} desc={f[1]} />))}</div>
    </section>
  )
}
