
import { getLoggedInUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

import DashboardHero from "@/components/dashboard/DashboardHero";
import SkillGrowthGraph from "@/components/dashboard/SkillGrowthGraph"
import HugeQuestionBank from "@/components/dashboard/HugeQuestionBank";
export default function Dashboard() {
  
  return (
    < >
        <DashboardHero/>
        <SkillGrowthGraph/>
        <HugeQuestionBank/>
    </ >
  );
}
