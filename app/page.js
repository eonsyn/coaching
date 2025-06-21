
import { getLoggedInUser } from '@/lib/auth';
import { redirect } from 'next/navigation';


export default async function Home() {
    const user = await getLoggedInUser();

  // if (!user) {
  //   redirect('/auth/login'); // redirect if session is invalid or user not found
  // }

  return (
    <main className="w-full bg-green-600 h-full ">

      <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
    </div>
       
    
    </main>
  );
}
