/**
 * =============================================================================
 * STAGES SECTION - Этапы работы
 * =============================================================================
 * 
 * ID: #stages
 * 
 * Содержит:
 * - 5 этапов: Консультация → Проектирование → Производство → Монтаж → Заселение
 * - Автоматическое переключение каждые 4 секунды
 * - Desktop: горизонтальная сетка карточек
 * - Mobile: вертикальный стек
 * - CTA кнопка "Начать консультацию"
 * 
 * =============================================================================
 */

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, FileText, Factory, Hammer, Home } from "lucide-react";

// Данные этапов работы
const stages = [
  {
    icon: MessageSquare,
    step: 1,
    title: "Консультация",
    description: "Обсуждаем ваши пожелания, выбираем проект и рассчитываем стоимость",
    duration: "1-2 дня",
  },
  {
    icon: FileText,
    step: 2,
    title: "Проектирование",
    description: "Разрабатываем или адаптируем проект под ваши требования и участок",
    duration: "3-7 дней",
  },
  {
    icon: Factory,
    step: 3,
    title: "Производство",
    description: "Изготавливаем модули на нашем производстве с контролем качества",
    duration: "2-8 недель",
  },
  {
    icon: Hammer,
    step: 4,
    title: "Монтаж",
    description: "Доставляем и собираем дом на вашем участке",
    duration: "2-5 дней",
  },
  {
    icon: Home,
    step: 5,
    title: "Заселение",
    description: "Ваш новый барнхаус готов — добро пожаловать домой!",
    duration: "Навсегда",
    isFinal: true,
  },
];

