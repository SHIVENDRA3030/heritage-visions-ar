import { useState } from "react";
import { motion } from "framer-motion";
import { MonumentEmbed } from "@/types/monument";
import { Boxes, MapPin, Video, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ARVREmbedProps {
  embeds: MonumentEmbed | null;
  lowBandwidth?: boolean;
}

export function ARVREmbeds({ embeds, lowBandwidth = false }: ARVREmbedProps) {
  const [activeEmbed, setActiveEmbed] = useState<'sketchfab' | 'streetview' | 'youtube' | null>(null);

  if (!embeds) return null;

  const embedOptions = [
    {
      id: 'sketchfab',
      title: '3D Model View',
      icon: Boxes,
      description: 'Explore in 3D with AR support',
      embed: embeds.sketchfab_embed,
    },
    {
      id: 'streetview',
      title: 'Street View 360°',
      icon: MapPin,
      description: 'Navigate the real location',
      embed: embeds.google_street_view_embed,
    },
    {
      id: 'youtube',
      title: 'Virtual Tour',
      icon: Video,
      description: '360° guided experience',
      embed: embeds.youtube_embed,
    },
  ].filter(option => option.embed) as Array<{
    id: 'sketchfab' | 'streetview' | 'youtube';
    title: string;
    icon: any;
    description: string;
    embed: string;
  }>;

  if (!embedOptions.length) return null;

  if (lowBandwidth) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-6">
          <WifiOff className="w-6 h-6 text-muted-foreground" />
          <h3 className="text-2xl font-heritage font-semibold text-foreground">
            Immersive Experiences
          </h3>
          <span className="text-sm bg-muted text-muted-foreground px-2 py-1 rounded">
            Low Bandwidth Mode
          </span>
        </div>

        <div className="embed-fallback">
          <WifiOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">
            Immersive content available
          </h4>
          <p className="text-muted-foreground mb-4">
            3D models, street view, and virtual tours are available when you have a better connection.
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="gap-2"
          >
            <Wifi className="w-4 h-4" />
            Reload with full experience
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Boxes className="w-6 h-6 text-highlight" />
        <h3 className="text-2xl font-heritage font-semibold text-foreground">
          Immersive AR/VR Experience
        </h3>
      </div>

      {/* Embed Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {embedOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => setActiveEmbed(activeEmbed === option.id ? null : option.id)}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                activeEmbed === option.id
                  ? 'border-highlight bg-highlight/10'
                  : 'border-border hover:border-highlight/50 bg-card'
              }`}
            >
              <Icon className={`w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 ${
                activeEmbed === option.id ? 'text-highlight' : 'text-primary'
              }`} />
              <h4 className="font-semibold text-foreground mb-1 text-sm sm:text-base">{option.title}</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">{option.description}</p>
            </button>
          );
        })}
      </div>

      {/* Active Embed */}
      {activeEmbed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="embed-container"
        >
          <div className="responsive-embed-container">
            <div 
              className="responsive-embed-content"
              dangerouslySetInnerHTML={{ 
                __html: embedOptions.find(opt => opt.id === activeEmbed)?.embed || '' 
              }}
            />
          </div>
        </motion.div>
      )}

      {!activeEmbed && (
        <div className="text-center py-8 text-muted-foreground">
          <Boxes className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Select an experience above to begin your immersive journey</p>
        </div>
      )}
    </motion.div>
  );
}