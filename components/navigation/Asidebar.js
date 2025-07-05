'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FaHome, FaUser, FaNewspaper } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FaBookOpenReader } from "react-icons/fa6";
import { RiLogoutCircleRLine } from "react-icons/ri";
import MobileNavbar from './MobileNavbar'; 
const navOptions = [
  { icon: FaHome, name: "Home", to: "/dashboard" },
  { icon: FaNewspaper, name: "Test Paper", to: "/dashboard/testpaper" },
 { icon: FaBookOpenReader , name: "Solve Problems", to: "/dashboard/solveproblem" },
  { icon: FaUser, name: "Profile", to: "/dashboard/profile" },
];

function Asidebar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState("system"); 
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/userAuth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        toast.success("Logged out successfully");
        window.location.href = "/auth/login";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (err) {
          console.error("Invalid user data in localStorage");
        }
      }

      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const appliedTheme = savedTheme || (prefersDark ? "dark" : "light");
      setTheme(appliedTheme);
      document.documentElement.setAttribute("data-theme", appliedTheme);
    }
  }, []);
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };
 const croptext = (text) => {
  if (typeof text !== 'string') return ''; // Optional safety check
  return text.length > 6 ? text.slice(0, 6) + '...' : text;
};
const name=croptext(user?.name);
  return (
   <>
  {/* Desktop Sidebar */}
  <aside className="hidden lg:flex flex-col w-64 h-[90vh] ml-3 mt-3 rounded-2xl bg-darkblue text-lightblue p-5 shadow-lg font-puritan transition-all">

    {/* Profile Section */}
    <div className="flex items-center gap-4 mb-8 border-b border-lightblue/30 pb-4">
      <img
        src="https://img.freepik.com/premium-vector/student-avatar-illustration-user-profile-icon-youth-avatar_118339-4404.jpg"
        alt="Profile"
        className="h-14 w-14 rounded-full object-cover border-2 border-lightblue"
      />
      <div>
        <h1 className="text-xl font-bold">{name}</h1>
        <p className="text-sm opacity-70">Student</p>
      </div>
    </div>

    {/* Navigation Links */}
    <div className="flex-1 space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-lightblue/80 mb-1">Navigation</h2>
      {navOptions.map(({ icon: Icon, name, to }, index) => {
        const isActive = pathname === to;
        return (
          <Link key={index} href={to}>
            <button
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition 
                ${isActive 
                  ? "bg-lightblue text-darkblue shadow-md" 
                  : "hover:bg-lightblue/20 hover:text-white"}`}
            >
              <Icon className="text-lg" />
              {name}
            </button>
          </Link>
        );
      })}
    </div>

    {/* Bottom Controls */}
    <div className="space-y-4 mt-auto pt-4 border-t border-lightblue/30">
      
      {/* Theme Toggle */}
      <div className="flex justify-center">
        <button
          onClick={toggleTheme}
          className="w-16 h-8 flex items-center border-2 rounded-full bg-card transition-all relative"
        >
          <span
            className={`absolute h-6 w-6 rounded-full flex items-center justify-center text-sm transition-all
              ${theme === "dark" 
                ? "translate-x-8 bg-white text-yellow-500" 
                : "translate-x-0 bg-black text-blue-400"}`}
          >
            {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
          </span>
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-softred hover:bg-softred/10 transition"
      >
        <RiLogoutCircleRLine className="text-xl" />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </div>
  </aside>

  {/* Mobile Navbar (Visible on small screens) */}
  <MobileNavbar name={name} navOptions={navOptions} toggleTheme={toggleTheme} theme={theme} />
</>

  );
}

export default Asidebar;
