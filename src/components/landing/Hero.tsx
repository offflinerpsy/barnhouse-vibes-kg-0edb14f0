import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/50 to-charcoal/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium animate-fade-up">
            Модульные дома под ключ
          </span>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Создаём пространство
            <span className="block text-primary mt-2">для жизни</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            ERA Concept Home — модульные барнхаусы и современные дома для всей семьи. 
            Быстрое производство, высокое качество, доступные цены.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button
              size="lg"
              onClick={() => scrollToSection("#catalog")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 group"
            >
              Смотреть каталог
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/30 text-white hover:bg-white/10 hover:text-white text-lg px-8 py-6"
            >
              <a href="https://wa.me/996700000000" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-white/60" />
          </div>
        </div>
      </div>
    </section>
  );
}
