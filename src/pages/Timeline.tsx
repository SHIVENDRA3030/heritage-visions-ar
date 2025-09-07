import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TimelineView } from "@/components/Timeline/TimelineView";
import { getMonuments } from "@/lib/supabase-queries";

export default function Timeline() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  const { 
    data: monuments = [], 
    isLoading,
    error 
  } = useQuery({
    queryKey: ["monuments"],
    queryFn: getMonuments,
  });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Unable to load timeline
          </h2>
          <p className="text-muted-foreground">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="hover:bg-accent/20"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-heritage font-bold text-foreground">
                    Interactive Timeline
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Explore architectural evolution through time
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{monuments.length} monuments across history</span>
            </div>
          </div>
        </div>
      </header>

      {/* Timeline Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-heritage font-bold text-center text-foreground mb-4">
            Journey Through{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Architectural History
            </span>
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Discover how Indian architecture evolved across different periods, 
            from ancient temples to modern marvels.
          </p>
        </motion.div>

        <TimelineView
          monuments={monuments}
          isLoading={isLoading}
          selectedPeriod={selectedPeriod}
          onPeriodSelect={setSelectedPeriod}
        />
      </main>
    </div>
  );
}