import { MessageSquare, FileText, Factory, Hammer } from "lucide-react";

const stages = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Консультация",
    description: "Обсуждаем ваши пожелания, выбираем проект и рассчитываем стоимость",
  },
  {
    icon: FileText,
    step: "02",
    title: "Проектирование",
    description: "Разрабатываем или адаптируем проект под ваши требования и участок",
  },
  {
    icon: Factory,
    step: "03",
    title: "Производство",
    description: "Изготавливаем модули на нашем производстве с контролем качества",
  },
  {
    icon: Hammer,
    step: "04",
    title: "Монтаж",
    description: "Доставляем и собираем дом на вашем участке за 2-5 дней",
  },
];

export function Stages() {
  return (
    <section id="stages" className="py-20 md:py-28 bg-charcoal text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Как мы работаем
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-3">
            Этапы работы
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stages.map((stage, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < stages.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-primary/30" />
              )}

              <div className="relative z-10 text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 mb-6">
                  <stage.icon className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -top-2 -left-2 lg:left-auto lg:right-0 lg:-top-2 text-6xl font-display font-bold text-primary/20">
                  {stage.step}
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">
                  {stage.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {stage.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
