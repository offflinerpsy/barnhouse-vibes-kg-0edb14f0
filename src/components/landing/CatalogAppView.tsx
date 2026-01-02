/**
 * ERA Mobile Catalog — Instagram/TikTok style
 * - Fullscreen photo with pinch-to-zoom
 * - Swipe left/right: switch models
 * - Swipe up: open gallery
 * - Persistent model picker + application form
 * - Glassmorphism UI with gold accents
 */

import { useCallback, useMemo, useState, useRef } from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Grid3X3,
  Images,
  Phone,
  Send,
  MessageCircle,
  X,
  Maximize2,
  Ruler,
} from "lucide-react";
import { ContactModal } from "@/components/landing/ContactModal";

interface CatalogAppViewProps {
  onClose?: () => void;
}

type FilterType = "all" | "1-floor" | "2-floor";

type EraModel = {
  id: string;
  name: string;
  area: number;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  catalogPath: string;
  galleryCount: number;
  galleryExtraCount: number;
  floorPlanCount: number;
};

const ERA_MODELS: EraModel[] = [
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

const SWIPE_X = 70;
const SWIPE_Y = 90;

function getAllPhotos(model: EraModel): string[] {
  const photos: string[] = [];
  for (let i = 1; i <= model.galleryExtraCount; i++) {
    photos.push(`/catalog/${model.catalogPath}/gallery-extra/extra-${i}.webp`);
  }
  for (let i = 1; i <= model.galleryCount; i++) {
    photos.push(`/catalog/${model.catalogPath}/gallery/${i}.webp`);
  }
  return photos;
}

function getFloorPlans(model: EraModel): string[] {
  const plans: string[] = [];
  for (let i = 1; i <= model.floorPlanCount; i++) {
    plans.push(`/catalog/${model.catalogPath}/floor-plan/plan-${i}.webp`);
  }
  return plans;
}

// Schematic model icon - shows floors, size, and layout intuitively
function ModelIcon({ model }: { model: EraModel }) {
  const sizeScale = Math.min(1, model.area / 120); // Normalize to 120m²
  const width = 20 + sizeScale * 12;
  
  return (
    <svg 
      viewBox="0 0 40 32" 
      className="w-8 h-6 md:w-10 md:h-7"
      fill="none"
    >
      {/* Ground line */}
      <line x1="2" y1="30" x2="38" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      
      {model.floors === 1 ? (
        // Single floor house
        <>
          {/* Roof */}
          <path 
            d={`M${20 - width/2 - 2} 16 L20 8 L${20 + width/2 + 2} 16`}
            stroke="hsl(var(--primary))" 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* House body */}
          <rect 
            x={20 - width/2} 
            y="16" 
            width={width} 
            height="14" 
            stroke="currentColor" 
            strokeWidth="1.5"
            fill="hsl(var(--primary) / 0.15)"
            rx="1"
          />
          {/* Door */}
          <rect x="17" y="22" width="6" height="8" fill="hsl(var(--primary) / 0.4)" rx="0.5" />
          {/* Windows based on bedrooms */}
          {model.bedrooms >= 2 && <rect x={20 - width/2 + 2} y="19" width="4" height="4" fill="hsl(var(--primary) / 0.3)" rx="0.5" />}
          {model.bedrooms >= 3 && <rect x={20 + width/2 - 6} y="19" width="4" height="4" fill="hsl(var(--primary) / 0.3)" rx="0.5" />}
        </>
      ) : (
        // Two floor house
        <>
          {/* Roof */}
          <path 
            d={`M${20 - width/2 - 2} 10 L20 2 L${20 + width/2 + 2} 10`}
            stroke="hsl(var(--primary))" 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Second floor */}
          <rect 
            x={20 - width/2} 
            y="10" 
            width={width} 
            height="10" 
            stroke="currentColor" 
            strokeWidth="1.5"
            fill="hsl(var(--primary) / 0.2)"
            rx="1"
          />
          {/* First floor */}
          <rect 
            x={20 - width/2} 
            y="20" 
            width={width} 
            height="10" 
            stroke="currentColor" 
            strokeWidth="1.5"
            fill="hsl(var(--primary) / 0.1)"
            rx="1"
          />
          {/* Door */}
          <rect x="17" y="23" width="6" height="7" fill="hsl(var(--primary) / 0.4)" rx="0.5" />
          {/* Upper windows */}
          <rect x={20 - width/2 + 3} y="13" width="4" height="4" fill="hsl(var(--primary) / 0.3)" rx="0.5" />
          {model.bedrooms >= 3 && <rect x={20 + width/2 - 7} y="13" width="4" height="4" fill="hsl(var(--primary) / 0.3)" rx="0.5" />}
        </>
      )}
    </svg>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "glass",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  variant?: "glass" | "primary";
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5">
      <div
        className={
          variant === "primary"
            ? "w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/90 backdrop-blur-xl border border-primary/50 shadow-lg shadow-primary/25 flex items-center justify-center"
            : "w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center"
        }
      >
        <Icon
          className={
            variant === "primary"
              ? "h-5 w-5 md:h-6 md:w-6 text-charcoal"
              : "h-5 w-5 md:h-6 md:w-6 text-white"
          }
        />
      </div>
      <span className="text-[11px] md:text-xs font-medium text-white/80 leading-none">
        {label}
      </span>
    </button>
  );
}

