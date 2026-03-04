const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const DB = process.env.DATABASE_FILE || path.join(__dirname, 'dev.sqlite')
const db = new sqlite3.Database(DB)

db.serialize(()=>{
  db.run('CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY, name TEXT, company TEXT, email TEXT, role TEXT)')
  db.run('CREATE TABLE IF NOT EXISTS deals (id INTEGER PRIMARY KEY, title TEXT, value INTEGER, stage TEXT, created_at TEXT)')
  db.run('CREATE TABLE IF NOT EXISTS metrics (id INTEGER PRIMARY KEY, month TEXT, revenue INTEGER, leads INTEGER)')

  db.run('DELETE FROM contacts')
  db.run('DELETE FROM deals')
  db.run('DELETE FROM metrics')

  const contacts = [
    ['Alice Johnson','Acme Co','alice@acme.com','sales'],
    ['Bob Lee','Fintech Ltd','bob@fintech.com','manager'],
    ['Rhea Patel','ShopCo','rhea@shopco.com','admin']
  ]
  const stmt = db.prepare('INSERT INTO contacts (name,company,email,role) VALUES (?,?,?,?)')
  contacts.forEach(c=>stmt.run(c))
  stmt.finalize()

  const deals = [
    ['Website redesign', 5000, 'proposal', new Date().toISOString()],
    ['Marketing audit', 12000, 'won', new Date().toISOString()],
  ]
  const sd = db.prepare('INSERT INTO deals (title,value,stage,created_at) VALUES (?,?,?,?)')
  deals.forEach(d=>sd.run(d))
  sd.finalize()

  const metrics = [
    ['Jan', 3000, 120], ['Feb',4200,210], ['Mar',7600,320], ['Apr',6400,280], ['May',9800,420], ['Jun',12500,520]
  ]
  const sm = db.prepare('INSERT INTO metrics (month,revenue,leads) VALUES (?,?,?)')
  metrics.forEach(m=>sm.run(m))
  sm.finalize()

  console.log('Seed complete')
  db.close()
})
