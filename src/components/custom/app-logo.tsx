import { cn } from "@/lib/utils";
import { CalendarDaysIcon } from "lucide-react";
import { Sekuya } from "next/font/google";

const sekuya = Sekuya({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-galdeano",
});

export default function AppLogo() {
  return (
    <div className="flex justify-between items-center gap-3">
      <div className="bg-accent size-10 rounded-lg flex justify-center items-center">
        <CalendarDaysIcon size={20} />
      </div>
      <h1 className={cn(sekuya.className)}>Tracky</h1>
    </div>
  );
}
