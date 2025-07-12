// components/LearnWithCurve.js
import React from 'react';
import Image from 'next/image';
import robot from '@/public/robot.png'; // Ensure this image exists

export default function LearnWithCurve() {
  return (
    <div className="relative overflow-hidden bg-[#f3f4f6] rounded-[40px] p-10 md:p-16 shadow-xl">
      
      {/* Curved bottom shape */}
      <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 w-[200%] h-[100px] bg-white rounded-t-[100%] z-0" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Text section */}
        <div className="flex-1">
          <div className="inline-block bg-black text-white text-xs font-semibold rounded-full px-3 py-1 mb-4">
            1000+ customers joined today
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
            Build Your Website Faster with Frameblox
          </h1>
          <p className="text-gray-600 mb-6">
            Speed up your website build with our ultimate UI kits for Framer.
            Enjoy high-quality, customizable elements for a seamless, stunning user experience.
          </p>
          <div className="flex gap-4">
            <button className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-900 transition">
              Get it now →
            </button>
            <button className="border border-black px-6 py-3 rounded-full font-semibold hover:bg-black hover:text-white transition">
              Learn more
            </button>
          </div>
        </div>

        {/* Robot image */}
        <div className="flex-1">
          <Image
            src={robot}
            alt="Robot"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
