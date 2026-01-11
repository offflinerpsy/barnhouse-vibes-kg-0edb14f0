/**
 * =============================================================================
 * INDEX PAGE - Главная страница ERA Concept Home
 * =============================================================================
 * 
 * Структура страницы (секции):
 * - Header: Навигация и шапка сайта (фиксированная)
 * - Hero: Главный экран с заголовком и слайдером
 * - Stages: Этапы работы (#stages)
 * - Catalog: Каталог домов (#catalog)
 * - Advantages: Преимущества компании (#advantages)
 * - FAQ: Частые вопросы (#faq)
 * - Contact: Контактная форма (#contact)
 * - Footer: Подвал сайта (#footer)
 * 
 * =============================================================================
 */

import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Advantages } from "@/components/landing/Advantages";
import { Gallery } from "@/components/landing/Gallery";
import { Catalog } from "@/components/landing/Catalog";
import { UtpBlock } from "@/components/landing/UtpBlock";
import { Stages } from "@/components/landing/Stages";
import { FAQ } from "@/components/landing/FAQ";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden max-w-full md:snap-none snap-y snap-proximity overflow-y-auto">
      {/* ============================================
          HEADER - Фиксированная навигация
          Содержит: логотип, меню, контакты, CTA
          ============================================ */}
      <Header />

      {/* ============================================
          HERO SECTION - Главный экран
          ID: нет (первый экран)
          Содержит: заголовок, подзаголовок, CTA, слайдер
          ============================================ */}
      <Hero />

      {/* ============================================
          STAGES SECTION - Этапы работы
          ID: #stages
          Содержит: 5 этапов от консультации до заселения
          ============================================ */}
      <Stages />

      {/* ============================================
          CATALOG SECTION - Каталог домов
          ID: #catalog
          Содержит: фильтры, карточки домов, модалка деталей
          ============================================ */}
      <Catalog />

      {/* ============================================
          UTP BLOCK - Преимущества модульных домов
          ID: #benefits
          Содержит: авто-слайдер с 4 преимуществами
          ============================================ */}
      <UtpBlock />

      {/* ============================================
          ADVANTAGES SECTION - Преимущества
          ID: #advantages
          Содержит: 4 преимущества, карусель изображений
          ============================================ */}
      <Advantages />

      {/* ============================================
          GALLERY SECTION - Галерея работ
          ID: #gallery
          Содержит: bento-grid, видео, Ken Burns эффект
          ============================================ */}
      <Gallery />

      {/* ============================================
          FAQ SECTION - Частые вопросы
          ID: #faq
          Содержит: аккордеон с иконками, 7 вопросов
          ============================================ */}
      <FAQ />

      {/* ============================================
          CONTACT SECTION - Контакты
          ID: #contact
          Содержит: форма, контакты, мессенджеры
          ============================================ */}
      <Contact />

      {/* ============================================
          FOOTER - Подвал сайта
          ID: #footer
          Содержит: логотип, навигация, контакты, соцсети
          ============================================ */}
      <Footer />

      {/* Компонент уведомлений */}
      <Toaster />
    </div>
  );
};

export default Index;
