import { Clock, Shield, Home, Wrench } from "lucide-react";

const advantages = [
  {
    icon: Clock,
    title: "Быстрое производство",
    description: "Изготовление модульного дома занимает от 2 до 8 недель в зависимости от проекта",
  },
  {
    icon: Shield,
    title: "Гарантия качества",
    description: "Используем только сертифицированные материалы с гарантией от 5 лет",
  },
  {
    icon: Home,
    title: "Под ключ",
    description: "Полный цикл работ: от проекта до готового дома с внутренней отделкой",
  },
  {
    icon: Wrench,
    title: "Индивидуальный проект",
    description: "Адаптируем любой проект под ваши пожелания и особенности участка",
  },
];

export function Advantages() {
  return (
    <section id="advantages" className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Почему мы
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            Наши преимущества
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {advantages.map((item, index) => (
            <div
              key={index}
              className="group bg-card rounded-xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <item.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
