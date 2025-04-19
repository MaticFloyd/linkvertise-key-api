
const express = require('express');
const app = express();
const crypto = require('crypto');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const keys = {};

// Generate key
app.post('/generate', (req, res) => {
  const referer = req.headers.referer || '';
  if (!referer.includes('linkvertise.com')) {
    return res.status(403).json({ error: 'You must come from Linkvertise.' });
  }

  const key = crypto.randomBytes(8).toString('hex');
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
  keys[key] = expiresAt;

  return res.json({ key });
});

// Verify key
app.post('/verify', (req, res) => {
  const { key } = req.body;
  const expiresAt = keys[key];

  if (!expiresAt) return res.json({ valid: false });
  if (Date.now() > expiresAt) {
    delete keys[key];
    return res.json({ valid: false });
  }

  delete keys[key]; // one-time use
  return res.json({ valid: true });
});

app.listen(3000, () => console.log('Server running on port 3000'));
