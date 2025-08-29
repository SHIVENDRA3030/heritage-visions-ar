import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import { MonumentCard } from "@/components/MonumentCard";
import { getMonuments, searchMonuments } from "@/lib/supabase-queries";
import { Monument } from "@/types/monument";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMonuments, setFilteredMonuments] = useState<Monument[]>([]);

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
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-lato">
              Journey through India's architectural marvels and cultural treasures
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading monuments...</span>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredMonuments.map((monument, index) => (
                <motion.div
                  key={monument.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <MonumentCard monument={monument} />
                </motion.div>
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