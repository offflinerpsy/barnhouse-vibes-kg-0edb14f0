import { useState } from "react";
import { X, Phone, Send, MessageCircle, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogPortal,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const contactMethods = [
  { id: "phone", label: "Телефон", icon: Phone },
  { id: "telegram", label: "Telegram", icon: Send },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
];

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        {/* Custom gold gradient overlay */}
        <div 
          className="fixed inset-0 z-50 bg-gradient-to-br from-[hsl(var(--charcoal))]/90 via-[hsl(var(--gold-dark))]/40 to-[hsl(var(--charcoal))]/95 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          onClick={() => onOpenChange(false)}
        />

        {/* Modal content */}
        <div className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-full max-w-lg px-4">
          <div
            className="relative bg-gradient-to-br from-[hsl(var(--gold))] via-[hsl(var(--gold-dark))] to-[hsl(var(--gold))] p-[2px] rounded-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] duration-300"
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

              {/* Header */}
              <div className="relative px-6 pt-8 pb-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Оставить заявку
                </h2>
                <p className="text-white/80 text-sm">
                  Мы свяжемся с вами в течение 15 минут
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="relative px-6 pb-8">
                {/* White form container */}
                <div className="bg-white rounded-xl p-5 space-y-4 shadow-lg">
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

                  {/* Contact method selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">
                      Как с вами связаться? <span className="text-primary">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {contactMethods.map((method) => {
                        const isSelected = selectedMethods.includes(method.id);
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => toggleMethod(method.id)}
                            className={`relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all duration-300 ${
                              isSelected
                                ? "bg-gradient-to-br from-primary to-[hsl(var(--gold-dark))] text-white shadow-lg scale-[1.02]"
                                : "bg-secondary/50 text-foreground/70 hover:bg-secondary hover:scale-[1.01]"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                                <CheckCircle className="w-4 h-4 text-primary" />
                              </div>
                            )}
                            <method.icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{method.label}</span>
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
                      placeholder="Расскажите о вашем проекте..."
                      rows={3}
                      className="bg-secondary/30 border-0 font-rising text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/30 rounded-lg resize-none"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 mt-5 bg-white hover:bg-white/90 text-[hsl(var(--gold-dark))] font-bold text-lg rounded-xl shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl disabled:opacity-70 group"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      Отправляем...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Отправить заявку
                      <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </Button>

                {/* Privacy note */}
                <p className="text-center text-white/60 text-xs mt-4">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </form>
            </div>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
