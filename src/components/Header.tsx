import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="border-b border-white/5 px-4 py-4 max-w-6xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Sentinel
        </span>
        <span className="text-xs font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md border border-blue-500/20">
          Try now
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5">
          Sign In
        </Button>
      </div>
    </header>
  );
}