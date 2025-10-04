// ABDM ABHA Verification Service - M1 Integration
import { abdmSessionService } from './sessionService';
import { abdmEncryptionService } from './encryptionService';
import { 
  abdmConfig,
  ABHAVerificationRequest,
  ABHAVerificationOTPResponse,
  ABHAOTPVerificationRequest,
  ABHAProfileResponse,
  ABHASearchRequest,
  ABHASearchResponse,
  MOCK_RESPONSES 
} from '../../config/abdm.config';

class ABHAVerificationService {
  private async getHeaders(): Promise<HeadersInit> {
    return await abdmSessionService.getRequestHeaders(true);
  }

  // Step 1: Request OTP for ABHA Verification
  async requestVerificationOTP(request: ABHAVerificationRequest): Promise<ABHAVerificationOTPResponse> {
    try {
      if (abdmConfig.developmentMode) {
        console.log('🔧 Development Mode: Mock ABHA verification OTP');
        return MOCK_RESPONSES.abhaVerification;
      }

      const encryptedABHA = await abdmEncryptionService.encryptData(request.abhaNumber);
      
      const payload = {
        scope: 'abha-login',
        loginHint: 'abha-number',
        loginId: encryptedABHA,
        otpSystem: request.method === 'aadhaar' ? 'aadhaar' : 'abdm'
      };

      const response = await fetch(`${abdmConfig.baseUrls.abha}/v3/profile/login/request/otp`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'OTP request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ ABHA verification OTP request error:', error);
      throw error;
    }
  }

  // Step 2: Verify OTP and Get ABHA Profile
  async verifyOTPAndGetProfile(request: ABHAOTPVerificationRequest): Promise<ABHAProfileResponse> {
    try {
      if (abdmConfig.developmentMode) {
        console.log('🔧 Development Mode: Mock ABHA profile verification');
        return MOCK_RESPONSES.abhaProfile;
      }

      const encryptedOTP = await abdmEncryptionService.encryptData(request.otp);
      
      const payload = {
        scope: 'abha-login',
        authData: {
          authMethods: ['otp'],
          otp: {
            txnId: request.txnId,
            otpValue: encryptedOTP
          }
        }
      };

      const response = await fetch(`${abdmConfig.baseUrls.abha}/v3/profile/login/verify`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'OTP verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ ABHA OTP verification error:', error);
      throw error;
    }
  }

  // Find ABHA using Mobile Number
  async findABHAByMobile(request: ABHASearchRequest): Promise<ABHASearchResponse> {
    try {
      if (abdmConfig.developmentMode) {
        console.log('🔧 Development Mode: Mock ABHA search');
        return MOCK_RESPONSES.abhaSearch;
      }

      const encryptedMobile = await abdmEncryptionService.encryptData(request.mobileNumber);
      
      const payload = {
        scope: 'search-abha',
        mobile: encryptedMobile
      };

      const response = await fetch(`${abdmConfig.baseUrls.abha}/v3/profile/account/abha/search`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'ABHA search failed');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ ABHA search error:', error);
      throw error;
    }
  }

  // Quick verification method combining request and verify
  async quickVerifyABHA(abhaNumber: string, method: 'aadhaar' | 'mobile'): Promise<{ txnId: string; message: string }> {
    const otpResponse = await this.requestVerificationOTP({ abhaNumber, method });
    return {
      txnId: otpResponse.txnId,
      message: otpResponse.message
    };
  }
}

export const abhaVerificationService = new ABHAVerificationService();
export { ABHAVerificationService };
export default abhaVerificationService;