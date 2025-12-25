import { CheckCircle } from "lucide-react";

const features = [
  "Собственное производство в Бишкеке",
  "Более 50 реализованных проектов",
  "Команда профессионалов с опытом 10+ лет",
  "Гарантия на конструкцию 5 лет",
  "Использование экологичных материалов",
  "Работаем по всему Кыргызстану",
];

export function About() {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2076&auto=format&fit=crop"
                alt="ERA Concept Home производство"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground rounded-2xl p-6 shadow-xl hidden md:block">
              <div className="text-4xl font-display font-bold">50+</div>
              <div className="text-sm opacity-90">реализованных проектов</div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              О компании
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              ERA Concept Home
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Мы создаём современные модульные дома, которые сочетают в себе 
              скандинавский дизайн, экологичность и практичность. Наша цель — 
              сделать качественное жильё доступным для каждой семьи.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
