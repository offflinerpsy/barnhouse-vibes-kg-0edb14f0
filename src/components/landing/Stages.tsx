import { useState, useEffect } from "react";
import { MessageSquare, FileText, Factory, Hammer, Check } from "lucide-react";

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
];

export function Stages() {
  const [activeStage, setActiveStage] = useState(0);
  const [progress, setProgress] = useState(0);

  // Auto-cycle through stages with smooth progress
  useEffect(() => {
    const cycleDuration = 4000; // 4 seconds per stage
    const progressInterval = 50; // Update progress every 50ms
    const progressStep = (progressInterval / cycleDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStage((current) => (current + 1) % stages.length);
          return 0;
        }
        return prev + progressStep;
      });
    }, progressInterval);

    return () => clearInterval(timer);
  }, []);

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

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          {/* Progress Track */}
          <div className="relative mb-12">
            {/* Background Track */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 rounded-full" />
            
            {/* Active Progress */}
            <div 
              className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${(activeStage / (stages.length - 1)) * 100 + (progress / 100) * (100 / (stages.length - 1))}%`,
                maxWidth: '100%'
              }}
            />

            {/* Stage Dots */}
            <div className="relative flex justify-between">
              {stages.map((stage, index) => {
                const isActive = index === activeStage;
                const isCompleted = index < activeStage;
                const Icon = stage.icon;

                return (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveStage(index);
                      setProgress(0);
                    }}
                    className="group flex flex-col items-center"
                  >
                    {/* Circle */}
                    <div
                      className={`
                        relative w-16 h-16 rounded-full flex items-center justify-center
                        transition-all duration-500 ease-out cursor-pointer
                        ${isCompleted 
                          ? 'bg-primary scale-100' 
                          : isActive 
                            ? 'bg-primary scale-110 shadow-lg shadow-primary/30' 
                            : 'bg-card border-2 border-border hover:border-primary/50'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Check className="w-7 h-7 text-primary-foreground" />
                      ) : (
                        <Icon className={`w-7 h-7 transition-colors duration-300 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary'}`} />
                      )}
                      
                      {/* Pulse animation for active */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
                      )}
                    </div>

                    {/* Label */}
                    <span className={`
                      mt-4 text-sm font-medium transition-colors duration-300
                      ${isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'}
                    `}>
                      {stage.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Stage Content */}
          <div className="max-w-2xl mx-auto">
            <div 
              key={activeStage}
              className="bg-card rounded-2xl p-8 border border-border shadow-sm animate-fade-up"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  {(() => {
                    const Icon = stages[activeStage].icon;
                    return <Icon className="w-7 h-7 text-primary" />;
                  })()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">
                      Этап {stages[activeStage].step}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {stages[activeStage].duration}
                    </span>
                  </div>
                  <h3 className="text-heading-lg font-medium text-foreground mb-2">
                    {stages[activeStage].title}
                  </h3>
                  <p className="text-body-md text-muted-foreground leading-relaxed">
                    {stages[activeStage].description}
                  </p>
                </div>
              </div>

              {/* Mini progress bar */}
              <div className="mt-6 h-1 bg-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout - Vertical Timeline */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            
            {/* Animated Progress Line */}
            <div 
              className="absolute left-6 top-0 w-0.5 bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ 
                height: `${((activeStage + progress / 100) / stages.length) * 100}%` 
              }}
            />

            {/* Stages */}
            <div className="space-y-8">
              {stages.map((stage, index) => {
                const isActive = index === activeStage;
                const isCompleted = index < activeStage;
                const Icon = stage.icon;

                return (
                  <div 
                    key={index}
                    className={`
                      relative pl-16 transition-all duration-500
                      ${isActive ? 'opacity-100' : 'opacity-60'}
                    `}
                    onClick={() => {
                      setActiveStage(index);
                      setProgress(0);
                    }}
                  >
                    {/* Circle */}
                    <div
                      className={`
                        absolute left-0 w-12 h-12 rounded-full flex items-center justify-center
                        transition-all duration-500 ease-out
                        ${isCompleted 
                          ? 'bg-primary' 
                          : isActive 
                            ? 'bg-primary scale-110 shadow-lg shadow-primary/30' 
                            : 'bg-card border-2 border-border'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-primary-foreground" />
                      ) : (
                        <Icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                      )}
                      
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`
                      bg-card rounded-xl p-5 border transition-all duration-300
                      ${isActive ? 'border-primary/30 shadow-sm' : 'border-border'}
                    `}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-primary uppercase tracking-wider">
                          Этап {stage.step}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {stage.duration}
                        </span>
                      </div>
                      <h3 className="text-heading-sm font-medium text-foreground mb-1">
                        {stage.title}
                      </h3>
                      <p className="text-body-sm text-muted-foreground">
                        {stage.description}
                      </p>
                      
                      {/* Progress bar for active stage */}
                      {isActive && (
                        <div className="mt-3 h-0.5 bg-border rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-100 ease-linear"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
