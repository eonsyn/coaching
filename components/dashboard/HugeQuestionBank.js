import React from 'react';

function HugeQuestionBank() {
  return (
    <div className='w-full mt-9 rounded-2xl p-4 md:h-[40vh] md:flex items-center justify-between bg-darkblue'>
      
      {/* Text Section */}
      <div className='text-lightblue'>
        <h1 className='text-4xl font-bold'>HUGE QUESTION BANK</h1>
        <p className='mt-2 text-lg'>A treasure of 40+ years of IIT JEE questions for every aspirant</p>
        
        <button className='px-4 hidden md:inline-block mt-4 bg-white text-lightblue font-bold py-3 rounded-md'>
          Start Solving Now
        </button>
      </div>

      {/* Image Section */}
      <div className='h-full w-full mt-4 md:mt-0 md:w-1/2 overflow-hidden rounded-tl-4xl rounded-r-xl rounded-bl-2xl'>
        <img
          className='h-full w-full object-cover'
          src="https://res.cloudinary.com/dgp04dpun/image/upload/v1749721049/aktu%20brand/bcmm0ljosqh8ueoamyzq.png"
          alt="Huge Question Bank"
        />
      </div>

      {/* Mobile Button */}
      <button className='px-4 w-full md:hidden mt-4 bg-white dark:bg-darkblue text-lightblue font-bold py-3 rounded-md'>
        Start Solving Now
      </button>
    </div>
  );
}

export default HugeQuestionBank;
