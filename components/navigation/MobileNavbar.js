"use client";
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { RiLogoutCircleRLine } from "react-icons/ri";
// import { useGSAP } from '@gsap/react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// gsap.registerPlugin(ScrollTrigger);

export default function MobileNavbar({ navOptions, toggleTheme, theme, name, handleLogout }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const boxRef = useRef(null);
  const testref = useRef(null);
  useEffect(() => {
    setIsOpen(false); // close on route change
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);
  const handleClick = () => {

    setIsOpen(!isOpen);

  };



  return (
    <>
      {/* Hamburger Toggle Button */}
      <button
        ref={testref}
        className="lg:hidden fixed top-3 left-3 z-[60] p-2 bg-highlight text-white rounded-full shadow-lg overflow-hidden transition-all"
        onClick={handleClick}
      >
        {isOpen ? (
          <RxCross1 className="text-2xl" />
        ) : (
          <RxHamburgerMenu className="text-2xl" />
        )}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div ref={boxRef} className="fixed inset-0 z-50 bg-lightblue text-darkblue flex flex-col  items-center justify-start pt-20 px-6 font-puritan">

          {/* Profile Section */}
          <div className="flex items-center gap-4 mb-8">
            <img
              src="https://img.freepik.com/premium-vector/student-avatar-illustration-user-profile-icon-youth-avatar_118339-4404.jpg"
              className="h-16 w-16 rounded-full border-2 border-darkblue"
              alt="Profile"
            />
            <div>
              <h1 className="text-lg font-bold">{name}</h1>
              <p className="text-sm opacity-70">Student</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="w-full space-y-3">
            {navOptions.map(({ icon: Icon, name, to }, i) => {
              const isActive = pathname === to;
              return (
                <Link key={i} href={to}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-base transition-all
                  ${isActive
                        ? "bg-darkblue text-lightblue font-semibold"
                        : "hover:bg-darkblue/20 hover:text-white"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="text-xl" />
                    {name}
                  </button>
                </Link>
              );
            })}
          </div>

          {/* Theme Toggle */}
          <div className="w-full mt-10">
            <p className="text-sm font-semibold mb-2"> Theme</p>
            <button
              onClick={toggleTheme}
              className="w-24 h-10 flex items-center border-2 rounded-full transition-all bg-card relative"
            >
              <span
                className={`absolute h-7 w-7 rounded-full flex items-center justify-center transition-all
              ${theme === "dark" ? "translate-x-[56px] bg-white text-yellow-500" : "translate-x-0 bg-black text-blue-400"}`}
              >
                {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
              </span>
            </button>
          </div>

          {/* Logout */}
          <button
            className="mt-12 flex items-center justify-center gap-2 px-5 py-2 text-red-400 bg-red-100 hover:bg-red-200 rounded-lg text-base font-medium transition-all"
            onClick={handleLogout}
          >
            <RiLogoutCircleRLine className="text-xl" />
            Logout
          </button>
        </div>
      )}
    </>

  );
}
