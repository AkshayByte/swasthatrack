import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const FAQ = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create an account on SwasthaTrack?",
          answer: "You need a valid ABHA ID or institutional healthcare credentials to register. Click on 'Register' and follow the ABDM authentication process with OTP verification."
        },
        {
          question: "What credentials do I need to access the platform?",
          answer: "You must be a registered healthcare professional or authorized facility representative with a valid ABHA ID or institutional healthcare credentials."
        },
        {
          question: "How do I reset my password?",
          answer: "Use the 'Forgot Password' link on the login page or contact our support team at support@swasthatrack.gov.in for assistance."
        }
      ]
    },
    {
      category: "Platform Usage",
      questions: [
        {
          question: "How do I track medicine inventory?",
          answer: "Navigate to the Inventory section from the dashboard. You can view current stock levels, add new inventory, and set up automated alerts for low stock and expiry dates."
        },
        {
          question: "Can I generate reports for regulatory compliance?",
          answer: "Yes, go to the Reports section where you can generate various compliance reports including inventory summaries, transaction logs, and audit trails."
        },
        {
          question: "How do I add a new shipment?",
          answer: "Access the Shipments module, click 'Add New Shipment', enter the required details including origin, destination, and medicine batch information."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "What browsers are supported?",
          answer: "SwasthaTrack supports the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience."
        },
        {
          question: "Is there a mobile app available?",
          answer: "Currently, SwasthaTrack is a web-based platform with responsive design that works well on mobile devices. A dedicated mobile app is planned for future releases."
        },
        {
          question: "How do I report a technical issue?",
          answer: "Contact our technical support team at support@swasthatrack.gov.in or call +91-11-2345-6789. For critical issues, use our 24/7 emergency hotline."
        }
      ]
    },
    {
      category: "Security & Privacy",
      questions: [
        {
          question: "How is my data protected?",
          answer: "We use end-to-end encryption, multi-factor authentication, and comply with ABDM security standards. All data is stored securely in compliance with national healthcare data protection policies."
        },
        {
          question: "Who can access my facility's data?",
          answer: "Access is strictly controlled through role-based permissions. Only authorized personnel from your facility and relevant healthcare authorities can access your data."
        },
        {
          question: "How long is data retained?",
          answer: "Data retention follows healthcare regulation requirements: active account data for duration of usage, transaction logs for 7 years, and audit trails as required by regulations."
        }
      ]
    },
    {
      category: "ABDM Integration",
      questions: [
        {
          question: "What is ABDM and how does it relate to SwasthaTrack?",
          answer: "Ayushman Bharat Digital Mission (ABDM) is India's digital health ecosystem. SwasthaTrack is integrated with ABDM to ensure seamless healthcare data exchange and compliance."
        },
        {
          question: "Do I need an ABHA ID to use SwasthaTrack?",
          answer: "Yes, an ABHA ID or institutional healthcare credentials are required for authentication and to ensure compliance with national digital health standards."
        },
        {
          question: "How does SwasthaTrack integrate with other ABDM services?",
          answer: "SwasthaTrack connects with the ABDM ecosystem for healthcare professional verification, facility registration, and secure health data exchange."
        }
      ]
    }
  ];

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      qa => 
        qa.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qa.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Frequently Asked Questions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find answers to common questions about SwasthaTrack
            </p>
            
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {filteredFAQ.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.category}</h2>
                <div className="space-y-4">
                  {category.questions.map((qa, index) => (
                    <Card key={index} className="card-healthcare">
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-900 flex items-start">
                          <HelpCircle className="w-5 h-5 mr-3 mt-0.5 text-blue-600 flex-shrink-0" />
                          {qa.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 leading-relaxed ml-8">{qa.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {searchTerm && filteredFAQ.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No matching questions found</h3>
              <p className="text-gray-500">Try different keywords or browse all categories above</p>
            </div>
          )}

          {/* Contact Support */}
          <Card className="card-healthcare">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Didn't find what you're looking for?
              </h3>
              <p className="text-gray-600 mb-6">
                Our support team is here to help you with any questions or issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/contact-us")}
                  className="btn-healthcare"
                >
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open("mailto:support@swasthatrack.gov.in")}
                >
                  Email Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;