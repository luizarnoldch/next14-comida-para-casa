"use client";

import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MoonIcon, Sun } from "lucide-react";

type Props = {};

const ThemeToggle = (props: Props) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme === "system" ? theme : resolvedTheme;
  const isDark = currentTheme === "dark";

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="flex items-center gap-2 px-2">
      {isDark ? (
        <MoonIcon
          className={`
          size-4 transition-transform 
          ${isDark ? "scale-100 rotate-0" : "scale-0 rotate-90"}`}
        />
      ) : (
        <Sun
          className={`
            size-4 transition-transform 
            ${isDark ? "scale-0 -rotate-90" : "scale-100 rotate-0"}`}
        />
      )}
      <Switch
        id="theme-toggle"
        checked={isDark}
        onCheckedChange={handleToggle}
        aria-label="Toggle theme"
        className="h-6 w-12"
      />

      <Label htmlFor="theme-toggle" className="sr-only">
        {isDark ? "Dark mode" : "Light mode"}
      </Label>
    </div>
  );
};

export default ThemeToggle;
