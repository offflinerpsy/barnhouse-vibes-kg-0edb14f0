/**
 * VARIANT A - Fullscreen Gallery Modal
 * 
 * Фокус: максимум фото, минимум UI
 * - 95% экрана = галерея
 * - Плавающие pill-табы для переключения: Фото / Планировка / Детали
 * - Оверлей с атрибутами появляется по тапу или свайпу вверх
 * - Сначала реальные фото, потом рендеры
 */

import React, { useState, useRef, useEffect } from "react";
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
  Info,
  Phone,
  MessageCircle,
  Send,
  CheckCircle,
  Check,
  Plus
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

interface HouseModalVariantAProps {
  house: HouseModel;
  onClose: () => void;
}

type TabType = "photos" | "plans" | "details";

export function HouseModalVariantA({ house, onClose }: HouseModalVariantAProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>("photos");
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const currentImages = activeTab === "photos" ? allImages : floorPlans;
  const totalImages = currentImages.length;

  // Reset index on tab change
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold && currentIndex < totalImages - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
    
    // Swipe up for details
    if (info.offset.y < -80 && activeTab === "photos") {
      setShowDetails(true);
    }
  };

  const tabs = [
    { id: "photos" as TabType, label: "Фото", icon: Camera, count: allImages.length },
    { id: "plans" as TabType, label: "Планировка", icon: Layout, count: floorPlans.length },
    { id: "details" as TabType, label: "Детали", icon: Info },
  ];

  // Details overlay
  if (activeTab === "details" || showForm || showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--charcoal))] to-black"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Back to photos */}
          <button
            onClick={() => setActiveTab("photos")}
            className="absolute top-4 left-4 z-20 flex items-center gap-2 text-white/70"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Фото</span>
          </button>

          {showSuccess ? (
            <SuccessMessage onClose={onClose} />
          ) : showForm ? (
            <ConsultForm 
              houseName={house.name} 
              onBack={() => setShowForm(false)}
              onSuccess={() => setShowSuccess(true)}
            />
          ) : (
            <DetailsContent 
              house={house} 
              onConsult={() => setShowForm(true)}
            />
          )}
        </motion.div>
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
        ref={containerRef}
        className="relative w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fullscreen Image */}
        <motion.div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={currentImages[currentIndex]}
              alt={`${house.name} ${currentIndex + 1}`}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              draggable={false}
            />
          </AnimatePresence>
        </motion.div>

        {/* Gradient overlay top */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        
        {/* Gradient overlay bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Title & Model */}
        <div className="absolute top-4 left-4 z-10">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg font-rising">
            {house.name}
          </h2>
          <p className="text-white/70 text-sm">{house.area} м² • {house.projectLabel}</p>
        </div>

        {/* Photo type indicator */}
        {activeTab === "photos" && realPhotos.length > 0 && (
          <div className="absolute top-20 left-4 z-10">
            <span className={`text-xs px-3 py-1 rounded-full ${
              currentIndex < realPhotos.length 
                ? "bg-[hsl(var(--gold))] text-[hsl(var(--charcoal))] font-semibold"
                : "bg-white/20 text-white/80"
            }`}>
              {currentIndex < realPhotos.length ? "📷 Реальное фото" : "🎨 Визуализация"}
            </span>
          </div>
        )}

        {/* Navigation arrows - desktop */}
        <div className="hidden md:flex absolute inset-y-0 left-4 right-4 items-center justify-between pointer-events-none z-10">
          <button
            onClick={() => currentIndex > 0 && setCurrentIndex(prev => prev - 1)}
            className={`p-3 bg-black/30 backdrop-blur-sm rounded-full pointer-events-auto transition-opacity ${
              currentIndex === 0 ? "opacity-0" : "opacity-100 hover:bg-black/50"
            }`}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => currentIndex < totalImages - 1 && setCurrentIndex(prev => prev + 1)}
            className={`p-3 bg-black/30 backdrop-blur-sm rounded-full pointer-events-auto transition-opacity ${
              currentIndex === totalImages - 1 ? "opacity-0" : "opacity-100 hover:bg-black/50"
            }`}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {Array.from({ length: Math.min(totalImages, 10) }).map((_, i) => {
            const displayIndex = totalImages > 10 
              ? Math.floor((i / 9) * (totalImages - 1))
              : i;
            return (
              <button
                key={i}
                onClick={() => setCurrentIndex(displayIndex)}
                className={`h-1 rounded-full transition-all ${
                  (totalImages > 10 
                    ? currentIndex >= displayIndex && currentIndex < (i === 9 ? totalImages : Math.floor(((i + 1) / 9) * (totalImages - 1)))
                    : currentIndex === i
                  )
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/40"
                }`}
              />
            );
          })}
        </div>

        {/* Counter */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/60 text-sm z-10">
          {currentIndex + 1} / {totalImages}
        </div>

        {/* Tab Pills */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="flex gap-1 p-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-[hsl(var(--charcoal))]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count && (
                  <span className={`text-xs ${
                    activeTab === tab.id ? "text-[hsl(var(--charcoal))]/60" : "text-white/40"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quick attributes bar */}
        <div className="absolute bottom-20 left-4 right-4 z-10 md:hidden">
          <div className="flex justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-1.5">
              <Maximize className="w-4 h-4" />
              <span>{house.area}м²</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4" />
              <span>{house.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" />
              <span>{house.bathrooms}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Details Content Component
function DetailsContent({ house, onConsult }: { house: HouseModel; onConsult: () => void }) {
  return (
    <div className="h-full flex flex-col pt-20 px-6 pb-6 overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white font-rising mb-2">
          {house.name}
        </h2>
        <p className="text-white/60">{house.projectLabel}</p>
      </div>

      {/* Attributes Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <Maximize className="w-6 h-6 text-[hsl(var(--gold))] mb-3" />
          <p className="text-2xl font-bold text-white">{house.area} м²</p>
          <p className="text-white/50 text-sm">Общая площадь</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <Layers className="w-6 h-6 text-[hsl(var(--gold))] mb-3" />
          <p className="text-2xl font-bold text-white">{house.floors}</p>
          <p className="text-white/50 text-sm">Этажей</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <BedDouble className="w-6 h-6 text-[hsl(var(--gold))] mb-3" />
          <p className="text-2xl font-bold text-white">{house.bedrooms}</p>
          <p className="text-white/50 text-sm">Спальни</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <Bath className="w-6 h-6 text-[hsl(var(--gold))] mb-3" />
          <p className="text-2xl font-bold text-white">{house.bathrooms}</p>
          <p className="text-white/50 text-sm">Санузлы</p>
        </div>
      </div>

      {/* Veranda */}
      {house.hasVeranda && house.verandaArea && (
        <div className="bg-[hsl(var(--gold))]/10 rounded-2xl p-5 border border-[hsl(var(--gold))]/30 mb-8">
          <div className="flex items-center gap-3">
            <Trees className="w-6 h-6 text-[hsl(var(--gold))]" />
            <div>
              <p className="text-white font-semibold">Веранда</p>
              <p className="text-white/60 text-sm">{house.verandaArea} м²</p>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto">
        <Button
          onClick={onConsult}
          className="w-full h-14 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--charcoal))] font-semibold text-lg rounded-2xl"
        >
          Получить консультацию
        </Button>
      </div>
    </div>
  );
}

// Consultation Form
function ConsultForm({ houseName, onBack, onSuccess }: { houseName: string; onBack: () => void; onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethods, setContactMethods] = useState<string[]>(["phone"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    console.log("Form submitted:", { name, phone, contactMethods, houseName });
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <div className="h-full flex flex-col pt-20 px-6 pb-6 overflow-y-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-white/60 mb-6">
        <ChevronLeft className="w-5 h-5" />
        <span>Назад</span>
      </button>

      <h2 className="text-2xl font-bold text-white mb-2">Консультация</h2>
      <p className="text-white/60 mb-8">{houseName}</p>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          <div>
            <label className="text-sm text-white/60 block mb-2">Ваше имя</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите имя"
              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              required
            />
          </div>
          <div>
            <label className="text-sm text-white/60 block mb-2">Телефон</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+996 XXX XXX XXX"
              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              required
            />
          </div>
          <div>
            <label className="text-sm text-white/60 block mb-3">Способ связи</label>
            <div className="flex gap-2">
              {[
                { id: "phone", icon: Phone, label: "Звонок" },
                { id: "telegram", icon: Send, label: "Telegram" },
                { id: "whatsapp", icon: MessageCircle, label: "WhatsApp" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setContactMethods(prev => 
                    prev.includes(m.id) ? prev.filter(x => x !== m.id) : [...prev, m.id]
                  )}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                    contactMethods.includes(m.id)
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
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !name.trim() || !phone.trim()}
          className="w-full h-14 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--charcoal))] font-semibold text-lg rounded-2xl mt-6"
        >
          {isSubmitting ? "Отправляем..." : "Отправить заявку"}
        </Button>
      </form>
    </div>
  );
}

// Success Message
function SuccessMessage({ onClose }: { onClose: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 bg-[hsl(var(--gold))]/20 rounded-full flex items-center justify-center mb-6"
      >
        <CheckCircle className="w-10 h-10 text-[hsl(var(--gold))]" />
      </motion.div>
      <h2 className="text-2xl font-bold text-white mb-2">Спасибо!</h2>
      <p className="text-white/60 text-center mb-8">Мы свяжемся с вами в течение 15 минут</p>
      <Button
        onClick={onClose}
        variant="outline"
        className="border-white/20 text-white hover:bg-white/10"
      >
        Закрыть
      </Button>
    </div>
  );
}

export default HouseModalVariantA;
