import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
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

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Ответы на вопросы
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            Частые вопросы
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl px-6 border border-border"
              >
                <AccordionTrigger className="text-left font-display font-semibold hover:text-primary hover:no-underline py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
