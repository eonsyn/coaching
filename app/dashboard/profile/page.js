import { getLoggedInUser } from '@/lib/auth';
 
import UserStatsCard from '@/components/dashboard/user/UserStatsCard';
 

export default async function Page() {
  const user = await getLoggedInUser();

  if (!user) return <div className="text-center p-10">🔒 Please log in to access your dashboard.</div>;
console.log(user)
  // Pass serializable safe user data
  const safeUser = {
    name: user.name,
    email: user.email,
    score: user.score,
    correctQuestion: user.correctQuestion,
    incorrectQuestion: user.incorrectQuestion,
    performanceByDate: user.performanceByDate,
  };

  return (
    <div className="min-h-screen px-6 pt-2 bg-background text-foreground">
      <UserStatsCard user={safeUser} />
    </div>
  );
}
