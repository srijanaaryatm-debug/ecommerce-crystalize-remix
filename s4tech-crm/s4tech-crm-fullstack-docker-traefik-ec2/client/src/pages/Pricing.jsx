import React from 'react'
import PricingCard from '../components/PricingCard'
export default function Pricing(){
  return (
    <section>
      <h2 className="text-2xl font-bold">Pricing</h2>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <PricingCard tier="Starter" price="$29" per="/user/mo" features={["Contacts & Tasks","Email Sequences"]} />
        <PricingCard tier="Growth" price="$79" per="/user/mo" features={["Automation","Integrations"]} />
        <PricingCard tier="Scale" price="$149" per="/user/mo" features={["Advanced Analytics","SSO & Security"]} />
      </div>
    </section>
  )
}
