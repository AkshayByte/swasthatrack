import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Pill,
  Stethoscope,
  User,
  Users,
  Activity,
  Package,
  Truck,
  Building2,
  FileText,
  Settings,
  BarChart3,
  QrCode,
  Shield,
  ArrowRight,
  LayoutGrid,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

const UnifiedDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const dashboardItems = [
    {
      title: "Medicine Dashboard",
      description: "Manage medicines, inventory, and pharmaceutical supplies",
      icon: Pill,
      path: "/dashboard/pharmacist/inventory",
      color: "bg-blue-500",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Doctor Dashboard",
      description: "Access patient records, diagnoses, and prescriptions",
      icon: Stethoscope,
      path: "/dashboard/doctor/patient-queue",
      color: "bg-green-500",
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "Patient Dashboard",
      description: "View health records, prescriptions, and appointments",
      icon: User,
      path: "/dashboard/patient/records",
      color: "bg-purple-500",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Registration Dashboard",
      description: "Manage patient registrations and appointments",
      icon: Users,
      path: "/dashboard/registration/register",
      color: "bg-yellow-500",
      gradient: "from-yellow-500 to-yellow-600"
    },
    {
      title: "Laboratory Dashboard",
      description: "Handle lab tests, reports, and results",
      icon: Activity,
      path: "/dashboard/laboratory/pending",
      color: "bg-red-500",
      gradient: "from-red-500 to-red-600"
    },
  ];

  // Role-based Quick Actions - each tool specifies which roles can access it
  const allQuickActions = [
    {
      title: "Medicines",
      description: "Inventory & Stock",
      icon: Package,
      path: "/dashboard/pharmacist/inventory",
      roles: ["pharmacist", "admin"]
    },
    {
      title: "Shipments",
      description: "Track Deliveries",
      icon: Truck,
      path: "/dashboard/pharmacist/shipments",
      roles: ["pharmacist", "admin"]
    },
    {
      title: "Global Inventory",
      description: "All Facilities",
      icon: Package,
      path: "/dashboard/pharmacist/global-inventory",
      roles: ["pharmacist", "admin"]
    },
    {
      title: "Encounters",
      description: "Patient Visits",
      icon: Stethoscope,
      path: "/dashboard/doctor/encounters",
      roles: ["doctor", "admin"]
    },
    {
      title: "Check-in",
      description: "Patient Entry",
      icon: QrCode,
      path: "/dashboard/registration/check-in",
      roles: ["registration", "admin"]
    },
    {
      title: "Consent",
      description: "Manage Requests",
      icon: Shield,
      path: "/dashboard/patient/consent",
      roles: ["patient", "admin"]
    },
    {
      title: "Facilities",
      description: "Manage Locations",
      icon: Building2,
      path: "/dashboard/admin/facilities",
      roles: ["admin"]
    },
    {
      title: "Users",
      description: "Access Control",
      icon: Users,
      path: "/dashboard/admin/users",
      roles: ["admin"]
    },
    {
      title: "Monitoring",
      description: "System Health",
      icon: BarChart3,
      path: "/dashboard/admin/monitoring",
      roles: ["admin"]
    },
    {
      title: "Reports",
      description: "Analytics & Data",
      icon: FileText,
      path: "/dashboard/reports",
      roles: ["doctor", "pharmacist", "lab", "registration", "admin"]
    },
    {
      title: "Profile",
      description: "Your Account",
      icon: User,
      path: "/dashboard/profile",
      roles: ["doctor", "pharmacist", "lab", "registration", "patient", "admin"]
    },
    {
      title: "Settings",
      description: "System Config",
      icon: Settings,
      path: "/dashboard/settings",
      roles: ["doctor", "pharmacist", "lab", "registration", "patient", "admin"]
    },
  ];

  // Filter Quick Actions based on user role
  const filteredQuickActions = allQuickActions.filter(action =>
    action.roles.includes(user?.role || '')
  );

  // Mock stats - would come from API in real app
  const stats = [
    {
      title: "Today's Activity",
      value: "24",
      description: "Active sessions",
      icon: Activity,
      trend: "+12%",
      color: "text-blue-600"
    },
    {
      title: "Pending Tasks",
      value: "8",
      description: "Requires attention",
      icon: Clock,
      trend: "-5%",
      color: "text-orange-600"
    },
    {
      title: "System Status",
      value: "98%",
      description: "Uptime this month",
      icon: TrendingUp,
      trend: "+2%",
      color: "text-green-600"
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 p-2">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-panel p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Welcome, <span className="text-primary">{user?.name || 'Healthcare Professional'}</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Access your specialized dashboards and system tools from this central hub.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20 shadow-sm">
          <LayoutGrid className="w-4 h-4" />
          <span>Unified Access Portal</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="card-premium border-transparent">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h3 className="text-3xl font-bold mt-2 text-foreground">{stat.value}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-muted/50 ${stat.color} shadow-inner`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs font-medium">
                  <span className={`px-2 py-0.5 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {stat.trend}
                  </span>
                  <span className="text-muted-foreground ml-2">from last week</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dashboard Navigation */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-primary rounded-full" />
          <h2 className="text-xl font-semibold">Role-Based Dashboards</h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {dashboardItems.map((dashboard, index) => {
            const IconComponent = dashboard.icon;
            return (
              <motion.div key={index} variants={item}>
                <Card
                  className="card-premium cursor-pointer group h-full relative overflow-hidden border-transparent"
                  onClick={() => navigate(dashboard.path)}
                >
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${dashboard.gradient}`} />
                  <CardHeader className="pb-2 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${dashboard.gradient} flex items-center justify-center mb-4 shadow-lg shadow-primary/10 group-hover:scale-110 group-hover:shadow-primary/20 transition-all duration-300`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {dashboard.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">
                      {dashboard.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                      Access Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Quick Actions - Filtered by Role */}
      {filteredQuickActions.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-secondary rounded-full" />
              <h2 className="text-xl font-semibold">Quick Actions & Tools</h2>
            </div>
            <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
              {filteredQuickActions.length} available
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredQuickActions.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="glass-card cursor-pointer hover:bg-white/50 dark:hover:bg-slate-800/50 hover:border-primary/30 transition-all duration-300 group border-transparent"
                  onClick={() => navigate(feature.path)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedDashboard;