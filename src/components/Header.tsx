import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-pink glow-box">
            <Sparkles className="w-6 h-6 text-background" />
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-neon-cyan via-primary to-neon-pink bg-clip-text text-transparent">
            Sparkwave
          </span>
        </div>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <a 
            href="/" 
            className="text-foreground/80 hover:text-primary hover:glow-text transition-all duration-300"
          >
            Home
          </a>
          <a 
            href="/ad-creator" 
            className="text-foreground/80 hover:text-primary hover:glow-text transition-all duration-300"
          >
            Create
          </a>
          <a 
            href="/gallery" 
            className="text-foreground/80 hover:text-primary hover:glow-text transition-all duration-300"
          >
            Gallery
          </a>
          <a 
            href="/testimonials" 
            className="text-foreground/80 hover:text-primary hover:glow-text transition-all duration-300"
          >
            Stories
          </a>
          {user && (
            <a 
              href="/dashboard" 
              className="text-foreground/80 hover:text-primary hover:glow-text transition-all duration-300"
            >
              Dashboard
            </a>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-foreground/60">
                {user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-foreground/80 hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/login'}
                className="text-foreground/80"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
              <Button
                variant="neon"
                size="sm"
                onClick={() => window.location.href = '/signup'}
                className="glow-box"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;