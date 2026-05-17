import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  Moon,
  Sun,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  onSidebarToggle: () => void;
}

const Navbar = ({ onSidebarToggle }: NavbarProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications] = useState([
    { id: 1, message: "New shipment delayed - Batch #MT2024001", type: "warning" },
    { id: 2, message: "Medicine expiry alert - 50 items expire in 7 days", type: "danger" },
    { id: 3, message: "Inventory low - Paracetamol 500mg", type: "info" },
  ]);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border/50 px-6 py-4 shadow-sm sticky top-0 z-10 transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="lg:hidden hover:bg-accent hover:text-accent-foreground"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="relative w-80 max-w-sm hidden md:block group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <Input
              placeholder="Search medicines, batches, facilities..."
              className="pl-10 bg-muted/30 border-transparent focus:bg-background focus:border-primary/20 transition-all duration-300 rounded-xl"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="w-9 h-9 p-0 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative w-9 h-9 p-0 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors">
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full ring-2 ring-card animate-pulse" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-xl border-border/50 shadow-xl bg-card/95 backdrop-blur-sm">
              <div className="p-4 border-b border-border/50 flex justify-between items-center">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <Badge variant="secondary" className="text-xs font-normal">{notifications.length} new</Badge>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer hover:bg-accent/50 focus:bg-accent/50">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notification.type === "warning"
                          ? "bg-warning shadow-[0_0_8px] shadow-warning/50"
                          : notification.type === "danger"
                            ? "bg-destructive shadow-[0_0_8px] shadow-destructive/50"
                            : "bg-info shadow-[0_0_8px] shadow-info/50"
                          }`}
                      />
                      <p className="text-sm text-foreground/90 leading-snug">{notification.message}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <div className="p-2 border-t border-border/50 text-center">
                <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground h-8">
                  Mark all as read
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-transparent focus-visible:ring-0">
                <Avatar className="h-9 w-9 border-2 border-primary/10 ring-2 ring-transparent hover:ring-primary/20 transition-all duration-300">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-gradient-primary text-white font-medium">
                    {user?.name?.substring(0, 2).toUpperCase() || 'DR'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl border-border/50 shadow-xl bg-card/95 backdrop-blur-sm mt-2">
              <div className="flex items-center justify-start gap-3 p-3 bg-muted/30 rounded-t-xl">
                <Avatar className="h-10 w-10 border border-border/50">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {user?.name?.substring(0, 2).toUpperCase() || 'DR'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-0.5 leading-none">
                  <p className="font-semibold text-sm">{user?.name}</p>
                  <p className="w-[140px] truncate text-xs text-muted-foreground capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
              <div className="p-1">
                <DropdownMenuItem onClick={() => navigate("/dashboard/profile")} className="rounded-lg cursor-pointer">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="rounded-lg cursor-pointer">
                  <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-border/50" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;