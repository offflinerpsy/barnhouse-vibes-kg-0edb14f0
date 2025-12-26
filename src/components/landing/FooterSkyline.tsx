import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import mosqueSilhouette from "@/assets/mosque-silhouette.svg";

type FooterSkylineVariant = "attached" | "standalone";

export function FooterSkyline({
  variant = "attached",
}: {
  variant?: FooterSkylineVariant;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  const containerClassName =
    variant === "attached"
      ? "absolute inset-x-0 bottom-full w-full overflow-hidden pointer-events-none"
      : "relative w-full overflow-hidden pointer-events-none";

  const containerStyle =
    variant === "attached" ? { marginBottom: "-1px" } : undefined;

  const svgClassName =
    variant === "attached" ? "w-full h-auto block" : "w-full h-full block";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax transforms for different layers
  const backgroundY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const midY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [10, -10]);

  // Skyline palette
  const silhouetteFill = "hsl(36 31% 18%)"; // matches mosque SVG fill

  // Window glow color
  const goldenGlow = "hsl(40 60% 65%)";
  const goldenGlowBright = "hsl(40 70% 75%)";

  // Mosque placement - anchor bottom to ground (y=200)
  const mosqueW = 120;
  const mosqueH = 95;
  const mosqueX = 775;
  const mosqueY = 105; // 200 - mosqueH = 105 → bottom at y=200

  // Mosque window glows:
  // 1) Central arched entrance (main dome body)
  const mosqueDoor = {
    x: mosqueX + mosqueW * 0.38,
    y: mosqueY + mosqueH * 0.72,
    w: mosqueW * 0.14,
    h: mosqueH * 0.20,
    rx: 10,
  };

  // 2) Minaret tower windows - two vertical slots side by side
  const minaretWinLeft = {
    x: mosqueX + mosqueW * 0.58,
    y: mosqueY + mosqueH * 0.30,
    w: mosqueW * 0.05,
    h: mosqueH * 0.12,
    rx: 2,
  };

  const minaretWinRight = {
    x: mosqueX + mosqueW * 0.66,
    y: mosqueY + mosqueH * 0.30,
    w: mosqueW * 0.05,
    h: mosqueH * 0.12,
    rx: 2,
  };

  return (
    <div ref={containerRef} className={containerClassName} style={containerStyle}>
      <svg
        viewBox="0 0 1440 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={svgClassName}
        preserveAspectRatio="xMidYMax slice"
        style={{ display: "block" }}
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
            d="M0 200 L0 130 Q50 115 100 120 L200 100 Q250 85 300 90 L400 75 Q450 60 500 70 L600 85 Q650 75 700 80 L800 65 Q900 50 1000 60 L1100 75 Q1150 65 1200 70 L1300 85 Q1350 80 1400 82 L1440 78 L1440 200 Z"
            fill="hsl(30 12% 25%)"
            opacity="0.5"
          />
        </motion.g>

        {/* Mid mountains with parallax */}
        <motion.g style={{ y: midY }}>
          <path
            d="M0 200 L0 150 Q80 130 150 140 L250 120 Q300 105 350 115 L450 130 Q500 120 550 125 L650 110 Q720 95 780 105 L880 120 Q950 110 1020 118 L1120 130 Q1200 122 1280 128 L1380 140 Q1410 135 1440 138 L1440 200 Z"
            fill="hsl(30 14% 23%)"
            opacity="0.7"
          />
        </motion.g>

        {/* Main silhouette layer with slight parallax */}
        <motion.g fill={silhouetteFill} style={{ y: foregroundY }}>
          {/* Left side - Small barnhouse (small, stays below mosque) */}
          <g
            className="pointer-events-auto"
            onMouseEnter={() => setHoveredBuilding('barnhouse1')}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            <path d="M50 200 L50 178 L70 168 L90 178 L90 200 Z" />
          </g>

          {/* Left modular house with pitched roof (small) */}
          <g
            className="pointer-events-auto"
            onMouseEnter={() => setHoveredBuilding('modular1')}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            <path d="M130 200 L130 175 L150 162 L170 175 L170 200 Z" />
          </g>

          {/* Linden/deciduous trees */}
          <ellipse cx="210" cy="190" rx="10" ry="14" opacity="0.8" />
          <ellipse cx="230" cy="192" rx="8" ry="12" opacity="0.7" />

          {/* Peak (kept below mosque) */}
          <path d="M270 200 L270 155 L305 130 L340 155 L340 200 Z" />

          {/* Modern A-frame cabin (small) */}
          <g
            className="pointer-events-auto"
            onMouseEnter={() => setHoveredBuilding('aframe')}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            <path d="M390 200 L390 175 L420 158 L450 175 L450 200 Z" />
          </g>

          {/* Traditional Kyrgyz yurt silhouette */}
          <g
            className="pointer-events-auto"
            onMouseEnter={() => setHoveredBuilding('yurt')}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            <path d="M500 200 L500 185 Q500 175 525 172 Q550 175 550 185 L550 200 Z" />
            <path d="M512 172 L525 166 L538 172" fill="none" stroke={silhouetteFill} strokeWidth="2" />
          </g>

          {/* Central peak (kept below mosque) */}
          <path d="M600 200 L600 145 L650 125 L700 145 L700 200 Z" />

          {/* Mosque - anchored to ground (baseline y=200) */}
          <g
            className="pointer-events-auto"
            onMouseEnter={() => setHoveredBuilding('mosque')}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            <image
              href={mosqueSilhouette}
              x={mosqueX}
              y={mosqueY}
              width={mosqueW}
              height={mosqueH}
              preserveAspectRatio="xMidYMax meet"
            />
          </g>
        </motion.g>

        {/* Continue main silhouette layer */}
        <motion.g fill={silhouetteFill} style={{ y: foregroundY }}>
          {/* Modern modular house complex (small, lower than mosque) */}
          <g
            className="pointer-events-auto"
            onMouseEnter={() => setHoveredBuilding('modern1')}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            <rect x="920" y="175" width="45" height="25" />
            <path d="M918 175 L942 160 L968 175 Z" />
          </g>

          {/* Another barnhouse (small) */}
          <g
            className="pointer-events-auto"
            onMouseEnter={() => setHoveredBuilding('barnhouse2')}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            <path d="M1020 200 L1020 178 L1045 165 L1070 178 L1070 200 Z" />
          </g>

          {/* Cypress trees - tall narrow shape */}
          <ellipse cx="1120" cy="175" rx="6" ry="25" opacity="0.9" />
          <ellipse cx="1138" cy="178" rx="5" ry="22" opacity="0.8" />

          {/* Peak right side (kept below mosque) */}
          <path d="M1175 200 L1175 160 L1215 140 L1255 160 L1255 200 Z" />

          {/* Final modern house (small) */}
          <g
            className="pointer-events-auto"
            onMouseEnter={() => setHoveredBuilding('final')}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            <path d="M1320 200 L1320 178 L1355 165 L1390 178 L1390 200 Z" />
          </g>

          {/* Ending hill */}
          <path d="M1400 200 L1400 188 Q1420 183 1440 185 L1440 200 Z" />
        </motion.g>

        {/* Illuminated windows - with glow effect */}
        <motion.g style={{ y: foregroundY }}>
          {/* Left barnhouse window - center of house */}
          <motion.rect
            x="63" y="182" width="6" height="8"
            fill={goldenGlow}
            filter={hoveredBuilding === 'barnhouse1' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            initial={{ opacity: 0.3 }}
            animate={{ 
              opacity: hoveredBuilding === 'barnhouse1' ? 1 : [0.6, 0.9, 0.6],
              fill: hoveredBuilding === 'barnhouse1' ? goldenGlowBright : goldenGlow
            }}
            transition={{ duration: hoveredBuilding === 'barnhouse1' ? 0.3 : 3, repeat: hoveredBuilding === 'barnhouse1' ? 0 : Infinity, ease: "easeInOut" }}
          />
          
          {/* Modular house windows - centered in house body */}
          <motion.rect
            x="143" y="178" width="6" height="8"
            fill={goldenGlow}
            filter={hoveredBuilding === 'modular1' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'modular1' ? 1 : [0.7, 1, 0.7]
            }}
            transition={{ duration: hoveredBuilding === 'modular1' ? 0.3 : 4, repeat: hoveredBuilding === 'modular1' ? 0 : Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.rect
            x="156" y="178" width="6" height="8"
            fill={goldenGlow}
            filter={hoveredBuilding === 'modular1' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'modular1' ? 1 : [0.5, 0.8, 0.5]
            }}
            transition={{ duration: hoveredBuilding === 'modular1' ? 0.3 : 3.5, repeat: hoveredBuilding === 'modular1' ? 0 : Infinity, ease: "easeInOut", delay: 1 }}
          />
          
          {/* A-frame window - centered in cabin */}
          <motion.rect
            x="413" y="166" width="10" height="14"
            fill={goldenGlow}
            filter={hoveredBuilding === 'aframe' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'aframe' ? 1 : [0.6, 0.95, 0.6]
            }}
            transition={{ duration: hoveredBuilding === 'aframe' ? 0.3 : 4, repeat: hoveredBuilding === 'aframe' ? 0 : Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          
          {/* Yurt door glow - centered in yurt */}
          <motion.rect
            x="518" y="180" width="12" height="14" rx="6"
            fill={goldenGlow}
            filter={hoveredBuilding === 'yurt' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'yurt' ? 1 : [0.4, 0.7, 0.4]
            }}
            transition={{ duration: hoveredBuilding === 'yurt' ? 0.3 : 5, repeat: hoveredBuilding === 'yurt' ? 0 : Infinity, ease: "easeInOut" }}
          />
          
          {/* Mosque windows - aligned to the mosque image box */}
          <motion.rect
            x={mosqueDoor.x}
            y={mosqueDoor.y}
            width={mosqueDoor.w}
            height={mosqueDoor.h}
            rx={mosqueDoor.rx}
            fill={goldenGlow}
            filter={hoveredBuilding === 'mosque' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{
              opacity: hoveredBuilding === 'mosque' ? 1 : [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: hoveredBuilding === 'mosque' ? 0.3 : 5,
              repeat: hoveredBuilding === 'mosque' ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.rect
            x={minaretWinLeft.x}
            y={minaretWinLeft.y}
            width={minaretWinLeft.w}
            height={minaretWinLeft.h}
            rx={minaretWinLeft.rx}
            fill={goldenGlow}
            filter={hoveredBuilding === 'mosque' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{
              opacity: hoveredBuilding === 'mosque' ? 1 : [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: hoveredBuilding === 'mosque' ? 0.3 : 4,
              repeat: hoveredBuilding === 'mosque' ? 0 : Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />

          <motion.rect
            x={minaretWinRight.x}
            y={minaretWinRight.y}
            width={minaretWinRight.w}
            height={minaretWinRight.h}
            rx={minaretWinRight.rx}
            fill={goldenGlow}
            filter={hoveredBuilding === 'mosque' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{
              opacity: hoveredBuilding === 'mosque' ? 1 : [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: hoveredBuilding === 'mosque' ? 0.3 : 4.5,
              repeat: hoveredBuilding === 'mosque' ? 0 : Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          
          {/* Modern house windows - inside rect body */}
          <motion.rect
            x="932" y="180" width="8" height="12"
            fill={goldenGlow}
            filter={hoveredBuilding === 'modern1' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'modern1' ? 1 : [0.7, 1, 0.7]
            }}
            transition={{ duration: hoveredBuilding === 'modern1' ? 0.3 : 3, repeat: hoveredBuilding === 'modern1' ? 0 : Infinity, ease: "easeInOut", delay: 0.8 }}
          />
          <motion.rect
            x="948" y="180" width="8" height="12"
            fill={goldenGlow}
            filter={hoveredBuilding === 'modern1' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'modern1' ? 1 : [0.5, 0.85, 0.5]
            }}
            transition={{ duration: hoveredBuilding === 'modern1' ? 0.3 : 4, repeat: hoveredBuilding === 'modern1' ? 0 : Infinity, ease: "easeInOut", delay: 1.5 }}
          />
          
          {/* Barnhouse2 window - centered in body */}
          <motion.rect
            x="1038" y="182" width="8" height="10"
            fill={goldenGlow}
            filter={hoveredBuilding === 'barnhouse2' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'barnhouse2' ? 1 : [0.65, 0.95, 0.65]
            }}
            transition={{ duration: hoveredBuilding === 'barnhouse2' ? 0.3 : 4, repeat: hoveredBuilding === 'barnhouse2' ? 0 : Infinity, ease: "easeInOut", delay: 0.7 }}
          />
          
          {/* Final house windows - centered in body */}
          <motion.rect
            x="1348" y="182" width="7" height="9"
            fill={goldenGlow}
            filter={hoveredBuilding === 'final' ? "url(#hoverGlow)" : "url(#windowGlow)"}
            animate={{ 
              opacity: hoveredBuilding === 'final' ? 1 : [0.6, 0.9, 0.6]
            }}
            transition={{ duration: hoveredBuilding === 'final' ? 0.3 : 3, repeat: hoveredBuilding === 'final' ? 0 : Infinity, ease: "easeInOut", delay: 1.2 }}
          />
          <motion.rect
            x="1362" y="182" width="7" height="9"
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
            { cx: 400, cy: 55, delay: 1 },
            { cx: 550, cy: 35, delay: 1.5 },
            { cx: 720, cy: 45, delay: 2 },
            { cx: 900, cy: 50, delay: 0.3 },
            { cx: 1050, cy: 40, delay: 0.8 },
            { cx: 1200, cy: 48, delay: 1.3 },
            { cx: 1350, cy: 38, delay: 1.8 },
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

        {/* Bottom fill to prevent gap (moves with foreground parallax) */}
        <motion.rect
          x="0"
          y="199"
          width="1440"
          height="10"
          fill={silhouetteFill}
          style={{ y: foregroundY }}
        />
      </svg>
    </div>
  );
}
