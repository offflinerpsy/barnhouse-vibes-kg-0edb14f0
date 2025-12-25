import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Premium SVG paths for modular houses - architectural style
const houseVariants = [
  {
    name: "Одноэтажный модульный дом",
    paths: [
      // Фундамент (основание)
      "M 30 165 L 270 165",
      // Цоколь
      "M 35 165 L 35 155 L 265 155 L 265 165",
      // Левая стена
      "M 45 155 L 45 85",
      // Правая стена  
      "M 255 155 L 255 85",
      // Верхняя линия стен
      "M 45 85 L 255 85",
      // Крыша левый скат
      "M 35 85 L 150 35",
      // Крыша правый скат
      "M 150 35 L 265 85",
      // Карниз слева
      "M 35 85 L 45 85",
      // Карниз справа
      "M 255 85 L 265 85",
      // Входная дверь
      "M 125 155 L 125 110 L 160 110 L 160 155",
      // Ручка двери
      "M 153 132 L 153 135",
      // Левое окно (рама)
      "M 60 135 L 60 100 L 105 100 L 105 135 L 60 135",
      // Левое окно (крест)
      "M 82.5 100 L 82.5 135 M 60 117.5 L 105 117.5",
      // Правое окно (рама)
      "M 195 135 L 195 100 L 240 100 L 240 135 L 195 135",
      // Правое окно (крест)
      "M 217.5 100 L 217.5 135 M 195 117.5 L 240 117.5",
      // Труба на крыше
      "M 200 65 L 200 40 L 218 40 L 218 52",
      // Дымок (декор)
      "M 209 40 L 209 32",
    ],
  },
  {
    name: "Двухэтажный модульный дом",
    paths: [
      // Фундамент
      "M 30 175 L 270 175",
      // Цоколь
      "M 40 175 L 40 165 L 260 165 L 260 175",
      // Левая стена (полная высота)
      "M 50 165 L 50 45",
      // Правая стена (полная высота)
      "M 250 165 L 250 45",
      // Верх стен
      "M 50 45 L 250 45",
      // Перекрытие между этажами
      "M 50 105 L 250 105",
      // Крыша плоская (модульный стиль)
      "M 40 45 L 40 35 L 260 35 L 260 45",
      // Парапет слева
      "M 40 35 L 50 35",
      // Парапет справа
      "M 250 35 L 260 35",
      // Входная дверь
      "M 135 165 L 135 120 L 165 120 L 165 165",
      // Козырёк над дверью
      "M 125 120 L 175 120 L 175 115 L 125 115 L 125 120",
      // Окно 1 этаж левое
      "M 65 150 L 65 120 L 110 120 L 110 150 L 65 150",
      "M 87.5 120 L 87.5 150 M 65 135 L 110 135",
      // Окно 1 этаж правое
      "M 190 150 L 190 120 L 235 120 L 235 150 L 190 150",
      "M 212.5 120 L 212.5 150 M 190 135 L 235 135",
      // Окно 2 этаж левое
      "M 65 90 L 65 55 L 110 55 L 110 90 L 65 90",
      "M 87.5 55 L 87.5 90 M 65 72.5 L 110 72.5",
      // Окно 2 этаж центр
      "M 130 90 L 130 55 L 170 55 L 170 90 L 130 90",
      "M 150 55 L 150 90 M 130 72.5 L 170 72.5",
      // Окно 2 этаж правое
      "M 190 90 L 190 55 L 235 55 L 235 90 L 190 90",
      "M 212.5 55 L 212.5 90 M 190 72.5 L 235 72.5",
    ],
  },
  {
    name: "Дом с террасой",
    paths: [
      // Фундамент общий
      "M 15 175 L 285 175",
      // Основной модуль - цоколь
      "M 25 175 L 25 165 L 185 165 L 185 175",
      // Левая стена основного модуля
      "M 35 165 L 35 75",
      // Правая стена основного модуля
      "M 175 165 L 175 75",
      // Верх стен
      "M 35 75 L 175 75",
      // Крыша основного модуля (односкатная - модерн)
      "M 25 75 L 25 60 L 185 70 L 185 75",
      // Верхняя линия крыши
      "M 25 60 L 185 70",
      // Дверь
      "M 90 165 L 90 115 L 120 115 L 120 165",
      // Ручка
      "M 114 140 L 114 143",
      // Окно слева
      "M 45 145 L 45 110 L 80 110 L 80 145 L 45 145",
      "M 62.5 110 L 62.5 145 M 45 127.5 L 80 127.5",
      // Окно справа
      "M 130 145 L 130 110 L 165 110 L 165 145 L 130 145",
      "M 147.5 110 L 147.5 145 M 130 127.5 L 165 127.5",
      // Терраса - пол
      "M 185 175 L 185 165 L 275 165 L 275 175",
      // Стойки террасы
      "M 195 165 L 195 100",
      "M 230 165 L 230 100",
      "M 265 165 L 265 100",
      // Навес террасы
      "M 185 100 L 280 100",
      "M 185 100 L 185 93 L 280 93 L 280 100",
      // Перила
      "M 195 165 L 195 140 L 265 140 L 265 165",
      // Вертикальные балясины
      "M 210 165 L 210 140",
      "M 230 165 L 230 140",
      "M 250 165 L 250 140",
      // Горизонтальная планка перил
      "M 195 152.5 L 265 152.5",
    ],
  },
];

