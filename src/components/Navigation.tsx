import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home,
  Sparkles,
  Grid3X3,
  Users,
  LayoutDashboard,
  User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navigation = () => {
  const { user } = useAuth();
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/ad-creator', label: 'Create', icon: Sparkles },
    { href: '/gallery', label: 'Gallery', icon: Grid3X3 },
    { href: '/testimonials', label: 'Stories', icon: Users },
    ...(user ? [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] : [{ href: '/login', label: 'Login', icon: User }])
  ];

  const currentPath = window.location.pathname;

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
      <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-full px-2 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPath === item.href;
            
            return (
              <Button
                key={item.href}
                variant={isActive ? 'neon' : 'ghost'}
                size="sm"
                className={`rounded-full transition-all duration-300 ${
                  isActive ? 'glow-box' : 'hover:bg-primary/10'
                }`}
                onClick={() => window.location.href = item.href}
              >
                <IconComponent className="w-4 h-4" />
                <span className="sr-only">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;