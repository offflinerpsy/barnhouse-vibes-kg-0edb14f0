/**
 * =============================================================================
 * CATALOG SECTION - Каталог домов ERA
 * =============================================================================
 * 
 * ID: #catalog
 * 
 * Структура:
 * - Проекты (Barn House, Country, Hi-Tech, и т.д.)
 * - В каждом проекте модели с разным метражом
 * - Атрибуты: комнаты, спальни, санузлы, веранда
 * 
 * Фильтрация:
 * - По типу проекта
 * - По метражу внутри проекта
 * 
 * =============================================================================
 */

import { useState, useEffect, useRef } from "react";
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
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Типы проектов
type ProjectType = "all" | "barn-house" | "country" | "hi-tech" | "classic" | "minimalist";

// Интерфейс модели дома
interface HouseModel {
  id: string;
  name: string;
  projectType: Exclude<ProjectType, "all">;
  projectLabel: string;
  area: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  hasVeranda: boolean;
  verandaArea?: number;
  price: string;
  images: string[];
}

// Список проектов для фильтра
const projects: { value: ProjectType; label: string }[] = [
  { value: "all", label: "Все проекты" },
  { value: "barn-house", label: "Barn House" },
  { value: "country", label: "Country" },
  { value: "hi-tech", label: "Hi-Tech" },
  { value: "classic", label: "Классика" },
  { value: "minimalist", label: "Минимализм" },
];

// Диапазоны метража для подфильтра
const areaRanges = [
  { value: "all", label: "Все метражи" },
  { value: "small", label: "до 50м²", min: 0, max: 50 },
  { value: "medium", label: "50-100м²", min: 50, max: 100 },
  { value: "large", label: "100-150м²", min: 100, max: 150 },
  { value: "xlarge", label: "150м²+", min: 150, max: Infinity },
];

const houses: HouseModel[] = [
  // Barn House
  {
    id: "bh-45",
    name: "Barn House 45",
    projectType: "barn-house",
    projectLabel: "Barn House",
    area: 45,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    hasVeranda: true,
    verandaArea: 12,
    price: "от $24 000",
    images: [
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    ],
  },
  {
    id: "bh-75",
    name: "Barn House 75",
    projectType: "barn-house",
    projectLabel: "Barn House",
    area: 75,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    hasVeranda: true,
    verandaArea: 18,
    price: "от $42 000",
    images: [
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
    ],
  },
  {
    id: "bh-120",
    name: "Barn House 120",
    projectType: "barn-house",
    projectLabel: "Barn House",
    area: 120,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    hasVeranda: true,
    verandaArea: 25,
    price: "от $68 000",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    ],
  },
  // Country
  {
    id: "cnt-55",
    name: "Country 55",
    projectType: "country",
    projectLabel: "Country",
    area: 55,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    hasVeranda: true,
    verandaArea: 15,
    price: "от $28 000",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=2074&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084&auto=format&fit=crop",
    ],
  },
  {
    id: "cnt-85",
    name: "Country 85",
    projectType: "country",
    projectLabel: "Country",
    area: 85,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    hasVeranda: true,
    verandaArea: 20,
    price: "от $46 000",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2187&auto=format&fit=crop",
    ],
  },
  {
    id: "cnt-140",
    name: "Country 140",
    projectType: "country",
    projectLabel: "Country",
    area: 140,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    hasVeranda: true,
    verandaArea: 30,
    price: "от $78 000",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2187&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600573472556-e636c2acda88?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070&auto=format&fit=crop",
    ],
  },
  // Hi-Tech
  {
    id: "ht-60",
    name: "Hi-Tech 60",
    projectType: "hi-tech",
    projectLabel: "Hi-Tech",
    area: 60,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    hasVeranda: false,
    price: "от $38 000",
    images: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=2074&auto=format&fit=crop",
    ],
  },
  {
    id: "ht-100",
    name: "Hi-Tech 100",
    projectType: "hi-tech",
    projectLabel: "Hi-Tech",
    area: 100,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    hasVeranda: true,
    verandaArea: 15,
    price: "от $62 000",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=2074&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    ],
  },
  {
    id: "ht-160",
    name: "Hi-Tech 160",
    projectType: "hi-tech",
    projectLabel: "Hi-Tech",
    area: 160,
    rooms: 5,
    bedrooms: 3,
    bathrooms: 3,
    hasVeranda: true,
    verandaArea: 35,
    price: "от $98 000",
    images: [
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=2074&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
    ],
  },
  // Classic
  {
    id: "cls-70",
    name: "Классика 70",
    projectType: "classic",
    projectLabel: "Классика",
    area: 70,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    hasVeranda: true,
    verandaArea: 14,
    price: "от $36 000",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    ],
  },
  {
    id: "cls-110",
    name: "Классика 110",
    projectType: "classic",
    projectLabel: "Классика",
    area: 110,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    hasVeranda: true,
    verandaArea: 22,
    price: "от $58 000",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=2074&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084&auto=format&fit=crop",
    ],
  },
  // Minimalist
  {
    id: "min-40",
    name: "Минимал 40",
    projectType: "minimalist",
    projectLabel: "Минимализм",
    area: 40,
    rooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    hasVeranda: false,
    price: "от $22 000",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2187&auto=format&fit=crop",
    ],
  },
  {
    id: "min-65",
    name: "Минимал 65",
    projectType: "minimalist",
    projectLabel: "Минимализм",
    area: 65,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    hasVeranda: true,
    verandaArea: 10,
    price: "от $35 000",
    images: [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2187&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600573472556-e636c2acda88?q=80&w=2070&auto=format&fit=crop",
    ],
  },
];

