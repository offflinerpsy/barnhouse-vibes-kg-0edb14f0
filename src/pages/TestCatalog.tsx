/**
 * =============================================================================
 * TEST CATALOG - Экспериментальный мобильный каталог
 * =============================================================================
 * 
 * Новый подход к каталогу домов:
 * - Вертикальная прокрутка фотографий (как TikTok/Reels)
 * - Glassmorphism дизайн (iOS-style)
 * - Fullscreen lightbox для детального просмотра
 * - Постоянная навигация между моделями (Pills)
 * - Продуманный UX с четкой структурой
 * 
 * Route: /test-catalog
 * =============================================================================
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Maximize2, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// ============================================================================
// ДАННЫЕ МОДЕЛЕЙ
// ============================================================================

interface Model {
  id: string;
  name: string;
  area: number;
  price: string;
  galleryCount: number;
  galleryExtraCount: number;
  floorPlanCount: number;
}

const models: Model[] = [
  {
    id: 'model-1-36',
    name: 'Model 2',
    area: 36,
    price: 'от 2.1 млн ₸',
    galleryCount: 4,
    galleryExtraCount: 24,
    floorPlanCount: 1,
  },
  {
    id: 'model-1-54',
    name: 'Model 3',
    area: 54,
    price: 'от 3.2 млн ₸',
    galleryCount: 8,
    galleryExtraCount: 33,
    floorPlanCount: 3,
  },
  {
    id: 'model-1-81',
    name: 'Model 4',
    area: 81,
    price: 'от 4.8 млн ₸',
    galleryCount: 4,
    galleryExtraCount: 34,
    floorPlanCount: 0,
  },
  {
    id: 'model-1-108',
    name: 'Model 6',
    area: 108,
    price: 'от 6.4 млн ₸',
    galleryCount: 4,
    galleryExtraCount: 54,
    floorPlanCount: 3,
  },
  {
    id: 'model-1-135',
    name: 'Model 7',
    area: 135,
    price: 'от 8.0 млн ₸',
    galleryCount: 5,
    galleryExtraCount: 38,
    floorPlanCount: 3,
  },
];

// ============================================================================
// УТИЛИТЫ
// ============================================================================

/** Генерирует массив URL фотографий для модели */
const getPhotosForModel = (model: Model): string[] => {
  const mainGallery = Array.from(
    { length: model.galleryCount },
    (_, i) => `/catalog/${model.id}/gallery/${i + 1}.webp`
  );
  const extraGallery = Array.from(
    { length: model.galleryExtraCount },
    (_, i) => `/catalog/${model.id}/gallery-extra/extra-${i + 1}.webp`
  );
  return [...mainGallery, ...extraGallery];
};

// ============================================================================
// ГЛАВНЫЙ КОМПОНЕНТ
// ============================================================================

export default function TestCatalog() {
  const [currentModelId, setCurrentModelId] = useState('model-1-36');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenImageUrl, setFullscreenImageUrl] = useState<string | null>(null);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const currentModel = models.find(m => m.id === currentModelId) || models[0];
  const photos = getPhotosForModel(currentModel);

  // Отслеживание текущей фотографии при скролле
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const photoHeight = container.clientHeight;
      const index = Math.round(scrollTop / photoHeight);
      setCurrentPhotoIndex(Math.min(index, photos.length - 1));
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [photos.length]);

  // Сброс скролла при смене модели
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setCurrentPhotoIndex(0);
  }, [currentModelId]);

  const handlePhotoClick = (photoUrl: string) => {
    setFullscreenImageUrl(photoUrl);
    setIsFullscreen(true);
  };

  const handleModelSwitch = (modelId: string) => {
    setCurrentModelId(modelId);
  };

  return (
    <div className="relative h-screen w-screen bg-background overflow-hidden">
      {/* ============================================================
          GLASS TOP BAR - Навигация между моделями
          ============================================================ */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 px-4 py-3 safe-area-inset-top">
        <div className="flex items-center justify-between mb-3">
          <Link to="/" className="text-white">
            <Home className="w-6 h-6" />
          </Link>
          <span className="text-white font-medium text-sm">Каталог моделей</span>
          <Link to="/" className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </Link>
        </div>
        
        {/* Pills - переключатель моделей */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => handleModelSwitch(model.id)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all
                ${
                  model.id === currentModelId
                    ? 'bg-white text-charcoal shadow-lg'
                    : 'bg-white/20 text-white backdrop-blur-sm border border-white/30 hover:bg-white/30'
                }
              `}
            >
              {model.name} • {model.area}м²
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================
          VERTICAL PHOTO FEED - Вертикальная прокрутка фотографий
          ============================================================ */}
      <div
        ref={scrollContainerRef}
        className="h-screen overflow-y-auto snap-y snap-mandatory scrollbar-hide pt-[120px] pb-[140px]"
      >
        {photos.map((photoUrl, index) => (
          <div
            key={`${currentModelId}-${index}`}
            className="h-screen w-full snap-start flex items-center justify-center bg-charcoal cursor-pointer"
            onClick={() => handlePhotoClick(photoUrl)}
          >
            <motion.img
              src={photoUrl}
              alt={`${currentModel.name} - фото ${index + 1}`}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              loading={index < 3 ? 'eager' : 'lazy'} // Первые 3 фото загружаем сразу
            />
          </div>
        ))}
      </div>

      {/* ============================================================
          GLASS INFO PANEL - Информация о модели снизу
          ============================================================ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/60 via-black/30 to-transparent backdrop-blur-md px-6 py-4 pb-safe-area-inset-bottom">
        <div className="flex items-end justify-between">
          {/* Информация о модели */}
          <div className="flex-1">
            <h2 className="text-white text-2xl font-bold mb-1">
              {currentModel.name}
            </h2>
            <p className="text-white/80 text-sm mb-2">
              {currentModel.area}м² • {currentModel.price}
            </p>
            <div className="text-white/60 text-xs">
              Фото {currentPhotoIndex + 1} из {photos.length}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white p-3 rounded-full hover:bg-white/30 transition-all"
              title="Планировка"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <a
              href="https://wa.me/996222001112"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white p-3 rounded-full hover:bg-[#20BA5A] transition-all shadow-lg"
              title="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href="tel:+996222001112"
              className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 transition-all shadow-lg"
              title="Позвонить"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* ============================================================
          FULLSCREEN LIGHTBOX - Полноэкранный просмотр
          ============================================================ */}
      <AnimatePresence>
        {isFullscreen && fullscreenImageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm border border-white/30 text-white p-2 rounded-full"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Zoomable Image */}
            <motion.img
              src={fullscreenImageUrl}
              alt="Полноэкранное фото"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-full max-h-full object-contain"
              style={{ touchAction: 'pinch-zoom' }} // Native pinch-to-zoom
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
