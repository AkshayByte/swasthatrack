import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Only redirect if user is already authenticated and we're not in the middle of registration
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check if we're on the register page - if so, let the Register component handle navigation
      const isRegisterPage = window.location.pathname === '/register';
      if (!isRegisterPage) {
        console.log('User already authenticated, redirecting from auth page to dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        console.log('User authenticated on register page, letting Register component handle navigation');
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Don't render anything while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;