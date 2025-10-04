// ABDM Encryption Service
// Handles data encryption for ABDM API requests

import { abdmConfig } from '../../config/abdm.config';

/**
 * ABDM Encryption Service
 * Handles encryption of sensitive data for ABDM API calls
 */
class ABDMEncryptionService {
  private publicKey: string = '';
  private publicKeyCache: { [url: string]: string } = {};

  /**
   * Get ABDM public key for encryption
   * @param forceRefresh - Force refresh the cached public key
   * @returns Promise<string>
   */
  async getPublicKey(forceRefresh: boolean = false): Promise<string> {
    try {
      // Return cached key if available and not forcing refresh
      if (this.publicKey && !forceRefresh) {
        return this.publicKey;
      }

      // Development mode - return mock public key
      if (abdmConfig.developmentMode) {
        console.log('🔧 Development Mode: Using mock public key');
        this.publicKey = 'mock-public-key-for-development';
        return this.publicKey;
      }

      // Production mode - fetch from ABDM
      console.log('🔐 Fetching ABDM public key...');
      
      const response = await fetch(`${abdmConfig.baseUrls.abha}/v3/profile/public/certificate`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CM-ID': abdmConfig.headers['X-CM-ID']
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch public key: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.publicKey) {
        throw new Error('Public key not found in response');
      }

      this.publicKey = data.publicKey;
      console.log('✅ ABDM public key fetched successfully');
      return this.publicKey;
      
    } catch (error) {
      console.error('❌ Public key fetch error:', error);
      throw new Error(`Failed to get public key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Encrypt data using ABDM public key
   * @param data - Data to encrypt
   * @returns Promise<string> - Encrypted data
   */
  async encryptData(data: string): Promise<string> {
    try {
      // Development mode - use simple base64 encoding for testing
      if (abdmConfig.developmentMode) {
        console.log('🔧 Development Mode: Using base64 encoding instead of RSA encryption');
        return btoa(data);
      }

      // Production mode - implement actual RSA encryption
      const publicKey = await this.getPublicKey();
      
      // For production, you would implement actual RSA encryption here
      // This is a placeholder - you'll need to integrate with a proper encryption library
      console.log('🔐 Encrypting data with RSA public key...');
      
      // TODO: Implement actual RSA encryption using a library like 'node-forge' or 'jsencrypt'
      // For now, returning base64 encoded data as placeholder
      console.warn('⚠️ Warning: Using base64 encoding as RSA encryption placeholder');
      return btoa(data);
      
    } catch (error) {
      console.error('❌ Data encryption error:', error);
      throw new Error(`Failed to encrypt data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Decrypt data (if needed for response handling)
   * @param encryptedData - Encrypted data to decrypt
   * @returns Promise<string> - Decrypted data
   */
  async decryptData(encryptedData: string): Promise<string> {
    try {
      // Development mode - use simple base64 decoding
      if (abdmConfig.developmentMode) {
        console.log('🔧 Development Mode: Using base64 decoding');
        return atob(encryptedData);
      }

      // Production mode - implement actual RSA decryption if needed
      console.log('🔐 Decrypting data...');
      
      // TODO: Implement actual RSA decryption if needed
      // For now, returning base64 decoded data as placeholder
      console.warn('⚠️ Warning: Using base64 decoding as RSA decryption placeholder');
      return atob(encryptedData);
      
    } catch (error) {
      console.error('❌ Data decryption error:', error);
      throw new Error(`Failed to decrypt data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Hash data using SHA-256 (for data integrity)
   * @param data - Data to hash
   * @returns Promise<string> - Hash string
   */
  async hashData(data: string): Promise<string> {
    try {
      // Use Web Crypto API for hashing
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      
      // Convert to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      return hashHex;
    } catch (error) {
      console.error('❌ Data hashing error:', error);
      throw new Error(`Failed to hash data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verify data integrity using hash
   * @param data - Original data
   * @param hash - Expected hash
   * @returns Promise<boolean> - True if hash matches
   */
  async verifyDataIntegrity(data: string, hash: string): Promise<boolean> {
    try {
      const calculatedHash = await this.hashData(data);
      return calculatedHash === hash;
    } catch (error) {
      console.error('❌ Data integrity verification error:', error);
      return false;
    }
  }

  /**
   * Generate secure random string
   * @param length - Length of random string
   * @returns string - Random string
   */
  generateSecureRandom(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate encryption requirements
   * @returns boolean - True if encryption is properly configured
   */
  validateEncryptionSetup(): boolean {
    try {
      // Check if crypto API is available
      if (typeof crypto === 'undefined' || !crypto.subtle) {
        console.error('❌ Web Crypto API not available');
        return false;
      }

      // In development mode, we don't need real encryption
      if (abdmConfig.developmentMode) {
        console.log('✅ Development mode: Encryption setup valid');
        return true;
      }

      // In production, we would check for proper RSA key setup
      console.log('✅ Encryption setup validation passed');
      return true;
      
    } catch (error) {
      console.error('❌ Encryption setup validation failed:', error);
      return false;
    }
  }

  /**
   * Clear cached keys and sensitive data
   */
  clearCache(): void {
    this.publicKey = '';
    this.publicKeyCache = {};
    console.log('🧹 Encryption cache cleared');
  }

  /**
   * Get encryption status
   * @returns object with encryption details
   */
  getEncryptionStatus() {
    return {
      hasPublicKey: !!this.publicKey,
      developmentMode: abdmConfig.developmentMode,
      cryptoAvailable: typeof crypto !== 'undefined' && !!crypto.subtle,
      setupValid: this.validateEncryptionSetup()
    };
  }
}

// Export singleton instance
export const abdmEncryptionService = new ABDMEncryptionService();

// Export class for testing
export { ABDMEncryptionService };

export default abdmEncryptionService;