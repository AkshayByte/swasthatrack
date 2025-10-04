import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, RefreshCcw, Copy } from 'lucide-react';

type FacilityQRCodeProps = {
  hipId: string;
  counterCode: string;
  size?: number;
  onRegenerateCounter?: () => void;
};

export const FacilityQRCode = ({ hipId, counterCode, size = 220, onRegenerateCounter }: FacilityQRCodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Minimal payload that reception scanners and patient PHR apps can understand.
  // Adjust this to match your backend/PHR contract.
  const payload = useMemo(() => {
    return JSON.stringify({ hipId, counterCode });
  }, [hipId, counterCode]);

  const handleDownload = () => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `facility-qr-${hipId}-${counterCode}.png`;
    link.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(payload);
    } catch {}
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Facility QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <QRCodeCanvas
              value={payload}
              size={size}
              includeMargin
              level="H"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ref={canvasRef as any}
            />
          </div>
          
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
              <span className="text-sm font-medium">HIP ID:</span>
              <span className="text-sm font-mono text-muted-foreground">{hipId}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
              <span className="text-sm font-medium">Counter:</span>
              <span className="text-sm font-mono text-muted-foreground">{counterCode}</span>
            </div>
          </div>
          
          <div className="w-full space-y-2">
            <Button onClick={handleDownload} className="w-full h-9">
              <Download className="w-4 h-4 mr-2" /> Download QR
            </Button>
            <Button variant="secondary" onClick={handleCopy} className="w-full h-9">
              <Copy className="w-4 h-4 mr-2" /> Copy Payload
            </Button>
            {onRegenerateCounter && (
              <Button variant="outline" onClick={onRegenerateCounter} className="w-full h-9">
                <RefreshCcw className="w-4 h-4 mr-2" /> New Counter
              </Button>
            )}
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Ask patients to scan this QR using their PHR app and approve share to check in.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacilityQRCode;