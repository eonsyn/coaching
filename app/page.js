import React from 'react'
import NavBar from '@/components/homepage/NavBar';
import HeroPage from '@/components/homepage/HeroPage';
 
 
export default function Home() {
  

  return (
    <div className="bg-white text-black">
       <NavBar/>
       <HeroPage/>
    </div>
  );
}
