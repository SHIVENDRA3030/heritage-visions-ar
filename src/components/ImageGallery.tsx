import { useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { MonumentGallery } from "@/types/monument";
import { ImageIcon } from "lucide-react";

interface ImageGalleryProps {
  images: MonumentGallery[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images.length) return null;

  const slides = images.map((image) => ({
    src: image.image_url,
    title: image.title || undefined,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3 mb-6">
        <ImageIcon className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-heritage font-semibold text-foreground">
          Image Gallery
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, imageIndex) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: imageIndex * 0.1 }}
            className="group cursor-pointer"
            onClick={() => {
              setIndex(imageIndex);
              setOpen(true);
            }}
          >
            <div className="aspect-[4/3] relative overflow-hidden rounded-lg border border-border">
              <img
                src={image.image_url}
                alt={image.title || `Gallery image ${imageIndex + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              {image.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white text-sm font-medium line-clamp-2">
                    {image.title}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
        }}
      />
    </motion.div>
  );
}