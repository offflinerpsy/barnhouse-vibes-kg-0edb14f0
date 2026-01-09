import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Phone, MessageCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import logoEra from "@/assets/logo-era.png";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const contactMethods = [
  { id: "phone", label: "Телефон", icon: Phone },
  { id: "telegram", label: "Telegram", icon: MessageCircle },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
];

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  // iOS Safari fix: Get portal container after mount and lock body scroll when open
  useEffect(() => {
    const container = document.getElementById("portal-root") || document.body;
    setPortalContainer(container);
  }, []);

  // Lock body scroll when modal is open (iOS Safari compatible)
  useEffect(() => {
    if (open) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      // iOS Safari needs this
      (document.body.style as any).webkitOverflowScrolling = 'touch';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      (document.body.style as any).webkitOverflowScrolling = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  }, [open]);

  const toggleMethod = (methodId: string) => {
    setSelectedMethods((prev) =>
      prev.includes(methodId)
        ? prev.filter((id) => id !== methodId)
        : [...prev, methodId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedMethods.length === 0) {
      toast({
        title: "Выберите способ связи",
        description: "Пожалуйста, выберите хотя бы один способ связи",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Заявка отправлена!",
      description: "Мы свяжемся с вами в ближайшее время",
    });

    setName("");
    setPhone("");
    setMessage("");
    setSelectedMethods([]);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  // Don't render if not open or no container
  if (!open || !portalContainer) return null;

  const modalContent = (
    <>
      {/* Custom gold gradient overlay - CRITICAL: z-[9999] for iOS Safari stacking context escape */}
      <div 
        className="fixed inset-0 bg-gradient-to-br from-[hsl(var(--charcoal))]/90 via-[hsl(var(--gold-dark))]/40 to-[hsl(var(--charcoal))]/95 backdrop-blur-sm animate-in fade-in-0 duration-300"
        style={{ 
          zIndex: 9999,
          // iOS Safari: force new stacking context at root level
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
          isolation: 'isolate'
        }}
        onClick={() => onOpenChange(false)}
      />

      {/* Modal content with animation - scrollable for mobile */}
      <div 
        className="fixed inset-0 flex items-start justify-center overflow-y-auto overscroll-contain"
        style={{ 
          zIndex: 9999,
          paddingTop: "env(safe-area-inset-top, 16px)", 
          paddingBottom: "env(safe-area-inset-bottom, 16px)",
          // iOS Safari: force GPU layer
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)'
        }}
      >
          <div className="w-full max-w-lg px-4 py-4 my-auto min-h-fit">
            <div
              className="relative bg-gradient-to-br from-[hsl(var(--gold))] via-[hsl(var(--gold-dark))] to-[hsl(var(--gold))] p-[2px] rounded-2xl animate-in fade-in-0 zoom-in-90 duration-500 ease-out"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px",
              }}
            >
              <div className="relative bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] rounded-2xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-radial from-white/20 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-radial from-white/10 to-transparent rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />

              {/* Close button */}
              <button
                onClick={() => onOpenChange(false)}
                className="absolute right-4 top-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:rotate-90 duration-300"
              >
                <X className="h-5 w-5 text-white" />
              </button>

              {/* Header with company logo - compact for mobile */}
              <div className="relative px-5 pt-6 pb-4 text-center">
                <div className="mx-auto mb-3 w-fit rounded-xl bg-white/95 p-2 shadow-lg animate-in zoom-in-50 duration-700 delay-150">
                  <img
                    src={logoEra}
                    alt="ERA Concept Home"
                    className="h-10 w-auto object-contain"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1 font-rising tracking-wide">
                  Оставить заявку
                </h2>
                <p className="text-white/70 text-xs">
                  Мы свяжемся с вами в течение 15 минут
                </p>
              </div>

              {/* Form - compact for mobile */}
              <form onSubmit={handleSubmit} className="relative px-5 pb-6">
                {/* White form container */}
                <div className="bg-white rounded-xl p-4 space-y-3 shadow-lg animate-in slide-in-from-bottom-4 duration-500 delay-200">
                  {/* Name input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">
                      Ваше имя
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Введите имя"
                      required
                      className="h-12 bg-secondary/30 border-0 font-rising text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/30 rounded-lg"
                    />
                  </div>

                  {/* Phone input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">
                      Телефон
                    </label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+996 XXX XXX XXX"
                      type="tel"
                      required
                      className="h-12 bg-secondary/30 border-0 font-rising text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/30 rounded-lg"
                    />
                  </div>

                  {/* Contact method selection with pulse animation */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">
                      Как с вами связаться? <span className="text-primary">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {contactMethods.map((method, index) => {
                        const isSelected = selectedMethods.includes(method.id);
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => toggleMethod(method.id)}
                            className={`relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all duration-300 animate-in fade-in-0 zoom-in-90 ${
                              isSelected
                                ? "bg-gradient-to-br from-primary to-[hsl(var(--gold-dark))] text-white shadow-lg scale-[1.02]"
                                : "bg-secondary/50 text-foreground/70 hover:bg-secondary hover:scale-[1.01]"
                            }`}
                            style={{
                              animationDelay: `${300 + index * 100}ms`,
                              animationFillMode: 'backwards'
                            }}
                          >
                            {/* Pulse animation ring */}
                            <span 
                              className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                                isSelected ? 'opacity-100' : 'opacity-0'
                              }`}
                            >
                              <span className="absolute inset-0 rounded-xl animate-[pulse-ring_2s_ease-out_infinite] bg-primary/30" />
                            </span>
                            
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50 duration-200">
                                <CheckCircle className="w-4 h-4 text-primary" />
                              </div>
                            )}
                            <method.icon className={`w-5 h-5 relative z-10 ${isSelected ? 'animate-[subtle-bounce_0.5s_ease-out]' : ''}`} />
                            <span className="text-xs font-medium relative z-10">{method.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message textarea */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">
                      Сообщение <span className="text-muted-foreground text-xs">(необязательно)</span>
                    </label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Расскажите какой проект вам больше подходит..."
                      rows={3}
                      className="bg-secondary/30 border-0 font-rising text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/30 rounded-lg resize-none"
                    />
                  </div>
                </div>

                {/* Submit button - text only, no icon */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 mt-4 bg-white hover:bg-white/90 text-[hsl(var(--gold-dark))] font-rising font-bold text-base tracking-wide rounded-xl shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl disabled:opacity-70 animate-in slide-in-from-bottom-2 duration-500 delay-300"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      Отправляем...
                    </span>
                  ) : (
                    <span>Отправить заявку</span>
                  )}
                </Button>

                {/* Privacy note */}
                <p className="text-center text-white/60 text-[10px] mt-3">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Custom keyframes for pulse animation */}
      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.2;
          }
          100% {
            transform: scale(1);
            opacity: 0.4;
          }
        }
        @keyframes subtle-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </>
  );

  // CRITICAL: Use createPortal to render OUTSIDE any stacking context
  // This ensures modal appears above catalog even when locked with position:fixed
  return createPortal(modalContent, portalContainer);
}
