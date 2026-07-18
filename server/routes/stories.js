const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

const SITUATIONS = ['exam', 'burnout', 'injury', 'slump', 'lonely', 'identity', 'pressure', 'anxiety'];

router.get('/approved', async (req, res) => {
  const { situation } = req.query;
  let query = supabase
    .from('story_submissions')
    .select('id, situation, story, helped, advice, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(100);

  if (situation && SITUATIONS.includes(situation)) query = query.eq('situation', situation);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: 'Failed to fetch stories' });
  res.json(data);
});

router.post('/', requireAuth, async (req, res) => {
  const { situation, story, helped, advice } = req.body;
  if ([situation, story, helped, advice].some(v => typeof v !== 'string' || !v.trim())) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!SITUATIONS.includes(situation)) {
    return res.status(400).json({ error: 'Invalid situation' });
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

  if (error) return res.status(500).json({ error: 'Failed to submit story' });
  res.json({ success: true, id: data.id });
});

module.exports = router;
