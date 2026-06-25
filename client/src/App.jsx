import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from './context/AuthContext';
import Landing from './components/Landing';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Forgot from './components/auth/Forgot';
const AppShell = lazy(() => import('./components/app/AppShell'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const Onboarding = lazy(() => import('./components/auth/Onboarding'));

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="phone" style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}><div style={{ color: '#aaa', fontSize: 14 }}>Loading...</div></div>;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, profile, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="phone" style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
        <div style={{ color: '#aaa', fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  const fallback = <div className="phone" style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}><div style={{ color: '#aaa', fontSize: 14 }}>Loading...</div></div>;

  return (
    <Suspense fallback={fallback}>
    <Routes>
      <Route path="/" element={
        !user ? <Landing /> :
        !profile ? fallback :
        profile?.role === 'admin' ? <Navigate to="/admin" replace /> :
        !profile?.onboarding?.struggle ? <Navigate to="/onboarding" replace /> :
        <AppShell />
      } />
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/onboarding" element={
        <PrivateRoute><Onboarding /></PrivateRoute>
      } />
      <Route path="/admin/*" element={
        <AdminRoute><AdminDashboard /></AdminRoute>
      } />
    </Routes>
    </Suspense>
  );
}
