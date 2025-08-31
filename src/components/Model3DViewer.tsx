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
export function Model3DViewer({
  glbUrl,
  usdzUrl,
  modelTitle
}: Model3DViewerProps) {
  const modelViewerRef = useRef<any>(null);
  useEffect(() => {
    // Dynamically import model-viewer
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
    if (!document.querySelector('script[src*="model-viewer"]')) {
      document.head.appendChild(script);

      // Add error handling for script loading
      script.onload = () => {
        console.log('Model Viewer loaded successfully');
      };
      script.onerror = () => {
        console.error('Failed to load Model Viewer');
      };
    }
    return () => {
      // Cleanup if needed
    };
  }, []);
  if (!glbUrl && !usdzUrl) return null;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  // For AR, use USDZ on iOS and GLB on Android/other platforms
  const arModel = isIOS && usdzUrl ? usdzUrl : glbUrl;
  console.log('Model3DViewer rendering:', {
    glbUrl,
    usdzUrl,
    arModel,
    isIOS,
    isAndroid
  });
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Box className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-heritage font-semibold text-foreground">
          3D Model & AR Experience
        </h3>
      </div>

      {/* Debug info for development */}
      <div className="hidden text-xs text-muted-foreground bg-muted/50 p-2 rounded mb-4">
        <div>GLB URL: {glbUrl || 'Not available'}</div>
        <div>USDZ URL: {usdzUrl || 'Not available'}</div>
        <div>Device: {isIOS ? 'iOS' : isAndroid ? 'Android' : 'Other'}</div>
        <div>AR Model URL: {arModel}</div>
      </div>

      <div className="relative w-full h-0 pb-[56.25%] sm:pb-[60%] md:pb-[56.25%] rounded-lg overflow-hidden bg-background">
        <div className="absolute inset-0 w-full h-full">
          <model-viewer ref={modelViewerRef} src={glbUrl} ios-src={usdzUrl} alt={modelTitle} auto-rotate camera-controls ar ar-modes="webxr scene-viewer quick-look" environment-image="neutral" poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f8f9fa'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23666'%3ELoading 3D Model...%3C/text%3E%3C/svg%3E" loading="lazy" onLoad={() => {
        console.log('✅ Model loaded successfully');
      }} onError={(event: any) => {
        console.error('❌ Model loading error:', event);
        console.error('GLB URL:', glbUrl);
        console.error('USDZ URL:', usdzUrl);
        console.error('Event details:', event.detail);
      }} onModelLoad={() => {
        console.log('✅ Model-viewer model-load event fired');
      }} onProgress={(event: any) => {
        console.log('📊 Loading progress:', event.detail);
      }} className="absolute inset-0 w-full h-full rounded-lg" style={{ display: 'block' }}>
          {/* Loading indicator */}
          <div slot="poster" className="flex items-center justify-center h-full bg-background">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading 3D Model...</p>
              <p className="text-xs text-muted-foreground mt-2">
                Large files may take time to load
              </p>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
            <Button variant="outline" size="sm" className="bg-background/95 text-foreground hover:bg-background border-border shadow-sm backdrop-blur-sm text-sm font-medium px-4 py-2" onClick={() => {
            if (modelViewerRef.current) {
              modelViewerRef.current.activateAR();
            }
          }}>
              <Smartphone className="w-4 h-4 mr-2" />
              View in AR
            </Button>
            
            <div className="text-foreground text-sm bg-muted/90 backdrop-blur-sm px-4 py-2 rounded font-medium">
              <strong>Controls:</strong> Drag to rotate • Scroll to zoom • Pinch on mobile
            </div>
          </div>
        </model-viewer>
        </div>
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
    </motion.div>;
}