const DrawingPath = ({ 
  d, 
  delay, 
  duration,
  isVisible,
}: { 
  d: string; 
  delay: number; 
  duration: number;
  isVisible: boolean;
}) => {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="url(#goldGradient)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={isVisible ? { 
        pathLength: 1, 
        opacity: 1,
      } : { 
        pathLength: 0, 
        opacity: 0 
      }}
      transition={{
        pathLength: { 
          delay, 
          duration, 
          ease: [0.65, 0, 0.35, 1]
        },
        opacity: { 
          delay, 
          duration: 0.2 
        },
      }}
      style={{
        filter: "drop-shadow(0 0 3px hsl(32 42% 59% / 0.6))",
      }}
    />
  );
};

export function HouseDrawingAnimation() {
  const [currentHouse, setCurrentHouse] = useState(0);
  const [isDrawing, setIsDrawing] = useState(true);
  const [cycleKey, setCycleKey] = useState(0);

  const house = houseVariants[currentHouse];
  const pathDuration = 0.35;
  const totalDrawTime = house.paths.length * pathDuration * 0.5;
  const pauseAfterDraw = 2500;
  const fadeOutTime = 600;

  useEffect(() => {
    const drawTimer = setTimeout(() => {
      setTimeout(() => {
        setIsDrawing(false);
        
        setTimeout(() => {
          setCurrentHouse((prev) => (prev + 1) % houseVariants.length);
          setCycleKey((prev) => prev + 1);
          setIsDrawing(true);
        }, fadeOutTime);
      }, pauseAfterDraw);
    }, totalDrawTime * 1000);

    return () => clearTimeout(drawTimer);
  }, [currentHouse, cycleKey, totalDrawTime]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`label-${currentHouse}`}
          className="text-center mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-primary/80 text-sm font-medium tracking-wide uppercase">
            {house.name}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* SVG Canvas */}
      <div className="relative bg-gradient-to-br from-charcoal/60 to-charcoal/40 rounded-2xl p-8 border border-primary/10 backdrop-blur-sm overflow-hidden">
        {/* Grid background for architectural feel */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(32 42% 59%) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(32 42% 59%) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: isDrawing 
              ? "radial-gradient(ellipse at 50% 70%, hsl(32 42% 59% / 0.12) 0%, transparent 60%)"
              : "radial-gradient(ellipse at 50% 70%, hsl(32 42% 59% / 0.03) 0%, transparent 60%)",
          }}
          transition={{ duration: 0.6 }}
        />

        <svg
          viewBox="0 0 300 190"
          className="w-full h-auto relative z-10"
          style={{ minHeight: "200px" }}
        >
          <defs>
            {/* Gold gradient for the drawing line */}
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(36 50% 55%)" />
              <stop offset="50%" stopColor="hsl(40 55% 65%)" />
              <stop offset="100%" stopColor="hsl(32 45% 50%)" />
            </linearGradient>

            {/* Enhanced glow filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g filter="url(#glow)" key={`${currentHouse}-${cycleKey}`}>
            {house.paths.map((path, index) => (
              <DrawingPath
                key={`${currentHouse}-${cycleKey}-${index}`}
                d={path}
                delay={index * pathDuration * 0.5}
                duration={pathDuration}
                isVisible={isDrawing}
              />
            ))}
          </g>
        </svg>

        {/* Progress dots */}
        <div className="flex justify-center gap-3 mt-6 relative z-10">
          {houseVariants.map((variant, index) => (
            <button
              key={index}
              onClick={() => {
                setIsDrawing(false);
                setTimeout(() => {
                  setCurrentHouse(index);
                  setCycleKey((prev) => prev + 1);
                  setIsDrawing(true);
                }, 300);
              }}
              className="group relative"
              aria-label={variant.name}
            >
              <motion.div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentHouse 
                    ? "bg-primary shadow-[0_0_8px_hsl(32_42%_59%/0.6)]" 
                    : "bg-warm-white/20 group-hover:bg-warm-white/40"
                }`}
                animate={index === currentHouse ? {
                  scale: [1, 1.15, 1],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Decorative corner brackets */}
      <div className="absolute -top-1 -left-1 w-5 h-5 border-l-2 border-t-2 border-primary/25 rounded-tl" />
      <div className="absolute -top-1 -right-1 w-5 h-5 border-r-2 border-t-2 border-primary/25 rounded-tr" />
      <div className="absolute -bottom-1 -left-1 w-5 h-5 border-l-2 border-b-2 border-primary/25 rounded-bl" />
      <div className="absolute -bottom-1 -right-1 w-5 h-5 border-r-2 border-b-2 border-primary/25 rounded-br" />
    </div>
  );
}
