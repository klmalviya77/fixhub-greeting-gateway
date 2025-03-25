
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, DollarSign, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTechnicianAuth } from '@/context/TechnicianAuthContext';

export function TechnicianSidebar() {
  const location = useLocation();
  const { signOut } = useTechnicianAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { 
      icon: Home, 
      label: 'Home', 
      path: '/technician-dashboard'
    },
    { 
      icon: Briefcase, 
      label: 'My Jobs', 
      path: '/technician-dashboard/jobs'
    },
    { 
      icon: DollarSign, 
      label: 'Earnings', 
      path: '/technician-dashboard/earnings'
    },
    { 
      icon: User, 
      label: 'Profile', 
      path: '/technician-dashboard/profile'
    }
  ];
  
  return (
    <div className="w-64 h-full bg-white border-r shadow-sm flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Technician Portal</h2>
      </div>
      
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t">
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
