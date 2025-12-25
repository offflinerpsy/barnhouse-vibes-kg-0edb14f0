import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// Import modular house images
import modularHouse1 from "@/assets/modular-house-1.jpg";
import modularHouse2 from "@/assets/modular-house-2.webp";
import modularHouse3 from "@/assets/modular-house-3.jpg";
import modularHouse4 from "@/assets/modular-house-4.jpg";
import modularHouse5 from "@/assets/modular-house-5.jpg";

const advantages = [
  {
    number: "01",
    title: "Сборка на вашем участке",
    description: "Производим и собираем модульный дом прямо на вашей территории. Без транспортировки готовых модулей — качественный монтаж под контролем наших специалистов.",
    highlight: "На вашей земле",
  },
  {
    number: "02",
    title: "Свой архитектор",
    description: "Бесплатная консультация архитектора. Доработаем типовой проект под ваши нужды — добавим веранду, баню или спроектируем дом с нуля по вашему желанию.",
    highlight: "Консультация бесплатно",
  },
  {
    number: "03",
    title: "Гибкая комплектация",
    description: "Все материалы — свои, проверенные. Но по желанию меняем цвет окон, размеры, производителя фурнитуры. Ваш дом — ваши правила.",
    highlight: "Под ваши желания",
  },
  {
    number: "04",
    title: "Гарантия 3 года",
    description: "Официальная гарантия на все работы и материалы. Работаем по договору с полной юридической защитой. Несём ответственность за качество.",
    highlight: "Договор и гарантия",
  },
];

const houseImages = [
  { src: modularHouse1, label: "Модульный дом с террасой" },
  { src: modularHouse2, label: "Одноэтажный модуль" },
  { src: modularHouse3, label: "Компактный модуль" },
  { src: modularHouse4, label: "Двухэтажный модуль" },
  { src: modularHouse5, label: "Модуль с разрезом" },
];

const AnimatedNumber = ({ number, isInView }: { number: string; isInView: boolean }) => {
  const [displayNumber, setDisplayNumber] = useState("00");
  
  useEffect(() => {
    if (isInView) {
      const target = parseInt(number);
      let current = 0;
      const duration = 1000;
      const steps = 20;
      const increment = target / steps;
      const stepDuration = duration / steps;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setDisplayNumber(number);
          clearInterval(timer);
        } else {
          setDisplayNumber(Math.floor(current).toString().padStart(2, '0'));
        }
      }, stepDuration);
      
      return () => clearInterval(timer);
    }
  }, [isInView, number]);
  
  return <span>{displayNumber}</span>;
};

// Blueprint grid background
const BlueprintGrid = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Base paper texture */}
    <div className="absolute inset-0 bg-[#1a2332]" />
    
    {/* Grid pattern - small squares */}
    <svg className="absolute inset-0 w-full h-full opacity-20">
      <defs>
        <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(200 60% 50%)" strokeWidth="0.5" />
        </pattern>
        <pattern id="largeGrid" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#smallGrid)" />
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="hsl(200 60% 50%)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#largeGrid)" />
    </svg>

    {/* Corner rulers */}
    {/* Top ruler */}
    <div className="absolute top-0 left-16 right-0 h-8 bg-[#2a3a4a]/80 border-b border-[hsl(200_60%_50%/0.3)] flex items-end">
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center" style={{ width: '50px' }}>
          <div className="h-3 w-px bg-[hsl(200_60%_50%/0.5)]" />
          {i % 2 === 0 && (
            <span className="text-[8px] text-[hsl(200_60%_50%/0.6)] mt-0.5">{i * 50}</span>
          )}
        </div>
      ))}
    </div>
    
    {/* Left ruler */}
    <div className="absolute top-8 left-0 w-16 bottom-0 bg-[#2a3a4a]/80 border-r border-[hsl(200_60%_50%/0.3)] flex flex-col">
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="flex items-center" style={{ height: '50px' }}>
          <div className="w-3 h-px bg-[hsl(200_60%_50%/0.5)] ml-auto" />
          {i % 2 === 0 && (
            <span className="text-[8px] text-[hsl(200_60%_50%/0.6)] ml-1 w-8">{i * 50}</span>
          )}
        </div>
      ))}
    </div>

    {/* Corner piece */}
    <div className="absolute top-0 left-0 w-16 h-8 bg-[#2a3a4a] border-r border-b border-[hsl(200_60%_50%/0.3)] flex items-center justify-center">
      <span className="text-[10px] text-[hsl(200_60%_50%/0.8)] font-mono">mm</span>
    </div>

    {/* Decorative elements - compass rose hint */}
    <div className="absolute bottom-6 left-20 w-16 h-16 opacity-20">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(32 42% 59%)" strokeWidth="1" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="hsl(32 42% 59%)" strokeWidth="0.5" />
        <line x1="50" y1="5" x2="50" y2="95" stroke="hsl(32 42% 59%)" strokeWidth="0.5" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="hsl(32 42% 59%)" strokeWidth="0.5" />
        <text x="50" y="15" textAnchor="middle" fill="hsl(32 42% 59%)" fontSize="8">N</text>
      </svg>
    </div>

    {/* Stamp/seal in corner */}
    <div className="absolute bottom-6 right-6 w-24 h-24 opacity-30">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(32 42% 59%)" strokeWidth="2" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="hsl(32 42% 59%)" strokeWidth="0.5" />
        <text x="50" y="45" textAnchor="middle" fill="hsl(32 42% 59%)" fontSize="10" fontWeight="bold">ERA</text>
        <text x="50" y="58" textAnchor="middle" fill="hsl(32 42% 59%)" fontSize="6">CONCEPT</text>
      </svg>
    </div>
  </div>
);

