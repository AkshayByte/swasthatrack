// ABDM Session Service
// Handles ABDM API authentication and token management

import { 
  abdmConfig, 
  generateUUID, 
  getCurrentTimestamp, 
  SessionResponse, 
  MOCK_RESPONSES 
} from '../../config/abdm.config';

/**
 * ABDM Session Service
 * Manages ABDM API session tokens and authentication
 */
class ABDMSessionService {
  private accessToken: string = '';
  private expiresAt: number = 0;
  private refreshToken: string = '';

  /**
   * Generate a new session token from ABDM
   * @returns Promise<SessionResponse>
   */
  async generateSessionToken(): Promise<SessionResponse> {
    try {
      // Development mode - return mock response
      if (abdmConfig.developmentMode) {
        console.log('🔧 Development Mode: Using mock session token');
        const mockResponse = MOCK_RESPONSES.sessionToken;
        this.setAccessToken(mockResponse.accessToken, mockResponse.expiresIn);
        this.refreshToken = mockResponse.refreshToken;
        return mockResponse;
      }

      // Production mode - call ABDM API
      const payload = {
        clientId: abdmConfig.clientCredentials.clientId,
        clientSecret: abdmConfig.clientCredentials.clientSecret,
        grantType: 'client_credentials'
      };

      const headers = {
        'REQUEST-ID': generateUUID(),
        'TIMESTAMP': getCurrentTimestamp(),
        'X-CM-ID': abdmConfig.headers['X-CM-ID'],
        'Content-Type': abdmConfig.headers['Content-Type']
      };

      console.log('🔐 Generating ABDM session token...');
      
      const response = await fetch(`${abdmConfig.baseUrls.session}/hiecm/gateway/v3/sessions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Session creation failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: SessionResponse = await response.json();
      
      // Store token details
      this.setAccessToken(data.accessToken, data.expiresIn);
      this.refreshToken = data.refreshToken;
      
      console.log('✅ ABDM session token generated successfully');
      return data;
      
    } catch (error) {
      console.error('❌ Session token generation error:', error);
      throw new Error(`Failed to generate session token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get a valid access token, refreshing if necessary
   * @returns Promise<string>
   */
  async getValidAccessToken(): Promise<string> {
    // Check if current token is still valid
    if (this.accessToken && Date.now() < this.expiresAt) {
      return this.accessToken;
    }

    // Generate new token if expired or doesn't exist
    console.log('🔄 Access token expired or missing, generating new one...');
    const sessionData = await this.generateSessionToken();
    return sessionData.accessToken;
  }

  /**
   * Get current access token (may be expired)
   * @returns string
   */
  getAccessToken(): string {
    return this.accessToken;
  }

  /**
   * Get current refresh token
   * @returns string
   */
  getRefreshToken(): string {
    return this.refreshToken;
  }

  /**
   * Check if current token is expired
   * @returns boolean
   */
  isTokenExpired(): boolean {
    return Date.now() >= this.expiresAt;
  }

  /**
   * Get token expiry timestamp
   * @returns number
   */
  getTokenExpiry(): number {
    return this.expiresAt;
  }

  /**
   * Set access token and expiry
   * @param token - Access token
   * @param expiresIn - Expiry time in seconds
   */
  private setAccessToken(token: string, expiresIn: number): void {
    this.accessToken = token;
    // Set expiry with 30 second buffer to avoid edge cases
    this.expiresAt = Date.now() + ((expiresIn - 30) * 1000);
  }

  /**
   * Clear stored tokens
   */
  clearTokens(): void {
    this.accessToken = '';
    this.expiresAt = 0;
    this.refreshToken = '';
    console.log('🧹 ABDM session tokens cleared');
  }

  /**
   * Get ABDM request headers with authentication
   * @param includeAuth - Whether to include Authorization header
   * @returns Promise<Record<string, string>>
   */
  async getRequestHeaders(includeAuth: boolean = true): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'REQUEST-ID': generateUUID(),
      'TIMESTAMP': getCurrentTimestamp(),
      'X-CM-ID': abdmConfig.headers['X-CM-ID'],
      'Content-Type': abdmConfig.headers['Content-Type']
    };

    if (includeAuth) {
      const accessToken = await this.getValidAccessToken();
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return headers;
  }

  /**
   * Refresh session token using refresh token
   * @returns Promise<SessionResponse>
   */
  async refreshSessionToken(): Promise<SessionResponse> {
    try {
      if (abdmConfig.developmentMode) {
        console.log('🔧 Development Mode: Using mock token refresh');
        return await this.generateSessionToken();
      }

      if (!this.refreshToken) {
        throw new Error('No refresh token available');
      }

      const payload = {
        refreshToken: this.refreshToken,
        grantType: 'refresh_token'
      };

      const headers = {
        'REQUEST-ID': generateUUID(),
        'TIMESTAMP': getCurrentTimestamp(),
        'X-CM-ID': abdmConfig.headers['X-CM-ID'],
        'Content-Type': abdmConfig.headers['Content-Type']
      };

      console.log('🔄 Refreshing ABDM session token...');

      const response = await fetch(`${abdmConfig.baseUrls.session}/hiecm/gateway/v3/sessions/refresh`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        // If refresh fails, generate new token
        console.log('🔄 Refresh failed, generating new session token...');
        return await this.generateSessionToken();
      }

      const data: SessionResponse = await response.json();
      
      this.setAccessToken(data.accessToken, data.expiresIn);
      this.refreshToken = data.refreshToken;
      
      console.log('✅ ABDM session token refreshed successfully');
      return data;
      
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      // Fallback to generating new token
      return await this.generateSessionToken();
    }
  }

  /**
   * Get session status
   * @returns object with session details
   */
  getSessionStatus() {
    return {
      hasToken: !!this.accessToken,
      isExpired: this.isTokenExpired(),
      expiresAt: new Date(this.expiresAt).toISOString(),
      expiresIn: Math.max(0, Math.floor((this.expiresAt - Date.now()) / 1000))
    };
  }
}

// Export singleton instance
export const abdmSessionService = new ABDMSessionService();

// Export class for testing
export { ABDMSessionService };

export default abdmSessionService;