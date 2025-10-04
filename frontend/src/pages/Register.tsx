import { useState, useEffect, useRef } from "react"; // Import useEffect and useRef
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, UserPlus, CheckCircle, Download, ArrowRight, RotateCcw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { OTPInput } from "@/components/ui/otp-input";

type RegistrationStep = 'document' | 'aadhaar' | 'consent' | 'otp' | 'abha_address' | 'success';

const Register = () => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('document');
  const [documentType, setDocumentType] = useState<'aadhaar' | 'driving_license'>('aadhaar');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [consent, setConsent] = useState(false);
  const [otp, setOtp] = useState('');
  const [requestId, setRequestId] = useState('');
  const [abhaAddresses, setAbhaAddresses] = useState<string[]>([]);
  const [selectedAbhaAddress, setSelectedAbhaAddress] = useState('');
  const [customAbhaAddress, setCustomAbhaAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [abhaData, setAbhaData] = useState<any>(null);
  const [showManualNavigation, setShowManualNavigation] = useState(false);
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  const currentStepRef = useRef(currentStep);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { initiateABHACreation, verifyAadhaarOTP, selectABHAAddress, isAuthenticated } = useAuth();

  // Single navigation effect that handles all cases
  useEffect(() => {
    // Only handle navigation if registration is completed
    if (registrationCompleted && isAuthenticated && currentStep === 'success') {
      console.log('Registration completed and authenticated, starting navigation countdown');
      
      // Show success for 2 seconds, then navigate
      const timer = setTimeout(() => {
        console.log('Navigating to dashboard');
        navigate("/dashboard", { replace: true });
      }, 2000);
      
      // Fallback navigation after 5 seconds
      const fallbackTimer = setTimeout(() => {
        console.log('Fallback navigation to dashboard');
        navigate("/dashboard", { replace: true });
      }, 5000);
      
      // Show manual navigation option after 7 seconds
      const manualTimer = setTimeout(() => {
        console.log('Showing manual navigation option');
        setShowManualNavigation(true);
      }, 7000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(fallbackTimer);
        clearTimeout(manualTimer);
      };
    }
  }, [registrationCompleted, isAuthenticated, currentStep, navigate]);

  // Fallback: If we're stuck in success step without registration being completed, force it
  useEffect(() => {
    if (currentStep === 'success' && isAuthenticated && !registrationCompleted) {
      const timeout = setTimeout(() => {
        console.log('Forcing registration completion due to timeout');
        setRegistrationCompleted(true);
      }, 3000); // 3-second timeout
      
      return () => clearTimeout(timeout);
    }
  }, [currentStep, isAuthenticated, registrationCompleted]);

  // Update ref when currentStep changes
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  // Debug logging
  useEffect(() => {
    console.log('Register state:', { 
      currentStep, 
      isAuthenticated, 
      registrationCompleted,
      isLoading,
      abhaAddresses: abhaAddresses.length,
      selectedAbhaAddress,
      customAbhaAddress
    });
  }, [currentStep, isAuthenticated, registrationCompleted, isLoading, abhaAddresses, selectedAbhaAddress, customAbhaAddress]);

  const handleABHAAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAddress = selectedAbhaAddress || customAbhaAddress;
    
    if (!finalAddress.trim()) {
      toast({ title: "Error", description: "Please select or enter an ABHA address", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Submitting ABHA address selection...');
      const result = await selectABHAAddress(requestId, finalAddress);
      
      if (result.success) {
        console.log('ABHA creation successful, setting success step');
        setAbhaData(result.authData?.user);
        setCurrentStep('success');
        
        // Add a small delay to ensure state updates are processed
        setTimeout(() => {
          setRegistrationCompleted(true); // Mark registration as completed
          console.log('Registration marked as completed');
        }, 100);
        
        toast({ title: "Success", description: result.message });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      console.error('ABHA address selection error:', error);
      toast({ title: "Error", description: "An error occurred. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const renderSuccessStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 text-center"
    >
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-green-600">ABHA Created Successfully!</h3>
        <p className="text-sm text-muted-foreground">
          {registrationCompleted 
            ? "You will be automatically redirected to your dashboard in 2 seconds."
            : "Setting up your account..."
          }
        </p>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">ABHA Number:</span>
          <span className="font-mono text-sm">{abhaData?.abhaNumber || 'Loading...'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">ABHA Address:</span>
          <span className="font-mono text-sm">{abhaData?.abhaAddress || 'Loading...'}</span>
        </div>
      </div>

      <div className="space-y-3">
        {registrationCompleted ? (
          <>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
              />
              <span>Redirecting to dashboard...</span>
            </div>
            
            <Button
              onClick={() => navigate("/dashboard", { replace: true })}
              className="w-full h-11 btn-healthcare"
            >
              Go to Dashboard Now
            </Button>
            
            {showManualNavigation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <p className="text-sm text-yellow-800 text-center">
                  Automatic navigation seems to be taking longer than expected. 
                  Please click the button above to proceed to your dashboard.
                </p>
              </motion.div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
            />
            <span>Completing registration...</span>
          </div>
        )}
      </div>
    </motion.div>
  );

  // ... (rest of the Register.tsx component remains the same)
  // All other handlers and render functions are unchanged.
    // Handle resend timer
  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (documentType === 'aadhaar') {
      setCurrentStep('aadhaar');
    } else {
      // TODO: Implement driving license flow
      toast({
        title: "Coming Soon",
        description: "Driving license verification will be available soon",
        variant: "destructive"
      });
    }
  };

  const handleAadhaarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aadhaarNumber.trim() || aadhaarNumber.length !== 12) {
      toast({
        title: "Error",
        description: "Please enter a valid 12-digit Aadhaar number",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep('consent');
  };

  const handleConsentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      toast({
        title: "Error",
        description: "You must provide consent to proceed with ABHA creation",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await initiateABHACreation(aadhaarNumber, consent);
      
      if (result.success) {
        setRequestId(result.requestId || '');
        setAbhaAddresses(result.abhaAddresses || []);
        setCurrentStep('otp');
        startResendTimer();
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Submitting OTP with requestId:', requestId, 'and OTP:', otp);
      const result = await verifyAadhaarOTP(requestId, otp);
      console.log('OTP verification result:', result);
      
      if (result.success) {
        console.log('OTP verification successful, setting abhaData:', result.abhaData);
        setAbhaData(result.abhaData);
        // Update abhaAddresses from the response
        if (result.abhaData?.abhaAddresses) {
          console.log('Setting abhaAddresses:', result.abhaData.abhaAddresses);
          setAbhaAddresses(result.abhaData.abhaAddresses);
        } else {
          console.log('No abhaAddresses in response, using fallback addresses');
          // Fallback addresses in case the API doesn't return any
          setAbhaAddresses(['user@abdm', 'user123@abdm', 'user.health@abdm']);
        }
        console.log('Moving to abha_address step');
        setCurrentStep('abha_address');
        toast({
          title: "Success",
          description: result.message,
        });
        
        // Fallback: If we're still not on the abha_address step after 1 second, force it
        setTimeout(() => {
          if (currentStepRef.current !== 'abha_address') {
            console.log('Forcing transition to abha_address step');
            setCurrentStep('abha_address');
          }
        }, 1000);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    try {
      const result = await initiateABHACreation(aadhaarNumber, consent);
      
      if (result.success) {
        setRequestId(result.requestId || '');
        startResendTimer();
        toast({
          title: "Success",
          description: "OTP resent successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCard = () => {
    // TODO: Implement ABHA card download
    toast({
      title: "Download Started",
      description: "Your ABHA card is being downloaded",
    });
  };

  const goBack = () => {
    if (currentStep === 'consent') {
      setCurrentStep('aadhaar');
    } else if (currentStep === 'otp') {
      setCurrentStep('consent');
      setOtp('');
      setRequestId('');
    } else if (currentStep === 'abha_address') {
      setCurrentStep('otp');
      setSelectedAbhaAddress('');
      setCustomAbhaAddress('');
    } else if (currentStep === 'aadhaar') {
      setCurrentStep('document');
      setAadhaarNumber('');
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      <div className={`w-3 h-3 rounded-full ${currentStep === 'document' ? 'bg-primary' : 'bg-gray-300'}`} />
      <div className={`w-3 h-3 rounded-full ${currentStep === 'aadhaar' ? 'bg-primary' : 'bg-gray-300'}`} />
      <div className={`w-3 h-3 rounded-full ${currentStep === 'consent' ? 'bg-primary' : 'bg-gray-300'}`} />
      <div className={`w-3 h-3 rounded-full ${currentStep === 'otp' ? 'bg-primary' : 'bg-gray-300'}`} />
      <div className={`w-3 h-3 rounded-full ${currentStep === 'abha_address' ? 'bg-primary' : 'bg-gray-300'}`} />
      <div className={`w-3 h-3 rounded-full ${currentStep === 'success' ? 'bg-primary' : 'bg-gray-300'}`} />
    </div>
  );

  const renderDocumentStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <UserPlus className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Choose Document Type</h3>
        <p className="text-sm text-muted-foreground">
          Select the document you want to use for ABHA creation
        </p>
      </div>

      <form onSubmit={handleDocumentSubmit} className="space-y-6">
        <div className="space-y-4">
          <RadioGroup
            value={documentType}
            onValueChange={(value: 'aadhaar' | 'driving_license') => setDocumentType(value)}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="aadhaar" id="aadhaar" />
              <div className="flex-1">
                <Label htmlFor="aadhaar" className="text-base font-medium cursor-pointer">
                  Aadhaar Number
                </Label>
                <p className="text-sm text-muted-foreground">
                  Use your 12-digit Aadhaar number for verification
                </p>
              </div>
              <Badge variant="secondary">Recommended</Badge>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer opacity-60">
              <RadioGroupItem value="driving_license" id="driving_license" disabled />
              <div className="flex-1">
                <Label htmlFor="driving_license" className="text-base font-medium cursor-pointer">
                  Driving License
                </Label>
                <p className="text-sm text-muted-foreground">
                  Use your driving license for verification
                </p>
              </div>
              <Badge variant="outline">Coming Soon</Badge>
            </div>
          </RadioGroup>
        </div>

        <Button
          type="submit"
          className="w-full h-11 btn-healthcare"
          disabled={isLoading}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );

  const renderAadhaarStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <User className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Enter Aadhaar Number</h3>
        <p className="text-sm text-muted-foreground">
          Please enter your 12-digit Aadhaar number
        </p>
      </div>

      <form onSubmit={handleAadhaarSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="aadhaar">Aadhaar Number</Label>
          <Input
            id="aadhaar"
            type="text"
            placeholder="1234 5678 9012"
            value={aadhaarNumber}
            onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
            maxLength={12}
            required
            className="h-11 text-center text-lg tracking-widest"
          />
          <p className="text-xs text-muted-foreground text-center">
            Your Aadhaar number will be masked for privacy
          </p>
        </div>

        <Button
          type="submit"
          className="w-full h-11 btn-healthcare"
          disabled={isLoading || aadhaarNumber.length !== 12}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );

  const renderConsentStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Provide Consent</h3>
        <p className="text-sm text-muted-foreground">
          Read and accept the terms to proceed
        </p>
      </div>

      <form onSubmit={handleConsentSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <h4 className="font-medium">Important Information</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Your Aadhaar number will be used for ABHA creation</li>
              <li>• An OTP will be sent to your registered mobile number</li>
              <li>• Your personal information will be handled securely</li>
              <li>• You can revoke consent at any time</li>
            </ul>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked as boolean)}
            />
            <Label htmlFor="consent" className="text-sm leading-relaxed">
              I consent to the use of my Aadhaar number for ABHA creation and agree to the{" "}
              <Button variant="link" className="text-sm p-0 h-auto">
                Terms of Service
              </Button>{" "}
              and{" "}
              <Button variant="link" className="text-sm p-0 h-auto">
                Privacy Policy
              </Button>
              .
            </Label>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 btn-healthcare"
          disabled={isLoading || !consent}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              Send OTP
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );

  const renderOTPStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <User className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Verify Aadhaar</h3>
        <p className="text-sm text-muted-foreground">
          Enter the OTP sent to your registered mobile number
        </p>
      </div>

      <form onSubmit={handleOTPSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Enter OTP</Label>
          <OTPInput
            value={otp}
            onChange={setOtp}
            length={6}
            disabled={isLoading}
            autoFocus={true}
          />
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleResendOTP}
            disabled={resendTimer > 0 || isLoading}
            className="text-sm"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full h-11 btn-healthcare"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            "Verify OTP"
          )}
        </Button>
      </form>
    </motion.div>
  );

  const renderABHAAddressStep = () => {
    console.log('Rendering ABHA address step with addresses:', abhaAddresses);
    
    try {
      return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Choose ABHA Address</h3>
          <p className="text-sm text-muted-foreground">
            Select from suggestions or create a custom address
          </p>
        </div>

        <form onSubmit={handleABHAAddressSubmit} className="space-y-6">
          <div className="space-y-4">
            {abhaAddresses.length > 0 ? (
              <div className="space-y-2">
                <Label>Suggested ABHA Addresses</Label>
                <RadioGroup
                  value={selectedAbhaAddress}
                  onValueChange={(value) => {
                    setSelectedAbhaAddress(value);
                    setCustomAbhaAddress('');
                  }}
                  className="space-y-2"
                >
                  {abhaAddresses.map((address, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedAbhaAddress === address
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedAbhaAddress(address);
                        setCustomAbhaAddress('');
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={address} id={`address-${index}`} />
                        <span className="font-mono text-sm">{address}@abdm</span>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 text-center">
                  No suggested addresses available. Please create a custom address below.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="customAddress">Or Create Custom Address</Label>
              <Input
                id="customAddress"
                type="text"
                placeholder="yourname"
                value={customAbhaAddress}
                onChange={(e) => {
                  setCustomAbhaAddress(e.target.value);
                  setSelectedAbhaAddress('');
                }}
                className="h-11"
              />
              {customAbhaAddress && (
                <p className="text-sm text-muted-foreground">
                  Your ABHA address will be: <span className="font-mono">{customAbhaAddress}@abdm</span>
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 btn-healthcare"
            disabled={isLoading || (!selectedAbhaAddress && !customAbhaAddress.trim())}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              "Create ABHA"
            )}
          </Button>
        </form>
      </motion.div>
      );
    } catch (error) {
      console.error('Error rendering ABHA address step:', error);
      return (
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <UserPlus className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-600">Error Loading Addresses</h3>
          <p className="text-sm text-muted-foreground">
            There was an error loading the ABHA addresses. Please try refreshing the page.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="w-full h-11 btn-healthcare"
          >
            Refresh Page
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-hero">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute top-6 left-6 z-10"
      >
        <Button
          variant="ghost"
          onClick={() => navigate("/login")}
          className="text-white hover:bg-white/10 h-10 px-3"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="bg-white/95 backdrop-blur-md border-0 shadow-strong">
          <CardHeader className="text-center space-y-4 pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto"
            >
              <UserPlus className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold text-gradient-primary">
                Create ABHA Account
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Ayushman Bharat Health Account
              </p>
              <p className="text-xs text-muted-foreground">
                Ayushman Bharat Digital Mission
              </p>
            </div>
          </CardHeader>

          <CardContent>
            {renderStepIndicator()}
            
            <AnimatePresence mode="wait">
              {currentStep === 'document' && renderDocumentStep()}
              {currentStep === 'aadhaar' && renderAadhaarStep()}
              {currentStep === 'consent' && renderConsentStep()}
              {currentStep === 'otp' && renderOTPStep()}
              {currentStep === 'abha_address' && renderABHAAddressStep()}
              {currentStep === 'success' && renderSuccessStep()}
              {!['document', 'aadhaar', 'consent', 'otp', 'abha_address', 'success'].includes(currentStep) && (
                <div className="space-y-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <UserPlus className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-red-600">Invalid Step</h3>
                  <p className="text-sm text-muted-foreground">
                    An error occurred. Please try refreshing the page.
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="w-full h-11 btn-healthcare"
                  >
                    Refresh Page
                  </Button>
                </div>
              )}
            </AnimatePresence>
            


            {/* Back button for multi-step flow */}
            {currentStep !== 'document' && currentStep !== 'success' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={goBack}
                  className="w-full text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </motion.div>
            )}

            {currentStep === 'document' && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an ABHA account?{" "}
                  <Button
                    variant="link"
                    onClick={() => navigate("/login")}
                    className="text-sm p-0 h-auto font-semibold"
                  >
                    Sign In
                  </Button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;