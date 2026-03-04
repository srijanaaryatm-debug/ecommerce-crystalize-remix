import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from './utils/mailer.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const users = {}; // demo store

app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  if (users[email]) return res.status(400).json({ error: 'User exists' });
  users[email] = { email, password };
  res.json({ message: 'Registered' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users[email];
  if (!user || user.password !== password) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!users[email]) return res.status(400).json({ error: 'User not found' });
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
  await sendPasswordResetEmail(email, token);
  res.json({ message: 'Password reset email sent' });
});

app.post('/api/reset-password', (req, res) => {
  const { token, password } = req.body;
  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    if (!users[email]) return res.status(400).json({ error: 'User not found' });
    users[email].password = password;
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

app.listen(process.env.PORT, () => console.log(`Backend on ${process.env.PORT}`));
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend on ${PORT}`);
});
