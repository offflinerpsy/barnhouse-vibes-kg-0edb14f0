import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { X, Bed, Bath, Maximize, Phone, MessageCircle, ChevronLeft, ChevronRight, Camera, Layers, ChevronUp, ChevronDown, Hand } from 'lucide-react';

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
    extraGalleryCount: 24,
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
    extraGalleryCount: 33,
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
    extraGalleryCount: 34,
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
    extraGalleryCount: 54,
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
    extraGalleryCount: 38,
    floorPlanCount: 3,
  },
];

const filters = [
  { id: 'all', label: 'Все', shortLabel: 'Все' },
  { id: '36', label: '36 м²', shortLabel: '36' },
  { id: '54', label: '54 м²', shortLabel: '54' },
  { id: '81', label: '81 м²', shortLabel: '81' },
  { id: '108', label: '108 м²', shortLabel: '108' },
  { id: '135', label: '135 м²', shortLabel: '135' },
];

interface CatalogAppViewProps {
  onClose?: () => void;
}

const CatalogAppView: React.FC<CatalogAppViewProps> = ({ onClose }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentHouseIndex, setCurrentHouseIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'photos' | 'plans'>('photos');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [showFilterHint, setShowFilterHint] = useState(true);
  
  const filterScrollRef = useRef<HTMLDivElement>(null);
  const photoFeedRef = useRef<HTMLDivElement>(null);

  // Скрываем подсказку свайпа через 3 секунды
  useEffect(() => {
    const timer = setTimeout(() => setShowSwipeHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Скрываем подсказку фильтров при скролле
  const handleFilterScroll = () => {
    if (showFilterHint) setShowFilterHint(false);
  };

  // Фильтрация домов
  const filteredHouses = houses.filter(house => {
    if (activeFilter === 'all') return true;
    return house.area === parseInt(activeFilter);
  });

  const currentHouse = filteredHouses[currentHouseIndex] || filteredHouses[0];

  // Генерация путей к изображениям
  const getImages = useCallback(() => {
    if (!currentHouse) return [];
    
    if (viewMode === 'plans') {
      return Array.from({ length: currentHouse.floorPlanCount }, (_, i) => 
        `/catalog/${currentHouse.id}/floor-plan/plan-${i + 1}.webp`
      );
    }
    
    const mainGallery = Array.from({ length: currentHouse.galleryCount }, (_, i) => 
      `/catalog/${currentHouse.id}/gallery/${i + 1}.webp`
    );
    const extraGallery = Array.from({ length: currentHouse.extraGalleryCount }, (_, i) => 
      `/catalog/${currentHouse.id}/gallery-extra/extra-${i + 1}.webp`
    );
    
    return [...mainGallery, ...extraGallery];
  }, [currentHouse, viewMode]);

  const images = getImages();

  // Сброс при смене дома или режима
  useEffect(() => {
    setFullscreenImage(null);
    if (photoFeedRef.current) {
      photoFeedRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentHouseIndex, viewMode, activeFilter]);

  // Навигация по домам
  const nextHouse = () => {
    setCurrentHouseIndex((prev) => (prev + 1) % filteredHouses.length);
  };

  const prevHouse = () => {
    setCurrentHouseIndex((prev) => (prev - 1 + filteredHouses.length) % filteredHouses.length);
  };

  // Открытие fullscreen
  const openFullscreen = (src: string, index: number) => {
    setFullscreenImage(src);
    setFullscreenIndex(index);
  };

  // Навигация в fullscreen
  const nextFullscreen = () => {
    const nextIndex = (fullscreenIndex + 1) % images.length;
    setFullscreenIndex(nextIndex);
    setFullscreenImage(images[nextIndex]);
  };

  const prevFullscreen = () => {
    const prevIndex = (fullscreenIndex - 1 + images.length) % images.length;
    setFullscreenIndex(prevIndex);
    setFullscreenImage(images[prevIndex]);
  };

  // Обработка свайпа в fullscreen
  const handleFullscreenDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (Math.abs(info.offset.y) > threshold) {
      if (info.offset.y < 0) {
        nextFullscreen();
      } else {
        prevFullscreen();
      }
    }
  };

  // Свайп для смены проекта
  const handleProjectSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') nextHouse();
    else prevHouse();
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
      className="fixed inset-0 z-50 bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50/30 flex flex-col overflow-hidden"
    >
      {/* Шапка с названием */}
      <div className="relative z-30 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-2xl border-b border-stone-200/50 shadow-sm">
        {onClose && (
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-all active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        <div className="flex-1 text-center px-3">
          <h1 className="text-xl font-bold text-stone-800 tracking-tight">{currentHouse.name}</h1>
          <p className="text-sm font-semibold text-amber-600">{currentHouse.price}</p>
        </div>

        {/* Переключатель Фото/Планировка */}
        <div className="flex bg-stone-100 rounded-2xl p-1.5 gap-1">
          <button
            onClick={() => setViewMode('photos')}
            className={`px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              viewMode === 'photos'
                ? 'bg-white text-stone-800 shadow-md'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span className="text-xs font-semibold hidden xs:inline">Фото</span>
          </button>
          <button
            onClick={() => setViewMode('plans')}
            disabled={currentHouse.floorPlanCount === 0}
            className={`px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              viewMode === 'plans'
                ? 'bg-white text-stone-800 shadow-md'
                : 'text-stone-500 hover:text-stone-700'
            } ${currentHouse.floorPlanCount === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-xs font-semibold hidden xs:inline">План</span>
          </button>
        </div>
      </div>

      {/* Вертикальная лента фотографий с touch-свайпом */}
      <motion.div 
        ref={photoFeedRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        <style>{`.photo-feed::-webkit-scrollbar { display: none; }`}</style>
        <div className="flex flex-col photo-feed">
          {images.map((src, index) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03, duration: 0.25 }}
              className="relative w-full cursor-pointer group"
              onClick={() => openFullscreen(src, index)}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <img
                  src={src}
                  alt={`${currentHouse.name} - ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-active:scale-[0.98]"
                  loading={index < 3 ? 'eager' : 'lazy'}
                />
                
                {/* Градиент снизу для читаемости */}
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Тонкая линия-разделитель */}
                <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </div>
              
              {/* Бейдж с номером фото */}
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-md text-white text-xs font-bold shadow-lg">
                {index + 1} / {images.length}
              </div>

              {/* Подсказка "нажмите для увеличения" на первом фото */}
              {index === 0 && showSwipeHint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium flex items-center gap-2 shadow-lg"
                >
                  <Hand className="w-4 h-4 animate-bounce" />
                  <span>Нажмите для полного экрана</span>
                </motion.div>
              )}
            </motion.div>
          ))}
          
          {/* Отступ для нижней панели */}
          <div className="h-80" />
        </div>
      </motion.div>

      {/* Нижняя Glass-панель */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="absolute bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-2xl border-t border-stone-200/50 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
      >
        {/* Ручка для свайпа */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
        </div>

        {/* Фильтры метража - без скроллбара, с fade-индикаторами */}
        <div className="relative px-2 pb-3">
          {/* Левый fade-индикатор */}
          <div className="absolute left-0 top-0 bottom-3 w-8 bg-gradient-to-r from-white/90 to-transparent z-10 pointer-events-none" />
          {/* Правый fade-индикатор */}
          <div className="absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-white/90 to-transparent z-10 pointer-events-none" />
          
          <div 
            ref={filterScrollRef}
            onScroll={handleFilterScroll}
            className="flex gap-2 overflow-x-auto px-4 py-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`.filter-scroll::-webkit-scrollbar { display: none; }`}</style>
            {filters.map((filter, index) => (
              <motion.button
                key={filter.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setActiveFilter(filter.id);
                  setCurrentHouseIndex(0);
                }}
                className={`flex-shrink-0 relative px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 active:scale-95'
                }`}
              >
                {filter.label}
                {activeFilter === filter.id && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Анимированная подсказка свайпа для фильтров */}
          <AnimatePresence>
            {showFilterHint && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-1 text-stone-400 pointer-events-none"
              >
                <motion.div
                  animate={{ x: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Навигация по проектам - редизайн в стиле карточек */}
        {filteredHouses.length > 1 && (
          <div className="px-4 pb-3">
            <div className="flex items-center justify-between bg-stone-50 rounded-2xl p-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={prevHouse}
                className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-stone-600 shadow-md border border-stone-200/50 active:bg-stone-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-2">
                  {filteredHouses.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentHouseIndex 
                          ? 'w-8 bg-gradient-to-r from-amber-500 to-amber-600' 
                          : 'w-2 bg-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-stone-500 font-medium mt-1.5">
                  Проект {currentHouseIndex + 1} из {filteredHouses.length}
                </p>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={nextHouse}
                className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-stone-600 shadow-md border border-stone-200/50 active:bg-stone-100"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        )}

        {/* Атрибуты - полный редизайн с иконками и подписями */}
        <div className="px-4 pb-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl py-4 px-2 border border-stone-200/50">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-2">
                <Maximize className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-xl font-bold text-stone-800">{currentHouse.area}</span>
              <span className="text-xs text-stone-500 font-medium">м²</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl py-4 px-2 border border-stone-200/50">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-2">
                <Bed className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xl font-bold text-stone-800">{currentHouse.bedrooms}</span>
              <span className="text-xs text-stone-500 font-medium">спальни</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl py-4 px-2 border border-stone-200/50">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-2">
                <Bath className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xl font-bold text-stone-800">{currentHouse.bathrooms}</span>
              <span className="text-xs text-stone-500 font-medium">санузла</span>
            </div>
          </div>
        </div>

        {/* Кнопка консультации */}
        <div className="px-4 pb-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowContactForm(true)}
            className="w-full py-4 bg-gradient-to-r from-stone-800 to-stone-900 text-white rounded-2xl font-bold text-base shadow-xl shadow-stone-900/20 flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            <span>Получить консультацию</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Fullscreen режим со свайп-жестами */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
          >
            {/* Изображение с drag-свайпом */}
            <motion.div
              className="relative w-full h-full flex items-center justify-center"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleFullscreenDragEnd}
            >
              <motion.img
                key={fullscreenImage}
                src={fullscreenImage}
                alt="Fullscreen"
                className="max-w-full max-h-full object-contain select-none"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                draggable={false}
              />
            </motion.div>

            {/* Кнопка закрытия */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 shadow-2xl"
            >
              <X className="w-7 h-7" />
            </motion.button>

            {/* Навигационные стрелки вверх-вниз */}
            {images.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={prevFullscreen}
                  className="absolute top-20 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 shadow-2xl"
                >
                  <ChevronUp className="w-8 h-8" />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={nextFullscreen}
                  className="absolute bottom-24 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 shadow-2xl"
                >
                  <ChevronDown className="w-8 h-8" />
                </motion.button>
              </>
            )}

            {/* Индикатор и подсказка свайпа */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
              <div className="px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-xl text-white text-sm font-bold border border-white/20">
                {fullscreenIndex + 1} / {images.length}
              </div>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="text-white/50 text-xs font-medium flex items-center gap-1"
              >
                <ChevronUp className="w-3 h-3" />
                <span>Свайпайте для навигации</span>
                <ChevronDown className="w-3 h-3" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Форма консультации */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            onClick={() => setShowContactForm(false)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-lg bg-white rounded-t-[2rem] p-6 shadow-2xl"
              style={{ paddingBottom: 'env(safe-area-inset-bottom, 24px)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center mb-5">
                <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
              </div>

              <h3 className="text-2xl font-bold text-stone-800 mb-5">
                Консультация по {currentHouse.name}
              </h3>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full px-5 py-4 bg-stone-100 border-2 border-transparent rounded-2xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors font-medium"
                />
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  className="w-full px-5 py-4 bg-stone-100 border-2 border-transparent rounded-2xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors font-medium"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-stone-100 rounded-2xl text-stone-700 font-semibold hover:bg-stone-200 transition-colors active:scale-[0.98]">
                  <Phone className="w-5 h-5" />
                  <span>Звонок</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-500 rounded-2xl text-white font-semibold hover:bg-green-600 transition-colors active:scale-[0.98]">
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </button>
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 py-4 bg-gradient-to-r from-stone-800 to-stone-900 text-white rounded-2xl font-bold shadow-xl shadow-stone-900/20"
              >
                Отправить заявку
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CatalogAppView;
