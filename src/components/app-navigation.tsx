import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/nav-items";
import AppNavigationDropdown from "./app-navigation-dropdown";

const AppNavigation = () => {
  const location = useLocation();

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
                      ? "flex items-center"
                      : "flex items-center"
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
          <AppNavigationDropdown />
        </div>
      </div>
    </div>
  );
};

export default AppNavigation;
