/**
 * =============================================================================
 * UTP VARIANT C - Аккордеон с выезжающими картинками
 * =============================================================================
 * 
 * ID: #benefits-accordion
 * 
 * Содержит:
 * - Аккордеон УТП (4 преимущества)
 * - Выезжающие картинки при открытии
 * - Анимированные статистики
 * - Plus/Minus toggle иконки
 * 
 * =============================================================================
 */

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, Sun, Shield, Maximize2, Plus, Minus } from "lucide-react"

const benefits = [
  {
    id: "control",
    icon: Eye,
    title: "Контроль",
    description: "Строим дом прямо на вашем участке, вы видите каждый этап и качество сборки без скрытых работ.",
    image: "/utp/barnhouse-construction-kyrgyzstan-mountains-workers.jpg",
  },
  {
    id: "climate",
    icon: Sun,
    title: "Климат",
    description:
      "Энергоэффективная конструкция под климат Кыргызстана: прохлада летом и тепло зимой при меньших затратах.",
    image: "/utp/barnhouse-panoramic-windows-tian-shan-summer.jpg",
  },
  {
    id: "reliability",
    icon: Shield,
    title: "Надёжность",
    description:
      "Сухая строганая древесина и точная сборка защищают дом от усадки и деформаций, с комплексной гарантией на конструктив.",
    image: "/utp/premium-timber-construction-materials-barnhouse.jpg",
  },
  {
    id: "aesthetics",
    icon: Maximize2,
    title: "Эстетика",
    description:
      "Скандинавский стиль с панорамным остеклением, который объединяет с природой и делает дом растущим в цене активом.",
    image: "/utp/scandinavian-barnhouse-kyrgyzstan-nature-panoramic.jpg",
  },
]

export function UTPVariantC() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="benefits-accordion" className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.span
            className="text-[#C3996B] text-sm uppercase tracking-[0.2em] mb-4 block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Почему ERA Concept
          </motion.span>
          <motion.h2
            className="text-3xl md:text-5xl font-light text-[#2A2622]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Преимущества модульных домов
          </motion.h2>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            const isOpen = index === openIndex

            return (
              <motion.div
                key={benefit.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                {/* Header Button */}
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full p-6 flex items-center gap-4 text-left hover:bg-[#F5F2ED]/50 transition-colors"
                >
                  {/* Number */}
                  <div className="hidden md:flex w-12 h-12 rounded-full bg-[#C3996B]/10 items-center justify-center shrink-0">
                    <span className="text-[#C3996B] font-medium">0{index + 1}</span>
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                      isOpen ? "bg-[#C3996B]" : "bg-[#EBE6DD]"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors duration-300 ${isOpen ? "text-white" : "text-[#5C5549]"}`}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="flex-1 text-lg md:text-xl font-medium text-[#2A2622]">{benefit.title}</h3>

                  {/* Toggle Icon */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-8 h-8 rounded-full bg-[#EBE6DD] flex items-center justify-center shrink-0"
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-[#5C5549]" />
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
                      <div className="grid md:grid-cols-2 gap-6 p-6 pt-0">
                        {/* Description */}
                        <div className="flex flex-col justify-center">
                          <p className="text-[#5C5549] leading-relaxed text-lg mb-6">{benefit.description}</p>

                          {/* Animated Stats */}
                          <div className="flex gap-8">
                            <motion.div
                              animate={{ y: [0, -3, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <div className="text-3xl font-light text-[#C3996B]">100%</div>
                              <div className="text-sm text-[#5C5549]">Прозрачность</div>
                            </motion.div>
                            <motion.div
                              animate={{ y: [0, -3, 0] }}
                              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                            >
                              <div className="text-3xl font-light text-[#C3996B]">5 лет</div>
                              <div className="text-sm text-[#5C5549]">Гарантия</div>
                            </motion.div>
                          </div>
                        </div>

                        {/* Image */}
                        <motion.div
                          className="relative aspect-[16/10] rounded-xl overflow-hidden"
                          initial={{ x: 30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <img
                            src={benefit.image || "/placeholder.svg"}
                            alt={benefit.title}
                            className="w-full h-full object-cover"
                          />

                          {/* Shine Effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
