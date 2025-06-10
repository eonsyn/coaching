import Image from "next/image";
import Asidebar from "@/components/navigation/Asidebar";
export default function Home() {
  
  return (
    <main className="w-full flex gap-1.5 h-full ">

      
       
      <div className="sidebar   w-[20%] "><Asidebar /></div>
      <div className="h-full w-full rounded-2xl ">

      </div>
    </main>
  );
}
