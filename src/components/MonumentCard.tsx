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
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="monument-card group"
      onClick={() => navigate(`/monument/${monument.slug}`)}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        {monument.cover_image ? (
          <img
            src={monument.cover_image}
            alt={monument.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
            <span className="text-muted-foreground text-lg font-medium">
              {monument.name}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-heritage font-semibold text-lg mb-1">
            {monument.name}
          </h3>
          <div className="flex items-center justify-between text-white/90 text-sm">
            <span>{monument.location}</span>
            {monument.build_year && (
              <span>{monument.build_year}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}