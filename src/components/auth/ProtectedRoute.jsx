'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getCurrentUser } from '../../features/auth/authSlice';

export default function ProtectedRoute({ children }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, user, initialized } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Only check auth if not already initialized
    if (!initialized) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, initialized]);

  useEffect(() => {
    // Only redirect if we've checked auth status and user is not authenticated
    if (initialized && !loading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, loading, initialized, router]);

  // Show loading while checking auth status
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
