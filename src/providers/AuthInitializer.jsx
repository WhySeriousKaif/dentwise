'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { getCurrentUser } from '../features/auth/authSlice';

export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize authentication state on app load
    dispatch(getCurrentUser());
  }, [dispatch]);

  return null; // This component doesn't render anything
}
