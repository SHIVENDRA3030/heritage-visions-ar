import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-heritage-banner.jpg";
import { useState } from "react";

interface HeroSectionProps {
  monumentCount: number;
  onSearch: (query: string) => void;
}

export function HeroSection({ monumentCount, onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="India's Cultural Heritage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-heritage font-bold text-white mb-6 leading-tight">
            Preserving India's{" "}
            <span className="bg-gradient-to-r from-accent to-primary-glow bg-clip-text text-transparent">
              Cultural Heritage
            </span>{" "}
            in AR
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-lato"
          >
            Explore India's magnificent monuments through immersive AR/VR experiences, 
            3D models, and virtual tours
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center mb-12"
          >
            <div className="bg-gradient-to-r from-primary to-primary-glow rounded-full px-6 py-3 shadow-lg">
              <span className="text-white font-semibold text-lg">
                {monumentCount.toString().padStart(2, '0')}+ Monuments
              </span>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onSubmit={handleSearch}
            className="flex gap-4 max-w-lg mx-auto"
          >
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search monuments by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/20 backdrop-blur border-white/30 text-white placeholder-white/70 
                          focus:bg-white/30 focus:border-white/50 h-14 text-lg"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
            </div>
            <Button
              type="submit"
              className="heritage-button h-14 px-8 text-lg font-semibold"
            >
              Explore
            </Button>
          </motion.form>
        </motion.div>
      </div>

    </section>
  );
}