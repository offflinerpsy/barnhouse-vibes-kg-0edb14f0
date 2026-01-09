# ERA Concept Home (Кыргызстан) — Полная архитектура проекта

> Исчерпывающая документация для AI-ассистента и разработчиков.
> Разобрано до последнего винтика.

---

## ⛔ КРИТИЧНО: GIT РЕПОЗИТОРИЙ

| Статус | Репозиторий | URL |
|--------|-------------|-----|
| ✅ **ОСНОВНОЙ** | barnhouse-vibes-kg-0edb14f0 | `https://github.com/offflinerpsy/barnhouse-vibes-kg-0edb14f0` |
| ❌ **НЕ ИСПОЛЬЗОВАТЬ** | barnhouse-vibes-kg | `https://github.com/offflinerpsy/barnhouse-vibes-kg` |

```bash
# Проверить текущий remote:
git remote -v

# Должно показывать:
# origin  https://github.com/offflinerpsy/barnhouse-vibes-kg-0edb14f0.git (fetch/push)

# ВСЕГДА пушить только так:
git push origin main
```

---

## 📋 Общее описание

| Параметр | Значение |
|----------|----------|
| **Тип** | Landing page (SPA) |
| **Бизнес** | Продажа модульных домов в Кыргызстане |
| **Стек** | React 18.3 + TypeScript 5.8 + Vite 5.4 |
| **UI** | Tailwind CSS 3.4 + shadcn/ui (Radix UI) |
| **Анимации** | Framer Motion 12.x |
| **PDF** | react-pdf 10.x (планировки домов) |
| **Dev URL** | `http://localhost:8080` |
| **Prod URL** | `https://era-home.kg` |
| **Компания** | ERA Concept Home, г. Бишкек |

---

## 📁 Полная структура проекта

