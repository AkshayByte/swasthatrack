import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we've finished loading and the user is not authenticated
    if (!isLoading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      // Redirect to login if not authenticated
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-white mb-2">SwasthaTrack</h2>
          <p className="text-white/80">Checking authentication...</p>
        </motion.div>
      </div>
    );
  }

  // Don't render children if not authenticated
  // This is a fallback in case the useEffect redirect hasn't happened yet
  if (!isAuthenticated) {
    console.log('Not authenticated in ProtectedRoute render, returning null');
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;





