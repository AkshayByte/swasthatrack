# ABDM Integration Guide for SwasthaTrack Frontend

> **Note**: This document has been moved to the `docs/` directory as part of project reorganization.

## Overview

This document outlines the complete ABDM (Ayushman Bharat Digital Mission) integration implemented in the SwasthaTrack frontend application. The integration provides a seamless, secure, and user-friendly authentication system that complies with ABDM standards.

**Recent Updates (Latest):**
- Enhanced development tools for better debugging
- Fixed critical navigation routing issues (Settings dropdown now works correctly)
- Added comprehensive information pages (FAQ, About Us, Contact Us, Privacy Policy, Terms of Service)
- Updated all dependencies for improved performance and security
- Enhanced development tooling
- Enhanced footer navigation with proper React Router integration

## Key Features Implemented

### 1. Multi-Step Login Module
- **ABHA Number/Address Input**: Users can login using either their ABHA number or ABHA address
- **Verification Method Selection**: Support for Aadhaar OTP, Mobile OTP, and Password-based authentication
- **OTP Verification**: Secure 6-digit OTP input with auto-focus and resend functionality
- **Password Authentication**: Alternative login method for users with set passwords

### 2. Multi-Step ABHA Creation Module
- **Document Type Selection**: Choose between Aadhaar or Driving License (Driving License coming soon)
- **Aadhaar Number Input**: Secure 12-digit Aadhaar number input with privacy masking
- **Consent Management**: Mandatory consent checkbox with detailed information
- **OTP Verification**: Aadhaar OTP verification for account creation
- **ABHA Address Selection**: Choose from suggested addresses or create a custom one. The UI uses a `RadioGroup` for suggestions and gracefully falls back to a safe default list in development mode if the API returns none.
- **Success Screen**: Displays ABHA details and auto-redirects to the dashboard. Includes a manual "Go to Dashboard" button and a delayed fallback in case auto-navigation is blocked by the environment.

### 3. Enhanced Authentication Context
- **ABDM User Interface**: Complete user data structure with ABHA information
- **Token Management**: Access token and refresh token handling with 1200-second expiry
- **Session Management**: Automatic token refresh and session validation
- **Secure Storage**: Local storage with proper encryption and cleanup

### 4. Comprehensive Profile Management
- **ABHA Card Display**: Prominent visual component with QR code, photo, and verification status
- **Profile Actions Toolbar**: Complete profile management with photo, email, mobile, and KYC updates
- **Live Data Integration**: Real-time profile data fetching from ABDM APIs
- **Reusable Components**: ABHA Card component for use across the application

### 5. Enhanced Navigation and Information Pages
- **Fixed Navigation Issues**: Settings dropdown now properly routes to `/settings` instead of `/profile`
- **Comprehensive Information Hub**: FAQ, About Us, Contact Us, Privacy Policy, and Terms of Service pages
- **Footer Integration**: All information pages accessible from footer with proper React Router navigation
- **Consistent Design System**: All pages maintain SwasthaTrack's healthcare-themed aesthetic
- **Searchable FAQ**: Interactive FAQ system with 5 categories and search functionality

### 6. Development Tools Enhancement
- **Performance Monitoring**: Real-time HMR tracking and bundle optimization insights
- **Dependency Management**: Latest versions of all critical dependencies

## Technical Implementation

### Authentication Context (`AuthContext.tsx`)

The authentication context has been completely rewritten to support ABDM standards:

```typescript
interface ABDMUser {
  id: string;
  abhaNumber: string;
  abhaAddress: string;
  name: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  profilePhoto?: string;
  role: string;
  facility: string;
  isVerified: boolean;
}
```

#### Key Methods:
- `initiateLogin()`: Start the login process with ABHA identifier
- `verifyOTP()`: Verify OTP and complete authentication
- `loginWithPassword()`: Password-based authentication
- `initiateABHACreation()`: Start ABHA creation (returns `requestId` and address suggestions)
- `verifyAadhaarOTP()`: Verify Aadhaar OTP during registration (returns `abhaData` which includes `abhaAddresses`)
- `selectABHAAddress()`: Complete ABHA creation with address selection and finalize auth (sets tokens and user)

### Login Component (`Login.tsx`)

The login component now features a multi-step flow:

