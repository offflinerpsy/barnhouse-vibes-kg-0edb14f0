/**
 * Gallery Component - Медиа-галерея с Ken Burns эффектом
 * Адаптировано из v0 creative-gallery-block для ERA Concept Home
 */

import { useState, useRef, useCallback, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, ChevronLeft, ChevronRight, ImageIcon, Video, Grid3X3 } from "lucide-react";
import { cn } from "../../lib/utils";
import { triggerHaptic } from "../../hooks/useHaptic";

/* ═══════════════════════════════════════════════════════════════════════════════
 * ТИПЫ ДАННЫХ
 * ═══════════════════════════════════════════════════════════════════════════════ */

type MediaItem = {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  category?: string;
  span?: "normal" | "wide" | "tall" | "large";
  kenBurnsDirection?: "zoom-in" | "zoom-out" | "pan-left" | "pan-right" | "pan-up" | "pan-down";
};

/* ═══════════════════════════════════════════════════════════════════════════════
 * КОНФИГУРАЦИЯ
 * ═══════════════════════════════════════════════════════════════════════════════ */

const CONFIG = {
  kenBurnsDuration: 12,
  kenBurnsScale: 1.15,
  kenBurnsPanOffset: 8,
  slideTransitionDuration: 300,
  swipeThreshold: 50,
  priorityLoadCount: 4,
};

type FilterType = "all" | "image" | "video";

/* ═══════════════════════════════════════════════════════════════════════════════
 * ДАННЫЕ ГАЛЕРЕИ — медиа-файлы ERA Concept
 * ═══════════════════════════════════════════════════════════════════════════════ */