// Image carousel component
const HouseImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % houseImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Paper/canvas effect */}
      <div className="absolute -inset-4 bg-[#f5f0e8] rounded-lg shadow-2xl transform rotate-1" />
      <div className="absolute -inset-4 bg-[#faf8f4] rounded-lg shadow-xl transform -rotate-0.5" />
      
      {/* Main drawing area */}
      <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
        {/* Tape effect corners */}
        <div className="absolute -top-2 -left-2 w-12 h-6 bg-[#f0e6c8]/80 transform -rotate-45 z-10" />
        <div className="absolute -top-2 -right-2 w-12 h-6 bg-[#f0e6c8]/80 transform rotate-45 z-10" />
        
        <div className="aspect-[4/3] relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={houseImages[currentIndex].src}
              alt={houseImages[currentIndex].label}
              className="w-full h-full object-contain bg-white"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
            />
          </AnimatePresence>
          
          {/* Pencil sketch overlay effect */}
          <div className="absolute inset-0 mix-blend-multiply pointer-events-none bg-gradient-to-br from-transparent via-transparent to-[#d4c5a9]/10" />
        </div>

        {/* Label */}
        <motion.div 
          className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded border border-warm-gray/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-charcoal font-medium text-center">
            {houseImages[currentIndex].label}
          </p>
        </motion.div>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-4">
        {houseImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-primary w-6' 
                : 'bg-[hsl(200_60%_50%/0.4)] hover:bg-primary/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export function Advantages() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });

  return (
    <section id="advantages" className="py-24 md:py-32 relative overflow-hidden">
      {/* Blueprint/drafting table background */}
      <BlueprintGrid />

      {/* Content container - positioned above the grid */}
      <div className="container mx-auto px-4 pl-20 pt-12 relative z-10" ref={containerRef}>
        {/* Header - styled as technical drawing title block */}
        <motion.div
          className="mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block border-2 border-[hsl(200_60%_50%/0.4)] p-4 bg-[#1a2332]/80 backdrop-blur-sm">
            <motion.span 
              className="block text-[hsl(200_60%_50%)] font-mono text-xs uppercase tracking-[0.3em] mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Проект: ERA Concept / Лист 01
            </motion.span>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-warm-white">
              Что делает нас{" "}
              <span className="text-primary">особенными</span>
            </h2>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* House Images - Left side */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="sticky top-24">
              <HouseImageCarousel />
              
              {/* Technical note */}
              <motion.div 
                className="mt-6 p-3 border border-[hsl(200_60%_50%/0.3)] bg-[#1a2332]/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-[hsl(200_60%_50%/0.8)] text-xs font-mono leading-relaxed">
                  <span className="text-primary">ПРИМЕЧАНИЕ:</span> Модульные дома ERA Concept проектируются индивидуально под каждый участок. Представленные чертежи — примеры возможных конфигураций.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Advantages Grid - Right side */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {advantages.map((item, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  className="relative bg-[#1a2332]/80 backdrop-blur-sm rounded-none p-5 md:p-6 border border-[hsl(200_60%_50%/0.3)] overflow-hidden h-full"
                  whileHover={{ 
                    borderColor: "hsl(32 42% 59% / 0.5)",
                    y: -4,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Number with animation */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <motion.div
                        className="text-4xl md:text-5xl font-bold text-[hsl(200_60%_50%/0.3)] font-mono"
                        animate={isInView ? {
                          opacity: [0.2, 0.4, 0.2],
                        } : {}}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.3,
                        }}
                      >
                        <AnimatedNumber number={item.number} isInView={isInView} />
                      </motion.div>
                    </div>
                    
                    {/* Highlight badge */}
                    <motion.span
                      className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-1 border border-primary/30"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    >
                      {item.highlight}
                    </motion.span>
                  </div>

                  {/* Content */}
                  <motion.h3
                    className="font-display text-lg md:text-xl font-semibold text-warm-white mb-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  >
                    {item.title}
                  </motion.h3>
                  
                  <motion.p
                    className="text-[hsl(200_60%_50%/0.7)] leading-relaxed text-xs md:text-sm"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    {item.description}
                  </motion.p>

                  {/* Corner technical mark */}
                  <div className="absolute bottom-2 right-2 text-[8px] font-mono text-[hsl(200_60%_50%/0.4)]">
                    [{item.number}]
                  </div>

                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(135deg, hsl(32 42% 59% / 0.05) 0%, transparent 50%, hsl(32 42% 59% / 0.08) 100%)",
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom technical note */}
        <motion.div
          className="mt-12 flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="h-px flex-1 max-w-20 bg-[hsl(200_60%_50%/0.3)]" />
          <span className="text-[hsl(200_60%_50%/0.6)] text-xs font-mono">ERA CONCEPT © 2024</span>
          <div className="h-px flex-1 max-w-20 bg-[hsl(200_60%_50%/0.3)]" />
        </motion.div>
      </div>
    </section>
  );
}