1. **Identifier Step**: Choose between ABHA number/address and verification method
2. **OTP Step**: Enter 6-digit OTP with resend functionality
3. **Password Step**: Alternative password-based authentication

#### Features:
- Step indicators for better UX
- Auto-focus OTP input
- Resend timer (30 seconds)
- Error handling and validation
- Smooth animations between steps

### Registration Component (`Register.tsx`)

The registration component implements a comprehensive ABHA creation wizard:

1. **Document Selection**: Choose Aadhaar or Driving License
2. **Aadhaar Input**: Enter 12-digit Aadhaar number
3. **Consent**: Provide mandatory consent with detailed information
4. **OTP Verification**: Verify Aadhaar with OTP
5. **Address Selection**: Choose or create ABHA address. Suggestions are interactive radios; custom input updates preview (`yourname@abdm`).
6. **Success**: Display ABHA info and auto-redirect with manual fallback.

#### Features:
- 6-step progress indicator
- Privacy-focused Aadhaar input
- Detailed consent information
- ABHA address suggestions with `RadioGroup` + custom entry, resilient even if API returns empty suggestions (dev fallback)
- Success screen with auto-redirect, manual navigation button, and timeout-based safety net

### OTP Input Component (`otp-input.tsx`)

A reusable OTP input component with enhanced UX:

- **Auto-focus**: Automatically focuses the next input
- **Keyboard Navigation**: Arrow keys and backspace support
- **Paste Support**: Paste OTP from clipboard
- **Visual Feedback**: Focus states and completion indicators
- **Accessibility**: Proper ARIA labels and keyboard support

### Profile Page (`Profile.tsx`)

A comprehensive ABHA management portal with:

- **ABHA Card Display**: Visual component with QR code, photo, and verification status
- **Profile Actions Toolbar**: Complete profile management functionality
- **Live Data Integration**: Real-time profile data fetching from ABDM APIs
- **Update Flows**: Photo, email, mobile, and KYC update processes with OTP verification

### ABHA Card Component (`ABHACard.tsx`)

A reusable component for displaying ABHA information:

- **Visual Design**: Professional card layout with ABDM branding
- **QR Code Integration**: Show/hide QR code functionality
- **Action Buttons**: Download, share, and copy ABHA number
- **Responsive Design**: Works on all device sizes
- **Compact Mode**: Smaller version for dashboard integration

## API Integration Points

### Login Endpoints
- `POST /api/abdm/auth/initiate-login`: Start login process
- `POST /api/abdm/auth/verify-otp`: Verify OTP
- `POST /api/abdm/auth/login-password`: Password authentication

### Registration Endpoints
- `POST /api/abdm/registration/initiate`: Start ABHA creation
- `POST /api/abdm/registration/verify-otp`: Verify Aadhaar OTP
- `POST /api/abdm/registration/select-address`: Complete ABHA creation

### Profile Management Endpoints
- `GET /api/abdm/profile/details`: Fetch user profile data
- `POST /api/abdm/profile/update-photo`: Update profile photo
- `POST /api/abdm/profile/update-email`: Update email address
- `POST /api/abdm/profile/update-mobile`: Update mobile number
- `POST /api/abdm/profile/verify-email-otp`: Verify email OTP
- `POST /api/abdm/profile/verify-mobile-otp`: Verify mobile OTP
- `POST /api/abdm/profile/initiate-kyc`: Initiate KYC process

### Token Management
- `POST /api/abdm/auth/refresh`: Refresh access token
- Automatic token refresh before expiry
- Secure token storage and cleanup

## Security Features

### Data Protection
- Aadhaar number masking for privacy
- Secure token storage with expiry management
- Automatic session cleanup on logout
- Input validation and sanitization

### User Experience
- Clear error messages and validation
- Loading states and progress indicators
- Responsive design for all devices
- Accessibility compliance

## Styling and UI Components

### Design System
- Consistent with existing SwasthaTrack design
- Healthcare-themed color scheme
- Modern, clean interface
- Smooth animations and transitions

### Components Used
- Custom OTP input component
- Step indicators
- Progress bars
- Toast notifications
- Modal dialogs
- Form validation

## Testing Considerations

### Unit Tests
- Authentication context methods
- Form validation logic
- OTP input component
- Error handling

### Integration Tests
- Complete login flow
- ABHA creation process
- Token refresh mechanism
- Error scenarios

