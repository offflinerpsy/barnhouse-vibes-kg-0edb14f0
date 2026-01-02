import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bed, Bath, Maximize, Home, Grid3X3, Phone, MessageCircle, ChevronLeft, ChevronRight, Camera, Layers } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'photos' | 'plans'>('photos');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

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
    
    // Комбинируем основную галерею и дополнительные фото
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
      className="fixed inset-0 z-50 bg-gradient-to-b from-slate-100 via-slate-50 to-white flex flex-col overflow-hidden"
    >
      {/* Шапка с названием и кнопкой закрытия */}
      <div className="relative z-30 flex items-center justify-between px-4 py-3 bg-white/70 backdrop-blur-xl border-b border-white/50">
        {onClose && (
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/5 backdrop-blur-md flex items-center justify-center text-charcoal/70 hover:bg-black/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        <div className="flex-1 text-center">
          <h1 className="text-lg font-bold text-charcoal">{currentHouse.name}</h1>
          <p className="text-sm text-charcoal/60">{currentHouse.price}</p>
        </div>

        {/* Переключатель Фото/Планировка */}
        <div className="flex bg-black/5 backdrop-blur-md rounded-full p-1">
          <button
            onClick={() => setViewMode('photos')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              viewMode === 'photos'
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-charcoal/60 hover:text-charcoal'
            }`}
          >
            <Camera className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('plans')}
            disabled={currentHouse.floorPlanCount === 0}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              viewMode === 'plans'
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-charcoal/60 hover:text-charcoal'
            } ${currentHouse.floorPlanCount === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <Layers className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Вертикальная лента фотографий */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="flex flex-col">
          {images.map((src, index) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="relative w-full cursor-pointer active:scale-[0.99] transition-transform"
              onClick={() => openFullscreen(src, index)}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <img
                  src={src}
                  alt={`${currentHouse.name} - ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading={index < 3 ? 'eager' : 'lazy'}
                />
                {/* Тонкая линия-разделитель */}
                <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
              
              {/* Номер фото в углу */}
              <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-medium">
                {index + 1} / {images.length}
              </div>
            </motion.div>
          ))}
          
          {/* Отступ для нижней панели */}
          <div className="h-72" />
        </div>
      </div>

      {/* Нижняя Glass-панель - зафиксирована */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="absolute bottom-0 left-0 right-0 z-30 bg-white/60 backdrop-blur-2xl border-t border-white/50 rounded-t-3xl shadow-2xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}
      >
        {/* Ручка для свайпа */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-charcoal/15 rounded-full" />
        </div>

        {/* Фильтры - горизонтальный скролл */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setActiveFilter(filter.id);
                  setCurrentHouseIndex(0);
                }}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter.id
                    ? 'bg-charcoal text-white shadow-lg'
                    : 'bg-white/70 text-charcoal/70 hover:bg-white border border-black/5'
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
              className="w-11 h-11 rounded-full bg-white/80 border border-black/5 flex items-center justify-center text-charcoal/70 hover:bg-white transition-colors shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-charcoal/50 font-medium">
              Проект {currentHouseIndex + 1} из {filteredHouses.length}
            </span>
            <button
              onClick={nextHouse}
              className="w-11 h-11 rounded-full bg-white/80 border border-black/5 flex items-center justify-center text-charcoal/70 hover:bg-white transition-colors shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Атрибуты */}
        <div className="px-4 pb-3">
          <div className="flex justify-around bg-white/50 backdrop-blur-sm rounded-2xl py-3 border border-black/5">
            <div className="flex flex-col items-center gap-0.5">
              <Maximize className="w-5 h-5 text-charcoal/40" />
              <span className="text-base font-bold text-charcoal">{currentHouse.area} м²</span>
            </div>
            <div className="w-px bg-black/10" />
            <div className="flex flex-col items-center gap-0.5">
              <Bed className="w-5 h-5 text-charcoal/40" />
              <span className="text-base font-bold text-charcoal">{currentHouse.bedrooms} спальни</span>
            </div>
            <div className="w-px bg-black/10" />
            <div className="flex flex-col items-center gap-0.5">
              <Bath className="w-5 h-5 text-charcoal/40" />
              <span className="text-base font-bold text-charcoal">{currentHouse.bathrooms} санузла</span>
            </div>
          </div>
        </div>

        {/* Кнопка консультации */}
        <div className="px-4 pb-2">
          <button
            onClick={() => setShowContactForm(true)}
            className="w-full py-4 bg-charcoal text-white rounded-2xl font-semibold text-base shadow-xl hover:bg-charcoal/90 transition-colors active:scale-[0.98]"
          >
            Получить консультацию
          </button>
        </div>
      </motion.div>

      {/* Fullscreen режим */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => setFullscreenImage(null)}
          >
            {/* Изображение */}
            <motion.img
              key={fullscreenImage}
              src={fullscreenImage}
              alt="Fullscreen"
              className="max-w-full max-h-full object-contain"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Кнопка закрытия */}
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Навигационные стрелки */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevFullscreen(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextFullscreen(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Индикатор */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium">
              {fullscreenIndex + 1} / {images.length}
            </div>
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
            {/* Затемнение */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            
            {/* Форма */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-t-3xl p-6 shadow-2xl"
              style={{ paddingBottom: 'env(safe-area-inset-bottom, 24px)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Ручка */}
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 bg-charcoal/15 rounded-full" />
              </div>

              <h3 className="text-xl font-bold text-charcoal mb-4">
                Консультация по {currentHouse.name}
              </h3>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full px-4 py-3.5 bg-black/5 border border-black/5 rounded-xl text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                />
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  className="w-full px-4 py-3.5 bg-black/5 border border-black/5 rounded-xl text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                />
              </div>

              {/* Способ связи */}
              <div className="flex gap-3 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-black/5 rounded-xl text-charcoal/70 hover:bg-black/10 transition-colors">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm font-medium">Звонок</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-green-500/15 rounded-xl text-green-700 hover:bg-green-500/25 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </button>
              </div>

              <button className="w-full mt-4 py-4 bg-charcoal text-white rounded-xl font-semibold shadow-xl hover:bg-charcoal/90 transition-colors">
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
