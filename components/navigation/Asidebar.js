"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FaHome, FaUser, FaNewspaper } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx"; // Import hamburger and close icons

function Asidebar() {
    const pathname = usePathname();
    const [theme, setTheme] = useState("system");
    // State to control the mobile sidebar's open/close state
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute("data-theme", savedTheme);
        } else {
            // Using prefers-color-scheme for initial system preference
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches; // Corrected: Check for dark mode preference
            const systemTheme = prefersDark ? "dark" : "light";
            setTheme(systemTheme);
            document.documentElement.setAttribute("data-theme", systemTheme);
        }

        // Close sidebar on route change for mobile
        const handleRouteChange = () => {
            if (isOpen) {
                setIsOpen(false);
            }
        };

        // Assuming Next.js App Router handles route changes without explicit listener
        // This effect will run on every render if pathname changes, effectively closing the sidebar
        if (isOpen) {
            setIsOpen(false);
        }

    }, [pathname]); // Depend on pathname to close sidebar on navigation

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
        <>
            {/* Hamburger Menu Icon (visible on small screens) */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-lightblue rounded-md shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle navigation"
            >
                {isOpen ? <RxCross1 className="text-2xl" /> : <RxHamburgerMenu className="text-2xl" />}
            </button>

            {/* Overlay for mobile (when sidebar is open) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)} // Close sidebar when clicking outside
                ></div>
            )}

            {/* Asidebar - Conditional classes for mobile slide animation */}
            <aside
                className={`
                  text-darkblue
                    bg-darkblue p-4 rounded-2xl h-full  
                    fixed top-0 left-0 w-64 z-50
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:static lg:translate-x-0 lg:w-auto lg:h-full
                `}
            >
                <div className="profilesection flex items-end mb-6"> {/* Added mb-6 for spacing */}
                    <div className="profile-picture h-16 w-16 rounded-full overflow-hidden">
                        <img
                            src="https://img.freepik.com/premium-vector/student-avatar-illustration-user-profile-icon-youth-avatar_118339-4404.jpg?w=360"
                            className="h-full w-full"
                            alt="profile-picture"
                        />
                    </div>
                    <div className="userInfo pl-2">
                        <h1 className="text-2xl -mb-2 font-bold text-lightblue">Aryan</h1>
                        <h2 className="text-lightblue">Student</h2>
                    </div>
                </div>

                <div className="dashboard mt-4 mb-4"> {/* Added mb-4 for spacing */}
                    <h1 className="text-xl font-bold text-lightblue">Dashboard</h1>
                </div>

                <nav> {/* Wrapped navigation links in a nav tag for better semantics */}
                    {navioption.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.to;

                        return (
                            <Link key={index} href={item.to}>
                                <button
                                    className={`
                                        navigation w-full flex gap-2 cursor-pointer my-1 py-2 px-3 rounded-md items-center
                                        transition-all ease-in-out duration-300
                                        ${isActive ? 'bg-lightblue text-darkblue' : 'text-lightblue hover:bg-lightblue hover:text-darkblue'}
                                    `}
                                    onClick={() => setIsOpen(false)} // Close sidebar when a link is clicked
                                >
                                    <Icon className="text-xl" />
                                    <h1 className="text-lg font-puritan tracking-wider">{item.name}</h1>
                                </button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-4 left-4 right-4"> {/* Position theme toggle and logout at the bottom */}
                    <div className="mb-4 w-full flex">
                        <button
                            title={theme === "dark" ? "Light Mode" : "Dark Mode"}
                            onClick={toggleTheme}
                            className={`cursor-pointer relative w-16 h-7 rounded-full border-2 transition-colors duration-300 ease-in-out flex items-center
                                ${theme === "dark" ? "border-yellow-300" : "border-gray-700"}
                            `}
                        >
                            <span
                                className={`
                                    absolute left-1 w-5 h-5 rounded-full flex items-center justify-center
                                    transition-all duration-300 ease-in-out
                                    ${theme === "dark" ? "translate-x-8 bg-white text-yellow-500" : "translate-x-0 bg-black text-lightblue"}
                                `}
                            >
                                {theme === "dark" ? (
                                    <MdLightMode
                                        className="text-xl transition-transform duration-300 ease-in-out rotate-0"
                                        key="light"
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
                        <button className="navigation flex gap-2 cursor-pointer my-1 py-2 px-3 rounded-md items-center w-full
                            hover:bg-lightblue text-red-500 hover:text-red-600 hover:font-bold
                            transition-all ease-in-out duration-300">
                            <RiLogoutCircleRLine className="text-xl" />
                            <h1 className="text-lg font-puritan tracking-wider">Logout</h1>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Asidebar;