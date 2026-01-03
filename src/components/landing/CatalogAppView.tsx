/**
 * ERA Mobile Catalog — Instagram/TikTok style (v2 - Polished)
 * Premium glassmorphism UI with refined spacing and hierarchy
 */

import { useCallback, useMemo, useState, useRef, forwardRef } from "react";
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
  Layers,
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
  { id: "model-1", name: "Model 1", area: 18, floors: 1, bedrooms: 1, bathrooms: 1, catalogPath: "model-1-18", galleryCount: 4, galleryExtraCount: 25, floorPlanCount: 3 },
  { id: "model-2", name: "Model 2", area: 36, floors: 1, bedrooms: 1, bathrooms: 1, catalogPath: "model-1-36", galleryCount: 4, galleryExtraCount: 24, floorPlanCount: 1 },
  { id: "model-3", name: "Model 3", area: 54, floors: 1, bedrooms: 2, bathrooms: 1, catalogPath: "model-1-54", galleryCount: 8, galleryExtraCount: 33, floorPlanCount: 3 },
  { id: "model-4", name: "Model 4", area: 81, floors: 1, bedrooms: 3, bathrooms: 2, catalogPath: "model-1-81", galleryCount: 4, galleryExtraCount: 34, floorPlanCount: 0 },
  { id: "model-5", name: "Model 5", area: 108, floors: 1, bedrooms: 4, bathrooms: 2, catalogPath: "model-1-108", galleryCount: 4, galleryExtraCount: 54, floorPlanCount: 3 },
  { id: "model-6", name: "Model 6", area: 135, floors: 1, bedrooms: 4, bathrooms: 2, catalogPath: "model-1-135", galleryCount: 5, galleryExtraCount: 38, floorPlanCount: 3 },
  { id: "model-2x-36", name: "Model 2X", area: 36, floors: 2, bedrooms: 1, bathrooms: 1, catalogPath: "model-2-36", galleryCount: 4, galleryExtraCount: 0, floorPlanCount: 0 },
  { id: "model-2x-72", name: "Model 2X", area: 72, floors: 2, bedrooms: 2, bathrooms: 1, catalogPath: "model-2-72", galleryCount: 4, galleryExtraCount: 6, floorPlanCount: 0 },
  { id: "model-2x-120", name: "Model 2X", area: 120, floors: 2, bedrooms: 3, bathrooms: 2, catalogPath: "model-2-120", galleryCount: 4, galleryExtraCount: 0, floorPlanCount: 3 },
  { id: "model-2x-204", name: "Model 2X", area: 204, floors: 2, bedrooms: 5, bathrooms: 3, catalogPath: "model-2-204", galleryCount: 6, galleryExtraCount: 0, floorPlanCount: 0 },
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

// Clean schematic house icon
function HouseSchematic({ model, size = "md" }: { model: EraModel; size?: "sm" | "md" }) {
  const isSmall = size === "sm";
  const w = isSmall ? 24 : 32;
  const h = isSmall ? 20 : 26;
  
  return (
    <svg viewBox="0 0 32 26" width={w} height={h} fill="none" className="shrink-0">
      {model.floors === 1 ? (
        <>
          <path d="M16 2 L4 11 L4 24 L28 24 L28 11 Z" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M16 2 L4 11" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"/>
          <path d="M16 2 L28 11" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"/>
          <rect x="13" y="16" width="6" height="8" rx="1" fill="hsl(var(--primary) / 0.4)"/>
          {model.bedrooms >= 2 && <rect x="6" y="14" width="4" height="4" rx="0.5" fill="hsl(var(--primary) / 0.25)"/>}
          {model.bedrooms >= 3 && <rect x="22" y="14" width="4" height="4" rx="0.5" fill="hsl(var(--primary) / 0.25)"/>}
        </>
      ) : (
        <>
          <path d="M16 2 L4 9 L4 24 L28 24 L28 9 Z" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M16 2 L4 9" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"/>
          <path d="M16 2 L28 9" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"/>
          <line x1="4" y1="16" x2="28" y2="16" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1"/>
          <rect x="13" y="18" width="6" height="6" rx="1" fill="hsl(var(--primary) / 0.4)"/>
          <rect x="7" y="10" width="4" height="4" rx="0.5" fill="hsl(var(--primary) / 0.25)"/>
          <rect x="21" y="10" width="4" height="4" rx="0.5" fill="hsl(var(--primary) / 0.25)"/>
        </>
      )}
    </svg>
  );
}

