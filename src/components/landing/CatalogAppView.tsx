/**
 * ERA Mobile Catalog V2 — iOS-style UX (Full Refactor)
 * 
 * Key changes:
 * - Image doesn't go to bottom — blur footer area below
 * - iOS-style blur footer with 2 buttons: Call & Message
 * - Call button becomes SOLID when expanded (not semi-transparent)
 * - Filter + Catalog merged into one beautiful top bar
 * - Photo/Plan buttons on right side, elegant design
 */

import { useCallback, useEffect, useMemo, useRef, useState, forwardRef } from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Images,
  Phone,
  Send,
  MessageCircle,
  X,
  Maximize2,
  Layers,
  CheckCircle,
  ChevronUp,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  CATALOG_MODELS, 
  CatalogModel, 
  FilterType, 
  applyCatalogFilter,
} from "@/data/catalog-models";

interface CatalogAppViewV2Props {
  onClose?: () => void;
}

type EraModel = CatalogModel;
const ERA_MODELS = CATALOG_MODELS;

const SWIPE_X = 70;
const SWIPE_Y = 90;

function getAllPhotos(model: EraModel): string[] {
  const photos: string[] = [model.coverImage];
  for (let i = 1; i <= model.galleryExtraCount; i++) {
    photos.push(`/catalog/${model.catalogPath}/gallery-extra/extra-${i}.webp`);
  }
  for (let i = 1; i <= model.galleryCount; i++) {
    photos.push(`/catalog/${model.catalogPath}/gallery/${i}.webp`);
  }
  return photos;
}

function getFloorPlans(model: EraModel): string[] {
  return model.floorPlanFiles
    .filter(f => f.ext === "webp")
    .map(f => `/catalog/${model.catalogPath}/floor-plan/${f.name}.${f.ext}`);
}

// Glass styles
const glassPanel = "bg-white/[0.12] backdrop-blur-2xl border border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.3)]";
const glassPanelLight = "bg-white/[0.08] backdrop-blur-xl border border-white/[0.12]";

// Footer is now multi-layered glass — no single class needed, structure in JSX

const ImageWithSkeleton = forwardRef<HTMLDivElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  function ImageWithSkeleton({ src, alt, className = "", ...props }, ref) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
      <div ref={ref} className="relative w-full h-full">
        {!loaded && !error && (
          <div className="absolute inset-0 bg-white/5 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          </div>
        )}
        <img
          src={src}
          alt={alt}
          className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          {...props}
        />
      </div>
    );
  }
);
ImageWithSkeleton.displayName = "ImageWithSkeleton";

// Floor/Bedroom/Bathroom icons
function FloorIcon({ floors }: { floors: number }) {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      {floors === 1 ? (
        <path d="M8 2 L2 7 L2 14 L14 14 L14 7 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
      ) : (
        <>
          <path d="M8 1 L2 5 L2 15 L14 15 L14 5 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
          <line x1="2" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
        </>
      )}
    </svg>
  );
}

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

