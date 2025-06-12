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
        className="lg:hidden fixed top-0.5 left-0.5 z-[60] p-2 bg-blue-600 text-white rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <RxCross1 className="text-2xl" /> : <RxHamburgerMenu className="text-2xl" />}
      </button>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-50 bg-darkblue text-lightblue flex items-center justify-center">
          <div className="flex flex-col  items-center text-center space-y-2 p-6 max-w-xs w-full">
            {/* Profile */}
            <div className="flex  gap-2 w-full   items-center space-y-2">
              <img
                src="https://img.freepik.com/premium-vector/student-avatar-illustration-user-profile-icon-youth-avatar_118339-4404.jpg"
                className="h-20 w-20 rounded-full"
                alt="Profile"
              />
              <div className='text-base'>
                <h1 className="text-lg font-bold">Aryan</h1>
                <p className="text-sm opacity-70">Student</p>
              </div>

            </div>

            {/* Navigation */}
            <div className="w-full space-y-2">
              {navOptions.map(({ icon: Icon, name, to }, i) => {
                const isActive = pathname === to;
                return (
                  <Link key={i} href={to}>
                    <button
                      className={`w-full text-start flex items-center   gap-3 px-3 py-2 rounded-md transition-all
                        ${isActive ? "bg-lightblue text-darkblue font-semibold" : "hover:bg-lightblue hover:text-darkblue"}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="text-3xl" />
                      <span className='text-3xl '>{name}</span>
                    </button>
                  </Link>
                );
              })}
            </div>

            {/* Theme Toggle */}
            <span className='text-3xl mt-10 w-full text-start '>Choose Theme</span>
            <div className='w-full'>
              <button
                onClick={toggleTheme}
                className="w-26  h-12 flex border-2 rounded-full transition-all relative bg-white items-center  dark:bg-black"
              >
                <span
                  className={`absolute   h-8 w-8 rounded-full flex items-center   transition-all
                  ${theme === "dark" ? "translate-x-16 bg-white text-yellow-500" : "translate-x-0 bg-black text-blue-400"}`}
                >
                  {theme === "dark" ? (
                    <MdLightMode className="text-2xl" />
                  ) : (
                    <MdDarkMode className="text-4xl" />
                  )}

                </span>
              </button>
              {/* Logout */}
              <button
                className="flex mt-16 bg-red-100 rounded-xl x-6 items-center justify-center gap-3 py-2 px-3  text-2xl text-red-400 hover:bg-red-100 transition"
                onClick={() => alert("Logout logic goes here")}
              >
                <RiLogoutCircleRLine className="text-xl" />
                <span>Logout</span>
              </button>
            </div>


          </div>
        </div>
      )}
      
    </>
  );
}
