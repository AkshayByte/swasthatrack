import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Pill, 
  Truck, 
  Building2, 
  Package, 
  Users, 
  FileText, 
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Heart,
  QrCode,
  Stethoscope,
  Activity,
  Shield,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Pill, label: "Medicines", path: "/medicines" },
  { icon: Truck, label: "Shipments", path: "/shipments" },
  { icon: Building2, label: "Facilities", path: "/facilities" },
  { icon: Package, label: "Inventory", path: "/inventory" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: QrCode, label: "Check‑in", path: "/check-in" },
  { icon: Stethoscope, label: "Encounters", path: "/encounters" },
  { icon: BarChart3, label: "Monitoring", path: "/monitoring" },
  { icon: Activity, label: "Discovery Logs", path: "/discovery-logs" },
  { icon: Shield, label: "Consent Requests", path: "/consent-requests" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-card border-r border-border flex flex-col shadow-medium"
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gradient-primary">SwasthaTrack</h1>
                <p className="text-xs text-muted-foreground">ABDM Healthcare</p>
              </div>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-8 h-8 p-0 hover:bg-accent"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
                "hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-muted-foreground text-center"
          >
            <p>Version 1.0.0</p>
            <p>Ayushman Bharat Digital Mission</p>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;