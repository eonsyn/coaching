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

export default function MobileNavbar({role, navOptions, toggleTheme, theme, name, handleLogout }) {
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
    className="lg:hidden fixed top-2 left-2 z-[60] p-3 bg-primary text-white rounded-full shadow-xl transition-all duration-300 hover:brightness-110 hover:scale-105 active:scale-95"
    onClick={handleClick}
    aria-label="Toggle Sidebar"
  >
    {isOpen ? <RxCross1 className="text-2xl" /> : <RxHamburgerMenu className="text-2xl" />}
  </button>

  {/* Mobile Sidebar Overlay */}
  {isOpen && (
    <div
      ref={boxRef}
      className="fixed inset-0 z-50 bg-card-bg text-foreground flex flex-col items-center justify-start pt-20 px-6 font-[var(--font-family-sans)] transition-all"
    >
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src="https://img.freepik.com/premium-vector/student-avatar-illustration-user-profile-icon-youth-avatar_118339-4404.jpg"
          className="h-16 w-16 rounded-full border-2 border-primary object-cover"
          alt="Profile"
        />
        <div>
          <h1 className="text-lg font-semibold text-foreground">{name}</h1>
          <p className="text-sm text-muted capitalize">{role}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="w-full space-y-3">
        {navOptions.map(({ icon: Icon, name, to }, i) => {
          const isActive = pathname === to;
          return (
            <Link key={i} href={to}>
              <button
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-all
                  ${isActive
                    ? "bg-primary text-white shadow-md"
                    : "hover:bg-primary-light hover:text-primary"}
                `}
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
        <p className="text-sm font-semibold mb-2 text-muted">Theme</p>
        <button
          onClick={toggleTheme}
          className="w-24 h-10 flex items-center border-2 border-border-color rounded-full bg-input-bg relative transition-all"
        >
          <span
            className={`absolute h-7 w-7 rounded-full flex items-center justify-center transition-all
              ${theme === "dark"
                ? "translate-x-[56px] bg-white text-yellow-400"
                : "translate-x-0 bg-black text-blue-400"}
            `}
          >
            {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
          </span>
        </button>
      </div>

      {/* Logout Button */}
      <button
        className="mt-12 flex items-center justify-center gap-2 px-5 py-2 text-danger bg-danger/10 hover:bg-danger/20 rounded-lg text-base font-medium transition-all"
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
