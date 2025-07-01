import { getLoggedInUser } from '@/lib/auth';
import LayoutClient from './LayoutClient';
import { redirect } from 'next/navigation';
import { toast } from 'react-toastify';
export default async function DashboardLayout({ children }) {
  const user = await getLoggedInUser();
 

  // Strip sensitive info before sending to client
  const safeUser = { 
    name: user.name,
    email: user.email,
    saveQuestion:user.saveQuestion,
    score:user.score
  }
    

  return <LayoutClient user={safeUser}>{children}</LayoutClient>;
}
