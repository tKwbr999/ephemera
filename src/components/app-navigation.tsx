import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cloud, CloudOff, DoorOpen, Share2 } from "lucide-react";
import { useUser } from "@/contexts/user-context";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const AppNavigation = () => {
  const location = useLocation();
  const { user, logout } = useUser();

  const currentUrl = window.location.href;

  const navItems = [
    {
      name: "Realized",
      path: "/realized",
      icon: <Cloud className="h-5 w-5" />,
    },
    {
      name: "Alive",
      path: "/alive",
      icon: <Cloud className="h-5 w-5" />,
    },
    {
      name: "Buried",
      path: "/buried",
      icon: <CloudOff className="h-5 w-5" />,
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
  };

  return (
    <div className="fixed top-0 left-0 right-0 flex h-16 items-center justify-center border-b border-abbey-200 dark:border-abbey-700 w-full bg-white dark:bg-abbey-950 z-10">
      <div className="flex items-center justify-between w-full max-w-6xl px-4 sm:px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-abbey-900 dark:text-abbey-50">
            Ephemera
          </h1>
          <nav className="flex items-center space-x-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={
                    location.pathname === item.path ? "default" : "ghost"
                  }
                  className={
                    location.pathname === item.path
                      ? "flex items-center bg-abbey-900 text-white hover:bg-abbey-800"
                      : "flex items-center bg-abbey-200 hover:bg-abbey-800 text-black hover:text-white"
                  }
                >
                  {item.icon}
                  <span className="ml-2 md:inline hidden">{item.name}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full bg-abbey-200 text-white hover:bg-abbey-800"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user?.avatar_url}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="bg-abbey-200 hover:bg-abbey-800 text-black hover:text-white">
                    {user?.name ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-abbey-200 dark:border-abbey-700"
            >
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium text-abbey-900 dark:text-abbey-50">
                    {user?.name}
                  </p>
                  <p className="text-xs text-abbey-500 dark:text-abbey-400">
                    {user?.email}
                  </p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-abbey-800 dark:text-abbey-200 cursor-pointer flex items-center gap-2"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center justify-center border-abbey-200 dark:border-abbey-700">
                  <DialogTitle className="mb-4 text-xl font-bold">
                    Share this page
                  </DialogTitle>
                  <QRCodeSVG value={currentUrl} size={200} />
                  <p className="mt-4 text-sm text-abbey-500 dark:text-abbey-400">
                    Scan this QR code to open this page on another device
                  </p>
                  <Separator className="flex-grow bg-abbey-200 dark:bg-abbey-700" />
                  <div className="mt-1 flex flex-col items-center gap-2">
                    <p className="text-sm text-abbey-700 dark:text-abbey-300">
                      Or share via link:
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                      className="mt-2 text-xs bg-abbey-900 text-white hover:bg-abbey-800 border-abbey-900"
                    >
                      Copy link to clipboard
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
