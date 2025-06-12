import React from 'react'

function DashboardHero() {
    return (
        <div>
            <div className='w-full rounded-2xl p-4 md:h-[40vh] md:flex items-center justify-between  bg-darkblue '>
                <div> 
                    <h1 className='text-4xl font-bold '>PROBLEM OF THE DAY </h1>
                <p>A new way to be a GENIUS</p>
                <button className='px-2 hidden md:block mt-4 bg-white text-darkblue font-bold py-3  rounded-md '>
                    View today Problem
                </button>
                </div>
               
                <div className='bg-red-400 h-full w-full mt-2 md:mt-0 md:w-1/2 overflow-hidden rounded-tl-4xl rounded-r-xl rounded-bl-2xl'>
                <img className='h-full w-full object-cover' src="https://res.cloudinary.com/dgp04dpun/image/upload/v1749673999/aktu%20brand/gigpqfyexqsm54xdhjir.png" alt=" study" />
                
                </div>

                <button className='px-2 w-full md:hidden mt-4 bg-white text-darkblue font-bold py-3  rounded-md '>
                    View today Problem
                </button>
            </div>
        </div>
    )
}

export default DashboardHero
