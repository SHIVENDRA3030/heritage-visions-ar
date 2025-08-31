import { Monument } from "@/types/monument";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface MonumentCardProps {
  monument: Monument;
}

export function MonumentCard({ monument }: MonumentCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: window.innerWidth >= 640 ? 1.02 : 1 }}
      transition={{ duration: 0.3 }}
      className="monument-card group cursor-pointer"
      onClick={() => navigate(`/monument/${monument.slug}`)}
    >
      <div className="aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] relative overflow-hidden">
        {monument.cover_image ? (
          <img
            src={monument.cover_image}
            alt={monument.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center p-4">
            <span className="text-muted-foreground text-sm sm:text-lg font-medium text-center">
              {monument.name}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
          <h3 className="text-white font-heritage font-semibold text-base sm:text-lg mb-1 line-clamp-2">
            {monument.name}
          </h3>
          <div className="flex items-center justify-between text-white/90 text-xs sm:text-sm">
            <span className="truncate mr-2">{monument.location}</span>
            {monument.build_year && (
              <span className="shrink-0">{monument.build_year}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}