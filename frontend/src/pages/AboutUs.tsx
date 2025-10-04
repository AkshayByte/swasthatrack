import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Heart, 
  Target, 
  Users, 
  Award, 
  Globe, 
  Shield,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AboutUs = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Healthcare Facilities", value: "2,500+", icon: Globe },
    { label: "Medicine Batches Tracked", value: "1M+", icon: Package },
    { label: "Healthcare Professionals", value: "15,000+", icon: Users },
    { label: "States Covered", value: "28", icon: Award }
  ];

  const values = [
    {
      icon: Shield,
      title: "Transparency",
      description: "Complete visibility into the pharmaceutical supply chain"
    },
    {
      icon: Heart,
      title: "Patient-Centric",
      description: "Ensuring every medicine reaches patients safely and on time"
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Leveraging cutting-edge technology for healthcare delivery"
    },
    {
      icon: CheckCircle,
      title: "Reliability",
      description: "Building trust through consistent, accurate, and secure operations"
    }
  ];

  const timeline = [
    {
      year: "2023",
      title: "Platform Launch",
      description: "SwasthaTrack officially launched as part of ABDM initiative"
    },
    {
      year: "2023",
      title: "Pilot Program",
      description: "Initial deployment in 100+ healthcare facilities across 5 states"
    },
    {
      year: "2024",
      title: "National Rollout",
      description: "Expansion to 2,500+ facilities covering all major states"
    },
    {
      year: "2024",
      title: "Advanced Features",
      description: "Integration of AI-powered analytics and predictive capabilities"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">About SwasthaTrack</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              About SwasthaTrack
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              SwasthaTrack is India's premier pharmaceutical supply chain management platform, 
              designed to ensure transparent, efficient, and secure medicine distribution across 
              the nation's healthcare ecosystem under the Ayushman Bharat Digital Mission.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-6 h-6 mr-3 text-blue-600" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To revolutionize pharmaceutical supply chain management in India by providing 
                  a transparent, secure, and efficient platform that ensures every medicine reaches 
                  the right patient at the right time, supporting the vision of universal healthcare 
                  access under Ayushman Bharat.
                </p>
              </CardContent>
            </Card>

            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-6 h-6 mr-3 text-green-600" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To create a digitally empowered healthcare ecosystem where every medicine is 
                  traceable, every transaction is transparent, and every patient receives 
                  authentic, quality medicines through an interconnected network of healthcare 
                  facilities across India.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Our Impact in Numbers
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="card-healthcare h-full text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <value.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-600 text-sm">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* What We Do */}
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle className="text-2xl">What We Do</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Supply Chain Tracking</h3>
                  <p className="text-gray-600">
                    Real-time monitoring of medicine movement from manufacturers to healthcare 
                    facilities, ensuring complete visibility and accountability.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Inventory Management</h3>
                  <p className="text-gray-600">
                    Advanced inventory tracking with automated alerts for expiry dates, 
                    stock levels, and reorder requirements.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Quality Assurance</h3>
                  <p className="text-gray-600">
                    Comprehensive batch tracking and quality control measures to prevent 
                    counterfeit medicines and ensure patient safety.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Analytics & Reporting</h3>
                  <p className="text-gray-600">
                    Data-driven insights and automated reporting for better decision-making 
                    and regulatory compliance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <div>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Our Journey
            </h2>
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center space-x-6"
                >
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {item.year}
                  </div>
                  <Card className="card-healthcare flex-1">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Leadership */}
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle className="text-2xl">Leadership & Governance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                SwasthaTrack is developed and maintained under the guidance of the National Health Authority 
                and the Ministry of Health and Family Welfare, Government of India, as part of the 
                Ayushman Bharat Digital Mission.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Advisory Board</h4>
                  <p className="text-gray-600 text-sm">
                    Comprised of healthcare experts, technology leaders, and policy makers 
                    ensuring strategic direction and compliance.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Technical Team</h4>
                  <p className="text-gray-600 text-sm">
                    Experienced engineers, healthcare informaticians, and security specialists 
                    dedicated to platform excellence.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-green-600 text-white p-8 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4">Join the Digital Health Revolution</h2>
            <p className="text-xl mb-6 opacity-90">
              Be part of India's transformation towards transparent and efficient healthcare delivery
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Get Started Today
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;