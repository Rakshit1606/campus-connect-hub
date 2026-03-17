import { Bell, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const TopBar = () => {
  const { user } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-14 glass-effect sticky top-0 z-20 flex items-center px-6 gap-4 shadow-surface">
      <div className={`relative flex-1 max-w-md transition-all duration-150 ${searchFocused ? "max-w-lg" : ""}`}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search queries, courses, fees..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="w-full h-9 pl-9 pr-3 rounded-sm bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-card focus:shadow-surface transition-all duration-150 text-sm"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded-sm shadow-surface hidden sm:inline">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative h-9 w-9 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full" />
        </button>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
          {user?.name?.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
