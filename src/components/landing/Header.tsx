"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signOut } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";
import ThemeToggle from "../ThemeToggle";

function Header() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await dispatch(signOut());
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 px-6 py-2 border-b border-border/50 bg-background/80 backdrop-blur-md h-16">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src={"/logo.png"} alt="DentWise Logo" width={32} height={32} className="w-11 logo-blue" />
          <span className="font-semibold text-lg">DentWise</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            How it Works
          </button>
          <button 
            onClick={() => scrollToSection('pricing')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </button>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-sm font-medium text-foreground">
                  {user?.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
              <Link href="/dashboard">
                <Button size={"sm"}>
                  Go to Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOutIcon className="w-4 h-4" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button variant={"ghost"} size={"sm"}>
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size={"sm"}>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Header;
