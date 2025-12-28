/**
 * =============================================================================
 * CATALOG SECTION - Каталог домов ERA
 * =============================================================================
 * 
 * ID: #catalog
 * 
 * Система именования: Model + количество модулей
 * - Одноэтажные: Model 1, 2, 3, 4, 6, 8
 * - Двухэтажные (Duplex): Model 2X, 4X, 7X, 12X
 * 
 * Фильтрация:
 * - По этажности (1 этаж / 2 этажа)
 * - По площади
 * 
 * =============================================================================
 */

import React, { useState, useEffect, useRef, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BedDouble, 
  Maximize, 
  Bath, 
  Trees, 
  DoorOpen,
  X,
  Phone,
  MessageCircle,
  Send,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Hand,
  PenTool,
  Plus,
  Check,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Типы проектов - теперь по этажности
type ProjectType = "all" | "single-floor" | "duplex";

// Интерфейс модели дома
interface HouseModel {
  id: string;
  name: string;
  projectType: Exclude<ProjectType, "all">;
  projectLabel: string;
  area: number;            // Общая площадь
  heatedArea: number;      // Отапливаемая площадь
  floors: number;          // Этажность
  rooms: number;
  bedrooms: string;        // Диапазон (например "1-2")
  bathrooms: number;
  hasVeranda: boolean;
  verandaArea?: number;
  // TODO: Раскомментировать когда будут готовы цены
  // price: string;
  // Путь к папке модели в /catalog/
  catalogPath: string;
  // Количество файлов в каждой папке
  galleryCount: number;
  galleryExtraCount: number;
  floorPlanCount: number;
}

// Хелпер для генерации массива путей к изображениям
const generateImagePaths = (catalogPath: string, folder: string, count: number, prefix: string = ""): string[] => {
  return Array.from({ length: count }, (_, i) => 
    `/catalog/${catalogPath}/${folder}/${prefix}${i + 1}.webp`
  );
};

// Список проектов для фильтра
const projects: { value: ProjectType; label: string }[] = [
  { value: "all", label: "Все модели" },
  { value: "single-floor", label: "Одноэтажные" },
  { value: "duplex", label: "Двухэтажные" },
];

// Диапазоны метража для подфильтра
const areaRanges = [
  { value: "all", label: "Все метражи" },
  { value: "compact", label: "до 40м²", min: 0, max: 40 },
  { value: "small", label: "40-80м²", min: 40, max: 80 },
  { value: "medium", label: "80-130м²", min: 80, max: 130 },
  { value: "large", label: "130м²+", min: 130, max: Infinity },
];

const houses: HouseModel[] = [
  // ============================================
  // ОДНОЭТАЖНЫЕ МОДЕЛИ (Single Floor)
  // ============================================
  
  // Model 1 - Студия 18м²
  {
    id: "model-1",
    name: "Model 1",
    projectType: "single-floor",
    projectLabel: "Одноэтажный",
    area: 18,
    heatedArea: 18,
    floors: 1,
    rooms: 1,
    bedrooms: "студия",
    bathrooms: 1,
    hasVeranda: false,
    catalogPath: "model-1-18",
    galleryCount: 4,
    galleryExtraCount: 25,
    floorPlanCount: 3, // webp only, excluding pdf
  },
  
  // Model 2 - Компакт 36м²
  {
    id: "model-2",
    name: "Model 2",
    projectType: "single-floor",
    projectLabel: "Одноэтажный",
    area: 36,
    heatedArea: 36,
    floors: 1,
    rooms: 2,
    bedrooms: "1",
    bathrooms: 1,
    hasVeranda: true,
    verandaArea: 12,
    catalogPath: "model-1-36",
    galleryCount: 4,
    galleryExtraCount: 24,
    floorPlanCount: 3,
  },
  
  // Model 3 - Стандарт 54м²
  {
    id: "model-3",
    name: "Model 3",
    projectType: "single-floor",
    projectLabel: "Одноэтажный",
    area: 54,
    heatedArea: 54,
    floors: 1,
    rooms: 3,
    bedrooms: "1-2",
    bathrooms: 1,
    hasVeranda: true,
    verandaArea: 15,
    catalogPath: "model-1-54",
    galleryCount: 8,
    galleryExtraCount: 33,
    floorPlanCount: 3,
  },
  
  // Model 4 - Комфорт 81м²
  {
    id: "model-4",
    name: "Model 4",
    projectType: "single-floor",
    projectLabel: "Одноэтажный",
    area: 81,
    heatedArea: 81,
    floors: 1,
    rooms: 4,
    bedrooms: "2-3",
    bathrooms: 2,
    hasVeranda: true,
    verandaArea: 20,
    catalogPath: "model-1-81",
    galleryCount: 4,
    galleryExtraCount: 34,
    floorPlanCount: 2,
  },
  
  // Model 6 - Семейный 108м²
  {
    id: "model-6",
    name: "Model 6",
    projectType: "single-floor",
    projectLabel: "Одноэтажный",
    area: 108,
    heatedArea: 108,
    floors: 1,
    rooms: 5,
    bedrooms: "3-4",
    bathrooms: 2,
    hasVeranda: true,
    verandaArea: 25,
    catalogPath: "model-1-108",
    galleryCount: 4,
    galleryExtraCount: 54,
    floorPlanCount: 3,
  },
  
  // Model 8 - Премиум 135м²
  {
    id: "model-8",
    name: "Model 8",
    projectType: "single-floor",
    projectLabel: "Одноэтажный",
    area: 135,
    heatedArea: 135,
    floors: 1,
    rooms: 6,
    bedrooms: "4-5",
    bathrooms: 2,
    hasVeranda: true,
    verandaArea: 30,
    catalogPath: "model-1-135",
    galleryCount: 5,
    galleryExtraCount: 38,
    floorPlanCount: 2,
  },
  
  // ============================================
  // ДВУХЭТАЖНЫЕ МОДЕЛИ (Duplex)
  // ============================================
  
  // Model 2X - Дуплекс компакт 36м²
  {
    id: "model-2x",
    name: "Model 2X",
    projectType: "duplex",
    projectLabel: "Двухэтажный",
    area: 36,
    heatedArea: 36,
    floors: 2,
    rooms: 2,
    bedrooms: "1",
    bathrooms: 1,
    hasVeranda: false,
    catalogPath: "model-2-36",
    galleryCount: 4,
    galleryExtraCount: 0,
    floorPlanCount: 1,
  },
  
  // Model 4X - Дуплекс стандарт 72м²
  {
    id: "model-4x",
    name: "Model 4X",
    projectType: "duplex",
    projectLabel: "Двухэтажный",
    area: 72,
    heatedArea: 72,
    floors: 2,
    rooms: 4,
    bedrooms: "2-3",
    bathrooms: 2,
    hasVeranda: true,
    verandaArea: 18,
    catalogPath: "model-2-72",
    galleryCount: 4,
    galleryExtraCount: 6,
    floorPlanCount: 3,
  },
  
  // Model 7X - Дуплекс комфорт 120м²
  {
    id: "model-7x",
    name: "Model 7X",
    projectType: "duplex",
    projectLabel: "Двухэтажный",
    area: 120,
    heatedArea: 120,
    floors: 2,
    rooms: 5,
    bedrooms: "3-4",
    bathrooms: 2,
    hasVeranda: true,
    verandaArea: 25,
    catalogPath: "model-2-120",
    galleryCount: 4,
    galleryExtraCount: 0,
    floorPlanCount: 2,
  },
  
  // Model 12X - Дуплекс премиум 204м²
  {
    id: "model-12x",
    name: "Model 12X",
    projectType: "duplex",
    projectLabel: "Двухэтажный",
    area: 204,
    heatedArea: 204,
    floors: 2,
    rooms: 8,
    bedrooms: "5-6",
    bathrooms: 3,
    hasVeranda: true,
    verandaArea: 40,
    catalogPath: "model-2-204",
    galleryCount: 6,
    galleryExtraCount: 0,
    floorPlanCount: 1,
  },
];

// Компонент индикатора свайпа
const SwipeIndicator = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <motion.div 
      ref={ref}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-charcoal/70 backdrop-blur-sm px-4 py-2 rounded-full z-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <motion.div
        animate={{ x: [0, -8, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
      >
        <Hand className="h-5 w-5 text-white" />
      </motion.div>
      <span className="text-white text-sm font-medium">Листайте</span>
      <motion.div 
        className="flex gap-1"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
        <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
        <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
      </motion.div>
    </motion.div>
  );
});
SwipeIndicator.displayName = "SwipeIndicator";

// Компонент формы консультации
interface ConsultationFormProps {
  houseName: string;
  onBack: () => void;
  onSuccess: () => void;
  wantsVeranda?: boolean;
  isCustomProject?: boolean;
}

function ConsultationForm({ houseName, onBack, onSuccess, wantsVeranda = false, isCustomProject = false }: ConsultationFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethods, setContactMethods] = useState<string[]>(["phone"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsArchitect, setNeedsArchitect] = useState(wantsVeranda);

  const toggleContactMethod = (method: string) => {
    setContactMethods(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) return;
    
    setIsSubmitting(true);
    
    // Имитация отправки
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const formData = { 
      name, 
      phone, 
      contactMethods, 
      houseName,
      wantsVeranda,
      needsArchitect,
      isCustomProject
    };
    
    console.log("Form submitted:", formData);
    
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {isCustomProject ? "Индивидуальный проект" : "Получить консультацию"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isCustomProject ? "Создадим дом вашей мечты" : houseName}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          {/* Custom project note */}
          {isCustomProject && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-2">
              <p className="text-sm text-foreground">
                Опишите вашу идею — мы подготовим индивидуальный проект с учётом всех пожеланий
              </p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Ваше имя
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите имя"
              className="bg-background border-border focus:border-primary"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Телефон
            </label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (___) ___-__-__"
              className="bg-background border-border focus:border-primary"
              required
            />
          </div>

          {/* Contact Methods */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Удобный способ связи
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toggleContactMethod("phone")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all ${
                  contactMethods.includes("phone")
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-foreground hover:border-primary/50"
                }`}
              >
                <Phone className="h-4 w-4" />
                <span className="text-sm font-medium">Телефон</span>
              </button>
              <button
                type="button"
                onClick={() => toggleContactMethod("telegram")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all ${
                  contactMethods.includes("telegram")
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-foreground hover:border-primary/50"
                }`}
              >
                <Send className="h-4 w-4" />
                <span className="text-sm font-medium">Telegram</span>
              </button>
              <button
                type="button"
                onClick={() => toggleContactMethod("whatsapp")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all ${
                  contactMethods.includes("whatsapp")
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-foreground hover:border-primary/50"
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium">WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Architect checkbox - показывается если хочет веранду или кастом проект */}
          {(wantsVeranda || isCustomProject) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setNeedsArchitect(!needsArchitect)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                  needsArchitect
                    ? "bg-primary/10 border-primary/30"
                    : "bg-muted/50 border-border hover:border-primary/30"
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                  needsArchitect ? "bg-primary" : "bg-background border border-border"
                }`}>
                  {needsArchitect && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {wantsVeranda 
                    ? "Необходима консультация с архитектором (добавление веранды)"
                    : "Необходима консультация с архитектором"
                  }
                </span>
              </button>
            </motion.div>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !name.trim() || !phone.trim()}
          className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-semibold"
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
            />
          ) : (
            isCustomProject ? "Отправить заявку" : "Получить консультацию"
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Нажимая кнопку, вы соглашаетесь с{" "}
          <a href="#" className="text-primary hover:underline">
            политикой конфиденциальности
          </a>
        </p>
      </form>
    </motion.div>
  );
}

// Компонент благодарности
function ThankYouMessage({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full flex flex-col items-center justify-center text-center px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6"
      >
        <CheckCircle className="h-10 w-10 text-primary" />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-semibold text-foreground mb-3"
      >
        Спасибо за обращение!
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-muted-foreground mb-8 max-w-[280px]"
      >
        Мы свяжемся с вами в течение 15 минут для консультации
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={onClose}
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          Закрыть
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// Компоненты для унифицированных модалок (золотой стиль)
// ==========================================

// Форма консультации для модалок в золотом стиле
interface ModalConsultationFormProps {
  houseName: string;
  onSuccess: () => void;
  wantsVeranda?: boolean;
  isCustomProject?: boolean;
}

function ModalConsultationForm({ houseName, onSuccess, wantsVeranda = false, isCustomProject = false }: ModalConsultationFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethods, setContactMethods] = useState<string[]>(["phone"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsArchitect, setNeedsArchitect] = useState(wantsVeranda);

  const toggleContactMethod = (method: string) => {
    setContactMethods(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim() || contactMethods.length === 0) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const formData = { 
      name, 
      phone, 
      contactMethods, 
      houseName,
      wantsVeranda,
      needsArchitect,
      isCustomProject
    };
    
    console.log("Form submitted:", formData);
    setIsSubmitting(false);
    onSuccess();
  };

  const contactMethodsList = [
    { id: "phone", label: "Телефон", icon: Phone },
    { id: "telegram", label: "Telegram", icon: Send },
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <form onSubmit={handleSubmit}>
        {/* Белый контейнер формы */}
        <div className="bg-white rounded-xl p-5 space-y-4 shadow-lg">
          {/* Подсказка для кастом проекта */}
          {isCustomProject && (
            <div className="bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/20 rounded-lg p-3">
              <p className="text-sm text-[hsl(var(--charcoal))]">
                Опишите вашу идею — мы подготовим индивидуальный проект
              </p>
            </div>
          )}

          {/* Имя */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[hsl(var(--charcoal))]/70">
              Ваше имя
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите имя"
              required
              className="h-12 bg-[hsl(var(--secondary))]/30 border-0 font-rising text-[hsl(var(--charcoal))] placeholder:text-[hsl(var(--charcoal))]/50 focus:ring-2 focus:ring-[hsl(var(--gold))]/30 rounded-lg"
            />
          </div>

          {/* Телефон */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[hsl(var(--charcoal))]/70">
              Телефон
            </label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+996 XXX XXX XXX"
              type="tel"
              required
              className="h-12 bg-[hsl(var(--secondary))]/30 border-0 font-rising text-[hsl(var(--charcoal))] placeholder:text-[hsl(var(--charcoal))]/50 focus:ring-2 focus:ring-[hsl(var(--gold))]/30 rounded-lg"
            />
          </div>

          {/* Способ связи */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[hsl(var(--charcoal))]/70">
              Как с вами связаться? <span className="text-[hsl(var(--gold))]">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {contactMethodsList.map((method, index) => {
                const isSelected = contactMethods.includes(method.id);
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => toggleContactMethod(method.id)}
                    className={`relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all duration-300 ${
                      isSelected
                        ? "bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-white shadow-lg scale-[1.02]"
                        : "bg-[hsl(var(--secondary))]/50 text-[hsl(var(--charcoal))]/70 hover:bg-[hsl(var(--secondary))] hover:scale-[1.01]"
                    }`}
                    style={{
                      animationDelay: `${300 + index * 100}ms`,
                      animationFillMode: 'backwards'
                    }}
                  >
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                        <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                      </div>
                    )}
                    <method.icon className="w-5 h-5 relative z-10" />
                    <span className="text-xs font-semibold relative z-10">{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Чекбокс консультации с архитектором */}
          {(wantsVeranda || isCustomProject) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setNeedsArchitect(!needsArchitect)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  needsArchitect
                    ? "bg-[hsl(var(--gold))]/10 border-[hsl(var(--gold))]/30"
                    : "bg-[hsl(var(--secondary))]/30 border-transparent hover:border-[hsl(var(--gold))]/20"
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                  needsArchitect ? "bg-[hsl(var(--gold))]" : "bg-white border border-[hsl(var(--charcoal))]/20"
                }`}>
                  {needsArchitect && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="text-sm font-semibold text-[hsl(var(--charcoal))]">
                  {wantsVeranda 
                    ? "Консультация с архитектором (веранда)"
                    : "Консультация с архитектором"
                  }
                </span>
              </button>
            </motion.div>
          )}
        </div>

        {/* Кнопка отправки */}
        <Button
          type="submit"
          disabled={isSubmitting || !name.trim() || !phone.trim() || contactMethods.length === 0}
          variant="modal"
          size="xl"
          className="w-full mt-5 rounded-xl"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-[hsl(var(--gold))]/30 border-t-[hsl(var(--gold))] rounded-full animate-spin" />
              Отправляем...
            </span>
          ) : (
            <span>Отправить заявку</span>
          )}
        </Button>

        {/* Политика */}
        <p className="text-center text-white/60 text-xs mt-4">
          Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
        </p>
      </form>
    </motion.div>
  );
}

