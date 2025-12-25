import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Home, Clock, Shield, Sparkles } from "lucide-react";
import { ContactModal } from "./ContactModal";

const stats = [
  { value: "150+", label: "Домов построено", icon: Home },
  { value: "14", label: "Дней на сборку", icon: Clock },
  { value: "10", label: "Лет гарантии", icon: Shield },
];

const floatingElements = [
  { size: 300, x: "10%", y: "20%", delay: 0 },
  { size: 200, x: "80%", y: "60%", delay: 0.5 },
  { size: 150, x: "70%", y: "15%", delay: 1 },
  { size: 100, x: "15%", y: "70%", delay: 1.5 },
];

export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const titleWords = ["Создаём", "дома,", "в", "которых", "хочется", "жить"];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal">
      {/* Animated background gradient orbs */}
      {floatingElements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl"
          style={{
            width: el.size,
            height: el.size,
            left: el.x,
            top: el.y,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 15,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Background image with parallax effect */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/80 to-charcoal" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              Модульные дома нового поколения
            </span>
          </motion.div>

          {/* Animated title */}
          <h1 className="font-rising text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center mb-8 leading-tight">
            {titleWords.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.1 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`inline-block mr-[0.25em] ${
                  index >= 4 ? "text-primary" : "text-white"
                }`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle with stagger */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl lg:text-2xl text-white/70 text-center max-w-2xl mx-auto mb-12"
          >
            Барнхаусы и современные модульные дома с установкой за 2 недели. 
            Энергоэффективность класса A+.
          </motion.p>

          {/* Single powerful CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex justify-center mb-20"
          >
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="group relative px-10 py-5 rounded-full bg-primary text-charcoal font-bold text-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary via-gold to-primary"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ width: "200%" }}
              />
              <span className="relative z-10 flex items-center gap-2">
                Получить расчёт стоимости
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </motion.div>

          {/* Stats with stagger animation */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 1.2,
                },
              },
            }}
            className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="group text-center p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
              >
                <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-2xl md:text-4xl font-bold text-white mb-1 font-rising">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollToSection("#about")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-white/80 transition-colors cursor-pointer"
      >
        <span className="text-xs uppercase tracking-widest">Узнать больше</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      <ContactModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
}
