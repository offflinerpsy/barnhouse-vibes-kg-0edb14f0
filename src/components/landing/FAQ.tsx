/**
 * =============================================================================
 * FAQ SECTION - Частые вопросы с иконками
 * =============================================================================
 * 
 * ID: #faq
 * 
 * Содержит:
 * - Аккордеон с иконками для каждого вопроса
 * - 7 вопросов и ответов
 * - Номера вопросов (01, 02...)
 * - Анимированные иконки
 * - CTA блок "Связаться с нами"
 * 
 * Источник: v0-faq-section-block/faq-variant-accordion.tsx
 * =============================================================================
 */

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, Clock, LayoutGrid, TreePine, Truck, ShieldCheck, Landmark, Thermometer } from "lucide-react"
import { useHaptic } from "@/hooks/useHaptic"

interface FAQItem {
  question: string
  answer: string
  icon: React.ElementType
}

const faqData: FAQItem[] = [
  {
    question: "Сколько времени занимает производство модульного дома?",
    answer:
      "Срок производства зависит от сложности проекта и составляет от 2 до 8 недель. Мини-дома (до 35м²) изготавливаются за 2-3 недели, стандартные проекты — 4-6 недель, премиум-класс — до 8 недель. Монтаж на участке занимает всего 2-5 дней.",
    icon: Clock,
  },
  {
    question: "Можно ли изменить планировку выбранного проекта?",
    answer:
      "Да, мы адаптируем любой проект под ваши пожелания. Можно изменить расположение комнат, добавить или убрать окна, изменить отделку. Индивидуальный проект с нуля также возможен — наши архитекторы разработают дом специально для вас.",
    icon: LayoutGrid,
  },
  {
    question: "Какие материалы используются при строительстве?",
    answer:
      "Мы используем только сертифицированные материалы: каркас из сухой строганной древесины или ЛСТК, утеплитель — минеральная вата или PIR-плиты, фасад — планкен, HPL-панели или штукатурка. Все материалы экологичны и безопасны для здоровья.",
    icon: TreePine,
  },
  {
    question: "Как осуществляется доставка и монтаж?",
    answer:
      "Модули доставляются на специальном транспорте. Мы работаем по всему Кыргызстану — стоимость доставки зависит от расстояния. Монтаж выполняет наша бригада с использованием автокрана. Сборка дома занимает 2-5 дней в зависимости от проекта.",
    icon: Truck,
  },
  {
    question: "Какая гарантия предоставляется на дом?",
    answer:
      "Мы даём гарантию 5 лет на несущие конструкции и 2 года на инженерные системы и отделку. При соблюдении правил эксплуатации срок службы модульного дома составляет более 50 лет.",
    icon: ShieldCheck,
  },
  {
    question: "Нужен ли фундамент для модульного дома?",
    answer:
      "Да, для установки дома необходим фундамент. В большинстве случаев подходят винтовые сваи — это быстрый и экономичный вариант. Также можно использовать ленточный или плитный фундамент. Мы поможем выбрать оптимальный вариант для вашего участка.",
    icon: Landmark,
  },
  {
    question: "Можно ли жить в модульном доме круглый год?",
    answer:
      "Безусловно! Наши дома рассчитаны на круглогодичное проживание в климате Кыргызстана. Толщина утепления стен — от 150мм, крыши — от 200мм. Дома тёплые зимой и прохладные летом, энергоэффективность соответствует современным стандартам.",
    icon: Thermometer,
  },
]

function FAQAccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FAQItem
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  const Icon = item.icon

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      layout
    >
      {/* Header Button */}
      <button
        onClick={onToggle}
        className="w-full p-5 md:p-6 flex items-center gap-4 text-left hover:bg-[#F5F2ED]/50 transition-colors"
        aria-expanded={isOpen}
      >
        {/* Number */}
        <div className="hidden md:flex w-10 h-10 rounded-full bg-primary/10 items-center justify-center shrink-0">
          <span className="text-primary font-medium text-sm">0{index + 1}</span>
        </div>

        {/* Icon with animation */}
        <motion.div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
            isOpen ? "bg-primary" : "bg-[#EBE6DD]"
          }`}
          animate={
            isOpen
              ? {
                  scale: [1, 1.05, 1],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: isOpen ? Infinity : 0,
            repeatType: "reverse",
          }}
        >
          <Icon className={`w-5 h-5 transition-colors duration-300 ${isOpen ? "text-white" : "text-[#5C5549]"}`} />
        </motion.div>

        {/* Title */}
        <h3 className="flex-1 text-base md:text-lg font-medium text-foreground leading-tight pr-2">{item.question}</h3>

        {/* Toggle Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
            isOpen ? "bg-primary" : "bg-[#EBE6DD]"
          }`}
        >
          {isOpen ? (
            <Minus className={`w-4 h-4 ${isOpen ? "text-white" : "text-[#5C5549]"}`} />
          ) : (
            <Plus className="w-4 h-4 text-[#5C5549]" />
          )}
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="px-5 md:px-6 pb-6 pt-0">
              <div className="flex gap-4">
                {/* Gold accent line */}
                <motion.div
                  className="hidden md:block w-0.5 bg-gradient-to-b from-primary to-primary/20 rounded-full ml-[4.25rem]"
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  transition={{ duration: 0.5 }}
                />

                <p className="text-sm md:text-base text-muted-foreground leading-relaxed flex-1">{item.answer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0)
  const { haptic } = useHaptic()

  return (
    <section id="faq" className="py-16 md:py-24 px-4 bg-[#F5F2ED]/50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.span
            className="text-primary text-sm uppercase tracking-[0.2em] mb-4 block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ответы на вопросы
          </motion.span>
          <motion.h2
            className="text-3xl md:text-5xl font-light text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Частые вопросы
          </motion.h2>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <FAQAccordionItem
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => { haptic(); setOpenIndex(openIndex === index ? -1 : index); }}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground text-sm md:text-base mb-6">Не нашли ответ на свой вопрос?</p>
          <button className="bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] h-12 px-8 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-primary/20">
            Связаться с нами
          </button>
        </motion.div>
      </div>
    </section>
  )
}
