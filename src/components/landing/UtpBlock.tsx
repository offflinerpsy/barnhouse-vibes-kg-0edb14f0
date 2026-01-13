"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, Sun, Shield, Maximize2, ChevronLeft, ChevronRight } from "lucide-react"

const benefits = [
  {
    id: "control",
    icon: Eye,
    title: "Контроль",
    description: "Строим дом прямо на вашем участке, вы видите каждый этап и качество сборки без скрытых работ.",
    image: "/utp/barnhouse-construction-kyrgyzstan-mountains-workers.webp",
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

const AUTOPLAY_INTERVAL = 5000

export function UtpBlock() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % benefits.length)
    setProgress(0)
  }, [])

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + benefits.length) % benefits.length)
    setProgress(0)
  }

  const goToSlide = (index: number) => {
    setActiveIndex(index)
    setProgress(0)
  }

  useEffect(() => {
    if (isPaused) return

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide()
          return 0
        }
        return prev + 100 / (AUTOPLAY_INTERVAL / 50)
      })
    }, 50)

    return () => clearInterval(progressInterval)
  }, [isPaused, nextSlide])

  const activeBenefit = benefits[activeIndex]
  const Icon = activeBenefit.icon

  return (
    <section id="benefits" className="py-16 md:py-24 px-4 bg-[#EBE6DD]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            className="text-primary text-sm uppercase tracking-[0.2em] mb-4 block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Почему ERA Concept
          </motion.span>
          <motion.h2
            className="text-3xl md:text-5xl font-light text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Преимущества модульных домов
          </motion.h2>
        </div>

        {/* Slider */}
        <motion.div
          className="relative bg-white rounded-3xl overflow-hidden shadow-xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-[4/3] md:aspect-auto md:h-[450px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBenefit.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <img
                    src={activeBenefit.image}
                    alt={activeBenefit.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/20" />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <div className="absolute bottom-4 left-4 flex gap-2 z-10">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBenefit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Icon */}
                  <div className="relative inline-block mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-primary/30"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
                    />
                  </div>

                  {/* Number */}
                  <div className="text-primary text-sm font-medium mb-3">
                    0{activeIndex + 1} — {activeBenefit.title}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-light text-foreground mb-4">{activeBenefit.title}</h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed text-lg">{activeBenefit.description}</p>
                </motion.div>
              </AnimatePresence>

              {/* Progress Dots */}
              <div className="flex gap-3 mt-8">
                {benefits.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className="relative h-1 flex-1 max-w-[60px] bg-[#EBE6DD] rounded-full overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: index === activeIndex ? `${progress}%` : index < activeIndex ? "100%" : "0%",
                      }}
                      transition={{ duration: 0.05, ease: "linear" }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
