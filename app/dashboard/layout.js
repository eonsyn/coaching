import { getLoggedInUser } from '@/lib/auth';
import LayoutClient from './LayoutClient';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  const user = await getLoggedInUser();

  if (!user || !user.user) {
    redirect('/auth/login');
  }

  const safeUser = {
    userId: user.user?._id?.toString() || '',
    name: user.user?.name || '',
    role: user.role || '',  // This might also be under user.user.role depending on your schema
  };
  
console.log("user",user);
  return <LayoutClient user={user}>{children}</LayoutClient>;
}
