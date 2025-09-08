import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Sparkles, Zap, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            className="w-12 h-12 rounded-full shadow-2xl bg-primary hover:bg-primary/90 
                       border-2 border-primary-foreground/20 hover:scale-110 transition-all duration-300"
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.div>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setProgress(progress);
    };

    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent z-50 origin-left"
      style={{ scaleX: progress / 100 }}
      initial={{ scaleX: 0 }}
    />
  );
}

export function FloatingStatusIndicator() {
  const [status, setStatus] = useState<"loading" | "ready" | "interactive">("loading");

  useEffect(() => {
    // Simulate status changes
    const timer1 = setTimeout(() => setStatus("ready"), 1000);
    const timer2 = setTimeout(() => setStatus("interactive"), 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const statusConfig = {
    loading: { icon: Coffee, text: "Loading...", color: "bg-yellow-500" },
    ready: { icon: Zap, text: "Ready", color: "bg-green-500" },
    interactive: { icon: Sparkles, text: "Interactive", color: "bg-blue-500" },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-24 right-8 z-40"
    >
      <Badge 
        variant="secondary" 
        className="bg-background/80 backdrop-blur-sm border shadow-lg px-3 py-2"
      >
        <motion.div
          animate={{ rotate: status === "loading" ? 360 : 0 }}
          transition={{ duration: 2, repeat: status === "loading" ? Infinity : 0 }}
          className="mr-2"
        >
          <Icon className="w-4 h-4" />
        </motion.div>
        <span className="font-medium">{config.text}</span>
        <motion.div
          className={`w-2 h-2 rounded-full ml-2 ${config.color}`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </Badge>
    </motion.div>
  );
}

export function InteractiveTooltip({ 
  children, 
  content, 
  side = "top" 
}: { 
  children: React.ReactNode; 
  content: string; 
  side?: "top" | "bottom" | "left" | "right";
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: side === "top" ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: side === "top" ? 10 : -10 }}
            className={`absolute z-50 px-3 py-2 text-sm bg-popover border rounded-lg shadow-lg whitespace-nowrap
              ${side === "top" ? "bottom-full mb-2" : ""}
              ${side === "bottom" ? "top-full mt-2" : ""}
              ${side === "left" ? "right-full mr-2 top-1/2 -translate-y-1/2" : ""}
              ${side === "right" ? "left-full ml-2 top-1/2 -translate-y-1/2" : ""}
            `}
          >
            {content}
            {/* Arrow */}
            <div 
              className={`absolute w-2 h-2 bg-popover border rotate-45
                ${side === "top" ? "top-full left-1/2 -translate-x-1/2 -mt-1 border-b border-r" : ""}
                ${side === "bottom" ? "bottom-full left-1/2 -translate-x-1/2 -mb-1 border-t border-l" : ""}
                ${side === "left" ? "left-full top-1/2 -translate-y-1/2 -ml-1 border-t border-r" : ""}
                ${side === "right" ? "right-full top-1/2 -translate-y-1/2 -mr-1 border-b border-l" : ""}
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}