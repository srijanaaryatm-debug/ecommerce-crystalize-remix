const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')

const DB_FILE = process.env.DATABASE_FILE || path.join(__dirname, 'dev.sqlite')
const PORT = process.env.SERVER_PORT || 4000

const app = express()
app.use(cors())
app.use(bodyParser.json())

// init db
const db = new sqlite3.Database(DB_FILE)

function ensureTables(){
  db.serialize(()=>{
    db.run(`CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY, name TEXT, company TEXT, email TEXT, role TEXT)`)
    db.run(`CREATE TABLE IF NOT EXISTS deals (id INTEGER PRIMARY KEY, title TEXT, value INTEGER, stage TEXT, created_at TEXT)`)
  })
}
ensureTables()

// simple RBAC middleware - dev token based in Authorization header
function requireRole(roles){
  return (req,res,next)=>{
    const auth = req.header('authorization') || '' // e.g. 'Bearer admin' or 'Bearer sales'
    const token = auth.split(' ')[1] || ''
    // token maps to roles: admin > manager > sales
    if(!token) return res.status(401).json({error:'missing token (use Authorization: Bearer admin)'})
    if(roles.includes(token)) return next()
    return res.status(403).json({error:'forbidden - role not allowed'})
  }
}

app.get('/api/contacts', (req,res)=>{
  db.all('SELECT * FROM contacts LIMIT 100', (err, rows)=>{ if(err) return res.status(500).json({error:err.message}); res.json(rows) })
})

app.post('/api/contacts', requireRole(['admin','manager']), (req,res)=>{
  const {name,company,email,role} = req.body
  db.run('INSERT INTO contacts (name,company,email,role) VALUES (?,?,?,?)', [name,company,email,role], function(err){ if(err) return res.status(500).json({error:err.message}); res.json({id:this.lastID}) })
})

app.get('/api/deals', (req,res)=>{
  db.all('SELECT * FROM deals ORDER BY created_at DESC', (err, rows)=>{ if(err) return res.status(500).json({error:err.message}); res.json(rows) })
})

app.get('/api/metrics', (req,res)=>{
  // simple aggregated months (seed provides compatible data)
  db.all("SELECT month, revenue, leads FROM metrics ORDER BY id", (err, rows)=>{
    if(err) return res.status(500).json({error:err.message});
    res.json(rows)
  })
})

// health
app.get('/health', (req,res)=>res.json({ok:true}))

app.listen(PORT, ()=> console.log(`Server listening on ${PORT}`))


// --- FIREBASE_VERIFY_AND_ADMIN_ENDPOINTS ---
const admin = require('./firebaseAdmin')

async function verifyFirebaseToken(req, res, next){
  const auth = req.header('authorization') || ''
  const token = auth.split(' ')[1]
  if(!token) return res.status(401).json({error:'missing token'})
  try{
    const decoded = await admin.auth().verifyIdToken(token)
    req.user = decoded
    return next()
  }catch(err){
    return res.status(401).json({error:'invalid token', details: err.message})
  }
}

// helper middleware to check roles from decoded token (custom claim `role` expected)
function requireRole(roles){
  return (req,res,next)=>{
    const role = (req.user && (req.user.role || req.user['custom:role'])) || 'sales'
    if(roles.includes(role)) return next()
    return res.status(403).json({error:'forbidden - insufficient role'})
  }
}

// Admin: list users (backed by contacts table)
app.get('/api/users', verifyFirebaseToken, requireRole(['admin','manager']), (req,res)=>{
  db.all('SELECT id,name,email,role FROM contacts', (err, rows)=>{ if(err) return res.status(500).json({error:err.message}); res.json(rows) })
})

// Admin: change user role
app.post('/api/users/:id/role', verifyFirebaseToken, requireRole(['admin']), (req,res)=>{
  const id = req.params.id
  const { role } = req.body
  db.run('UPDATE contacts SET role = ? WHERE id = ?', [role, id], function(err){ if(err) return res.status(500).json({error:err.message}); res.json({ok:true}) })
})

// protect creation of contacts to admin/manager
app.post('/api/contacts', verifyFirebaseToken, requireRole(['admin','manager']), (req,res)=>{
  const {name,company,email,role} = req.body
  db.run('INSERT INTO contacts (name,company,email,role) VALUES (?,?,?,?)', [name,company,email,role], function(err){ if(err) return res.status(500).json({error:err.message}); res.json({id:this.lastID}) })
})

// --- FIREBASE_VERIFY_AND_ADMIN_ENDPOINTS ---
