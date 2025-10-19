"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true); // Start with dark mode since we set it as default
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const isCurrentlyDark = savedTheme === 'dark' || (!savedTheme && document.documentElement.classList.contains('dark'));
    setIsDark(isCurrentlyDark);
    
    // Apply the theme based on saved preference
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
    // If no saved theme, keep the default (dark mode)
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="relative h-10 w-10 rounded-full border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105"
        disabled
      >
        <div className="h-5 w-5" />
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative h-10 w-10 rounded-full border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-blue-600" />
      )}
      <span className="sr-only">
        {isDark ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </Button>
  );
}
