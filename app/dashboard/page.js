'use client';

import { FaUserGraduate, FaBookOpen, FaChartLine, FaCheckCircle, FaQuestionCircle } from 'react-icons/fa';
import { MdOutlineLeaderboard } from 'react-icons/md';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export default function Dashboard() {
  const boxRef = useRef(null);
  const boxRef2 = useRef(null);
   
  return (
 <div className="min-h-screen bg-background text-foreground p-6 sm:p-10 font-puritan">
  {/* Header */}
  <header className="mb-10">
    <h1 className="text-3xl font-bold text-darkblue">
      Welcome to Your JEE Dashboard
    </h1>
    <p className="mt-2 text-lg text-textprimary opacity-90">
      Access 3000+ hand-picked questions, track your progress, and stay exam-ready!
    </p>
  </header>

  {/* Grid of Dashboard Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Practice Questions */}
    <Link href="/dashboard/solveproblem">
      <div className="bg-card border border-lightblue/30 p-6 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition cursor-pointer group">
        <FaQuestionCircle className="text-highlight text-3xl mb-4 group-hover:scale-110 transition-transform" />
        <h2 className="text-xl font-semibold text-foreground mb-1 group-hover:text-highlight">Practice Questions</h2>
        <p className="text-sm text-textprimary opacity-80">Explore 3000+ questions from all JEE topics.</p>
      </div>
    </Link>

    {/* Leaderboard */}
    <Link href="/leaderboard">
      <div className="bg-card border border-lightblue/30 p-6 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition cursor-pointer group">
        <MdOutlineLeaderboard className="text-warning text-3xl mb-4 group-hover:scale-110 transition-transform" />
        <h2 className="text-xl font-semibold text-foreground mb-1 group-hover:text-warning">Leaderboard</h2>
        <p className="text-sm text-textprimary opacity-80">See how you rank among other aspirants.</p>
      </div>
    </Link>

    {/* Track Progress */}
    <Link href="/dashboard/profile">
      <div className="bg-card border border-lightblue/30 p-6 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition cursor-pointer group">
        <FaChartLine className="text-success text-3xl mb-4 group-hover:scale-110 transition-transform" />
        <h2 className="text-xl font-semibold text-foreground mb-1 group-hover:text-success">Track Progress</h2>
        <p className="text-sm text-textprimary opacity-80">Monitor accuracy, topic strength & more.</p>
      </div>
    </Link>

    {/* Completed Questions */}
    <Link href="/dashboard/completed">
      <div className="bg-card border border-lightblue/30 p-6 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition cursor-pointer group">
        <FaCheckCircle className="text-softred text-3xl mb-4 group-hover:scale-110 transition-transform" />
        <h2 className="text-xl font-semibold text-foreground mb-1 group-hover:text-softred">Completed</h2>
        <p className="text-sm text-textprimary opacity-80">Review solved questions & reattempt.</p>
      </div>
    </Link>

    {/* Subjects */}
    <Link href="/dashboard/solveproblem">
      <div className="bg-card border border-lightblue/30 p-6 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition cursor-pointer group">
        <FaBookOpen className="text-lightblue text-3xl mb-4 group-hover:scale-110 transition-transform" />
        <h2 className="text-xl font-semibold text-foreground mb-1 group-hover:text-lightblue">Subjects</h2>
        <p className="text-sm text-textprimary opacity-80">Browse by Physics, Chemistry & Math.</p>
      </div>
    </Link>

    {/* Your Profile */}
    <Link href="/dashboard/profile">
      <div className="bg-card border border-lightblue/30 p-6 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition cursor-pointer group">
        <FaUserGraduate className="text-darkblue text-3xl mb-4 group-hover:scale-110 transition-transform" />
        <h2 className="text-xl font-semibold text-foreground mb-1 group-hover:text-darkblue">Your Profile</h2>
        <p className="text-sm text-textprimary opacity-80">View and manage your account details.</p>
      </div>
    </Link>
  </div>
</div>


  );
}
