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

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { mood, date } = req.body;
  if (!mood || mood < 1 || mood > 5) {
    return res.status(400).json({ error: 'mood must be 1-5' });
  }

  const { data, error } = await supabase
    .from('mood_entries')
    .upsert(
      { user_id: req.user.id, mood, date: date || new Date().toISOString().split('T')[0] },
      { onConflict: 'user_id,date' }
    )
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
