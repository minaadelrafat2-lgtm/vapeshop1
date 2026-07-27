import { type ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isStaffRole } from '@/lib/auth';

export function ProtectedRoute({ children, requireStaff = false }: { children: ReactNode; requireStaff?: boolean }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    if (!loading && user && profile) setProfileChecked(true);
    if (!loading && !user) setProfileChecked(false);
  }, [loading, user, profile]);

  if (loading || (user && requireStaff && !profileChecked)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950">
        <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  if (requireStaff && !isStaffRole(profile?.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