// Компонент индикатора свайпа
function SwipeIndicator() {
  return (
    <motion.div 
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
}

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

// Компонент модального окна
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
  
  // Для поддержки свайпа мышью и тачем
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  // Скрываем подсказку после первого свайпа
  useEffect(() => {
    const timer = setTimeout(() => setShowSwipeHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX.current === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = dragStartX.current - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentImageIndex < house.images.length - 1) {
        setCurrentImageIndex(prev => prev + 1);
        setShowSwipeHint(false);
      } else if (diff < 0 && currentImageIndex > 0) {
        setCurrentImageIndex(prev => prev - 1);
        setShowSwipeHint(false);
      }
    }
    
    dragStartX.current = null;
  };

  // Mouse events для поддержки свайпа мышью
  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;
    
    // Предотвращаем выделение текста при перетаскивании
    e.preventDefault();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current || dragStartX.current === null) {
      isDragging.current = false;
      return;
    }
    
    const diff = dragStartX.current - e.clientX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentImageIndex < house.images.length - 1) {
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

  const handleConsultation = () => {
    setShowForm(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl bg-card rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-charcoal/50 hover:bg-charcoal/70 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        <div className="flex flex-col md:flex-row h-auto md:h-[520px]">
          {/* Image Gallery */}
          <div 
            className="relative w-full md:w-1/2 h-64 md:h-full bg-charcoal select-none cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={house.images[currentImageIndex]}
                alt={house.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
            </AnimatePresence>

            {/* Image dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {house.images.map((_, idx) => (
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

            {/* Desktop navigation arrows */}
            <div className="hidden md:flex absolute inset-0 items-center justify-between px-3 pointer-events-none">
              <button
                onClick={() => currentImageIndex > 0 && setCurrentImageIndex(prev => prev - 1)}
                className={`p-2 bg-charcoal/50 hover:bg-charcoal/70 rounded-full transition-all pointer-events-auto ${
                  currentImageIndex === 0 ? "opacity-0" : "opacity-100"
                }`}
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={() => currentImageIndex < house.images.length - 1 && setCurrentImageIndex(prev => prev + 1)}
                className={`p-2 bg-charcoal/50 hover:bg-charcoal/70 rounded-full transition-all pointer-events-auto ${
                  currentImageIndex === house.images.length - 1 ? "opacity-0" : "opacity-100"
                }`}
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Swipe indicator - only on mobile */}
            {showSwipeHint && house.images.length > 1 && (
              <div className="md:hidden">
                <SwipeIndicator />
              </div>
            )}

            {/* Project badge */}
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
              {house.projectLabel}
            </Badge>
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
            <AnimatePresence mode="wait">
              {showThankYou ? (
                <ThankYouMessage key="thank-you" onClose={handleCloseAll} />
              ) : showForm ? (
                <ConsultationForm 
                  key="form"
                  houseName={house.name} 
                  onBack={() => setShowForm(false)}
                  onSuccess={handleFormSuccess}
                  wantsVeranda={wantsVeranda}
                />
              ) : (
                <motion.div
                  key="details"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col"
                >
                  {/* Title and price */}
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                      {house.name}
                    </h2>
                    <p className="text-2xl font-bold text-primary">{house.price}</p>
                  </div>

                  {/* Attributes grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-background rounded-xl p-4 border border-border">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Maximize className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-wide">Площадь</span>
                      </div>
                      <p className="text-lg font-semibold text-foreground">{house.area} м²</p>
                    </div>
                    <div className="bg-background rounded-xl p-4 border border-border">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <DoorOpen className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-wide">Комнат</span>
                      </div>
                      <p className="text-lg font-semibold text-foreground">{house.rooms}</p>
                    </div>
                    <div className="bg-background rounded-xl p-4 border border-border">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <BedDouble className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-wide">Спальни</span>
                      </div>
                      <p className="text-lg font-semibold text-foreground">{house.bedrooms}</p>
                    </div>
                    <div className="bg-background rounded-xl p-4 border border-border">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Bath className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-wide">Санузлы</span>
                      </div>
                      <p className="text-lg font-semibold text-foreground">{house.bathrooms}</p>
                    </div>
                  </div>

                  {/* Veranda info or "Add veranda" option */}
                  {house.hasVeranda ? (
                    <div className="flex items-center gap-3 bg-primary/10 rounded-xl p-4 mb-6">
                      <Trees className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Веранда</p>
                        {house.verandaArea && (
                          <p className="text-sm text-muted-foreground">{house.verandaArea} м²</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Trees className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground mb-3">
                            В этом проекте веранда не предусмотрена
                          </p>
                          <button
                            onClick={() => setWantsVeranda(!wantsVeranda)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm ${
                              wantsVeranda
                                ? "bg-primary/10 border-primary/30 text-primary"
                                : "bg-muted/50 border-border text-foreground hover:border-primary/30"
                            }`}
                          >
                            {wantsVeranda ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                            <span>Хочу добавить веранду</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="mt-auto">
                    <Button
                      onClick={handleConsultation}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-semibold"
                    >
                      Получить консультацию
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Модальное окно для индивидуального проекта
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-card rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 hover:bg-muted rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-foreground" />
        </button>

        <div className="p-6 md:p-8 min-h-[450px]">
          <AnimatePresence mode="wait">
            {showThankYou ? (
              <ThankYouMessage key="thank-you" onClose={handleCloseAll} />
            ) : showForm ? (
              <ConsultationForm 
                key="form"
                houseName="Индивидуальный проект" 
                onBack={onClose}
                onSuccess={handleFormSuccess}
                isCustomProject={true}
              />
            ) : null}
          </AnimatePresence>
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
            {filteredHouses.map((house, index) => (
              <motion.div
                key={house.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedHouse(house)}
              >
                {/* Card with elevated design */}
                <div className="relative bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={house.images[0]}
                      alt={house.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
                    
                    {/* Project badge */}
                    <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-primary-foreground border-0">
                      {house.projectLabel}
                    </Badge>

                    {/* Price on image */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-xl font-bold text-white drop-shadow-lg">
                        {house.price}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {house.name}
                    </h3>

                    {/* Attributes */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Maximize className="h-4 w-4 text-primary" />
                        <span>{house.area} м²</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BedDouble className="h-4 w-4 text-primary" />
                        <span>{house.bedrooms} спал.</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Bath className="h-4 w-4 text-primary" />
                        <span>{house.bathrooms} сануз.</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Trees className="h-4 w-4 text-primary" />
                        <span>{house.hasVeranda ? "Веранда" : "—"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              </motion.div>
            ))}
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

        {/* Custom Project CTA Block */}
        <motion.div
          className="mt-16 md:mt-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative bg-gradient-to-br from-primary/5 via-card to-primary/10 rounded-3xl p-8 md:p-12 border border-primary/20 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <PenTool className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Не нашли подходящий проект?
                </h3>
                <p className="text-muted-foreground text-lg mb-6 max-w-xl">
                  Хотите что-то добавить в планировку или создать дом по своему проекту? 
                  Наши архитекторы разработают индивидуальное решение специально для вас.
                </p>
                <Button
                  onClick={() => setShowCustomModal(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold"
                >
                  Заказать индивидуальный проект
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
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
