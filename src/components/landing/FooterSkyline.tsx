import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import mosqueSilhouette from "@/assets/mosque-silhouette.svg";

type FooterSkylineVariant = "attached" | "standalone";

export function FooterSkyline({
  variant = "attached",
}: {
  variant?: FooterSkylineVariant;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Parallax transforms for background layers only
  const backgroundY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const midY = useTransform(scrollYProgress, [0, 1], [10, -10]);

  // Skyline palette
  const silhouetteFill = "hsl(36 31% 18%)";

  // Mosque sizing and positioning
  // SVG viewBox is 1024x1024, but the mosque art's bottom edge is at y≈882
  // So the actual art height from top (142) to bottom (882) is about 740px
  // We scale the mosque to be the DOMINANT element in the skyline
  const mosqueW = 260;
  const mosqueH = 203;
  const mosqueX = 720 - mosqueW / 2; // Always centered at x=720
  // The mosque SVG has ~14% empty space at the bottom (882/1024 ≈ 0.86)
  // So we need to shift it down to compensate: mosqueH * 0.14 ≈ 28
  const mosqueY = 200 - mosqueH + 28;

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

        {/* Main silhouette layer - STATIC, no parallax for stability */}
        <g fill={silhouetteFill}>
          {/* Left side - Small barnhouse */}
          <path d="M50 200 L50 178 L70 168 L90 178 L90 200 Z" />

          {/* Left modular house with pitched roof */}
          <path d="M130 200 L130 175 L150 162 L170 175 L170 200 Z" />

          {/* Linden/deciduous trees */}
          <ellipse cx="210" cy="190" rx="10" ry="14" opacity="0.8" />
          <ellipse cx="230" cy="192" rx="8" ry="12" opacity="0.7" />

          {/* Peak left */}
          <path d="M270 200 L270 155 L305 130 L340 155 L340 200 Z" />

          {/* Modern A-frame cabin - moved left to make room for mosque */}
          <path d="M380 200 L380 175 L410 158 L440 175 L440 200 Z" />

          {/* Traditional Kyrgyz yurt silhouette - moved left */}
          <path d="M480 200 L480 185 Q480 175 505 172 Q530 175 530 185 L530 200 Z" />
          <path d="M492 172 L505 166 L518 172" fill="none" stroke={silhouetteFill} strokeWidth="2" />

          {/* MOSQUE - Centered and dominant */}
          <image
            href={mosqueSilhouette}
            x={mosqueX}
            y={mosqueY}
            width={mosqueW}
            height={mosqueH}
            preserveAspectRatio="xMidYMax meet"
          />

          {/* Peak right of mosque - moved right to make room */}
          <path d="M920 200 L920 155 L955 130 L990 155 L990 200 Z" />

          {/* Modern modular house complex */}
          <rect x="1020" y="175" width="45" height="25" />
          <path d="M1018 175 L1042 160 L1068 175 Z" />

          {/* Another barnhouse */}
          <path d="M1120 200 L1120 178 L1145 165 L1170 178 L1170 200 Z" />

          {/* Cypress trees */}
          <ellipse cx="1220" cy="175" rx="6" ry="25" opacity="0.9" />
          <ellipse cx="1238" cy="178" rx="5" ry="22" opacity="0.8" />

          {/* Peak right side */}
          <path d="M1275 200 L1275 160 L1315 140 L1355 160 L1355 200 Z" />

          {/* Final modern house */}
          <path d="M1380 200 L1380 178 L1410 168 L1440 178 L1440 200 Z" />
        </g>

        {/* Bottom fill to prevent gap - STATIC */}
        <rect x="0" y="199" width="1440" height="5" fill={silhouetteFill} />

        {/* Stars in the sky area */}
        <g>
          {[
            { cx: 100, cy: 60, delay: 0 },
            { cx: 250, cy: 40, delay: 0.5 },
            { cx: 400, cy: 55, delay: 1 },
            { cx: 550, cy: 35, delay: 1.5 },
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
      </svg>
    </div>
  );
}