```
barnhouse-vibes-kg/
│
├── 📄 КОНФИГУРАЦИОННЫЕ ФАЙЛЫ (корень)
│   ├── package.json              # Зависимости и скрипты
│   ├── package-lock.json         # Lockfile
│   ├── bun.lockb                 # Bun lockfile (альтернатива)
│   ├── vite.config.ts            # ⚙️ Сборка, чанки, алиасы
│   ├── tailwind.config.ts        # 🎨 Цвета, шрифты, брейкпоинты
│   ├── tsconfig.json             # TypeScript базовый
│   ├── tsconfig.app.json         # TypeScript для приложения
│   ├── tsconfig.node.json        # TypeScript для Node
│   ├── postcss.config.js         # PostCSS (Tailwind + Autoprefixer)
│   ├── eslint.config.js          # ESLint правила
│   ├── components.json           # shadcn/ui конфигурация
│   ├── index.html                # 📄 HTML точка входа + SEO мета
│   └── nginx-optimized.conf      # 🌐 Nginx конфиг для продакшена
│
├── 📚 ДОКУМЕНТАЦИЯ
│   ├── ARCHITECTURE.md           # ← Этот файл
│   ├── DESIGN_SYSTEM.md          # Дизайн-система (цвета, типографика)
│   ├── CATALOG_GUIDE.md          # Гайд по моделям домов
│   ├── FOOTER_STYLE_GUIDE.md     # Стили футера
│   └── README.md                 # Базовый README (от Lovable)
│
├── 📂 .vscode/
│   └── mcp.json                  # 🤖 MCP серверы для AI
│
├── 📂 .github/
│   └── copilot-instructions.md   # 📋 Инструкции для Copilot
│
├── 📂 .memory/
│   ├── memory.jsonl              # 🧠 База знаний (MCP Memory)
│   └── INIT_MEMORY.md            # Начальные данные для памяти
│
├── 📂 public/                    # Статика (не обрабатывается Vite)
│   ├── favicon.ico               # Иконка сайта
│   ├── og-image.jpg              # OpenGraph изображение
│   ├── robots.txt                # SEO robots
│   ├── placeholder.svg           # Плейсхолдер
│   │
│   ├── 📂 fonts/                 # 🔤 Шрифт Rising Sun
│   │   ├── risingsun-medium.woff2
│   │   ├── risingsun-medium.woff
│   │   └── risingsun-medium.ttf
│   │
│   ├── 📂 catalog/               # 🏠 ИЗОБРАЖЕНИЯ ДОМОВ
│   │   ├── model-1-18/           # Model 1 (18м²)
│   │   │   ├── gallery/          # 1.webp, 2.webp, ...
│   │   │   ├── gallery-extra/    # Дополнительные
│   │   │   └── floor-plan/       # plan-1.webp, plan-1.pdf, ...
│   │   ├── model-1-36/           # Model 2 (36м²)
│   │   ├── model-1-54/           # Model 3 (54м²)
│   │   ├── model-1-81/           # Model 4 (81м²)
│   │   ├── model-1-108/          # Model 6 (108м²)
│   │   ├── model-1-135/          # Model 8 (135м²)
│   │   ├── model-2-36/           # Model 2X (36м² дуплекс)
│   │   ├── model-2-72/           # Model 4X (72м² дуплекс)
│   │   ├── model-2-120/          # Model 7X (120м² дуплекс)
│   │   └── model-2-204/          # Model 12X (204м² дуплекс)
│   │
│   └── 📂 utp/                   # Изображения для UTP блока
│       ├── barnhouse-construction-kyrgyzstan-mountains-workers.jpg
│       ├── barnhouse-panoramic-windows-tian-shan-summer.jpg
│       ├── premium-timber-construction-materials-barnhouse.jpg
│       └── scandinavian-barnhouse-kyrgyzstan-nature-panoramic.jpg
│
├── 📂 scripts/
│   └── optimize-images.js        # 🖼️ Скрипт оптимизации (sharp)
│
├── 📂 dist/                      # Билд (генерируется)
│
└── 📂 src/                       # 💻 ИСХОДНЫЙ КОД
    │
    ├── main.tsx                  # 🚀 Точка входа React
    ├── App.tsx                   # 🔀 Роутинг + провайдеры
    ├── App.css                   # (пустой)
    ├── index.css                 # 🎨 ГЛОБАЛЬНЫЕ СТИЛИ + CSS ПЕРЕМЕННЫЕ
    ├── vite-env.d.ts             # Vite типы
    │
    ├── 📂 data/                  # 📊 ДАННЫЕ
    │   └── catalog-models.ts     # ⭐ CATALOG_MODELS[] — все модели домов
    │
    ├── 📂 assets/                # Импортируемые ресурсы
    │   ├── logo-era.png          # Основной логотип
    │   ├── logo-gold.svg         # Золотой логотип
    │   ├── logo-white.svg        # Белый логотип
    │   ├── logo-modal.svg        # Логотип для модалки
    │   ├── modular-house-1.jpg   # Изображения для Advantages
    │   ├── modular-house-2.webp
    │   ├── modular-house-3.jpg
    │   ├── modular-house-4.jpg
    │   ├── modular-house-5.jpg
    │   ├── mosque-silhouette.png # Силуэт мечети (Footer)
    │   └── mosque-silhouette.svg
    │
    ├── 📂 lib/
    │   └── utils.ts              # cn() — мердж Tailwind классов
    │
    ├── 📂 hooks/
    │   ├── use-mobile.tsx        # useIsMobile() — определение <768px
    │   └── use-toast.ts          # useToast() — система уведомлений
    │
    ├── 📂 pages/
    │   ├── Index.tsx             # 📍 ГЛАВНАЯ СТРАНИЦА (композиция секций)
    │   └── NotFound.tsx          # 404 страница
    │
    └── 📂 components/
        │
        ├── NavLink.tsx           # Компонент навигации (не используется)
        │
        ├── 📂 landing/           # 🎯 СЕКЦИИ ЛЕНДИНГА
        │   ├── Header.tsx        # Шапка (фикс. навигация)
        │   ├── Hero.tsx          # Главный экран (Ken Burns слайдер)
        │   ├── Stages.tsx        # Этапы работы (5 шагов)
        │   ├── Catalog.tsx       # ⭐ КАТАЛОГ (~2000 строк!)
        │   ├── UtpBlock.tsx      # UTP преимущества (авто-слайдер)
        │   ├── Advantages.tsx    # Преимущества (blueprint стиль)
        │   ├── FAQ.tsx           # Вопросы (аккордеон)
        │   ├── Contact.tsx       # Контактная форма
        │   ├── Footer.tsx        # Подвал
        │   ├── FooterSkyline.tsx # SVG силуэт города
        │   ├── ContactModal.tsx  # Модалка заявки (золотой градиент)
        │   └── About.tsx         # О компании (не используется)
        │
        └── 📂 ui/                # 🧱 shadcn/ui (49 компонентов)
            ├── accordion.tsx
            ├── alert-dialog.tsx
            ├── button.tsx
            ├── dialog.tsx
            ├── input.tsx
            ├── sheet.tsx
            ├── toast.tsx
            ├── toaster.tsx
            └── ... (ещё 41 файл)
```

