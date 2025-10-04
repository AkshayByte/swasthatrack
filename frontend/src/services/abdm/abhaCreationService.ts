// ABDM ABHA Creation Service - M1 Integration
import { abdmSessionService } from './sessionService';
import { abdmEncryptionService } from './encryptionService';
import { 
  abdmConfig, 
  AadhaarOTPRequest, 
  AadhaarOTPResponse,
  ABHACreationRequest, 
  ABHACreationResponse,
  DemoAuthRequest,
  MOCK_RESPONSES 
} from '../../config/abdm.config';

class ABHACreationService {
  private async getHeaders(): Promise<HeadersInit> {
    return await abdmSessionService.getRequestHeaders(true);
  }

  // Step 1: Generate Aadhaar OTP for ABHA Creation
  async generateAadhaarOTP(request: AadhaarOTPRequest): Promise<AadhaarOTPResponse> {
    try {
      if (abdmConfig.developmentMode) {
        console.log('🔧 Development Mode: Mock Aadhaar OTP generation');
        return MOCK_RESPONSES.aadhaarOTP;
      }

      const encryptedAadhaar = await abdmEncryptionService.encryptData(request.aadhaarNumber);
      
      const payload = {
        scope: 'abha-enrol',
        loginHint: 'aadhaar',
        loginId: encryptedAadhaar,
        otpSystem: 'aadhaar'
      };

      const response = await fetch(`${abdmConfig.baseUrls.abha}/v3/enrollment/request/otp`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate Aadhaar OTP');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Aadhaar OTP generation error:', error);
      throw error;
    }
  }

  // Step 2: Create ABHA using Aadhaar OTP
  async createABHAByAadhaar(request: ABHACreationRequest): Promise<ABHACreationResponse> {
    try {
      if (abdmConfig.developmentMode) {
        console.log('🔧 Development Mode: Mock ABHA creation');
        return MOCK_RESPONSES.abhaCreation;
      }

      const encryptedOTP = await abdmEncryptionService.encryptData(request.otp);
      
      const payload = {
        authData: {
          authMethods: ['otp'],
          otp: {
            txnId: request.txnId,
            otpValue: encryptedOTP
          }
        },
        mobile: request.mobile,
        consent: {
          code: 'abha-enrollment',
          version: '1.4'
        }
      };

      const response = await fetch(`${abdmConfig.baseUrls.abha}/v3/enrollment/enrol/byAadhaar`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'ABHA creation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ ABHA creation error:', error);
      throw error;
    }
  }

  // Demo Auth ABHA Creation
  async createABHAByDemoAuth(request: DemoAuthRequest): Promise<ABHACreationResponse> {
    try {
      if (abdmConfig.developmentMode) {
        console.log('🔧 Development Mode: Mock Demo Auth ABHA creation');
        return { ...MOCK_RESPONSES.abhaCreation, name: request.name };
      }

      const encryptedAadhaar = await abdmEncryptionService.encryptData(request.aadhaarNumber);
      
      const payload = {
        authData: {
          authMethods: ['demographics'],
          demographics: {
            aadhaar: encryptedAadhaar,
            name: request.name,
            dob: request.dob,
            gender: request.gender,
            stateCode: request.stateCode,
            districtCode: request.districtCode
          }
        },
        mobile: request.mobile,
        consent: {
          code: 'abha-enrollment',
          version: '1.4'
        }
      };

      const response = await fetch(`${abdmConfig.baseUrls.abha}/v3/enrollment/enrol/byAadhaar`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Demo Auth ABHA creation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Demo Auth ABHA creation error:', error);
      throw error;
    }
  }
}

export const abhaCreationService = new ABHACreationService();
export { ABHACreationService };
export default abhaCreationService;