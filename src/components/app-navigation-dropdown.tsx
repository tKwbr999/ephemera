import { DoorOpen, Share2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";

const AppNavigationDropdown = () => {
  const { user, logout } = useUser();
  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full bg-abbey-200 text-white hover:bg-abbey-800"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar_url} alt={user?.name || "User"} />
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
  );
};

export default AppNavigationDropdown;
