import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Box, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Model3DViewerProps {
  glbUrl?: string | null;
  usdzUrl?: string | null;
  modelTitle: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

export function Model3DViewer({ glbUrl, usdzUrl, modelTitle }: Model3DViewerProps) {
  const modelViewerRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically import model-viewer
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
    
    if (!document.querySelector('script[src*="model-viewer"]')) {
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  if (!glbUrl && !usdzUrl) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const arModel = isIOS && usdzUrl ? usdzUrl : glbUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3 mb-6">
        <Box className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-heritage font-semibold text-foreground">
          3D Model & AR Experience
        </h3>
      </div>

      <div className="embed-container overflow-hidden">
        <model-viewer
          ref={modelViewerRef}
          src={glbUrl}
          ios-src={usdzUrl}
          alt={modelTitle}
          auto-rotate
          camera-controls
          ar
          ar-modes="webxr scene-viewer quick-look"
          environment-image="neutral"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23666'%3ELoading...%3C/text%3E%3C/svg%3E"
          loading="lazy"
          style={{
            width: '100%',
            height: '500px',
            backgroundColor: 'hsl(var(--muted))',
          }}
        >
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row gap-2 z-10">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 text-foreground hover:bg-white shadow-lg backdrop-blur-sm"
              onClick={() => {
                if (modelViewerRef.current) {
                  modelViewerRef.current.activateAR();
                }
              }}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              View in AR
            </Button>
            
            <div className="flex-1 text-white/90 text-sm bg-black/50 backdrop-blur-sm px-3 py-2 rounded">
              <strong>Controls:</strong> Drag to rotate • Scroll to zoom • Pinch on mobile
            </div>
          </div>
        </model-viewer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <Box className="w-4 h-4" />
            3D Model Features
          </h4>
          <ul className="space-y-1">
            <li>• Interactive rotation and zoom</li>
            <li>• Auto-rotate demonstration</li>
            <li>• High-resolution textures</li>
            <li>• Optimized for web performance</li>
          </ul>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            AR Experience
          </h4>
          <ul className="space-y-1">
            <li>• Place model in real space</li>
            <li>• iOS: AR Quick Look support</li>
            <li>• Android: ARCore integration</li>
            <li>• Scale and position controls</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}