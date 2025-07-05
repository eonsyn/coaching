import { getLoggedInUser } from '@/lib/auth';
import UserStatsCard from '@/components/dashboard/user/UserStatsCard';

// ISR Configuration (revalidate every 60 seconds)
export const revalidate = 60; // Re-generate this page at most once every 60 seconds

export default async function Page() {
  const user = await getLoggedInUser();

  if (!user) {
    return <div className="text-center p-10"> Please log in to access your dashboard.</div>;
  }

  const safeUser = {
    name: user.name,
    email: user.email,
    score: user.score,
    correctQuestion: user.correctQuestion || [],
    incorrectQuestion: user.incorrectQuestion || [],
    performanceByDate: user.performanceByDate || {},
  };

  return (
    <div className="min-h-screen md:px-6 pt-2 bg-background text-foreground">
      <UserStatsCard user={safeUser} />
    </div>
  );
}
