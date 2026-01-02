import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform, animate } from 'framer-motion';
import { X, Bed, Bath, Maximize, Phone, MessageCircle, ChevronLeft, ChevronRight, Camera, Layers, ChevronUp, ChevronDown, Home } from 'lucide-react';

// Данные домов
const houses = [
  {
    id: 'model-1-36',
    name: 'Барнхаус 36',
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
    name: 'Барнхаус 54',
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
    name: 'Барнхаус 81',
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
    name: 'Барнхаус 108',
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
    name: 'Барнхаус 135',
    area: 135,
    bedrooms: 5,
    bathrooms: 3,
    price: 'от 8.0 млн ₸',
    galleryCount: 5,
    extraGalleryCount: 38,
    floorPlanCount: 3,
  },
];

interface CatalogAppViewProps {
  onClose?: () => void;
}

const CatalogAppView: React.FC<CatalogAppViewProps> = ({ onClose }) => {
  const [currentHouseIndex, setCurrentHouseIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'photos' | 'plans'>('photos');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const photoFeedRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);

  const currentHouse = houses[currentHouseIndex];

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
  }, [currentHouseIndex, viewMode]);

  // Навигация по домам
  const nextHouse = useCallback(() => {
    setCurrentHouseIndex((prev) => (prev + 1) % houses.length);
  }, []);

  const prevHouse = useCallback(() => {
    setCurrentHouseIndex((prev) => (prev - 1 + houses.length) % houses.length);
  }, []);

  // Горизонтальный свайп для смены проекта
  const handleMainDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 80;
    
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x < 0) {
        nextHouse();
      } else {
        prevHouse();
      }
    }
    
    // Анимируем возврат
    animate(dragX, 0, { type: 'spring', stiffness: 400, damping: 30 });
  };

  // Открытие fullscreen
  const openFullscreen = (src: string, index: number) => {
    if (!isDragging) {
      setFullscreenImage(src);
      setFullscreenIndex(index);
    }
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

  // Обработка свайпа в fullscreen (вертикаль + горизонталь)
  const handleFullscreenDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    
    // Вертикальный свайп - смена фото
    if (Math.abs(info.offset.y) > Math.abs(info.offset.x) && Math.abs(info.offset.y) > threshold) {
      if (info.offset.y < 0) {
        nextFullscreen();
      } else {
        prevFullscreen();
      }
    }
    // Горизонтальный свайп - смена проекта  
    else if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x < 0) {
        nextHouse();
        setFullscreenImage(null);
      } else {
        prevHouse();
        setFullscreenImage(null);
      }
    }
  };

  if (!currentHouse) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <p className="text-foreground/60">Нет доступных проектов</p>
      </div>
    );
  }

  // Превью соседних проектов для карусели
  const prevHouseData = houses[(currentHouseIndex - 1 + houses.length) % houses.length];
  const nextHouseData = houses[(currentHouseIndex + 1) % houses.length];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-stone-950 flex flex-col overflow-hidden"
    >
      {/* Фоновый градиент */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-stone-950 to-black" />
      
      {/* Вертикальная лента фотографий с горизонтальным свайпом для смены проекта */}
      <motion.div 
        ref={photoFeedRef}
        className="relative flex-1 overflow-y-auto overflow-x-hidden z-10"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none', 
          WebkitOverflowScrolling: 'touch',
          x: dragX 
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleMainDragEnd}
      >
        <style>{`.photo-feed::-webkit-scrollbar { display: none; }`}</style>
        
        <div className="flex flex-col photo-feed">
          {images.map((src, index) => (
            <motion.div
              key={src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.02, duration: 0.3 }}
              className="relative w-full cursor-pointer"
              onClick={() => openFullscreen(src, index)}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <img
                  src={src}
                  alt={`${currentHouse.name}`}
                  className="w-full h-full object-cover"
                  loading={index < 3 ? 'eager' : 'lazy'}
                  draggable={false}
                />
                
                {/* Тонкая линия-разделитель */}
                <div className="absolute bottom-0 inset-x-0 h-px bg-white/10" />
              </div>
            </motion.div>
          ))}
          
          {/* Отступ для нижней панели */}
          <div className="h-[420px]" />
        </div>
      </motion.div>

      {/* Индикаторы соседних проектов по бокам */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-20 pointer-events-none flex justify-between px-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.6, x: 0 }}
          className="bg-black/60 backdrop-blur-xl rounded-r-2xl py-3 px-2 border-r border-y border-white/10"
        >
          <div className="text-white/80 text-xs font-bold writing-vertical rotate-180" style={{ writingMode: 'vertical-rl' }}>
            {prevHouseData.area} м²
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.6, x: 0 }}
          className="bg-black/60 backdrop-blur-xl rounded-l-2xl py-3 px-2 border-l border-y border-white/10"
        >
          <div className="text-white/80 text-xs font-bold" style={{ writingMode: 'vertical-rl' }}>
            {nextHouseData.area} м²
          </div>
        </motion.div>
      </div>

      {/* Нижняя панель - полный редизайн */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="absolute bottom-0 left-0 right-0 z-30"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Glassmorphism фон */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-black/70 backdrop-blur-2xl" />
        
        <div className="relative z-10 pt-4 pb-4 px-4">
          
          {/* Книжная 3D-карусель моделей */}
          <div className="relative mb-5 h-24 overflow-hidden">
            {/* Центральная карточка (активный проект) */}
            <motion.div
              key={currentHouse.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute left-1/2 -translate-x-1/2 w-[70%] max-w-[280px]"
            >
              <div className="bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent backdrop-blur-xl rounded-3xl p-4 border border-amber-500/30 shadow-2xl shadow-amber-500/20">
                {/* Название и цена */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">{currentHouse.name}</h2>
                    <p className="text-amber-400 font-bold text-sm">{currentHouse.price}</p>
                  </div>
                  <div className="bg-amber-500 text-black text-xs font-black px-3 py-1.5 rounded-full">
                    {currentHouse.area} м²
                  </div>
                </div>
                
                {/* Атрибуты в одну строку */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-amber-400" />
                    <span className="text-white font-semibold text-sm">{currentHouse.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4 text-amber-400" />
                    <span className="text-white font-semibold text-sm">{currentHouse.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span className="text-white font-semibold text-sm">{currentHouse.galleryCount + currentHouse.extraGalleryCount}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Левая карточка (предыдущий проект) */}
            <motion.button
              onClick={prevHouse}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[25%] opacity-50 hover:opacity-70 transition-opacity"
              style={{ perspective: '1000px' }}
            >
              <div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 transform origin-right"
                style={{ transform: 'rotateY(30deg)' }}
              >
                <p className="text-white/70 font-bold text-xs truncate">{prevHouseData.name}</p>
                <p className="text-white/40 text-xs">{prevHouseData.area} м²</p>
              </div>
            </motion.button>

            {/* Правая карточка (следующий проект) */}
            <motion.button
              onClick={nextHouse}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-[25%] opacity-50 hover:opacity-70 transition-opacity"
              style={{ perspective: '1000px' }}
            >
              <div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 transform origin-left"
                style={{ transform: 'rotateY(-30deg)' }}
              >
                <p className="text-white/70 font-bold text-xs truncate">{nextHouseData.name}</p>
                <p className="text-white/40 text-xs">{nextHouseData.area} м²</p>
              </div>
            </motion.button>
          </div>

          {/* Индикатор текущего проекта - точки */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {houses.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentHouseIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentHouseIndex 
                    ? 'w-6 h-2 bg-amber-500' 
                    : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Переключатель Фото/План */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <button
              onClick={() => setViewMode('photos')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                viewMode === 'photos'
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <Camera className="w-4 h-4" />
              Фото
            </button>
            <button
              onClick={() => setViewMode('plans')}
              disabled={currentHouse.floorPlanCount === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                viewMode === 'plans'
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              } ${currentHouse.floorPlanCount === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <Layers className="w-4 h-4" />
              Планировка
            </button>
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowContactForm(true)}
              className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-2xl font-bold text-base shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Консультация
            </motion.button>
            
            {onClose && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border border-white/20"
              >
                <X className="w-6 h-6" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Fullscreen режим со свайп-жестами (вертикаль + горизонталь) */}
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
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.15}
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

            {/* Верхняя панель fullscreen */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4"
            >
              <div className="bg-black/60 backdrop-blur-xl rounded-2xl px-4 py-2 border border-white/10">
                <p className="text-white font-bold text-sm">{currentHouse.name}</p>
              </div>
              
              <button
                onClick={() => setFullscreenImage(null)}
                className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xl flex items-center justify-center text-white border border-white/20"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>

            {/* Нижний индикатор и подсказки */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-3"
            >
              {/* Номер фото */}
              <div className="px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-xl text-white text-sm font-bold border border-white/20">
                {fullscreenIndex + 1} / {images.length}
              </div>
              
              {/* Подсказки по свайпу */}
              <div className="flex items-center gap-6 text-white/40 text-xs">
                <div className="flex items-center gap-1">
                  <ChevronUp className="w-4 h-4" />
                  <ChevronDown className="w-4 h-4" />
                  <span>фото</span>
                </div>
                <div className="flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" />
                  <ChevronRight className="w-4 h-4" />
                  <span>проект</span>
                </div>
              </div>
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
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-lg bg-stone-900 rounded-t-[2rem] p-6 border-t border-white/10"
              style={{ paddingBottom: 'env(safe-area-inset-bottom, 24px)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center mb-5">
                <div className="w-12 h-1.5 bg-white/20 rounded-full" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                Консультация
              </h3>
              <p className="text-white/60 mb-5 text-sm">
                {currentHouse.name} • {currentHouse.area} м² • {currentHouse.price}
              </p>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full px-5 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-amber-500/50 transition-colors font-medium"
                />
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  className="w-full px-5 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-amber-500/50 transition-colors font-medium"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/10 rounded-2xl text-white font-semibold hover:bg-white/20 transition-colors active:scale-[0.98] border border-white/10">
                  <Phone className="w-5 h-5" />
                  <span>Звонок</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-600 rounded-2xl text-white font-semibold hover:bg-green-700 transition-colors active:scale-[0.98]">
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </button>
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-2xl font-bold shadow-xl shadow-amber-500/20"
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