---

## 🔴 Критические файлы — уровни опасности

### 🔴 КРИТИЧЕСКИЕ (НЕ ТРОГАТЬ без понимания)

| Файл | Что ломается при изменении |
|------|---------------------------|
| [src/index.css](src/index.css) | Вся цветовая схема, шрифт Rising Sun |
| [tailwind.config.ts](tailwind.config.ts) | Кастомные цвета, брейкпоинты, типографика |
| [vite.config.ts](vite.config.ts) | Чанкинг (vendor-pdf, vendor-react), сборка |
| [src/data/catalog-models.ts](src/data/catalog-models.ts) | ⭐ **Единый источник данных** — все модели домов |
| [src/components/landing/Catalog.tsx](src/components/landing/Catalog.tsx) | UI каталога, логика галереи/PDF |
| [public/fonts/*](public/fonts/) | Шрифт Rising Sun — основа типографики |

### 🟡 ВАЖНЫЕ (требуют внимания)

| Файл | Что учитывать |
|------|---------------|
| [src/pages/Index.tsx](src/pages/Index.tsx) | Порядок секций — влияет на навигацию |
| [src/components/landing/Header.tsx](src/components/landing/Header.tsx) | navItems[] — синхронизировать с секциями |
| [src/components/landing/Footer.tsx](src/components/landing/Footer.tsx) | Контакты, навигация — дублируются |
| [src/components/landing/Contact.tsx](src/components/landing/Contact.tsx) | Контакты — дублируются |
| [index.html](index.html) | SEO мета, OG теги, WUUNU виджет |

### 🟢 БЕЗОПАСНЫЕ (можно менять свободно)

| Файл | Что можно делать |
|------|-----------------|
| `src/components/landing/*.tsx` | Тексты, стили (кроме Catalog) |
| `src/components/ui/*` | Стилизация UI компонентов |
| `public/catalog/*/gallery/*` | Добавлять/удалять изображения |
| Документация (`*.md`) | Обновлять свободно |

---

## 🎨 Дизайн-система — CSS переменные

### Основные цвета (Light Mode)

```css
/* src/index.css */

/* ===== ФОНЫ ===== */
--background: 38 25% 95%;        /* #F5F2ED — тёплый песочный */
--card: 38 22% 93%;               /* #EFEBE3 — фон карточек */
--secondary: 38 20% 90%;          /* #EBE6DD — вторичный фон */
--muted: 38 18% 91%;              /* #EAE6DE — приглушённый */

/* ===== ТЕКСТ ===== */
--foreground: 30 10% 15%;         /* #2A2622 — основной текст */
--muted-foreground: 30 8% 45%;    /* #7A7269 — вторичный текст */

/* ===== АКЦЕНТЫ ===== */
--primary: 32 42% 59%;            /* #C3996B — ЗОЛОТОЙ (главный!) */
--gold: 32 42% 59%;               /* Синоним primary */
--gold-light: 35 45% 75%;         /* Светлый (градиенты) */
--gold-dark: 30 40% 45%;          /* Тёмный (hover) */

/* ===== ТЁМНЫЕ ===== */
--charcoal: 30 15% 20%;           /* #3D3632 — Hero, Footer */

/* ===== ГРАНИЦЫ ===== */
--border: 35 18% 85%;             /* #DDD6C9 */
--ring: 32 42% 59%;               /* Фокус = gold */
```

### Использование в коде

```tsx
// ✅ Правильно — через Tailwind
className="text-primary bg-background border-border"
className="text-muted-foreground"
className="bg-charcoal text-white"

// ✅ Правильно — через HSL
className="text-[hsl(var(--gold))]"
className="bg-[hsl(var(--charcoal))]"

// ❌ ЗАПРЕЩЕНО — хардкод
className="text-[#C3996B]"  // НЕТ!
className="bg-[#3D3632]"    // НЕТ!
```

---

## 🔤 Типографика

### Шрифт Rising Sun

```css
/* src/index.css */
@font-face {
  font-family: 'Rising Sun';
  src: url('/fonts/risingsun-medium.woff2') format('woff2'),
       url('/fonts/risingsun-medium.woff') format('woff'),
       url('/fonts/risingsun-medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
```

**ВАЖНО:** Файлы шрифтов в `/public/fonts/` — не переименовывать и не удалять!

### Размеры текста (tailwind.config.ts)

| Класс | Размер | Использование |
|-------|--------|---------------|
| `text-display-xl` | 48px | Hero H1 |
| `text-display-lg` | 36px | Заголовки секций H2 |
| `text-display-md` | 32px | Подзаголовки |
| `text-heading-lg` | 24px | H3 |
| `text-heading-md` | 20px | H4 |
| `text-heading-sm` | 18px | H5 |
| `text-body-lg` | 18px | Крупный текст |
| `text-body-md` | 16px | Основной текст |
| `text-body-sm` | 14px | Мелкий текст |
| `text-caption` | 12px | Подписи |

---

## 📐 Брейкпоинты

```typescript
// tailwind.config.ts
screens: {
  sm: "640px",    // Мобильный landscape
  md: "768px",    // Планшет
  lg: "1024px",   // Ноутбук
  xl: "1280px",   // Desktop
  "2xl": "1400px" // Широкий desktop
}
```

### Константа MOBILE_BREAKPOINT

```typescript
// src/hooks/use-mobile.tsx
const MOBILE_BREAKPOINT = 768;  // md
```

---

## 🏠 Система каталога домов

### Принцип именования моделей

```
Model [число]   → Одноэтажный
Model [число]X  → Двухэтажный (Duplex)

Число ≈ количество базовых модулей (1 модуль = 18м²)
```

### Таблица всех моделей

| ID | Название | Площадь | Этажи | catalogPath | galleryCount |
|----|----------|---------|-------|-------------|--------------|
| model-1 | Model 1 | 18м² | 1 | model-1-18 | 25 |
| model-2 | Model 2 | 36м² | 1 | model-1-36 | 24 |
| model-3 | Model 3 | 54м² | 1 | model-1-54 | 33 |
| model-4 | Model 4 | 81м² | 1 | model-1-81 | 34 |
| model-6 | Model 6 | 108м² | 1 | model-1-108 | 54 |
| model-8 | Model 8 | 135м² | 1 | model-1-135 | 38 |
| model-2x | Model 2X | 36м² | 2 | model-2-36 | 4 |
| model-4x | Model 4X | 72м² | 2 | model-2-72 | ? |
| model-7x | Model 7X | 120м² | 2 | model-2-120 | ? |
| model-12x | Model 12X | 204м² | 2 | model-2-204 | ? |

### Структура папки модели

```
public/catalog/model-1-18/
├── gallery/           # Основные фото
│   ├── 1.webp
│   ├── 2.webp
│   └── ... (до galleryCount)
├── gallery-extra/     # Дополнительные фото
│   ├── 1.webp
│   └── ... (до galleryExtraCount)
└── floor-plan/        # Планировки
    ├── plan-1.webp    # или .pdf
    ├── plan-2.pdf
    └── ...
```

### Объект модели в коде (Catalog.tsx)

```typescript
interface HouseModel {
  id: string;                    // "model-1"
  name: string;                  // "Model 1"
  projectType: "single-floor" | "duplex";
  projectLabel: string;          // "Одноэтажный"
  area: number;                  // 18
  heatedArea: number;            // 18
  floors: number;                // 1
  rooms: number;                 // 1
  bedrooms: string;              // "студия" или "1-2"
  bathrooms: number;             // 1
  hasVeranda: boolean;
  verandaArea?: number;
  catalogPath: string;           // "model-1-18"
  galleryCount: number;          // 25
  galleryExtraCount: number;     // 4
  floorPlanFiles: FloorPlanFile[]; // [{name: "plan-1", ext: "webp"}, ...]
}
```

---

## 🧩 Секции лендинга — порядок и ID

| # | Компонент | ID якоря | Описание |
|---|-----------|----------|----------|
| 1 | Header.tsx | — | Фиксированная шапка, скрывает topbar |
| 2 | Hero.tsx | #hero | Ken Burns слайдер, статистика |
| 3 | Stages.tsx | #stages | 5 этапов (авто-переключение 4с) |
| 4 | Catalog.tsx | #catalog | ⭐ Фильтры, карточки, модалка |
| 5 | UtpBlock.tsx | #benefits | 4 преимущества (авто-слайдер 5с) |
| 6 | Advantages.tsx | #advantages | Blueprint стиль, карусель домов |
| 7 | FAQ.tsx | #faq | 7 вопросов, аккордеон с иконками |
| 8 | Contact.tsx | #contact | Форма + мессенджеры |
| 9 | Footer.tsx | #footer | Skyline SVG, контакты |

### Навигация (Header.tsx)

```typescript
const navItems = [
  { label: "Каталог", href: "#catalog" },
  { label: "Преимущества", href: "#advantages" },
  { label: "Этапы работы", href: "#stages" },
  { label: "FAQ", href: "#faq" },
  { label: "Контакты", href: "#contact" },
];
```

---

## 🔄 Жизненный цикл приложения

```
index.html
└── <div id="root">
    └── main.tsx
        └── ReactDOM.createRoot().render(<App />)
        
App.tsx
└── QueryClientProvider (React Query)
    └── TooltipProvider (Radix)
        └── Toaster (уведомления)
        └── Sonner (альтернативные уведомления)
        └── BrowserRouter
            └── Routes
                ├── "/" → <Index />
                └── "*" → <NotFound />

Index.tsx (pages/)
└── <div className="min-h-screen">
    ├── <Header />
    ├── <Hero />
    ├── <Stages />
    ├── <Catalog />        ← Загружает PDF.js worker
    ├── <UtpBlock />
    ├── <Advantages />
    ├── <FAQ />
    ├── <Contact />
    ├── <Footer />
    └── <Toaster />
```

---

## ⚡ Сборка и оптимизация (vite.config.ts)

### Чанкинг

```typescript
manualChunks: {
  "vendor-react": ["react", "react-dom"],
  "vendor-pdf": ["react-pdf", "pdfjs-dist"],  // ~500KB!
  "vendor-ui": ["framer-motion", "lucide-react"],
  "vendor-radix": [
    "@radix-ui/react-accordion",
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-scroll-area",
    "@radix-ui/react-tabs",
  ],
}
```

### Продакшн оптимизации

```typescript
minify: "terser",
terserOptions: {
  compress: {
    drop_console: true,   // Убирает console.log
    drop_debugger: true,  // Убирает debugger
  },
},
```

### PDF.js Worker

```typescript
// Catalog.tsx
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
```

---

## 📦 Ключевые зависимости

### Runtime (dependencies)

| Пакет | Версия | Назначение |
|-------|--------|------------|
| react | 18.3.1 | UI фреймворк |
| react-dom | 18.3.1 | DOM рендеринг |
| react-router-dom | 6.30.1 | Роутинг |
| @tanstack/react-query | 5.83.0 | Состояние запросов |
| framer-motion | 12.23.26 | Анимации |
| react-pdf | 10.2.0 | Просмотр PDF планировок |
| lucide-react | 0.462.0 | Иконки |
| @radix-ui/* | различные | UI примитивы (shadcn) |
| tailwind-merge | 2.6.0 | Мердж классов |
| class-variance-authority | 0.7.1 | Варианты компонентов |
| zod | 3.25.76 | Валидация форм |
| embla-carousel-react | 8.6.0 | Карусели |
| sonner | 1.7.4 | Toast уведомления |

### Dev (devDependencies)

| Пакет | Версия | Назначение |
|-------|--------|------------|
| vite | 5.4.19 | Сборщик |
| typescript | 5.8.3 | Типизация |
| tailwindcss | 3.4.17 | CSS фреймворк |
| sharp | 0.34.5 | Оптимизация изображений |
| terser | 5.44.1 | Минификация |
| lovable-tagger | 1.1.13 | Dev тулинг (Lovable) |

---

## 📞 Контакты компании (хардкод)

```
Телефон:    +996 222 001 112
WhatsApp:   wa.me/996222001112
Telegram:   @eraconcepthome
Instagram:  @eraconcepthome
Email:      info@eraconcepthome.kg
Адрес:      г. Бишкек, Ул. Байтик Баатыра 61
Часы:       Ежедневно: 10:00 - 19:00
```

**Дублируются в:** Header.tsx, Contact.tsx, Footer.tsx, ContactModal.tsx

---

## 🤖 MCP серверы

```json
// .vscode/mcp.json
{
  "servers": {
    "memory": "...",              // Память проекта
    "sequential-thinking": "...", // Пошаговые рассуждения
    "context7": "...",            // Документация библиотек ← ВАЖНО!
    "ddg-search": "..."           // Веб-поиск
  }
}
```

### Когда использовать

| Сервер | Когда |
|--------|-------|
| **Memory** | Всегда — читать контекст проекта |
| **Context7** | Код с Framer Motion, Radix, react-pdf, Tailwind |
| **Sequential Thinking** | Рефакторинг, отладка, сложные задачи |
| **DDG Search** | Внешняя информация, API документация |

---

## ✅ Правила изменений

### 🟢 БЕЗОПАСНО

- Изменять тексты и копирайтинг
- Добавлять изображения в gallery/
- Стилизовать через Tailwind классы
- Редактировать FAQ вопросы/ответы
- Обновлять документацию

### 🟡 ОСТОРОЖНО

- Менять данные в `houses[]` → проверять соответствие папкам
- Добавлять секции → обновлять navItems[]
- Менять порядок секций → проверять навигацию
- Добавлять CSS переменные → использовать палитру

### 🔴 ОПАСНО / ЗАПРЕЩЕНО

- ❌ Хардкодить цвета (`#C3996B`) — использовать переменные
- ❌ Менять структуру CSS переменных в index.css
- ❌ Удалять/переименовывать файлы шрифтов
- ❌ Менять catalogPath без переименования папок
- ❌ Удалять конфиг чанков в vite.config.ts
- ❌ Редактировать ui/ компоненты без причины

---

## 📝 Чеклисты

### Добавление новой модели дома

1. ☐ Создать папку `/public/catalog/model-X-YY/`
2. ☐ Создать подпапки: `gallery/`, `gallery-extra/`, `floor-plan/`
3. ☐ Загрузить .webp изображения с нумерацией (1.webp, 2.webp...)
4. ☐ В Catalog.tsx добавить объект в `houses[]`
5. ☐ Заполнить все поля: id, name, area, catalogPath, counts, floorPlanFiles
6. ☐ Проверить открытие карточки и PDF планировок

### Добавление новой секции

1. ☐ Создать компонент в `src/components/landing/`
2. ☐ Добавить ID для навигации (`id="section-name"`)
3. ☐ Добавить JSDoc комментарий с описанием
4. ☐ Импортировать в `pages/Index.tsx`
5. ☐ Добавить в правильное место в композиции
6. ☐ Добавить пункт в `navItems[]` (Header.tsx)
7. ☐ Добавить в навигацию Footer.tsx (если нужно)

### Изменение контактов

1. ☐ Обновить в Header.tsx (телефон, соцсети)
2. ☐ Обновить в Contact.tsx (телефон, адрес, мессенджеры)
3. ☐ Обновить в Footer.tsx (телефон, email, адрес, соцсети)
4. ☐ Обновить в ContactModal.tsx (если нужно)
5. ☐ Обновить ARCHITECTURE.md

---

## 🔗 Связанные файлы

- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — Детальная дизайн-система
- [CATALOG_GUIDE.md](CATALOG_GUIDE.md) — Гайд по моделям
- [FOOTER_STYLE_GUIDE.md](FOOTER_STYLE_GUIDE.md) — Стили футера
- [.github/copilot-instructions.md](.github/copilot-instructions.md) — Инструкции для AI

---

*Последнее обновление: Январь 2026*
*Разобрано до винтика для ERA Concept Home KG*
