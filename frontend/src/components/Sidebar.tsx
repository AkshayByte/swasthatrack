import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  Users,
  User,
  Activity,
  Package,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Heart,
  Stethoscope,
  Pill,
  QrCode,
  Building2,
  LayoutDashboard,
  ClipboardList,
  TestTube,
  ShoppingCart,
  Calendar,
  FileSearch,
  Database,
  PackageCheck,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

// Section type for better organization
interface MenuSection {
  title: string;
  icon?: React.ElementType;
  items: Array<{ icon: React.ElementType; label: string; path: string }>;
}

// Get organized menu sections based on user role
const getMenuSections = (userRole: string): MenuSection[] => {
  const sections: MenuSection[] = [];

  // Main Navigation - Only show Dashboard for admin
  if (userRole === 'admin') {
    sections.push({
      title: "MAIN",
      items: [
        { icon: Home, label: "Dashboard", path: "/dashboard" }
      ]
    });
  }

  // Role-specific Daily Tasks
  switch (userRole) {
    case 'registration':
      sections.push({
        title: "DAILY TASKS",
        items: [
          { icon: User, label: "Register Patient", path: "/dashboard/registration/register" },
          { icon: QrCode, label: "Check-in", path: "/dashboard/registration/check-in" },
          { icon: Users, label: "Queue List", path: "/dashboard/registration/queue-list" },
          { icon: Calendar, label: "Add to Queue", path: "/dashboard/registration/add-to-queue" },
        ]
      });
      break;

    case 'doctor':
      sections.push({
        title: "DAILY TASKS",
        items: [
          { icon: Stethoscope, label: "Patient Queue", path: "/dashboard/doctor/patient-queue" },
          { icon: User, label: "Patient Details", path: "/dashboard/doctor/patient-details" },
          { icon: ClipboardList, label: "Diagnosis", path: "/dashboard/doctor/diagnosis" },
          { icon: Pill, label: "Prescribe Medicine", path: "/dashboard/doctor/prescribe" },
          { icon: TestTube, label: "Order Lab Test", path: "/dashboard/doctor/order-lab" },
        ]
      });
      break;

    case 'pharmacist':
      sections.push({
        title: "DAILY TASKS",
        items: [
          { icon: ClipboardList, label: "Pending Prescriptions", path: "/dashboard/pharmacist/pending" },
          { icon: ShoppingCart, label: "Dispense Medicine", path: "/dashboard/pharmacist/dispense" },
          { icon: Database, label: "Medicine Inventory", path: "/dashboard/pharmacist/inventory" },
          { icon: Package, label: "Batch Tracking", path: "/dashboard/pharmacist/batch-tracking" },
        ]
      });
      break;

    case 'lab':
      sections.push({
        title: "DAILY TASKS",
        items: [
          { icon: ClipboardList, label: "Pending Tests", path: "/dashboard/laboratory/pending" },
          { icon: FileText, label: "Upload Report", path: "/dashboard/laboratory/upload" },
          { icon: FileSearch, label: "Completed Tests", path: "/dashboard/laboratory/completed" },
        ]
      });
      break;

    case 'patient':
      sections.push({
        title: "MY HEALTH",
        items: [
          { icon: FileSearch, label: "My Records", path: "/dashboard/patient/records" },
          { icon: PackageCheck, label: "My Prescriptions", path: "/dashboard/patient/prescriptions" },
          { icon: TestTube, label: "My Lab Reports", path: "/dashboard/patient/lab-reports" },
          { icon: Stethoscope, label: "My Encounters", path: "/dashboard/patient/encounters" },
        ]
      });
      break;

    case 'medicine':
      sections.push({
        title: "DAILY TASKS",
        items: [
          { icon: Package, label: "Inventory", path: "/dashboard/pharmacist/inventory" },
        ]
      });
      break;
  }

  // Tools & Reports - Common for most roles
  if (userRole !== 'patient') {
    sections.push({
      title: "TOOLS & REPORTS",
      items: [
        { icon: FileText, label: "Reports", path: "/dashboard/reports" },
        { icon: User, label: "Profile", path: "/dashboard/profile" },
      ]
    });
  } else {
    // Patient only has profile
    sections.push({
      title: "ACCOUNT",
      items: [
        { icon: User, label: "Profile", path: "/dashboard/profile" },
      ]
    });
  }

  // System & Admin - Always at bottom
  const systemItems: Array<{ icon: React.ElementType; label: string; path: string }> = [
    { icon: Settings, label: "Settings", path: "/dashboard/settings" }
  ];

  // Add admin-only items
  if (userRole === 'admin' || userRole === 'registration') {
    systemItems.push(
      { icon: Building2, label: "Facilities", path: "/dashboard/admin/facilities" }
    );
  }

  if (userRole === 'admin') {
    systemItems.push(
      { icon: Users, label: "Users", path: "/dashboard/admin/users" },
      { icon: BarChart3, label: "Monitoring", path: "/dashboard/admin/monitoring" }
    );
  }

  sections.push({
    title: "SYSTEM",
    items: systemItems
  });

  return sections;
};



const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();

  // Get user role from auth context or localStorage
  const userRole = user?.role || localStorage.getItem('role') || '';

  const menuSections = getMenuSections(userRole);


  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-card/95 backdrop-blur-sm border-r border-border flex flex-col shadow-lg z-20 h-screen sticky top-0"
    >
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-glow" style={{ background: 'var(--gradient-primary)' }}>
                <Heart className="w-6 h-6 text-white fill-white/20" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-primary)' }}>SwasthaTrack</h1>
                <p className="text-xs text-muted-foreground font-medium">Healthcare Management</p>
              </div>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-8 h-8 p-0 hover:bg-accent hover:text-accent-foreground rounded-full"
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
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-hide">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {/* Section Header */}
            {!isCollapsed && (
              <div className="px-3 mb-2 text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">
                {section.title}
              </div>
            )}

            {/* Section Items */}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="font-medium text-sm"
                      >
                        {item.label}
                      </motion.span>
                    )}
                    {isActive && !isCollapsed && (
                      <motion.div
                        layoutId="active-pill"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                      />
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* Divider after each section except last */}
            {!isCollapsed && sectionIndex < menuSections.length - 1 && (
              <div className="h-px bg-border/50 my-4" />
            )}
          </div>
        ))}


      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 bg-muted/20">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-muted-foreground text-center space-y-1"
          >
            <p className="font-semibold text-foreground">SwasthaTrack v1.0</p>
            <p>Secure Healthcare System</p>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;