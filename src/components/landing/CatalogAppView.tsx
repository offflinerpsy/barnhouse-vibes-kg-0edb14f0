import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Bed, Bath, Maximize, Home, Grid3X3, Phone, MessageCircle } from 'lucide-react';

// Данные домов
const houses = [
  {
    id: 'model-1-36',
    name: 'Модель 1-36',
    area: 36,
    bedrooms: 1,
    bathrooms: 1,
    price: 'от 2.1 млн ₸',
    galleryCount: 4,
    floorPlanCount: 1,
  },
  {
    id: 'model-1-54',
    name: 'Модель 1-54',
    area: 54,
    bedrooms: 2,
    bathrooms: 1,
    price: 'от 3.2 млн ₸',
    galleryCount: 8,
    floorPlanCount: 3,
  },
  {
    id: 'model-1-81',
    name: 'Модель 1-81',
    area: 81,
    bedrooms: 3,
    bathrooms: 2,
    price: 'от 4.8 млн ₸',
    galleryCount: 4,
    floorPlanCount: 0,
  },
  {
    id: 'model-1-108',
    name: 'Модель 1-108',
    area: 108,
    bedrooms: 4,
    bathrooms: 2,
    price: 'от 6.4 млн ₸',
    galleryCount: 4,
    floorPlanCount: 3,
  },
  {
    id: 'model-1-135',
    name: 'Модель 1-135',
    area: 135,
    bedrooms: 5,
    bathrooms: 3,
    price: 'от 8.0 млн ₸',
    galleryCount: 5,
    floorPlanCount: 3,
  },
];

const filters = [
  { id: 'all', label: 'Все' },
  { id: '36', label: '36 м²' },
  { id: '54', label: '54 м²' },
  { id: '81', label: '81 м²' },
  { id: '108', label: '108 м²' },
  { id: '135', label: '135 м²' },
];

interface CatalogAppViewProps {
  onClose?: () => void;
}

