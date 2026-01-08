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

// Blueprint grid background - warm brown theme
const BlueprintGrid = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Base paper texture - warm brown */}
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(30_15%_18%)] via-[hsl(30_12%_15%)] to-[hsl(30_10%_12%)]" />
    
    {/* Grid pattern - small squares */}
    <svg className="absolute inset-0 w-full h-full opacity-15">
      <defs>
        <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(32 42% 59%)" strokeWidth="0.5" />
        </pattern>
        <pattern id="largeGrid" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#smallGrid)" />
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="hsl(32 42% 59%)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#largeGrid)" />
    </svg>

    {/* Corner rulers - hidden on mobile */}
    {/* Top ruler */}
    <div className="hidden md:flex absolute top-0 left-16 right-0 h-8 bg-[hsl(30_12%_12%)]/80 border-b border-primary/20 items-end">
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center" style={{ width: '50px' }}>
          <div className="h-3 w-px bg-primary/40" />
          {i % 2 === 0 && (
            <span className="text-[8px] text-primary/50 mt-0.5">{i * 50}</span>
          )}
        </div>
      ))}
    </div>
    
    {/* Left ruler - hidden on mobile */}
    <div className="hidden md:flex absolute top-8 left-0 w-16 bottom-0 bg-[hsl(30_12%_12%)]/80 border-r border-primary/20 flex-col">
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="flex items-center" style={{ height: '50px' }}>
          <div className="w-3 h-px bg-primary/40 ml-auto" />
          {i % 2 === 0 && (
            <span className="text-[8px] text-primary/50 ml-1 w-8">{i * 50}</span>
          )}
        </div>
      ))}
    </div>

    {/* Corner piece - hidden on mobile */}
    <div className="hidden md:flex absolute top-0 left-0 w-16 h-8 bg-[hsl(30_12%_12%)] border-r border-b border-primary/20 items-center justify-center">
      <span className="text-[10px] text-primary/60 font-mono">mm</span>
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
    <div className="absolute bottom-6 right-6 w-24 h-24 opacity-25">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(32 42% 59%)" strokeWidth="2" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="hsl(32 42% 59%)" strokeWidth="0.5" />
        <text x="50" y="45" textAnchor="middle" fill="hsl(32 42% 59%)" fontSize="10" fontWeight="bold">ERA</text>
        <text x="50" y="58" textAnchor="middle" fill="hsl(32 42% 59%)" fontSize="6">CONCEPT</text>
      </svg>
    </div>
  </div>
);

