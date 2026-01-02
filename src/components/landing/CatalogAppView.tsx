/**
 * ERA Mobile Catalog - TikTok/Instagram Style
 * Fullscreen photos with swipe navigation
 */

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  MessageCircle, 
  Send,
  Maximize2,
  Grid3X3,
  Home,
  Bed,
  Bath,
  Ruler,
  ChevronUp,
  Images
} from "lucide-react";

interface CatalogAppViewProps {
  onClose?: () => void;
}

// All ERA models with real data
const ALL_MODELS = [
  {
    id: "model-1",
    name: "Model 1",
    area: 18,
    floors: 1,
    bedrooms: 1,
    bathrooms: 1,
    catalogPath: "model-1-18",
    galleryCount: 4,
    galleryExtraCount: 25,
    floorPlanCount: 3,
  },
  {
    id: "model-2",
    name: "Model 2",
    area: 36,
    floors: 1,
    bedrooms: 1,
    bathrooms: 1,
    catalogPath: "model-1-36",
    galleryCount: 4,
    galleryExtraCount: 24,
    floorPlanCount: 1,
  },
  {
    id: "model-3",
    name: "Model 3",
    area: 54,
    floors: 1,
    bedrooms: 2,
    bathrooms: 1,
    catalogPath: "model-1-54",
    galleryCount: 8,
    galleryExtraCount: 33,
    floorPlanCount: 3,
  },
  {
    id: "model-4",
    name: "Model 4",
    area: 81,
    floors: 1,
    bedrooms: 3,
    bathrooms: 2,
    catalogPath: "model-1-81",
    galleryCount: 4,
    galleryExtraCount: 34,
    floorPlanCount: 0,
  },
  {
    id: "model-5",
    name: "Model 5",
    area: 108,
    floors: 1,
    bedrooms: 4,
    bathrooms: 2,
    catalogPath: "model-1-108",
    galleryCount: 4,
    galleryExtraCount: 54,
    floorPlanCount: 3,
  },
  {
    id: "model-6",
    name: "Model 6",
    area: 135,
    floors: 1,
    bedrooms: 4,
    bathrooms: 2,
    catalogPath: "model-1-135",
    galleryCount: 5,
    galleryExtraCount: 38,
    floorPlanCount: 3,
  },
  {
    id: "model-2x-36",
    name: "Model 2X",
    area: 36,
    floors: 2,
    bedrooms: 1,
    bathrooms: 1,
    catalogPath: "model-2-36",
    galleryCount: 4,
    galleryExtraCount: 0,
    floorPlanCount: 0,
  },
  {
    id: "model-2x-72",
    name: "Model 2X",
    area: 72,
    floors: 2,
    bedrooms: 2,
    bathrooms: 1,
    catalogPath: "model-2-72",
    galleryCount: 4,
    galleryExtraCount: 6,
    floorPlanCount: 0,
  },
  {
    id: "model-2x-120",
    name: "Model 2X",
    area: 120,
    floors: 2,
    bedrooms: 3,
    bathrooms: 2,
    catalogPath: "model-2-120",
    galleryCount: 4,
    galleryExtraCount: 0,
    floorPlanCount: 3,
  },
  {
    id: "model-2x-204",
    name: "Model 2X",
    area: 204,
    floors: 2,
    bedrooms: 5,
    bathrooms: 3,
    catalogPath: "model-2-204",
    galleryCount: 6,
    galleryExtraCount: 0,
    floorPlanCount: 0,
  },
];

type FilterType = "all" | "1-floor" | "2-floor";