export function Stages() {
  const [activeStage, setActiveStage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextStage = useCallback(() => {
    setActiveStage((prev) => (prev + 1) % stages.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(nextStage, 4000);
    return () => clearInterval(interval);
  }, [isPaused, nextStage]);

  const handleStageClick = (index: number) => {
    setActiveStage(index);
  };

  return (
    <section id="stages" className="py-20 md:py-28 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Как мы работаем
          </span>
          <h2 className="text-display-lg md:text-display-xl font-medium text-foreground">
            Путь к вашему дому
          </h2>
        </div>

        {/* Desktop Layout - Cards Grid */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-4 xl:gap-6">
          {stages.map((stage, index) => {
            const isActive = index === activeStage;
            const isCompleted = index < activeStage;
            const Icon = stage.icon;
            const isFinal = stage.isFinal;

            return (
              <div
                key={index}
                className="relative"
                onClick={() => handleStageClick(index)}
                onMouseEnter={() => isActive && setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {/* Card */}
                <div
                  className={`
                    relative h-full p-5 xl:p-6 rounded-2xl cursor-pointer
                    transition-all duration-700 ease-out
                    ${isFinal 
                      ? isActive 
                        ? 'bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary shadow-xl shadow-primary/20 scale-[1.02]' 
                        : isCompleted
                          ? 'bg-primary/10 border border-primary/40'
                          : 'bg-card/40 border border-border/30 hover:border-border/50'
                      : isActive 
                        ? 'bg-card border border-primary/40 shadow-lg shadow-primary/10 scale-[1.02]' 
                        : isCompleted
                          ? 'bg-card/80 border border-primary/20'
                          : 'bg-card/50 border border-border/30 hover:border-border/50 hover:bg-card/70'
                    }
                  `}
                >
                  {/* Step Badge */}
                  <div
                    className={`
                      inline-flex items-center justify-center w-8 h-8 rounded-full mb-4
                      text-sm font-medium transition-all duration-500
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : isCompleted
                          ? 'bg-primary/70 text-primary-foreground'
                          : 'bg-muted/60 text-muted-foreground'
                      }
                    `}
                  >
                    {stage.step}
                  </div>

                  {/* Icon */}
                  <div
                    className={`
                      w-12 h-12 xl:w-14 xl:h-14 rounded-xl mb-4
                      flex items-center justify-center
                      transition-all duration-500
                      ${isFinal
                        ? isActive
                          ? 'bg-primary text-primary-foreground'
                          : isCompleted
                            ? 'bg-primary/60 text-primary-foreground'
                            : 'bg-muted/40 text-muted-foreground/60'
                        : isActive 
                          ? 'bg-primary/15 text-primary' 
                          : isCompleted
                            ? 'bg-primary/10 text-primary/70'
                            : 'bg-muted/30 text-muted-foreground/50'
                      }
                    `}
                  >
                    <Icon className={`w-6 h-6 xl:w-7 xl:h-7 ${isFinal && isActive ? 'animate-bounce' : ''}`} />
                  </div>

                  {/* Title */}
                  <h3
                    className={`
                      text-base xl:text-lg font-medium mb-2
                      transition-colors duration-500
                      ${isActive 
                        ? 'text-foreground' 
                        : isCompleted
                          ? 'text-foreground/80'
                          : 'text-foreground/50'
                      }
                    `}
                  >
                    {stage.title}
                  </h3>

                  {/* Duration */}
                  <span
                    className={`
                      text-xs font-medium mb-2 block
                      transition-colors duration-500
                      ${isActive || isCompleted ? 'text-primary' : 'text-primary/40'}
                    `}
                  >
                    {stage.duration}
                  </span>

                  {/* Description */}
                  <p
                    className={`
                      text-sm leading-relaxed
                      transition-all duration-500
                      ${isActive 
                        ? 'text-muted-foreground' 
                        : 'text-muted-foreground/50'
                      }
                    `}
                  >
                    {stage.description}
                  </p>

                  {/* Active Glow Effect */}
                  {isActive && !isFinal && (
                    <div className="absolute inset-0 rounded-2xl bg-primary/5 animate-pulse pointer-events-none" />
                  )}

                  {/* Final Stage Special Glow */}
                  {isFinal && isActive && (
                    <div className="absolute -inset-px rounded-2xl border border-primary/50 animate-pulse pointer-events-none" />
                  )}
                </div>

                {/* Connection Indicator - Animated Dots */}
                {index < stages.length - 1 && (
                  <div className="hidden xl:flex absolute top-1/2 -right-3 items-center gap-0.5 -translate-y-1/2 z-10">
                    {[0, 1, 2].map((dot) => (
                      <div
                        key={dot}
                        className={`
                          w-1.5 h-1.5 rounded-full transition-all duration-500
                          ${isCompleted 
                            ? 'bg-primary/60' 
                            : isActive
                              ? 'bg-primary/40 animate-pulse'
                              : 'bg-border'
                          }
                        `}
                        style={{
                          animationDelay: `${dot * 200}ms`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile/Tablet Layout - Stack Cards */}
        <div className="lg:hidden space-y-3">
          {stages.map((stage, index) => {
            const isActive = index === activeStage;
            const isCompleted = index < activeStage;
            const Icon = stage.icon;
            const isFinal = stage.isFinal;

            return (
              <div
                key={index}
                className={`
                  relative p-4 md:p-5 rounded-xl cursor-pointer
                  transition-all duration-500 ease-out
                  ${isFinal
                    ? isActive
                      ? 'bg-gradient-to-r from-primary/15 to-primary/5 border-2 border-primary shadow-lg shadow-primary/10'
                      : isCompleted
                        ? 'bg-primary/10 border border-primary/40'
                        : 'bg-card/40 border border-border/30'
                    : isActive 
                      ? 'bg-card border border-primary/30 shadow-md' 
                      : isCompleted
                        ? 'bg-card/70 border border-primary/20'
                        : 'bg-card/40 border border-border/20'
                  }
                `}
                onClick={() => handleStageClick(index)}
                onTouchStart={() => isActive && setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon & Step */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`
                        w-12 h-12 md:w-14 md:h-14 rounded-xl
                        flex items-center justify-center
                        transition-all duration-500
                        ${isFinal
                          ? isActive
                            ? 'bg-primary text-primary-foreground'
                            : isCompleted
                              ? 'bg-primary/60 text-primary-foreground'
                              : 'bg-muted/40 text-muted-foreground/60'
                          : isActive 
                            ? 'bg-primary/15 text-primary' 
                            : isCompleted
                              ? 'bg-primary/10 text-primary/70'
                              : 'bg-muted/30 text-muted-foreground/50'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 md:w-6 md:h-6 ${isFinal && isActive ? 'animate-bounce' : ''}`} />
                    </div>
                    <div
                      className={`
                        absolute -top-1.5 -left-1.5 w-5 h-5 md:w-6 md:h-6 rounded-full
                        flex items-center justify-center text-[10px] md:text-xs font-medium
                        transition-all duration-500
                        ${isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : isCompleted
                            ? 'bg-primary/60 text-primary-foreground'
                            : 'bg-muted/70 text-muted-foreground'
                        }
                      `}
                    >
                      {stage.step}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={`
                          text-base md:text-lg font-medium
                          transition-colors duration-500
                          ${isActive 
                            ? 'text-foreground' 
                            : isCompleted
                              ? 'text-foreground/80'
                              : 'text-foreground/50'
                          }
                        `}
                      >
                        {stage.title}
                      </h3>
                      <span
                        className={`
                          text-xs font-medium
                          transition-colors duration-500
                          ${isActive || isCompleted ? 'text-primary' : 'text-primary/40'}
                        `}
                      >
                        {stage.duration}
                      </span>
                    </div>
                    <p
                      className={`
                        text-sm leading-relaxed
                        transition-all duration-500
                        ${isActive 
                          ? 'text-muted-foreground opacity-100' 
                          : 'text-muted-foreground/60 opacity-80'
                        }
                      `}
                    >
                      {stage.description}
                    </p>
                  </div>
                </div>

                {/* Left Accent Bar for Active */}
                {isActive && (
                  <div 
                    className={`
                      absolute left-0 top-0 bottom-0 w-1 rounded-l-xl
                      ${isFinal ? 'bg-primary animate-pulse' : 'bg-primary/70'}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Dots Indicator */}
        <div className="flex justify-center gap-2 mt-10">
          {stages.map((stage, index) => (
            <button
              key={index}
              onClick={() => handleStageClick(index)}
              className={`
                h-2 rounded-full transition-all duration-500
                ${index === activeStage 
                  ? stage.isFinal 
                    ? 'bg-primary w-8 animate-pulse' 
                    : 'bg-primary w-6' 
                  : index < activeStage
                    ? 'bg-primary/50 w-2'
                    : 'bg-border w-2 hover:bg-border/80'
                }
              `}
              aria-label={`Перейти к этапу ${index + 1}`}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Общий срок — от 3 недель до 3 месяцев
          </p>
          <button
            onClick={() => {
              const element = document.querySelector("#contact");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Начать консультацию
          </button>
        </div>
      </div>
    </section>
  );
}
