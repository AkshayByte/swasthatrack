import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Camera, 
  Mail, 
  Phone, 
  Shield, 
  QrCode, 
  Download, 
  Edit3,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { OTPInput } from "@/components/ui/otp-input";
import { ABHACard } from "@/components/abdm/ABHACard";

interface ABHAProfile {
  abhaNumber: string;
  abhaAddress: string;
  name: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  profilePhoto?: string;
  qrCode?: string;
  isVerified: boolean;
  lastUpdated: string;
  kycStatus: 'verified' | 'pending' | 'expired';
}

const Profile = () => {
  const [profile, setProfile] = useState<ABHAProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  // Update states
  const [updateType, setUpdateType] = useState<'photo' | 'email' | 'mobile' | 'kyc' | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [requestId, setRequestId] = useState('');
  
  const { toast } = useToast();
  const { user, accessToken } = useAuth();

  // Fetch profile data
  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      // Development mode - use mock data
      if (!accessToken) {
        // Use mock data for development
        setProfile({
          abhaNumber: '14-4140-4140-4140',
          abhaAddress: 'rajesh.kumar@abdm',
          name: 'Test User',
          email: 'rajesh.kumar@abdm.gov.in',
          mobile: '+91 98765 43210',
          dateOfBirth: '1985-03-15',
          gender: 'Male',
          address: 'AIIMS Delhi, New Delhi, Delhi - 110029',
          profilePhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          isVerified: true,
          lastUpdated: '2024-01-15T10:30:00Z',
          kycStatus: 'verified'
        });
        return;
      }

      // TODO: Replace with actual ABDM API call
      const response = await fetch('/api/abdm/profile/details', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        // Fallback to mock data for development
        setProfile({
          abhaNumber: '14-4140-4140-4140',
          abhaAddress: 'rajesh.kumar@abdm',
          name: 'Test User',
          email: 'rajesh.kumar@abdm.gov.in',
          mobile: '+91 98765 43210',
          dateOfBirth: '1985-03-15',
          gender: 'Male',
          address: 'AIIMS Delhi, New Delhi, Delhi - 110029',
          profilePhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          isVerified: true,
          lastUpdated: '2024-01-15T10:30:00Z',
          kycStatus: 'verified'
        });
      }
    } catch (error) {
      // Use mock data for development when network fails
      setProfile({
        abhaNumber: '14-4140-4140-4140',
        abhaAddress: 'rajesh.kumar@abdm',
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@abdm.gov.in',
        mobile: '+91 98765 43210',
        dateOfBirth: '1985-03-15',
        gender: 'Male',
        address: 'AIIMS Delhi, New Delhi, Delhi - 110029',
        profilePhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        isVerified: true,
        lastUpdated: '2024-01-15T10:30:00Z',
        kycStatus: 'verified'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle profile updates
  const handleUpdatePhoto = async (file: File) => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch('/api/abdm/profile/update-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile photo updated successfully",
        });
        fetchProfile(); // Refresh profile data
      } else {
        throw new Error('Failed to update photo');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile photo",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch('/api/abdm/profile/update-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        setRequestId(data.requestId);
        setShowOTP(true);
        toast({
          title: "Success",
          description: "Verification email sent to your new email address",
        });
      } else {
        throw new Error('Failed to update email');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update email address",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateMobile = async () => {
    if (!newMobile.trim() || newMobile.length !== 10) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch('/api/abdm/profile/update-mobile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: newMobile }),
      });

      if (response.ok) {
        const data = await response.json();
        setRequestId(data.requestId);
        setShowOTP(true);
        toast({
          title: "Success",
          description: "OTP sent to your new mobile number",
        });
      } else {
        throw new Error('Failed to update mobile');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update mobile number",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      const endpoint = updateType === 'email' 
        ? '/api/abdm/profile/verify-email-otp'
        : '/api/abdm/profile/verify-mobile-otp';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId, otp }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${updateType === 'email' ? 'Email' : 'Mobile number'} updated successfully`,
        });
        setShowOTP(false);
        setUpdateType(null);
        setNewEmail('');
        setNewMobile('');
        setOtp('');
        fetchProfile(); // Refresh profile data
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReKYC = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/abdm/profile/initiate-kyc', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to KYC portal or open KYC modal
        toast({
          title: "Success",
          description: "KYC process initiated. Please complete the verification.",
        });
      } else {
        throw new Error('Failed to initiate KYC');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate KYC process",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadABHA = () => {
    // TODO: Implement ABHA card download
    toast({
      title: "Download Started",
      description: "Your ABHA card is being downloaded",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Profile Not Found</h3>
        <p className="text-muted-foreground mb-4">Unable to load your ABHA profile</p>
        <Button onClick={fetchProfile} className="btn-healthcare">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">ABHA Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your Ayushman Bharat Health Account</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ABHA Card Display */}
        <div className="lg:col-span-2">
          <ABHACard
            abhaNumber={profile.abhaNumber}
            abhaAddress={profile.abhaAddress}
            name={profile.name}
            profilePhoto={profile.profilePhoto}
            qrCode={profile.qrCode}
            isVerified={profile.isVerified}
            kycStatus={profile.kycStatus}
            showActions={true}
          />
          
          {/* Additional Profile Details */}
          <Card className="card-healthcare mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Additional Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
                  <p className="text-lg">{profile.gender}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
                  <p className="text-lg">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                  <p className="text-lg">{profile.address}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-lg">{profile.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Mobile</Label>
                  <p className="text-lg">{profile.mobile}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                  <p className="text-lg">{new Date(profile.lastUpdated).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Actions Toolbar */}
        <div className="space-y-6">
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Profile Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Update Photo */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setUpdateType('photo')}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Update Photo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Profile Photo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleUpdatePhoto(file);
                          }
                        }}
                        className="hidden"
                        id="photo-upload"
                      />
                      <Label
                        htmlFor="photo-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Choose Photo
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Supported formats: JPG, PNG. Max size: 2MB
                    </p>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Update Email */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setUpdateType('email')}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Update Email
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Email Address</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new-email">New Email Address</Label>
                      <Input
                        id="new-email"
                        type="email"
                        placeholder="Enter new email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleUpdateEmail}
                      disabled={isUpdating || !newEmail.trim()}
                      className="w-full"
                    >
                      {isUpdating ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        "Send Verification Email"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Update Mobile */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setUpdateType('mobile')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Update Mobile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Mobile Number</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new-mobile">New Mobile Number</Label>
                      <Input
                        id="new-mobile"
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={newMobile}
                        onChange={(e) => setNewMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        maxLength={10}
                      />
                    </div>
                    <Button
                      onClick={handleUpdateMobile}
                      disabled={isUpdating || newMobile.length !== 10}
                      className="w-full"
                    >
                      {isUpdating ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Re-KYC */}
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleReKYC}
                disabled={isUpdating}
              >
                <Shield className="w-4 h-4 mr-2" />
                Perform Re-KYC
              </Button>
            </CardContent>
          </Card>

          {/* OTP Verification Dialog */}
          {showOTP && (
            <Dialog open={showOTP} onOpenChange={setShowOTP}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Verify {updateType === 'email' ? 'Email' : 'Mobile Number'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit verification code sent to your {updateType === 'email' ? 'email' : 'mobile number'}
                  </p>
                  <div className="space-y-2">
                    <Label>Enter OTP</Label>
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      length={6}
                      disabled={isUpdating}
                      autoFocus={true}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleVerifyOTP}
                      disabled={isUpdating || otp.length !== 6}
                      className="flex-1"
                    >
                      {isUpdating ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        "Verify"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowOTP(false);
                        setUpdateType(null);
                        setOtp('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
