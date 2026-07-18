const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return res.status(500).json({ error: 'Failed to fetch entries' });
  res.json(data);
});

const CATEGORIES = ['general', 'athlete', 'stress', 'gratitude'];

router.post('/', async (req, res) => {
  const { category, prompt, content, closer } = req.body;
  if (typeof content !== 'string' || !content.trim() || !CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'category and content are required' });
  }
  if (prompt != null && typeof prompt !== 'string') return res.status(400).json({ error: 'Invalid prompt' });
  if (closer != null && typeof closer !== 'string') return res.status(400).json({ error: 'Invalid closer' });
  if (content.length > 10000 || (prompt?.length ?? 0) > 1000 || (closer?.length ?? 0) > 2000) {
    return res.status(400).json({ error: 'Entry is too long' });
  }

  const { data, error } = await supabase
    .from('journal_entries')
    .insert({ user_id: req.user.id, category, prompt, content: content.trim(), closer: closer?.trim() })
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Failed to save entry' });
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select('id')
    .single();

  if (error?.code === 'PGRST116') return res.status(404).json({ error: 'Entry not found' });
  if (error) return res.status(500).json({ error: 'Failed to delete entry' });
  res.json({ success: true });
});

module.exports = router;