function Chip({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="flex-none inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 px-3 py-2 whitespace-nowrap">
      <Icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
      <span className="text-sm md:text-base font-semibold text-white">
        {value}
        <span className="ml-1 text-white/70 font-medium">{label}</span>
      </span>
    </div>
  );
}

function ModelPickerSheet({
  open,
  onClose,
  models,
  currentModelId,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  models: EraModel[];
  currentModelId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40"
        >
          <button
            aria-label="Закрыть выбор модели"
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="absolute left-0 right-0 bottom-0 rounded-t-3xl bg-charcoal/95 backdrop-blur-xl border-t border-white/15"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="px-5 pt-3 pb-4">
              <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-white/25" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="h-5 w-5 text-primary" />
                  <h3 className="text-base md:text-lg font-semibold text-white">
                    Выбор модели
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 flex items-center justify-center"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2.5 max-h-[55vh] overflow-y-auto pr-1">
                {models.map((m) => {
                  const active = m.id === currentModelId;
                  return (
                    <button
                      key={m.id}
                      onClick={() => onSelect(m.id)}
                      className={
                        active
                          ? "flex items-center gap-3 rounded-2xl px-4 py-3 bg-primary/15 border border-primary/40"
                          : "flex items-center gap-3 rounded-2xl px-4 py-3 bg-white/5 border border-white/10 hover:border-white/20"
                      }
                    >
                      {/* Schematic icon */}
                      <div className="flex-none text-white/80">
                        <ModelIcon model={m} />
                      </div>
                      
                      <div className="flex-1 text-left">
                        <div className="text-base md:text-lg font-semibold text-white">
                          {m.name}
                        </div>
                        <div className="text-sm md:text-base text-white/60">
                          {m.floors} эт. • {m.bedrooms} спальн. • {m.bathrooms} с/у
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-base md:text-lg font-bold text-primary">
                          {m.area}м²
                        </div>
                        {active && (
                          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const slideVariants = {
  enter: (direction: 1 | -1) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 1.01,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction: 1 | -1) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.99,
  }),
};

// Pinch-to-zoom lightbox component
function ZoomableLightbox({
  src,
  alt,
  onClose,
  onNavigate,
  currentIndex,
  totalCount,
}: {
  src: string;
  alt: string;
  onClose: () => void;
  onNavigate: (dir: 1 | -1) => void;
  currentIndex: number;
  totalCount: number;
}) {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const lastTapRef = useRef<number>(0);
  const initialDistanceRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialDistanceRef.current = Math.hypot(dx, dy);
      initialScaleRef.current = scale;
    }
  }, [scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialDistanceRef.current) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.hypot(dx, dy);
      const newScale = Math.min(4, Math.max(1, initialScaleRef.current * (distance / initialDistanceRef.current)));
      setScale(newScale);
      
      if (newScale === 1) {
        setTranslate({ x: 0, y: 0 });
      }
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    initialDistanceRef.current = null;
    if (scale < 1.1) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  }, [scale]);

  // Double tap to zoom
  const handleDoubleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap detected
      if (scale > 1) {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
      } else {
        setScale(2.5);
        // Zoom to tap point
        if ('touches' in e && e.touches[0]) {
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            const x = e.touches[0].clientX - rect.left - rect.width / 2;
            const y = e.touches[0].clientY - rect.top - rect.height / 2;
            setTranslate({ x: -x * 0.6, y: -y * 0.6 });
          }
        }
      }
    }
    lastTapRef.current = now;
  }, [scale]);

  const handlePanEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (scale > 1.2) {
        // When zoomed in, allow panning
        setTranslate(prev => ({
          x: prev.x + info.offset.x,
          y: prev.y + info.offset.y,
        }));
        return;
      }
      
      const absX = Math.abs(info.offset.x);
      const absY = Math.abs(info.offset.y);
      
      if (absX > absY && absX > SWIPE_X) {
        onNavigate(info.offset.x > 0 ? -1 : 1);
        return;
      }
      if (absY > absX && info.offset.y > SWIPE_Y) {
        onClose();
      }
    },
    [scale, onNavigate, onClose]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <button
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center"
      >
        <X className="h-5 w-5 text-white" />
      </button>

      <button
        aria-label="Предыдущее"
        onClick={() => onNavigate(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center"
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>
      <button
        aria-label="Следующее"
        onClick={() => onNavigate(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center"
      >
        <ChevronRight className="h-5 w-5 text-white" />
      </button>

      <motion.div
        ref={containerRef}
        key={src}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        onPanEnd={handlePanEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleDoubleTap}
        style={{ touchAction: scale > 1 ? "none" : "pan-y" }}
        className="h-full w-full flex items-center justify-center p-4 cursor-zoom-in"
      >
        <motion.img
          src={src}
          alt={alt}
          className="max-h-full max-w-full object-contain rounded-xl select-none"
          draggable={false}
          decoding="async"
          animate={{ 
            scale,
            x: translate.x,
            y: translate.y,
          }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        />
      </motion.div>

      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/90"
        style={{ bottom: "calc(20px + env(safe-area-inset-bottom))" }}
      >
        {currentIndex + 1} / {totalCount}
      </div>
      
      {/* Zoom hint */}
      {scale === 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-xs text-white/50">
          Двойное касание для увеличения
        </div>
      )}
    </motion.div>
  );
}

export default function CatalogAppView({ onClose }: CatalogAppViewProps) {
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [filter, setFilter] = useState<FilterType>("all");

  const [showGallery, setShowGallery] = useState(false);
  const [galleryTab, setGalleryTab] = useState<"photos" | "plans">("photos");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const filteredModels = useMemo(() => {
    if (filter === "all") return ERA_MODELS;
    if (filter === "1-floor") return ERA_MODELS.filter((m) => m.floors === 1);
    return ERA_MODELS.filter((m) => m.floors === 2);
  }, [filter]);

  const safeIndex = Math.min(currentModelIndex, Math.max(0, filteredModels.length - 1));
  const currentModel = filteredModels[safeIndex] ?? filteredModels[0];

  const allPhotos = useMemo(() => getAllPhotos(currentModel), [currentModel]);
  const floorPlans = useMemo(() => getFloorPlans(currentModel), [currentModel]);
  const mainPhoto = allPhotos[0] ?? `/catalog/${currentModel.catalogPath}/gallery/1.webp`;

  const triggerHaptic = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, []);

  const goToModel = useCallback(
    (dir: 1 | -1) => {
      triggerHaptic();
      setDirection(dir);
      setCurrentModelIndex((prev) => {
        const next = prev + dir;
        if (next < 0) return filteredModels.length - 1;
        if (next >= filteredModels.length) return 0;
        return next;
      });
      setShowGallery(false);
    },
    [filteredModels.length, triggerHaptic]
  );

  const handlePanEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (lightboxImage) return;
      if (modelPickerOpen) return;
      if (showGallery) return;

      const absX = Math.abs(info.offset.x);
      const absY = Math.abs(info.offset.y);

      if (absX > absY && absX > SWIPE_X) {
        goToModel(info.offset.x > 0 ? -1 : 1);
        return;
      }

      if (absY > absX && info.offset.y < -SWIPE_Y) {
        setShowGallery(true);
      }
    },
    [goToModel, lightboxImage, modelPickerOpen, showGallery]
  );

  const lightboxPhotos = galleryTab === "photos" ? allPhotos : floorPlans;
  const navigateLightbox = useCallback(
    (dir: 1 | -1) => {
      setLightboxIndex((prev) => {
        const next = prev + dir;
        if (next < 0) return lightboxPhotos.length - 1;
        if (next >= lightboxPhotos.length) return 0;
        return next;
      });
    },
    [lightboxPhotos.length]
  );

  const handleCall = () => {
    window.location.href = "tel:+996555123456";
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Здравствуйте! Интересует ${currentModel.name} ${currentModel.area}м²`
    );
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
      className="fixed inset-0 z-50 bg-charcoal text-white"
    >
      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />

      {/* Stories-style progress indicator */}
      <div 
        className="absolute top-0 left-0 right-0 z-40 px-3 flex gap-1"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 10px)" }}
      >
        {filteredModels.map((model, idx) => (
          <button
            key={model.id}
            onClick={() => {
              triggerHaptic();
              setDirection(idx > safeIndex ? 1 : -1);
              setCurrentModelIndex(idx);
            }}
            className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/25"
          >
            <motion.div
              className="h-full bg-white rounded-full"
              initial={false}
              animate={{ 
                scaleX: idx === safeIndex ? 1 : 0,
                originX: 0
              }}
              transition={{ 
                duration: idx === safeIndex ? 0.3 : 0,
                ease: "easeOut"
              }}
            />
          </button>
        ))}
      </div>

      {/* Top bar */}
      <header 
        className="absolute top-0 left-0 right-0 z-30"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 22px)" }}
      >
        <div className="px-3 pt-2 pb-2">
          <div className="flex items-center gap-2">
            {onClose && (
              <button
                aria-label="Закрыть"
                onClick={onClose}
                className="flex-none w-10 h-10 md:w-11 md:h-11 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            )}

            {/* Filters - clean glassmorphism */}
            <nav className="flex-1 flex justify-center min-w-0">
              <div className="inline-flex items-center gap-0.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 p-1">
                {([
                  { id: "all" as const, label: "Все" },
                  { id: "1-floor" as const, label: "1эт" },
                  { id: "2-floor" as const, label: "2эт" },
                ] as const).map((f) => {
                  const active = filter === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        setFilter(f.id);
                        setCurrentModelIndex(0);
                      }}
                      className={
                        active
                          ? "px-4 py-2 rounded-full bg-primary/90 text-charcoal text-xs md:text-sm font-semibold whitespace-nowrap"
                          : "px-4 py-2 rounded-full text-white/80 text-xs md:text-sm font-semibold hover:text-white whitespace-nowrap"
                      }
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Model picker - with schematic icon */}
            <button
              onClick={() => setModelPickerOpen(true)}
              className="flex-none h-10 md:h-11 px-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center gap-2"
            >
              <div className="text-white/80">
                <ModelIcon model={currentModel} />
              </div>
              <span className="text-xs md:text-sm font-semibold text-white whitespace-nowrap">
                {safeIndex + 1}/{filteredModels.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main stage */}
      <motion.main
        className="absolute inset-0"
        onPanEnd={handlePanEnd}
        style={{ touchAction: "none" }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${currentModel.id}-${currentModel.area}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img
              src={mainPhoto}
              alt={`ERA barnhouse ${currentModel.name} ${currentModel.area}м² — фото`}
              className="h-full w-full object-cover"
              draggable={false}
              loading="eager"
              decoding="async"
            />

            {/* Light gradient - subtle, no heavy brown */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          </motion.div>
        </AnimatePresence>

        {/* Arrows - glass style */}
        <button
          aria-label="Предыдущая модель"
          onClick={() => goToModel(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
        <button
          aria-label="Следующая модель"
          onClick={() => goToModel(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center"
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </button>

        {/* Action rail (TikTok-style) */}
        <aside
          className="absolute right-3 z-30 flex flex-col items-center gap-3"
          style={{ bottom: "calc(16px + env(safe-area-inset-bottom))" }}
        >
          <ActionButton
            icon={Images}
            label="Фото"
            onClick={() => setShowGallery(true)}
          />
          <ActionButton
            icon={FileText}
            label="Заявка"
            variant="primary"
            onClick={() => setContactOpen(true)}
          />
          <ActionButton icon={MessageCircle} label="WA" onClick={handleWhatsApp} />
          <ActionButton icon={Send} label="TG" onClick={handleTelegram} />
          <ActionButton icon={Phone} label="Call" onClick={handleCall} />
        </aside>

        {/* Model info (caption) - bigger text */}
        <section
          className="absolute left-0 right-0 z-20"
          style={{ bottom: "calc(16px + env(safe-area-inset-bottom))" }}
        >
          <div className="px-4 pr-24">
            <div className="max-w-[400px]">
              {/* Schematic icon with model name */}
              <div className="flex items-center gap-3 mb-2">
                <div className="text-white/90">
                  <ModelIcon model={currentModel} />
                </div>
                <div className="flex items-baseline gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    {currentModel.name}
                  </h1>
                  <div className="text-xl md:text-2xl font-bold text-primary">
                    {currentModel.area}м²
                  </div>
                </div>
              </div>

              <p className="text-sm md:text-base text-white/60 mb-3">
                {currentModel.floors === 1 ? "Одноэтажный" : "Двухэтажный"} barnhouse
              </p>

              {/* Chips - glassmorphism, larger text */}
              <div className="flex gap-2 flex-wrap">
                <Chip icon={() => (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="10" width="16" height="10" rx="1" className="text-primary" />
                    {currentModel.floors === 2 && <rect x="4" y="4" width="16" height="6" rx="1" className="text-primary" />}
                    <path d="M12 2 L4 10 M12 2 L20 10" className="text-primary" strokeLinecap="round" />
                  </svg>
                )} value={String(currentModel.floors)} label="эт" />
                <Chip icon={() => (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="8" width="18" height="12" rx="2" className="text-primary" />
                    <path d="M3 16 L21 16" className="text-primary" />
                    <circle cx="7" cy="12" r="1.5" className="text-primary" fill="currentColor" />
                    <circle cx="12" cy="12" r="1.5" className="text-primary" fill="currentColor" />
                  </svg>
                )} value={String(currentModel.bedrooms)} label="сп" />
                <Chip icon={() => (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12 L4 20 L20 20 L20 12" className="text-primary" strokeLinecap="round" />
                    <path d="M2 12 L22 12" className="text-primary" strokeLinecap="round" />
                    <circle cx="8" cy="8" r="2" className="text-primary" />
                  </svg>
                )} value={String(currentModel.bathrooms)} label="с/у" />
              </div>
            </div>
          </div>
        </section>

        {/* Gallery sheet */}
        <AnimatePresence>
          {showGallery && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="absolute inset-0 z-40 bg-charcoal/98 backdrop-blur-xl flex flex-col"
              style={{ paddingTop: "env(safe-area-inset-top)" }}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <button
                  aria-label="Закрыть галерею"
                  onClick={() => setShowGallery(false)}
                  className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
                >
                  <X className="h-5 w-5 text-white" />
                </button>

                <div className="text-center">
                  <div className="text-base md:text-lg font-semibold text-white">
                    {currentModel.name}{" "}
                    <span className="text-primary">{currentModel.area}м²</span>
                  </div>
                  <div className="text-xs md:text-sm text-white/50">Сначала реальные фото</div>
                </div>

                <div className="w-11" />
              </div>

              {/* Tabs - glassmorphism */}
              <div className="p-4">
                <div className="flex gap-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-1">
                  <button
                    onClick={() => setGalleryTab("photos")}
                    className={
                      galleryTab === "photos"
                        ? "flex-1 py-3 rounded-xl bg-primary/90 text-charcoal text-sm md:text-base font-semibold"
                        : "flex-1 py-3 rounded-xl text-white/70 text-sm md:text-base font-semibold"
                    }
                  >
                    <Grid3X3 className="h-4 w-4 md:h-5 md:w-5 inline mr-2" />
                    Фото ({allPhotos.length})
                  </button>
                  <button
                    onClick={() => setGalleryTab("plans")}
                    disabled={floorPlans.length === 0}
                    className={
                      floorPlans.length === 0
                        ? "flex-1 py-3 rounded-xl text-white/25 text-sm md:text-base font-semibold"
                        : galleryTab === "plans"
                        ? "flex-1 py-3 rounded-xl bg-primary/90 text-charcoal text-sm md:text-base font-semibold"
                        : "flex-1 py-3 rounded-xl text-white/70 text-sm md:text-base font-semibold"
                    }
                  >
                    <Ruler className="h-4 w-4 md:h-5 md:w-5 inline mr-2" />
                    Планировки ({floorPlans.length})
                  </button>
                </div>
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto p-4 pb-8">
                <div className="grid grid-cols-2 gap-2.5">
                  {(galleryTab === "photos" ? allPhotos : floorPlans).map((photo, idx) => (
                    <motion.button
                      key={photo}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.01 }}
                      onClick={() => {
                        setLightboxImage(photo);
                        setLightboxIndex(idx);
                      }}
                      className="aspect-[4/3] rounded-2xl overflow-hidden relative group"
                    >
                      <img
                        src={photo}
                        alt={`ERA ${currentModel.name} ${currentModel.area}м² — ${galleryTab === "photos" ? "фото" : "план"} ${idx + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute bottom-2 right-2 w-9 h-9 rounded-xl bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="h-4 w-4 text-white" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lightbox with pinch-to-zoom and double-tap */}
        <AnimatePresence>
          {lightboxImage && (
            <ZoomableLightbox
              src={lightboxPhotos[lightboxIndex]}
              alt={`ERA ${currentModel.name} — полноэкранно`}
              onClose={() => setLightboxImage(null)}
              onNavigate={navigateLightbox}
              currentIndex={lightboxIndex}
              totalCount={lightboxPhotos.length}
            />
          )}
        </AnimatePresence>

        {/* Model picker sheet */}
        <ModelPickerSheet
          open={modelPickerOpen}
          onClose={() => setModelPickerOpen(false)}
          models={filteredModels}
          currentModelId={currentModel.id}
          onSelect={(id) => {
            const idx = filteredModels.findIndex((m) => m.id === id);
            if (idx >= 0) setCurrentModelIndex(idx);
            setModelPickerOpen(false);
          }}
        />
      </motion.main>
    </motion.div>
  );
}
