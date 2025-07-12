import React from 'react';
import Image from 'next/image';
import robot from '@/public/robot.png'; // Ensure this image exists
import { IoArrowForward } from "react-icons/io5";
import SplineRobot from '../SplineRobot';
function HeroPage() {
  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      {/* <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[550px] h-[50px] bg-white rounded-b-full blur-[100px] z-0" />
 */}

      <div className="relative w-full flex z-10 px-2 py-2">
        <div className='w-1/2'>
          <div className='w-full p-6 bg-slate-800 rounded-l-3xl  h-[70vh] relative'>
            <div className='filler absolute -right-6 z-10 -bottom-6 bg-slate-800 h-12 w-12 rounded-full'></div>
            <div className="subtractor absolute  -right-0 z-10 -bottom-12 bg-black h-12 w-12 rounded-full">
            </div>

            <div className="text-sm flex items-center gap-2 p-1 rounded-2xl bg-slate-700 w-fit mb-6">
              <span className="p-0.5 px-1.5 rounded-2xl bg-slate-300 text-black font-medium">
                2000+ IIT Questions
              </span>
              <span className="flex items-center gap-2 text-white">
                Solve Now <span className="text-xl">→</span>
              </span>
            </div>

            <h1 className="text-6xl md:text-6xl font-extrabold  leading-tighter mb-1.5 ">
              Be Genius <br /> with CLC
            </h1>

            <p className="text-gray-400 mb-8 leading-tighter text-lg">
              Speed up your website build with our ultimate UI kits. Enjoy high-quality, customizable components built for seamless UX.
            </p>

            <div className="flex gap-4 flex-wrap">
              <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition cursor-pointer">
                Get it now →
              </button>
              <button className="bg-black border border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition ease-in-out duration-75 cursor-pointer">
                Learn more
              </button>
            </div>
          </div>
          {/* Lower Company Stats Section */}
          <div className="h-[26vh] w-full bg-black flex items-center justify-center px-4">
            <div className="  text-white w-full max-w-6xl rounded-[36px] py-6 px-10 flex flex-wrap justify-between items-center shadow-md">
              <div className="text-center flex-1 min-w-[100px]">
                <h2 className="text-2xl font-bold">500+</h2>
                <p className="text-sm text-gray-500">Components</p>
              </div>
              <div className="text-center flex-1 min-w-[100px]">
                <h2 className="text-2xl font-bold">50+</h2>
                <p className="text-sm text-gray-500">Pages</p>
              </div>
              <div className="text-center flex-1 min-w-[100px]">
                <h2 className="text-2xl font-bold">150+</h2>
                <p className="text-sm text-gray-500">Customers</p>
              </div>
              <div className="text-center flex-1 min-w-[100px]">
                <h2 className="text-2xl font-bold">150+</h2>
                <p className="text-sm text-gray-500">Contributors</p>
              </div>
            </div>
          </div>

        </div>

        <div className='w-1/2 bg-slate-800 h-[96vh] relative rounded-b-3xl rounded-tr-3xl'>
          <Image
            src={robot}
            alt="Robot"
            layout="fill"
            objectFit="contain"
            style={{
              filter: 'drop-shadow(2px 4px 8px hsla(0deg, 0%, 0%, 0.5))'
            }}
            className=""
          />
          {/* <SplineRobot/> */}

        </div>
      </div>
    </div>
  );
}

export default HeroPage;
