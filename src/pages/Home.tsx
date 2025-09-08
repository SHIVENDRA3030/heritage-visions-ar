import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/HeroSection";
import { EnhancedMonumentCard } from "@/components/UI/EnhancedMonumentCard";
import { MonumentGridSkeleton } from "@/components/UI/LoadingSkeletons";
import { ScrollToTopButton, ReadingProgressBar, FloatingStatusIndicator } from "@/components/UI/FloatingElements";
import { Header } from "@/components/Navigation/Header";
import { getMonuments, searchMonuments } from "@/lib/supabase-queries";
import { Monument } from "@/types/monument";
import { Clock, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMonuments, setFilteredMonuments] = useState<Monument[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { 
    data: monuments = [], 
    isLoading,
    error 
  } = useQuery({
    queryKey: ["monuments"],
    queryFn: getMonuments,
  });

  useEffect(() => {
    if (searchQuery.trim()) {
      searchMonuments(searchQuery).then(setFilteredMonuments);
    } else {
      setFilteredMonuments(monuments);
    }
  }, [searchQuery, monuments]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Unable to load monuments
          </h2>
          <p className="text-muted-foreground">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header monumentCount={monuments.length} />
      <ReadingProgressBar />
      <FloatingStatusIndicator />
      
      <HeroSection 
        monumentCount={monuments.length} 
        onSearch={handleSearch}
      />

      {/* Monuments Grid Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-heritage font-bold text-foreground mb-4">
              Discover Our{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Heritage Collection
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-lato mb-6">
              Journey through India's architectural marvels and cultural treasures
            </p>
            
            {/* Action Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <Button
                onClick={() => navigate("/timeline")}
                variant="gradient"
                className="flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Explore Timeline
              </Button>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  {filteredMonuments.length} monuments
                </Badge>
                
                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {isLoading ? (
            <MonumentGridSkeleton />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1 md:grid-cols-2 gap-8"
              }`}
            >
              {filteredMonuments.map((monument, index) => (
                <EnhancedMonumentCard 
                  key={monument.id} 
                  monument={monument} 
                  index={index}
                />
              ))}
            </motion.div>
          )}

          {filteredMonuments.length === 0 && !isLoading && searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                No monuments found
              </h3>
              <p className="text-muted-foreground">
                Try searching with different keywords
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <ScrollToTopButton />

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-heritage font-bold text-foreground mb-4">
              Virtual Heritage India
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Preserving and sharing India's incredible cultural heritage through 
              cutting-edge AR/VR technology and immersive storytelling.
            </p>
          </div>
          
          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground">
                © 2024 Virtual Heritage India. All rights reserved.
              </p>
              <p className="text-muted-foreground text-sm">
                Powered by Supabase • Built with ❤️ for Cultural Preservation
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}