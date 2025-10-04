import { useState } from "react";
import { motion } from "framer-motion";
import { 
  QrCode, 
  Download, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Copy,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ABHACardProps {
  abhaNumber: string;
  abhaAddress: string;
  name: string;
  profilePhoto?: string;
  qrCode?: string;
  isVerified: boolean;
  kycStatus: 'verified' | 'pending' | 'expired';
  className?: string;
  showActions?: boolean;
  compact?: boolean;
}

export const ABHACard: React.FC<ABHACardProps> = ({
  abhaNumber,
  abhaAddress,
  name,
  profilePhoto,
  qrCode,
  isVerified,
  kycStatus,
  className,
  showActions = true,
  compact = false,
}) => {
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();

  const handleDownload = () => {
    // TODO: Implement actual ABHA card download
    toast({
      title: "Download Started",
      description: "Your ABHA card is being downloaded",
    });
  };

  const handleCopyABHA = () => {
    navigator.clipboard.writeText(abhaNumber);
    toast({
      title: "Copied!",
      description: "ABHA number copied to clipboard",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My ABHA Card',
          text: `ABHA Number: ${abhaNumber}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      handleCopyABHA();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-soft overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="bg-gradient-primary p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Ayushman Bharat Health Account</h3>
              <p className="text-sm opacity-90">Government of India</p>
            </div>
          </div>
          <Badge
            variant={isVerified ? "secondary" : "destructive"}
            className="bg-white/20 text-white border-white/30"
          >
            {isVerified ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 mr-1" />
                Unverified
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Section */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={profilePhoto || '/default-avatar.png'}
                alt="Profile"
                className={cn(
                  "rounded-full object-cover border-4 border-primary/10",
                  compact ? "w-20 h-20" : "w-24 h-24"
                )}
              />
              <Badge
                variant={kycStatus === 'verified' ? "default" : "secondary"}
                className="absolute -bottom-1 -right-1 text-xs"
              >
                {kycStatus === 'verified' ? (
                  <CheckCircle className="w-2 h-2 mr-1" />
                ) : (
                  <AlertCircle className="w-2 h-2 mr-1" />
                )}
                {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="text-xl font-bold text-gray-900">{name}</h4>
              <p className="text-sm text-gray-600">Healthcare Professional</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  ABHA Number
                </p>
                <div className="flex items-center space-x-2">
                  <p className="font-mono font-semibold text-lg">{abhaNumber}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyABHA}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  ABHA Address
                </p>
                <p className="font-mono font-semibold text-lg">
                  {abhaAddress}@abdm
                </p>
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowQR(!showQR)}
                  className="text-xs"
                >
                  {showQR ? <EyeOff className="w-3 h-3 mr-1" /> : <QrCode className="w-3 h-3 mr-1" />}
                  {showQR ? 'Hide QR' : 'Show QR'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="text-xs"
                >
                  <Share2 className="w-3 h-3 mr-1" />
                  Share
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* QR Code Section */}
        {showQR && qrCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <div className="text-center">
              <div className="inline-block p-4 bg-white rounded-lg border">
                <img
                  src={qrCode}
                  alt="ABHA QR Code"
                  className="w-32 h-32"
                />
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Scan this QR code to access your ABHA
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Generated on {new Date().toLocaleDateString()}</span>
          <span>ABDM v1.0</span>
        </div>
      </div>
    </motion.div>
  );
};

