const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.use(requireAuth, requireAdmin);

// Users check in with their LOCAL calendar date (client sends YYYY-MM-DD in
// their timezone), so "today" here must match the user base's timezone, not
// UTC — otherwise evening check-ins count toward tomorrow.
const USER_TIMEZONE = 'America/New_York';
function localToday(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86400000);
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', { timeZone: USER_TIMEZONE }).format(d);
}

// Returns the non-admin user IDs a school admin may see, or null for a
// global admin (no school on their profile = no scoping).
// NOTE: Supabase caps a single select at 1,000 rows by default — fine at
// pilot scale, but this needs pagination once a school passes that.
async function getScopedProfiles(school) {
  let query = supabase.from('profiles').select('id, role, school').neq('role', 'admin');
  if (school) query = query.eq('school', school);
  const { data, error } = await query;
  if (error) throw new Error('Failed to fetch profiles');
  return data || [];
}

const scopeByUsers = (q, userIds) => (userIds ? q.in('user_id', userIds) : q);

// Overview stats
router.get('/stats', async (req, res) => {
  const school = req.adminProfile.school;

  try {
    const profiles = await getScopedProfiles(school);
    const userIds = school ? profiles.map(p => p.id) : null;

    const students = profiles.filter(p => p.role === 'student').length;
    const athletes = profiles.filter(p => p.role === 'athlete').length;

    // If a school admin has zero users, short-circuit
    if (school && profiles.length === 0) {
      return res.json({ totalUsers: 0, students: 0, athletes: 0, activeUsers7d: 0, checkInsToday: 0, totalJournalEntries: 0, pendingStories: 0 });
    }

    const day7 = localToday(-7);
    const today = localToday();

    const [activeRes, todayMoodsRes, journalRes, pendingStoriesRes] = await Promise.all([
      scopeByUsers(supabase.from('mood_entries').select('user_id').gte('date', day7), userIds),
      scopeByUsers(supabase.from('mood_entries').select('id', { count: 'exact', head: true }).eq('date', today), userIds),
      scopeByUsers(supabase.from('journal_entries').select('id', { count: 'exact', head: true }), userIds),
      scopeByUsers(supabase.from('story_submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending'), userIds),
    ]);

    const activeSet = new Set((activeRes.data || []).map(r => r.user_id));

    res.json({
      totalUsers: profiles.length,
      students,
      athletes,
      activeUsers7d: activeSet.size,
      checkInsToday: todayMoodsRes.count || 0,
      totalJournalEntries: journalRes.count || 0,
      pendingStories: pendingStoriesRes.count || 0,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Mood trend — daily average for last 30 days
router.get('/mood-trend', async (req, res) => {
  const school = req.adminProfile.school;

  try {
    const userIds = school ? (await getScopedProfiles(school)).map(p => p.id) : null;
    if (school && userIds.length === 0) return res.json([]);

    const day30 = localToday(-30);
    const { data, error } = await scopeByUsers(
      supabase.from('mood_entries').select('date, mood').gte('date', day30).order('date', { ascending: true }),
      userIds
    );

    if (error) return res.status(500).json({ error: 'Failed to fetch mood trend' });

    // Aggregate by date
    const byDate = {};
    (data || []).forEach(({ date, mood }) => {
      if (!byDate[date]) byDate[date] = { sum: 0, count: 0 };
      byDate[date].sum += mood;
      byDate[date].count += 1;
    });

    const trend = Object.entries(byDate).map(([date, { sum, count }]) => ({
      date,
      avg: parseFloat((sum / count).toFixed(2)),
      count,
    }));

    res.json(trend);
  } catch {
    res.status(500).json({ error: 'Failed to fetch mood trend' });
  }
});

// Mood distribution — count queries instead of loading every row, so the
// numbers stay correct past Supabase's 1,000-row select cap.
router.get('/mood-distribution', async (req, res) => {
  const school = req.adminProfile.school;

  try {
    const userIds = school ? (await getScopedProfiles(school)).map(p => p.id) : null;
    if (school && userIds.length === 0) {
      return res.json([1, 2, 3, 4, 5].map(mood => ({ mood, count: 0 })));
    }

    const counts = await Promise.all(
      [1, 2, 3, 4, 5].map(v =>
        scopeByUsers(supabase.from('mood_entries').select('id', { count: 'exact', head: true }).eq('mood', v), userIds)
      )
    );

    if (counts.some(c => c.error)) return res.status(500).json({ error: 'Failed to fetch mood distribution' });

    res.json(counts.map((c, i) => ({ mood: i + 1, count: c.count || 0 })));
  } catch {
    res.status(500).json({ error: 'Failed to fetch mood distribution' });
  }
});

// Story submissions (pending + recent)
router.get('/submissions', async (req, res) => {
  const { status = 'pending' } = req.query;
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const school = req.adminProfile.school;

  try {
    const userIds = school ? (await getScopedProfiles(school)).map(p => p.id) : null;
    if (school && userIds.length === 0) return res.json([]);

    const { data, error } = await scopeByUsers(
      supabase.from('story_submissions').select('*').eq('status', status).order('created_at', { ascending: false }).limit(50),
      userIds
    );

    if (error) return res.status(500).json({ error: 'Failed to fetch submissions' });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Approve or reject a submission
router.patch('/submissions/:id', async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'status must be approved or rejected' });
  }

  const { data, error } = await supabase
    .from('story_submissions')
    .update({ status, reviewed_at: new Date().toISOString(), reviewed_by: req.user.id })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Failed to update submission' });
  res.json(data);
});

// Recent users
router.get('/users', async (req, res) => {
  const school = req.adminProfile.school;

  let query = supabase
    .from('profiles')
    .select('id, name, email, role, school, created_at')
    .neq('role', 'admin')
    .order('created_at', { ascending: false })
    .limit(100);
  if (school) query = query.eq('school', school);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: 'Failed to fetch users' });
  res.json(data);
});

module.exports = router;
