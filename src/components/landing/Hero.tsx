/**
 * =============================================================================
 * HERO SECTION - Главный экран
 * =============================================================================
 * 
 * Первый экран посетителя. Содержит:
 * - Заголовок и подзаголовок (левая половина)
 * - Прямоугольный слайдер с Ken Burns эффектом (правая половина)
 * - CTA кнопка "Обсудить проект"
 * - Статистика (50+ проектов, 60 дней монтаж, 5 лет гарантии)
 * 
 * =============================================================================
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, MotionConfig } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ContactModal } from "./ContactModal";
// Фотореалистичные изображения барнхаусов в Киргизии (все сезоны)
// Ken Burns v2 - минимальный зум (1.0-1.04) для максимальной чёткости
const KENBURNS_VERSION = 2; // Cache buster
const slides = [
  {
    // Лето - панорамные окна
    image: "/utp/barnhouse-panoramic-windows-tian-shan-summer.jpg",
    animation: {
      initial: { scale: 1.0, x: "0%", y: "0%" },
      animate: { scale: 1.04, x: "-1%", y: "-0.5%" },
    },
  },
  {
    // Зима - снежный пейзаж
    image: "/utp/barnhouse-winter-snow-kyrgyzstan.jpg",
    animation: {
      initial: { scale: 1.04, x: "0.5%", y: "0.5%" },
      animate: { scale: 1.0, x: "-0.5%", y: "-0.5%" },
    },
  },
  {
    // Лето - скандинавский стиль
    image: "/utp/scandinavian-barnhouse-kyrgyzstan-nature-panoramic.jpg",
    animation: {
      initial: { scale: 1.0, x: "-0.5%", y: "0.5%" },
      animate: { scale: 1.04, x: "0.5%", y: "-0.5%" },
    },
  },
  {
    // Осень - золотой пейзаж
    image: "/utp/barnhouse-autumn-golden-kyrgyzstan.jpg",
    animation: {
      initial: { scale: 1.03, x: "0.5%", y: "-0.5%" },
      animate: { scale: 1.0, x: "-0.5%", y: "0.3%" },
    },
  },
  {
    // Закат - драматичный
    image: "/utp/barnhouse-sunset-dramatic-kyrgyzstan.jpg",
    animation: {
      initial: { scale: 1.0, x: "0%", y: "0.5%" },
      animate: { scale: 1.03, x: "0%", y: "-0.5%" },
    },
  },
  {
    // Строительство
    image: "/utp/barnhouse-construction-kyrgyzstan-mountains-workers.jpg",
    animation: {
      initial: { scale: 1.03, x: "-0.5%", y: "0%" },
      animate: { scale: 1.0, x: "0.5%", y: "0.3%" },
    },
  },
  {
    // Премиум материалы
    image: "/utp/premium-timber-construction-materials-barnhouse.jpg",
    animation: {
      initial: { scale: 1.04, x: "0.3%", y: "0.3%" },
      animate: { scale: 1.01, x: "-0.3%", y: "-0.3%" },
    },
  },
];

const SLIDE_DURATION = 8000; // Увеличено для более плавного эффекта

export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <MotionConfig reducedMotion="never">
    <section id="hero" ref={sectionRef} className="relative min-h-screen flex overflow-hidden max-w-full snap-start">
      {/* Left Content Panel - Brown/Dark */}
      <motion.div 
        style={{ y: contentY }}
        className="relative z-20 w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-16 xl:px-24 py-20 pb-[320px] sm:pb-[380px] md:py-24 md:pb-24 lg:pb-24 bg-charcoal"
      >
        <div className="relative z-10 max-w-lg xl:max-w-xl">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 md:mb-8"
          >
            <span className="text-primary/80 text-xs sm:text-sm tracking-[0.25em] sm:tracking-[0.3em] uppercase font-medium">
              ERA Concept Home
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-rising font-medium text-white leading-[1.05] tracking-tight mb-3 md:mb-4"
          >
            Архитектура
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.33, 1, 0.68, 1] }}
            className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-rising font-medium leading-[1.05] tracking-tight mb-8 md:mb-10"
          >
            <span className="text-white">для </span>
            <span className="text-primary">жизни</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/60 text-lg sm:text-xl md:text-2xl leading-relaxed mb-10 md:mb-14 max-w-md"
          >
            Модульные дома премиум-класса с&nbsp;установкой за&nbsp;60&nbsp;дней. 
            Скандинавский дизайн, немецкое качество.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="group inline-flex items-center gap-4 sm:gap-5 text-white hover:text-primary transition-colors duration-500"
            >
              <span className="relative">
                <span className="block w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/20 group-hover:border-primary/50 transition-colors duration-500" />
                <ArrowRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-[-40%] transition-transform duration-500" />
              </span>
              <span className="text-sm sm:text-base tracking-[0.12em] sm:tracking-[0.15em] uppercase font-medium">
                Обсудить проект
              </span>
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex gap-8 sm:gap-10 md:gap-14 mt-12 md:mt-16 pt-8 border-t border-white/10"
          >
            {[
              { value: "50+", label: "проектов" },
              { value: "60", label: "дней монтаж" },
              { value: "5", label: "лет гарантии" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-rising font-medium text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel - Ken Burns Image Gallery (Desktop) */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <motion.div
          style={{ y: imageY }}
          className="absolute inset-0 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 overflow-hidden"
            >
              <motion.img
                key={`desk-${currentSlide}`}
                src={`${slides[currentSlide].image}?v=${KENBURNS_VERSION}`}
                alt="ERA Concept Home"
                initial={slides[currentSlide].animation.initial}
                animate={slides[currentSlide].animation.animate}
                transition={{
                  duration: SLIDE_DURATION / 1000,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="absolute inset-0 w-full h-full object-cover scale-[1.15] will-change-transform"
                decoding="async"
                loading="eager"
              />
              {/* Subtle vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-charcoal/30 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-charcoal/10 pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Progress bar at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: SLIDE_DURATION / 1000,
                ease: "linear",
              }}
              key={currentSlide}
            />
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? "bg-primary w-8" 
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mobile: Image Gallery below content - CSS animation for iOS Safari compatibility */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 h-[280px] sm:h-[340px] overflow-hidden z-10">
        <div className="absolute inset-0 overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={`mobile-slide-${index}`}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ 
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
              }}
            >
              <img
                src={`${slide.image}?v=${KENBURNS_VERSION}`}
                alt="ERA Concept Home"
                className={`absolute inset-0 w-full h-full object-cover ${
                  index === currentSlide ? 'animate-kenburns-mobile' : ''
                }`}
                style={{
                  WebkitTransform: 'translateZ(0)',
                  transform: 'translateZ(0)',
                }}
                decoding="async"
                loading={index === 0 ? "eager" : "lazy"}
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: SLIDE_DURATION / 1000,
              ease: "linear",
            }}
            key={currentSlide}
          />
        </div>

        {/* Mobile dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentSlide ? "bg-primary w-6" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      <ContactModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
    </MotionConfig>
  );
}
