'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getCurrentUser } from '@/features/auth/authSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, initialized, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only check auth if not already initialized
    if (!initialized) {
      console.log('useAuth: Initializing auth check');
      dispatch(getCurrentUser());
    }
  }, [dispatch, initialized]);

  return {
    user,
    isAuthenticated,
    loading,
    initialized,
    error
  };
}
