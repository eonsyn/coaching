'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Asidebar from '@/components/navigation/Asidebar';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/store';
import { setUser } from '@/store/slices/userSlice';

function LayoutContent({ user, children }) {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      toast.error('Please login to continue.', {
        onClick: () => router.push('/auth/login'),
        autoClose: 3000,
      });

      const timeout = setTimeout(() => {
        router.push('/auth/login');
      }, 3500);

      return () => clearTimeout(timeout);
    } else {
      // Save to localStorage and Redux
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch(setUser(user));
    }
  }, [user, router, dispatch]);

  if (!user) return null;

  return (
    <main className="flex overflow-hidden h-full w-full">
      <Asidebar />
      <div className="pt-2 overflow-y-auto flex-1">{children}</div>
    </main>
  );
}

export default function LayoutClient({ user, children }) {
  return (
    <Provider store={store}>
      <LayoutContent user={user}>{children}</LayoutContent>
    </Provider>
  );
}
