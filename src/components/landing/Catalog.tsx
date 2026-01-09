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
import { useIsMobile } from "@/hooks/use-mobile";
import CatalogAppView from "@/components/landing/CatalogAppView";
import { ContactModal } from "@/components/landing/ContactModal";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
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
import { 
  CATALOG_MODELS, 
  CatalogModel, 
  AREA_RANGES,
  getGalleryImages,
  getFloorPlanPaths,
} from "@/data/catalog-models";

// Alias for backward compatibility
type HouseModel = CatalogModel;
type ProjectType = "all" | "single-floor" | "duplex";

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
const areaRanges = AREA_RANGES;

// Используем общий массив моделей (исключаем коммерческие для десктопной версии)
const houses: HouseModel[] = CATALOG_MODELS.filter(m => m.projectType !== "commercial");

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

// Inline форма для glassmorphism модалки (встроенная в правую панель)
interface InlineConsultationFormProps {
  houseName: string;
  onSuccess: () => void;
  wantsVeranda?: boolean;
}

function InlineConsultationForm({ houseName, onSuccess, wantsVeranda = false }: InlineConsultationFormProps) {
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
    
    console.log("Form submitted:", { name, phone, contactMethods, houseName, wantsVeranda, needsArchitect });
    setIsSubmitting(false);
    onSuccess();
  };

  const contactMethodsList = [
    { id: "phone", label: "Телефон", icon: Phone },
    { id: "telegram", label: "Telegram", icon: Send },
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white/80">Ваше имя</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите имя"
          required
          className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary/30"
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white/80">Телефон</label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+996 XXX XXX XXX"
          type="tel"
          required
          className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary/30"
        />
      </div>

      {/* Contact Methods */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white/80">
          Как с вами связаться? <span className="text-primary">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {contactMethodsList.map((method) => {
            const isSelected = contactMethods.includes(method.id);
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => toggleContactMethod(method.id)}
                className={`relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all ${
                  isSelected
                    ? "bg-primary text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-primary" />
                  </div>
                )}
                <method.icon className="w-5 h-5" />
                <span className="text-xs font-semibold">{method.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Architect checkbox */}
      {wantsVeranda && (
        <button
          type="button"
          onClick={() => setNeedsArchitect(!needsArchitect)}
          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
            needsArchitect
              ? "bg-primary/20 border-primary/30"
              : "bg-white/5 border-white/20 hover:border-white/30"
          }`}
        >
          <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
            needsArchitect ? "bg-primary" : "bg-white/20"
          }`}>
            {needsArchitect && <Check className="h-3 w-3 text-white" />}
          </div>
          <span className="text-sm font-semibold text-white">
            Консультация с архитектором (веранда)
          </span>
        </button>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting || !name.trim() || !phone.trim() || contactMethods.length === 0}
        className="w-full py-3.5 bg-gradient-to-r from-primary to-[hsl(var(--gold-dark))] text-white font-semibold hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Отправляем...
          </span>
        ) : (
          "Отправить заявку"
        )}
      </Button>

      <p className="text-center text-white/40 text-xs">
        Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
      </p>
    </form>
  );
}

// Компонент для изображения со скелетоном
interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  draggable?: boolean;
}

function ImageWithSkeleton({ src, alt, className = "", loading = "lazy", draggable = true }: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Skeleton shimmer effect */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-white/10 overflow-hidden">
          <div 
            className="absolute inset-0 animate-shimmer"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)"
            }}
          />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        loading={loading}
        draggable={draggable}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

// Компонент для изображения карточки со скелетоном
interface CardImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
}

const CardImageWithSkeleton = forwardRef<HTMLImageElement, CardImageWithSkeletonProps>(
  function CardImageWithSkeleton({ src, alt, className = "" }, ref) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
      <>
        {/* Skeleton shimmer effect */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-muted overflow-hidden z-0">
            <div 
              className="absolute inset-0 animate-shimmer"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(195,153,107,0.15) 50%, transparent 100%)"
              }}
            />
          </div>
        )}
        <img
          ref={ref}
          src={src}
          alt={alt}
          className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      </>
    );
  }
);
CardImageWithSkeleton.displayName = "CardImageWithSkeleton";

// Компонент модального окна - унифицированный стиль
interface HouseModalProps {
  house: HouseModel;
  onClose: () => void;
}

const HouseModal = forwardRef<HTMLDivElement, HouseModalProps>(function HouseModal({ house, onClose }, ref) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [wantsVeranda, setWantsVeranda] = useState(false);
  const [viewMode, setViewMode] = useState<"gallery" | "floorplan">("gallery");
  
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);
  
  // Thumbnails scroll
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Check scroll state
  const updateScrollState = () => {
    if (thumbnailsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = thumbnailsRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };
  
  // Scroll thumbnails
  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailsRef.current) {
      const scrollAmount = 300;
      thumbnailsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };
  
  useEffect(() => {
    updateScrollState();
    const el = thumbnailsRef.current;
    if (el) {
      el.addEventListener("scroll", updateScrollState);
      return () => el.removeEventListener("scroll", updateScrollState);
    }
  }, [viewMode]);

  // Генерируем пути к изображениям
  const galleryImages = generateImagePaths(house.catalogPath, "gallery", house.galleryCount);
  const galleryExtraImages = generateImagePaths(house.catalogPath, "gallery-extra", house.galleryExtraCount, "extra-");
  
  // Генерируем пути к планировкам с учётом расширений (webp или pdf)
  const floorPlanItems = house.floorPlanFiles.map(file => ({
    path: `/catalog/${house.catalogPath}/floor-plan/${file.name}.${file.ext}`,
    isPdf: file.ext === "pdf",
  }));
  
  // Все изображения для галереи: обложка → реальные фото (extra) → рендеры (gallery)
  const allGalleryImages = [house.coverImage, ...galleryExtraImages, ...galleryImages];
  
  // Для галереи - просто массив путей, для планировок - объекты с info
  const currentItemCount = viewMode === "gallery" ? allGalleryImages.length : floorPlanItems.length;

  // Preload adjacent images for instant switching
  useEffect(() => {
    const imagesToPreload: string[] = [];
    const currentImages = viewMode === "gallery" ? allGalleryImages : floorPlanItems.filter(item => !item.isPdf).map(item => item.path);
    
    // Preload previous 2 and next 3 images
    for (let i = -2; i <= 3; i++) {
      const idx = currentImageIndex + i;
      if (idx >= 0 && idx < currentImages.length && idx !== currentImageIndex) {
        const src = viewMode === "gallery" ? currentImages[idx] : currentImages[idx];
        if (src) imagesToPreload.push(src);
      }
    }
    
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [currentImageIndex, viewMode, allGalleryImages, floorPlanItems]);

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
      if (diff > 0 && currentImageIndex < currentItemCount - 1) {
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
      if (diff > 0 && currentImageIndex < currentItemCount - 1) {
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

  // Рендер содержимого галереи - картинка или PDF с skeleton
  const renderGalleryContent = () => {
    if (viewMode === "gallery") {
      // Обычная галерея - с skeleton
      return (
        <ImageWithSkeleton
          src={allGalleryImages[currentImageIndex]}
          alt={house.name}
          className="w-full h-full object-contain pointer-events-none"
          draggable={false}
          loading="eager"
        />
      );
    } else {
      // Планировки - могут быть PDF или изображения
      const currentItem = floorPlanItems[currentImageIndex];
      if (currentItem.isPdf) {
        return (
          <div className="w-full h-full flex items-center justify-center bg-white">
            <Document
              file={currentItem.path}
              loading={
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              }
              error={
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
                  <p className="text-sm">Не удалось загрузить PDF</p>
                  <a 
                    href={currentItem.path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary underline text-sm mt-2"
                  >
                    Открыть в новой вкладке
                  </a>
                </div>
              }
              className="flex items-center justify-center h-full"
            >
              <Page 
                pageNumber={1} 
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="max-h-full"
                width={Math.min(500, window.innerWidth - 40)}
              />
            </Document>
          </div>
        );
      } else {
        return (
          <ImageWithSkeleton
            src={currentItem.path}
            alt={`${house.name} планировка`}
            className="w-full h-full object-contain pointer-events-none"
            draggable={false}
            loading="eager"
          />
        );
      }
    }
  };

  // Стандартный вид с деталями дома — GLASSMORPHISM ДИЗАЙН (с морфингом формы)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        className="relative w-full max-w-5xl max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glassmorphism container */}
        <div 
          className="relative rounded-3xl overflow-hidden h-full"
          style={{ 
            background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255,255,255,0.1)"
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all hover:rotate-90 duration-300"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          <div className="flex flex-col lg:flex-row h-full max-h-[85vh]">
            {/* Left: Image Gallery — 60% */}
            <div className="w-full lg:w-[60%] flex flex-col h-[45vh] lg:h-[85vh] flex-shrink-0">
              {/* Main image area */}
              <div 
                className="relative flex-1 min-h-0 select-none cursor-grab active:cursor-grabbing bg-black/20"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${viewMode}-${currentImageIndex}`}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {renderGalleryContent()}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation arrows */}
                <div className="hidden lg:flex absolute inset-0 items-center justify-between px-4 pointer-events-none">
                  <button
                    onClick={() => currentImageIndex > 0 && setCurrentImageIndex(prev => prev - 1)}
                    className={`p-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/10 rounded-full transition-all pointer-events-auto ${
                      currentImageIndex === 0 ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  <button
                    onClick={() => currentImageIndex < currentItemCount - 1 && setCurrentImageIndex(prev => prev + 1)}
                    className={`p-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/10 rounded-full transition-all pointer-events-auto ${
                      currentImageIndex === currentItemCount - 1 ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
                </div>

                {/* Photo counter badge */}
                <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white text-sm font-medium">
                  {currentImageIndex + 1} / {currentItemCount}
                </div>

                {showSwipeHint && currentItemCount > 1 && (
                  <div className="lg:hidden">
                    <SwipeIndicator />
                  </div>
                )}
              </div>

              {/* Thumbnail strip - hidden on mobile, visible on desktop - 2X LARGER THUMBNAILS with arrows */}
              <div className="hidden lg:block flex-shrink-0 bg-black/30 backdrop-blur-sm border-t border-white/10 p-3 relative">
                {/* Left scroll arrow */}
                <button
                  onClick={() => scrollThumbnails("left")}
                  className={`absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 flex items-center justify-center transition-all ${
                    canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 text-white" />
                </button>
                
                {/* Right scroll arrow */}
                <button
                  onClick={() => scrollThumbnails("right")}
                  className={`absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 flex items-center justify-center transition-all ${
                    canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <ChevronRight className="h-4 w-4 text-white" />
                </button>
                
                <div 
                  ref={thumbnailsRef}
                  className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-10"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {/* Gallery thumbnails - 2X size: 160x112px */}
                  {allGalleryImages.map((img, idx) => (
                    <button
                      key={`gallery-${idx}`}
                      onClick={() => {
                        setViewMode("gallery");
                        setCurrentImageIndex(idx);
                      }}
                      className={`relative flex-shrink-0 w-40 h-28 rounded-xl overflow-hidden border-2 transition-all ${
                        viewMode === "gallery" && currentImageIndex === idx
                          ? "border-primary ring-2 ring-primary/30 scale-105"
                          : "border-transparent hover:border-white/40 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Фото ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {/* Number badge */}
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-xs text-white font-medium">
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                  {/* Floor plan thumbnails separator */}
                  {floorPlanItems.length > 0 && allGalleryImages.length > 0 && (
                    <div className="flex-shrink-0 w-0.5 bg-gradient-to-b from-transparent via-white/30 to-transparent mx-2 self-stretch" />
                  )}
                  {/* Floor plan thumbnails - 2X size: 160x112px */}
                  {floorPlanItems.map((item, idx) => (
                    <button
                      key={`plan-${idx}`}
                      onClick={() => {
                        setViewMode("floorplan");
                        setCurrentImageIndex(idx);
                      }}
                      className={`relative flex-shrink-0 w-40 h-28 rounded-xl overflow-hidden border-2 transition-all ${
                        viewMode === "floorplan" && currentImageIndex === idx
                          ? "border-primary ring-2 ring-primary/30 scale-105"
                          : "border-transparent hover:border-white/40 opacity-80 hover:opacity-100"
                      }`}
                    >
                      {item.isPdf ? (
                        <div className="w-full h-full bg-white/10 flex items-center justify-center">
                          <Layers className="h-8 w-8 text-white/60" />
                        </div>
                      ) : (
                        <img
                          src={item.path}
                          alt={`Планировка ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                      {/* Plan badge */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-primary/80 text-xs text-white font-semibold">
                        План {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Content Panel — 40% with morphing form */}
            <div className="w-full lg:w-[40%] flex flex-col h-[40vh] lg:h-[85vh] overflow-hidden">
              <AnimatePresence mode="wait">
                {showThankYou ? (
                  /* Thank You state */
                  <motion.div
                    key="thank-you"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex-1 flex flex-col items-center justify-center p-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6"
                    >
                      <CheckCircle className="h-10 w-10 text-primary" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-3 font-rising">Спасибо!</h3>
                    <p className="text-white/60 text-center mb-6">Мы свяжемся с вами в течение 15 минут</p>
                    <Button
                      onClick={handleCloseAll}
                      className="bg-primary hover:bg-primary/90 text-white px-8"
                    >
                      Закрыть
                    </Button>
                  </motion.div>
                ) : showForm ? (
                  /* Form state - morphed inside the modal */
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    {/* Form header */}
                    <div className="p-5 lg:p-6 pb-3 flex items-center gap-3">
                      <button 
                        onClick={() => setShowForm(false)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5 text-white" />
                      </button>
                      <div>
                        <h3 className="text-lg font-bold text-white font-rising">Получить консультацию</h3>
                        <p className="text-sm text-white/60">{house.name}</p>
                      </div>
                    </div>
                    
                    {/* Form content - scrollable */}
                    <div className="flex-1 overflow-y-auto px-5 lg:px-6 pb-6">
                      <InlineConsultationForm 
                        houseName={house.name}
                        onSuccess={handleFormSuccess}
                        wantsVeranda={wantsVeranda}
                      />
                    </div>
                  </motion.div>
                ) : (
                  /* Default house info state */
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    {/* Scrollable content */}
                    <div className="flex-1 overflow-y-auto p-5 lg:p-6">
                      {/* Header */}
                      <div className="mb-5">
                        <span className="inline-block mb-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
                          {house.projectLabel}
                        </span>
                        <h2 className="text-2xl lg:text-3xl font-bold text-white font-rising">
                          {house.name}
                        </h2>
                      </div>

                      {/* Main specs — 2x2 grid with glassmorphism */}
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                          <div className="flex items-center gap-2 text-primary mb-1">
                            <Maximize className="h-4 w-4" />
                            <span className="text-xs uppercase tracking-wide font-semibold">Площадь</span>
                          </div>
                          <p className="text-2xl font-bold text-white">{house.area} м²</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                          <div className="flex items-center gap-2 text-white/60 mb-1">
                            <Layers className="h-4 w-4" />
                            <span className="text-xs uppercase tracking-wide font-semibold">Этажей</span>
                          </div>
                          <p className="text-2xl font-bold text-white">{house.floors}</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                          <div className="flex items-center gap-2 text-white/60 mb-1">
                            <BedDouble className="h-4 w-4" />
                            <span className="text-xs uppercase tracking-wide font-semibold">Спальни</span>
                          </div>
                          <p className="text-2xl font-bold text-white">{house.bedrooms}</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                          <div className="flex items-center gap-2 text-white/60 mb-1">
                            <Bath className="h-4 w-4" />
                            <span className="text-xs uppercase tracking-wide font-semibold">Санузлы</span>
                          </div>
                          <p className="text-2xl font-bold text-white">{house.bathrooms}</p>
                        </div>
                      </div>

                      {/* Veranda */}
                      {house.hasVeranda ? (
                        <div className="flex items-center gap-3 bg-primary/20 backdrop-blur-sm rounded-xl p-4 mb-5 border border-primary/30">
                          <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
                            <Trees className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-white">Веранда</p>
                            {house.verandaArea && (
                              <p className="text-sm text-white/60">{house.verandaArea} м²</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-white/20 bg-white/5 backdrop-blur-sm p-4 mb-5">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                              <Trees className="h-5 w-5 text-white/60" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-white/60 mb-2">
                                Веранда не предусмотрена. Хотите добавить?
                              </p>
                              <button
                                onClick={() => setWantsVeranda(!wantsVeranda)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-semibold ${
                                  wantsVeranda
                                    ? "bg-primary border-primary text-white"
                                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                                }`}
                              >
                                {wantsVeranda ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Plus className="h-4 w-4" />
                                )}
                                <span>{wantsVeranda ? "Добавлена" : "Добавить веранду"}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Floor Plans Thumbnails Section */}
                      {floorPlanItems.length > 0 && (
                        <div className="mb-5">
                          <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Layers className="h-4 w-4" />
                            Планировки
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {floorPlanItems.map((item, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setViewMode("floorplan");
                                  setCurrentImageIndex(idx);
                                }}
                                className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                                  viewMode === "floorplan" && currentImageIndex === idx
                                    ? "border-primary ring-2 ring-primary/30"
                                    : "border-white/10 hover:border-white/30"
                                }`}
                              >
                                {item.isPdf ? (
                                  <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
                                    <div className="text-center">
                                      <Layers className="h-6 w-6 text-white/60 mx-auto mb-1" />
                                      <span className="text-xs text-white/60">PDF</span>
                                    </div>
                                  </div>
                                ) : (
                                  <img
                                    src={item.path}
                                    alt={`Планировка ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                <span className="absolute bottom-2 left-2 text-xs font-medium text-white">
                                  План {idx + 1}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sticky bottom CTA */}
                    <div className="p-5 lg:p-6 pt-4 bg-black/20 backdrop-blur-sm border-t border-white/10">
                      {/* Quick contact */}
                      <div className="flex gap-2 mb-3">
                        <a
                          href="https://wa.me/996551033960"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20bd5a] transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                          WhatsApp
                        </a>
                        <a
                          href="tel:+996551033960"
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          Позвонить
                        </a>
                      </div>
                      <button
                        onClick={() => setShowForm(true)}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-[hsl(var(--gold-dark))] text-white font-semibold text-base hover:opacity-90 transition-opacity shadow-lg"
                      >
                        Получить консультацию
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});
HouseModal.displayName = "HouseModal";

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
  const isMobile = useIsMobile();
  const [activeProject, setActiveProject] = useState<ProjectType>("all");
  const [activeAreaRange, setActiveAreaRange] = useState("all");
  const [selectedHouse, setSelectedHouse] = useState<HouseModel | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // На мобильных устройствах показываем CatalogAppView
  // (ContactModal is now embedded inside CatalogAppView as InlineMobileContactForm)
  if (isMobile) {
    return <CatalogAppView />;
  }  // Фильтрация по проекту
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredHouses.map((house, index) => {
              // Используем coverImage из общего файла данных
              const cardImage = house.coverImage;
              
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
                  {/* Image Container - with skeleton loading */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <CardImageWithSkeleton
                      src={cardImage}
                      alt={house.name}
                      className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
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
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src="/catalog/covers/custom-project.webp"
                    alt="Индивидуальный проект"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Premium hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--charcoal))]/80 via-[hsl(var(--charcoal))]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
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

