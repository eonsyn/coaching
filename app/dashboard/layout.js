import "../globals.css";
import Asidebar from "@/components/navigation/Asidebar";
export default function RootLayout({ children }) {
  return (
    <main className="w-full flex gap-1.5 h-full ">

      <Asidebar />
      <div className="h-full w-full rounded-2xl  px-2 ">
{children}
      </div>
    </main>
     
  );
}