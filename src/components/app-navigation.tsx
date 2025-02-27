import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Cloud, CloudOff, DoorOpen } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const AppNavigation = () => {
  const location = useLocation();
  const { user, logout } = useUser();

  const currentUrl = window.location.href;

  const navItems = [
    {
      name: 'My Clouds',
      path: '/dashboard',
      icon: <Cloud className="h-5 w-5" />,
    },
    {
      name: 'Archived',
      path: '/archived',
      icon: <CloudOff className="h-5 w-5" />,
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex h-16 items-center justify-center border-b border-abbey-200 dark:border-abbey-700 w-full">
      <div className="flex items-center justify-between w-full max-w-6xl px-4 sm:px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-abbey-900 dark:text-abbey-50">Cloud Ideas</h1>
          <nav className="flex items-center space-x-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? 'default' : 'ghost'}
                  className={cn(
                    'flex items-center space-x-2',
                    location.pathname === item.path
                      ? 'bg-abbey-800 text-white dark:bg-abbey-200 dark:text-abbey-950'
                      : 'text-abbey-500 hover:text-abbey-800 dark:text-abbey-400 dark:hover:text-abbey-200'
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="border-abbey-200 dark:border-abbey-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="14" height="14" x="5" y="5" rx="2" />
                  <path d="M5 10h14" />
                  <path d="M10 5v14" />
                </svg>
              </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center justify-center border-abbey-200 dark:border-abbey-700">
              <DialogTitle className="mb-4 text-xl font-bold">Share this page</DialogTitle>
              <QRCodeSVG value={currentUrl} size={200} />
              <p className="mt-4 text-sm text-abbey-500 dark:text-abbey-400">
                Scan this QR code to open this page on another device
              </p>
            </DialogContent>
          </Dialog>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border border-abbey-200 dark:border-abbey-700">
                  <AvatarImage src={user?.avatar_url} alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-abbey-100 text-abbey-800">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-abbey-200 dark:border-abbey-700">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium text-abbey-900 dark:text-abbey-50">{user?.name}</p>
                  <p className="text-xs text-abbey-500 dark:text-abbey-400">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuItem 
                onClick={logout}
                className="text-abbey-800 dark:text-abbey-200 cursor-pointer flex items-center gap-2"
              >
                <DoorOpen className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default AppNavigation;