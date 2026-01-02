/**
 * VARIANT B - Bottom Sheet Modal
 * 
 * Фокус: fullscreen фото с выезжающим bottom sheet
 * - 100% экрана = галерея
 * - Swipe up для bottom sheet с деталями
 * - Компактные атрибуты в collapsed состоянии
 * - Сначала реальные фото, потом рендеры
 */

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, PanInfo, useDragControls } from "framer-motion";
import { 
  X, 
  ChevronLeft, 
  ChevronRight,
  ChevronUp,
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
  Grip
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

type SheetState = "collapsed" | "half" | "full";
type ViewMode = "gallery" | "plans";

export function HouseModalVariantB({ house, onClose }: HouseModalVariantBProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sheetState, setSheetState] = useState<SheetState>("collapsed");
  const [viewMode, setViewMode] = useState<ViewMode>("gallery");
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const dragControls = useDragControls();

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

  const handleImageDrag = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (sheetState !== "collapsed") return;
    
    const threshold = 50;
    if (info.offset.x < -threshold && currentIndex < totalImages - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSheetDrag = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    if (velocity < -500 || offset < -100) {
      if (sheetState === "collapsed") setSheetState("half");
      else if (sheetState === "half") setSheetState("full");
    } else if (velocity > 500 || offset > 100) {
      if (sheetState === "full") setSheetState("half");
      else if (sheetState === "half") setSheetState("collapsed");
    }
  };

  const sheetHeights = {
    collapsed: "140px",
    half: "50vh",
    full: "85vh"
  };

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
      >
        {/* Fullscreen Image Gallery */}
        <motion.div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          drag={sheetState === "collapsed" ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleImageDrag}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={`${viewMode}-${currentIndex}`}
              src={currentImages[currentIndex]}
              alt={`${house.name}`}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              draggable={false}
            />
          </AnimatePresence>

          {/* Dim overlay when sheet is open */}
          <motion.div
            className="absolute inset-0 bg-black pointer-events-none"
            animate={{ opacity: sheetState === "collapsed" ? 0 : sheetState === "half" ? 0.3 : 0.6 }}
          />
        </motion.div>

        {/* Top gradient */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Title */}
        <div className="absolute top-4 left-4 z-20">
          <h2 className="text-xl font-bold text-white drop-shadow-lg font-rising">
            {house.name}
          </h2>
          <p className="text-white/70 text-sm">{house.projectLabel}</p>
        </div>

        {/* Photo type badge */}
        {viewMode === "gallery" && realPhotos.length > 0 && (
          <div className="absolute top-16 left-4 z-20">
            <span className={`text-xs px-2.5 py-1 rounded-full ${
              currentIndex < realPhotos.length 
                ? "bg-[hsl(var(--gold))] text-[hsl(var(--charcoal))]"
                : "bg-white/20 text-white/80"
            }`}>
              {currentIndex < realPhotos.length ? "Реальное фото" : "3D визуализация"}
            </span>
          </div>
        )}

        {/* View mode toggle */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="flex bg-black/40 backdrop-blur-sm rounded-full p-1">
            <button
              onClick={() => { setViewMode("gallery"); setCurrentIndex(0); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                viewMode === "gallery" ? "bg-white text-black" : "text-white/70"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Фото</span>
            </button>
            <button
              onClick={() => { setViewMode("plans"); setCurrentIndex(0); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                viewMode === "plans" ? "bg-white text-black" : "text-white/70"
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>План</span>
            </button>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="hidden md:flex absolute inset-y-0 left-4 right-4 items-center justify-between pointer-events-none z-10">
          <button
            onClick={() => currentIndex > 0 && setCurrentIndex(prev => prev - 1)}
            className={`p-3 bg-black/30 backdrop-blur-sm rounded-full pointer-events-auto ${
              currentIndex === 0 ? "opacity-0" : "opacity-100"
            }`}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => currentIndex < totalImages - 1 && setCurrentIndex(prev => prev + 1)}
            className={`p-3 bg-black/30 backdrop-blur-sm rounded-full pointer-events-auto ${
              currentIndex === totalImages - 1 ? "opacity-0" : "opacity-100"
            }`}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute top-24 md:top-4 left-16 right-16 z-20">
          <div className="flex gap-1">
            {Array.from({ length: totalImages }).map((_, i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 rounded-full transition-all ${
                  i === currentIndex ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Sheet */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-30 bg-[hsl(var(--charcoal))] rounded-t-3xl"
          animate={{ height: sheetHeights[sheetState] }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          drag="y"
          dragControls={dragControls}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          onDragEnd={handleSheetDrag}
        >
          {/* Handle */}
          <div 
            className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <div className="w-10 h-1 bg-white/30 rounded-full" />
          </div>

          {/* Collapsed content */}
          {sheetState === "collapsed" && (
            <div className="px-5 pb-4">
              {/* Quick attributes */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-white/80 text-sm">
                    <Maximize className="w-4 h-4 text-[hsl(var(--gold))]" />
                    <span>{house.area}м²</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/80 text-sm">
                    <BedDouble className="w-4 h-4 text-[hsl(var(--gold))]" />
                    <span>{house.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/80 text-sm">
                    <Bath className="w-4 h-4 text-[hsl(var(--gold))]" />
                    <span>{house.bathrooms}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSheetState("half")}
                  className="text-white/60"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
              </div>

              {/* CTA */}
              <Button
                onClick={() => { setSheetState("full"); setShowForm(true); }}
                className="w-full h-12 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--charcoal))] font-semibold rounded-xl"
              >
                Получить консультацию
              </Button>
            </div>
          )}

          {/* Half/Full content */}
          {sheetState !== "collapsed" && (
            <div className="h-full overflow-y-auto px-5 pb-8">
              <AnimatePresence mode="wait">
                {showSuccess ? (
                  <SuccessContent onClose={onClose} />
                ) : showForm ? (
                  <FormContent 
                    houseName={house.name}
                    onBack={() => setShowForm(false)}
                    onSuccess={() => setShowSuccess(true)}
                  />
                ) : (
                  <DetailsContent 
                    house={house}
                    sheetState={sheetState}
                    onConsult={() => setShowForm(true)}
                  />
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Details Content
function DetailsContent({ house, sheetState, onConsult }: { house: HouseModel; sheetState: SheetState; onConsult: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Attributes Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white/5 rounded-xl p-4">
          <Maximize className="w-5 h-5 text-[hsl(var(--gold))] mb-2" />
          <p className="text-xl font-bold text-white">{house.area} м²</p>
          <p className="text-white/50 text-xs">Площадь</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <Layers className="w-5 h-5 text-[hsl(var(--gold))] mb-2" />
          <p className="text-xl font-bold text-white">{house.floors}</p>
          <p className="text-white/50 text-xs">Этажей</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <BedDouble className="w-5 h-5 text-[hsl(var(--gold))] mb-2" />
          <p className="text-xl font-bold text-white">{house.bedrooms}</p>
          <p className="text-white/50 text-xs">Спальни</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <Bath className="w-5 h-5 text-[hsl(var(--gold))] mb-2" />
          <p className="text-xl font-bold text-white">{house.bathrooms}</p>
          <p className="text-white/50 text-xs">Санузлы</p>
        </div>
      </div>

      {/* Veranda */}
      {house.hasVeranda && (
        <div className="bg-[hsl(var(--gold))]/10 rounded-xl p-4 mb-6 flex items-center gap-3">
          <Trees className="w-5 h-5 text-[hsl(var(--gold))]" />
          <div>
            <p className="text-white font-medium">Веранда</p>
            {house.verandaArea && <p className="text-white/50 text-sm">{house.verandaArea} м²</p>}
          </div>
        </div>
      )}

      {/* Full state features */}
      {sheetState === "full" && (
        <div className="space-y-4 mb-6">
          <h3 className="text-white font-semibold">Особенности</h3>
          <ul className="space-y-2">
            {[
              "Панорамное остекление",
              "Высокие потолки",
              "Качественная теплоизоляция",
              "Современные материалы"
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-white/70 text-sm">
                <div className="w-1.5 h-1.5 bg-[hsl(var(--gold))] rounded-full" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <Button
        onClick={onConsult}
        className="w-full h-12 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--charcoal))] font-semibold rounded-xl"
      >
        Получить консультацию
      </Button>
    </motion.div>
  );
}

// Form Content
function FormContent({ houseName, onBack, onSuccess }: { houseName: string; onBack: () => void; onSuccess: () => void }) {
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
      <button onClick={onBack} className="flex items-center gap-1 text-white/60 text-sm mb-4">
        <ChevronLeft className="w-4 h-4" />
        Назад
      </button>

      <h3 className="text-xl font-bold text-white mb-1">Консультация</h3>
      <p className="text-white/50 text-sm mb-6">{houseName}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше имя"
          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl"
          required
        />
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+996 XXX XXX XXX"
          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl"
          required
        />
        
        <div className="flex gap-2">
          {[
            { id: "phone", icon: Phone },
            { id: "telegram", icon: Send },
            { id: "whatsapp", icon: MessageCircle },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setContact(m.id)}
              className={`flex-1 h-12 rounded-xl flex items-center justify-center transition-all ${
                contact === m.id
                  ? "bg-[hsl(var(--gold))] text-[hsl(var(--charcoal))]"
                  : "bg-white/5 text-white/50"
              }`}
            >
              <m.icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--charcoal))] font-semibold rounded-xl"
        >
          {isSubmitting ? "Отправка..." : "Отправить"}
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
      className="flex flex-col items-center justify-center py-8"
    >
      <div className="w-16 h-16 bg-[hsl(var(--gold))]/20 rounded-full flex items-center justify-center mb-4">
        <CheckCircle className="w-8 h-8 text-[hsl(var(--gold))]" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Спасибо!</h3>
      <p className="text-white/60 text-center mb-6">Свяжемся в течение 15 минут</p>
      <Button
        onClick={onClose}
        variant="outline"
        className="border-white/20 text-white hover:bg-white/10"
      >
        Закрыть
      </Button>
    </motion.div>
  );
}

export default HouseModalVariantB;
