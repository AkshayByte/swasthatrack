import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ContactUs = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert("Thank you for your message. Our team will respond within 24 hours.");
  };

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
              <Mail className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Contact Us</span>
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
          className="space-y-8"
        >
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get in touch with our team for support, questions, or feedback about SwasthaTrack
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" required />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" />
                  </div>
                  
                  <div>
                    <Label htmlFor="organization">Organization/Facility</Label>
                    <Input id="organization" />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="account">Account Issues</SelectItem>
                        <SelectItem value="training">Training & Onboarding</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="compliance">Compliance Questions</SelectItem>
                        <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message" 
                      rows={5} 
                      placeholder="Please describe your inquiry in detail..."
                      required 
                    />
                  </div>
                  
                  <Button type="submit" className="btn-healthcare w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="card-healthcare">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Technical Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>+91-11-2345-6789</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>support@swasthatrack.gov.in</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>24/7 for Critical Issues</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-healthcare">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    General Inquiries
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>info@swasthatrack.gov.in</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Mon-Fri, 9:00 AM - 6:00 PM IST</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-healthcare">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Office Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-gray-600">
                    <p className="font-semibold">National Health Authority</p>
                    <p>9th Floor, Tower-L, Jeevan Bharati Building</p>
                    <p>Connaught Place, New Delhi - 110001</p>
                    <p>India</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-healthcare">
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-red-800 font-semibold">For Critical System Issues:</p>
                    <p className="text-red-700">Emergency Hotline: +91-11-1234-5678</p>
                    <p className="text-red-700">Available 24/7</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">How do I reset my password?</h4>
                  <p className="text-gray-600 text-sm">
                    Use the "Forgot Password" link on the login page or contact our support team.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">What browsers are supported?</h4>
                  <p className="text-gray-600 text-sm">
                    Chrome, Firefox, Safari, and Edge (latest versions recommended).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">How do I report a bug?</h4>
                  <p className="text-gray-600 text-sm">
                    Use the contact form above with "Technical Support" as the subject.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Is there mobile app support?</h4>
                  <p className="text-gray-600 text-sm">
                    Currently web-based only, but mobile-responsive design is supported.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;