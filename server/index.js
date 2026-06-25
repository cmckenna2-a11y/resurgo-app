require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Behind Railway's proxy: trust the first hop so req.ip is the real client IP.
// Without this, express-rate-limit buckets every user under the proxy IP.
app.set('trust proxy', 1);

const allowedOrigins = [
  'capacitor://localhost',
  'http://localhost',
  'https://resurgomentalhealth.com',
  'https://resurgo-app-phi.vercel.app',
];
if (process.env.CLIENT_URL) allowedOrigins.push(process.env.CLIENT_URL);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
  credentials: true,
}));
app.use(express.json({ limit: '100kb' }));

const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, slow down.' },
});
app.use((req, res, next) => {
  if (req.method === 'GET') return next();
  return writeLimiter(req, res, next);
});

app.use('/api/moods', require('./routes/moods'));
app.use('/api/journals', require('./routes/journals'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/account', require('./routes/account'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Start server locally (Vercel handles listening in production)
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