// Animated Photo Button with cycling text
function AnimatedPhotoButton({ onClick }: { onClick: () => void }) {
  const [textIndex, setTextIndex] = useState(0);
  const texts = ["Фото", "Смотреть"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.button
      onClick={onClick}
      className="w-16 h-16 rounded-full bg-white/25 backdrop-blur-xl border border-white/40 flex flex-col items-center justify-center gap-0.5 shadow-lg"
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        animate={{ rotateY: [0, 180, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Images className="h-6 w-6 text-white drop-shadow-md" />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.span
          key={texts[textIndex]}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          className="text-[10px] text-white font-semibold drop-shadow-md"
        >
          {texts[textIndex]}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

// Animated Plan Button with cycling text
function AnimatedPlanButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  const [textIndex, setTextIndex] = useState(0);
  const texts = ["План", "Смотреть"];
  
  useEffect(() => {
    if (disabled) return;
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [disabled]);

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`w-16 h-16 rounded-full bg-white/25 backdrop-blur-xl border border-white/40 flex flex-col items-center justify-center gap-0.5 shadow-lg ${disabled ? "opacity-40" : ""}`}
      whileTap={!disabled ? { scale: 0.9 } : {}}
    >
      <motion.div
        animate={!disabled ? { rotateY: [0, 180, 360] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Layers className="h-6 w-6 text-white drop-shadow-md" />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.span
          key={disabled ? "План" : texts[textIndex]}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          className="text-[10px] text-white font-semibold drop-shadow-md"
        >
          {disabled ? "План" : texts[textIndex]}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

// Swipe Hint Animation - shows hand gesture hint
function SwipeHintAnimation() {
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    // Hide after 3 seconds
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none"
      style={{ bottom: "50%" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex items-center gap-2 text-white/60"
        animate={{ 
          x: [0, -30, 0, 30, 0],
        }}
        transition={{ 
          duration: 2,
          repeat: 2,
          ease: "easeInOut"
        }}
        onAnimationComplete={() => setShow(false)}
      >
        {/* Hand icon */}
        <motion.svg 
          width="32" 
          height="32" 
          viewBox="0 0 24 24" 
          fill="none"
          className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
        >
          <path 
            d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v1M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-5.9-2.4L2.3 15a2 2 0 0 1 .3-2.8 2 2 0 0 1 2.8.3L6 13V6" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="rgba(255,255,255,0.1)"
          />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
}

// Model Picker Sheet
const ModelPickerSheet = forwardRef<HTMLDivElement, {
  open: boolean;
  onClose: () => void;
  models: EraModel[];
  currentModelId: string;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onSelect: (id: string, filter: FilterType) => void;
}>(function ModelPickerSheet(
  { open, onClose, models, currentModelId, activeFilter, onFilterChange, onSelect },
  ref
) {
  const [sheetFilter, setSheetFilter] = useState<FilterType>(activeFilter);

  useEffect(() => {
    if (open) setSheetFilter(activeFilter);
  }, [activeFilter, open]);

  const setAndSyncFilter = useCallback(
    (next: FilterType) => {
      setSheetFilter(next);
      onFilterChange(next);
    },
    [onFilterChange]
  );

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 80) {
      onClose();
    }
  };

  const triggerHaptic = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(10);
  }, []);

  const filteredSheetModels = useMemo(
    () => applyCatalogFilter(models, sheetFilter),
    [models, sheetFilter]
  );

  if (!open) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40"
    >
      <button
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 350 }}
        className={`absolute left-0 right-0 bottom-0 rounded-t-[28px] ${glassPanel} bg-charcoal/95 flex flex-col`}
        style={{
          height: "85vh",
          maxHeight: "calc(100% - env(safe-area-inset-top) - 40px)",
        }}
      >
        <motion.div
          className="pt-3 pb-2 cursor-grab active:cursor-grabbing flex-shrink-0"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.3 }}
          onDragEnd={handleDragEnd}
        >
          <div className="mx-auto h-1.5 w-12 rounded-full bg-white/30" />
        </motion.div>

        <div className="px-5 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Grid3X3 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">Выбор модели</h3>
            </div>
            <button
              onClick={onClose}
              className={`w-10 h-10 rounded-xl ${glassPanelLight} flex items-center justify-center`}
            >
              <X className="h-5 w-5 text-white/80" />
            </button>
          </div>
        </div>

        <div className="px-4 pb-3 flex-shrink-0">
          <div className={`flex gap-1 rounded-xl ${glassPanelLight} p-1`}>
            {([
              { id: "all" as const, label: "Все" },
              { id: "1-floor" as const, label: "1эт" },
              { id: "2-floor" as const, label: "2эт" },
              { id: "business" as const, label: "Биз." },
            ] as const).map((f) => (
              <button
                key={f.id}
                onClick={() => setAndSyncFilter(f.id)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  sheetFilter === f.id
                    ? "bg-primary text-charcoal shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pt-3 flex flex-col gap-2 overflow-y-auto flex-1 overscroll-contain touch-pan-y" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 100px)" }}>
          {filteredSheetModels.map((m) => {
            const active = m.id === currentModelId;
            const thumb = m.coverImage;
            const isTwoFloors = m.floors === 2;
            return (
              <motion.button
                key={m.id}
                onClick={() => {
                  triggerHaptic();
                  onSelect(m.id, sheetFilter);
                }}
                animate={{ scale: active ? 1.02 : 1, y: active ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`relative flex items-center gap-4 p-3 rounded-xl transition-colors ${
                  active
                    ? "bg-primary/25 ring-2 ring-primary shadow-xl shadow-primary/30"
                    : `${glassPanelLight} hover:bg-white/10`
                }`}
              >
                <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-charcoal/50">
                  <ImageWithSkeleton
                    src={thumb}
                    alt={m.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {isTwoFloors && (
                    <div className="absolute top-1 right-1 bg-primary text-charcoal rounded px-1.5 py-0.5 text-[10px] font-bold shadow-lg">
                      2эт
                    </div>
                  )}
                  {m.id === "model-resto" && (
                    <div className="absolute top-1 right-1 bg-amber-500 text-charcoal rounded px-1.5 py-0.5 text-[10px] font-bold shadow-lg">
                      HoReCa
                    </div>
                  )}
                </div>

                <div className="flex-1 flex items-center justify-between min-w-0">
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">{m.name}</span>
                    </div>
                    <div className="text-sm text-white/60 mt-0.5">
                      {m.id === "model-resto"
                        ? "Ресторан • Кафе"
                        : `${m.bedrooms}сп • ${m.bathrooms}с/у • ${m.floors}эт`}
                    </div>
                  </div>
                  <span className="text-lg font-bold text-primary leading-snug inline-block pb-[1px]">
                    {m.area}м²
                  </span>
                </div>

                {active && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-primary/10 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.button>
            );
          })}

          {filteredSheetModels.length === 0 && (
            <div className="flex-1 flex items-center justify-center py-12">
              <p className="text-white/40 text-sm">Нет моделей в этой категории</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});
ModelPickerSheet.displayName = "ModelPickerSheet";

const slideVariants = {
  enter: (dir: 1 | -1) => ({ x: dir > 0 ? 60 : -60, opacity: 0, scale: 1.02 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: 1 | -1) => ({ x: dir > 0 ? -60 : 60, opacity: 0, scale: 0.98 }),
};

// Zoomable Lightbox
function ZoomableLightbox({
  photos,
  currentIndex,
  onClose,
  onIndexChange,
  model,
}: {
  photos: string[];
  currentIndex: number;
  onClose: () => void;
  onIndexChange: (idx: number) => void;
  model: EraModel;
}) {
  const [scale, setScale] = useState(1);

  const goPrev = () => onIndexChange(currentIndex > 0 ? currentIndex - 1 : photos.length - 1);
  const goNext = () => onIndexChange(currentIndex < photos.length - 1 ? currentIndex + 1 : 0);

  const handlePanEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (scale > 1) return;
    const absX = Math.abs(info.offset.x);
    const absY = Math.abs(info.offset.y);
    if (absY > absX && absY > 100) {
      onClose();
      return;
    }
    if (absX > 60) {
      if (info.offset.x > 0) goPrev();
      else goNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex items-center justify-between p-4">
        <button 
          onClick={onClose}
          className={`w-10 h-10 rounded-xl ${glassPanelLight} flex items-center justify-center`}
        >
          <X className="h-5 w-5 text-white/80" />
        </button>
        <div className="text-center">
          <span className="text-sm text-white/60">{currentIndex + 1} / {photos.length}</span>
        </div>
        <div className="w-10" />
      </div>

      <motion.div 
        className="flex-1 flex items-center justify-center px-4"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handlePanEnd}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={photos[currentIndex]}
            src={photos[currentIndex]}
            alt={`${model.name} — ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-h-full max-w-full object-contain rounded-xl"
            style={{ touchAction: "pan-y pinch-zoom" }}
          />
        </AnimatePresence>
      </motion.div>

      <div className="flex justify-center gap-4 p-4 pb-8">
        <button onClick={goPrev} className={`w-12 h-12 rounded-xl ${glassPanelLight} flex items-center justify-center`}>
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button onClick={goNext} className={`w-12 h-12 rounded-xl ${glassPanelLight} flex items-center justify-center`}>
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </div>
    </motion.div>
  );
}

// Inline Mobile Contact Form
function InlineMobileContactForm({
  modelName,
  modelArea,
  onClose,
  onSuccess,
}: {
  modelName: string;
  modelArea: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col bg-charcoal/98 backdrop-blur-2xl"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <button
          onClick={onClose}
          className={`w-10 h-10 rounded-xl ${glassPanelLight} flex items-center justify-center`}
        >
          <X className="h-5 w-5 text-white/80" />
        </button>
        <h2 className="text-lg font-semibold text-white">Оставить заявку</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className={`rounded-2xl ${glassPanel} p-4 mb-6`}>
          <div className="text-sm text-white/60 mb-1">Выбранная модель</div>
          <div className="text-lg font-bold text-white">
            {modelName} <span className="text-primary">{modelArea}м²</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Ваше имя</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Как к вам обращаться?"
              className="h-14 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Телефон</label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+996 ___-___-___"
              className="h-14 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !name.trim() || !phone.trim()}
            className="w-full h-14 rounded-xl bg-primary text-charcoal font-bold text-base mt-6"
          >
            {isSubmitting ? "Отправка..." : "Отправить заявку"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}

// Success Screen
function SuccessScreen({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-charcoal/98 backdrop-blur-2xl p-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
      >
        <CheckCircle className="h-12 w-12 text-green-400" />
      </motion.div>
      <h2 className="text-2xl font-bold text-white mb-2">Заявка отправлена!</h2>
      <p className="text-white/60 text-center mb-8">Мы свяжемся с вами в ближайшее время</p>
      <Button onClick={onClose} className="h-14 px-8 rounded-xl bg-primary text-charcoal font-bold">
        Вернуться в каталог
      </Button>
    </motion.div>
  );
}

// ====== MAIN COMPONENT ======
export default function CatalogAppViewV2({ onClose }: CatalogAppViewV2Props) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryTab, setGalleryTab] = useState<"photos" | "plans">("photos");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [callExpanded, setCallExpanded] = useState(false);

  const filteredModels = useMemo(() => applyCatalogFilter(ERA_MODELS, filter), [filter]);
  const safeIndex = Math.min(currentModelIndex, filteredModels.length - 1);
  const currentModel = filteredModels[safeIndex] || ERA_MODELS[0];
  
  const allPhotos = useMemo(() => getAllPhotos(currentModel), [currentModel]);
  const floorPlans = useMemo(() => getFloorPlans(currentModel), [currentModel]);
  const mainPhoto = currentModel.coverImage;

  const triggerHaptic = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(10);
  }, []);

  // Preload
  useEffect(() => {
    allPhotos.slice(0, 3).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [allPhotos]);

  const goToModel = useCallback((dir: 1 | -1) => {
    triggerHaptic();
    setDirection(dir);
    setCurrentModelIndex((prev) => {
      const next = prev + dir;
      if (next < 0) return filteredModels.length - 1;
      if (next >= filteredModels.length) return 0;
      return next;
    });
  }, [filteredModels.length, triggerHaptic]);

  const handlePanEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const absX = Math.abs(info.offset.x);
    const absY = Math.abs(info.offset.y);
    if (absY > SWIPE_Y && absY > absX) return;
    if (absX > SWIPE_X) {
      if (info.offset.x > 0) goToModel(-1);
      else goToModel(1);
    }
  }, [goToModel]);

  const lightboxPhotos = galleryTab === "photos" ? allPhotos : floorPlans;

  const handleCall = () => { window.location.href = "tel:+996555123456"; };
  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Здравствуйте! Интересует ${currentModel.name} ${currentModel.area}м²`);
    window.open(`https://wa.me/996555123456?text=${text}`, "_blank");
  };
  const handleTelegram = () => {
    const text = encodeURIComponent(`Интересует ${currentModel.name} ${currentModel.area}м²`);
    window.open(`https://t.me/erahomes?text=${text}`, "_blank");
  };

  // Footer height for positioning elements above it
  const FOOTER_HEIGHT = 140; // approximate footer height for element positioning

  return (
    <motion.section 
      id="catalog-fullscreen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-charcoal text-white overflow-hidden z-50"
      style={{ 
        height: '100dvh',
        overscrollBehavior: 'contain'
      }}
    >
      {/* SVG Noise Filter - hidden, used by footer glass effect */}
      <svg className="hidden" aria-hidden="true">
        <defs>
          <filter id="noise-filter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.75" 
              numOctaves="4" 
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>

      {/* ========== HEADER: Filter bar on gradient over full-bleed photo ========== */}
      <header className="absolute top-0 left-0 right-0 z-40">
        {/* Gradient overlay for text readability */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 85%, transparent 100%)",
            height: "140px",
          }}
        />
        {/* Content: Filter bar with safe area padding */}
        <motion.div 
          className="relative z-10 flex items-center justify-center"
          style={{ 
            paddingTop: "calc(env(safe-area-inset-top) + 12px)",
            paddingBottom: "12px",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.1 }}
        >
          <div className="mx-3 w-full rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15"
            style={{ transform: "translate3d(0, 0, 0)" }}
          >
            <div className="flex items-center justify-between px-3 py-3">
              {/* Left: Filter tabs */}
              <div className="flex items-center gap-0.5 flex-shrink-0">
                {([
                  { id: "all" as const, label: "Все" },
                  { id: "1-floor" as const, label: "1эт" },
                  { id: "2-floor" as const, label: "2эт" },
                  { id: "business" as const, label: "Биз." },
                ] as const).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => { 
                      triggerHaptic();
                      setFilter(f.id); 
                      setCurrentModelIndex(0); 
                    }}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filter === f.id
                        ? "bg-primary text-charcoal"
                        : "text-white/60 active:bg-white/10"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              
              {/* Center: Current model - clickable, opens picker */}
              <button 
                onClick={() => { triggerHaptic(); setModelPickerOpen(true); }}
                className="flex items-center gap-1.5 min-w-0 px-2 py-1 rounded-lg active:bg-white/10 transition-colors"
              >
                <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-[80px] sm:max-w-[120px]">
                  {currentModel.name}
                </span>
                <span className="text-xs sm:text-sm font-bold text-primary flex-shrink-0">
                  {currentModel.area}м²
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-white/50 flex-shrink-0" />
              </button>
              
              {/* Right: Close button */}
              {onClose && (
                <motion.button
                  aria-label="Закрыть каталог"
                  onClick={() => { triggerHaptic(); onClose(); }}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5 text-white" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </header>

      {/* MAIN PHOTO AREA - full bleed to top edge */}
      <motion.div 
        className="absolute inset-0" 
        onPanEnd={handlePanEnd}
      >
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
            <button 
              onClick={() => { setGalleryTab("photos"); setShowGallery(true); }}
              className="absolute inset-0 w-full h-full cursor-pointer"
              aria-label="Открыть галерею"
            >
              <ImageWithSkeleton 
                src={mainPhoto} 
                alt={`${currentModel.name} ${currentModel.area}м²`} 
                className="h-full w-full object-cover object-[center_60%]" 
                draggable={false} 
                loading="eager" 
              />
              {/* Subtle gradient for text readability - no harsh colors */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows - elegant chevrons with haptic feedback */}
        <motion.button 
          aria-label="Предыдущая" 
          onClick={() => { triggerHaptic(); goToModel(-1); }} 
          className="absolute left-2 z-20 top-1/2 -translate-y-1/2"
          whileTap={{ scale: 0.9, x: -3 }}
        >
          <motion.div
            animate={{ x: [0, -4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronLeft className="h-9 w-9 text-white/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]" strokeWidth={2} />
          </motion.div>
        </motion.button>
        <motion.button 
          aria-label="Следующая" 
          onClick={() => { triggerHaptic(); goToModel(1); }} 
          className="absolute right-2 z-20 top-1/2 -translate-y-1/2"
          whileTap={{ scale: 0.9, x: 3 }}
        >
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronRight className="h-9 w-9 text-white/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]" strokeWidth={2} />
          </motion.div>
        </motion.button>

        {/* Swipe hint animation - shows on first view */}
        <SwipeHintAnimation />

        {/* RIGHT SIDE: Photo & Plan buttons - positioned in bottom-right, above model info */}
        <aside 
          className="absolute right-3 z-30 flex flex-col items-center gap-3 bottom-[170px]"
        >
          <AnimatedPhotoButton onClick={() => { setGalleryTab("photos"); setShowGallery(true); }} />
          <AnimatedPlanButton 
            onClick={() => { setGalleryTab("plans"); setShowGallery(true); }} 
            disabled={floorPlans.length === 0}
          />
        </aside>

        {/* Model info - NO PANEL, just text with shadow - positioned above footer */}
        <div 
          className="absolute left-3 z-20"
          style={{ bottom: `${FOOTER_HEIGHT + 16}px` }}
        >
          <div className="flex items-baseline gap-2 mb-1">
            <h1 className="text-lg font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{currentModel.name}</h1>
            <span className="text-lg font-bold text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{currentModel.area}м²</span>
          </div>
          <div className="flex items-center gap-3 text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-1 whitespace-nowrap">
              <FloorIcon floors={currentModel.floors} />
              <span className="text-sm">{currentModel.floors}эт</span>
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <BedroomIcon />
              <span className="text-sm">{currentModel.bedrooms === "студия" ? "студия" : `${currentModel.bedrooms}сп`}</span>
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <BathroomIcon />
              <span className="text-sm">{currentModel.bathrooms}с/у</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ========== TRANSITION VEIL: Multi-layer fade from image to footer ========== */}
      <div 
        className="absolute left-0 right-0 bottom-0 z-[35] pointer-events-none"
        style={{ 
          height: callExpanded ? "380px" : "300px",
          transition: "height 0.3s ease-out",
          WebkitMaskImage: "linear-gradient(to top, black 0%, black 25%, transparent 100%)",
          maskImage: "linear-gradient(to top, black 0%, black 25%, transparent 100%)",
        }}
      >
        {/* Layer 1: Blur effect over photo - iOS Safari fix with translate3d */}
        <div 
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(40px) saturate(1.5)",
            WebkitBackdropFilter: "blur(40px) saturate(1.5)",
            transform: "translate3d(0, 0, 0)",
          }}
        />
        {/* Layer 2: Dark tint gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent" />
      </div>

      {/* ========== iOS-STYLE MULTI-LAYER GLASS FOOTER (5 layers) ========== */}
      <footer 
        className="absolute left-0 right-0 bottom-0 z-40 overflow-hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Layer 1: Blurred image underlay - continuation of photo "under glass" */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${mainPhoto})`,
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            transform: "scale(1.5)",
            filter: "blur(30px) brightness(0.6)",
            opacity: 0.5,
          }}
        />
        
        {/* Layer 2: Glass tint - MORE transparent when expanded, iOS Safari fix */}
        <div 
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: callExpanded ? "rgba(0, 0, 0, 0.25)" : "rgba(0, 0, 0, 0.45)",
            backdropFilter: callExpanded ? "blur(80px) saturate(2)" : "blur(60px) saturate(1.8)",
            WebkitBackdropFilter: callExpanded ? "blur(80px) saturate(2)" : "blur(60px) saturate(1.8)",
            transform: "translate3d(0, 0, 0)",
          }}
        />
        
        {/* Layer 3: Top highlight - soft glow instead of hard border */}
        <div 
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.12) 50%, transparent 95%)",
          }}
        />
        
        {/* Layer 4: Noise texture - realistic matte glass grain */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
          style={{
            filter: "url(#noise-filter)",
            transform: "scale(1.5)",
          }}
        />
        
        {/* Content sits on top of all layers */}
        <div className="relative z-10">
          {/* Call options - appears above when expanded */}
          <AnimatePresence>
            {callExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 20, height: 0 }}
                className="px-4 pb-3 pt-4 flex justify-center gap-4"
              >
                <motion.button
                  onClick={handleCall}
                  className="flex flex-col items-center gap-1.5"
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs text-white/70 font-medium">Звонок</span>
                </motion.button>
                
                <motion.button
                  onClick={handleWhatsApp}
                  className="flex flex-col items-center gap-1.5"
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs text-white/70 font-medium">WhatsApp</span>
                </motion.button>
                
                <motion.button
                  onClick={handleTelegram}
                  className="flex flex-col items-center gap-1.5"
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs text-white/70 font-medium">Telegram</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main 2 buttons - iOS Contact style */}
          <div className="px-4 py-4 flex gap-3">
            {/* CALL button - iPhone green style with inset press effect */}
            <motion.button
              onClick={() => { triggerHaptic(); setCallExpanded(!callExpanded); }}
              className="btn-inset-press flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 transition-all relative overflow-hidden bg-[#34C759] shadow-lg shadow-[#34C759]/40"
              whileTap={{ 
                scale: 0.95,
                filter: "brightness(0.8)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Phone className="h-5 w-5 text-white" />
              <span className="font-bold text-white">
                Позвонить
              </span>
              <motion.div
                animate={{ rotate: callExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronUp className="h-4 w-4 text-white" />
              </motion.div>
            </motion.button>

            {/* MESSAGE button - primary gold */}
            <motion.button
              onClick={() => { triggerHaptic(); setShowContactForm(true); }}
              className="btn-inset-press flex-1 h-14 rounded-2xl bg-primary flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
              whileTap={{ 
                scale: 0.97,
                filter: "brightness(0.85)"
              }}
            >
              <MessageSquare className="h-5 w-5 text-charcoal" />
              <span className="font-semibold text-charcoal">Оставить заявку</span>
            </motion.button>
          </div>
        </div>
      </footer>

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
                  <Images className="h-4 w-4" />
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
                    <ImageWithSkeleton src={photo} alt={`${currentModel.name} — ${idx + 1}`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
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
            model={currentModel}
          />
        )}
      </AnimatePresence>

      {/* Model picker */}
      <AnimatePresence>
        {modelPickerOpen && (
          <ModelPickerSheet
            open={modelPickerOpen}
            onClose={() => setModelPickerOpen(false)}
            models={ERA_MODELS}
            currentModelId={currentModel.id}
            activeFilter={filter}
            onFilterChange={(next) => {
              setFilter(next);
              setCurrentModelIndex(0);
            }}
            onSelect={(id, appliedFilter) => {
              setFilter(appliedFilter);
              const nextModels = applyCatalogFilter(ERA_MODELS, appliedFilter);
              const idx = nextModels.findIndex((m) => m.id === id);
              if (idx >= 0) setCurrentModelIndex(idx);
              setModelPickerOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Contact Form */}
      <AnimatePresence>
        {showContactForm && !showSuccessScreen && (
          <InlineMobileContactForm
            modelName={currentModel.name}
            modelArea={String(currentModel.area)}
            onClose={() => setShowContactForm(false)}
            onSuccess={() => {
              setShowContactForm(false);
              setShowSuccessScreen(true);
            }}
          />
        )}
        {showSuccessScreen && (
          <SuccessScreen 
            onClose={() => {
              setShowSuccessScreen(false);
              if (onClose) onClose();
            }} 
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}
