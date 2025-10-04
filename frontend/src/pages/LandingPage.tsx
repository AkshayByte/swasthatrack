import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  Shield, 
  Bell, 
  Activity, 
  TrendingUp,
  Package,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Mail,
  MapPin,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Debug: Log authentication state
  console.log('Landing Page - isAuthenticated:', isAuthenticated);
  console.log('Landing Page - user:', user);

  // Helper function to handle get started click
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

  const features = [
    {
      icon: Activity,
      title: "Real-Time Tracking",
      description: "Monitor medicine movement instantly across the entire supply chain with live updates."
    },
    {
      icon: Bell,
      title: "Expiry & Shortage Alerts",
      description: "Get automated notifications for medicine expiry dates and low stock levels."
    },
    {
      icon: Heart,
      title: "ABDM Integration",
      description: "Connect seamlessly with Ayushman Bharat Digital Mission infrastructure."
    },
    {
      icon: Shield,
      title: "Transparent Records",
      description: "Tamper-proof logs and audit trails ensure complete transparency and trust."
    }
  ];

  const steps = [
    {
      icon: Package,
      title: "Add Stock",
      description: "Input medicine details into the system with batch numbers, expiry dates, and quantities."
    },
    {
      icon: TrendingUp,
      title: "Track Movement",
      description: "Follow delivery & inventory updates in real time across all healthcare facilities."
    },
    {
      icon: BarChart3,
      title: "Generate Reports",
      description: "Create instant summaries and analytics for informed decision-making."
    }
  ];

  const benefits = [
    "Minimize theft and fraud with transparent tracking",
    "Ensure timely delivery to critical healthcare facilities",
    "Improve decision-making with real-time data insights",
    "Comply with national digital health policies and standards"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SwasthaTrack</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('benefits')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Benefits
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact
              </button>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-600 text-sm">Welcome back!</span>
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Dashboard
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                SwasthaTrack — Smarter 
                <span className="block text-blue-600">Pharmaceutical Supply Chain</span>
                <span className="block text-green-600">for Public Healthcare</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                A secure, transparent, and real-time platform for managing medicine supply, 
                ensuring every dose reaches the right hands at the right time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection('features')}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 h-12 px-8 text-lg"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Makes SwasthaTrack Essential?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced features designed specifically for healthcare supply chain management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Three Simple Steps to Smarter Medicine Management
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Streamlined workflow designed for healthcare professionals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-0 transform translate-x-1/2">
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Healthcare Authorities Choose SwasthaTrack
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Trusted by healthcare professionals across India for reliable supply chain management
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8"
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Secure & Compliant
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Built with enterprise-grade security and full compliance with 
                  Ayushman Bharat Digital Mission standards and national healthcare policies.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SwasthaTrack</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Revolutionizing pharmaceutical supply chain management for better healthcare outcomes.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollToSection('benefits')}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Benefits
                </button>
                <button 
                  onClick={() => navigate("/faq")}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  FAQ
                </button>
              </div>
            </div>

            {/* ABDM Integration */}
            <div>
              <h4 className="text-lg font-semibold mb-4">ABDM Integration</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate("/m1/abha/create")}
                  className="block text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                >
                  Create ABHA (M1)
                </button>
                <button 
                  onClick={() => navigate("/m1/abha/verify")}
                  className="block text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                >
                  Verify ABHA (M1)
                </button>
                <a 
                  href="https://abdm.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  ABDM Official
                </a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate("/privacy-policy")}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </button>
                <button 
                  onClick={() => navigate("/terms-of-service")}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </button>
                <button 
                  onClick={() => navigate("/contact-us")}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact Us
                </button>
                <button 
                  onClick={() => navigate("/about-us")}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About Us
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 SwasthaTrack - Ayushman Bharat Digital Mission. All rights reserved.
              </p>
              <p className="text-gray-400 text-sm mt-2 md:mt-0">
                <span className="font-bold">Created by Akshay</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
