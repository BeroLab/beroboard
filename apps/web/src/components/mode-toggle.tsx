"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";

import * as Drop from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { useMetaColor } from "~/hooks/use-meta-color";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const { setMetaColor, metaColor } = useMetaColor();

  useEffect(() => {
    setMetaColor(metaColor);
  }, [metaColor, setMetaColor]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Drop.DropdownMenu>
      <Drop.DropdownMenuTrigger
        render={<Button variant="outline" size="icon" />}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Drop.DropdownMenuTrigger>
      <Drop.DropdownMenuContent align="end">
        <Drop.DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </Drop.DropdownMenuItem>
        <Drop.DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </Drop.DropdownMenuItem>
        <Drop.DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </Drop.DropdownMenuItem>
      </Drop.DropdownMenuContent>
    </Drop.DropdownMenu>
  );
}
