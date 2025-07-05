'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Asidebar from '@/components/navigation/Asidebar';

export default function LayoutClient({ user, children }) {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      toast.error('Please login to continue.', {
        onClick: () => router.push('/auth/login'),
        autoClose: 3000,
      });

      // Redirect after short delay if user doesn't click
      const timeout = setTimeout(() => {
        router.push('/auth/login');
      }, 3500);

      return () => clearTimeout(timeout);
    } else {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  if (!user) return null; // Prevent showing dashboard temporarily

  return (
    <main className="flex overflow-hidden h-full w-full">
      <Asidebar  />
      <div className=" pt-2 overflow-y-auto  flex-1">{children}</div>
    </main>
  );
}
