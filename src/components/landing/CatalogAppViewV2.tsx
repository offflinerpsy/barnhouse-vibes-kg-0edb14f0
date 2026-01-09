/**
 * ERA Mobile Catalog V2 — Simplified UX
 * Changes from V1:
 * - Right rail: only Photo + Plan buttons (2 instead of 6)
 * - Bottom: 3 clear buttons - Catalog, Contact, Submit
 * - Contact button expands to show Call/WA/TG options
 * - No TG icon on submit button, cleaner design
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
  PhoneCall,
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
          {parseInt(model.bedrooms) >= 2 && <rect x="6" y="14" width="4" height="4" rx="0.5" fill="hsl(var(--primary) / 0.25)"/>}
          {parseInt(model.bedrooms) >= 3 && <rect x="22" y="14" width="4" height="4" rx="0.5" fill="hsl(var(--primary) / 0.25)"/>}
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

const glassPanel = "bg-white/[0.08] backdrop-blur-2xl border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.3)]";
const glassPanelLight = "bg-white/[0.06] backdrop-blur-xl border border-white/[0.1]";
const glassPanelUltraLight = "bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]";

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

// Simplified action button - clearer, more button-like
const ActionButtonV2 = forwardRef<HTMLButtonElement, {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}>(({ icon: Icon, label, onClick, disabled = false }, ref) => (
  <motion.button 
    ref={ref} 
    onClick={disabled ? undefined : onClick} 
    disabled={disabled}
    className={`flex items-center gap-2 px-4 py-3 rounded-2xl ${glassPanel} ${disabled ? "opacity-40 cursor-not-allowed" : "active:scale-95"} transition-all`}
    whileTap={disabled ? {} : { scale: 0.95 }}
  >
    <Icon className="h-5 w-5 text-primary" />
    <span className="text-sm font-medium text-white">{label}</span>
  </motion.button>
));
ActionButtonV2.displayName = "ActionButtonV2";

const InfoChip = forwardRef<HTMLDivElement, {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}>(({ icon, value, label }, ref) => (
  <div ref={ref} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full whitespace-nowrap ${glassPanelLight}`}>
    <span className="text-primary shrink-0">{icon}</span>
    <span className="text-sm font-semibold text-white">{value}</span>
    <span className="text-xs text-white/50">{label}</span>
  </div>
));
InfoChip.displayName = "InfoChip";

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
        <button onClick={onClose} className={`w-10 h-10 rounded-xl ${glassPanelLight} flex items-center justify-center`}>
          <X className="h-5 w-5 text-white/80" />
        </button>
        <div className="text-center text-white/70 text-sm">
          {currentIndex + 1} / {photos.length}
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          onPanEnd={handlePanEnd}
          style={{ touchAction: scale > 1 ? "none" : "pan-y" }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={photos[currentIndex]}
              src={photos[currentIndex]}
              alt={`${model.name} ${currentIndex + 1}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="max-h-full max-w-full object-contain"
              style={{ transform: `scale(${scale})` }}
              draggable={false}
            />
          </AnimatePresence>
        </motion.div>

        <button onClick={goPrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-black/50 flex items-center justify-center">
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-black/50 flex items-center justify-center">
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </div>

      <div className="p-4 flex justify-center gap-3">
        <button onClick={() => setScale(s => Math.max(1, s - 0.5))} className={`px-4 py-2 rounded-xl ${glassPanelLight} text-white/70 text-sm`}>−</button>
        <span className="px-4 py-2 text-white/50 text-sm">{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale(s => Math.min(3, s + 0.5))} className={`px-4 py-2 rounded-xl ${glassPanelLight} text-white/70 text-sm`}>+</button>
      </div>
    </motion.div>
  );
}

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
  const [contactMethods, setContactMethods] = useState<string[]>(["whatsapp"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const toggleMethod = (m: string) => {
    setContactMethods((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Заполните все поля");
      return;
    }
    if (contactMethods.length === 0) {
      setError("Выберите способ связи");
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <motion.div
      className="absolute inset-0 z-[60] bg-charcoal/98 backdrop-blur-2xl flex flex-col"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <button onClick={onClose} className={`w-10 h-10 rounded-xl ${glassPanelLight} flex items-center justify-center`}>
          <X className="h-5 w-5 text-white/80" />
        </button>
        <h2 className="text-lg font-semibold text-white">Оставить заявку</h2>
        <div className="w-10" />
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-5 overflow-y-auto">
        <div className={`${glassPanel} rounded-2xl p-4 mb-6`}>
          <p className="text-white/50 text-sm">Интересующая модель:</p>
          <p className="text-lg font-bold text-white mt-1">{modelName} <span className="text-primary">{modelArea}м²</span></p>
        </div>

        <div className="space-y-5 flex-1">
          <div>
            <label className="block text-sm text-white/60 mb-2">Ваше имя</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите имя"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Телефон</label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+996 XXX XXX XXX"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-3">Как с вами связаться?</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { id: "phone", label: "Звонок", icon: Phone },
                { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
                { id: "telegram", label: "Telegram", icon: Send },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleMethod(id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${
                    contactMethods.includes(id)
                      ? "bg-primary text-charcoal"
                      : "bg-white/5 text-white/60 border border-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm"
            >
              {error}
            </motion.p>
          )}
        </div>

        <div className="pt-4 pb-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 rounded-2xl bg-primary text-charcoal font-semibold text-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-charcoal/30 border-t-charcoal rounded-full"
              />
            ) : (
              "Отправить заявку"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

function SuccessScreen({ onClose }: { onClose: () => void }) {
  return (
    <motion.div 
      className="absolute inset-0 z-[100] bg-charcoal flex flex-col items-center justify-center px-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
      >
        <CheckCircle className="w-10 h-10 text-green-500" />
      </motion.div>
      <h2 className="text-2xl font-bold text-white mb-2">Заявка отправлена!</h2>
      <p className="text-white/60 text-center mb-8">Мы свяжемся с вами в ближайшее время</p>
      <Button
        onClick={onClose}
        className="px-8 py-3 rounded-full bg-primary text-charcoal font-semibold"
      >
        Закрыть
      </Button>
    </motion.div>
  );
}

export default function CatalogAppViewV2({ onClose }: CatalogAppViewV2Props) {
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showGallery, setShowGallery] = useState(false);
  const [galleryTab, setGalleryTab] = useState<"photos" | "plans">("photos");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  // NEW: Contact options expanded
  const [contactExpanded, setContactExpanded] = useState(false);

  const filteredModels = useMemo(() => applyCatalogFilter(ERA_MODELS, filter), [filter]);

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
    setContactExpanded(false);
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

  const catalogRef = useRef<HTMLDivElement>(null);

  return (
    <motion.section 
      ref={catalogRef}
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
      {/* Close button */}
      {onClose && (
        <motion.button
          aria-label="Закрыть каталог"
          onClick={() => { triggerHaptic(); onClose(); }}
          className="absolute top-0 right-0 z-50 w-14 h-14 flex items-center justify-center"
          style={{ marginTop: "calc(env(safe-area-inset-top) + 8px)", marginRight: "8px" }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div 
            className={`w-11 h-11 rounded-xl ${glassPanelLight} flex items-center justify-center`}
            animate={{ 
              boxShadow: [
                "0 0 0 0 rgba(255,255,255,0)",
                "0 0 0 4px rgba(255,255,255,0.1)",
                "0 0 0 0 rgba(255,255,255,0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <X className="h-6 w-6 text-white" />
          </motion.div>
        </motion.button>
      )}

      {/* Model indicator dots */}
      <div className="absolute top-0 left-0 right-14 z-40 px-4 flex justify-center gap-1.5" style={{ paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}>
        {filteredModels.map((model, idx) => (
          <button
            key={model.id}
            onClick={() => { triggerHaptic(); setDirection(idx > safeIndex ? 1 : -1); setCurrentModelIndex(idx); }}
            className={`w-2 h-2 rounded-full transition-all ${idx === safeIndex ? "bg-primary w-6" : "bg-white/30"}`}
          />
        ))}
      </div>

      {/* Top filter */}
      <header className="absolute top-0 left-0 right-14 z-30" style={{ paddingTop: "calc(env(safe-area-inset-top) + 20px)" }}>
        <div className="px-3 pt-2">
          <div className="flex items-center gap-2">
            <nav className="flex-1 flex justify-center">
              <div className={`inline-flex items-center gap-2 rounded-full ${glassPanel} py-1 pl-3 pr-1`}>
                <span className="text-xs font-medium text-white/50 whitespace-nowrap">Фильтр:</span>
                <div className="flex gap-0.5">
                  {([
                    { id: "all" as const, label: "Все" },
                    { id: "1-floor" as const, label: "1эт" },
                    { id: "2-floor" as const, label: "2эт" },
                    { id: "business" as const, label: "Биз." },
                  ] as const).map((f) => (
                    <button
                      key={f.id}
                      onClick={() => { setFilter(f.id); setCurrentModelIndex(0); }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        filter === f.id
                          ? "bg-primary text-charcoal shadow-sm"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main photo */}
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
            <button 
              onClick={handleMainPhotoTap} 
              className="absolute inset-0 w-full h-full cursor-pointer"
              aria-label="Открыть галерею"
            >
              <ImageWithSkeleton 
                src={mainPhoto} 
                alt={`${currentModel.name} ${currentModel.area}м²`} 
                className="h-full w-full object-cover object-[center_70%]" 
                draggable={false} 
                loading="eager" 
              />
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

        {/* RIGHT SIDE: Only 2 buttons - Photo & Plan */}
        <aside className="absolute right-3 z-30 flex flex-col items-end gap-3" style={{ bottom: "calc(200px + env(safe-area-inset-bottom))" }}>
          <ActionButtonV2 
            icon={Images} 
            label="Фото" 
            onClick={() => { setGalleryTab("photos"); setShowGallery(true); }} 
          />
          <ActionButtonV2 
            icon={Layers} 
            label="План" 
            onClick={() => { setGalleryTab("plans"); setShowGallery(true); }} 
            disabled={floorPlans.length === 0}
          />
        </aside>

        {/* Bottom info panel */}
        <section className="absolute left-0 right-0 z-20" style={{ bottom: "calc(130px + env(safe-area-inset-bottom))" }}>
          <div className="px-3">
            <div className={`inline-block rounded-xl ${glassPanelUltraLight} px-3 py-2`}>
              <div className="flex items-center gap-2.5">
                <HouseSchematic model={currentModel} size="sm" />
                <div className="flex items-baseline gap-2">
                  <h1 className="text-lg font-bold text-white">{currentModel.name}</h1>
                  <span className="text-lg font-bold text-primary">{currentModel.area}м²</span>
                </div>
              </div>
              <p className="text-xs text-white/40 mt-0.5 mb-1.5">{currentModel.floors === 1 ? "Одноэтажный" : "Двухэтажный"} barnhouse</p>
              <div className="flex flex-nowrap gap-1">
                <InfoChip icon={<FloorIcon floors={currentModel.floors} />} value={currentModel.floors} label="эт" />
                <InfoChip icon={<BedroomIcon />} value={currentModel.bedrooms} label="сп" />
                <InfoChip icon={<BathroomIcon />} value={currentModel.bathrooms} label="с/у" />
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM: 3 clear buttons - Catalog, Contact, Submit */}
        <div className="absolute left-3 right-3 z-30 flex flex-col gap-2" style={{ bottom: "calc(8px + env(safe-area-inset-bottom))" }}>
          {/* Contact options - expandable */}
          <AnimatePresence>
            {contactExpanded && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="flex justify-center gap-3"
              >
                <motion.button
                  onClick={handleCall}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl ${glassPanel}`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-medium text-white">Позвонить</span>
                </motion.button>
                <motion.button
                  onClick={handleWhatsApp}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl ${glassPanel}`}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-medium text-white">WhatsApp</span>
                </motion.button>
                <motion.button
                  onClick={handleTelegram}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl ${glassPanel}`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="h-5 w-5 text-blue-400" />
                  <span className="text-sm font-medium text-white">Telegram</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main 3 buttons row */}
          <div className="flex items-stretch gap-2">
            {/* Catalog picker */}
            <motion.button
              onClick={() => { triggerHaptic(); setModelPickerOpen(true); }}
              className={`flex-1 rounded-2xl ${glassPanel} active:scale-[0.98] transition-transform`}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center py-3 px-3">
                <ChevronUp className="h-4 w-4 text-white/50 mb-1" />
                <div className="flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-white">Каталог</span>
                </div>
                <span className="text-xs text-white/40 mt-0.5">
                  {safeIndex + 1} из {filteredModels.length}
                </span>
              </div>
            </motion.button>

            {/* Contact button - expands options */}
            <motion.button
              onClick={() => { triggerHaptic(); setContactExpanded(!contactExpanded); }}
              className={`flex-1 rounded-2xl ${contactExpanded ? "bg-white/20" : glassPanel} active:scale-[0.98] transition-all`}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center py-3 px-3">
                <PhoneCall className={`h-5 w-5 mb-1 ${contactExpanded ? "text-primary" : "text-white/70"}`} />
                <span className={`text-sm font-medium ${contactExpanded ? "text-white" : "text-white/80"}`}>Связаться</span>
                <span className="text-xs text-white/40 mt-0.5">WA • TG • ☎</span>
              </div>
            </motion.button>

            {/* Submit application - primary action, NO icon */}
            <motion.button
              onClick={() => { triggerHaptic(); setShowContactForm(true); }}
              className="flex-1 rounded-2xl bg-primary active:scale-[0.98] transition-transform"
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(212,175,55,0)",
                  "0 0 0 6px rgba(212,175,55,0.3)",
                  "0 0 0 0 rgba(212,175,55,0)"
                ]
              }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
            >
              <div className="flex flex-col items-center justify-center py-3 px-3 h-full">
                <span className="text-base font-bold text-charcoal">Заявка</span>
                <span className="text-xs text-charcoal/70 mt-0.5">консультация</span>
              </div>
            </motion.button>
          </div>
        </div>

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
                  <div className="text-base font-semibold text-white">{currentModel.name} <span className="text-primary leading-snug inline-block pb-[1px]">{currentModel.area}м²</span></div>
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
      </motion.main>
    </motion.section>
  );
}
