import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function MonumentCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="space-y-3"
    >
      <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
      <div className="space-y-2 px-2">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </motion.div>
  );
}

export function MonumentGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <MonumentCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-muted/50 to-background">
      <div className="text-center space-y-6 px-4 max-w-4xl mx-auto">
        <Skeleton className="h-16 md:h-20 w-full max-w-3xl mx-auto" />
        <Skeleton className="h-8 w-2/3 mx-auto" />
        <Skeleton className="h-12 w-40 mx-auto rounded-full" />
        <div className="flex gap-4 max-w-lg mx-auto">
          <Skeleton className="h-14 flex-1" />
          <Skeleton className="h-14 w-32" />
        </div>
      </div>
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-16">
            {Array.from({ length: 3 }).map((_, j) => (
              <MonumentCardSkeleton key={j} />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function MonumentDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      {/* Hero */}
      <Skeleton className="h-[60vh] w-full" />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            
            <div className="space-y-4">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="w-2 h-2 rounded-full mt-2" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
            
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}