const CatalogAppView: React.FC<CatalogAppViewProps> = ({ onClose }) => {
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showGallery, setShowGallery] = useState(false);
  const [galleryTab, setGalleryTab] = useState<"photos" | "plans">("photos");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Filter models
  const filteredModels = useMemo(() => {
    if (filter === "all") return ALL_MODELS;
    if (filter === "1-floor") return ALL_MODELS.filter(m => m.floors === 1);
    return ALL_MODELS.filter(m => m.floors === 2);
  }, [filter]);

  const currentModel = filteredModels[currentModelIndex] || filteredModels[0];

  // Get all photos for current model (extra first, then gallery)
  const getAllPhotos = useCallback((model: typeof ALL_MODELS[0]) => {
    const photos: string[] = [];
    // Extra photos first (real photos)
    for (let i = 1; i <= model.galleryExtraCount; i++) {
      photos.push(`/catalog/${model.catalogPath}/gallery-extra/extra-${i}.webp`);
    }
    // Then gallery renders
    for (let i = 1; i <= model.galleryCount; i++) {
      photos.push(`/catalog/${model.catalogPath}/gallery/${i}.webp`);
    }
    return photos;
  }, []);

  // Get floor plans
  const getFloorPlans = useCallback((model: typeof ALL_MODELS[0]) => {
    const plans: string[] = [];
    for (let i = 1; i <= model.floorPlanCount; i++) {
      plans.push(`/catalog/${model.catalogPath}/floor-plan/plan-${i}.webp`);
    }
    return plans;
  }, []);

  const allPhotos = getAllPhotos(currentModel);
  const floorPlans = getFloorPlans(currentModel);
  const mainPhoto = allPhotos[0] || `/catalog/${currentModel.catalogPath}/gallery/1.webp`;

  // Navigation handlers
  const goToModel = useCallback((direction: 1 | -1) => {
    setCurrentModelIndex(prev => {
      const next = prev + direction;
      if (next < 0) return filteredModels.length - 1;
      if (next >= filteredModels.length) return 0;
      return next;
    });
    setShowGallery(false);
  }, [filteredModels.length]);

  // Swipe handler for main view
  const handleSwipe = useCallback((info: PanInfo) => {
    const threshold = 50;
    if (Math.abs(info.offset.x) > threshold) {
      goToModel(info.offset.x > 0 ? -1 : 1);
    }
    if (info.offset.y < -threshold && !showGallery) {
      setShowGallery(true);
    }
  }, [goToModel, showGallery]);

  // Lightbox navigation
  const lightboxPhotos = galleryTab === "photos" ? allPhotos : floorPlans;
  
  const navigateLightbox = useCallback((direction: 1 | -1) => {
    setLightboxIndex(prev => {
      const next = prev + direction;
      if (next < 0) return lightboxPhotos.length - 1;
      if (next >= lightboxPhotos.length) return 0;
      return next;
    });
  }, [lightboxPhotos.length]);

  // Contact handlers
  const handleCall = () => {
    window.location.href = "tel:+996555123456";
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Здравствуйте! Интересует ${currentModel.name} ${currentModel.area}м²`);
    window.open(`https://wa.me/996555123456?text=${text}`, "_blank");
  };

  const handleTelegram = () => {
    const text = encodeURIComponent(`Интересует ${currentModel.name} ${currentModel.area}м²`);
    window.open(`https://t.me/erahomes?text=${text}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      {/* Header - Filters */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-[env(safe-area-inset-top)]">
        <div className="px-4 pt-3 pb-2">
          {/* Close + Filters Row */}
          <div className="flex items-center justify-between">
            {onClose && (
              <button
                onClick={onClose}
                className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center border border-white/10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            )}

            {/* Filter Pills */}
            <div className="flex gap-2 ml-auto">
              {(["all", "1-floor", "2-floor"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFilter(f);
                    setCurrentModelIndex(0);
                  }}
                  className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                    filter === f
                      ? "bg-[#C3996B] text-black border-[#C3996B]"
                      : "bg-black/60 backdrop-blur-xl text-white/90 border-white/10"
                  }`}
                >
                  {f === "all" ? "Все" : f === "1-floor" ? "1 этаж" : "2 этажа"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Photo - Fullscreen with swipe */}
      <motion.div 
        className="flex-1 relative"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => handleSwipe(info)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentModel.id + currentModel.area}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <img
              src={mainPhoto}
              alt={currentModel.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
            
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - subtle */}
        <button
          onClick={() => goToModel(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-50 hover:opacity-90 active:opacity-100 transition-opacity border border-white/10"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => goToModel(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-50 hover:opacity-90 active:opacity-100 transition-opacity border border-white/10"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Model Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 pb-32">
          {/* Model Name & Area */}
          <div className="flex items-end justify-between mb-5">
            <div>
              <motion.div
                key={currentModel.name + currentModel.area}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-baseline gap-3 mb-1"
              >
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  {currentModel.name}
                </h2>
                <span className="text-[#C3996B] text-2xl font-bold">
                  {currentModel.area}м²
                </span>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-white/60 text-sm"
              >
                {currentModel.floors === 1 ? "Одноэтажный" : "Двухэтажный"} барнхаус
              </motion.p>
            </div>
            
            {/* Model Counter */}
            <div className="text-white/50 text-sm font-medium">
              {currentModelIndex + 1}/{filteredModels.length}
            </div>
          </div>

          {/* Attributes - horizontal pills */}
          <motion.div 
            key={`attrs-${currentModel.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-3 mb-5"
          >
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2.5 border border-white/10">
              <Home className="w-4 h-4 text-[#C3996B]" />
              <span className="text-white text-sm font-medium">{currentModel.floors} эт.</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2.5 border border-white/10">
              <Bed className="w-4 h-4 text-[#C3996B]" />
              <span className="text-white text-sm font-medium">{currentModel.bedrooms} спальни</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2.5 border border-white/10">
              <Bath className="w-4 h-4 text-[#C3996B]" />
              <span className="text-white text-sm font-medium">{currentModel.bathrooms} с/у</span>
            </div>
          </motion.div>

          {/* Gallery Button - swipe hint */}
          <motion.button
            onClick={() => setShowGallery(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
          >
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full pl-3 pr-4 py-2 border border-white/10 group-hover:border-white/20 transition-colors">
              <Images className="w-4 h-4 text-[#C3996B]" />
              <span className="text-sm font-medium">
                {allPhotos.length} фото
              </span>
              {floorPlans.length > 0 && (
                <span className="text-white/40 text-sm">• {floorPlans.length} план.</span>
              )}
            </div>
            <ChevronUp className="w-5 h-5 animate-bounce" />
          </motion.button>
        </div>

        {/* Model Dots - bottom indicator */}
        <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-1.5 px-8">
          {filteredModels.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentModelIndex(idx)}
              className={`h-1 rounded-full transition-all ${
                idx === currentModelIndex 
                  ? "w-6 bg-[#C3996B]" 
                  : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Bottom Contact Bar */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around p-3">
          <button
            onClick={handleCall}
            className="flex flex-col items-center gap-1.5 px-5 py-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/60 text-[11px] font-medium">Позвонить</span>
          </button>
          
          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center gap-1.5 px-5 py-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/30">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/60 text-[11px] font-medium">WhatsApp</span>
          </button>
          
          <button
            onClick={handleTelegram}
            className="flex flex-col items-center gap-1.5 px-5 py-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#0088cc] flex items-center justify-center shadow-lg shadow-[#0088cc]/30">
              <Send className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/60 text-[11px] font-medium">Telegram</span>
          </button>
        </div>
      </div>

      {/* Gallery Sheet */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="absolute inset-0 z-40 bg-black flex flex-col"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            {/* Gallery Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <button
                onClick={() => setShowGallery(false)}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              
              <h3 className="text-base font-semibold text-white">
                {currentModel.name} <span className="text-[#C3996B]">{currentModel.area}м²</span>
              </h3>

              <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Gallery Tabs */}
            <div className="flex gap-2 p-4">
              <button
                onClick={() => setGalleryTab("photos")}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all border ${
                  galleryTab === "photos"
                    ? "bg-[#C3996B] text-black border-[#C3996B]"
                    : "bg-white/10 text-white/70 border-white/10"
                }`}
              >
                <Grid3X3 className="w-4 h-4 inline mr-2" />
                Фото ({allPhotos.length})
              </button>
              <button
                onClick={() => setGalleryTab("plans")}
                disabled={floorPlans.length === 0}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all border ${
                  galleryTab === "plans"
                    ? "bg-[#C3996B] text-black border-[#C3996B]"
                    : "bg-white/10 text-white/70 border-white/10"
                } ${floorPlans.length === 0 ? "opacity-30 cursor-not-allowed" : ""}`}
              >
                <Ruler className="w-4 h-4 inline mr-2" />
                Планировки ({floorPlans.length})
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto p-4 pb-8">
              <div className="grid grid-cols-2 gap-2">
                {(galleryTab === "photos" ? allPhotos : floorPlans).map((photo, idx) => (
                  <motion.button
                    key={photo}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    onClick={() => {
                      setLightboxImage(photo);
                      setLightboxIndex(idx);
                    }}
                    className="aspect-[4/3] rounded-xl overflow-hidden relative group"
                  >
                    <img
                      src={photo}
                      alt={`${currentModel.name} - ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black flex items-center justify-center"
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10"
              style={{ marginTop: 'env(safe-area-inset-top)' }}
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Nav arrows */}
            <button
              onClick={() => navigateLightbox(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => navigateLightbox(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            {/* Image with swipe */}
            <motion.div
              key={lightboxPhotos[lightboxIndex]}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 50) {
                  navigateLightbox(info.offset.x > 0 ? -1 : 1);
                }
                if (info.offset.y > 100) {
                  setLightboxImage(null);
                }
              }}
              className="w-full h-full flex items-center justify-center p-4"
            >
              <img
                src={lightboxPhotos[lightboxIndex]}
                alt="Fullscreen"
                className="max-w-full max-h-full object-contain rounded-lg"
                draggable={false}
              />
            </motion.div>

            {/* Counter */}
            <div 
              className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white/80 text-sm font-medium border border-white/10"
              style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
            >
              {lightboxIndex + 1} / {lightboxPhotos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CatalogAppView;
