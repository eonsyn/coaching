'use client';

import { FaUserGraduate, FaBookOpen, FaChartLine, FaCheckCircle, FaQuestionCircle } from 'react-icons/fa';
import { MdOutlineLeaderboard } from 'react-icons/md';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-textprimary p-6 sm:p-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-darkblue font-puritan">
            Welcome to Your JEE Dashboard
        </h1>
        <p className="mt-2 text-lg text-textprimary">
          Access 3000+ hand-picked questions, track your progress, and stay exam-ready!
        </p>
      </header>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Questions */}
        <Link href="/practice">
          <div className="bg-card border border-lightblue/40 p-6 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer">
            <FaQuestionCircle className="text-highlight text-3xl mb-4" />
            <h2 className="text-xl font-semibold mb-1">Practice Questions</h2>
            <p className="text-sm">Explore 3000+ questions from all JEE topics.</p>
          </div>
        </Link>

        {/* Leaderboard */}
        <Link href="/leaderboard">
          <div className="bg-card border border-lightblue/40 p-6 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer">
            <MdOutlineLeaderboard className="text-warning text-3xl mb-4" />
            <h2 className="text-xl font-semibold mb-1">Leaderboard</h2>
            <p className="text-sm">See how you rank among other aspirants.</p>
          </div>
        </Link>

        {/* Your Progress */}
        <Link href="/progress">
          <div className="bg-card border border-lightblue/40 p-6 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer">
            <FaChartLine className="text-success text-3xl mb-4" />
            <h2 className="text-xl font-semibold mb-1">Track Progress</h2>
            <p className="text-sm">Monitor accuracy, topic strength & more.</p>
          </div>
        </Link>

        {/* Completed Questions */}
        <Link href="/completed">
          <div className="bg-card border border-lightblue/40 p-6 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer">
            <FaCheckCircle className="text-softred text-3xl mb-4" />
            <h2 className="text-xl font-semibold mb-1">Completed</h2>
            <p className="text-sm">Review solved questions & reattempt.</p>
          </div>
        </Link>

        {/* Subjects */}
        <Link href="/subjects">
          <div className="bg-card border border-lightblue/40 p-6 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer">
            <FaBookOpen className="text-lightblue text-3xl mb-4" />
            <h2 className="text-xl font-semibold mb-1">Subjects</h2>
            <p className="text-sm">Browse by Physics, Chemistry & Math.</p>
          </div>
        </Link>

        {/* Profile */}
        <Link href="/dashboard/profile">
          <div className="bg-card border border-lightblue/40 p-6 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer">
            <FaUserGraduate className="text-darkblue text-3xl mb-4" />
            <h2 className="text-xl font-semibold mb-1">Your Profile</h2>
            <p className="text-sm">View and manage your account details.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
