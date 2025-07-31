import Link from 'next/link';
import {
  FaUserGraduate,
  FaBookOpen,
  FaChartLine,
  FaCheckCircle,
  FaQuestionCircle,
} from 'react-icons/fa';
import { FaArrowRight } from "react-icons/fa";
import { MdOutlineLeaderboard } from 'react-icons/md';
import background1 from "@/public/assets/background1.png";
import Image from 'next/image';

const dashboardCards = [
  {
    href: "/dashboard/solveproblem",
    icon: FaQuestionCircle,
    title: "Practice Questions",
    description: "Explore 3000+ questions from all JEE topics.",
    color: "text-primary",
  },
  {
    href: "/leaderboard",
    icon: MdOutlineLeaderboard,
    title: "Leaderboard",
    description: "See how you rank among other aspirants.",
    color: "text-warning",
  },
  {
    href: "/dashboard/profile",
    icon: FaChartLine,
    title: "Track Progress",
    description: "Monitor accuracy, topic strength & more.",
    color: "text-success",
  },
  {
    href: "/dashboard/completed",
    icon: FaCheckCircle,
    title: "Completed",
    description: "Review solved questions & reattempt.",
    color: "text-error",
  },
  {
    href: "/dashboard/solveproblem",
    icon: FaBookOpen,
    title: "Subjects",
    description: "Browse by Physics, Chemistry & Math.",
    color: "text-info",
  },
  {
    href: "/dashboard/profile",
    icon: FaUserGraduate,
    title: "Your Profile",
    description: "View and manage your account details.",
    color: "text-secondary",
  },
];
const card=[{
 "title":"solve Problems",
 "head":"223"
},
{
 "title":"Clear Concepts by",
 "head":"AI"
},
 
]
export default function Dashboard() {
  return (
    <div className="min-h-screen w-screen relative bg-background text-foreground p-6 sm:py-0 sm:px-10 font-puritan">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-8xl font-family-baloo font-bold text-primary">
          Dashboard
        </h1>
      </header>

      {/* Top blur */}
      <div className="lightcolor absolute top-0 right-0 -z-10 h-24 w-24 blur-3xl bg-white rounded-full"></div>

      <div>
        <h1 className="font-bold inline">Study </h1><span>plan</span>
        <hr className="my-1 mb-4 w-[20vw]" />

        {/* Study Plan Card */}
        <div className="flex flex-col flex-wrap md:flex-row gap-4">
          {card.map((item, index) => (
            <div className="relative h-[26vh] w-full md:w-[40%] overflow-hidden rounded-2xl shadow-xl border border-white/20 bg-white/10 backdrop-blur-md group transition-transform  ">

            {/* Background image */}
            <Image
              src={background1}
              alt="background"
              fill
              className="object-cover object-center opacity-100"
            />


            {/* Top-right button */}
            <button className="absolute right-3 top-3 z-20 flex items-center justify-center h-7 w-7 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs hover:bg-white/30 transition-all">
              <FaArrowRight className='text-black group-hover:-rotate-45 transition-all ease-in-out duration-300 group-hover:text-2xl' size={12} />
            </button>

            {/* Overlay content */}
            <div className="absolute inset-0 z-10 flex flex-col justify-end p-4">
              <div className="text-sm  text-black/80">{item.title}</div>
              <div className="text-5xl font-bold text-black leading-none">{item.head}</div>
            </div>
          </div>))
}
        </div>
      </div>
    </div>
  );
}
