const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// Permanently delete the authenticated user's account and all data
router.delete('/', async (req, res) => {
  const userId = req.user.id;

  try {
    // Delete app data first (in case FK cascade isn't configured).
    // Abort before touching the auth user if any step fails, so we never
    // delete someone's login while their data is still half-present.
    const tables = [
      ['mood_entries', 'user_id'],
      ['journal_entries', 'user_id'],
      ['story_submissions', 'user_id'],
      ['profiles', 'id'],
    ];
    for (const [table, col] of tables) {
      const { error } = await supabase.from(table).delete().eq(col, userId);
      if (error) return res.status(500).json({ error: 'Account deletion failed. Please try again.' });
    }

    // Delete the actual auth user (requires service role key)
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) return res.status(500).json({ error: 'Account deletion failed. Please try again.' });

    res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: 'Account deletion failed. Please try again.' });
  }
});

module.exports = router;
