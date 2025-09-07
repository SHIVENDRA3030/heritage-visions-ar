import { motion } from "framer-motion";
import { MapPin, Calendar, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Monument } from "@/types/monument";

interface TimelineItemProps {
  monument: Monument;
  periodColor: string;
  isEven: boolean;
}

export function TimelineItem({ monument, periodColor, isEven }: TimelineItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/monument/${monument.slug}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer"
      onClick={handleClick}
    >
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex gap-4 p-4">
          {/* Monument Image */}
          <div className="relative w-20 h-20 shrink-0">
            {monument.cover_image ? (
              <img
                src={monument.cover_image}
                alt={monument.name}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${periodColor} rounded-md flex items-center justify-center`}>
                <span className="text-white text-xs font-medium text-center p-1">
                  {monument.name.charAt(0)}
                </span>
              </div>
            )}
            
            {/* Year Badge */}
            {monument.build_year && (
              <div className={`absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r ${periodColor} text-white text-xs font-bold rounded-full shadow-lg`}>
                {monument.build_year}
              </div>
            )}
          </div>

          {/* Monument Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-heritage font-semibold text-foreground text-sm line-clamp-1">
                {monument.name}
              </h4>
              <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 ml-2" />
            </div>
            
            <div className="space-y-1">
              {monument.location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{monument.location}</span>
                </div>
              )}
              
              {monument.type && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span className="truncate">{monument.type}</span>
                </div>
              )}
            </div>

            {monument.historical_details && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {monument.historical_details}
              </p>
            )}
          </div>
        </div>

        {/* Features Indicators */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 text-xs">
            {monument.audio_url && (
              <span className="px-2 py-1 bg-accent/20 text-accent-foreground rounded-full">
                Audio
              </span>
            )}
            {(monument.model_glb_url || monument.model_usdz_url) && (
              <span className="px-2 py-1 bg-highlight/20 text-highlight-foreground rounded-full">
                3D Model
              </span>
            )}
            {monument.cover_image && (
              <span className="px-2 py-1 bg-secondary/50 text-secondary-foreground rounded-full">
                Images
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}