const GALLERY_ITEMS: MediaItem[] = [
  {
    id: "1",
    type: "video",
    src: "/gallery/video-drone.mp4",
    poster: "/gallery/house-exterior-1.webp",
    title: "Полёт над нашими проектами",
    category: "Видео",
    span: "large",
  },
  {
    id: "2",
    type: "image",
    src: "/gallery/house-kyrgyzstan-1.webp",
    title: "Живи там, где горы",
    category: "Экстерьер",
    span: "tall",
    kenBurnsDirection: "pan-up",
  },
  {
    id: "3",
    type: "video",
    src: "/gallery/video-realtor.mp4",
    poster: "/gallery/house-exterior-2.webp",
    title: "Как мы строим ваш дом",
    category: "Видео",
    span: "normal",
  },
  {
    id: "4",
    type: "image",
    src: "/gallery/house-interior-1.webp",
    title: "Светло, просторно, уютно",
    category: "Интерьер",
    span: "wide",
    kenBurnsDirection: "pan-right",
  },
  {
    id: "5",
    type: "image",
    src: "/gallery/house-exterior-3.webp",
    title: "Качество без переплат",
    category: "Экстерьер",
    span: "normal",
    kenBurnsDirection: "pan-left",
  },
  {
    id: "6",
    type: "image",
    src: "/gallery/house-kyrgyzstan-2.webp",
    title: "Дом твоей мечты — реальность",
    category: "Экстерьер",
    span: "normal",
    kenBurnsDirection: "zoom-in",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════════
 * ХУКИ
 * ═══════════════════════════════════════════════════════════════════════════════ */

function useInView(options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
      if (entry.isIntersecting) {
        setHasBeenInView(true);
      }
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView, hasBeenInView };
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * ГЛАВНЫЙ КОМПОНЕНТ ГАЛЕРЕИ
 * ═══════════════════════════════════════════════════════════════════════════════ */

interface GalleryProps {
  title?: string;
  subtitle?: string;
  gridPreviewCount?: number;
  showFilters?: boolean;
  enableKenBurns?: boolean;
}

export function Gallery({
  title = "Наши работы",
  subtitle = "Галерея",
  gridPreviewCount = 6,
  showFilters = true,
  enableKenBurns = true,
}: GalleryProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  const gridItems = filteredItems.slice(0, gridPreviewCount);
  const hasMoreItems = filteredItems.length > gridPreviewCount;

  const handleVideoHover = useCallback((id: string, isHovering: boolean) => {
    const video = videoRefs.current.get(id);
    if (video) {
      if (isHovering) {
        video.play().catch(() => {});
        setHoveredVideo(id);
      } else {
        video.pause();
        video.currentTime = 0;
        setHoveredVideo(null);
      }
    }
  }, []);

  const openLightbox = useCallback(
    (item: MediaItem) => {
      triggerHaptic("medium");
      const index = filteredItems.findIndex((i) => i.id === item.id);
      setSelectedIndex(index);
    },
    [filteredItems]
  );

  const navigateLightbox = useCallback(
    (direction: "prev" | "next") => {
      if (selectedIndex === null) return;
      triggerHaptic("light");
      let newIndex: number;
      if (direction === "prev") {
        newIndex = selectedIndex === 0 ? filteredItems.length - 1 : selectedIndex - 1;
      } else {
        newIndex = selectedIndex === filteredItems.length - 1 ? 0 : selectedIndex + 1;
      }
      setSelectedIndex(newIndex);
    },
    [selectedIndex, filteredItems.length]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") navigateLightbox("prev");
      if (e.key === "ArrowRight") navigateLightbox("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, navigateLightbox]);

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  return (
    <section id="gallery" className="py-16 md:py-24 px-4 md:px-8 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">{subtitle}</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-charcoal tracking-tight text-balance">
              {title}
            </h2>
          </div>

          {showFilters && (
            <div className="flex items-center gap-1 p-1.5 bg-gray-100 rounded-full w-fit">
              <FilterButton
                active={filter === "all"}
                onClick={() => { triggerHaptic("light"); setFilter("all"); }}
                icon={<Grid3X3 className="w-4 h-4" />}
                label="Все"
              />
              <FilterButton
                active={filter === "image"}
                onClick={() => { triggerHaptic("light"); setFilter("image"); }}
                icon={<ImageIcon className="w-4 h-4" />}
                label="Фото"
              />
              <FilterButton
                active={filter === "video"}
                onClick={() => { triggerHaptic("light"); setFilter("video"); }}
                icon={<Video className="w-4 h-4" />}
                label="Видео"
              />
            </div>
          )}
        </motion.div>

        {/* BENTO GRID */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[160px] md:auto-rows-[200px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {gridItems.map((item, index) => (
            <MediaCard
              key={item.id}
              item={item}
              index={index}
              isVideoHovered={hoveredVideo === item.id}
              onHover={(isHovering) => item.type === "video" && handleVideoHover(item.id, isHovering)}
              onClick={() => openLightbox(item)}
              videoRef={(el) => {
                if (el) videoRefs.current.set(item.id, el);
              }}
              enableKenBurns={enableKenBurns}
              priority={index < CONFIG.priorityLoadCount}
            />
          ))}
        </motion.div>

        {/* VIEW ALL BUTTON */}
        {hasMoreItems && (
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              onClick={() => openLightbox(filteredItems[0])}
              className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-white rounded-full font-medium hover:bg-charcoal/90 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Смотреть все {filteredItems.length} работ
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox
            items={filteredItems}
            currentIndex={selectedIndex}
            onClose={() => setSelectedIndex(null)}
            onNavigate={setSelectedIndex}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * КНОПКА ФИЛЬТРА
 * ═══════════════════════════════════════════════════════════════════════════════ */

function FilterButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
        active
          ? "bg-charcoal text-white shadow-lg"
          : "text-gray-500 hover:text-charcoal hover:bg-gray-200"
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * KEN BURNS CSS KEYFRAMES
 * ═══════════════════════════════════════════════════════════════════════════════ */

const kenBurnsKeyframes: Record<string, string> = {
  "zoom-in": `
    @keyframes kenBurnsZoomIn {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(${CONFIG.kenBurnsScale}); }
    }
  `,
  "zoom-out": `
    @keyframes kenBurnsZoomOut {
      0%, 100% { transform: scale(${CONFIG.kenBurnsScale}); }
      50% { transform: scale(1); }
    }
  `,
  "pan-left": `
    @keyframes kenBurnsPanLeft {
      0%, 100% { transform: scale(${CONFIG.kenBurnsScale}) translateX(${CONFIG.kenBurnsPanOffset}%); }
      50% { transform: scale(${CONFIG.kenBurnsScale}) translateX(-${CONFIG.kenBurnsPanOffset}%); }
    }
  `,
  "pan-right": `
    @keyframes kenBurnsPanRight {
      0%, 100% { transform: scale(${CONFIG.kenBurnsScale}) translateX(-${CONFIG.kenBurnsPanOffset}%); }
      50% { transform: scale(${CONFIG.kenBurnsScale}) translateX(${CONFIG.kenBurnsPanOffset}%); }
    }
  `,
  "pan-up": `
    @keyframes kenBurnsPanUp {
      0%, 100% { transform: scale(${CONFIG.kenBurnsScale}) translateY(${CONFIG.kenBurnsPanOffset}%); }
      50% { transform: scale(${CONFIG.kenBurnsScale}) translateY(-${CONFIG.kenBurnsPanOffset}%); }
    }
  `,
  "pan-down": `
    @keyframes kenBurnsPanDown {
      0%, 100% { transform: scale(${CONFIG.kenBurnsScale}) translateY(-${CONFIG.kenBurnsPanOffset}%); }
      50% { transform: scale(${CONFIG.kenBurnsScale}) translateY(${CONFIG.kenBurnsPanOffset}%); }
    }
  `,
};

const kenBurnsAnimationNames: Record<string, string> = {
  "zoom-in": "kenBurnsZoomIn",
  "zoom-out": "kenBurnsZoomOut",
  "pan-left": "kenBurnsPanLeft",
  "pan-right": "kenBurnsPanRight",
  "pan-up": "kenBurnsPanUp",
  "pan-down": "kenBurnsPanDown",
};

const autoKenBurnsDirections = ["zoom-in", "pan-left", "zoom-out", "pan-right", "pan-up", "pan-down"] as const;

/* ═══════════════════════════════════════════════════════════════════════════════
 * КАРТОЧКА МЕДИА
 * ═══════════════════════════════════════════════════════════════════════════════ */

const MediaCard = memo(function MediaCard({
  item,
  index,
  isVideoHovered,
  onHover,
  onClick,
  videoRef,
  enableKenBurns,
  priority = false,
}: {
  item: MediaItem;
  index: number;
  isVideoHovered: boolean;
  onHover: (isHovering: boolean) => void;
  onClick: () => void;
  videoRef: (el: HTMLVideoElement | null) => void;
  enableKenBurns: boolean;
  priority?: boolean;
}) {
  const { ref, isInView, hasBeenInView } = useInView({
    rootMargin: "100px",
    threshold: 0.1,
  });
  
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const isLargeVideo = item.type === "video" && item.span === "large";

  // Автозапуск большого видео когда оно в viewport
  useEffect(() => {
    if (isLargeVideo && isInView && localVideoRef.current) {
      localVideoRef.current.play().catch(() => {});
    }
  }, [isLargeVideo, isInView]);

  const spanClasses = {
    normal: "col-span-1 row-span-1",
    wide: "col-span-2 row-span-1",
    tall: "col-span-1 row-span-2",
    large: "col-span-2 row-span-2",
  };

  const kenBurnsDirection = item.kenBurnsDirection || autoKenBurnsDirections[index % autoKenBurnsDirections.length];
  const animationName = kenBurnsAnimationNames[kenBurnsDirection];
  const keyframes = kenBurnsKeyframes[kenBurnsDirection];

  const shouldLoad = priority || hasBeenInView;

  return (
    <motion.div
      ref={ref}
      className={cn(
        "group relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer bg-gray-100",
        spanClasses[item.span || "normal"]
      )}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {enableKenBurns && item.type === "image" && <style dangerouslySetInnerHTML={{ __html: keyframes }} />}

      {item.type === "video" ? (
        <>
          {/* Video Poster - скрыт для большого видео */}
          {shouldLoad && !isLargeVideo && (
            <img
              src={item.poster || "/placeholder.svg"}
              alt={item.title}
              loading={priority ? "eager" : "lazy"}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                isVideoHovered ? "opacity-0" : "opacity-100"
              )}
            />
          )}
          {/* Video Element - autoplay для большого, hover для остальных */}
          <video
            ref={(el) => {
              localVideoRef.current = el;
              videoRef(el);
            }}
            src={shouldLoad ? item.src : undefined}
            muted
            loop
            playsInline
            autoPlay={isLargeVideo}
            preload={isLargeVideo ? "auto" : "none"}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
              isLargeVideo ? "opacity-100" : (isVideoHovered ? "opacity-100" : "opacity-0")
            )}
          />
          {/* Play Icon - скрыт для большого видео */}
          {!isLargeVideo && (
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-300 pointer-events-none",
                isVideoHovered ? "opacity-0 scale-150" : "opacity-100 scale-100"
              )}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
                <Play className="w-5 h-5 md:w-6 md:h-6 text-charcoal fill-charcoal ml-0.5" />
              </div>
            </div>
          )}
        </>
      ) : (
        /* Image с Ken Burns */
        <div className="absolute inset-0 overflow-hidden">
          {shouldLoad && (
            <img
              src={item.src || "/placeholder.svg"}
              alt={item.title}
              loading={priority ? "eager" : "lazy"}
              className="absolute inset-0 w-full h-full object-cover"
              style={
                enableKenBurns
                  ? {
                      animation: isInView
                        ? `${animationName} ${CONFIG.kenBurnsDuration}s ease-in-out infinite`
                        : "none",
                      willChange: "transform",
                    }
                  : undefined
              }
            />
          )}
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
        {item.category && (
          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary text-charcoal rounded-full mb-1.5">
            {item.category}
          </span>
        )}
        <h3 className="text-base md:text-lg font-semibold text-white leading-tight">{item.title}</h3>
      </div>

      {/* Media Type Indicator */}
      <div className="absolute top-2 right-2 md:top-3 md:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          {item.type === "video" ? (
            <Video className="w-4 h-4 text-white" />
          ) : (
            <ImageIcon className="w-4 h-4 text-white" />
          )}
        </div>
      </div>
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
 * LIGHTBOX
 * ═══════════════════════════════════════════════════════════════════════════════ */

function Lightbox({
  items,
  currentIndex,
  onClose,
  onNavigate,
}: {
  items: MediaItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const currentItem = items[currentIndex];

  const goToPrev = useCallback(() => {
    triggerHaptic("light");
    const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    onNavigate(newIndex);
  }, [currentIndex, items.length, onNavigate]);

  const goToNext = useCallback(() => {
    triggerHaptic("light");
    const newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    onNavigate(newIndex);
  }, [currentIndex, items.length, onNavigate]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    setDragOffset(currentTouch - touchStart);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > CONFIG.swipeThreshold;
    const isRightSwipe = distance < -CONFIG.swipeThreshold;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }

    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-charcoal/95 backdrop-blur-xl flex flex-col"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-white/70">
            {currentIndex + 1} / {items.length}
          </span>
          {currentItem.category && (
            <span className="hidden sm:inline-block px-2 py-1 text-xs font-medium bg-primary text-charcoal rounded-full">
              {currentItem.category}
            </span>
          )}
        </div>

        <motion.button
          onClick={onClose}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </motion.button>
      </div>

      {/* MAIN CONTENT */}
      <div
        className="flex-1 flex items-center justify-center px-4 md:px-20 overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation - Left */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          className="hidden md:flex absolute left-4 lg:left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center transition-colors z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </motion.button>

        {/* Media Container */}
        <motion.div
          className="relative w-full max-w-5xl h-full max-h-[75vh] flex items-center justify-center"
          style={{
            transform: isDragging ? `translateX(${dragOffset}px)` : "translateX(0)",
            transition: isDragging ? "none" : `transform ${CONFIG.slideTransitionDuration}ms ease-out`,
          }}
          key={currentItem.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          {currentItem.type === "video" ? (
            <video
              src={currentItem.src}
              controls
              autoPlay
              className="max-w-full max-h-full object-contain rounded-xl md:rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={currentItem.src || "/placeholder.svg"}
              alt={currentItem.title}
              className="max-w-full max-h-full object-contain rounded-xl md:rounded-2xl"
              draggable={false}
            />
          )}
        </motion.div>

        {/* Navigation - Right */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="hidden md:flex absolute right-4 lg:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center transition-colors z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* FOOTER */}
      <div className="p-4 md:p-6">
        <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-4">{currentItem.title}</h3>

        {/* Thumbnail Navigation */}
        <div className="flex items-center justify-center gap-1.5 md:gap-2 overflow-x-auto pb-2 px-4 max-w-full">
          {items.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic("light");
                onNavigate(index);
              }}
              className={cn(
                "relative flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden transition-all duration-200",
                index === currentIndex
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-charcoal/95 opacity-100"
                  : "opacity-50 hover:opacity-75"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={item.type === "video" ? item.poster : item.src}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-charcoal/20">
                  <Play className="w-3 h-3 md:w-4 md:h-4 text-white fill-white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>

        <p className="text-xs text-white/40 text-center mt-3 md:hidden">Свайпайте для навигации</p>
      </div>
    </motion.div>
  );
}

export default Gallery;
