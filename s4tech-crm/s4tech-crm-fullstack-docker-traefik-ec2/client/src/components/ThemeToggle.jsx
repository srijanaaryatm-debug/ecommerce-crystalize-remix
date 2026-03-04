import React, {useEffect, useState} from 'react'

export default function ThemeToggle(){
  const [dark, setDark] = useState(() => localStorage.getItem('s4-dark') === '1')
  useEffect(()=>{ document.documentElement.classList.toggle('dark', dark); localStorage.setItem('s4-dark', dark ? '1' : '0') }, [dark])
  return (
    <button onClick={()=>setDark(!dark)} className="px-3 py-1 border rounded">{dark ? '☾ Dark' : '☼ Light'}</button>
  )
}