// Glass panel base styles
const glassPanel = "bg-white/[0.08] backdrop-blur-2xl border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.3)]";
const glassPanelLight = "bg-white/[0.06] backdrop-blur-xl border border-white/[0.1]";

// Refined action button with better proportions
const ActionButton = forwardRef<HTMLButtonElement, {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  variant?: "default" | "primary";
}>(({ icon: Icon, label, onClick, variant = "default" }, ref) => (
  <button ref={ref} onClick={onClick} className="flex flex-col items-center gap-1">
    <div className={
      variant === "primary"
        ? `w-11 h-11 rounded-[14px] bg-primary shadow-lg shadow-primary/30 flex items-center justify-center`
        : `w-11 h-11 rounded-[14px] ${glassPanelLight} flex items-center justify-center`
    }>
      <Icon className={variant === "primary" ? "h-5 w-5 text-charcoal" : "h-5 w-5 text-white/90"} />
    </div>
    <span className="text-[10px] font-medium text-white/60 tracking-wide uppercase">{label}</span>
  </button>
));
ActionButton.displayName = "ActionButton";

// Compact info chip
const InfoChip = forwardRef<HTMLDivElement, {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}>(({ icon, value, label }, ref) => (
  <div ref={ref} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full ${glassPanelLight}`}>
    <span className="text-primary">{icon}</span>
    <span className="text-sm font-semibold text-white">{value}</span>
    <span className="text-xs text-white/50">{label}</span>
  </div>
));
InfoChip.displayName = "InfoChip";

// Floor icon
function FloorIcon({ floors }: { floors: number }) {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      {floors === 1 ? (
        <>
          <path d="M8 2 L2 7 L2 14 L14 14 L14 7 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
        </>
      ) : (
        <>
          <path d="M8 1 L2 5 L2 15 L14 15 L14 5 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
          <line x1="2" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
        </>
      )}
    </svg>
  );
}

// Bedroom icon
function BedroomIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <rect x="2" y="7" width="12" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
      <path d="M2 11 L14 11" stroke="currentColor" strokeWidth="1"/>
      <rect x="4" y="4" width="3" height="3" rx="0.5" fill="currentColor" fillOpacity="0.4"/>
      <rect x="9" y="4" width="3" height="3" rx="0.5" fill="currentColor" fillOpacity="0.4"/>
    </svg>
  );
}

// Bathroom icon
function BathroomIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <path d="M2 8 L14 8 L14 13 L2 13 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
      <circle cx="4" cy="6" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 13 L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M13 13 L13 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Model picker sheet
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40">
          <button aria-label="Закрыть" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className={`absolute left-0 right-0 bottom-0 rounded-t-[28px] ${glassPanel} bg-charcoal/95`}
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="px-5 pt-3 pb-5">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <Grid3X3 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-white">Выбор модели</h3>
                </div>
                <button onClick={onClose} className={`w-10 h-10 rounded-xl ${glassPanelLight} flex items-center justify-center`}>
                  <X className="h-5 w-5 text-white/80" />
                </button>
              </div>

              <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1 -mr-1">
                {models.map((m) => {
                  const active = m.id === currentModelId;
                  return (
                    <button
                      key={m.id}
                      onClick={() => onSelect(m.id)}
                      className={`w-full flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all ${
                        active
                          ? "bg-primary/15 border-2 border-primary/50"
                          : `${glassPanelLight} hover:bg-white/[0.08]`
                      }`}
                    >
                      <HouseSchematic model={m} size="md" />
                      <div className="flex-1 text-left min-w-0">
                        <div className="text-base font-semibold text-white truncate">{m.name}</div>
                        <div className="text-sm text-white/50">{m.floors}эт • {m.bedrooms}сп • {m.bathrooms}с/у</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">{m.area}м²</span>
                        {active && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
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
  enter: (dir: 1 | -1) => ({ x: dir > 0 ? 60 : -60, opacity: 0, scale: 1.02 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: 1 | -1) => ({ x: dir > 0 ? -60 : 60, opacity: 0, scale: 0.98 }),
};

// Zoomable lightbox with pinch-to-zoom and TikTok-style swipes
function ZoomableLightbox({
  photos,
  currentIndex,
  onClose,
  onIndexChange,
}: {
  photos: string[];
  currentIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const lastTapRef = useRef<number>(0);
  const initialDistanceRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalCount = photos.length;
  const currentPhoto = photos[currentIndex];

  const navigate = useCallback((dir: 1 | -1) => {
    const next = currentIndex + dir;
    if (next < 0) onIndexChange(totalCount - 1);
    else if (next >= totalCount) onIndexChange(0);
    else onIndexChange(next);
  }, [currentIndex, totalCount, onIndexChange]);

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
      if (newScale === 1) setTranslate({ x: 0, y: 0 });
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    initialDistanceRef.current = null;
    if (scale < 1.1) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  }, [scale]);

  const handleDoubleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (scale > 1) {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
      } else {
        setScale(2.5);
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

  const handlePanEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (scale > 1.2) {
      setTranslate(prev => ({ x: prev.x + info.offset.x, y: prev.y + info.offset.y }));
      return;
    }
    const absX = Math.abs(info.offset.x);
    const absY = Math.abs(info.offset.y);
    
    // Horizontal swipe → prev/next photo
    if (absX > SWIPE_X) {
      navigate(info.offset.x > 0 ? -1 : 1);
      return;
    }
    // Vertical swipe → prev/next OR close (down to close)
    if (absY > SWIPE_Y) {
      if (info.offset.y > 0) {
        // Swipe down → close lightbox
        onClose();
      } else {
        // Swipe up → next photo
        navigate(1);
      }
      return;
    }
  }, [scale, navigate, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col"
    >
      {/* Stories-style progress bar */}
      <div className="absolute top-0 left-0 right-0 z-40 px-3 flex gap-1" style={{ paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}>
        {photos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onIndexChange(idx)}
            className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/20"
          >
            <motion.div
              className="h-full bg-white rounded-full origin-left"
              initial={false}
              animate={{ scaleX: idx === currentIndex ? 1 : idx < currentIndex ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </button>
        ))}
      </div>

      {/* Close button */}
      <button
        aria-label="Закрыть"
        onClick={onClose}
        className={`absolute z-50 w-11 h-11 rounded-xl ${glassPanelLight} flex items-center justify-center`}
        style={{ top: "calc(env(safe-area-inset-top) + 24px)", right: 12 }}
      >
        <X className="h-5 w-5 text-white" />
      </button>

      {/* Nav arrows */}
      <button aria-label="Предыдущее" onClick={() => navigate(-1)} className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-xl ${glassPanelLight} flex items-center justify-center`}>
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>
      <button aria-label="Следующее" onClick={() => navigate(1)} className={`absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-xl ${glassPanelLight} flex items-center justify-center`}>
        <ChevronRight className="h-5 w-5 text-white" />
      </button>

      {/* Photo container */}
      <motion.div
        ref={containerRef}
        className="flex-1 flex items-center justify-center"
        onPanEnd={handlePanEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleDoubleTap}
        style={{ touchAction: scale > 1 ? "none" : "pan-x pan-y" }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentPhoto}
            src={currentPhoto}
            alt={`Photo ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain rounded-xl select-none px-4"
            draggable={false}
            decoding="async"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: scale, x: translate.x, y: translate.y }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          />
        </AnimatePresence>
      </motion.div>

      {/* Counter */}
      <div className={`absolute left-1/2 -translate-x-1/2 rounded-full ${glassPanelLight} px-4 py-2 text-sm font-medium text-white/80`} style={{ bottom: "calc(24px + env(safe-area-inset-bottom))" }}>
        {currentIndex + 1} / {totalCount}
      </div>

      {/* Hint */}
      {scale === 1 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute left-1/2 -translate-x-1/2 text-xs text-white/40" style={{ bottom: "calc(64px + env(safe-area-inset-bottom))" }}>
          ↕ свайп вверх/вниз • ↔ свайп влево/вправо
        </motion.div>
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
    if ('vibrate' in navigator) navigator.vibrate(8);
  }, []);

  const goToModel = useCallback((dir: 1 | -1) => {
    triggerHaptic();
    setDirection(dir);
    setCurrentModelIndex((prev) => {
      const next = prev + dir;
      if (next < 0) return filteredModels.length - 1;
      if (next >= filteredModels.length) return 0;
      return next;
    });
    setShowGallery(false);
  }, [filteredModels.length, triggerHaptic]);

  const handlePanEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (lightboxImage || modelPickerOpen || showGallery) return;
    const absX = Math.abs(info.offset.x);
    const absY = Math.abs(info.offset.y);
    if (absX > absY && absX > SWIPE_X) {
      goToModel(info.offset.x > 0 ? -1 : 1);
      return;
    }
    if (absY > absX && info.offset.y < -SWIPE_Y) setShowGallery(true);
  }, [goToModel, lightboxImage, modelPickerOpen, showGallery]);

  const lightboxPhotos = galleryTab === "photos" ? allPhotos : floorPlans;

  // Open gallery when tapping on the main photo
  const handleMainPhotoTap = useCallback(() => {
    setShowGallery(true);
  }, []);

  const handleCall = () => { window.location.href = "tel:+996555123456"; };
  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Здравствуйте! Интересует ${currentModel.name} ${currentModel.area}м²`);
    window.open(`https://wa.me/996555123456?text=${text}`, "_blank");
  };
  const handleTelegram = () => {
    const text = encodeURIComponent(`Интересует ${currentModel.name} ${currentModel.area}м²`);
    window.open(`https://t.me/erahomes?text=${text}`, "_blank");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-charcoal text-white overflow-hidden">
      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />

      {/* Model indicator dots (compact) */}
      <div className="absolute top-0 left-0 right-0 z-40 px-4 flex justify-center gap-1.5" style={{ paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}>
        {filteredModels.map((model, idx) => (
          <button
            key={model.id}
            onClick={() => { triggerHaptic(); setDirection(idx > safeIndex ? 1 : -1); setCurrentModelIndex(idx); }}
            className={`w-2 h-2 rounded-full transition-all ${idx === safeIndex ? "bg-primary w-6" : "bg-white/30"}`}
          />
        ))}
      </div>

      {/* Top controls */}
      <header className="absolute top-0 left-0 right-0 z-30" style={{ paddingTop: "calc(env(safe-area-inset-top) + 20px)" }}>
        <div className="px-3 pt-2">
          <div className="flex items-center gap-2">
            {onClose && (
              <button aria-label="Закрыть" onClick={onClose} className={`flex-none w-10 h-10 rounded-xl ${glassPanelLight} flex items-center justify-center`}>
                <X className="h-5 w-5 text-white/80" />
              </button>
            )}

            {/* Filter pills */}
            <nav className="flex-1 flex justify-center">
              <div className={`inline-flex items-center gap-0.5 rounded-full ${glassPanel} p-1`}>
                {([
                  { id: "all" as const, label: "Все" },
                  { id: "1-floor" as const, label: "1эт" },
                  { id: "2-floor" as const, label: "2эт" },
                ] as const).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => { setFilter(f.id); setCurrentModelIndex(0); }}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      filter === f.id
                        ? "bg-primary text-charcoal shadow-sm"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </nav>

            {/* Model counter */}
            <button onClick={() => setModelPickerOpen(true)} className={`flex-none h-10 px-3 rounded-xl ${glassPanelLight} flex items-center gap-2`}>
              <Layers className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-white">{safeIndex + 1}/{filteredModels.length}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main photo stage */}
      <motion.main className="absolute inset-0" onPanEnd={handlePanEnd} style={{ touchAction: "none" }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${currentModel.id}-${currentModel.area}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            {/* Tap on photo opens gallery */}
            <button 
              onClick={handleMainPhotoTap} 
              className="absolute inset-0 w-full h-full cursor-pointer"
              aria-label="Открыть галерею"
            >
              <img src={mainPhoto} alt={`${currentModel.name} ${currentModel.area}м²`} className="h-full w-full object-cover" draggable={false} loading="eager" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/40" />
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows */}
        <button aria-label="Предыдущая" onClick={() => goToModel(-1)} className={`absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl ${glassPanelLight} flex items-center justify-center`}>
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
        <button aria-label="Следующая" onClick={() => goToModel(1)} className={`absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl ${glassPanelLight} flex items-center justify-center`}>
          <ChevronRight className="h-5 w-5 text-white" />
        </button>

        {/* Action rail (right side) */}
        <aside className="absolute right-3 z-30 flex flex-col items-center gap-2.5" style={{ bottom: "calc(20px + env(safe-area-inset-bottom))" }}>
          <ActionButton icon={Images} label="Фото" onClick={() => setShowGallery(true)} />
          <ActionButton icon={FileText} label="Заявка" variant="primary" onClick={() => setContactOpen(true)} />
          <ActionButton icon={MessageCircle} label="WA" onClick={handleWhatsApp} />
          <ActionButton icon={Send} label="TG" onClick={handleTelegram} />
          <ActionButton icon={Phone} label="Call" onClick={handleCall} />
        </aside>

        {/* Bottom info panel */}
        <section className="absolute left-0 right-20 z-20" style={{ bottom: "calc(20px + env(safe-area-inset-bottom))" }}>
          <div className="px-4">
            <div className={`inline-block rounded-2xl ${glassPanel} p-4`}>
              {/* Model header */}
              <div className="flex items-center gap-3 mb-3">
                <HouseSchematic model={currentModel} size="md" />
                <div>
                  <div className="flex items-baseline gap-2">
                    <h1 className="text-xl font-bold text-white">{currentModel.name}</h1>
                    <span className="text-xl font-bold text-primary">{currentModel.area}м²</span>
                  </div>
                  <p className="text-sm text-white/50">{currentModel.floors === 1 ? "Одноэтажный" : "Двухэтажный"} barnhouse</p>
                </div>
              </div>

              {/* Info chips */}
              <div className="flex flex-wrap gap-1.5">
                <InfoChip icon={<FloorIcon floors={currentModel.floors} />} value={currentModel.floors} label="эт" />
                <InfoChip icon={<BedroomIcon />} value={currentModel.bedrooms} label="сп" />
                <InfoChip icon={<BathroomIcon />} value={currentModel.bathrooms} label="с/у" />
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
              className="absolute inset-0 z-40 bg-charcoal/98 backdrop-blur-2xl flex flex-col"
              style={{ paddingTop: "env(safe-area-inset-top)" }}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <button aria-label="Закрыть" onClick={() => setShowGallery(false)} className={`w-10 h-10 rounded-xl ${glassPanelLight} flex items-center justify-center`}>
                  <X className="h-5 w-5 text-white/80" />
                </button>
                <div className="text-center">
                  <div className="text-base font-semibold text-white">{currentModel.name} <span className="text-primary">{currentModel.area}м²</span></div>
                  <div className="text-xs text-white/40">Реальные фото первыми</div>
                </div>
                <div className="w-10" />
              </div>

              <div className="p-4">
                <div className={`flex gap-1 rounded-xl ${glassPanel} p-1`}>
                  <button
                    onClick={() => setGalleryTab("photos")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                      galleryTab === "photos" ? "bg-primary text-charcoal shadow-sm" : "text-white/60"
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                    Фото ({allPhotos.length})
                  </button>
                  <button
                    onClick={() => setGalleryTab("plans")}
                    disabled={floorPlans.length === 0}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                      floorPlans.length === 0 ? "text-white/20 cursor-not-allowed" :
                      galleryTab === "plans" ? "bg-primary text-charcoal shadow-sm" : "text-white/60"
                    }`}
                  >
                    <Layers className="h-4 w-4" />
                    Планы ({floorPlans.length})
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 pt-0 pb-8">
                <div className="grid grid-cols-2 gap-2">
                  {(galleryTab === "photos" ? allPhotos : floorPlans).map((photo, idx) => (
                    <motion.button
                      key={photo}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      onClick={() => { setLightboxImage(photo); setLightboxIndex(idx); }}
                      className="aspect-[4/3] rounded-xl overflow-hidden relative group"
                    >
                      <img src={photo} alt={`${currentModel.name} — ${idx + 1}`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className={`absolute bottom-2 right-2 w-8 h-8 rounded-lg ${glassPanelLight} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <Maximize2 className="h-4 w-4 text-white" />
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
            <ZoomableLightbox
              photos={lightboxPhotos}
              currentIndex={lightboxIndex}
              onClose={() => setLightboxImage(null)}
              onIndexChange={setLightboxIndex}
            />
          )}
        </AnimatePresence>

        {/* Model picker */}
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
