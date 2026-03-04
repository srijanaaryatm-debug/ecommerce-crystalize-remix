import React, {useState} from 'react'
export default function Contact(){ const [sent,setSent]=useState(false)
  return (
    <section>
      <h2 className="text-2xl font-bold">Contact</h2>
      {!sent ? (
        <form onSubmit={e=>{e.preventDefault(); setSent(true)}} className="mt-6 grid md:grid-cols-2 gap-4">
          <input required placeholder="Full name" className="p-3 rounded-lg border" />
          <input required type="email" placeholder="Work email" className="p-3 rounded-lg border" />
          <textarea placeholder="Message" className="p-3 rounded-lg border md:col-span-2" rows={5} />
          <div className="md:col-span-2"><button className="px-5 py-3 rounded-lg bg-indigo-600 text-white">Send message</button></div>
        </form>
      ) : (<div className="mt-6 bg-green-50 border border-green-100 p-4 rounded-lg">Thanks — we got your message.</div>)}
    </section>
  )
}
