import React from 'react';
import Link from 'next/link';
function NavBar() {
  return (
    <nav className="w-full  text-white px-6 py-4 flex items-center justify-between fixed top-0 z-50">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-violet-500 rounded-sm" />
        <span className="font-semibold text-lg">CLC</span>
      </div>

      {/* Center: Navigation Links (hidden on mobile) */}
      <div className="hidden bg-black/30 py-1 px-2 rounded-2xl md:flex gap-8 text-sm text-gray-300">
        <Link href="#" className="hover:text-white transition">Product</Link>
        <Link href="#" className="hover:text-white transition">Company</Link>
        <Link href="#" className="hover:text-white transition">Enterprise</Link>
        <Link href="#" className="hover:text-white transition">Coverage</Link>
        <Link href="#" className="hover:text-white transition">News</Link>
      </div>

      {/* Right: Get Started Button */}
      <div>
        <Link
          href="/dashboard"
          className="bg-white text-black font-medium px-4 py-2 rounded-full hover:bg-gray-200 transition text-sm"
        >
          Get started
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
