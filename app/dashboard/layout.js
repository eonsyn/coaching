// app/dashboard/layout.js
import { getLoggedInUser } from '@/lib/auth';
import LayoutClient from './LayoutClient';
import { redirect } from 'next/navigation';
import { toast } from 'react-toastify';
export default async function DashboardLayout({ children }) {
  const user = await getLoggedInUser();
 
if(!user){
  redirect('/auth/login')
  return <div>
    Logining to acess it 
    </div>
}
  // Strip sensitive info before sending to client
 
  const safeUser = {
    userId: user._id.toString(), // ✅ Convert ObjectId to string
    name: user.name,
  
  };

  

  return <LayoutClient  user={safeUser}>{children}</LayoutClient>;
}
