# 🏠 ERA Concept Home KG

> Landing page для продажи модульных домов в Кыргызстане

[![Deploy](https://img.shields.io/badge/deploy-era--home.kg-green)](https://era-home.kg)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple)](https://vitejs.dev)

---

## 🚀 Quick Start

### Требования

- **Node.js** 18+ ([скачать](https://nodejs.org/) или через [nvm](https://github.com/nvm-sh/nvm))
- **npm** 9+ (идёт с Node.js)
- **Git** ([скачать](https://git-scm.com/))

### Установка

```bash
# 1. Клонируй репозиторий
git clone https://github.com/offflinerpsy/barnhouse-vibes-kg-0edb14f0.git

# 2. Перейди в папку
cd barnhouse-vibes-kg-0edb14f0

# 3. Установи зависимости
npm install

# 4. Запусти dev сервер
npm run dev
```

Открой **http://localhost:8080** в браузере.

### Доступные команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запустить dev сервер (порт 8080) |
| `npm run build` | Собрать production билд в `dist/` |
| `npm run preview` | Превью production билда локально |
| `npm run lint` | Проверить код линтером |

---

## 📁 Структура проекта

```
barnhouse-vibes-kg/
├── public/
│   ├── catalog/               # Изображения домов
│   │   └── model-X-XX/
│   │       ├── gallery/       # Основные фото
│   │       ├── gallery-extra/ # Дополнительные фото
│   │       └── floor-plan/    # Планировки
│   └── fonts/                 # Шрифт Rising Sun
├── src/
│   ├── components/
│   │   ├── landing/           # Секции лендинга
│   │   │   ├── Hero.tsx
│   │   │   ├── Catalog.tsx
│   │   │   ├── CatalogAppView.tsx    # Мобильный каталог (iOS-style)
│   │   │   ├── Advantages.tsx
│   │   │   ├── Stages.tsx
│   │   │   ├── FAQ.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/                # shadcn компоненты
│   ├── pages/
│   │   └── Index.tsx          # Главная страница
│   ├── hooks/
│   ├── lib/
│   └── assets/
├── .github/
│   ├── ISSUE_TEMPLATE/        # Шаблоны Issue
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CODEOWNERS
│   └── copilot-instructions.md  # Инструкции для AI
└── docs/
    ├── ARCHITECTURE.md        # Архитектура
    ├── DESIGN_SYSTEM.md       # Дизайн-система
    └── CATALOG_GUIDE.md       # Гайд по каталогу
```

---

## 🎨 Технологии

| Технология | Версия | Назначение |
|------------|--------|------------|
| React | 18.3 | UI библиотека |
| TypeScript | 5.8 | Типизация |
| Vite | 5.4 | Сборщик |
| Tailwind CSS | 3.4 | Стилизация |
| shadcn/ui | - | UI компоненты |
| Framer Motion | 12.23 | Анимации |
| react-pdf | 10.2 | PDF планировки |
| Embla Carousel | 8 | Карусели |

---

## 🏠 Система моделей домов

### Именование

- **Model N** — одноэтажный (N модулей × 18м²)
- **Model NX** — двухэтажный/дуплекс

### Примеры

| Модель | Площадь | Этажей | Папка |
|--------|---------|--------|-------|
| Model 1 | 18м² | 1 | `model-1-18` |
| Model 2 | 36м² | 1 | `model-1-36` |
| Model 4X | 72м² | 2 | `model-2-72` |
| Model 12X | 204м² | 2 | `model-2-204` |

Подробнее: [CATALOG_GUIDE.md](./CATALOG_GUIDE.md)

---

## � Для AI-агентов

Этот проект работает с AI-агентами (Claude, GPT, Cursor и др.)

1. Прочитай [AI_AGENT_SETUP.md](./AI_AGENT_SETUP.md) — как настроить
2. Прочитай [AI_WORKFLOW.md](./AI_WORKFLOW.md) — как работать с Issues
3. Смотри [Issues](https://github.com/offflinerpsy/barnhouse-vibes-kg-0edb14f0/issues) — текущие баги
3. Форкни → Сделай изменения → Создай PR

---

## 🚀 Деплой

### Production

- **URL:** https://era-home.kg
- **Сервер:** Timeweb Cloud VPS
- **IP:** 185.196.117.49

### Для maintainers

```bash
# 1. Собери билд
npm run build

# 2. Залей на сервер (только изменённые файлы!)
scp dist/index.html root@185.196.117.49:/var/www/era-concept/
scp dist/assets/index-*.js dist/assets/index-*.css root@185.196.117.49:/var/www/era-concept/assets/

# 3. Проверь
curl -s https://era-home.kg/ | grep "index-"
```

> ⚠️ **Важно:** Nginx root = `/var/www/era-concept/`

Полная документация: [.github/copilot-instructions.md](.github/copilot-instructions.md)

---

## 📞 Контакты проекта

- **Телефон:** +996 222 001 112
- **WhatsApp:** [wa.me/996222001112](https://wa.me/996222001112)
- **Telegram:** [@eraconcepthome](https://t.me/eraconcepthome)
- **Instagram:** [@eraconcepthome](https://instagram.com/eraconcepthome)
- **Адрес:** г. Бишкек, Ул. Байтик Баатыра 61

---

## 📄 Лицензия

Проприетарный код. Все права защищены.

---

## 🔗 Ссылки

- [Production сайт](https://era-home.kg)
- [GitHub Issues](https://github.com/offflinerpsy/barnhouse-vibes-kg-0edb14f0/issues)
- [Lovable.dev](https://lovable.dev) — Low-code платформа (синхронизация)
