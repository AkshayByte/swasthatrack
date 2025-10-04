import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  const navigate = useNavigate();

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
              <FileText className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Terms of Service</span>
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
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Please read these terms carefully before using the SwasthaTrack platform
            </p>
          </div>

          {/* Terms Sections */}
          <div className="grid gap-6">
            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  By accessing or using SwasthaTrack, you agree to be bound by these Terms of Service 
                  and all applicable laws and regulations. If you do not agree with any of these terms, 
                  you are prohibited from using this platform.
                </p>
              </CardContent>
            </Card>

            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle>Platform Purpose & Scope</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  SwasthaTrack is designed exclusively for:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Pharmaceutical supply chain management in healthcare facilities</li>
                  <li>Medicine inventory tracking and quality assurance</li>
                  <li>Integration with the Ayushman Bharat Digital Mission ecosystem</li>
                  <li>Regulatory compliance and reporting</li>
                  <li>Supporting public healthcare delivery</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle>User Eligibility & Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  To use SwasthaTrack, you must:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Be a registered healthcare professional or authorized facility representative</li>
                  <li>Have a valid ABHA ID or institutional healthcare credentials</li>
                  <li>Be at least 18 years of age</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Acceptable Use
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">You agree to use the platform only for:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Legitimate healthcare and pharmaceutical supply chain activities</li>
                  <li>Accurate data entry and record keeping</li>
                  <li>Compliance with applicable healthcare regulations</li>
                  <li>Authorized access within your role and facility</li>
                  <li>Professional and ethical conduct</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <XCircle className="w-5 h-5 mr-2 text-red-600" />
                  Prohibited Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">You are strictly prohibited from:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Falsifying or manipulating medicine or inventory data</li>
                  <li>Sharing access credentials or allowing unauthorized access</li>
                  <li>Using the platform for commercial or non-healthcare purposes</li>
                  <li>Attempting to hack, disrupt, or compromise system security</li>
                  <li>Violating patient privacy or data protection laws</li>
                  <li>Engaging in any illegal or fraudulent activities</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle>Data Accuracy & Responsibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  You are responsible for:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Ensuring all data entered is accurate and up-to-date</li>
                  <li>Promptly reporting any data discrepancies or errors</li>
                  <li>Following established protocols for medicine handling</li>
                  <li>Maintaining proper documentation and audit trails</li>
                  <li>Complying with facility-specific policies and procedures</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
                  Platform Availability & Limitations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  While we strive for continuous availability:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>The platform may be temporarily unavailable for maintenance</li>
                  <li>We do not guarantee 100% uptime or error-free operation</li>
                  <li>Emergency situations should follow established offline protocols</li>
                  <li>System performance may vary based on network conditions</li>
                  <li>Features may be updated or modified without prior notice</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle>Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  The SwasthaTrack platform, including all software, designs, and content, is owned by 
                  the Government of India and protected by intellectual property laws. Users are granted 
                  a limited license to access and use the platform for authorized healthcare purposes only.
                </p>
              </CardContent>
            </Card>

            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle>Termination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We reserve the right to suspend or terminate access for:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Violation of these terms of service</li>
                  <li>Suspected fraudulent or unauthorized activity</li>
                  <li>Failure to maintain required credentials or authorizations</li>
                  <li>Extended inactivity or abandonment of account</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle>Governing Law & Dispute Resolution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  These terms are governed by the laws of India. Any disputes shall be resolved through:
                </p>
                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                  <li>Direct communication and good faith negotiation</li>
                  <li>Mediation through appropriate healthcare authorities</li>
                  <li>Legal proceedings in courts of New Delhi, India</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle>Contact & Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  For questions about these terms or platform support:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">SwasthaTrack Support Team</p>
                  <p>Email: support@swasthatrack.gov.in</p>
                  <p>Phone: +91-11-2345-6789</p>
                  <p>Hours: Monday-Friday, 9:00 AM - 6:00 PM IST</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              Last updated: January 2024 | These terms are effective immediately upon posting
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;