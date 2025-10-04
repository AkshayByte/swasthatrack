import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Lock, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
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
              <Shield className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Privacy Policy</span>
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
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your privacy and data security are our top priorities in the SwasthaTrack ecosystem
            </p>
          </div>

          {/* Privacy Sections */}
          <div className="grid gap-6">
            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We collect information necessary for pharmaceutical supply chain management and healthcare delivery:
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">Personal Information:</h4>
                    <ul className="list-disc list-inside text-gray-600 ml-4">
                      <li>ABHA ID and healthcare professional credentials</li>
                      <li>Contact information (name, email, phone number)</li>
                      <li>Professional qualification and role information</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Operational Data:</h4>
                    <ul className="list-disc list-inside text-gray-600 ml-4">
                      <li>Medicine inventory and batch information</li>
                      <li>Facility and location data</li>
                      <li>Transaction and movement logs</li>
                      <li>System usage and access patterns</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Your information is used exclusively for legitimate healthcare and supply chain purposes:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Tracking and managing pharmaceutical inventory</li>
                  <li>Ensuring medicine quality and preventing counterfeiting</li>
                  <li>Facilitating healthcare delivery and patient care</li>
                  <li>Generating reports for regulatory compliance</li>
                  <li>Improving system performance and user experience</li>
                  <li>Communicating important alerts and updates</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Data Protection & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We implement industry-leading security measures to protect your data:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>End-to-end encryption for all data transmissions</li>
                  <li>Multi-factor authentication and role-based access control</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Secure cloud infrastructure with backup and disaster recovery</li>
                  <li>Compliance with ABDM security standards</li>
                  <li>Data anonymization for analytics and reporting</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle>Data Sharing & Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We share information only when necessary and authorized:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>With ABDM ecosystem partners for integrated healthcare delivery</li>
                  <li>With healthcare facilities involved in your supply chain</li>
                  <li>With regulatory authorities as required by law</li>
                  <li>With service providers under strict confidentiality agreements</li>
                  <li>In emergency situations to protect public health</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  We never sell or commercialize your personal information.
                </p>
              </CardContent>
            </Card>

            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle>Your Rights & Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Access and review your personal data</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Control communication preferences</li>
                  <li>Request data portability within ABDM ecosystem</li>
                  <li>Report privacy concerns to our Data Protection Officer</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle>Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We retain your information for as long as necessary to fulfill the purposes outlined in this policy:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Active account data: Duration of system usage</li>
                  <li>Transaction logs: 7 years for regulatory compliance</li>
                  <li>Audit trails: As required by healthcare regulations</li>
                  <li>Anonymized analytics: Indefinitely for system improvement</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  For privacy-related questions or concerns, contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">Data Protection Officer</p>
                  <p>Email: privacy@swasthatrack.gov.in</p>
                  <p>Phone: +91-11-2345-6789</p>
                  <p>Address: National Health Authority, New Delhi, India</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              Last updated: January 2024 | Effective Date: January 1, 2024
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;