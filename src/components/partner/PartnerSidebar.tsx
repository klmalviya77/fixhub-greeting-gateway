
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePartnerAuth } from '@/context/PartnerAuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Home, Package, DollarSign, User, LogOut } from 'lucide-react';

export function PartnerSidebar() {
  const { partner, signOut } = usePartnerAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const navItems = [
    {
      name: 'Home',
      path: '/partner-dashboard',
      icon: Home,
    },
    {
      name: 'Manage Services',
      path: '/partner-dashboard/services',
      icon: Package,
    },
    {
      name: 'Earnings',
      path: '/partner-dashboard/earnings',
      icon: DollarSign,
    },
    {
      name: 'Profile',
      path: '/partner-dashboard/profile',
      icon: User,
    },
  ];
  
  return (
    <div className="min-h-screen w-64 bg-white border-r">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Partner Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">{partner?.shop_name}</p>
      </div>
      
      <div className="py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                isActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className={cn("mr-3 h-5 w-5")} />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="absolute bottom-0 w-64 p-4 border-t">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
