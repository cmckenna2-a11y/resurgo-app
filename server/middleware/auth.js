const supabase = require('../lib/supabase');

async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No auth token' });

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
  } catch (e) {
    return res.status(503).json({ error: 'Auth service unavailable' });
  }
}

async function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, school')
      .eq('id', req.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.adminProfile = profile;
    next();
  } catch (e) {
    return res.status(503).json({ error: 'Auth service unavailable' });
  }
}

module.exports = { requireAuth, requireAdmin };
