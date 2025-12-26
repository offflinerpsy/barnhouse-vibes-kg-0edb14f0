import { motion } from "framer-motion";

export function FooterSkyline() {
  return (
    <div className="absolute inset-x-0 bottom-full w-full overflow-hidden pointer-events-none">
      <svg
        viewBox="0 0 1440 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          {/* Gradient for mountains */}
          <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(30 15% 22%)" />
            <stop offset="100%" stopColor="hsl(30 15% 20%)" />
          </linearGradient>
          
          {/* Window glow */}
          <filter id="windowGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft glow for larger elements */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background mountains - furthest layer */}
        <path
          d="M0 200 L0 120 Q50 100 100 110 L200 80 Q250 60 300 70 L400 40 Q450 20 500 35 L600 60 Q650 45 700 55 L800 30 Q900 10 1000 25 L1100 50 Q1150 40 1200 45 L1300 70 Q1350 60 1400 65 L1440 55 L1440 200 Z"
          fill="hsl(30 12% 25%)"
          opacity="0.5"
        />

        {/* Mid mountains */}
        <path
          d="M0 200 L0 140 Q80 110 150 125 L250 95 Q300 75 350 85 L450 110 Q500 95 550 100 L650 75 Q720 55 780 70 L880 95 Q950 80 1020 90 L1120 115 Q1200 100 1280 110 L1380 130 Q1410 120 1440 125 L1440 200 Z"
          fill="hsl(30 14% 23%)"
          opacity="0.7"
        />

        {/* Main silhouette layer */}
        <g fill="hsl(30 15% 20%)">
          {/* Left side - Small barnhouse */}
          <path d="M50 200 L50 165 L75 145 L100 165 L100 200 Z" />
          
          {/* Left modular house with pitched roof */}
          <path d="M130 200 L130 150 L155 125 L180 150 L180 200 Z" />
          <rect x="140" y="160" width="12" height="20" fill="hsl(30 15% 20%)" />
          
          {/* Trees/nature elements */}
          <ellipse cx="220" cy="185" rx="15" ry="25" opacity="0.8" />
          <ellipse cx="245" cy="190" rx="12" ry="20" opacity="0.6" />

          {/* Mountain peak with snow cap suggestion */}
          <path d="M280 200 L280 100 L320 50 L360 100 L360 200 Z" />
          
          {/* Modern A-frame cabin */}
          <path d="M400 200 L400 160 L440 120 L480 160 L480 200 Z" />
          
          {/* Traditional Kyrgyz yurt silhouette */}
          <path d="M520 200 L520 175 Q520 155 550 150 Q580 155 580 175 L580 200 Z" />
          <path d="M535 150 L550 140 L565 150" fill="none" stroke="hsl(30 15% 20%)" strokeWidth="3" />

          {/* Central mountain - tallest peak (like Pobeda/Khan Tengri) */}
          <path d="M620 200 L620 80 L680 20 L740 80 L740 200 Z" />
          
          {/* Minaret/Tower silhouette */}
          <path d="M790 200 L790 130 L795 125 L800 115 L805 125 L810 130 L810 200 Z" />
          <circle cx="800" cy="108" r="6" />
          
          {/* Modern modular house complex */}
          <rect x="850" y="150" width="60" height="50" />
          <path d="M845 150 L880 120 L915 150 Z" />
          
          {/* Another barnhouse */}
          <path d="M950 200 L950 155 L980 130 L1010 155 L1010 200 Z" />
          
          {/* Pine trees */}
          <path d="M1050 200 L1050 170 L1040 170 L1060 145 L1050 145 L1070 120 L1090 145 L1080 145 L1100 170 L1090 170 L1090 200 Z" opacity="0.9" />
          
          {/* Mountain range right side */}
          <path d="M1120 200 L1120 130 L1170 90 L1220 130 L1220 200 Z" />
          
          {/* Final modern house */}
          <path d="M1280 200 L1280 160 L1320 140 L1360 160 L1360 200 Z" />
          
          {/* Ending hill */}
          <path d="M1380 200 L1380 170 Q1410 160 1440 165 L1440 200 Z" />
        </g>

        {/* Illuminated windows - with glow effect */}
        <g filter="url(#windowGlow)">
          {/* Left barnhouse windows */}
          <motion.rect
            x="65" y="170" width="8" height="10"
            fill="hsl(40 60% 70%)"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Modular house windows */}
          <motion.rect
            x="145" y="165" width="6" height="8"
            fill="hsl(40 60% 70%)"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.rect
            x="160" y="165" width="6" height="8"
            fill="hsl(40 60% 70%)"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          
          {/* A-frame windows */}
          <motion.rect
            x="430" y="150" width="10" height="15"
            fill="hsl(40 60% 70%)"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 0.95, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          
          {/* Yurt door glow */}
          <motion.rect
            x="543" y="170" width="14" height="18" rx="7"
            fill="hsl(35 50% 60%)"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Modern house windows */}
          <motion.rect
            x="860" y="160" width="10" height="12"
            fill="hsl(40 60% 70%)"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          />
          <motion.rect
            x="880" y="160" width="10" height="12"
            fill="hsl(40 60% 70%)"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
          <motion.rect
            x="895" y="175" width="8" height="10"
            fill="hsl(40 60% 70%)"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          
          {/* Barnhouse window */}
          <motion.rect
            x="970" y="160" width="10" height="12"
            fill="hsl(40 60% 70%)"
            initial={{ opacity: 0.65 }}
            animate={{ opacity: [0.65, 0.95, 0.65] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          />
          
          {/* Final house windows */}
          <motion.rect
            x="1300" y="165" width="8" height="10"
            fill="hsl(40 60% 70%)"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          />
          <motion.rect
            x="1330" y="165" width="8" height="10"
            fill="hsl(40 60% 70%)"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
        </g>

        {/* Stars in the sky area */}
        <g>
          {[
            { cx: 100, cy: 60, delay: 0 },
            { cx: 250, cy: 40, delay: 0.5 },
            { cx: 400, cy: 70, delay: 1 },
            { cx: 550, cy: 30, delay: 1.5 },
            { cx: 750, cy: 50, delay: 2 },
            { cx: 900, cy: 65, delay: 0.3 },
            { cx: 1050, cy: 45, delay: 0.8 },
            { cx: 1200, cy: 55, delay: 1.3 },
            { cx: 1350, cy: 35, delay: 1.8 },
          ].map((star, i) => (
            <motion.circle
              key={i}
              cx={star.cx}
              cy={star.cy}
              r="1.5"
              fill="hsl(40 50% 80%)"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut",
                delay: star.delay,
              }}
            />
          ))}
        </g>

        {/* Moon */}
        <motion.circle
          cx="1380"
          cy="40"
          r="18"
          fill="hsl(45 30% 85%)"
          opacity="0.9"
          filter="url(#softGlow)"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: [0.7, 0.9, 0.7] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
