/**
 * VARIANT C - Stories Style Modal
 * 
 * Фокус: Instagram Stories UX
 * - Tap left/right для навигации
 * - Прогресс-бары сверху
 * - Минимальный UI
 * - Hold to pause
 * - Сначала реальные фото, потом рендеры
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Maximize,
  BedDouble,
  Bath,
  ChevronUp,
  Phone,
  MessageCircle,
  Send,
  CheckCircle,
  Layout,
  Camera
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

interface HouseModalVariantCProps {
  house: HouseModel;
  onClose: () => void;
}

type ContentType = "photos" | "plans";

export function HouseModalVariantC({ house, onClose }: HouseModalVariantCProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [contentType, setContentType] = useState<ContentType>("photos");
  const [isPaused, setIsPaused] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const AUTO_ADVANCE_TIME = 5000; // 5 seconds per image

  // Сначала РЕАЛЬНЫЕ фото (gallery-extra), потом рендеры (gallery)
  const realPhotos = Array.from({ length: house.galleryExtraCount }, (_, i) => 
    `/catalog/${house.catalogPath}/gallery-extra/extra-${i + 1}.webp`
  );
  const renders = Array.from({ length: house.galleryCount }, (_, i) => 
    `/catalog/${house.catalogPath}/gallery/${i + 1}.webp`
  );
  const allPhotos = [...realPhotos, ...renders];
  
  const floorPlans = [
    `/catalog/${house.catalogPath}/floor-plan/plan-1.webp`,
    `/catalog/${house.catalogPath}/floor-plan/plan-2.webp`,
    `/catalog/${house.catalogPath}/floor-plan/plan-3.webp`,
  ];

  const currentImages = contentType === "photos" ? allPhotos : floorPlans;
  const totalImages = currentImages.length;

  // Auto-advance timer
  useEffect(() => {
    if (isPaused || showDetails || showForm || showSuccess) {
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
          // Loop back or switch to plans
          if (contentType === "photos" && floorPlans.length > 0) {
            setContentType("plans");
            setCurrentIndex(0);
          } else {
            setCurrentIndex(0);
            if (contentType === "plans") {
              setContentType("photos");
            }
          }
        }
      }
    }, 50);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex, isPaused, showDetails, showForm, showSuccess, totalImages, contentType]);

  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const third = rect.width / 3;

    if (x < third) {
      // Left tap - go back
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (contentType === "plans") {
        setContentType("photos");
        setCurrentIndex(allPhotos.length - 1);
      }
    } else if (x > third * 2) {
      // Right tap - go forward
      if (currentIndex < totalImages - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (contentType === "photos" && floorPlans.length > 0) {
        setContentType("plans");
        setCurrentIndex(0);
      }
    } else {
      // Center tap - toggle details
      setShowDetails(true);
    }
  };

  const handlePointerDown = () => setIsPaused(true);
  const handlePointerUp = () => setIsPaused(false);

  if (showDetails || showForm || showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black"
      >
        {/* Background blurred image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl"
          style={{ backgroundImage: `url(${currentImages[currentIndex]})` }}
        />
        
        <div className="relative h-full flex flex-col">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <AnimatePresence mode="wait">
            {showSuccess ? (
              <SuccessView onClose={onClose} />
            ) : showForm ? (
              <FormView 
                houseName={house.name}
                onBack={() => setShowForm(false)}
                onSuccess={() => setShowSuccess(true)}
              />
            ) : (
              <DetailsView 
                house={house}
                onBack={() => setShowDetails(false)}
                onConsult={() => setShowForm(true)}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
      onClick={onClose}
    >
      <motion.div
        className="relative w-full h-full"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Fullscreen Image */}
        <div 
          className="absolute inset-0"
          onClick={handleTap}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={`${contentType}-${currentIndex}`}
              src={currentImages[currentIndex]}
              alt={house.name}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              draggable={false}
            />
          </AnimatePresence>
        </div>

        {/* Top gradient */}
        <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
        
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

        {/* Progress bars */}
        <div className="absolute top-3 left-3 right-3 z-20">
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
        </div>

        {/* Content type indicator */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
          <div className="flex gap-4 text-sm">
            <button
              onClick={(e) => { e.stopPropagation(); setContentType("photos"); setCurrentIndex(0); }}
              className={`flex items-center gap-1.5 transition-all ${
                contentType === "photos" ? "text-white font-medium" : "text-white/50"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Фото</span>
              {contentType === "photos" && <span className="text-xs text-white/60">({currentIndex + 1}/{totalImages})</span>}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setContentType("plans"); setCurrentIndex(0); }}
              className={`flex items-center gap-1.5 transition-all ${
                contentType === "plans" ? "text-white font-medium" : "text-white/50"
              }`}
            >
              <Layout className="w-4 h-4" />
              <span>План</span>
              {contentType === "plans" && <span className="text-xs text-white/60">({currentIndex + 1}/{totalImages})</span>}
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-7 right-3 z-30 w-8 h-8 flex items-center justify-center"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Photo type badge */}
        {contentType === "photos" && realPhotos.length > 0 && (
          <motion.div 
            key={currentIndex < realPhotos.length ? "real" : "render"}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-14 left-3 z-20"
          >
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              currentIndex < realPhotos.length 
                ? "bg-[hsl(var(--gold))] text-[hsl(var(--charcoal))]"
                : "bg-white/20 text-white"
            }`}>
              {currentIndex < realPhotos.length ? "РЕАЛЬНОЕ ФОТО" : "ВИЗУАЛИЗАЦИЯ"}
            </span>
          </motion.div>
        )}

        {/* House info */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
          {/* Title */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white font-rising mb-1">
              {house.name}
            </h2>
            <p className="text-white/60 text-sm">{house.projectLabel}</p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-white text-sm">
              <Maximize className="w-4 h-4 text-[hsl(var(--gold))]" />
              <span>{house.area}м²</span>
            </div>
            <div className="flex items-center gap-1.5 text-white text-sm">
              <BedDouble className="w-4 h-4 text-[hsl(var(--gold))]" />
              <span>{house.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white text-sm">
              <Bath className="w-4 h-4 text-[hsl(var(--gold))]" />
              <span>{house.bathrooms}</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3">
            <Button
              onClick={(e) => { e.stopPropagation(); setShowDetails(true); }}
              variant="outline"
              className="flex-1 h-12 border-white/20 text-white hover:bg-white/10 rounded-xl"
            >
              <ChevronUp className="w-4 h-4 mr-2" />
              Подробнее
            </Button>
            <Button
              onClick={(e) => { e.stopPropagation(); setShowForm(true); }}
              className="flex-1 h-12 bg-[hsl(var(--gold))] text-[hsl(var(--charcoal))] hover:bg-[hsl(var(--gold-dark))] font-semibold rounded-xl"
            >
              Консультация
            </Button>
          </div>
        </div>

        {/* Tap hint - shows briefly */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        >
          <div className="flex items-center gap-8 text-white/50 text-xs">
            <span>← Назад</span>
            <span className="text-white/30">|</span>
            <span>Вперёд →</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Details View
function DetailsView({ house, onBack, onConsult }: { house: HouseModel; onBack: () => void; onConsult: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="flex-1 flex flex-col pt-16 px-5 pb-6 overflow-y-auto"
    >
      <button onClick={onBack} className="text-white/60 text-sm mb-6">← Назад к фото</button>

      <h2 className="text-3xl font-bold text-white font-rising mb-2">{house.name}</h2>
      <p className="text-white/60 mb-8">{house.projectLabel}</p>

      {/* Big stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { icon: Maximize, value: `${house.area} м²`, label: "Площадь" },
          { icon: BedDouble, value: house.bedrooms, label: "Спальни" },
          { icon: Bath, value: house.bathrooms, label: "Санузлы" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 rounded-2xl p-5 border border-white/5">
            <stat.icon className="w-6 h-6 text-[hsl(var(--gold))] mb-3" />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-white/40 text-sm">{stat.label}</p>
          </div>
        ))}
        {house.hasVeranda && (
          <div className="bg-[hsl(var(--gold))]/10 rounded-2xl p-5 border border-[hsl(var(--gold))]/20">
            <p className="text-lg font-bold text-white">Веранда</p>
            {house.verandaArea && <p className="text-white/60">{house.verandaArea} м²</p>}
          </div>
        )}
      </div>

      <div className="mt-auto">
        <Button
          onClick={onConsult}
          className="w-full h-14 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--charcoal))] font-semibold text-lg rounded-2xl"
        >
          Получить консультацию
        </Button>
      </div>
    </motion.div>
  );
}

// Form View
function FormView({ houseName, onBack, onSuccess }: { houseName: string; onBack: () => void; onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contact, setContact] = useState("phone");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    console.log({ name, phone, contact, houseName });
    setSubmitting(false);
    onSuccess();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col pt-16 px-5 pb-6"
    >
      <button onClick={onBack} className="text-white/60 text-sm mb-6">← Назад</button>
      
      <h2 className="text-2xl font-bold text-white mb-1">Консультация</h2>
      <p className="text-white/50 mb-8">{houseName}</p>

      <form onSubmit={submit} className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ваше имя"
            className="h-14 bg-white/5 border-white/10 text-white text-lg placeholder:text-white/30 rounded-2xl"
            required
          />
          <Input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+996 XXX XXX XXX"
            className="h-14 bg-white/5 border-white/10 text-white text-lg placeholder:text-white/30 rounded-2xl"
            required
          />
          
          <div className="flex gap-3 pt-2">
            {[
              { id: "phone", icon: Phone, label: "Звонок" },
              { id: "telegram", icon: Send, label: "Telegram" },
              { id: "whatsapp", icon: MessageCircle, label: "WhatsApp" },
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setContact(m.id)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                  contact === m.id
                    ? "bg-[hsl(var(--gold))] border-[hsl(var(--gold))] text-[hsl(var(--charcoal))]"
                    : "bg-white/5 border-white/10 text-white/60"
                }`}
              >
                <m.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full h-14 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--charcoal))] font-semibold text-lg rounded-2xl mt-6"
        >
          {submitting ? "Отправка..." : "Отправить"}
        </Button>
      </form>
    </motion.div>
  );
}

// Success View
function SuccessView({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col items-center justify-center px-5"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="w-24 h-24 bg-[hsl(var(--gold))]/20 rounded-full flex items-center justify-center mb-6"
      >
        <CheckCircle className="w-12 h-12 text-[hsl(var(--gold))]" />
      </motion.div>
      <h2 className="text-2xl font-bold text-white mb-2">Спасибо!</h2>
      <p className="text-white/60 text-center mb-8">Мы свяжемся с вами<br />в течение 15 минут</p>
      <Button
        onClick={onClose}
        variant="outline"
        className="border-white/20 text-white hover:bg-white/10 px-8"
      >
        Закрыть
      </Button>
    </motion.div>
  );
}

export default HouseModalVariantC;
