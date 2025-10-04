import { useState, useEffect } from "react"; // Import useEffect
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, Smartphone, User, Lock, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OTPInput } from "@/components/ui/otp-input";

type LoginStep = 'identifier' | 'otp' | 'password';

const Login = () => {
  const [currentStep, setCurrentStep] = useState<LoginStep>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [identifierType, setIdentifierType] = useState<'abha_number' | 'abha_address'>('abha_number');
  const [verificationMethod, setVerificationMethod] = useState<'aadhaar_otp' | 'mobile_otp' | 'password'>('mobile_otp');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [requestId, setRequestId] = useState('');
  const [maskedMobile, setMaskedMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  // Destructure isAuthenticated from useAuth
  const { initiateLogin, verifyOTP, loginWithPassword, isAuthenticated } = useAuth();

  // AuthLayout now handles redirection for authenticated users
  // ---------------------------------------------

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

  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      toast({ title: "Error", description: "Please enter your ABHA Number or ABHA Address", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const result = await initiateLogin({ [identifierType]: identifier, verificationMethod });
      
      if (result.success) {
        setRequestId(result.requestId || '');
        setMaskedMobile(result.maskedMobile || '');
        setCurrentStep(verificationMethod === 'password' ? 'password' : 'otp');
        if (verificationMethod !== 'password') startResendTimer();
        toast({ title: "Success", description: result.message });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 6) {
      toast({ title: "Error", description: "Please enter a valid 6-digit OTP", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOTP(requestId, otp);
      
      if (result.success) {
        toast({ title: "Login Successful", description: "Redirecting to dashboard..." });
        // REMOVED: No more manual navigation here. The useEffect will handle it.
        // setTimeout(() => navigate("/dashboard"), 100);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast({ title: "Error", description: "Please enter your password", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginWithPassword(identifier, password);
      
      if (result.success) {
        toast({ title: "Login Successful", description: "Redirecting to dashboard..." });
        // REMOVED: No more manual navigation here. The useEffect will handle it.
        // setTimeout(() => navigate("/dashboard"), 100);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // ... (rest of the Login.tsx component remains the same)
  // handleResendOTP, goBack, and all render functions are unchanged.
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    try {
      const request = {
        [identifierType]: identifier,
        verificationMethod: verificationMethod
      };

      const result = await initiateLogin(request);
      
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

  const goBack = () => {
    if (currentStep === 'otp' || currentStep === 'password') {
      setCurrentStep('identifier');
      setOtp('');
      setPassword('');
      setRequestId('');
      setMaskedMobile('');
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      <div className={`w-3 h-3 rounded-full ${currentStep === 'identifier' ? 'bg-primary' : 'bg-gray-300'}`} />
      <div className={`w-3 h-3 rounded-full ${currentStep === 'otp' || currentStep === 'password' ? 'bg-primary' : 'bg-gray-300'}`} />
    </div>
  );

  const renderIdentifierStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Login Method</Label>
          <RadioGroup
            value={identifierType}
            onValueChange={(value: 'abha_number' | 'abha_address') => setIdentifierType(value)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="abha_number" id="abha_number" />
              <Label htmlFor="abha_number" className="text-sm">ABHA Number</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="abha_address" id="abha_address" />
              <Label htmlFor="abha_address" className="text-sm">ABHA Address</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="identifier">
            {identifierType === 'abha_number' ? 'ABHA Number' : 'ABHA Address'}
          </Label>
          <Input
            id="identifier"
            type="text"
            placeholder={identifierType === 'abha_number' ? '14-4140-4140-4140' : 'user@abdm'}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label>Verification Method</Label>
          <Select value={verificationMethod} onValueChange={(value: 'aadhaar_otp' | 'mobile_otp' | 'password') => setVerificationMethod(value)}>
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mobile_otp">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile OTP</span>
                </div>
              </SelectItem>
              <SelectItem value="aadhaar_otp">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Aadhaar OTP</span>
                </div>
              </SelectItem>
              <SelectItem value="password">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Password</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11 btn-healthcare"
        disabled={isLoading || !identifier.trim()}
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
          <Smartphone className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Enter OTP</h3>
        <p className="text-sm text-muted-foreground">
          We've sent a 6-digit code to {maskedMobile}
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
            "Verify & Login"
          )}
        </Button>
      </form>
    </motion.div>
  );

  const renderPasswordStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Enter Password</h3>
        <p className="text-sm text-muted-foreground">
          Please enter your ABHA password
        </p>
      </div>

      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 btn-healthcare"
          disabled={isLoading || !password.trim()}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-hero">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute top-6 left-6 z-10"
      >
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-white hover:bg-white/10 h-10 px-3"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/95 backdrop-blur-md border-0 shadow-strong">
          <CardHeader className="text-center space-y-4 pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto"
            >
              <Heart className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold text-gradient-primary">
                SwasthaTrack
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Healthcare Authority Portal
              </p>
              <p className="text-xs text-muted-foreground">
                Ayushman Bharat Digital Mission
              </p>
            </div>
          </CardHeader>

          <CardContent>
            {renderStepIndicator()}
            
            <form onSubmit={currentStep === 'identifier' ? handleIdentifierSubmit : undefined}>
              <AnimatePresence mode="wait">
                {currentStep === 'identifier' && renderIdentifierStep()}
                {currentStep === 'otp' && renderOTPStep()}
                {currentStep === 'password' && renderPasswordStep()}
              </AnimatePresence>
            </form>

            {(currentStep === 'otp' || currentStep === 'password') && (
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

            <div className="mt-8 text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">or</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => navigate("/register")}
                className="w-full h-11"
              >
                Create New ABHA Account
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Authorized personnel only. All access is monitored and logged.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;