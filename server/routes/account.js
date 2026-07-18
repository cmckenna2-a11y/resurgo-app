const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// Permanently delete the authenticated user's account and all data
router.delete('/', async (req, res) => {
  const userId = req.user.id;

  try {
    // Delete app data first. The privacy policy promises full deletion, so we
    // remove story submissions too (the FK would only anonymize them).
    // The profiles row is intentionally NOT deleted here: it goes away via
    // the auth.users ON DELETE CASCADE below. If we deleted it first and the
    // auth deletion then failed, the user could still log in but would have
    // no profile — stuck on a loading screen forever.
    const tables = ['mood_entries', 'journal_entries', 'story_submissions'];
    for (const table of tables) {
      const { error } = await supabase.from(table).delete().eq('user_id', userId);
      if (error) return res.status(500).json({ error: 'Account deletion failed. Please try again.' });
    }

    // Delete the auth user (requires service role key); cascades to profiles.
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) return res.status(500).json({ error: 'Account deletion failed. Please try again.' });

    res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: 'Account deletion failed. Please try again.' });
  }
});

module.exports = router;
