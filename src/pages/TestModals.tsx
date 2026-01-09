/**
 * /test-modals — Testing new V2 catalog with simplified UX
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Smartphone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import CatalogAppViewV2 from "@/components/landing/CatalogAppViewV2";

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
            Каталог V2 — Упрощённый UX
          </h1>
          <p className="text-warm-white/60 max-w-2xl mx-auto">
            Тестовая версия с улучшенной навигацией. Изменения:
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
                  <span>Справа только 2 кнопки: <strong className="text-white">Фото</strong> и <strong className="text-white">План</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Внизу 3 чёткие кнопки: <strong className="text-white">Каталог</strong>, <strong className="text-white">Связаться</strong>, <strong className="text-white">Заявка</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span><strong className="text-white">Связаться</strong> раскрывает выбор: Звонок, WA, TG</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Кнопка <strong className="text-white">Заявка</strong> без иконки TG, симметричная</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Кнопки выглядят как кнопки, а не как теги</span>
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
            <CatalogAppViewV2
              onClose={() => setOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
