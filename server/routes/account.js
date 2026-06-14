const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// Permanently delete the authenticated user's account and all data
router.delete('/', async (req, res) => {
  const userId = req.user.id;

  // Delete app data first (in case FK cascade isn't configured)
  await supabase.from('mood_entries').delete().eq('user_id', userId);
  await supabase.from('journal_entries').delete().eq('user_id', userId);
  await supabase.from('story_submissions').delete().eq('user_id', userId);
  await supabase.from('profiles').delete().eq('id', userId);

  // Delete the actual auth user (requires service role key)
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true });
});

module.exports = router;
