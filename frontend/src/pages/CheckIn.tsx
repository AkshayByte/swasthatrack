import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FacilityQRCode from '@/components/FacilityQRCode';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

type CheckInEvent = {
  id: string;
  name: string;
  abhaNumber: string;
  timestamp: number;
};

const WS_URL = import.meta.env.VITE_CHECKIN_WS_URL || '';

const CheckIn = () => {
  const hipId = 'HIP-001';
  const [counterCode, setCounterCode] = useState<string>(() => String(Math.floor(Math.random() * 9000) + 1000));
  const [events, setEvents] = useState<CheckInEvent[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const wsUrl = useMemo(() => {
    if (!WS_URL) return '';
    try {
      const url = new URL(WS_URL);
      url.searchParams.set('hipId', hipId);
      url.searchParams.set('counter', counterCode);
      return url.toString();
    } catch (error) {
      console.error('Invalid WebSocket URL:', error);
      return '';
    }
  }, [hipId, counterCode]);

  // Establish WebSocket to receive real-time check-in events
  useEffect(() => {
    if (!wsUrl) return;
    
    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => setIsConnected(true);
      ws.onclose = () => setIsConnected(false);
      ws.onerror = () => setIsConnected(false);
      ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data);
          if (data && data.id && data.abhaNumber) {
            setEvents((prev) => [{ 
              id: data.id, 
              name: data.name, 
              abhaNumber: data.abhaNumber, 
              timestamp: data.timestamp || Date.now() 
            }, ...prev].slice(0, 100));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      return () => {
        ws.close();
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  }, [wsUrl]);

  const regenerateCounter = () => {
    setCounterCode(String(Math.floor(Math.random() * 9000) + 1000));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Patient Check-in</h2>
        <Badge variant={isConnected ? 'default' : 'secondary'}>{isConnected ? 'Live' : 'Offline'}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
          <FacilityQRCode hipId={hipId} counterCode={counterCode} onRegenerateCounter={regenerateCounter} />
        </div>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Real-time Check-in Feed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-[400px] pr-3">
              <div className="space-y-3">
                {events.length === 0 && (
                  <div className="flex items-center justify-center h-[200px] text-center">
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm text-muted-foreground">Waiting for patients to scan and share...</p>
                      <p className="text-xs text-muted-foreground">Patient check-ins will appear here in real-time</p>
                    </div>
                  </div>
                )}
                {events.map((evt) => (
                  <motion.div
                    key={evt.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg flex items-center justify-between bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {evt.name?.charAt(0) || 'P'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{evt.name || 'Patient'}</div>
                        <div className="text-xs text-muted-foreground">ABHA: {evt.abhaNumber}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
            {events.length > 0 && (
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  {events.length} check-in{events.length !== 1 ? 's' : ''} today
                </span>
                <Button variant="outline" size="sm" onClick={() => setEvents([])}>
                  Clear Feed
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckIn;