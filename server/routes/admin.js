const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.use(requireAuth, requireAdmin);

// Overview stats
router.get('/stats', async (req, res) => {
  const school = req.adminProfile.school;

  const now = new Date();
  const day7 = new Date(now - 7 * 86400000).toISOString().split('T')[0];
  const today = now.toISOString().split('T')[0];

  // Get this school's non-admin user IDs (or all if admin has no school)
  let profileQuery = supabase.from('profiles').select('id, role, school').neq('role', 'admin');
  if (school) profileQuery = profileQuery.eq('school', school);
  const profilesRes = await profileQuery;
  const profiles = profilesRes.data || [];
  const userIds = profiles.map(p => p.id);

  const students = profiles.filter(p => p.role === 'student').length;
  const athletes = profiles.filter(p => p.role === 'athlete').length;

  // If a school admin has zero users, short-circuit
  if (school && userIds.length === 0) {
    return res.json({ totalUsers: 0, students: 0, athletes: 0, activeUsers7d: 0, checkInsToday: 0, totalJournalEntries: 0, pendingStories: 0 });
  }

  const scope = (q) => (school ? q.in('user_id', userIds) : q);

  const [activeRes, todayMoodsRes, journalRes, pendingStoriesRes] = await Promise.all([
    scope(supabase.from('mood_entries').select('user_id').gte('date', day7)),
    scope(supabase.from('mood_entries').select('id', { count: 'exact', head: true }).eq('date', today)),
    scope(supabase.from('journal_entries').select('id', { count: 'exact', head: true })),
    scope(supabase.from('story_submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending')),
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
});

// Mood trend — daily average for last 30 days
router.get('/mood-trend', async (req, res) => {
  const now = new Date();
  const day30 = new Date(now - 30 * 86400000).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('mood_entries')
    .select('date, mood')
    .gte('date', day30)
    .order('date', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

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
});

// Mood distribution
router.get('/mood-distribution', async (req, res) => {
  const { data, error } = await supabase
    .from('mood_entries')
    .select('mood');

  if (error) return res.status(500).json({ error: error.message });

  const dist = [1, 2, 3, 4, 5].map(v => ({
    mood: v,
    count: (data || []).filter(r => r.mood === v).length,
  }));

  res.json(dist);
});

// Story submissions (pending + recent)
router.get('/submissions', async (req, res) => {
  const { status = 'pending' } = req.query;

  const { data, error } = await supabase
    .from('story_submissions')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
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

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Recent users
router.get('/users', async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role, school, created_at')
    .neq('role', 'admin')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
