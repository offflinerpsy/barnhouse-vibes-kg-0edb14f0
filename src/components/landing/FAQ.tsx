/**
 * =============================================================================
 * FAQ SECTION - Частые вопросы (Обновленная версия)
 * =============================================================================
 * 
 * ID: #faq
 * 
 * Содержит:
 * - Кастомный аккордеон с иконками Plus/Minus
 * - 7 вопросов и ответов
 * - Stagger анимация появления
 * - CTA блок "Связаться с нами"
 * 
 * =============================================================================
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Сколько времени занимает производство модульного дома?",
    answer:
      "Срок производства зависит от сложности проекта и составляет от 2 до 8 недель. Мини-дома (до 35м²) изготавливаются за 2-3 недели, стандартные проекты — 4-6 недель, премиум-класс — до 8 недель. Монтаж на участке занимает всего 2-5 дней.",
  },
  {
    question: "Можно ли изменить планировку выбранного проекта?",
    answer:
      "Да, мы адаптируем любой проект под ваши пожелания. Можно изменить расположение комнат, добавить или убрать окна, изменить отделку. Индивидуальный проект с нуля также возможен — наши архитекторы разработают дом специально для вас.",
  },
  {
    question: "Какие материалы используются при строительстве?",
    answer:
      "Мы используем только сертифицированные материалы: каркас из сухой строганной древесины или ЛСТК, утеплитель — минеральная вата или PIR-плиты, фасад — планкен, HPL-панели или штукатурка. Все материалы экологичны и безопасны для здоровья.",
  },
  {
    question: "Как осуществляется доставка и монтаж?",
    answer:
      "Модули доставляются на специальном транспорте. Мы работаем по всему Кыргызстану — стоимость доставки зависит от расстояния. Монтаж выполняет наша бригада с использованием автокрана. Сборка дома занимает 2-5 дней в зависимости от проекта.",
  },
  {
    question: "Какая гарантия предоставляется на дом?",
    answer:
      "Мы даём гарантию 5 лет на несущие конструкции и 2 года на инженерные системы и отделку. При соблюдении правил эксплуатации срок службы модульного дома составляет более 50 лет.",
  },
  {
    question: "Нужен ли фундамент для модульного дома?",
    answer:
      "Да, для установки дома необходим фундамент. В большинстве случаев подходят винтовые сваи — это быстрый и экономичный вариант. Также можно использовать ленточный или плитный фундамент. Мы поможем выбрать оптимальный вариант для вашего участка.",
  },
  {
    question: "Можно ли жить в модульном доме круглый год?",
    answer:
      "Безусловно! Наши дома рассчитаны на круглогодичное проживание в климате Кыргызстана. Толщина утепления стен — от 150мм, крыши — от 200мм. Дома тёплые зимой и прохладные летом, энергоэффективность соответствует современным стандартам.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-[#EFEBE3] rounded-xl border border-[#DDD6C9] overflow-hidden transition-all duration-300 hover:border-primary/50"
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left transition-colors duration-300 group"
        aria-expanded={isOpen}
      >
        <span className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight flex-1">
          {item.question}
        </span>
        <span
          className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 mt-0.5 ${
            isOpen
              ? "bg-primary text-white rotate-0"
              : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
          }`}
        >
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 pt-0">
              <p className="text-sm md:text-base text-[#7A7269] leading-relaxed">{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-[#EBE6DD]/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block text-primary font-medium text-sm md:text-base uppercase tracking-wider mb-3 md:mb-4">
            Ответы на вопросы
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Частые вопросы
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-4"
        >
          {faqData.map((item, index) => (
            <FAQAccordionItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </motion.div>

        {/* CTA Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-[#7A7269] text-sm md:text-base mb-6">Не нашли ответ на свой вопрос?</p>
          <a 
            href="#contact"
            className="inline-flex bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] h-12 px-8 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-primary/20 items-center justify-center"
          >
            Связаться с нами
          </a>
        </motion.div>
      </div>
    </section>
  );
}
