// ABDM Error Handler Utility
import { ABDM_ERROR_CODES } from '../config/abdm.config';

export interface ABDMError {
  code?: string;
  message: string;
  details?: any;
  timestamp?: string;
}

export interface ErrorResponse {
  userMessage: string;
  technicalMessage: string;
  shouldRetry: boolean;
  category: 'validation' | 'authentication' | 'network' | 'server' | 'unknown';
}

/**
 * Handle ABDM API errors and return user-friendly messages
 */
export class ABDMErrorHandler {
  /**
   * Process ABDM error and return structured response
   */
  static handleError(error: any): ErrorResponse {
    // Extract error details
    const abdmError = this.extractErrorDetails(error);
    
    // Map to user-friendly message
    const userMessage = this.mapErrorToUserMessage(abdmError);
    
    // Determine error category and retry logic
    const category = this.categorizeError(abdmError);
    const shouldRetry = this.shouldRetryError(abdmError);
    
    return {
      userMessage,
      technicalMessage: abdmError.message,
      shouldRetry,
      category
    };
  }

  /**
   * Extract error details from various error formats
   */
  private static extractErrorDetails(error: any): ABDMError {
    // Handle different error formats
    if (error?.response?.data) {
      return {
        code: error.response.data.code,
        message: error.response.data.message || error.message,
        details: error.response.data,
        timestamp: new Date().toISOString()
      };
    }
    
    if (error?.error) {
      return {
        code: error.error.code,
        message: error.error.message || error.message,
        details: error.error,
        timestamp: new Date().toISOString()
      };
    }
    
    return {
      message: error.message || 'Unknown error occurred',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Map ABDM error codes to user-friendly messages
   */
  private static mapErrorToUserMessage(error: ABDMError): string {
    if (error.code && ABDM_ERROR_CODES[error.code]) {
      return ABDM_ERROR_CODES[error.code];
    }

    // Handle common error patterns
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('connection')) {
      return 'Network connection issue. Please check your internet and try again.';
    }
    
    if (message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    
    if (message.includes('invalid otp')) {
      return 'Invalid OTP. Please check and enter the correct OTP.';
    }
    
    if (message.includes('expired')) {
      return 'OTP has expired. Please request a new OTP.';
    }
    
    if (message.includes('too many attempts')) {
      return 'Too many attempts. Please try again after some time.';
    }
    
    return error.message || 'An unexpected error occurred. Please try again.';
  }

  /**
   * Categorize error type
   */
  private static categorizeError(error: ABDMError): ErrorResponse['category'] {
    if (!error.code) return 'unknown';
    
    // Validation errors
    if (['ABDM-1013', 'ABDM-1014', 'ABDM-1015', 'ABDM-1016', 'ABDM-1102', 'ABDM-1104', 'ABDM-1105', 'ABDM-1109'].includes(error.code)) {
      return 'validation';
    }
    
    // Authentication errors  
    if (['ABDM-1100', 'ABDM-1102', 'ABDM-1103', 'ABDM-1107'].includes(error.code)) {
      return 'authentication';
    }
    
    // Server errors
    if (['ABDM-1001', 'ABDM-1101', 'ABDM-1108'].includes(error.code)) {
      return 'server';
    }
    
    return 'unknown';
  }

  /**
   * Determine if error should trigger a retry
   */
  private static shouldRetryError(error: ABDMError): boolean {
    if (!error.code) return false;
    
    // Don't retry validation or permanent errors
    const noRetryErrors = ['ABDM-1013', 'ABDM-1014', 'ABDM-1100', 'ABDM-1101', 'ABDM-1102', 'ABDM-1107'];
    
    return !noRetryErrors.includes(error.code);
  }

  /**
   * Format error for logging
   */
  static formatErrorForLogging(error: any): string {
    const abdmError = this.extractErrorDetails(error);
    return `[ABDM Error] Code: ${abdmError.code || 'N/A'} | Message: ${abdmError.message} | Timestamp: ${abdmError.timestamp}`;
  }

  /**
   * Check if error indicates rate limiting
   */
  static isRateLimitError(error: any): boolean {
    const abdmError = this.extractErrorDetails(error);
    return abdmError.code === 'ABDM-1100' || abdmError.message.toLowerCase().includes('too many attempts');
  }

  /**
   * Get retry delay based on error type (in milliseconds)
   */
  static getRetryDelay(error: any): number {
    if (this.isRateLimitError(error)) {
      return 30 * 60 * 1000; // 30 minutes for rate limit
    }
    
    return 5000; // 5 seconds for other retryable errors
  }
}

/**
 * Convenience function for handling ABDM errors
 */
export const handleABDMError = (error: any): ErrorResponse => {
  return ABDMErrorHandler.handleError(error);
};

/**
 * Show user-friendly error message (for use with toast notifications)
 */
export const showABDMError = (error: any): string => {
  const errorResponse = handleABDMError(error);
  console.error(ABDMErrorHandler.formatErrorForLogging(error));
  return errorResponse.userMessage;
};

export default ABDMErrorHandler;