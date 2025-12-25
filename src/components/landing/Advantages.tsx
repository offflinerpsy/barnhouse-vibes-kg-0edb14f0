import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { HouseDrawingAnimation } from "./HouseDrawingAnimation";
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

const PulsingDot = () => (
  <motion.div
    className="absolute -right-2 -top-2 w-3 h-3 rounded-full bg-primary"
    animate={{
      scale: [1, 1.3, 1],
      opacity: [0.7, 1, 0.7],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const FloatingLine = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
    initial={{ scaleX: 0, opacity: 0 }}
    animate={{ 
      scaleX: [0, 1, 0],
      opacity: [0, 0.5, 0],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    style={{ top: `${30 + delay * 15}%` }}
  />
);

export function Advantages() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });

  return (
    <section id="advantages" className="py-24 md:py-32 bg-charcoal relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary/3 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10" ref={containerRef}>
        {/* Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span 
            className="inline-block text-primary font-medium text-sm uppercase tracking-[0.2em] mb-4"
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Почему ERA Concept
          </motion.span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-warm-white">
            Что делает нас{" "}
            <span className="text-gradient-gold">особенными</span>
          </h2>
        </motion.div>

        {/* Main content: Animation + Advantages */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* House Drawing Animation - Left side on desktop */}
          <motion.div
            className="lg:col-span-5 flex items-center justify-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full">
              <motion.p
                className="text-warm-gray/80 text-sm text-center mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Проектируем и строим на вашем участке
              </motion.p>
              <HouseDrawingAnimation />
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
                  className="relative bg-gradient-to-br from-warm-white/5 to-warm-white/[0.02] backdrop-blur-sm rounded-xl p-5 md:p-6 border border-warm-white/10 overflow-hidden h-full"
                  whileHover={{ 
                    borderColor: "hsl(32 42% 59% / 0.3)",
                    y: -4,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Floating lines animation */}
                  <FloatingLine delay={index * 0.5} />
                  
                  {/* Number with animation */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <motion.div
                        className="text-4xl md:text-5xl font-bold text-primary/20 font-display"
                        animate={isInView ? {
                          opacity: [0.1, 0.25, 0.1],
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
                      <PulsingDot />
                    </div>
                    
                    {/* Highlight badge */}
                    <motion.span
                      className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
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
                    className="text-warm-gray leading-relaxed text-xs md:text-sm"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    {item.description}
                  </motion.p>

                  {/* Animated corner accent */}
                  <motion.div
                    className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-primary/30 rounded-br-lg"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.4,
                      }}
                    />
                  </motion.div>

                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 rounded-xl pointer-events-none"
                    whileHover={{
                      background: "linear-gradient(135deg, hsl(32 42% 59% / 0.05) 0%, transparent 50%, hsl(32 42% 59% / 0.08) 100%)",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
