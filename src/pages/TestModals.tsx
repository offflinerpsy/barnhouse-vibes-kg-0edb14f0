/**
 * Тестовая страница для просмотра вариантов модалок каталога
 * ВРЕМЕННАЯ - удалить после выбора финального дизайна
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HouseModalVariantA } from "@/components/landing/HouseModalVariantA";
import { HouseModalVariantB } from "@/components/landing/HouseModalVariantB";
import { HouseModalVariantC } from "@/components/landing/HouseModalVariantC";
import CatalogAppView from "@/components/landing/CatalogAppView";
import { AnimatePresence } from "framer-motion";

// Тестовые данные домов
const testHouses = {
  variantA: {
    id: "model-3",
    name: "Model 3",
    projectLabel: "Одноэтажный",
    area: 54,
    floors: 1,
    bedrooms: "1-2",
    bathrooms: 1,
    hasVeranda: true,
    verandaArea: 15,
    catalogPath: "model-1-54",
    galleryCount: 8,
    galleryExtraCount: 33,
  },
  variantB: {
    id: "model-6",
    name: "Model 6",
    projectLabel: "Одноэтажный",
    area: 108,
    floors: 1,
    bedrooms: "3-4",
    bathrooms: 2,
    hasVeranda: true,
    verandaArea: 25,
    catalogPath: "model-1-108",
    galleryCount: 4,
    galleryExtraCount: 54,
  },
  variantC: {
    id: "model-4",
    name: "Model 4",
    projectLabel: "Одноэтажный",
    area: 81,
    floors: 1,
    bedrooms: "2-3",
    bathrooms: 2,
    hasVeranda: true,
    verandaArea: 20,
    catalogPath: "model-1-81",
    galleryCount: 4,
    galleryExtraCount: 34,
  },
};

type ModalVariant = "A" | "B" | "C" | "APP" | null;

export default function TestModals() {
  const [activeModal, setActiveModal] = useState<ModalVariant>(null);

  const variants = [
    {
      id: "APP" as const,
      title: "App-Style Каталог",
      description: "Мобильное приложение: фото сверху, glass-панель с фильтрами снизу. Полностью app-like UX.",
      features: [
        "Горизонтальные фото сверху (60-70%)",
        "Glass-морфизм панель управления",
        "Фильтры по метражу (скролл)",
        "Большие стрелки при тапе на фото",
        "Переключатель Фото/Планировка",
      ],
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: "A" as const,
      title: "Вариант A — Fullscreen Gallery",
      description: "95% экрана = фото. Pill-табы для переключения между Фото/План/Детали. Минимальный UI, максимум контента.",
      house: testHouses.variantA,
      features: [
        "Fullscreen галерея с drag навигацией",
        "Pill-табы: Фото / Планировка / Детали",
        "Сначала реальные фото, потом рендеры",
        "Оверлей деталей на отдельном экране",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "B" as const,
      title: "Вариант B — Bottom Sheet",
      description: "100% fullscreen фото с выезжающим bottom sheet. Три состояния: collapsed → half → full.",
      house: testHouses.variantB,
      features: [
        "100% fullscreen галерея",
        "Swipe up для bottom sheet",
        "3 состояния sheet: collapsed/half/full",
        "Переключатель Фото/План сверху",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "C" as const,
      title: "Вариант C — Stories Style",
      description: "Instagram Stories UX. Tap left/right для навигации, прогресс-бары, auto-advance.",
      house: testHouses.variantC,
      features: [
        "Tap navigation (левая/правая часть)",
        "Прогресс-бары сверху",
        "Auto-advance 5 сек на фото",
        "Hold to pause",
      ],
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--charcoal))]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[hsl(var(--charcoal))]/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Назад на главную</span>
            </Link>
            <span className="text-xs text-white/40 uppercase tracking-wider">Тестовая страница</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-rising">
            Варианты дизайна каталога
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Выберите вариант и нажмите "Открыть", чтобы протестировать UX на мобильном устройстве. 
            Новый App-Style каталог — полностью переработанный интерфейс.
          </p>
        </div>

        {/* Variants Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {variants.map((variant) => (
            <div 
              key={variant.id}
              className={`relative bg-white/5 rounded-2xl border overflow-hidden group hover:border-white/20 transition-all ${
                variant.id === "APP" ? "border-emerald-500/50 ring-2 ring-emerald-500/20" : "border-white/10"
              }`}
            >
              {/* Gradient header */}
              <div className={`h-2 bg-gradient-to-r ${variant.color}`} />
              
              {/* NEW badge for APP variant */}
              {variant.id === "APP" && (
                <div className="absolute top-4 right-4 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                  NEW
                </div>
              )}
              
              <div className="p-6">
                {/* Title */}
                <h2 className="text-xl font-bold text-white mb-2">{variant.title}</h2>
                <p className="text-white/50 text-sm mb-4">{variant.description}</p>
                
                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {variant.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="text-[hsl(var(--gold))] mt-1">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Test house info - only for old variants */}
                {'house' in variant && variant.house && (
                  <div className="bg-white/5 rounded-xl p-4 mb-4">
                    <p className="text-xs text-white/40 mb-1">Тестовый дом:</p>
                    <p className="text-white font-medium">{variant.house.name}</p>
                    <p className="text-white/60 text-sm">{variant.house.area}м² • {variant.house.galleryExtraCount} реальных фото</p>
                  </div>
                )}

                {/* Open button */}
                <Button
                  onClick={() => setActiveModal(variant.id)}
                  className={`w-full h-12 bg-gradient-to-r ${variant.color} text-white font-semibold rounded-xl`}
                >
                  {variant.id === "APP" ? (
                    <Smartphone className="w-5 h-5 mr-2" />
                  ) : (
                    <Eye className="w-5 h-5 mr-2" />
                  )}
                  Открыть {variant.id === "APP" ? "App-Каталог" : `вариант ${variant.id}`}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison notes */}
        <div className="bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/20 rounded-2xl p-6 md:p-8">
          <h3 className="text-lg font-bold text-white mb-4">На что обратить внимание:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-white/70">
            <div>
              <p className="font-medium text-white mb-2">Мобильная версия:</p>
              <ul className="space-y-1">
                <li>• Насколько удобно листать фотографии?</li>
                <li>• Видно ли фото без "всматривания"?</li>
                <li>• Понятно ли где посмотреть планировку?</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-white mb-2">Общее впечатление:</p>
              <ul className="space-y-1">
                <li>• Какой вариант "премиальнее" выглядит?</li>
                <li>• Где информация не мешает фото?</li>
                <li>• Какой CTA лучше работает?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === "APP" && (
          <CatalogAppView onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "A" && (
          <HouseModalVariantA 
            house={testHouses.variantA} 
            onClose={() => setActiveModal(null)} 
          />
        )}
        {activeModal === "B" && (
          <HouseModalVariantB 
            house={testHouses.variantB} 
            onClose={() => setActiveModal(null)} 
          />
        )}
        {activeModal === "C" && (
          <HouseModalVariantC 
            house={testHouses.variantC} 
            onClose={() => setActiveModal(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
