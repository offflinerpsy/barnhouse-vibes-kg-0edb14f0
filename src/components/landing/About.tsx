/**
 * =============================================================================
 * ABOUT SECTION - О компании
 * =============================================================================
 * 
 * ID: #about
 * 
 * Содержит:
 * - Изображение производства
 * - Заголовок и описание компании
 * - Список преимуществ с чекбоксами
 * - Плашка "50+ проектов"
 * 
 * =============================================================================
 */

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

// Список преимуществ компании
const features = [
  "Собственное производство в Бишкеке",
  "Более 50 реализованных проектов",
  "Команда профессионалов с опытом 10+ лет",
  "Гарантия на конструкцию 5 лет",
  "Использование экологичных материалов",
  "Работаем по всему Кыргызстану",
];

// Анимации
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2076&auto=format&fit=crop"
                alt="ERA Concept Home производство"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <motion.div
              className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground rounded-2xl p-6 shadow-xl hidden md:block"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-4xl font-display font-bold">50+</div>
              <div className="text-sm opacity-90">реализованных проектов</div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.span
              className="text-primary font-medium text-sm uppercase tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              О компании
            </motion.span>
            <motion.h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              ERA Concept Home
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-lg leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Мы создаём современные модульные дома, которые сочетают в себе 
              скандинавский дизайн, экологичность и практичность. Наша цель — 
              сделать качественное жильё доступным для каждой семьи.
            </motion.p>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  variants={itemVariants}
                >
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