const CatalogAppView: React.FC<CatalogAppViewProps> = ({ onClose }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentHouseIndex, setCurrentHouseIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'photos' | 'plans'>('photos');
  const [showControls, setShowControls] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  // Фильтрация домов
  const filteredHouses = houses.filter(house => {
    if (activeFilter === 'all') return true;
    return house.area === parseInt(activeFilter);
  });

  const currentHouse = filteredHouses[currentHouseIndex] || filteredHouses[0];

  // Генерация путей к изображениям
  const getImages = useCallback(() => {
    if (!currentHouse) return [];
    const folder = viewMode === 'photos' ? 'gallery' : 'floor-plan';
    const count = viewMode === 'photos' ? currentHouse.galleryCount : currentHouse.floorPlanCount;
    const prefix = viewMode === 'photos' ? '' : 'plan-';
    
    return Array.from({ length: count }, (_, i) => 
      `/catalog/${currentHouse.id}/${folder}/${prefix}${i + 1}.webp`
    );
  }, [currentHouse, viewMode]);

  const images = getImages();

  // Сброс индекса при смене дома или режима
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentHouseIndex, viewMode, activeFilter]);

  // Показать контролы временно
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    const timeout = setTimeout(() => setShowControls(false), 3000);
    setControlsTimeout(timeout);
  }, [controlsTimeout]);

  // Навигация по изображениям
  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      showControlsTemporarily();
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      showControlsTemporarily();
    }
  };

  // Навигация по домам
  const nextHouse = () => {
    setCurrentHouseIndex((prev) => (prev + 1) % filteredHouses.length);
  };

  const prevHouse = () => {
    setCurrentHouseIndex((prev) => (prev - 1 + filteredHouses.length) % filteredHouses.length);
  };

  // Обработка свайпа
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      prevImage();
    } else if (info.offset.x < -threshold) {
      nextImage();
    }
  };

  // Тап по изображению
  const handleImageTap = () => {
    showControlsTemporarily();
  };

  if (!currentHouse) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <p className="text-foreground/60">Нет доступных проектов</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-b from-sky-100 to-sky-200 flex flex-col overflow-hidden"
    >
      {/* Кнопка закрытия */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-50 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-charcoal/80 hover:bg-white/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Верхняя часть - Изображение */}
      <div className="relative flex-1 min-h-0">
        <motion.div
          className="absolute inset-0 cursor-pointer"
          onClick={handleImageTap}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={`${currentHouse.id}-${viewMode}-${currentImageIndex}`}
              src={images[currentImageIndex] || '/placeholder.svg'}
              alt={currentHouse.name}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              draggable={false}
            />
          </AnimatePresence>

          {/* Градиент снизу для читаемости */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        </motion.div>

        {/* Большие стрелки навигации */}
        <AnimatePresence>
          {showControls && images.length > 1 && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors active:scale-95"
              >
                <ChevronLeft className="w-8 h-8" />
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors active:scale-95"
              >
                <ChevronRight className="w-8 h-8" />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* Переключатель Фото/Планировка */}
        <div className="absolute top-4 right-4 z-20">
          <div className="flex bg-white/20 backdrop-blur-md rounded-full p-1">
            <button
              onClick={() => setViewMode('photos')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === 'photos'
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Home className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('plans')}
              disabled={currentHouse.floorPlanCount === 0}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === 'plans'
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-white hover:bg-white/10'
              } ${currentHouse.floorPlanCount === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Индикатор изображений */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex 
                    ? 'w-6 bg-white' 
                    : 'w-1.5 bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}

        {/* Название на изображении */}
        <div className="absolute bottom-8 left-4 z-20">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">{currentHouse.name}</h2>
          <p className="text-white/80 text-sm">{currentHouse.price}</p>
        </div>
      </div>

      {/* Нижняя Glass-панель */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="relative z-30 bg-white/30 backdrop-blur-xl border-t border-white/40 rounded-t-3xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}
      >
        {/* Ручка для свайпа */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-charcoal/20 rounded-full" />
        </div>

        {/* Фильтры */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setActiveFilter(filter.id);
                  setCurrentHouseIndex(0);
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-white/50 text-charcoal/80 hover:bg-white/70'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Навигация по домам */}
        {filteredHouses.length > 1 && (
          <div className="px-4 pb-3 flex items-center justify-between">
            <button
              onClick={prevHouse}
              className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-charcoal/70 hover:bg-white/70 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-charcoal/60">
              {currentHouseIndex + 1} из {filteredHouses.length}
            </span>
            <button
              onClick={nextHouse}
              className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-charcoal/70 hover:bg-white/70 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Атрибуты */}
        <div className="px-4 pb-4">
          <div className="flex justify-around bg-white/40 rounded-2xl py-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                <Maximize className="w-5 h-5 text-charcoal/70" />
              </div>
              <span className="text-xs text-charcoal/60">Площадь</span>
              <span className="text-sm font-semibold text-charcoal">{currentHouse.area} м²</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                <Bed className="w-5 h-5 text-charcoal/70" />
              </div>
              <span className="text-xs text-charcoal/60">Спальни</span>
              <span className="text-sm font-semibold text-charcoal">{currentHouse.bedrooms}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                <Bath className="w-5 h-5 text-charcoal/70" />
              </div>
              <span className="text-xs text-charcoal/60">Санузлы</span>
              <span className="text-sm font-semibold text-charcoal">{currentHouse.bathrooms}</span>
            </div>
          </div>
        </div>

        {/* Кнопка консультации */}
        <div className="px-4 pb-4">
          <button
            onClick={() => setShowContactForm(true)}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-colors active:scale-[0.98]"
          >
            Получить консультацию
          </button>
        </div>
      </motion.div>

      {/* Форма консультации */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-end justify-center"
            onClick={() => setShowContactForm(false)}
          >
            {/* Затемнение */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
            
            {/* Форма */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-t-3xl p-6"
              style={{ paddingBottom: 'env(safe-area-inset-bottom, 24px)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Ручка */}
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 bg-charcoal/20 rounded-full" />
              </div>

              <h3 className="text-xl font-bold text-charcoal mb-4">
                Консультация по {currentHouse.name}
              </h3>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full px-4 py-3 bg-white/60 border border-white/40 rounded-xl text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  className="w-full px-4 py-3 bg-white/60 border border-white/40 rounded-xl text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Способ связи */}
              <div className="flex gap-3 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/60 rounded-xl text-charcoal/70 hover:bg-white/80 transition-colors">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">Звонок</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500/20 rounded-xl text-green-700 hover:bg-green-500/30 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">WhatsApp</span>
                </button>
              </div>

              <button className="w-full mt-4 py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg hover:bg-primary/90 transition-colors">
                Отправить заявку
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CatalogAppView;
