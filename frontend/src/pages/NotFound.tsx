import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useRoleHome } from '@/hooks/useRoleHome';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const roleHome = useRoleHome();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-2">Oops! Page not found</p>
        <p className="text-sm text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(roleHome)}>
          <Home className="mr-2 h-4 w-4" />
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
