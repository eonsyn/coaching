import React from 'react';
import SplineRobot from '../SplineRobot';

function HeroPage() {
  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      {/* === Spline Background === */}
      <SplineRobot />

      {/* === Blurred Circle Effect === */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[550px] h-[50px] bg-white rounded-b-full blur-[100px] z-0" />

      {/* === Foreground Content === */}
      <div className="relative z-10 px-4 pt-24">
        <h1 className="text-8xl md:text-5xl font-mono text-center font-bold leading-tight">
          Empower Your <br /> Learning Journey
        </h1>
        <p className="mt-6 text-center text-xl text-gray-300 max-w-2xl mx-auto">
          Crack competitive exams with expert coaching, curated materials, and live mentorship.
        </p>

        {/* <div className="mt-8 flex justify-center">
          <a
            href="#"
            className="bg-white text-black px-6 py-3 rounded-full text-base font-semibold hover:bg-gray-200 transition"
          >
            Get Started
          </a>
        </div> */}
      </div>
    </div>
  );
}

export default HeroPage;
