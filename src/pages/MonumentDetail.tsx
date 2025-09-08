import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, MapPin, Calendar, Loader2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ImageGallery } from "@/components/ImageGallery";
import { ARVREmbeds } from "@/components/ARVREmbeds";
import { Model3DViewer } from "@/components/Model3DViewer";
import { Header } from "@/components/Navigation/Header";
import { ScrollToTopButton, ReadingProgressBar } from "@/components/UI/FloatingElements";
import { MonumentDetailSkeleton } from "@/components/UI/LoadingSkeletons";
import { StatusBadge, LocationBadge, YearBadge, BadgeCluster } from "@/components/UI/InteractiveBadges";
import { 
  getMonumentBySlug, 
  getMonumentAudios, 
  getMonumentGallery, 
  getMonumentEmbeds 
} from "@/lib/supabase-queries";
import { useState, useEffect } from "react";

export default function MonumentDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [lowBandwidth, setLowBandwidth] = useState(false);

  // Detect connection speed
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
        setLowBandwidth(true);
      }
    }
  }, []);

  const { data: monument, isLoading: monumentLoading, error: monumentError } = useQuery({
    queryKey: ["monument", slug],
    queryFn: () => getMonumentBySlug(slug!),
    enabled: !!slug,
  });

  const { data: audios = [] } = useQuery({
    queryKey: ["monument-audios", monument?.id],
    queryFn: () => getMonumentAudios(monument!.id),
    enabled: !!monument?.id,
  });

  const { data: gallery = [] } = useQuery({
    queryKey: ["monument-gallery", monument?.id],
    queryFn: () => getMonumentGallery(monument!.id),
    enabled: !!monument?.id,
  });

  const { data: embeds } = useQuery({
    queryKey: ["monument-embeds", monument?.id],
    queryFn: () => getMonumentEmbeds(monument!.id),
    enabled: !!monument?.id,
  });

  if (monumentLoading) {
    return <MonumentDetailSkeleton />;
  }

  if (monumentError || !monument) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Monument Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The monument you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/")} className="heritage-button">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ReadingProgressBar />

      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        {monument.cover_image ? (
          <img
            src={monument.cover_image}
            alt={monument.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-heritage font-bold text-white mb-4">
                {monument.name}
              </h1>
              
              <BadgeCluster 
                badges={[
                  ...(monument.location ? [{
                    type: "location" as const,
                    props: { location: monument.location, interactive: true }
                  }] : []),
                  ...(monument.build_year ? [{
                    type: "year" as const,
                    props: { year: monument.build_year, interactive: true }
                  }] : []),
                  ...(monument.type ? [{
                    type: "status" as const,
                    props: { status: "historic" as const }
                  }] : []),
                ]}
                className="mt-4"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Historical Details */}
            {monument.historical_details && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-heritage font-bold text-foreground mb-6">
                      Historical Details
                    </h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                      {monument.historical_details.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {/* About Section */}
            {monument.about && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-heritage font-bold text-foreground mb-6">
                      About This Monument
                    </h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                      {monument.about.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {/* Image Gallery */}
            {gallery.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <ImageGallery images={gallery} />
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {/* 3D Model Viewer */}
            {(monument.model_glb_url || monument.model_usdz_url) && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <Model3DViewer
                      glbUrl={monument.model_glb_url}
                      usdzUrl={monument.model_usdz_url}
                      modelTitle={monument.name}
                    />
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {/* AR/VR Embeds */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardContent className="p-8">
                  <ARVREmbeds embeds={embeds || null} lowBandwidth={lowBandwidth} />
                </CardContent>
              </Card>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Facts */}
            {monument.quick_facts && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-heritage font-semibold text-foreground mb-4">
                      Quick Facts
                    </h3>
                    <ul className="space-y-3">
                      {Array.isArray(monument.quick_facts) ? (
                        monument.quick_facts.map((fact: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-muted-foreground">{fact}</span>
                          </li>
                        ))
                      ) : typeof monument.quick_facts === 'object' ? (
                        Object.entries(monument.quick_facts).map(([key, value]) => (
                          <li key={key} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-foreground">{key}:</span>{" "}
                              <span className="text-muted-foreground">{value as string}</span>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="text-muted-foreground">{monument.quick_facts}</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Audio Guide */}
            {audios.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <AudioPlayer audios={audios} />
              </motion.div>
            )}

            {/* Low Bandwidth Notice */}
            {lowBandwidth && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <WifiOff className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        Low Bandwidth Mode
                      </span>
                    </div>
                    <p className="text-xs text-yellow-700">
                      Some interactive content has been optimized for your connection speed.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      <ScrollToTopButton />
    </div>
  );
}