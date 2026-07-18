const path = require('path');
// Resolve relative to this file, not the process cwd, so the server finds
// the root .env no matter where it's started from.
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet());

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
const readLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, slow down.' },
});
app.use((req, res, next) => {
  if (req.method === 'GET') return readLimiter(req, res, next);
  return writeLimiter(req, res, next);
});

app.use('/api/moods', require('./routes/moods'));
app.use('/api/journals', require('./routes/journals'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/account', require('./routes/account'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Safety net: any handler that throws (including malformed-body type errors)
// gets a clean 500 instead of a hung request.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.type === 'entity.parse.failed' || err.type === 'entity.too.large' ? 400 : 500;
  res.status(status).json({ error: status === 400 ? 'Invalid request body' : 'Server error' });
});

// Start server locally (Vercel handles listening in production)
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
