import { cn } from "@/lib/utils";
import { ModeToggle } from "./theme-toggle";
import AppLogo from "./app-logo";

export default function Navbar({
  className,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav className={cn("border-b", className)} {...props}>
      <div className="md:w-2xl mx-auto flex items-center justify-between h-full px-4">
        <AppLogo />
        <ModeToggle />
      </div>
    </nav>
  );
}
