
import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import showToast from "@/components/reusableComponents/ToasterAlert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have no new notifications.",
    });
  };

  const handleProfileClick = () => {
    toast({
      title: "Profile",
      description: "Profile settings coming soon!",
    });
  };

  const handleLogout = () => {
    navigate("/login");
    logout();
    showToast("User Logged out.", 'success');
    // ({
    //   title: "Logged Out",
    //   description: "You have been successfully logged out.",
    // });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-900">WineShipping ERP System</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Welcome, {user.username}</span>
            <Badge variant="secondary">{user.role}</Badge>
          </div>
        )}
        
        <Button variant="ghost" size="icon" onClick={handleNotificationClick}>
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user ? user.username.substring(0, 2).toUpperCase() : 'AD'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
