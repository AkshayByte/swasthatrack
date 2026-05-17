import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Shield,
  Bell,
  Activity,
  TrendingUp,
  Package,
  BarChart3,
  ArrowRight,
  Users,
  Building2,
  CheckCircle2,
  Play,
  Search,
  Zap,
  Stethoscope,
  FileText,
  Database,
  ClipboardCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const bentoItems = [
    {
      title: "Comprehensive Care",
      desc: "5 Specialized dashboards for Doctors, Patients, Labs, Pharmacy & Reception.",
      icon: Activity,
      className: "md:col-span-2 md:row-span-2",
      bg: "bg-blue-500/10",
      color: "text-blue-500",
      content: (
        <div className="mt-4 h-32 w-full bg-background/50 rounded-lg border border-border/50 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent animate-pulse" />
          <div className="flex gap-4 items-center justify-center">
            <div className="flex flex-col items-center"><Users className="w-8 h-8 text-blue-500/70" /><span className="text-[10px] mt-1">Patient</span></div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
            <div className="flex flex-col items-center"><Stethoscope className="w-8 h-8 text-blue-500/70" /><span className="text-[10px] mt-1">Doctor</span></div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
            <div className="flex flex-col items-center"><ClipboardCheck className="w-8 h-8 text-blue-500/70" /><span className="text-[10px] mt-1">Pharmacy</span></div>
          </div>
        </div>
      )
    },
    {
      title: "ABDM Ready",
      desc: "Native support for ABHA IDs & Health Records.",
      icon: Shield,
      className: "md:col-span-1 md:row-span-1",
      bg: "bg-red-500/10",
      color: "text-red-500"
    },
    {
      title: "Queue Mgmt",
      desc: "Real-time OPD & token tracking.",
      icon: Users,
      className: "md:col-span-1 md:row-span-1",
      bg: "bg-purple-500/10",
      color: "text-purple-500"
    },
    {
      title: "Digital Records",
      desc: "Paperless prescriptions & lab reports.",
      icon: FileText,
      className: "md:col-span-1 md:row-span-1",
      bg: "bg-green-500/10",
      color: "text-green-500"
    },
    {
      title: "Inventory",
      desc: "Smart medicine stock alerts.",
      icon: Database,
      className: "md:col-span-1 md:row-span-1",
      bg: "bg-orange-500/10",
      color: "text-orange-500"
    }
  ];

  const steps = [
    {
      id: 0,
      title: "Registration",
      icon: Users,
      desc: "Seamless patient entry using ABHA ID or manual registration at the front desk. Instant token generation.",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      id: 1,
      title: "Consultation",
      icon: Stethoscope,
      desc: "Doctors access digital history, diagnose, and prescribe meds virtually. No more illegible paper slips.",
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      id: 2,
      title: "Fulfillment",
      icon: CheckCircle2,
      desc: "Pharmacy & Labs receive orders instantly. Patients collect medicines or give samples without delay.",
      color: "text-green-500",
      bg: "bg-green-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border/50 z-50 h-16 flex items-center transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-primary shadow-lg shadow-primary/20">
              <Heart className="w-5 h-5 text-white fill-white/20" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              SwasthaTrack
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-1">
              {['Features', 'How It Works'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, '-'))}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-all"
                >
                  {item}
                </button>
              ))}
            </div>
            <Button
              onClick={handleGetStarted}
              className="btn-primary-gradient rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30"
            >
              {isAuthenticated ? 'Dashboard' : 'Get Started'}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Dense & Interactive */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 border border-primary/20 shadow-sm">
                <Zap className="w-3 h-3 fill-current" />
                <span>ABDM Compliant</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Healthcare <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-purple-600">
                  Operations Unified.
                </span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
                Connect Registration, Doctors, Labs, and Pharmacy in one seamless flow.
                The intelligent operating system for modern hospitals.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="btn-primary-gradient h-12 px-8 rounded-full text-base"
                >
                  Launch Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection('features')}
                  className="h-12 px-8 rounded-full border-primary/20 hover:bg-primary/5 backdrop-blur-sm"
                >
                  <Play className="mr-2 w-4 h-4 fill-current" />
                  Explore Features
                </Button>
              </div>

              <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                  ))}
                </div>
                <p>Connecting <span className="font-bold text-foreground">5+ Departments</span> seamlessly</p>
              </div>
            </motion.div>

            {/* Right: 3D Dashboard Preview (Compact) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block perspective-1000"
            >
              <div className="relative z-10 bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-transform duration-700 ease-out">
                {/* Mock Header */}
                <div className="h-10 bg-muted/50 border-b border-border/50 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  </div>
                  <div className="ml-4 h-5 w-48 bg-muted rounded-full" />
                </div>
                {/* Mock Content */}
                <div className="p-6 grid grid-cols-3 gap-4 bg-background/95 backdrop-blur-xl h-[300px]">
                  <div className="col-span-2 space-y-4">
                    <div className="h-24 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/10 p-4 relative overflow-hidden flex items-center justify-between">
                      <div>
                        <p className="text-xs text-primary font-bold">Active Patient</p>
                        <p className="text-lg font-bold">Aditi Sharma</p>
                        <p className="text-xs text-muted-foreground">OPD Token: #42</p>
                      </div>
                      <Stethoscope className="w-10 h-10 text-primary/40" />
                    </div>
                    <div className="h-32 rounded-xl bg-muted/30 border border-border/50 p-4">
                      <div className="h-2 w-1/3 bg-muted-foreground/20 rounded mb-2"></div>
                      <div className="h-2 w-2/3 bg-muted-foreground/20 rounded mb-2"></div>
                      <div className="h-2 w-1/2 bg-muted-foreground/20 rounded"></div>
                    </div>
                  </div>
                  <div className="col-span-1 space-y-4">
                    <div className="h-full rounded-xl bg-muted/30 border border-border/50 flex flex-col items-center justify-center p-2 gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-green-500" /></div>
                      <span className="text-[10px] text-center">Vitals Normal</span>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-6 top-20 bg-card p-3 rounded-xl shadow-xl border border-border/50 flex items-center gap-3"
                >
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Bell className="w-5 h-5" /></div>
                  <div>
                    <div className="text-xs font-bold">New Report Ready</div>
                    <div className="text-[10px] text-muted-foreground">Lab - 2m ago</div>
                  </div>
                </motion.div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-purple-500/30 blur-[60px] -z-10 rounded-full opacity-50" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Grid Section - Loaded & Compact */}
      <section id="features" className="py-20 bg-muted/30 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Total Hospital Control</h2>
            <p className="text-muted-foreground">Every department, one harmonious platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[500px]">
            {bentoItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300",
                  item.className
                )}
              >
                <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${item.color}`}>
                  <item.icon className="w-24 h-24 -mr-8 -mt-8 rotate-12" />
                </div>

                <div className="relative z-10 h-full flex flex-col">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${item.bg} ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                  {item.content && <div className="mt-auto">{item.content}</div>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive How It Works - Tabs */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Seamless Patient Flow</h2>
            <p className="text-muted-foreground">From entry to exit, efficiency at every step.</p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Left: Tabs */}
            <div className="md:col-span-5 space-y-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    "p-4 rounded-xl cursor-pointer transition-all duration-300 border",
                    activeTab === index
                      ? "bg-card border-primary/50 shadow-md scale-105"
                      : "bg-transparent border-transparent hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                      activeTab === index ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className={cn("font-bold", activeTab === index ? "text-foreground" : "text-muted-foreground")}>
                        {step.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Content Display */}
            <div className="md:col-span-7">
              <div className="relative h-[300px] bg-card rounded-3xl border border-border/50 shadow-lg overflow-hidden p-8 flex flex-col justify-center items-center text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 ${steps[activeTab].bg} ${steps[activeTab].color}`}>
                      {(() => {
                        const Icon = steps[activeTab].icon;
                        return <Icon className="w-8 h-8" />;
                      })()}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{steps[activeTab].title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {steps[activeTab].desc}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Clean */}
      <footer className="bg-card border-t border-border/50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-primary">
                <Heart className="w-4 h-4 text-white fill-white/20" />
              </div>
              <span className="text-xl font-bold">SwasthaTrack</span>
            </div>

            <div className="flex gap-8 text-sm font-medium text-muted-foreground">
              <button onClick={() => navigate("/about-us")} className="hover:text-primary transition-colors">About</button>
              <button onClick={() => navigate("/contact-us")} className="hover:text-primary transition-colors">Contact</button>
              <button onClick={() => navigate("/privacy-policy")} className="hover:text-primary transition-colors">Privacy</button>
              <button onClick={() => navigate("/terms-of-service")} className="hover:text-primary transition-colors">Terms</button>
            </div>

            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                <Activity className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-muted-foreground">
            © 2025 SwasthaTrack. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
