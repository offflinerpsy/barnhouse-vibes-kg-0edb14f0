/**
 * =============================================================================
 * HERO SECTION - Главный экран
 * =============================================================================
 * 
 * Первый экран посетителя. Содержит:
 * - Заголовок и подзаголовок
 * - CTA кнопка "Обсудить проект"
 * - Статистика (150+ проектов, 14 дней монтаж, 10 лет гарантии)
 * - Круглый слайдер с Ken Burns эффектом (desktop)
 * - Мини-слайдер (mobile)
 * 
 * Параллакс эффекты при скролле
 * =============================================================================
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ContactModal } from "./ContactModal";

// Слайды для Ken Burns карусели
const slides = [
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    title: "Villa Modern",
    location: "Подмосковье",
    // Ken Burns: zoom in + move left
    animation: {
      initial: { scale: 1, x: 0, y: 0 },
      animate: { scale: 1.15, x: -30, y: -10 },
    },
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    title: "Barnhouse Loft",
    location: "Калужская область",
    // Ken Burns: zoom out + move right-up
    animation: {
      initial: { scale: 1.2, x: 20, y: 20 },
      animate: { scale: 1, x: -20, y: -20 },
    },
  },
  {
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop",
    title: "Scandinavian House",
    location: "Тверская область",
    // Ken Burns: zoom in + move down
    animation: {
      initial: { scale: 1, x: 10, y: -20 },
      animate: { scale: 1.2, x: -10, y: 20 },
    },
  },
];

const SLIDE_DURATION = 7000; // Longer for Ken Burns effect

export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const circleY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const circleScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section id="hero" ref={sectionRef} className="relative min-h-screen flex overflow-hidden bg-charcoal">
      {/* Left Content Panel */}
      <motion.div 
        style={{ y: contentY }}
        className="relative z-20 w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-16 xl:px-24 py-20 pb-[420px] sm:pb-[450px] md:py-24 md:pb-24 lg:pb-24"
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

      {/* Right Panel - Circular Ken Burns Viewer */}
      <div className="hidden lg:flex w-1/2 bg-charcoal items-center justify-center relative">
        {/* Centered circular mask container with parallax */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.33, 1, 0.68, 1] }}
          style={{ y: circleY, scale: circleScale }}
          className="relative flex flex-col items-center"
        >
          {/* Outer glow ring */}
          <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-primary/10 blur-2xl" />
          
          {/* Main circular viewer - centered */}
          <div className="relative w-[480px] h-[480px] xl:w-[560px] xl:h-[560px] 2xl:w-[640px] 2xl:h-[640px] rounded-full overflow-hidden border border-white/10 shadow-2xl">
            {/* Ken Burns slides */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
                className="absolute inset-0"
              >
                <motion.div
                  initial={slides[currentSlide].animation.initial}
                  animate={slides[currentSlide].animation.animate}
                  transition={{
                    duration: SLIDE_DURATION / 1000,
                    ease: "linear",
                  }}
                  className="absolute inset-0"
                >
                  <div
                    className="absolute inset-[-20%] bg-cover bg-center"
                    style={{ backgroundImage: `url('${slides[currentSlide].image}')` }}
                  />
                </motion.div>
                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-charcoal/20 pointer-events-none" />
              </motion.div>
            </AnimatePresence>

            {/* Progress ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
              <circle
                cx="50%"
                cy="50%"
                r="49%"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="49%"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 49}%`}
                initial={{ strokeDashoffset: `${2 * Math.PI * 49}%` }}
                animate={{ strokeDashoffset: "0%" }}
                transition={{
                  duration: SLIDE_DURATION / 1000,
                  ease: "linear",
                  repeat: Infinity,
                }}
                key={currentSlide}
              />
            </svg>
          </div>

          {/* Slide info below circle */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-white/40 text-xs tracking-[0.2em] uppercase mb-1">
                  {slides[currentSlide].location}
                </div>
                <div className="text-white text-lg font-rising font-medium">
                  {slides[currentSlide].title}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide indicators */}
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? "bg-primary w-6" 
                    : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mobile: Show circular viewer below content */}
      <div className="lg:hidden absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        {/* Outer glow for mobile */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-primary/15 via-transparent to-primary/10 blur-xl" />
        
        <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden border border-white/10 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <motion.div
                initial={slides[currentSlide].animation.initial}
                animate={slides[currentSlide].animation.animate}
                transition={{
                  duration: SLIDE_DURATION / 1000,
                  ease: "linear",
                }}
                className="absolute inset-0"
              >
                <div
                  className="absolute inset-[-20%] bg-cover bg-center"
                  style={{ backgroundImage: `url('${slides[currentSlide].image}')` }}
                />
              </motion.div>
              {/* Subtle vignette for mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-charcoal/10 pointer-events-none" />
            </motion.div>
          </AnimatePresence>
          
          {/* Progress ring for mobile */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
            <circle
              cx="50%"
              cy="50%"
              r="49%"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="49%"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 49}%`}
              initial={{ strokeDashoffset: `${2 * Math.PI * 49}%` }}
              animate={{ strokeDashoffset: "0%" }}
              transition={{
                duration: SLIDE_DURATION / 1000,
                ease: "linear",
                repeat: Infinity,
              }}
              key={currentSlide}
            />
          </svg>
        </div>
        
        {/* Mobile slide info */}
        <div className="text-center mt-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-white/40 text-[10px] tracking-[0.15em] uppercase">
                {slides[currentSlide].location}
              </div>
              <div className="text-white text-sm font-rising font-medium">
                {slides[currentSlide].title}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Mobile dots */}
        <div className="flex justify-center gap-2 mt-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentSlide ? "bg-primary w-5" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Mobile background */}
      <div className="lg:hidden absolute inset-0 z-0 bg-charcoal" />

      <ContactModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
}
