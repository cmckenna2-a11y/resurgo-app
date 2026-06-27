const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', req.user.id)
    .order('date', { ascending: false })
    .limit(90);

  if (error) return res.status(500).json({ error: 'Failed to fetch moods' });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { mood, date } = req.body;
  if (!Number.isInteger(mood) || mood < 1 || mood > 5) {
    return res.status(400).json({ error: 'mood must be an integer 1-5' });
  }

  const dateStr = date || new Date().toISOString().split('T')[0];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return res.status(400).json({ error: 'date must be YYYY-MM-DD' });
  }

  const { data, error } = await supabase
    .from('mood_entries')
    .upsert(
      { user_id: req.user.id, mood, date: dateStr },
      { onConflict: 'user_id,date' }
    )
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Failed to save mood' });
  res.json(data);
});

module.exports = router;
