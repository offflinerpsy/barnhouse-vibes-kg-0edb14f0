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
          
          {/* Mosque with dome and minarets - proper Islamic architecture */}
          {/* Left minaret */}
          <path d="M765 200 L765 120 L768 115 L771 110 L774 115 L777 120 L777 200 Z" />
          <circle cx="771" cy="105" r="4" />
          {/* Main dome */}
          <path d="M785 200 L785 160 Q785 130 815 115 Q845 130 845 160 L845 200 Z" />
          {/* Crescent on dome */}
          <path d="M815 108 Q820 102 815 96 Q812 99 812 104 Q812 107 815 108 Z" fill="hsl(30 15% 20%)" />
          {/* Main building base */}
          <rect x="780" y="160" width="70" height="40" />
          {/* Entrance arch */}
          <path d="M805 200 L805 175 Q815 165 825 175 L825 200 Z" />
          {/* Right minaret */}
          <path d="M853 200 L853 120 L856 115 L859 110 L862 115 L865 120 L865 200 Z" />
          <circle cx="859" cy="105" r="4" />
          
          {/* Modern modular house complex */}
          <rect x="900" y="150" width="60" height="50" />
          <path d="M895 150 L930 120 L965 150 Z" />
          
          {/* Another barnhouse */}
          <path d="M1000 200 L1000 155 L1030 130 L1060 155 L1060 200 Z" />
          
          {/* Pine trees */}
          <path d="M1100 200 L1100 170 L1090 170 L1110 145 L1100 145 L1120 120 L1140 145 L1130 145 L1150 170 L1140 170 L1140 200 Z" opacity="0.9" />
          
          {/* Mountain range right side */}
          <path d="M1170 200 L1170 130 L1220 90 L1270 130 L1270 200 Z" />
          
          {/* Final modern house */}
          <path d="M1320 200 L1320 160 L1360 140 L1400 160 L1400 200 Z" />
          
          {/* Ending hill */}
          <path d="M1400 200 L1400 175 Q1420 165 1440 170 L1440 200 Z" />
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
          
          {/* Mosque windows - warm glow from inside */}
          <motion.path
            d="M805 195 L805 180 Q815 172 825 180 L825 195 Z"
            fill="hsl(35 50% 55%)"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Modern house windows - adjusted positions */}
          <motion.rect
            x="910" y="160" width="10" height="12"
            fill="hsl(40 60% 70%)"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          />
          <motion.rect
            x="930" y="160" width="10" height="12"
            fill="hsl(40 60% 70%)"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
          <motion.rect
            x="945" y="175" width="8" height="10"
            fill="hsl(40 60% 70%)"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          
          {/* Barnhouse window - adjusted */}
          <motion.rect
            x="1020" y="160" width="10" height="12"
            fill="hsl(40 60% 70%)"
            initial={{ opacity: 0.65 }}
            animate={{ opacity: [0.65, 0.95, 0.65] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          />
          
          {/* Final house windows - adjusted */}
          <motion.rect
            x="1345" y="165" width="8" height="10"
            fill="hsl(40 60% 70%)"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          />
          <motion.rect
            x="1370" y="165" width="8" height="10"
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
