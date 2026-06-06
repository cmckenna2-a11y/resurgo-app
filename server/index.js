require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());

app.use('/api/moods', require('./routes/moods'));
app.use('/api/journals', require('./routes/journals'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Start server locally (Vercel handles listening in production)
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
