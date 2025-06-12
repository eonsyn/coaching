"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaUser, FaNewspaper } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { RiLogoutCircleRLine } from "react-icons/ri";
import MobileNavbar from './MobileNavbar'; // 👉 Import mobile navbar separately

const navOptions = [
  { icon: FaHome, name: "Home", to: "/dashboard" },
  { icon: FaNewspaper, name: "Test Paper", to: "/dashboard/testpaper" },
  { icon: FaUser, name: "Profile", to: "/dashboard/profile" },
];

function Asidebar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const appliedTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(appliedTheme);
    document.documentElement.setAttribute("data-theme", appliedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden ml-2 mt-2 rounded-xl lg:flex flex-col w-64 h-[90vh] bg-darkblue text-lightblue p-4">
        {/* Profile */}
        <div className="flex items-center mb-6">
          <img
            src="https://img.freepik.com/premium-vector/student-avatar-illustration-user-profile-icon-youth-avatar_118339-4404.jpg"
            alt="Profile"
            className="h-14 w-14 rounded-full object-cover"
          />
          <div className="ml-3">
            <h1 className="text-lg font-bold">Aryan</h1>
            <p className="text-sm opacity-70">Student</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-1 flex-1">
          <h2 className="text-md font-semibold mb-2">Dashboard</h2>
          {navOptions.map(({ icon: Icon, name, to }, index) => {
            const isActive = pathname === to;
            return (
              <Link key={index} href={to}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all
                    ${isActive ? "bg-lightblue text-darkblue font-semibold" : "hover:bg-lightblue hover:text-darkblue"}`}
                >
                  <Icon className="text-lg" />
                  <span>{name}</span>
                </button>
              </Link>
            );
          })}
        </div>

        {/* Bottom */}
        <div className="space-y-4">
          <button
            onClick={toggleTheme}
            className="w-16 h-8 flex items-center border-2 rounded-full transition-all relative bg-white dark:bg-black mx-auto"
          >
            <span
              className={`absolute h-6 w-6 rounded-full flex items-center justify-center transition-all
                ${theme === "dark" ? "translate-x-8 bg-white text-yellow-500" : "translate-x-0 bg-black text-blue-400"}`}
            >
              {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
            </span>
          </button>

          <button className="flex items-center gap-3 w-full py-2 px-3 rounded-md text-red-400 hover:bg-red-100 transition">
            <RiLogoutCircleRLine className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Navbar */}
      <MobileNavbar navOptions={navOptions} toggleTheme={toggleTheme} theme={theme} />
    </>
  );
}

export default Asidebar;
