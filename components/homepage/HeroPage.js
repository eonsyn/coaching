import React from 'react';
import Image from 'next/image';
import robot from '@/public/robot.png'; // Ensure this image exists
import Link from 'next/link';
function HeroPage() {
  return (
    <div className="relative w-full min-h-screen bg-white text-white overflow-hidden">


      <div className="relative w-full flex z-10 md:px-2 md:py-2">
        <div className='w-full md:w-[60%]'>
          <div className='w-full  p-6 bg-bgray md:rounded-l-3xl  h-[70vh] relative'>
            <div className='filler hidden md:block absolute -right-6 z-10 -bottom-6  bg-bgray h-12 w-12 rounded-full'></div>
            <div className="subtractor hidden md:block absolute  -right-0 z-10 -bottom-12 bg-white h-12 w-12 rounded-full">
            </div>
            <Image
              src={robot}
              alt="Robot"
              layout="fill"
              className="absolute z-0 opacity-25 md:object-cover object-contain pointer-events-none md:translate-0 translate-x-26"
            />

            <div className="text-sm z-20 flex items-center gap-2 py-1 px-1 rounded-2xl bg-lightgray w-fit mb-4 relative">
              <span className="py-1 px-2 rounded-2xl bg-bgray text-white font-medium">
                2000+ IIT Questions
              </span>
              <span className="flex items-center gap-2 h-full text-black">
                Solve Now <span className="text-xl">→</span>
              </span>
            </div>

            <h1 className="text-6xl relative z-20 md:text-6xl font-extrabold  leading-tighter mb-1.5 ">
              Solve <br /> Understand. <br /> Concquer JEE.
            </h1>

            <p className="text-white relative mb-8 leading-tighter z-20 text-lg">
              Master JEE with Topic-wise PYQs, AI-Powered Hints & Smart Practice.</p>

            <div className="flex gap-4 mt-3 md:mt-0 z-20 flex-wrap">
              <Link href={'/dashboard'} className='w-full md:w-fit '>
             
              <button className="relative overflow-hidden w-full md:w-fit  bg-white text-black px-6 py-3 rounded-full font-semibold transition-all duration-500 group cursor-pointer">

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-8 h-8 bg-black rounded-full transition-all duration-500 scale-0 group-hover:scale-[6] group-hover:translate-y-0 z-0"></div>
                <span className="relative z-10 group-hover:text-white duration-700 ">Get it now →</span>
              </button>
 </Link>

            </div>

          </div>
          {/* Lower Company Stats Section */}
          <div className="w-full bg-white px-4 py-8">
            <div className="w-full max-w-6xl mx-auto text-black bg-white rounded-[36px] py-6 px-4 sm:px-8 flex flex-col gap-6 md:flex-row justify-between items-center">
              <div className="text-center flex-1 min-w-[120px]">
                <h2 className="text-2xl font-bold">500+</h2>
                <p className="text-sm text-gray-500">Components</p>
              </div>
              <div className="text-center flex-1 min-w-[120px]">
                <h2 className="text-2xl font-bold">50+</h2>
                <p className="text-sm text-gray-500">Pages</p>
              </div>
              <div className="text-center flex-1 min-w-[120px]">
                <h2 className="text-2xl font-bold">150+</h2>
                <p className="text-sm text-gray-500">Customers</p>
              </div>

            </div>
          </div>


        </div>

        <div className='w-[40%] hidden md:block bg-bgray h-[96vh] relative rounded-b-3xl rounded-tr-3xl'>
          <Image
            src={robot}
            alt="Robot"
            layout="fill"
            objectFit="contain"
            style={{
              filter: 'drop-shadow(2px 4px 10px hsla(0deg, 0%, 0%, 0.3))'
            }}
            className=""
          />
          {/* <SplineRobot/> */}
          {/* test */}
        </div>
      </div>
    </div>
  );
}

export default HeroPage;
