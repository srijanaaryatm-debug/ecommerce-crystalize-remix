const admin = require('firebase-admin')

const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64 || ''
if(!b64){
  console.warn('FIREBASE_SERVICE_ACCOUNT_B64 not set - admin auth will fail for protected routes')
} else {
  try{
    const json = Buffer.from(b64, 'base64').toString('utf8')
    const obj = JSON.parse(json)
    admin.initializeApp({ credential: admin.credential.cert(obj) })
  }catch(err){
    console.error('Invalid FIREBASE_SERVICE_ACCOUNT_B64:', err.message)
  }
}

module.exports = admin
