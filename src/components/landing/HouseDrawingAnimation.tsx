import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// SVG paths for different house types
const houseVariants = [
  {
    name: "Одноэтажный дом",
    // Simple one-story house with pitched roof
    paths: [
      // Ground line
      "M 20 180 L 280 180",
      // Foundation
      "M 40 180 L 40 170 L 260 170 L 260 180",
      // Left wall
      "M 50 170 L 50 100",
      // Right wall
      "M 250 170 L 250 100",
      // Roof left
      "M 40 100 L 150 40",
      // Roof right
      "M 150 40 L 260 100",
      // Roof bottom
      "M 40 100 L 260 100",
      // Door
      "M 130 170 L 130 120 L 170 120 L 170 170",
      // Window left
      "M 70 140 L 70 110 L 110 110 L 110 140 L 70 140 M 90 110 L 90 140 M 70 125 L 110 125",
      // Window right
      "M 190 140 L 190 110 L 230 110 L 230 140 L 190 140 M 210 110 L 210 140 M 190 125 L 230 125",
      // Chimney
      "M 200 70 L 200 45 L 220 45 L 220 58",
    ],
  },
  {
    name: "Двухэтажный дом",
    // Two-story house
    paths: [
      // Ground
      "M 20 180 L 280 180",
      // Foundation
      "M 40 180 L 40 170 L 260 170 L 260 180",
      // Left wall full
      "M 50 170 L 50 50",
      // Right wall full
      "M 250 170 L 250 50",
      // Floor separator
      "M 50 110 L 250 110",
      // Roof left
      "M 40 50 L 150 10",
      // Roof right
      "M 150 10 L 260 50",
      // Roof bottom
      "M 40 50 L 260 50",
      // Door
      "M 135 170 L 135 125 L 165 125 L 165 170",
      // Window ground floor left
      "M 65 155 L 65 130 L 100 130 L 100 155 L 65 155",
      // Window ground floor right
      "M 200 155 L 200 130 L 235 130 L 235 155 L 200 155",
      // Window second floor left
      "M 65 95 L 65 65 L 100 65 L 100 95 L 65 95",
      // Window second floor center
      "M 130 95 L 130 65 L 170 65 L 170 95 L 130 95",
      // Window second floor right
      "M 200 95 L 200 65 L 235 65 L 235 95 L 200 95",
      // Chimney
      "M 210 40 L 210 15 L 230 15 L 230 30",
    ],
  },
  {
    name: "Дом с верандой",
    // House with veranda/porch
    paths: [
      // Ground
      "M 10 180 L 290 180",
      // Main house foundation
      "M 30 180 L 30 170 L 200 170 L 200 180",
      // Main walls
      "M 40 170 L 40 90",
      "M 190 170 L 190 90",
      // Main roof
      "M 30 90 L 115 45 L 200 90 L 30 90",
      // Door
      "M 100 170 L 100 120 L 135 120 L 135 170",
      // Window
      "M 55 150 L 55 120 L 90 120 L 90 150 L 55 150 M 72.5 120 L 72.5 150",
      "M 150 150 L 150 120 L 180 120 L 180 150 L 150 150",
      // Veranda foundation
      "M 200 180 L 200 170 L 280 170 L 280 180",
      // Veranda posts
      "M 210 170 L 210 110",
      "M 240 170 L 240 110",
      "M 270 170 L 270 110",
      // Veranda roof
      "M 195 110 L 285 110",
      "M 195 110 L 195 100 L 285 100 L 285 110",
      // Veranda railings
      "M 210 170 L 210 150 L 270 150 L 270 170",
      "M 225 170 L 225 150",
      "M 255 170 L 255 150",
      // Chimney
      "M 160 65 L 160 40 L 175 40 L 175 55",
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
      strokeWidth="1.5"
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
          ease: "easeInOut" 
        },
        opacity: { 
          delay, 
          duration: 0.3 
        },
      }}
      style={{
        filter: "drop-shadow(0 0 2px hsl(32 42% 59% / 0.5))",
      }}
    />
  );
};

export function HouseDrawingAnimation() {
  const [currentHouse, setCurrentHouse] = useState(0);
  const [isDrawing, setIsDrawing] = useState(true);
  const [cycleKey, setCycleKey] = useState(0);

  const house = houseVariants[currentHouse];
  const pathDuration = 0.4;
  const totalDrawTime = house.paths.length * pathDuration * 0.6;
  const pauseAfterDraw = 2000;
  const fadeOutTime = 800;

  useEffect(() => {
    // Drawing complete -> pause -> fade out -> next house
    const drawTimer = setTimeout(() => {
      // Pause after drawing complete
      setTimeout(() => {
        setIsDrawing(false);
        
        // Fade out then switch to next house
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
          <span className="text-primary/80 text-sm font-medium tracking-wide">
            {house.name}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* SVG Canvas */}
      <div className="relative bg-gradient-to-br from-charcoal/50 to-charcoal/30 rounded-2xl p-6 border border-warm-white/5 backdrop-blur-sm overflow-hidden">
        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: isDrawing 
              ? "radial-gradient(circle at 50% 80%, hsl(32 42% 59% / 0.08) 0%, transparent 50%)"
              : "radial-gradient(circle at 50% 80%, hsl(32 42% 59% / 0.02) 0%, transparent 50%)",
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Pencil cursor effect */}
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-primary/60 pointer-events-none z-10"
          animate={{
            opacity: isDrawing ? [0.4, 0.8, 0.4] : 0,
            scale: isDrawing ? [1, 1.2, 1] : 0,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: "50%",
            top: "30%",
            filter: "blur(2px)",
          }}
        />

        <svg
          viewBox="0 0 300 200"
          className="w-full h-auto"
          style={{ minHeight: "180px" }}
        >
          <defs>
            {/* Gold gradient for the drawing line */}
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(32 42% 59%)" />
              <stop offset="50%" stopColor="hsl(36 45% 65%)" />
              <stop offset="100%" stopColor="hsl(32 42% 59%)" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Pencil sketch effect */}
            <filter id="pencil">
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.5" />
            </filter>
          </defs>

          <g filter="url(#glow)" key={`${currentHouse}-${cycleKey}`}>
            {house.paths.map((path, index) => (
              <DrawingPath
                key={`${currentHouse}-${cycleKey}-${index}`}
                d={path}
                delay={index * pathDuration * 0.6}
                duration={pathDuration}
                isVisible={isDrawing}
              />
            ))}
          </g>
        </svg>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-4">
          {houseVariants.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index === currentHouse 
                  ? "bg-primary" 
                  : "bg-warm-white/20"
              }`}
              animate={index === currentHouse ? {
                scale: [1, 1.2, 1],
              } : {}}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Decorative corner elements */}
      <motion.div
        className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-primary/30 rounded-tl-lg"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-primary/30 rounded-br-lg"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />
    </div>
  );
}
