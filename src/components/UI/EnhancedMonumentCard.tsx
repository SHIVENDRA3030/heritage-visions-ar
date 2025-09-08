import { Monument } from "@/types/monument";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Sparkles, ArrowRight, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EnhancedMonumentCardProps {
  monument: Monument;
  index?: number;
}

export function EnhancedMonumentCard({ monument, index = 0 }: EnhancedMonumentCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/monument/${monument.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: window.innerWidth >= 640 ? 1.02 : 1,
        y: -8
      }}
      transition={{ 
        duration: 0.3,
        delay: index * 0.1
      }}
      className="group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500">
        {/* Image Container */}
        <div className="aspect-[4/3] relative overflow-hidden">
          {monument.cover_image ? (
            <>
              <img
                src={monument.cover_image}
                alt={monument.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
              
              {/* Floating badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {monument.type && (
                  <Badge 
                    variant="secondary" 
                    className="bg-white/20 backdrop-blur-sm text-white border-white/30 shadow-lg"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {monument.type}
                  </Badge>
                )}
              </div>

              {/* Quick action button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="absolute top-4 right-4"
              >
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick();
                  }}
                >
                  <Eye className="w-4 h-4 text-white" />
                </Button>
              </motion.div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-accent/10 to-highlight/10 flex items-center justify-center">
              <div className="text-center p-6">
                <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <span className="text-muted-foreground font-medium">
                  {monument.name}
                </span>
              </div>
            </div>
          )}

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-heritage font-bold text-xl text-white mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                {monument.name}
              </h3>
              
              <div className="flex items-center justify-between text-white/90 text-sm mb-4">
                <div className="flex items-center gap-4">
                  {monument.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate max-w-32">{monument.location}</span>
                    </div>
                  )}
                  {monument.build_year && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{monument.build_year}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <span className="text-white/80 text-sm font-medium">
                  Explore Monument
                </span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowRight className="w-4 h-4 text-white" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Interactive shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 skew-x-12"
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
}