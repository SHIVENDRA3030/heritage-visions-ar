import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TimelineView } from "@/components/Timeline/TimelineView";
import { Header } from "@/components/Navigation/Header";
import { ScrollToTopButton, ReadingProgressBar } from "@/components/UI/FloatingElements";
import { TimelineSkeleton } from "@/components/UI/LoadingSkeletons";
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
      <Header monumentCount={monuments.length} />
      <ReadingProgressBar />

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

        {isLoading ? (
          <TimelineSkeleton />
        ) : (
          <TimelineView
            monuments={monuments}
            isLoading={isLoading}
            selectedPeriod={selectedPeriod}
            onPeriodSelect={setSelectedPeriod}
          />
        )}
      </main>
      
      <ScrollToTopButton />
    </div>
  );
}