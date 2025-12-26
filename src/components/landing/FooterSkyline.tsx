import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export function FooterSkyline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms for different layers
  const backgroundY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const midY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [10, -10]);

  // Golden glow color
  const goldenGlow = "hsl(40 60% 65%)";
  const goldenGlowBright = "hsl(40 70% 75%)";

  return (
    <div 
      ref={containerRef}
      className="absolute inset-x-0 bottom-full w-full overflow-hidden pointer-events-none"
      style={{ marginBottom: '-1px' }}
    >
      <svg
        viewBox="0 0 1440 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block"
        preserveAspectRatio="xMidYMax slice"
        style={{ display: 'block' }}
      >
        <defs>
          {/* Window glow */}
          <filter id="windowGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Stronger glow for hover */}
          <filter id="hoverGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft glow for moon */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background mountains - furthest layer with parallax */}
        <motion.g style={{ y: backgroundY }}>
          <path
            d="M0 200 L0 120 Q50 100 100 110 L200 80 Q250 60 300 70 L400 40 Q450 20 500 35 L600 60 Q650 45 700 55 L800 30 Q900 10 1000 25 L1100 50 Q1150 40 1200 45 L1300 70 Q1350 60 1400 65 L1440 55 L1440 200 Z"
            fill="hsl(30 12% 25%)"
            opacity="0.5"
          />
        </motion.g>

        {/* Mid mountains with parallax */}
        <motion.g style={{ y: midY }}>
          <path
            d="M0 200 L0 140 Q80 110 150 125 L250 95 Q300 75 350 85 L450 110 Q500 95 550 100 L650 75 Q720 55 780 70 L880 95 Q950 80 1020 90 L1120 115 Q1200 100 1280 110 L1380 130 Q1410 120 1440 125 L1440 200 Z"
            fill="hsl(30 14% 23%)"
            opacity="0.7"
          />
        </motion.g>

        {/* Main silhouette layer with slight parallax */}
        <motion.g fill="hsl(30 15% 20%)" style={{ y: foregroundY }}>
          {/* Left side - Small barnhouse */}
          <g 
            className="pointer-events-auto"
            onMouseEnter={() => setHoveredBuilding('barnhouse1')}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            <path d="M50 200 L50 165 L75 145 L100 165 L100 200 Z" />
          </g>
          
          {/* Left modular house with pitched roof */}
          <g 
            className="pointer-events-auto"
            onMouseEnter={() => setHoveredBuilding('modular1')}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            <path d="M130 200 L130 150 L155 125 L180 150 L180 200 Z" />
            <rect x="140" y="160" width="12" height="20" fill="hsl(30 15% 20%)" />
          </g>
          
          {/* Trees/nature elements */}
          <ellipse cx="220" cy="185" rx="15" ry="25" opacity="0.8" />
          <ellipse cx="245" cy="190" rx="12" ry="20" opacity="0.6" />

          {/* Mountain peak */}
          <path d="M280 200 L280 100 L320 50 L360 100 L360 200 Z" />
          
          {/* Modern A-frame cabin */}
          <g 
            className="pointer-events-auto"
            onMouseEnter={() => setHoveredBuilding('aframe')}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            <path d="M400 200 L400 160 L440 120 L480 160 L480 200 Z" />
          </g>
          
          {/* Traditional Kyrgyz yurt silhouette */}
          <g 
            className="pointer-events-auto"
            onMouseEnter={() => setHoveredBuilding('yurt')}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            <path d="M520 200 L520 175 Q520 155 550 150 Q580 155 580 175 L580 200 Z" />
            <path d="M535 150 L550 140 L565 150" fill="none" stroke="hsl(30 15% 20%)" strokeWidth="3" />
          </g>

          {/* Central mountain - tallest peak */}
          <path d="M620 200 L620 80 L680 20 L740 80 L740 200 Z" />
          
          {/* === MOSQUE - EXACT SILHOUETTE FROM REFERENCE === */}
          <g 
            className="pointer-events-auto"
            onMouseEnter={() => setHoveredBuilding('mosque')}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            {/* Main building base - rectangular with arch entrance */}
            <rect x="770" y="155" width="70" height="45" />
            
            {/* Arch entrance cutout */}
            <path d="M790 200 L790 172 Q805 155 820 172 L820 200 Z" fill="hsl(38 25% 95%)" />
            
            {/* Platform/cornice above base */}
            <rect x="765" y="148" width="80" height="10" />
            <rect x="768" y="145" width="74" height="5" />
            
            {/* Main dome - large onion-shaped */}
            <ellipse cx="805" cy="130" rx="32" ry="20" />
            <path d="M773 130 Q805 85 837 130" fill="hsl(30 15% 20%)" />
            
            {/* Crescent moon on top of dome */}
            <g transform="translate(795, 78)">
              <path d="M10 0 C16 4 16 14 10 18 C8 14 8 4 10 0 Z" fill="hsl(30 15% 20%)" />
              <path d="M8 3 C12 6 12 12 8 15 C6 12 6 6 8 3 Z" fill="hsl(38 25% 95%)" />
            </g>
            
            {/* Minaret tower - right side, behind dome */}
            <rect x="840" y="70" width="22" height="130" />
            
            {/* Minaret top dome */}
            <ellipse cx="851" cy="70" rx="11" ry="7" />
            <path d="M840 70 Q851 55 862 70" fill="hsl(30 15% 20%)" />
            
            {/* Minaret crown with small dome */}
            <ellipse cx="851" cy="50" rx="7" ry="5" />
            <path d="M844 50 Q851 40 858 50" fill="hsl(30 15% 20%)" />
            
            {/* Minaret finial */}
            <path d="M849 40 L851 32 L853 40" fill="hsl(30 15% 20%)" />
            
            {/* Minaret windows - two arched windows */}
            <rect x="846" y="85" width="10" height="18" rx="5" fill="hsl(38 25% 95%)" />
            <rect x="846" y="115" width="10" height="18" rx="5" fill="hsl(38 25% 95%)" />
          </g>
          
          {/* Modern modular house complex */}
          <g 
            className="pointer-events-auto"
            onMouseEnter={() => setHoveredBuilding('modern1')}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            <rect x="920" y="150" width="60" height="50" />
            <path d="M915 150 L950 120 L985 150 Z" />
          </g>
          
          {/* Another barnhouse */}
          <g 
            className="pointer-events-auto"
            onMouseEnter={() => setHoveredBuilding('barnhouse2')}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            <path d="M1020 200 L1020 155 L1050 130 L1080 155 L1080 200 Z" />
          </g>
          
          {/* Pine trees */}
          <path d="M1120 200 L1120 170 L1110 170 L1130 145 L1120 145 L1140 120 L1160 145 L1150 145 L1170 170 L1160 170 L1160 200 Z" opacity="0.9" />
          
          {/* Mountain range right side */}
          <path d="M1190 200 L1190 130 L1240 90 L1290 130 L1290 200 Z" />
          
          {/* Final modern house */}
          <g 
            className="pointer-events-auto"
            onMouseEnter={() => setHoveredBuilding('final')}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            <path d="M1340 200 L1340 160 L1380 140 L1420 160 L1420 200 Z" />
          </g>
          
          {/* Ending hill */}
          <path d="M1420 200 L1420 180 Q1430 175 1440 178 L1440 200 Z" />
        </motion.g>

        {/* Illuminated windows - with glow effect */}
        <motion.g style={{ y: foregroundY }}>
          {/* Left barnhouse windows */}
          <motion.rect
            x="65" y="170" width="8" height="10"
            fill={goldenGlow}
            filter={hoveredBuilding === 'barnhouse1' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            initial={{ opacity: 0.3 }}
            animate={{ 
              opacity: hoveredBuilding === 'barnhouse1' ? 1 : [0.6, 0.9, 0.6],
              fill: hoveredBuilding === 'barnhouse1' ? goldenGlowBright : goldenGlow
            }}
            transition={{ duration: hoveredBuilding === 'barnhouse1' ? 0.3 : 3, repeat: hoveredBuilding === 'barnhouse1' ? 0 : Infinity, ease: "easeInOut" }}
          />
          
          {/* Modular house windows */}
          <motion.rect
            x="145" y="165" width="6" height="8"
            fill={goldenGlow}
            filter={hoveredBuilding === 'modular1' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'modular1' ? 1 : [0.7, 1, 0.7]
            }}
            transition={{ duration: hoveredBuilding === 'modular1' ? 0.3 : 4, repeat: hoveredBuilding === 'modular1' ? 0 : Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.rect
            x="160" y="165" width="6" height="8"
            fill={goldenGlow}
            filter={hoveredBuilding === 'modular1' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'modular1' ? 1 : [0.5, 0.8, 0.5]
            }}
            transition={{ duration: hoveredBuilding === 'modular1' ? 0.3 : 3.5, repeat: hoveredBuilding === 'modular1' ? 0 : Infinity, ease: "easeInOut", delay: 1 }}
          />
          
          {/* A-frame windows */}
          <motion.rect
            x="430" y="150" width="10" height="15"
            fill={goldenGlow}
            filter={hoveredBuilding === 'aframe' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'aframe' ? 1 : [0.6, 0.95, 0.6]
            }}
            transition={{ duration: hoveredBuilding === 'aframe' ? 0.3 : 4, repeat: hoveredBuilding === 'aframe' ? 0 : Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          
          {/* Yurt door glow */}
          <motion.rect
            x="543" y="170" width="14" height="18" rx="7"
            fill={goldenGlow}
            filter={hoveredBuilding === 'yurt' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'yurt' ? 1 : [0.4, 0.7, 0.4]
            }}
            transition={{ duration: hoveredBuilding === 'yurt' ? 0.3 : 5, repeat: hoveredBuilding === 'yurt' ? 0 : Infinity, ease: "easeInOut" }}
          />
          
          {/* Mosque entrance arch glow - GOLDEN */}
          <motion.path
            d="M792 198 L792 174 Q805 158 818 174 L818 198 Z"
            fill={goldenGlow}
            filter={hoveredBuilding === 'mosque' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'mosque' ? 1 : [0.4, 0.7, 0.4]
            }}
            transition={{ duration: hoveredBuilding === 'mosque' ? 0.3 : 5, repeat: hoveredBuilding === 'mosque' ? 0 : Infinity, ease: "easeInOut" }}
          />
          
          {/* Minaret windows - GOLDEN - updated positions */}
          <motion.rect
            x="847" y="86" width="8" height="16" rx="4"
            fill={goldenGlow}
            filter={hoveredBuilding === 'mosque' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'mosque' ? 1 : [0.5, 0.8, 0.5]
            }}
            transition={{ duration: hoveredBuilding === 'mosque' ? 0.3 : 4, repeat: hoveredBuilding === 'mosque' ? 0 : Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.rect
            x="847" y="116" width="8" height="16" rx="4"
            fill={goldenGlow}
            filter={hoveredBuilding === 'mosque' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'mosque' ? 1 : [0.4, 0.7, 0.4]
            }}
            transition={{ duration: hoveredBuilding === 'mosque' ? 0.3 : 4.5, repeat: hoveredBuilding === 'mosque' ? 0 : Infinity, ease: "easeInOut", delay: 1 }}
          />
          
          {/* Modern house windows */}
          <motion.rect
            x="930" y="160" width="10" height="12"
            fill={goldenGlow}
            filter={hoveredBuilding === 'modern1' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'modern1' ? 1 : [0.7, 1, 0.7]
            }}
            transition={{ duration: hoveredBuilding === 'modern1' ? 0.3 : 3, repeat: hoveredBuilding === 'modern1' ? 0 : Infinity, ease: "easeInOut", delay: 0.8 }}
          />
          <motion.rect
            x="950" y="160" width="10" height="12"
            fill={goldenGlow}
            filter={hoveredBuilding === 'modern1' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'modern1' ? 1 : [0.5, 0.85, 0.5]
            }}
            transition={{ duration: hoveredBuilding === 'modern1' ? 0.3 : 4, repeat: hoveredBuilding === 'modern1' ? 0 : Infinity, ease: "easeInOut", delay: 1.5 }}
          />
          <motion.rect
            x="965" y="175" width="8" height="10"
            fill={goldenGlow}
            filter={hoveredBuilding === 'modern1' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'modern1' ? 1 : [0.6, 0.9, 0.6]
            }}
            transition={{ duration: hoveredBuilding === 'modern1' ? 0.3 : 3.5, repeat: hoveredBuilding === 'modern1' ? 0 : Infinity, ease: "easeInOut", delay: 2 }}
          />
          
          {/* Barnhouse2 window */}
          <motion.rect
            x="1040" y="160" width="10" height="12"
            fill={goldenGlow}
            filter={hoveredBuilding === 'barnhouse2' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'barnhouse2' ? 1 : [0.65, 0.95, 0.65]
            }}
            transition={{ duration: hoveredBuilding === 'barnhouse2' ? 0.3 : 4, repeat: hoveredBuilding === 'barnhouse2' ? 0 : Infinity, ease: "easeInOut", delay: 0.7 }}
          />
          
          {/* Final house windows */}
          <motion.rect
            x="1365" y="165" width="8" height="10"
            fill={goldenGlow}
            filter={hoveredBuilding === 'final' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'final' ? 1 : [0.6, 0.9, 0.6]
            }}
            transition={{ duration: hoveredBuilding === 'final' ? 0.3 : 3, repeat: hoveredBuilding === 'final' ? 0 : Infinity, ease: "easeInOut", delay: 1.2 }}
          />
          <motion.rect
            x="1390" y="165" width="8" height="10"
            fill={goldenGlow}
            filter={hoveredBuilding === 'final' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'final' ? 1 : [0.5, 0.8, 0.5]
            }}
            transition={{ duration: hoveredBuilding === 'final' ? 0.3 : 4, repeat: hoveredBuilding === 'final' ? 0 : Infinity, ease: "easeInOut", delay: 0.4 }}
          />
        </motion.g>

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

        {/* Bottom fill to prevent gap */}
        <rect x="0" y="199" width="1440" height="10" fill="hsl(30 15% 20%)" />
      </svg>
    </div>
  );
}
