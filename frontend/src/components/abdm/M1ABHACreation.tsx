// M1 ABHA Creation Component
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { abhaCreationService } from '@/services/abdm';
import { handleABDMError } from '@/utils';
import { validateAadhaarNumber, validateMobileNumber, validateOTP } from '@/config/abdm.config';
import { toast } from 'sonner';

const M1ABHACreation: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    otp: '',
    mobile: '',
    consent: false
  });
  const [abhaResult, setAbhaResult] = useState<any>(null);

  const steps = [
    { number: 1, title: 'Aadhaar Details', description: 'Enter your Aadhaar number' },
    { number: 2, title: 'OTP Verification', description: 'Verify OTP sent to your mobile' },
    { number: 3, title: 'Mobile & Consent', description: 'Provide mobile and consent' },
    { number: 4, title: 'Success', description: 'ABHA created successfully' }
  ];

  const handleAadhaarSubmit = async () => {
    if (!validateAadhaarNumber(formData.aadhaarNumber)) {
      toast.error('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setLoading(true);
    try {
      const response = await abhaCreationService.generateAadhaarOTP({
        aadhaarNumber: formData.aadhaarNumber
      });
      
      setTxnId(response.txnId);
      setStep(2);
      toast.success('OTP sent to your registered mobile number');
    } catch (error) {
      toast.error(handleABDMError(error).userMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    if (!validateOTP(formData.otp)) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setStep(3); // Move to consent step before API call
    toast.success('OTP verified successfully');
  };

  const handleCreateABHA = async () => {
    if (!validateMobileNumber(formData.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!formData.consent) {
      toast.error('Please provide consent to create ABHA');
      return;
    }

    setLoading(true);
    try {
      const response = await abhaCreationService.createABHAByAadhaar({
        txnId,
        otp: formData.otp,
        mobile: formData.mobile
      });

      setAbhaResult(response);
      setStep(4);
      toast.success('ABHA created successfully!');
    } catch (error) {
      toast.error(handleABDMError(error).userMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {steps.map((stepItem, index) => (
        <React.Fragment key={stepItem.number}>
          <div className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
              ${step >= stepItem.number 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                : 'border-gray-300 text-gray-500 bg-white'}`}>
              {step > stepItem.number ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <span className="text-sm font-semibold">{stepItem.number}</span>
              )}
            </div>
            <span className={`text-xs mt-2 font-medium transition-colors duration-200 ${
              step >= stepItem.number ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {stepItem.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-4 mt-5 transition-colors duration-200 ${
              step > stepItem.number ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter Aadhaar Details</h3>
        <p className="text-sm text-gray-600">Your Aadhaar information is secured with end-to-end encryption</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number</label>
          <Input
            placeholder="Enter 12-digit Aadhaar Number"
            value={formData.aadhaarNumber}
            onChange={(e) => setFormData({...formData, aadhaarNumber: e.target.value.replace(/\D/g, '').slice(0, 12)})}
            maxLength={12}
            className="text-center tracking-wider text-lg h-12 border-2 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-2 flex items-center justify-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Secured with 256-bit encryption
          </p>
        </div>
        
        <Button 
          onClick={handleAadhaarSubmit} 
          disabled={loading || formData.aadhaarNumber.length !== 12}
          className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating OTP...
            </>
          ) : (
            <>
              Generate OTP
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify OTP</h3>
        <p className="text-sm text-gray-600">OTP sent to your registered mobile number</p>
        <p className="text-xs text-gray-500">XXXXXX1234</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
          <Input
            placeholder="Enter 6-digit OTP"
            value={formData.otp}
            onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/\D/g, '').slice(0, 6)})}
            maxLength={6}
            className="text-center tracking-wider text-2xl h-14 border-2 focus:border-green-500"
          />
          <p className="text-xs text-gray-500 mt-2 text-center">Didn't receive OTP? Check your messages</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={handleOTPSubmit} 
            disabled={formData.otp.length !== 6}
            className="flex-1 h-12 bg-green-600 hover:bg-green-700"
          >
            Verify OTP
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Mobile Number</label>
        <Input
          placeholder="Enter 10-digit Mobile Number"
          value={formData.mobile}
          onChange={(e) => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10)})}
          maxLength={10}
          className="text-center tracking-wider"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="consent"
            checked={formData.consent}
            onChange={(e) => setFormData({...formData, consent: e.target.checked})}
            className="mt-0.5"
          />
          <label htmlFor="consent" className="text-sm text-gray-700">
            I hereby give my consent to create ABHA number using my Aadhaar number for healthcare purposes.
          </label>
        </div>
        <p className="text-xs text-gray-500 ml-6">
          Your data will be used only for healthcare services and will be kept secure.
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleCreateABHA} 
          disabled={loading || !formData.mobile || !formData.consent}
          className="flex-1"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Create ABHA
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <div className="relative">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-green-700 mb-2">ABHA Created Successfully!</h3>
        <p className="text-gray-600">Your Ayushman Bharat Health Account is now ready to use</p>
      </div>
      
      {abhaResult && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">ABHA Number:</span>
              <Badge variant="secondary" className="text-lg font-mono px-3 py-1">
                {abhaResult.abhaNumber}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">ABHA Address:</span>
              <span className="text-sm font-medium text-blue-600">{abhaResult.abhaAddress}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Name:</span>
              <span className="text-sm font-semibold">{abhaResult.name}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex-1 h-12">
          Go to Dashboard
        </Button>
        <Button onClick={() => navigate('/profile')} className="flex-1 h-12 bg-blue-600 hover:bg-blue-700">
          View Profile
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            Create ABHA
          </CardTitle>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
            M1 Integration
          </div>
          <p className="text-center text-sm text-gray-600 mt-3">
            Step {step} of {steps.length}: {steps[step - 1]?.description}
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          {renderStepIndicator()}
          
          <div className="mt-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default M1ABHACreation;