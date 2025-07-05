'use client';

 
import { useRef } from 'react';

 
export default function Home() {
  const triggerRef = useRef(null);
  const animateRef = useRef(null);
 

  return (
    <div className="bg-white text-black">
      <section className="h-screen flex items-center justify-center">
        <h1 className="text-4xl">Scroll Down 👇</h1>
      </section>

      <section
        ref={triggerRef}
        className="h-screen flex items-center justify-center bg-gray-100"
      >
        <p className="text-2xl">I’m the trigger zone</p>
      </section>

      <section
        ref={animateRef}
        className="h-screen flex items-center justify-center bg-green-100"
      >
        <p className="text-2xl">I will animate as you scroll!</p>
      </section>
    </div>
  );
}
