"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FaHome, FaUser, FaNewspaper } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";

function Asidebar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState("system");
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: light)").matches;
      const systemTheme = prefersDark ? "dark" : "light";
      setTheme(systemTheme);
      document.documentElement.setAttribute("data-theme", systemTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };


  const navioption = [
    {
      icon: FaHome,
      name: "Home",
      to: "/dashboard",
    },
    {
      icon: FaNewspaper,
      name: "Test Paper",
      to: "/dashboard/testpaper",
    },
    {
      icon: FaUser,
      name: "Profile",
      to: "/dashboard/profile",
    },
  ];

  return (
    <aside className="bg-darkblue w-[20%] p-2 rounded-2xl  h-full relative">
      <div className="profilesection flex items-end">
        <div className="profile-picture h-16 w-16 rounded-full overflow-hidden">
          <img
            src="https://img.freepik.com/premium-vector/student-avatar-illustration-user-profile-icon-youth-avatar_118339-4404.jpg?w=360"
            className="h-full w-full"
            alt="profile-picture"
          />
        </div>
        <div className="userInfo pl-2">
          <h1 className="text-2xl -mb-2 font-bold">Aryan</h1>
          <h2>Student</h2>
        </div>
      </div>

      <div className="dashboard mt-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      <div>
        {navioption.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.to;

          return (
            <Link key={index} href={item.to}>
              <button
                className={`navigation w-full flex gap-2 cursor-pointer my-1 py-1 group transition-all ease-in-out duration-300 pl-1 rounded-md items-center justify-baseline
                ${isActive ? 'bg-lightblue text-darkblue ' : 'hover:bg-lightblue hover:text-darkblue'}`}
              >
                <Icon className="text-xl" />
                <h1 className="text font-puritan tracking-wider">{item.name}</h1>
              </button>
            </Link>
          );
        })}
      </div>

      <div className="h-[28%] w-full">



      </div>
      <div className="mb-2 w-full flex">
        <button
        title={theme === "dark" ? "Light Mode" : "Dark Mode"}
          onClick={toggleTheme}
          className={`cursor-pointer relative w-16 h-7 rounded-full border-2 transition-colors duration-300 ease-in-out flex items-center
      ${theme === "dark" ? "border-yellow-300" : "border-gray-700"}
    `}
        >
          <span
            className={`
        absolute   left-1 w-5 h-5 rounded-full flex items-center justify-center
        transition-all duration-300 ease-in-out
        ${theme === "dark" ? "translate-x-8 bg-white text-yellow-500" : "translate-x-0 bg-black text-white"}
      `}
          >
            {theme === "dark" ? (
              <MdLightMode
                className="text-xl transition-transform duration-300 ease-in-out rotate-0"
                key="light" // Helps React re-render element
                style={{ transformOrigin: "center" }}
              />
            ) : (
              <MdDarkMode
                className="text-xl transition-transform duration-300 ease-in-out rotate-180"
                key="dark"
                style={{ transformOrigin: "center" }}
              />
            )}
          </span>
        </button>
      </div>

      <div className="flex">
        <button className="navigation flex gap-2 cursor-pointer my-1 py-1 group hover:bg-lightblue pr-1 text-red-500 hover:text-red-600 hover:font-bold transition-all ease-in-out duration-300 pl-1 rounded-md items-center justify-baseline">
          <RiLogoutCircleRLine className="text-xl" />
          <h1 className="text font-puritan tracking-wider">logout</h1>
        </button>
      </div>
    </aside>
  );
}

export default Asidebar;
