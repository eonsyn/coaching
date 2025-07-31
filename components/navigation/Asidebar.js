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
import { IoIosNotifications } from "react-icons/io";
import { PiStudent } from "react-icons/pi";
import { useSelector } from "react-redux";
const baseNavOptions = [
  { icon: FaHome, name: "Home", to: "/dashboard" },
  { icon: FaNewspaper, name: "Test Paper", to: "/dashboard/testpaper" },
  { icon: FaBookOpenReader, name: "Solve Problems", to: "/dashboard/solveproblem" },
  { icon: FaUser, name: "Profile", to: "/dashboard/profile" },
  { icon: IoIosNotifications, name: "Notifications", to: "/dashboard/notifications" },
];

function Asidebar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState("system");

  const temuser = useSelector((state) => state.user);
  const role = temuser.role;
  const user = temuser.user;
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

      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const appliedTheme = savedTheme || (prefersDark ? "dark" : "light");
      setTheme(appliedTheme);
      document.documentElement.setAttribute("data-theme", appliedTheme);
    }

  }, []); 
  const navOptions = user?.role === "teacher"
    ? [...baseNavOptions, { icon: PiStudent, name: "Students", to: "/dashboard/students" }]
    : baseNavOptions;
    
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
  const name = croptext(user?.name);
  return (
   <>
  {/* Desktop Sidebar */}
  <aside className="hidden lg:flex flex-col w-64 h-[90vh] ml-3 mt-3 rounded-2xl bg-card-bg text-foreground p-5 shadow-xl font-[var(--font-family-sans)] transition-all">

    {/* Profile Section */}
    <div className="flex items-center gap-4 mb-8 border-b border-border-color pb-4">
      <img
        src="https://img.freepik.com/premium-vector/student-avatar-illustration-user-profile-icon-youth-avatar_118339-4404.jpg"
        alt="Profile"
        className="h-14 w-14 rounded-full object-cover border-2 border-primary"
      />
      <div>
        <h1 className="text-lg font-semibold text-foreground">{name}</h1>
        <p className="text-sm text-muted capitalize">{role}</p>
      </div>
    </div>

    {/* Navigation Links */}
    <div className="flex-1 space-y-2">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
        Navigation
      </h2>
      {navOptions.map(({ icon: Icon, name, to }, index) => {
        const isActive = pathname === to;
        return (
          <Link key={index} href={to}>
            <button
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? "bg-primary text-white shadow-md"
                  : "hover:bg-primary-light hover:text-primary"}
              `}
            >
              <Icon className="text-lg" />
              {name}
            </button>
          </Link>
        );
      })}
    </div>

    {/* Bottom Controls */}
    <div className="space-y-4 mt-auto pt-4 border-t border-border-color">
      {/* Theme Toggle */}
      <div className="flex justify-center">
        <button
          onClick={toggleTheme}
          className="w-16 h-8 flex items-center border-2 border-border-color rounded-full bg-input-bg relative transition-all"
        >
          <span
            className={`absolute h-6 w-6 rounded-full flex items-center justify-center text-sm transition-all
              ${theme === "dark"
                ? "translate-x-8 bg-white text-yellow-400"
                : "translate-x-0 bg-black text-blue-400"}`}
          >
            {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
          </span>
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-danger hover:bg-danger/10 transition"
      >
        <RiLogoutCircleRLine className="text-xl" />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </div>
  </aside>

  {/* Mobile Navbar */}
  <MobileNavbar
    name={name}
    role={role}
    navOptions={navOptions}
    toggleTheme={toggleTheme}
    theme={theme}
  />
</>


  );
}

export default Asidebar;
