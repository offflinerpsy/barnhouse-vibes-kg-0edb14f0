import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import logoGold from "@/assets/logo-gold.svg";

const navItems = [
  { label: "Каталог", href: "#catalog" },
  { label: "Преимущества", href: "#advantages" },
  { label: "Этапы работы", href: "#stages" },
  { label: "FAQ", href: "#faq" },
  { label: "Контакты", href: "#contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md py-2"
          : "bg-white/95 backdrop-blur-sm py-3"
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Top bar with contacts - visible on desktop */}
        <div className={`hidden lg:flex items-center justify-between text-sm border-b border-border/50 pb-2 mb-2 transition-all ${isScrolled ? 'h-0 opacity-0 overflow-hidden pb-0 mb-0 border-0' : 'h-auto opacity-100'}`}>
          <div className="flex items-center gap-6 text-muted-foreground">
            <span>г. Бишкек, Кыргызстан</span>
            <span>Пн-Сб: 9:00 - 18:00</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/996700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              WhatsApp
            </a>
            <a
              href="https://t.me/eraconcepthome"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Telegram
            </a>
            <a
              href="https://instagram.com/eraconcepthome"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* Main header row */}
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 flex-shrink-0">
            <img
              src={logoGold}
              alt="ERA Concept Home"
              className="h-10 lg:h-12 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side - Phone & CTA */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <a
              href="tel:+996700000000"
              className="flex flex-col items-end"
            >
              <span className="text-base lg:text-lg font-semibold text-foreground hover:text-primary transition-colors">
                +996 700 000 000
              </span>
              <span className="text-xs text-muted-foreground">Бесплатная консультация</span>
            </a>
            <Button
              onClick={() => scrollToSection("#contact")}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 hidden xl:flex"
            >
              Оставить заявку
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-6 w-6 text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[350px] bg-white p-0">
              <div className="flex flex-col h-full">
                {/* Mobile header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <img
                    src={logoGold}
                    alt="ERA Concept Home"
                    className="h-10 w-auto"
                  />
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-6 w-6" />
                    </Button>
                  </SheetClose>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 py-4">
                  {navItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => scrollToSection(item.href)}
                      className="w-full text-left px-6 py-4 text-lg font-medium text-foreground hover:bg-secondary/50 hover:text-primary transition-colors border-b border-border/30"
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                {/* Mobile footer */}
                <div className="p-6 bg-secondary/30 border-t border-border">
                  <a
                    href="tel:+996700000000"
                    className="flex items-center gap-3 mb-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">+996 700 000 000</div>
                      <div className="text-xs text-muted-foreground">Бесплатная консультация</div>
                    </div>
                  </a>
                  <Button
                    onClick={() => scrollToSection("#contact")}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-12"
                  >
                    Оставить заявку
                  </Button>

                  {/* Social links */}
                  <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-border/50">
                    <a
                      href="https://wa.me/996700000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      WhatsApp
                    </a>
                    <span className="text-border">•</span>
                    <a
                      href="https://t.me/eraconcepthome"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Telegram
                    </a>
                    <span className="text-border">•</span>
                    <a
                      href="https://instagram.com/eraconcepthome"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
