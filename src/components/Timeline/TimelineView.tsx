import { useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Monument } from "@/types/monument";
import { TimelinePeriod } from "./TimelinePeriod";

interface TimelineViewProps {
  monuments: Monument[];
  isLoading: boolean;
  selectedPeriod: string | null;
  onPeriodSelect: (period: string | null) => void;
}

interface PeriodData {
  name: string;
  dateRange: string;
  color: string;
  monuments: Monument[];
  startYear: number;
  endYear: number;
}

export function TimelineView({ monuments, isLoading, selectedPeriod, onPeriodSelect }: TimelineViewProps) {
  const periodsData = useMemo(() => {
    // Group monuments by periods and years
    const periods: Record<string, Monument[]> = {};
    
    monuments.forEach((monument) => {
      // Determine period based on build_year or use the period field
      let periodName = monument.period || "Unknown Period";
      
      if (monument.build_year && !monument.period) {
        const year = monument.build_year;
        if (year < 500) {
          periodName = "Ancient Period";
        } else if (year < 1200) {
          periodName = "Early Medieval";
        } else if (year < 1526) {
          periodName = "Medieval Period";
        } else if (year < 1707) {
          periodName = "Mughal Era";
        } else if (year < 1857) {
          periodName = "Late Mughal & Regional";
        } else if (year < 1947) {
          periodName = "Colonial Period";
        } else {
          periodName = "Modern Period";
        }
      }
      
      if (!periods[periodName]) {
        periods[periodName] = [];
      }
      periods[periodName].push(monument);
    });

    // Convert to array and add metadata
    const periodsList: PeriodData[] = Object.entries(periods).map(([name, monuments]) => {
      const years = monuments
        .map(m => m.build_year)
        .filter(Boolean)
        .sort((a, b) => a! - b!);
      
      const startYear = years.length > 0 ? years[0]! : 0;
      const endYear = years.length > 0 ? years[years.length - 1]! : 2024;
      
      // Assign colors based on period
      const colorMap: Record<string, string> = {
        "Ancient Period": "from-amber-500 to-orange-600",
        "Early Medieval": "from-emerald-500 to-teal-600",
        "Medieval Period": "from-blue-500 to-indigo-600",
        "Mughal Era": "from-purple-500 to-pink-600",
        "Late Mughal & Regional": "from-rose-500 to-red-600",
        "Colonial Period": "from-slate-500 to-gray-600",
        "Modern Period": "from-primary to-accent",
        "Unknown Period": "from-muted to-secondary",
      };

      const dateRangeMap: Record<string, string> = {
        "Ancient Period": "Before 500 CE",
        "Early Medieval": "500-1200 CE",
        "Medieval Period": "1200-1526 CE",
        "Mughal Era": "1526-1707 CE",
        "Late Mughal & Regional": "1707-1857 CE",
        "Colonial Period": "1857-1947 CE",
        "Modern Period": "1947-Present",
        "Unknown Period": "Date Unknown",
      };

      return {
        name,
        dateRange: dateRangeMap[name] || `${startYear}-${endYear} CE`,
        color: colorMap[name] || "from-muted to-secondary",
        monuments: monuments.sort((a, b) => (a.build_year || 0) - (b.build_year || 0)),
        startYear,
        endYear,
      };
    });

    // Sort periods chronologically
    return periodsList.sort((a, b) => a.startYear - b.startYear);
  }, [monuments]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading timeline...</span>
      </div>
    );
  }

  if (periodsData.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          No timeline data available
        </h3>
        <p className="text-muted-foreground">
          No monuments with period information found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Timeline Navigation */}
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-primary via-accent to-highlight h-full rounded-full opacity-30"></div>
        
        <div className="space-y-12">
          {periodsData.map((period, index) => (
            <motion.div
              key={period.name}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Period Marker */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-0">
                <div className={`w-8 h-8 bg-gradient-to-r ${period.color} rounded-full border-4 border-background shadow-lg z-10`}></div>
                <div className={`absolute inset-0 w-8 h-8 bg-gradient-to-r ${period.color} rounded-full animate-ping opacity-20`}></div>
              </div>

              <TimelinePeriod
                period={period}
                index={index}
                isSelected={selectedPeriod === period.name}
                onSelect={() => onPeriodSelect(
                  selectedPeriod === period.name ? null : period.name
                )}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}