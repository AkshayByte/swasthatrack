// M1 ABHA Verification Component
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, AlertCircle, Loader2, ArrowLeft, ArrowRight, Search, Phone } from 'lucide-react';
import { abhaVerificationService } from '@/services/abdm';
import { handleABDMError } from '@/utils';
import { validateABHANumber, validateMobileNumber, validateOTP, formatABHANumber } from '@/config/abdm.config';
import { toast } from 'sonner';

const M1ABHAVerification: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'verify' | 'search'>('verify');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [txnId, setTxnId] = useState('');
  
  // Verification form data
  const [verifyFormData, setVerifyFormData] = useState({
    abhaNumber: '',
    method: 'aadhaar' as 'aadhaar' | 'mobile',
    otp: ''
  });

  // Search form data
  const [searchFormData, setSearchFormData] = useState({
    mobileNumber: ''
  });

  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const steps = [
    { number: 1, title: 'ABHA Details', description: 'Enter ABHA number or search' },
    { number: 2, title: 'OTP Verification', description: 'Verify your identity' },
    { number: 3, title: 'Success', description: 'ABHA verified successfully' }
  ];

  // ABHA Verification Flow
  const handleVerificationRequest = async () => {
    if (!validateABHANumber(verifyFormData.abhaNumber)) {
      toast.error('Please enter a valid ABHA number (format: XX-XXXX-XXXX-XXXX)');
      return;
    }

    setLoading(true);
    try {
      const response = await abhaVerificationService.requestVerificationOTP({
        abhaNumber: verifyFormData.abhaNumber,
        method: verifyFormData.method
      });
      
      setTxnId(response.txnId);
      setStep(2);
      toast.success(`OTP sent via ${verifyFormData.method === 'aadhaar' ? 'Aadhaar' : 'Mobile'}`);
    } catch (error) {
      toast.error(handleABDMError(error).userMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (!validateOTP(verifyFormData.otp)) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await abhaVerificationService.verifyOTPAndGetProfile({
        txnId,
        otp: verifyFormData.otp
      });

      setVerificationResult(response);
      setStep(3);
      toast.success('ABHA verified successfully!');
    } catch (error) {
      toast.error(handleABDMError(error).userMessage);
    } finally {
      setLoading(false);
    }
  };

  // ABHA Search Flow
  const handleSearchByMobile = async () => {
    if (!validateMobileNumber(searchFormData.mobileNumber)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const response = await abhaVerificationService.findABHAByMobile({
        mobileNumber: searchFormData.mobileNumber
      });

      setSearchResults(response.accounts || []);
      if (response.accounts?.length === 0) {
        toast.info('No ABHA accounts found for this mobile number');
      } else {
        toast.success(`Found ${response.accounts.length} ABHA account(s)`);
      }
    } catch (error) {
      toast.error(handleABDMError(error).userMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectABHA = (abhaNumber: string) => {
    setVerifyFormData({ ...verifyFormData, abhaNumber });
    setMode('verify');
    setStep(1);
    toast.success('ABHA number selected. Now choose verification method.');
  };

  const renderModeSelector = () => (
    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
      <Button
        variant={mode === 'verify' ? 'default' : 'ghost'}
        onClick={() => setMode('verify')}
        className={`h-10 font-medium transition-all duration-200 ${
          mode === 'verify' 
            ? 'bg-white shadow-sm text-gray-900' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Verify ABHA
      </Button>
      <Button
        variant={mode === 'search' ? 'default' : 'ghost'}
        onClick={() => setMode('search')}
        className={`h-10 font-medium transition-all duration-200 ${
          mode === 'search' 
            ? 'bg-white shadow-sm text-gray-900' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Search ABHA
      </Button>
    </div>
  );

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((stepItem, index) => (
        <div key={stepItem.number} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
            ${step >= stepItem.number 
              ? 'bg-blue-600 border-blue-600 text-white' 
              : 'border-gray-300 text-gray-500'}`}>
            {step > stepItem.number ? <CheckCircle className="w-5 h-5" /> : stepItem.number}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-full h-0.5 mx-2 ${step > stepItem.number ? 'bg-blue-600' : 'bg-gray-300'}`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderSearchMode = () => (
    <div className="space-y-4">
      <div className="text-center">
        <Search className="w-12 h-12 mx-auto text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Find ABHA by Mobile Number</h3>
        <p className="text-sm text-gray-600">Enter your registered mobile number to find associated ABHA accounts</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Mobile Number</label>
        <Input
          placeholder="Enter 10-digit Mobile Number"
          value={searchFormData.mobileNumber}
          onChange={(e) => setSearchFormData({
            ...searchFormData, 
            mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10)
          })}
          maxLength={10}
          className="text-center tracking-wider"
        />
      </div>

      <Button 
        onClick={handleSearchByMobile} 
        disabled={loading || searchFormData.mobileNumber.length !== 10}
        className="w-full"
      >
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
        Search ABHA Accounts
      </Button>

      {searchResults.length > 0 && (
        <div className="space-y-3 mt-6">
          <h4 className="font-medium text-sm">Select an ABHA account to verify:</h4>
          {searchResults.map((account, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4" onClick={() => handleSelectABHA(account.abhaNumber)}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{account.name}</div>
                    <div className="text-sm text-gray-600">{account.abhaAddress}</div>
                  </div>
                  <Badge variant="secondary">{account.abhaNumber}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderVerifyStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">ABHA Number</label>
        <Input
          placeholder="Enter ABHA Number (XX-XXXX-XXXX-XXXX)"
          value={verifyFormData.abhaNumber}
          onChange={(e) => {
            const formatted = formatABHANumber(e.target.value);
            setVerifyFormData({...verifyFormData, abhaNumber: formatted});
          }}
          className="text-center tracking-wider"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Verification Method</label>
        <Select 
          value={verifyFormData.method} 
          onValueChange={(value: 'aadhaar' | 'mobile') => 
            setVerifyFormData({...verifyFormData, method: value})
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select OTP Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aadhaar">Aadhaar OTP</SelectItem>
            <SelectItem value="mobile">Mobile OTP</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500 mt-1">
          {verifyFormData.method === 'aadhaar' 
            ? 'OTP will be sent to your Aadhaar-linked mobile number'
            : 'OTP will be sent to your ABHA-registered mobile number'
          }
        </p>
      </div>

      <Button 
        onClick={handleVerificationRequest} 
        disabled={loading || !validateABHANumber(verifyFormData.abhaNumber)}
        className="w-full"
      >
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Request OTP
      </Button>
    </div>
  );

  const renderVerifyStep2 = () => (
    <div className="space-y-4">
      <div className="text-center">
        <Phone className="w-12 h-12 mx-auto text-blue-600 mb-4" />
        <p className="text-sm text-gray-600">
          OTP sent via {verifyFormData.method === 'aadhaar' ? 'Aadhaar' : 'Mobile'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Enter OTP</label>
        <Input
          placeholder="Enter 6-digit OTP"
          value={verifyFormData.otp}
          onChange={(e) => setVerifyFormData({
            ...verifyFormData, 
            otp: e.target.value.replace(/\D/g, '').slice(0, 6)
          })}
          maxLength={6}
          className="text-center tracking-wider text-lg"
        />
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleOTPVerification} 
          disabled={loading || verifyFormData.otp.length !== 6}
          className="flex-1"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Verify OTP
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderVerifyStep3 = () => (
    <div className="text-center space-y-4">
      <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
      <h3 className="text-xl font-semibold text-green-700">ABHA Verified Successfully!</h3>

      {verificationResult && (
        <div className="bg-green-50 p-4 rounded-lg space-y-2 text-left">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">ABHA Number:</span>
            <Badge variant="secondary" className="text-lg font-mono">
              {verificationResult.abhaNumber}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">ABHA Address:</span>
            <span className="text-sm">{verificationResult.abhaAddress}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Name:</span>
            <span className="text-sm">{verificationResult.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Mobile:</span>
            <span className="text-sm">{verificationResult.mobile}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Date of Birth:</span>
            <span className="text-sm">{verificationResult.dateOfBirth}</span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex-1">
          Go to Dashboard
        </Button>
        <Button onClick={() => navigate('/profile')} className="flex-1">
          View Profile
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            ABHA Verification
          </CardTitle>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
            M1 Integration
          </div>
          <p className="text-center text-sm text-gray-600 mt-3">
            {mode === 'search' ? 'Search for ABHA accounts' : `Step ${step} of ${steps.length}: ${steps[step - 1]?.description}`}
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          {renderModeSelector()}
          
          <div className="mt-6">
            {mode === 'search' ? (
              renderSearchMode()
            ) : (
              <>
                {renderStepIndicator()}
                <div className="mt-8">
                  {step === 1 && renderVerifyStep1()}
                  {step === 2 && renderVerifyStep2()}
                  {step === 3 && renderVerifyStep3()}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default M1ABHAVerification;