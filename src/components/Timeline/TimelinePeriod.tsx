import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calendar, MapPin } from "lucide-react";
import { Monument } from "@/types/monument";
import { TimelineItem } from "./TimelineItem";
import { Button } from "@/components/ui/button";

interface PeriodData {
  name: string;
  dateRange: string;
  color: string;
  monuments: Monument[];
  startYear: number;
  endYear: number;
}

interface TimelinePeriodProps {
  period: PeriodData;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function TimelinePeriod({ period, index, isSelected, onSelect }: TimelinePeriodProps) {
  const isEven = index % 2 === 0;
  
  return (
    <div className={`flex ${isEven ? 'justify-start' : 'justify-end'} w-full`}>
      <div className={`w-full max-w-lg ${isEven ? 'pr-8' : 'pl-8'}`}>
        {/* Period Header */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="cursor-pointer"
          onClick={onSelect}
        >
          <div className={`bg-gradient-to-r ${period.color} p-1 rounded-xl shadow-lg`}>
            <div className="bg-background/95 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-heritage font-bold text-foreground mb-1">
                    {period.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{period.dateRange}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 bg-gradient-to-r ${period.color} text-white rounded-full text-sm font-medium`}>
                    {period.monuments.length} monuments
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-accent/20"
                  >
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isSelected ? 'rotate-180' : ''
                      }`} 
                    />
                  </Button>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Earliest:</span>
                  <div className="font-medium text-foreground">
                    {period.monuments[0]?.build_year || 'Unknown'} CE
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Latest:</span>
                  <div className="font-medium text-foreground">
                    {period.monuments[period.monuments.length - 1]?.build_year || 'Unknown'} CE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Monuments List */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-4 overflow-hidden"
            >
              <div className="space-y-3">
                {period.monuments.map((monument, monumentIndex) => (
                  <motion.div
                    key={monument.id}
                    initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: monumentIndex * 0.1 }}
                  >
                    <TimelineItem 
                      monument={monument} 
                      periodColor={period.color}
                      isEven={isEven}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}