/**
 * /test-modals — Testing new V2 catalog with simplified UX
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Smartphone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import CatalogAppView from "@/components/landing/CatalogAppView";

export default function TestModals() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-charcoal">
      <div className="sticky top-0 z-40 bg-charcoal/95 backdrop-blur-sm border-b border-warm-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-warm-white/70 hover:text-warm-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Назад на главную</span>
            </Link>
            <span className="text-xs text-warm-white/40 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              V2 тест
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-warm-white mb-3 font-rising">
            Каталог V2 — iPhone-стиль UX
          </h1>
          <p className="text-warm-white/60 max-w-2xl mx-auto">
            Тестовая версия с интуитивным интерфейсом в стиле iPhone:
          </p>
        </div>

        <div className="mx-auto max-w-md">
          <div className="relative bg-charcoal/40 rounded-2xl border border-warm-white/10 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-gold-light" />
            <div className="p-6">
              <h2 className="text-xl font-bold text-warm-white mb-4">
                Что изменилось:
              </h2>

              <ul className="space-y-3 mb-6 text-sm text-warm-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span><strong className="text-white">Анимированные кнопки</strong> справа — текст меняется каждые 2 сек: «Фото» → «Смотреть фото»</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span><strong className="text-white">Иконки крутятся</strong> — привлекают внимание как страницы перелистываются</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span><strong className="text-white">Каталог + фильтр вместе</strong> — показывает текущую модель, нажми чтобы выбрать</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Внизу <strong className="text-white">2 кнопки как в iPhone</strong>: Позвонить и Сообщение</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span><strong className="text-white">Позвонить</strong> раскрывает выбор: Звонок, WA, TG</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span><strong className="text-white">Сообщение</strong> открывает модалку с формой заявки</span>
                </li>
              </ul>

              <Button
                onClick={() => setOpen(true)}
                className="w-full h-12 rounded-xl bg-primary text-charcoal font-semibold"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Открыть каталог V2
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <CatalogAppView
              onClose={() => setOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