// Image carousel component with premium paper hover effect
const HouseImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % houseImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Paper layers with hover effect */}
      <motion.div 
        className="absolute -inset-4 bg-[#e8e0d4] rounded-sm"
        animate={{
          rotate: isHovered ? 2 : 1,
          scale: isHovered ? 1.02 : 1,
          boxShadow: isHovered 
            ? "0 25px 50px -12px rgba(0,0,0,0.4), 0 12px 24px -8px rgba(0,0,0,0.2)"
            : "0 10px 30px -10px rgba(0,0,0,0.3)",
        }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      <motion.div 
        className="absolute -inset-4 bg-[#f5f0e8] rounded-sm"
        animate={{
          rotate: isHovered ? -1 : -0.5,
          scale: isHovered ? 1.01 : 1,
          boxShadow: isHovered 
            ? "0 20px 40px -10px rgba(0,0,0,0.35)"
            : "0 8px 24px -8px rgba(0,0,0,0.25)",
        }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      
      {/* Main drawing area */}
      <motion.div 
        className="relative bg-[#faf8f4] overflow-hidden"
        animate={{
          borderRadius: isHovered ? "8px" : "2px",
          boxShadow: isHovered 
            ? "0 15px 35px -8px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(195,153,107,0.2)"
            : "0 4px 16px -4px rgba(0,0,0,0.2)",
        }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Tape effect corners */}
        <motion.div 
          className="absolute -top-1 left-4 w-16 h-5 bg-gradient-to-b from-[#f0e6c8]/90 to-[#e8dcc0]/80 z-10"
          style={{ 
            clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
          }}
          animate={{
            y: isHovered ? -2 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.div 
          className="absolute -top-1 right-4 w-16 h-5 bg-gradient-to-b from-[#f0e6c8]/90 to-[#e8dcc0]/80 z-10"
          style={{ 
            clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
          }}
          animate={{
            y: isHovered ? -2 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Paper curl effect on hover */}
        <motion.div
          className="absolute bottom-0 right-0 w-16 h-16 z-20 pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="curlGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#faf8f4" />
                <stop offset="50%" stopColor="#e8e0d4" />
                <stop offset="100%" stopColor="#d4ccc0" />
              </linearGradient>
            </defs>
            <path 
              d="M100 100 L100 60 Q80 70, 70 90 Q65 95, 60 100 Z" 
              fill="url(#curlGradient)"
            />
            <path 
              d="M100 60 Q80 70, 70 90" 
              fill="none" 
              stroke="rgba(0,0,0,0.1)" 
              strokeWidth="1"
            />
          </svg>
        </motion.div>
        
        <div className="aspect-[4/3] relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={houseImages[currentIndex].src}
              alt={houseImages[currentIndex].label}
              className="w-full h-full object-contain bg-[#faf8f4]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
            />
          </AnimatePresence>
          
          {/* Subtle vignette effect */}
          <div className="absolute inset-0 pointer-events-none" 
            style={{
              background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.05) 100%)"
            }}
          />
        </div>

        {/* Label */}
        <motion.div 
          className="absolute bottom-3 left-3 right-3 bg-[#faf8f4]/95 backdrop-blur-sm px-3 py-2 border border-primary/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            borderRadius: isHovered ? "6px" : "2px",
          }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <p className="text-xs text-charcoal font-medium text-center">
            {houseImages[currentIndex].label}
          </p>
        </motion.div>
      </motion.div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-6">
        {houseImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-primary w-6' 
                : 'bg-primary/30 w-2 hover:bg-primary/50'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export function Advantages() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });

  return (
    <section id="advantages" className="py-24 md:py-32 relative overflow-hidden snap-start">
      {/* Blueprint/drafting table background */}
      <BlueprintGrid />

      {/* Content container - positioned above the grid */}
      <div className="container mx-auto px-4 md:pl-20 pt-8 md:pt-12 relative z-10" ref={containerRef}>
        {/* Header - styled as technical drawing title block */}
        <motion.div
          className="mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block border-2 border-primary/30 p-4 bg-[hsl(30_12%_12%)]/80 backdrop-blur-sm">
            <motion.span 
              className="block text-primary/80 font-mono text-xs uppercase tracking-[0.3em] mb-2"
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
                className="mt-6 p-3 border border-primary/20 bg-[hsl(30_12%_12%)]/60 backdrop-blur-sm rounded-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-primary/70 text-xs font-mono leading-relaxed">
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
                  className="relative bg-[hsl(30_12%_14%)]/90 backdrop-blur-sm rounded-sm p-5 md:p-6 border border-primary/20 overflow-hidden h-full"
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
                        className="text-4xl md:text-5xl font-bold text-primary/25 font-mono"
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
                      className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-1 border border-primary/30 rounded-sm"
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
                    className="text-primary/60 leading-relaxed text-xs md:text-sm"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    {item.description}
                  </motion.p>

                  {/* Corner technical mark */}
                  <div className="absolute bottom-2 right-2 text-[8px] font-mono text-primary/30">
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
          <div className="h-px flex-1 max-w-20 bg-primary/25" />
          <span className="text-primary/50 text-xs font-mono">ERA CONCEPT © 2024</span>
          <div className="h-px flex-1 max-w-20 bg-primary/25" />
        </motion.div>
      </div>
    </section>
  );
}
