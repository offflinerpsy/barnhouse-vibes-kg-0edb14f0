import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ContactModal } from "./ContactModal";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    title: "Villa Modern",
    location: "Подмосковье",
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    title: "Barnhouse Loft",
    location: "Калужская область",
  },
  {
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop",
    title: "Scandinavian House",
    location: "Тверская область",
  },
];

export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 6000;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + (100 / (SLIDE_DURATION / 50));
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [nextSlide]);

  return (
    <section className="relative h-screen flex overflow-hidden bg-charcoal">
      {/* Left Content Panel */}
      <div className="relative z-20 w-full lg:w-[45%] flex flex-col justify-center px-8 md:px-16 lg:px-20 py-24">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(90deg, hsl(var(--primary)) 0px, hsl(var(--primary)) 1px, transparent 1px, transparent 80px)`,
          }} />
        </div>

        <div className="relative z-10 max-w-xl">
          {/* Elegant tagline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <span className="text-primary/80 text-sm tracking-[0.3em] uppercase font-medium">
              ERA Concept Home
            </span>
          </motion.div>

          {/* Main headline with line reveal */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-rising font-medium text-white leading-[1.1] tracking-tight"
            >
              Архитектура
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.33, 1, 0.68, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-rising font-medium leading-[1.1] tracking-tight"
            >
              <span className="text-white">для </span>
              <span className="text-primary">жизни</span>
            </motion.h1>
          </div>

          {/* Subtitle with fade */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/50 text-lg md:text-xl leading-relaxed mb-12 max-w-md"
          >
            Модульные дома премиум-класса с установкой за 14 дней. 
            Скандинавский дизайн, немецкое качество.
          </motion.p>

          {/* Minimal CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="group inline-flex items-center gap-4 text-white hover:text-primary transition-colors duration-500"
            >
              <span className="relative">
                <span className="block w-14 h-14 rounded-full border border-white/20 group-hover:border-primary/50 transition-colors duration-500" />
                <ArrowRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 group-hover:translate-x-[-40%] transition-transform duration-500" />
              </span>
              <span className="text-sm tracking-[0.15em] uppercase font-medium">
                Обсудить проект
              </span>
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex gap-12 mt-16 pt-8 border-t border-white/10"
          >
            {[
              { value: "150+", label: "проектов" },
              { value: "14", label: "дней монтаж" },
              { value: "10", label: "лет гарантии" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-rising font-medium text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-white/40 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Image Panel - Slider */}
      <div className="hidden lg:block absolute right-0 top-0 w-[60%] h-full">
        {/* Diagonal overlay for premium feel */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(105deg, hsl(var(--charcoal)) 0%, transparent 20%)`,
          }}
        />

        {/* Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${slides[currentSlide].image}')` }}
            />
            <div className="absolute inset-0 bg-charcoal/20" />
          </motion.div>
        </AnimatePresence>

        {/* Slide info */}
        <div className="absolute bottom-12 left-12 z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-white/60 text-sm tracking-wider uppercase mb-2">
                {slides[currentSlide].location}
              </div>
              <div className="text-white text-2xl font-rising font-medium">
                {slides[currentSlide].title}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="absolute bottom-12 right-12 z-20 flex items-center gap-6">
          {/* Progress indicators */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setProgress(0);
                }}
                className="relative h-0.5 w-12 bg-white/20 overflow-hidden rounded-full"
              >
                {index === currentSlide && (
                  <motion.div
                    className="absolute inset-0 bg-primary origin-left"
                    style={{ scaleX: progress / 100 }}
                  />
                )}
                {index < currentSlide && (
                  <div className="absolute inset-0 bg-white/50" />
                )}
              </button>
            ))}
          </div>

          {/* Arrow buttons */}
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide counter */}
        <div className="absolute top-12 right-12 z-20">
          <span className="text-white font-rising text-lg">
            {String(currentSlide + 1).padStart(2, '0')}
          </span>
          <span className="text-white/30 mx-2">/</span>
          <span className="text-white/30 font-rising text-lg">
            {String(slides.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Mobile background */}
      <div className="lg:hidden absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${slides[currentSlide].image}')` }}
        />
        <div className="absolute inset-0 bg-charcoal/80" />
      </div>

      <ContactModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
}
