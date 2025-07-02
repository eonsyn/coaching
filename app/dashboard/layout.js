import { getLoggedInUser } from '@/lib/auth';
import LayoutClient from './LayoutClient';
import { redirect } from 'next/navigation';
import { toast } from 'react-toastify';
export default async function DashboardLayout({ children }) {
  const user = await getLoggedInUser();
 

  // Strip sensitive info before sending to client
  const safeUser = { 
    userId:user._id,
    name: user.name,
    email: user.email,
    saveQuestion: user.saveQuestion,
    score: user.score,
    correctQuestion: user.correctQuestion,
    incorrectQuestion: user.incorrectQuestion,
    performance: user.performance
  }
    

  return <LayoutClient user={safeUser}>{children}</LayoutClient>;
}
