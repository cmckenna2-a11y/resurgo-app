const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

router.get('/approved', async (req, res) => {
  const { situation } = req.query;
  let query = supabase
    .from('story_submissions')
    .select('id, situation, story, helped, advice, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (situation) query = query.eq('situation', situation);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', requireAuth, async (req, res) => {
  const { situation, story, helped, advice } = req.body;
  if (!situation || !story || !helped || !advice) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const wordCount = story.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < 30) {
    return res.status(400).json({ error: 'Story must be at least 30 words' });
  }
  if (story.length > 5000 || advice.length > 2000 || helped.length > 2000) {
    return res.status(400).json({ error: 'Submission is too long' });
  }

  const { data, error } = await supabase
    .from('story_submissions')
    .insert({ user_id: req.user.id, situation, story: story.trim(), helped: helped.trim(), advice: advice.trim() })
    .select('id')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, id: data.id });
});

module.exports = router;
