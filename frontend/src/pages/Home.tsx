import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, Shield, Users, Activity, ArrowRight, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const quickActions = [
    {
      icon: Shield,
      title: "Track Medicines",
      description: "Monitor pharmaceutical supply chain in real-time",
      action: () => navigate("/dashboard")
    },
    {
      icon: Users,
      title: "Manage Facilities",
      description: "Oversee healthcare facilities and inventory",
      action: () => navigate("/dashboard")
    },
    {
      icon: Activity,
      title: "View Reports",
      description: "Access comprehensive analytics and insights",
      action: () => navigate("/dashboard")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="absolute top-0 w-full z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SwasthaTrack</h1>
              <p className="text-xs text-white/80">Healthcare Authority Portal</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-x-3"
          >
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-white/90 text-sm">
                  Welcome, {user?.name}
                </span>
                <Button
                  size="lg"
                  onClick={() => navigate("/dashboard")}
                  className="bg-white text-primary hover:bg-white/90 h-11 px-6 font-semibold"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => logout()}
                  className="text-white hover:bg-white/10 h-11 px-3"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="bg-white text-primary hover:bg-white/90 h-11 px-6 font-semibold"
              >
                <LogIn className="mr-2 w-4 h-4" />
                Healthcare Login
              </Button>
            )}
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Healthcare Supply Chain
              <span className="block text-white/90">Management System</span>
            </h1>
            
            <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Real-time pharmaceutical tracking and monitoring for healthcare authorities
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center justify-center space-x-4 pt-6"
            >
              {isAuthenticated ? (
                <Button
                  size="lg"
                  onClick={() => navigate("/dashboard")}
                  className="bg-white text-primary hover:bg-white/90 h-12 px-8 font-semibold"
                >
                  Access Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="bg-white text-primary hover:bg-white/90 h-12 px-8 font-semibold"
                >
                  <LogIn className="mr-2 w-4 h-4" />
                  Access System
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Quick Access
            </h2>
            <p className="text-white/80 text-base max-w-xl mx-auto">
              Essential healthcare management tools at your fingertips
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              >
                <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer"
                      onClick={action.action}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {action.title}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-white/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/60 text-sm">
            © 2025 SwasthaTrack
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;