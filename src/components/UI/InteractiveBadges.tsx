import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, Crown, Star, Clock, MapPin, 
  Zap, Heart, Eye, Calendar, Award 
} from "lucide-react";

interface StatusBadgeProps {
  status: "featured" | "popular" | "new" | "trending" | "historic" | "ancient" | "medieval" | "modern";
  count?: number;
  animated?: boolean;
}

export function StatusBadge({ status, count, animated = true }: StatusBadgeProps) {
  const statusConfig = {
    featured: {
      icon: Crown,
      text: "Featured",
      gradient: "from-yellow-500 to-orange-500",
      glow: "shadow-yellow-500/25",
    },
    popular: {
      icon: Heart,
      text: "Popular",
      gradient: "from-pink-500 to-rose-500",
      glow: "shadow-pink-500/25",
    },
    new: {
      icon: Sparkles,
      text: "New",
      gradient: "from-emerald-500 to-teal-500",
      glow: "shadow-emerald-500/25",
    },
    trending: {
      icon: Zap,
      text: "Trending",
      gradient: "from-violet-500 to-purple-500",
      glow: "shadow-violet-500/25",
    },
    historic: {
      icon: Award,
      text: "Historic",
      gradient: "from-amber-600 to-orange-600",
      glow: "shadow-amber-500/25",
    },
    ancient: {
      icon: Clock,
      text: "Ancient",
      gradient: "from-stone-600 to-amber-700",
      glow: "shadow-stone-500/25",
    },
    medieval: {
      icon: Star,
      text: "Medieval",
      gradient: "from-indigo-600 to-blue-600",
      glow: "shadow-indigo-500/25",
    },
    modern: {
      icon: Eye,
      text: "Modern",
      gradient: "from-slate-600 to-gray-600",
      glow: "shadow-slate-500/25",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  const BadgeComponent = (
    <Badge
      className={`
        bg-gradient-to-r ${config.gradient} text-white border-0 
        shadow-lg ${config.glow} hover:shadow-xl transition-all duration-300
        px-3 py-1 font-medium
      `}
    >
      <Icon className="w-3 h-3 mr-1" />
      {config.text}
      {count && <span className="ml-1">({count})</span>}
    </Badge>
  );

  if (!animated) return BadgeComponent;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {BadgeComponent}
    </motion.div>
  );
}

interface LocationBadgeProps {
  location: string;
  interactive?: boolean;
}

export function LocationBadge({ location, interactive = false }: LocationBadgeProps) {
  const BadgeComponent = (
    <Badge 
      variant="outline"
      className="bg-background/80 backdrop-blur-sm hover:bg-muted transition-colors"
    >
      <MapPin className="w-3 h-3 mr-1" />
      {location}
    </Badge>
  );

  if (!interactive) return BadgeComponent;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer"
    >
      {BadgeComponent}
    </motion.div>
  );
}

interface YearBadgeProps {
  year: string | number;
  interactive?: boolean;
}

export function YearBadge({ year, interactive = false }: YearBadgeProps) {
  const BadgeComponent = (
    <Badge 
      variant="secondary"
      className="bg-muted/80 hover:bg-muted transition-colors"
    >
      <Calendar className="w-3 h-3 mr-1" />
      {year}
    </Badge>
  );

  if (!interactive) return BadgeComponent;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer"
    >
      {BadgeComponent}
    </motion.div>
  );
}

interface CounterBadgeProps {
  count: number;
  label: string;
  icon?: React.ElementType;
  animated?: boolean;
}

export function CounterBadge({ count, label, icon: Icon = Sparkles, animated = true }: CounterBadgeProps) {
  const BadgeComponent = (
    <Badge className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-lg">
      <Icon className="w-3 h-3 mr-1" />
      <motion.span
        key={count}
        initial={animated ? { scale: 1.2, opacity: 0 } : false}
        animate={animated ? { scale: 1, opacity: 1 } : false}
        transition={{ duration: 0.3 }}
      >
        {count.toString().padStart(2, '0')}
      </motion.span>
      <span className="ml-1">{label}</span>
    </Badge>
  );

  if (!animated) return BadgeComponent;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ duration: 0.2 }}
    >
      {BadgeComponent}
    </motion.div>
  );
}

interface BadgeClusterProps {
  badges: Array<{
    type: "status" | "location" | "year" | "counter";
    props: any;
  }>;
  className?: string;
}

export function BadgeCluster({ badges, className = "" }: BadgeClusterProps) {
  return (
    <motion.div 
      className={`flex flex-wrap gap-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {badges.map((badge, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          {badge.type === "status" && <StatusBadge {...badge.props} />}
          {badge.type === "location" && <LocationBadge {...badge.props} />}
          {badge.type === "year" && <YearBadge {...badge.props} />}
          {badge.type === "counter" && <CounterBadge {...badge.props} />}
        </motion.div>
      ))}
    </motion.div>
  );
}