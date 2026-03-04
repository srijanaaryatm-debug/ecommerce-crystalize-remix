import React, { useState } from 'react';

export default function App() {
  const [page, setPage] = useState('home');
  return (
    <div style={{textAlign:'center', marginTop:'50px'}}>
      <h1>Fullstack Secure App</h1>
      <p>Frontend connected to backend with HTTPS & SMTP ready.</p>
    </div>
  );
}
