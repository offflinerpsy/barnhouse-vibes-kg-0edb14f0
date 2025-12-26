import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react";
import logoWhite from "@/assets/logo-white.svg";
import { FooterSkyline } from "./FooterSkyline";

export function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-charcoal text-white pt-24 pb-16">
      {/* Skyline silhouette */}
      <FooterSkyline />
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <img
              src={logoWhite}
              alt="ERA Concept Home"
              className="h-20 md:h-24 w-auto mb-6"
            />
            <p className="text-white/70 leading-relaxed max-w-md mb-6 text-base">
              ERA Concept Home — ваш надёжный партнёр в создании современного 
              модульного жилья. Мы делаем мечту о собственном доме доступной.
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/996700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-500/20 hover:scale-110 transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/eraconcepthome"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-500/20 hover:scale-110 transition-all duration-300"
              >
                <Send className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/eraconcepthome"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-500/20 hover:scale-110 transition-all duration-300"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5 text-primary">Навигация</h4>
            <nav className="space-y-3">
              {[
                { label: "Каталог", href: "#catalog" },
                { label: "Преимущества", href: "#advantages" },
                { label: "Этапы работы", href: "#stages" },
                { label: "FAQ", href: "#faq" },
                { label: "Контакты", href: "#contact" },
              ].map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="block text-white/70 hover:text-primary hover:translate-x-1 transition-all duration-300"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5 text-primary">Контакты</h4>
            <div className="space-y-4">
              <a
                href="tel:+996700000000"
                className="flex items-center gap-3 text-white/70 hover:text-primary transition-colors group"
              >
                <Phone className="h-5 w-5 group-hover:scale-110 transition-transform" />
                +996 700 000 000
              </a>
              <a
                href="mailto:info@eraconcepthome.kg"
                className="flex items-center gap-3 text-white/70 hover:text-primary transition-colors group"
              >
                <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                info@eraconcepthome.kg
              </a>
              <div className="flex items-start gap-3 text-white/70">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>г. Бишкек, Кыргызстан</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} ERA Concept Home. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
