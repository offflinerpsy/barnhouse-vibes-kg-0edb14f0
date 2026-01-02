/**
 * VARIANT B - Premium Photo Gallery Modal (Improved)
 * 
 * Особенности:
 * - Пропорциональные фото (object-contain) с умным размещением
 * - Полупрозрачная "песчаная" панель с атрибутами
 * - Режим fullscreen при тапе на фото
 * - Модалка (не fullscreen) на ПК/планшете
 * - Форма поверх фото, не перекрывая
 * - Автолисталка как в Stories
 * - Плавные анимации
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { 
  X, 
  ChevronLeft, 
  ChevronRight,
  Maximize,
  BedDouble,
  Bath,
  Layers,
  Trees,
  Camera,
  Layout,
  Phone,
  MessageCircle,
  Send,
  CheckCircle,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HouseModel {
  id: string;
  name: string;
  projectLabel: string;
  area: number;
  floors: number;
  bedrooms: string;
  bathrooms: number;
  hasVeranda: boolean;
  verandaArea?: number;
  catalogPath: string;
  galleryCount: number;
  galleryExtraCount: number;
}

interface HouseModalVariantBProps {
  house: HouseModel;
  onClose: () => void;
}

type ViewMode = "gallery" | "plans";

export function HouseModalVariantB({ house, onClose }: HouseModalVariantBProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("gallery");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const AUTO_ADVANCE_TIME = 4000;

  // Сначала РЕАЛЬНЫЕ фото (gallery-extra), потом рендеры (gallery)
  const realPhotos = Array.from({ length: house.galleryExtraCount }, (_, i) => 
    `/catalog/${house.catalogPath}/gallery-extra/extra-${i + 1}.webp`
  );
  const renders = Array.from({ length: house.galleryCount }, (_, i) => 
    `/catalog/${house.catalogPath}/gallery/${i + 1}.webp`
  );
  const allImages = [...realPhotos, ...renders];
  
  const floorPlans = [
    `/catalog/${house.catalogPath}/floor-plan/plan-1.webp`,
    `/catalog/${house.catalogPath}/floor-plan/plan-2.webp`,
    `/catalog/${house.catalogPath}/floor-plan/plan-3.webp`,
  ];

  const currentImages = viewMode === "gallery" ? allImages : floorPlans;
  const totalImages = currentImages.length;

  // Auto-advance timer
  useEffect(() => {
    if (isPaused || showDetails || showForm || showSuccess || isFullscreen) {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      return;
    }

    setProgress(0);
    const startTime = Date.now();
    
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / AUTO_ADVANCE_TIME) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        if (currentIndex < totalImages - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setCurrentIndex(0);
        }
      }
    }, 50);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex, isPaused, showDetails, showForm, showSuccess, isFullscreen, totalImages]);

  // Handle fullscreen controls visibility
  const showControlsTemporarily = useCallback(() => {
    setControlsVisible(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    hideControlsTimeout.current = setTimeout(() => {
      if (isFullscreen) {
        setControlsVisible(false);
      }
    }, 3000);
  }, [isFullscreen]);

  useEffect(() => {
    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, []);

  const handleImageTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (showForm || showDetails) return;
    
    if (isFullscreen) {
      // В fullscreen режиме - показываем/скрываем контролы или переключаем фото
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0]?.clientX || 0 : e.clientX;
      const x = clientX - rect.left;
      const third = rect.width / 3;

      if (x < third) {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
      } else if (x > third * 2) {
        if (currentIndex < totalImages - 1) setCurrentIndex(prev => prev + 1);
      } else {
        if (controlsVisible) {
          setIsFullscreen(false);
          setControlsVisible(true);
        } else {
          showControlsTemporarily();
        }
      }
    } else {
      // Не в fullscreen - входим в fullscreen
      setIsFullscreen(true);
      showControlsTemporarily();
    }
  };

  const handleDrag = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (showForm || showDetails || isFullscreen) return;
    
    const threshold = 50;
    if (info.offset.x < -threshold && currentIndex < totalImages - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const exitFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullscreen(false);
    setControlsVisible(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Modal Container - полный экран на мобиле, модалка на десктопе */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`
            relative bg-[hsl(var(--charcoal))] overflow-hidden
            ${isFullscreen 
              ? "w-full h-full" 
              : "w-full h-full md:w-[90vw] md:h-[90vh] md:max-w-5xl md:rounded-2xl md:shadow-2xl"
            }
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main Image Area */}
          <motion.div
            className={`
              relative cursor-pointer
              ${isFullscreen ? "h-full" : "h-[55vh] md:h-[65vh]"}
            `}
            drag={!isFullscreen && !showForm && !showDetails ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDrag}
            onClick={handleImageTap}
            onPointerDown={() => setIsPaused(true)}
            onPointerUp={() => setIsPaused(false)}
            onPointerLeave={() => setIsPaused(false)}
          >
            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${viewMode}-${currentIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center bg-black"
              >
                <img
                  src={currentImages[currentIndex]}
                  alt={house.name}
                  className={`
                    max-w-full max-h-full
                    ${viewMode === "plans" ? "object-contain p-4" : "object-contain"}
                  `}
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradients for controls visibility */}
            <motion.div 
              className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 to-transparent pointer-events-none"
              animate={{ opacity: isFullscreen && !controlsVisible ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"
              animate={{ opacity: isFullscreen && !controlsVisible ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Progress bars */}
            <motion.div 
              className="absolute top-3 left-4 right-4 z-20"
              animate={{ opacity: isFullscreen && !controlsVisible ? 0 : 1, y: isFullscreen && !controlsVisible ? -20 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex gap-1">
                {Array.from({ length: totalImages }).map((_, i) => (
                  <div
                    key={i}
                    className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden"
                  >
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: i < currentIndex 
                          ? "100%" 
                          : i === currentIndex 
                            ? `${progress}%` 
                            : "0%"
                      }}
                      transition={{ duration: 0.05, ease: "linear" }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top controls */}
            <motion.div 
              className="absolute top-8 left-4 right-4 z-20 flex items-start justify-between"
              animate={{ opacity: isFullscreen && !controlsVisible ? 0 : 1, y: isFullscreen && !controlsVisible ? -30 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Left side - title & badge */}
              <div>
                <h2 className="text-lg font-bold text-white drop-shadow-lg font-rising">
                  {house.name}
                </h2>
                <p className="text-white/70 text-xs mb-2">{house.projectLabel}</p>
                {viewMode === "gallery" && realPhotos.length > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    currentIndex < realPhotos.length 
                      ? "bg-[hsl(var(--gold))] text-[hsl(var(--charcoal))]"
                      : "bg-white/20 text-white"
                  }`}>
                    {currentIndex < realPhotos.length ? "РЕАЛЬНОЕ ФОТО" : "ВИЗУАЛИЗАЦИЯ"}
                  </span>
                )}
              </div>

              {/* Right side - close button */}
              <button
                onClick={(e) => { e.stopPropagation(); isFullscreen ? exitFullscreen(e) : onClose(); }}
                className="w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </motion.div>

            {/* View mode toggle */}
            <motion.div 
              className="absolute top-8 left-1/2 -translate-x-1/2 z-20"
              animate={{ opacity: isFullscreen && !controlsVisible ? 0 : 1, y: isFullscreen && !controlsVisible ? -30 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex bg-black/40 backdrop-blur-sm rounded-full p-1">
                <button
                  onClick={(e) => { e.stopPropagation(); setViewMode("gallery"); setCurrentIndex(0); }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    viewMode === "gallery" ? "bg-white text-black" : "text-white/70 hover:text-white"
                  }`}
                >
                  <Camera className="w-3 h-3" />
                  <span className="hidden sm:inline">Фото</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setViewMode("plans"); setCurrentIndex(0); }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    viewMode === "plans" ? "bg-white text-black" : "text-white/70 hover:text-white"
                  }`}
                >
                  <Layout className="w-3 h-3" />
                  <span className="hidden sm:inline">План</span>
                </button>
              </div>
            </motion.div>

            {/* Navigation arrows - desktop only */}
            <div className="hidden md:flex absolute inset-y-0 left-4 right-4 items-center justify-between pointer-events-none z-10">
              <motion.button
                onClick={(e) => { e.stopPropagation(); currentIndex > 0 && setCurrentIndex(prev => prev - 1); }}
                className={`p-2 bg-black/30 backdrop-blur-sm rounded-full pointer-events-auto hover:bg-black/50 transition-all ${
                  currentIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
                animate={{ opacity: isFullscreen && !controlsVisible ? 0 : (currentIndex === 0 ? 0 : 1) }}
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </motion.button>
              <motion.button
                onClick={(e) => { e.stopPropagation(); currentIndex < totalImages - 1 && setCurrentIndex(prev => prev + 1); }}
                className={`p-2 bg-black/30 backdrop-blur-sm rounded-full pointer-events-auto hover:bg-black/50 transition-all ${
                  currentIndex === totalImages - 1 ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
                animate={{ opacity: isFullscreen && !controlsVisible ? 0 : (currentIndex === totalImages - 1 ? 0 : 1) }}
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            {/* Fullscreen hint */}
            <AnimatePresence>
              {!isFullscreen && !showForm && !showDetails && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 md:hidden"
                >
                  <span className="text-white/50 text-xs bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                    Нажмите для полного экрана
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Bottom Panel - "Sandy mist" effect */}
          <AnimatePresence>
            {!isFullscreen && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute bottom-0 left-0 right-0 z-30"
              >
                {/* Sandy mist background */}
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(38_25%_20%/0.95)] via-[hsl(38_25%_15%/0.85)] to-transparent backdrop-blur-xl" />
                
                {/* Content */}
                <div className="relative px-5 pt-6 pb-6 md:pb-8">
                  <AnimatePresence mode="wait">
                    {showSuccess ? (
                      <SuccessContent key="success" onClose={onClose} />
                    ) : showForm ? (
                      <FormContent 
                        key="form"
                        houseName={house.name}
                        onBack={() => setShowForm(false)}
                        onSuccess={() => setShowSuccess(true)}
                      />
                    ) : showDetails ? (
                      <DetailsContent 
                        key="details"
                        house={house}
                        onBack={() => setShowDetails(false)}
                        onConsult={() => setShowForm(true)}
                      />
                    ) : (
                      <QuickAttributesContent 
                        key="quick"
                        house={house}
                        onDetails={() => setShowDetails(true)}
                        onConsult={() => setShowForm(true)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fullscreen bottom controls */}
          <AnimatePresence>
            {isFullscreen && controlsVisible && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 z-30 p-4"
              >
                <div className="flex gap-3">
                  <Button
                    onClick={(e) => { e.stopPropagation(); exitFullscreen(e); setShowDetails(true); }}
                    variant="outline"
                    className="flex-1 h-11 border-white/20 bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-xl"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    Подробнее
                  </Button>
                  <Button
                    onClick={(e) => { e.stopPropagation(); exitFullscreen(e); setShowForm(true); }}
                    className="flex-1 h-11 bg-[hsl(var(--gold))] text-[hsl(var(--charcoal))] hover:bg-[hsl(var(--gold-dark))] font-semibold rounded-xl"
                  >
                    Консультация
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Quick Attributes Content
function QuickAttributesContent({ 
  house, 
  onDetails, 
  onConsult 
}: { 
  house: HouseModel; 
  onDetails: () => void;
  onConsult: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Compact attributes row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4 text-[hsl(var(--gold))]" />
            <span className="text-white/90 text-sm font-medium">{house.area}м²</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[hsl(var(--gold))]" />
            <span className="text-white/90 text-sm">{house.floors} эт.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BedDouble className="w-4 h-4 text-[hsl(var(--gold))]" />
            <span className="text-white/90 text-sm">{house.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-[hsl(var(--gold))]" />
            <span className="text-white/90 text-sm">{house.bathrooms}</span>
          </div>
          {house.hasVeranda && (
            <div className="flex items-center gap-1.5">
              <Trees className="w-4 h-4 text-[hsl(var(--gold))]" />
              <span className="text-white/90 text-sm">Веранда</span>
            </div>
          )}
        </div>
        <button
          onClick={onDetails}
          className="text-white/60 hover:text-white text-xs underline underline-offset-2"
        >
          Ещё
        </button>
      </div>

      {/* CTA Button */}
      <Button
        onClick={onConsult}
        className="w-full h-12 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--charcoal))] font-semibold rounded-xl shadow-lg shadow-[hsl(var(--gold))]/20"
      >
        Получить консультацию
      </Button>
    </motion.div>
  );
}

// Details Content
function DetailsContent({ 
  house, 
  onBack,
  onConsult 
}: { 
  house: HouseModel; 
  onBack: () => void;
  onConsult: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-h-[40vh] overflow-y-auto"
    >
      <button 
        onClick={onBack} 
        className="flex items-center gap-1 text-white/60 text-sm mb-4 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Назад
      </button>

      {/* Attributes Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <Maximize className="w-4 h-4 text-[hsl(var(--gold))] mb-1" />
          <p className="text-lg font-bold text-white">{house.area} м²</p>
          <p className="text-white/50 text-xs">Площадь</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <Layers className="w-4 h-4 text-[hsl(var(--gold))] mb-1" />
          <p className="text-lg font-bold text-white">{house.floors}</p>
          <p className="text-white/50 text-xs">Этажей</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <BedDouble className="w-4 h-4 text-[hsl(var(--gold))] mb-1" />
          <p className="text-lg font-bold text-white">{house.bedrooms}</p>
          <p className="text-white/50 text-xs">Спальни</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <Bath className="w-4 h-4 text-[hsl(var(--gold))] mb-1" />
          <p className="text-lg font-bold text-white">{house.bathrooms}</p>
          <p className="text-white/50 text-xs">Санузлы</p>
        </div>
      </div>

      {/* Veranda */}
      {house.hasVeranda && (
        <div className="bg-[hsl(var(--gold))]/10 rounded-xl p-3 mb-4 flex items-center gap-3 border border-[hsl(var(--gold))]/20">
          <Trees className="w-5 h-5 text-[hsl(var(--gold))]" />
          <div>
            <p className="text-white font-medium text-sm">Веранда</p>
            {house.verandaArea && <p className="text-white/50 text-xs">{house.verandaArea} м²</p>}
          </div>
        </div>
      )}

      {/* Features */}
      <div className="mb-4">
        <h4 className="text-white/70 text-xs uppercase tracking-wide mb-2">Особенности</h4>
        <div className="flex flex-wrap gap-2">
          {["Панорамное остекление", "Высокие потолки", "Теплоизоляция", "Современные материалы"].map((f, i) => (
            <span key={i} className="text-white/80 text-xs bg-white/5 px-2 py-1 rounded-lg border border-white/5">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Button
        onClick={onConsult}
        className="w-full h-11 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--charcoal))] font-semibold rounded-xl"
      >
        Получить консультацию
      </Button>
    </motion.div>
  );
}

// Form Content - compact, overlays on photo background
function FormContent({ 
  houseName, 
  onBack, 
  onSuccess 
}: { 
  houseName: string; 
  onBack: () => void; 
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contact, setContact] = useState("phone");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    console.log("Form:", { name, phone, contact, houseName });
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <button 
        onClick={onBack} 
        className="flex items-center gap-1 text-white/60 text-sm mb-3 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Назад
      </button>

      <h3 className="text-lg font-bold text-white mb-1">Консультация</h3>
      <p className="text-white/50 text-xs mb-4">{houseName}</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше имя"
          className="h-11 bg-white/10 border-white/10 text-white placeholder:text-white/40 rounded-xl focus:border-[hsl(var(--gold))]/50"
          required
        />
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+996 XXX XXX XXX"
          className="h-11 bg-white/10 border-white/10 text-white placeholder:text-white/40 rounded-xl focus:border-[hsl(var(--gold))]/50"
          required
        />
        
        <div className="flex gap-2">
          {[
            { id: "phone", icon: Phone, label: "Звонок" },
            { id: "telegram", icon: Send, label: "Telegram" },
            { id: "whatsapp", icon: MessageCircle, label: "WhatsApp" },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setContact(m.id)}
              className={`flex-1 h-10 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-all ${
                contact === m.id
                  ? "bg-[hsl(var(--gold))] text-[hsl(var(--charcoal))]"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              <m.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          ))}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--charcoal))] font-semibold rounded-xl disabled:opacity-50"
        >
          {isSubmitting ? "Отправка..." : "Отправить заявку"}
        </Button>
      </form>
    </motion.div>
  );
}

// Success Content
function SuccessContent({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center py-4"
    >
      <div className="w-14 h-14 bg-[hsl(var(--gold))]/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-7 h-7 text-[hsl(var(--gold))]" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">Заявка отправлена!</h3>
      <p className="text-white/60 text-sm mb-4">Мы свяжемся с вами в ближайшее время</p>
      <Button
        onClick={onClose}
        variant="outline"
        className="border-white/20 text-white hover:bg-white/10 rounded-xl"
      >
        Закрыть
      </Button>
    </motion.div>
  );
}
