"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { RiLogoutCircleRLine } from "react-icons/ri";

export default function MobileNavbar({ navOptions, toggleTheme, theme }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false); // close on route change
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-blue-600 text-white rounded-md shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <RxCross1 className="text-2xl" /> : <RxHamburgerMenu className="text-2xl" />}
      </button>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-50 bg-darkblue text-lightblue flex items-center justify-center">
          <div className="flex flex-col items-center text-center space-y-8 p-6 max-w-xs w-full">
            {/* Profile */}
            <div className="flex flex-col items-center space-y-2">
              <img
                src="https://img.freepik.com/premium-vector/student-avatar-illustration-user-profile-icon-youth-avatar_118339-4404.jpg"
                className="h-20 w-20 rounded-full"
                alt="Profile"
              />
              <h1 className="text-lg font-bold">Aryan</h1>
              <p className="text-sm opacity-70">Student</p>
            </div>

            {/* Navigation */}
            <div className="w-full space-y-2">
              {navOptions.map(({ icon: Icon, name, to }, i) => {
                const isActive = pathname === to;
                return (
                  <Link key={i} href={to}>
                    <button
                      className={`w-full flex items-center justify-center gap-3 px-3 py-2 rounded-md transition-all
                        ${isActive ? "bg-lightblue text-darkblue font-semibold" : "hover:bg-lightblue hover:text-darkblue"}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="text-lg" />
                      <span>{name}</span>
                    </button>
                  </Link>
                );
              })}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-16 h-8 flex items-center border-2 rounded-full transition-all relative bg-white dark:bg-black"
            >
              <span
                className={`absolute h-6 w-6 rounded-full flex items-center justify-center transition-all
                  ${theme === "dark" ? "translate-x-8 bg-white text-yellow-500" : "translate-x-0 bg-black text-blue-400"}`}
              >
                {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
              </span>
            </button>

            {/* Logout */}
            <button
              className="flex items-center justify-center gap-3 py-2 px-3 rounded-md text-red-400 hover:bg-red-100 transition"
              onClick={() => alert("Logout logic goes here")}
            >
              <RiLogoutCircleRLine className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
