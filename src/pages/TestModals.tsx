/**
 * /test-modals — now only the final App-style mobile catalog preview
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Smartphone } from "lucide-react";
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
            <span className="text-xs text-warm-white/40 uppercase tracking-wider">
              превью
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-warm-white mb-3 font-rising">
            Мобильный каталог (Instagram/TikTok)
          </h1>
          <p className="text-warm-white/60 max-w-2xl mx-auto">
            Откройте и тестируйте в режиме мобильного экрана (иконка телефона над
            превью).
          </p>
        </div>

        <div className="mx-auto max-w-md">
          <div className="relative bg-charcoal/40 rounded-2xl border border-warm-white/10 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-gold-light" />
            <div className="p-6">
              <h2 className="text-xl font-bold text-warm-white mb-2">
                App‑Style Каталог
              </h2>
              <p className="text-warm-white/60 text-sm mb-5">
                Fullscreen фото, свайпы, галерея вверх, выбор модели всегда на
                виду.
              </p>

              <ul className="space-y-2 mb-6 text-sm text-warm-white/70">
                <li>• Свайп ←→ между моделями + стрелки</li>
                <li>• Свайп ↑ открывает сетку (Фото/Планировки)</li>
                <li>• Быстрая связь + форма заявки</li>
              </ul>

              <Button
                onClick={() => setOpen(true)}
                className="w-full h-12 rounded-xl bg-primary text-charcoal font-semibold"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Открыть каталог
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