### User Acceptance Tests
- End-to-end authentication flow
- Mobile responsiveness
- Accessibility compliance
- Performance testing

## Future Enhancements

### Planned Features
1. **Patient Check‑in Module**: Facility QR code + real-time feed using WebSocket (`/check-in` route)
2. **Driving License Support**: Complete driving license verification flow
3. **Biometric Authentication**: Fingerprint/face recognition support
4. **Offline Support**: Basic offline functionality
5. **Multi-language Support**: Regional language support
6. **Advanced Security**: Two-factor authentication options

### API Enhancements
1. **Real-time Notifications**: WebSocket integration for OTP delivery
2. **Analytics Integration**: User behavior tracking
3. **Audit Logging**: Comprehensive security audit trails
4. **Rate Limiting**: Enhanced security with rate limiting

## Deployment Considerations

### Environment Variables
```env
VITE_ABDM_API_BASE_URL=https://api.abdm.gov.in
VITE_ABDM_CLIENT_ID=your_client_id
VITE_ABDM_CLIENT_SECRET=your_client_secret
VITE_ABDM_REDIRECT_URI=your_redirect_uri
VITE_ENVIRONMENT=production
VITE_ENABLE_INSPECTOR=false
```

### Build Configuration
- **Vite 7.1.3**: Latest build tool with improved performance
- **Optimized bundle size**: Tree shaking and code splitting
- **Enhanced HMR**: Faster development with Hot Module Replacement
- **Component inspection**: Development-time analysis with vite-plugin-inspect
- **Asset optimization**: Compressed images and fonts
- **HTTPS enforcement**: Secure deployment requirements
- **Route-based splitting**: Automatic code splitting for better performance

## Troubleshooting

### Common Issues
1. **OTP Not Received**: Check mobile number and network connectivity
2. **Token Expiry**: Automatic refresh should handle this
3. **Aadhaar Verification Failed**: Ensure correct Aadhaar number
4. **Network Errors**: Implement retry mechanism


## Recent Updates and Improvements

### Navigation Fixes (Latest)
- **Settings Route Issue**: Fixed critical bug where Settings dropdown was navigating to Profile page
- **Footer Navigation**: Enhanced footer with proper React Router integration for all information pages
- **User Dropdown**: Profile, Settings, and Logout now work correctly

### New Information Pages
- **FAQ Page** (`/faq`): Searchable FAQ system with 5 categories (Getting Started, Platform Usage, Technical Support, Security & Privacy, ABDM Integration)
- **About Us Page** (`/about-us`): Organization information, mission, values, impact statistics, and timeline
- **Contact Us Page** (`/contact-us`): Contact forms with subject categories and support information
- **Privacy Policy** (`/privacy-policy`): Comprehensive data protection information
- **Terms of Service** (`/terms-of-service`): Complete platform usage terms and conditions

### Dependency Updates
- **Vite**: Upgraded to v7.1.3 for improved build performance
- **Lucide React**: Latest v0.541.0 with expanded icon library
- **Form Resolvers**: Updated to v5.2.1 for better validation
- **Development Tools**: Enhanced build tools
- **Multiple Dependencies**: Updated sonner, tailwind-merge, vaul, next-themes, and others

### Enhanced Development Experience
- **Component Analysis**: Real-time component transformation and dependency tracking
- **Performance Metrics**: Build optimization insights and HMR performance
- **Better Error Handling**: Enhanced error boundaries and debugging capabilities

## Support and Documentation

### Resources
- [ABDM Official Documentation](https://abdm.gov.in)
- [ABDM API Reference](https://docs.abdm.gov.in)
- [SwasthaTrack Frontend Overview](./FRONTEND_OUTLINE.md)
- [SwasthaTrack README](./README.md)

### Development Tools
- **React Developer Tools**: Browser extension for component debugging
- **Network Tab**: Monitor ABDM API calls in browser dev tools

### Contact
For technical support or questions about the ABDM integration:
- Email: support@swasthatrack.com
- Documentation: [Internal Wiki](https://wiki.swasthatrack.com)
- Development Issues: Check browser console and network tab

---

**Note**: This implementation follows ABDM guidelines and best practices. The recent updates enhance both developer experience and user interface. Regular updates and security audits are recommended to maintain compliance with evolving standards.

**Last Updated**: August 2025 - Latest version includes navigation fixes, new information pages, dependency updates, and enhanced development tools.