// Благодарность в золотом стиле
function ModalThankYouMessage({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="py-8"
    >
      <div className="bg-white rounded-xl p-8 shadow-lg text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 bg-[hsl(var(--gold))]/10 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="h-10 w-10 text-[hsl(var(--gold))]" />
        </motion.div>
        
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-[hsl(var(--charcoal))] mb-3 font-rising"
        >
          Спасибо за обращение!
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-[hsl(var(--charcoal))]/60 mb-6"
        >
          Мы свяжемся с вами в течение 15 минут
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-white hover:opacity-90 px-8"
          >
            Закрыть
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Компонент модального окна - унифицированный стиль
interface HouseModalProps {
  house: HouseModel;
  onClose: () => void;
}

function HouseModal({ house, onClose }: HouseModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [wantsVeranda, setWantsVeranda] = useState(false);
  const [viewMode, setViewMode] = useState<"gallery" | "floorplan">("gallery");
  
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  // Генерируем пути к изображениям
  const galleryImages = generateImagePaths(house.catalogPath, "gallery", house.galleryCount);
  const galleryExtraImages = generateImagePaths(house.catalogPath, "gallery-extra", house.galleryExtraCount, "extra-");
  const floorPlanImages = generateImagePaths(house.catalogPath, "floor-plan", house.floorPlanCount, "plan-");
  
  // Все изображения для галереи (основные + дополнительные)
  const allGalleryImages = [...galleryImages, ...galleryExtraImages];
  
  // Текущий набор изображений в зависимости от режима просмотра
  const currentImages = viewMode === "gallery" ? allGalleryImages : floorPlanImages;

  useEffect(() => {
    const timer = setTimeout(() => setShowSwipeHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = dragStartX.current - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentImageIndex < currentImages.length - 1) {
        setCurrentImageIndex(prev => prev + 1);
        setShowSwipeHint(false);
      } else if (diff < 0 && currentImageIndex > 0) {
        setCurrentImageIndex(prev => prev - 1);
        setShowSwipeHint(false);
      }
    }
    dragStartX.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;
    e.preventDefault();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current || dragStartX.current === null) {
      isDragging.current = false;
      return;
    }
    const diff = dragStartX.current - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentImageIndex < currentImages.length - 1) {
        setCurrentImageIndex(prev => prev + 1);
        setShowSwipeHint(false);
      } else if (diff < 0 && currentImageIndex > 0) {
        setCurrentImageIndex(prev => prev - 1);
        setShowSwipeHint(false);
      }
    }
    dragStartX.current = null;
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    dragStartX.current = null;
  };

  const handleFormSuccess = () => {
    setShowThankYou(true);
  };

  const handleCloseAll = () => {
    setShowThankYou(false);
    setShowForm(false);
    onClose();
  };

  // Если показываем форму или благодарность - используем золотой стиль
  if (showForm || showThankYou) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-[hsl(var(--charcoal))]/90 via-[hsl(var(--gold-dark))]/40 to-[hsl(var(--charcoal))]/95 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="relative bg-gradient-to-br from-[hsl(var(--gold))] via-[hsl(var(--gold-dark))] to-[hsl(var(--gold))] p-[2px] rounded-2xl"
            style={{ boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px" }}
          >
            <div className="relative bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] rounded-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-radial from-white/20 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-radial from-white/10 to-transparent rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />

              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:rotate-90 duration-300"
              >
                <X className="h-5 w-5 text-white" />
              </button>

              <div className="relative px-6 pt-8 pb-6 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-rising tracking-wide">
                  {house.name}
                </h2>
                <p className="text-white/80 text-sm">
                  Мы свяжемся с вами в течение 15 минут
                </p>
              </div>

              <div className="relative px-6 pb-8">
                <AnimatePresence mode="wait">
                  {showThankYou ? (
                    <ModalThankYouMessage key="thank-you" onClose={handleCloseAll} />
                  ) : (
                    <ModalConsultationForm 
                      key="form"
                      houseName={house.name} 
                      onSuccess={handleFormSuccess}
                      wantsVeranda={wantsVeranda}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Стандартный вид с деталями дома
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-[hsl(var(--charcoal))]/90 via-[hsl(var(--gold-dark))]/40 to-[hsl(var(--charcoal))]/95 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-5xl h-[96dvh] sm:h-auto sm:max-h-[88vh] lg:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="relative bg-gradient-to-br from-[hsl(var(--gold))] via-[hsl(var(--gold-dark))] to-[hsl(var(--gold))] p-[2px] rounded-2xl h-full sm:h-auto"
          style={{ boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px" }}
        >
          <div className="relative bg-card rounded-2xl overflow-hidden h-full sm:h-auto">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-charcoal/60 hover:bg-charcoal/80 flex items-center justify-center transition-all hover:rotate-90 duration-300"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </button>

            <div className="flex flex-col lg:flex-row h-full sm:h-auto overflow-hidden">
              {/* Image Gallery */}
              <div 
                className="relative w-full lg:w-[55%] h-[35dvh] sm:h-[300px] lg:h-[500px] xl:h-[550px] bg-charcoal select-none cursor-grab active:cursor-grabbing flex-shrink-0"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                  <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <img
                      src={currentImages[currentImageIndex]}
                      alt={house.name}
                      className="w-full h-full object-contain pointer-events-none"
                      draggable={false}
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {currentImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentImageIndex(idx);
                        setShowSwipeHint(false);
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === currentImageIndex 
                          ? "bg-primary w-6" 
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>

                <div className="hidden lg:flex absolute inset-0 items-center justify-between px-3 pointer-events-none">
                  <button
                    onClick={() => currentImageIndex > 0 && setCurrentImageIndex(prev => prev - 1)}
                    className={`p-2 bg-charcoal/50 hover:bg-charcoal/70 rounded-full transition-all pointer-events-auto ${
                      currentImageIndex === 0 ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5 text-white" />
                  </button>
                  <button
                    onClick={() => currentImageIndex < currentImages.length - 1 && setCurrentImageIndex(prev => prev + 1)}
                    className={`p-2 bg-charcoal/50 hover:bg-charcoal/70 rounded-full transition-all pointer-events-auto ${
                      currentImageIndex === currentImages.length - 1 ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <ChevronRight className="h-5 w-5 text-white" />
                  </button>
                </div>

                {showSwipeHint && currentImages.length > 1 && (
                  <div className="lg:hidden">
                    <SwipeIndicator />
                  </div>
                )}

                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-semibold">
                  {house.projectLabel}
                </Badge>
              </div>

              {/* Content */}
              <div className="w-full lg:w-[45%] p-4 sm:p-5 lg:p-6 flex flex-col overflow-y-auto flex-1 min-h-0">
                <div className="mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1 font-rising">
                    {house.name}
                  </h2>
                  {/* TODO: Раскомментировать когда будут готовы цены */}
                  {/* <p className="text-xl font-bold text-primary">{house.price}</p> */}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-background rounded-lg p-3 border border-border">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                      <Maximize className="h-3.5 w-3.5" />
                      <span className="text-xs uppercase tracking-wide font-semibold">Площадь</span>
                    </div>
                    <p className="text-base font-bold text-foreground">{house.area} м²</p>
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-border">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                      <Layers className="h-3.5 w-3.5" />
                      <span className="text-xs uppercase tracking-wide font-semibold">Этажей</span>
                    </div>
                    <p className="text-base font-bold text-foreground">{house.floors}</p>
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-border">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                      <BedDouble className="h-3.5 w-3.5" />
                      <span className="text-xs uppercase tracking-wide font-semibold">Спальни</span>
                    </div>
                    <p className="text-base font-bold text-foreground">{house.bedrooms}</p>
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-border">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                      <Bath className="h-3.5 w-3.5" />
                      <span className="text-xs uppercase tracking-wide font-semibold">Санузлы</span>
                    </div>
                    <p className="text-base font-bold text-foreground">{house.bathrooms}</p>
                  </div>
                </div>

                {house.hasVeranda ? (
                  <div className="flex items-center gap-3 bg-primary/10 rounded-lg p-3 mb-4">
                    <Trees className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">Веранда</p>
                      {house.verandaArea && (
                        <p className="text-xs text-muted-foreground">{house.verandaArea} м²</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Trees className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-2">
                          Веранда не предусмотрена. Хотите добавить?
                        </p>
                        <button
                          onClick={() => setWantsVeranda(!wantsVeranda)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-semibold ${
                            wantsVeranda
                              ? "bg-primary border-primary text-primary-foreground"
                              : "bg-background border-border text-foreground hover:border-primary/50"
                          }`}
                        >
                          {wantsVeranda ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Plus className="h-3.5 w-3.5" />
                          )}
                          <span>{wantsVeranda ? "Добавлена" : "Добавить веранду"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-2 space-y-3">
                  {/* Toggle между галереей и планировкой */}
                  {floorPlanImages.length > 0 && (
                    <div className="flex justify-center">
                      <div className="flex bg-muted rounded-full p-1">
                        <button
                          onClick={() => {
                            setViewMode("gallery");
                            setCurrentImageIndex(0);
                          }}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                            viewMode === "gallery"
                              ? "bg-primary text-white shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Галерея
                        </button>
                        <button
                          onClick={() => {
                            setViewMode("floorplan");
                            setCurrentImageIndex(0);
                          }}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                            viewMode === "floorplan"
                              ? "bg-primary text-white shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Планировка
                        </button>
                      </div>
                    </div>
                  )}
                  <Button
                    onClick={() => setShowForm(true)}
                    size="lg"
                    className="w-full"
                  >
                    Получить консультацию
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Модальное окно для индивидуального проекта - унифицированный стиль как ContactModal
interface CustomProjectModalProps {
  onClose: () => void;
}

function CustomProjectModal({ onClose }: CustomProjectModalProps) {
  const [showForm, setShowForm] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleFormSuccess = () => {
    setShowThankYou(true);
  };

  const handleCloseAll = () => {
    setShowThankYou(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-[hsl(var(--charcoal))]/90 via-[hsl(var(--gold-dark))]/40 to-[hsl(var(--charcoal))]/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Золотая рамка */}
        <div 
          className="relative bg-gradient-to-br from-[hsl(var(--gold))] via-[hsl(var(--gold-dark))] to-[hsl(var(--gold))] p-[2px] rounded-2xl"
          style={{ boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px" }}
        >
          <div className="relative bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] rounded-2xl overflow-hidden">
            {/* Декоративные элементы */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-radial from-white/20 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-radial from-white/10 to-transparent rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:rotate-90 duration-300"
            >
              <X className="h-5 w-5 text-white" />
            </button>

            {/* Header */}
            <div className="relative px-6 pt-8 pb-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
                <PenTool className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-rising tracking-wide">
                Индивидуальный проект
              </h2>
              <p className="text-white/80 text-sm">
                Создадим дом вашей мечты
              </p>
            </div>

            {/* Content */}
            <div className="relative px-6 pb-8">
              <AnimatePresence mode="wait">
                {showThankYou ? (
                  <ModalThankYouMessage key="thank-you" onClose={handleCloseAll} />
                ) : showForm ? (
                  <ModalConsultationForm 
                    key="form"
                    houseName="Индивидуальный проект" 
                    onSuccess={handleFormSuccess}
                    isCustomProject={true}
                  />
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Catalog() {
  const [activeProject, setActiveProject] = useState<ProjectType>("all");
  const [activeAreaRange, setActiveAreaRange] = useState("all");
  const [selectedHouse, setSelectedHouse] = useState<HouseModel | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Фильтрация по проекту
  const projectFilteredHouses = activeProject === "all" 
    ? houses 
    : houses.filter(house => house.projectType === activeProject);

  // Дополнительная фильтрация по метражу
  const filteredHouses = activeAreaRange === "all"
    ? projectFilteredHouses
    : projectFilteredHouses.filter(house => {
        const range = areaRanges.find(r => r.value === activeAreaRange);
        if (!range || range.value === "all") return true;
        return house.area >= range.min && house.area < range.max;
      });

  // Сброс фильтра метража при смене проекта
  const handleProjectChange = (project: ProjectType) => {
    setActiveProject(project);
    setActiveAreaRange("all");
  };

  return (
    <section id="catalog" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Наши проекты
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            Каталог домов
          </h2>
        </motion.div>

        {/* Project Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {projects.map((project) => (
            <Button
              key={project.value}
              variant={activeProject === project.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleProjectChange(project.value)}
              className={`rounded-full transition-all ${
                activeProject === project.value
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card border-border hover:bg-primary/10 hover:border-primary/30"
              }`}
            >
              {project.label}
            </Button>
          ))}
        </motion.div>

        {/* Area Range Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {areaRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setActiveAreaRange(range.value)}
              className={`px-4 py-2 text-sm rounded-lg transition-all ${
                activeAreaRange === range.value
                  ? "bg-primary/20 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {range.label}
            </button>
          ))}
        </motion.div>

        {/* Houses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredHouses.map((house, index) => {
              // Генерируем путь к первому изображению для карточки
              const cardImage = `/catalog/${house.catalogPath}/gallery/1.webp`;
              
              return (
              <motion.div
                key={house.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedHouse(house)}
              >
                {/* Premium Card Design */}
                <div className="relative bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm transition-shadow duration-500 group-hover:shadow-[0_20px_50px_-12px_rgba(195,153,107,0.25)]">
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={cardImage}
                      alt={house.name}
                      className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                    />
                    
                    {/* Premium hover overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--charcoal))]/80 via-[hsl(var(--charcoal))]/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                    
                    {/* Golden glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--gold))]/0 via-transparent to-[hsl(var(--gold))]/0 group-hover:from-[hsl(var(--gold))]/10 group-hover:to-[hsl(var(--gold))]/5 transition-all duration-500" />
                    
                    {/* Project badge */}
                    <Badge className="absolute top-3 left-3 bg-[hsl(var(--charcoal))]/80 backdrop-blur-md text-white border border-white/10 font-medium">
                      {house.projectLabel}
                    </Badge>

                    {/* View button on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="bg-white/95 backdrop-blur-sm text-[hsl(var(--charcoal))] px-6 py-3 rounded-full font-semibold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        Подробнее
                      </div>
                    </div>

                    {/* TODO: Раскомментировать когда будут готовы цены */}
                    {/* <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-xl font-bold text-white drop-shadow-lg">
                        {house.price}
                      </p>
                    </div> */}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {house.name}
                    </h3>

                    {/* Attributes */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Maximize className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                        <span>{house.area} м²</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Layers className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                        <span>{house.floors} эт.</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BedDouble className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                        <span>{house.bedrooms === "студия" ? "студия" : `${house.bedrooms} спал.`}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Bath className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                        <span>{house.bathrooms} сануз.</span>
                      </div>
                    </div>
                  </div>

                  {/* Premium bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
              );
            })}
            
            {/* Custom Project CTA Card - inside the grid */}
            <motion.div
              key="custom-project-cta"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: filteredHouses.length * 0.05 }}
              className="group cursor-pointer"
              onClick={() => setShowCustomModal(true)}
            >
              <div className="relative h-full bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm transition-shadow duration-500 group-hover:shadow-[0_20px_50px_-12px_rgba(195,153,107,0.25)]">
                {/* Animated House Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[hsl(var(--charcoal))] via-[hsl(30,12%,15%)] to-[hsl(var(--charcoal))]">
                  {/* Decorative background elements */}
                  <div className="absolute inset-0">
                    <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-[hsl(var(--gold))]/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-[hsl(var(--gold))]/3 rounded-full blur-2xl" />
                  </div>
                  
                  {/* Animated Barn House SVG */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.svg
                      viewBox="0 0 200 160"
                      className="w-40 h-32 md:w-48 md:h-40"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-50px" }}
                    >
                      {/* Ground line */}
                      <motion.line
                        x1="20" y1="140" x2="180" y2="140"
                        stroke="hsl(38, 35%, 55%)"
                        strokeWidth="1"
                        strokeLinecap="round"
                        variants={{
                          hidden: { pathLength: 0, opacity: 0 },
                          visible: { pathLength: 1, opacity: 0.3, transition: { duration: 0.8, delay: 0 } }
                        }}
                      />
                      
                      {/* Left wall */}
                      <motion.line
                        x1="40" y1="140" x2="40" y2="80"
                        stroke="hsl(38, 35%, 65%)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        variants={{
                          hidden: { pathLength: 0, opacity: 0 },
                          visible: { pathLength: 1, opacity: 1, transition: { duration: 0.5, delay: 0.3 } }
                        }}
                      />
                      
                      {/* Right wall */}
                      <motion.line
                        x1="160" y1="140" x2="160" y2="80"
                        stroke="hsl(38, 35%, 65%)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        variants={{
                          hidden: { pathLength: 0, opacity: 0 },
                          visible: { pathLength: 1, opacity: 1, transition: { duration: 0.5, delay: 0.4 } }
                        }}
                      />
                      
                      {/* Bottom wall */}
                      <motion.line
                        x1="40" y1="140" x2="160" y2="140"
                        stroke="hsl(38, 35%, 65%)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        variants={{
                          hidden: { pathLength: 0, opacity: 0 },
                          visible: { pathLength: 1, opacity: 1, transition: { duration: 0.5, delay: 0.5 } }
                        }}
                      />
                      
                      {/* Barn roof - left slope */}
                      <motion.line
                        x1="35" y1="80" x2="100" y2="35"
                        stroke="hsl(38, 35%, 70%)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        variants={{
                          hidden: { pathLength: 0, opacity: 0 },
                          visible: { pathLength: 1, opacity: 1, transition: { duration: 0.6, delay: 0.7 } }
                        }}
                      />
                      
                      {/* Barn roof - right slope */}
                      <motion.line
                        x1="100" y1="35" x2="165" y2="80"
                        stroke="hsl(38, 35%, 70%)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        variants={{
                          hidden: { pathLength: 0, opacity: 0 },
                          visible: { pathLength: 1, opacity: 1, transition: { duration: 0.6, delay: 0.9 } }
                        }}
                      />
                      
                      {/* Roof horizontal */}
                      <motion.line
                        x1="35" y1="80" x2="165" y2="80"
                        stroke="hsl(38, 35%, 65%)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        variants={{
                          hidden: { pathLength: 0, opacity: 0 },
                          visible: { pathLength: 1, opacity: 1, transition: { duration: 0.4, delay: 1.1 } }
                        }}
                      />
                      
                      {/* Door */}
                      <motion.rect
                        x="85" y="100" width="30" height="40"
                        fill="none"
                        stroke="hsl(38, 35%, 55%)"
                        strokeWidth="1.5"
                        rx="1"
                        variants={{
                          hidden: { pathLength: 0, opacity: 0 },
                          visible: { pathLength: 1, opacity: 1, transition: { duration: 0.5, delay: 1.3 } }
                        }}
                      />
                      
                      {/* Door handle */}
                      <motion.circle
                        cx="108" cy="120" r="2"
                        fill="hsl(38, 35%, 60%)"
                        variants={{
                          hidden: { scale: 0, opacity: 0 },
                          visible: { scale: 1, opacity: 1, transition: { duration: 0.2, delay: 1.6 } }
                        }}
                      />
                      
                      {/* Left window */}
                      <motion.rect
                        x="50" y="95" width="20" height="25"
                        fill="none"
                        stroke="hsl(38, 35%, 55%)"
                        strokeWidth="1.5"
                        rx="1"
                        variants={{
                          hidden: { pathLength: 0, opacity: 0 },
                          visible: { pathLength: 1, opacity: 1, transition: { duration: 0.4, delay: 1.4 } }
                        }}
                      />
                      
                      {/* Left window cross */}
                      <motion.g
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1, transition: { duration: 0.3, delay: 1.5 } }
                        }}
                      >
                        <line x1="60" y1="95" x2="60" y2="120" stroke="hsl(38, 35%, 50%)" strokeWidth="1" />
                        <line x1="50" y1="107.5" x2="70" y2="107.5" stroke="hsl(38, 35%, 50%)" strokeWidth="1" />
                      </motion.g>
                      
                      {/* Right window */}
                      <motion.rect
                        x="130" y="95" width="20" height="25"
                        fill="none"
                        stroke="hsl(38, 35%, 55%)"
                        strokeWidth="1.5"
                        rx="1"
                        variants={{
                          hidden: { pathLength: 0, opacity: 0 },
                          visible: { pathLength: 1, opacity: 1, transition: { duration: 0.4, delay: 1.45 } }
                        }}
                      />
                      
                      {/* Right window cross */}
                      <motion.g
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1, transition: { duration: 0.3, delay: 1.55 } }
                        }}
                      >
                        <line x1="140" y1="95" x2="140" y2="120" stroke="hsl(38, 35%, 50%)" strokeWidth="1" />
                        <line x1="130" y1="107.5" x2="150" y2="107.5" stroke="hsl(38, 35%, 50%)" strokeWidth="1" />
                      </motion.g>
                      
                      {/* Chimney */}
                      <motion.rect
                        x="120" y="40" width="12" height="25"
                        fill="none"
                        stroke="hsl(38, 35%, 55%)"
                        strokeWidth="1.5"
                        variants={{
                          hidden: { pathLength: 0, opacity: 0 },
                          visible: { pathLength: 1, opacity: 1, transition: { duration: 0.4, delay: 1.7 } }
                        }}
                      />
                      
                      {/* Smoke particles */}
                      <motion.circle
                        cx="126" cy="32" r="3"
                        fill="none"
                        stroke="hsl(38, 35%, 50%)"
                        strokeWidth="1"
                        variants={{
                          hidden: { opacity: 0, y: 5 },
                          visible: { 
                            opacity: [0, 0.5, 0], 
                            y: [-5, -15, -25],
                            transition: { duration: 2, delay: 2, repeat: Infinity, repeatDelay: 1 }
                          }
                        }}
                      />
                      <motion.circle
                        cx="126" cy="28" r="2"
                        fill="none"
                        stroke="hsl(38, 35%, 45%)"
                        strokeWidth="1"
                        variants={{
                          hidden: { opacity: 0, y: 5 },
                          visible: { 
                            opacity: [0, 0.4, 0], 
                            y: [-5, -18, -30],
                            transition: { duration: 2.5, delay: 2.3, repeat: Infinity, repeatDelay: 1.2 }
                          }
                        }}
                      />
                      
                      {/* Plus sign in center */}
                      <motion.g
                        variants={{
                          hidden: { scale: 0, opacity: 0 },
                          visible: { scale: 1, opacity: 1, transition: { duration: 0.4, delay: 1.9, type: "spring" } }
                        }}
                      >
                        <circle cx="100" cy="60" r="12" fill="hsl(38, 35%, 65%)" opacity="0.2" />
                        <line x1="95" y1="60" x2="105" y2="60" stroke="hsl(38, 35%, 70%)" strokeWidth="2" strokeLinecap="round" />
                        <line x1="100" y1="55" x2="100" y2="65" stroke="hsl(38, 35%, 70%)" strokeWidth="2" strokeLinecap="round" />
                      </motion.g>
                    </motion.svg>
                  </div>
                  
                  {/* Premium hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--charcoal))]/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  {/* Golden glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--gold))]/0 via-transparent to-[hsl(var(--gold))]/0 group-hover:from-[hsl(var(--gold))]/10 group-hover:to-[hsl(var(--gold))]/5 transition-all duration-500" />
                  
                  {/* Badge */}
                  <Badge className="absolute top-3 left-3 bg-[hsl(var(--gold))]/90 backdrop-blur-md text-white border border-white/20 font-medium">
                    Индивидуальный
                  </Badge>

                  {/* View button on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-white/95 backdrop-blur-sm text-[hsl(var(--charcoal))] px-6 py-3 rounded-full font-semibold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      Заказать проект
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    Не нашли подходящий?
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Создадим дом вашей мечты
                  </p>
                  
                  {/* CTA hint */}
                  <div className="flex items-center gap-2 text-primary font-medium text-sm">
                    <PenTool className="h-4 w-4" />
                    <span>Заказать проект</span>
                  </div>
                </div>

                {/* Premium bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredHouses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground text-lg">
              Нет домов по выбранным критериям
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setActiveProject("all");
                setActiveAreaRange("all");
              }}
              className="mt-4"
            >
              Сбросить фильтры
            </Button>
          </motion.div>
        )}
      </div>

      {/* House Modal */}
      <AnimatePresence>
        {selectedHouse && (
          <HouseModal 
            house={selectedHouse} 
            onClose={() => setSelectedHouse(null)} 
          />
        )}
      </AnimatePresence>

      {/* Custom Project Modal */}
      <AnimatePresence>
        {showCustomModal && (
          <CustomProjectModal 
            onClose={() => setShowCustomModal(false)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}

