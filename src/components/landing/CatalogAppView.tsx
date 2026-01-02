/**
 * ERA Mobile Catalog — Instagram/TikTok style
 * - Fullscreen photo
 * - Swipe left/right: switch models
 * - Swipe up: open gallery
 * - Persistent model picker + application form
 */

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import {
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  FileText,
  Grid3X3,
  Home,
  Bed,
  Bath,
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
  // Real photos first
  for (let i = 1; i <= model.galleryExtraCount; i++) {
    photos.push(`/catalog/${model.catalogPath}/gallery-extra/extra-${i}.webp`);
  }
  // Renders after
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
            ? "w-12 h-12 rounded-2xl bg-primary border border-primary/30 shadow-lg shadow-primary/20 flex items-center justify-center"
            : "w-12 h-12 rounded-2xl bg-charcoal/55 backdrop-blur-xl border border-warm-white/10 flex items-center justify-center"
        }
      >
        <Icon
          className={
            variant === "primary"
              ? "h-5 w-5 text-charcoal"
              : "h-5 w-5 text-warm-white"
          }
        />
      </div>
      <span className="text-[10px] font-medium text-warm-white/70 leading-none">
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
    <div className="flex-none inline-flex items-center gap-2 rounded-full bg-charcoal/55 backdrop-blur-xl border border-warm-white/10 px-3 py-2 whitespace-nowrap">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-xs font-semibold text-warm-white">
        {value}
        <span className="ml-1 text-warm-white/65 font-medium">{label}</span>
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
            className="absolute inset-0 bg-charcoal/70"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="absolute left-0 right-0 bottom-0 rounded-t-3xl bg-charcoal border-t border-warm-white/10"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="px-5 pt-3 pb-4">
              <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-warm-white/20" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-warm-white">
                    Выбор модели
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-2xl bg-charcoal/60 border border-warm-white/10 flex items-center justify-center"
                >
                  <X className="h-5 w-5 text-warm-white" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 max-h-[55vh] overflow-y-auto pr-1">
                {models.map((m) => {
                  const active = m.id === currentModelId;
                  return (
                    <button
                      key={m.id}
                      onClick={() => onSelect(m.id)}
                      className={
                        active
                          ? "flex items-center justify-between rounded-2xl px-4 py-3 bg-primary/15 border border-primary/30"
                          : "flex items-center justify-between rounded-2xl px-4 py-3 bg-charcoal/40 border border-warm-white/10 hover:border-warm-white/20"
                      }
                    >
                      <div className="text-left">
                        <div className="text-sm font-semibold text-warm-white">
                          {m.name}
                        </div>
                        <div className="text-xs text-warm-white/65">
                          {m.floors} эт. • {m.bedrooms} спальн. • {m.bathrooms} с/у
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-bold text-primary">
                          {m.area}м²
                        </div>
                        {active && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
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

  const goToModel = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setCurrentModelIndex((prev) => {
        const next = prev + dir;
        if (next < 0) return filteredModels.length - 1;
        if (next >= filteredModels.length) return 0;
        return next;
      });
      setShowGallery(false);
    },
    [filteredModels.length]
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
      className="fixed inset-0 z-50 bg-charcoal text-warm-white"
    >
      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />

      {/* Top bar */}
      <header className="absolute top-0 left-0 right-0 z-30 pt-[env(safe-area-inset-top)]">
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            {onClose && (
              <button
                aria-label="Закрыть"
                onClick={onClose}
                className="w-11 h-11 rounded-2xl bg-charcoal/60 backdrop-blur-xl border border-warm-white/10 flex items-center justify-center"
              >
                <X className="h-5 w-5 text-warm-white" />
              </button>
            )}

            {/* Filters */}
            <nav className="flex-1 flex justify-center">
              <div className="flex items-center gap-2 rounded-full bg-charcoal/55 backdrop-blur-xl border border-warm-white/10 p-1">
                {([
                  { id: "all" as const, label: "Все" },
                  { id: "1-floor" as const, label: "1 этаж" },
                  { id: "2-floor" as const, label: "2 этажа" },
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
                          ? "px-4 py-2 rounded-full bg-primary text-charcoal text-xs font-semibold"
                          : "px-4 py-2 rounded-full text-warm-white/80 text-xs font-semibold hover:text-warm-white"
                      }
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Model picker */}
            <button
              onClick={() => setModelPickerOpen(true)}
              className="h-11 px-3 rounded-2xl bg-charcoal/60 backdrop-blur-xl border border-warm-white/10 flex items-center gap-2"
            >
              <Home className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-warm-white whitespace-nowrap">
                Модели
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

            {/* Readability gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/25 to-charcoal/45" />
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        <button
          aria-label="Предыдущая модель"
          onClick={() => goToModel(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-charcoal/45 backdrop-blur-xl border border-warm-white/10 flex items-center justify-center"
        >
          <ChevronLeft className="h-5 w-5 text-warm-white" />
        </button>
        <button
          aria-label="Следующая модель"
          onClick={() => goToModel(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-charcoal/45 backdrop-blur-xl border border-warm-white/10 flex items-center justify-center"
        >
          <ChevronRight className="h-5 w-5 text-warm-white" />
        </button>

        {/* Action rail (TikTok-style) */}
        <aside
          className="absolute right-3 z-30 flex flex-col items-center gap-3"
          style={{ bottom: "calc(16px + env(safe-area-inset-bottom))" }}
        >
          <ActionButton
            icon={Images}
            label="Галерея"
            onClick={() => setShowGallery(true)}
          />
          <ActionButton
            icon={FileText}
            label="Заявка"
            variant="primary"
            onClick={() => setContactOpen(true)}
          />
          <ActionButton icon={MessageCircle} label="WhatsApp" onClick={handleWhatsApp} />
          <ActionButton icon={Send} label="Telegram" onClick={handleTelegram} />
          <ActionButton icon={Phone} label="Звонок" onClick={handleCall} />
        </aside>

        {/* Model info (caption) */}
        <section
          className="absolute left-0 right-0 z-20"
          style={{ bottom: "calc(16px + env(safe-area-inset-bottom))" }}
        >
          <div className="px-4 pr-24">
            <div className="max-w-[520px]">
              <div className="flex items-baseline gap-3">
                <h1 className="text-2xl font-bold text-warm-white tracking-tight">
                  {currentModel.name}
                </h1>
                <div className="text-xl font-bold text-primary">
                  {currentModel.area}м²
                </div>
              </div>

              <p className="mt-1 text-xs text-warm-white/70">
                {currentModel.floors === 1 ? "Одноэтажный" : "Двухэтажный"} • свайп ←→ модели • ↑ галерея
              </p>

              <div className="mt-3 -mx-1 px-1 flex gap-2 overflow-x-auto scrollbar-hide">
                <Chip icon={Home} value={String(currentModel.floors)} label="эт." />
                <Chip icon={Bed} value={String(currentModel.bedrooms)} label="спальн." />
                <Chip icon={Bath} value={String(currentModel.bathrooms)} label="с/у" />
              </div>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-charcoal/55 backdrop-blur-xl border border-warm-white/10 px-3 py-2">
                <ArrowUp className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-warm-white/80">
                  Поднимите вверх для сетки
                </span>
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
              className="absolute inset-0 z-40 bg-charcoal flex flex-col"
              style={{ paddingTop: "env(safe-area-inset-top)" }}
            >
              <div className="flex items-center justify-between p-4 border-b border-warm-white/10">
                <button
                  aria-label="Закрыть галерею"
                  onClick={() => setShowGallery(false)}
                  className="w-10 h-10 rounded-2xl bg-charcoal/60 border border-warm-white/10 flex items-center justify-center"
                >
                  <X className="h-5 w-5 text-warm-white" />
                </button>

                <div className="text-center">
                  <div className="text-sm font-semibold text-warm-white">
                    {currentModel.name}{" "}
                    <span className="text-primary">{currentModel.area}м²</span>
                  </div>
                  <div className="text-[11px] text-warm-white/60">Фото — сначала реальные, потом рендеры</div>
                </div>

                <div className="w-10" />
              </div>

              {/* Tabs */}
              <div className="p-4">
                <div className="flex gap-2 rounded-2xl bg-charcoal/55 backdrop-blur-xl border border-warm-white/10 p-1">
                  <button
                    onClick={() => setGalleryTab("photos")}
                    className={
                      galleryTab === "photos"
                        ? "flex-1 py-2.5 rounded-xl bg-primary text-charcoal text-xs font-semibold"
                        : "flex-1 py-2.5 rounded-xl text-warm-white/80 text-xs font-semibold"
                    }
                  >
                    <Grid3X3 className="h-4 w-4 inline mr-2" />
                    Фото ({allPhotos.length})
                  </button>
                  <button
                    onClick={() => setGalleryTab("plans")}
                    disabled={floorPlans.length === 0}
                    className={
                      floorPlans.length === 0
                        ? "flex-1 py-2.5 rounded-xl text-warm-white/30 text-xs font-semibold"
                        : galleryTab === "plans"
                        ? "flex-1 py-2.5 rounded-xl bg-primary text-charcoal text-xs font-semibold"
                        : "flex-1 py-2.5 rounded-xl text-warm-white/80 text-xs font-semibold"
                    }
                  >
                    <Ruler className="h-4 w-4 inline mr-2" />
                    Планировки ({floorPlans.length})
                  </button>
                </div>
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto p-4 pb-8">
                <div className="grid grid-cols-2 gap-2">
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
                      className="aspect-[4/3] rounded-2xl overflow-hidden relative"
                    >
                      <img
                        src={photo}
                        alt={`ERA ${currentModel.name} ${currentModel.area}м² — ${galleryTab === "photos" ? "фото" : "план"} ${idx + 1}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
                      <div className="absolute bottom-2 right-2 w-9 h-9 rounded-2xl bg-charcoal/55 backdrop-blur-xl border border-warm-white/10 flex items-center justify-center">
                        <Maximize2 className="h-4 w-4 text-warm-white" />
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
              className="absolute inset-0 z-50 bg-charcoal flex items-center justify-center"
              style={{ paddingTop: "env(safe-area-inset-top)" }}
            >
              <button
                aria-label="Закрыть полноэкранный просмотр"
                onClick={() => setLightboxImage(null)}
                className="absolute top-3 right-3 w-11 h-11 rounded-2xl bg-charcoal/60 backdrop-blur-xl border border-warm-white/10 flex items-center justify-center"
              >
                <X className="h-5 w-5 text-warm-white" />
              </button>

              <button
                aria-label="Предыдущее"
                onClick={() => navigateLightbox(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-charcoal/60 backdrop-blur-xl border border-warm-white/10 flex items-center justify-center"
              >
                <ChevronLeft className="h-5 w-5 text-warm-white" />
              </button>
              <button
                aria-label="Следующее"
                onClick={() => navigateLightbox(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-charcoal/60 backdrop-blur-xl border border-warm-white/10 flex items-center justify-center"
              >
                <ChevronRight className="h-5 w-5 text-warm-white" />
              </button>

              <motion.div
                key={lightboxPhotos[lightboxIndex]}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                onPanEnd={(_, info) => {
                  const absX = Math.abs(info.offset.x);
                  const absY = Math.abs(info.offset.y);
                  if (absX > absY && absX > SWIPE_X) {
                    navigateLightbox(info.offset.x > 0 ? -1 : 1);
                    return;
                  }
                  if (absY > absX && info.offset.y > SWIPE_Y) {
                    setLightboxImage(null);
                  }
                }}
                style={{ touchAction: "none" }}
                className="h-full w-full flex items-center justify-center p-4"
              >
                <img
                  src={lightboxPhotos[lightboxIndex]}
                  alt={`ERA ${currentModel.name} — полноэкранно`}
                  className="max-h-full max-w-full object-contain rounded-2xl"
                  draggable={false}
                  decoding="async"
                />
              </motion.div>

              <div
                className="absolute left-1/2 -translate-x-1/2 rounded-full bg-charcoal/60 backdrop-blur-xl border border-warm-white/10 px-4 py-2 text-xs font-semibold text-warm-white/80"
                style={{ bottom: "calc(16px + env(safe-area-inset-bottom))" }}
              >
                {lightboxIndex + 1} / {lightboxPhotos.length}
              </div>
            </motion.div>
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
