---
description: ERA Concept Home KG - инструкции для GitHub Copilot
applyTo: 'barnhouse-vibes-kg/**'
---

# ERA Concept Home KG — Инструкции для AI-ассистента

---

## 👥 РОЛИ В ПРОЕКТЕ (простая схема)

### 🔴 Maintainer (@offflinerpsy + Copilot в VS Code)
- Создаёт Issues с описанием багов
- Ревьюит решения от AI-агентов
- **Единственный кто мержит в main**
- **Единственный кто деплоит на сервер**
- Тестирует на реальных устройствах

### 🤖 AI-агенты (Claude, GPT, Cursor и др. в своих VS Code)
- Клонируют репо (полный, с картинками)
- Читают Issue
- Фиксят баги в своих ветках
- Пушат решения в GitHub
- **НЕ мержат в main**
- **НЕ деплоят**

---

## 🔄 WORKFLOW: Как это работает

```
┌─────────────────────────────────────────────────────────────┐
│  1️⃣  MAINTAINER создаёт Issue                               │
│      - Описание бага                                        │
│      - Ключевые файлы                                       │
│      - Как воспроизвести                                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  2️⃣  AI-АГЕНТ (в своём VS Code) берёт Issue                 │
│                                                             │
│      git checkout main && git pull origin main              │
│      git checkout -b fix/issue-N-описание                   │
│      # ... фиксит баг ...                                   │
│      npm run build                                          │
│      git add <файлы>                                        │
│      git commit -m "fix(scope): описание. Closes #N"        │
│      git push origin fix/issue-N-описание                   │
│                                                             │
│      → Пишет комментарий в Issue: "Решение готово в ветке X"│
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  3️⃣  MAINTAINER + Copilot ревьюят                           │
│                                                             │
│      git fetch origin                                       │
│      git checkout fix/issue-N-описание                      │
│      npm run build && npm run dev                           │
│      # ... смотрим код, тестируем локально ...              │
│                                                             │
│      ✅ ОК → git checkout main && git merge fix/... && push  │
│      ❌ НЕ ОК → комментарий в Issue "что не так"             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  4️⃣  MAINTAINER деплоит                                     │
│                                                             │
│      npm run build                                          │
│      scp dist/... root@185.196.117.49:/var/www/era-concept/ │
│      # Тест на iPhone/Android                               │
│      # Закрыть Issue                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Настройка для AI-агентов

**Полная инструкция:** [AI_AGENT_SETUP.md](../AI_AGENT_SETUP.md)

Кратко:
1. Клонировать репо (всё включено — картинки, шрифты)
2. `npm install`
3. Получить токен от @offflinerpsy
4. Сохранить токен в `~/.github_token`
5. Работать!

---

## 🤖 ОБЯЗАТЕЛЬНО ДЛЯ AI: Workflow при работе с кодом

### При ЛЮБЫХ изменениях кода следуй этому процессу:

```
1. ISSUE → 2. ВЕТКА → 3. КОД → 4. БИЛД → 5. КОММИТ → 6. PUSH → 7. РЕВЬЮ → 8. ДЕПЛОЙ
```

### 1️⃣ Перед началом работы

```bash
# Обнови main
git checkout main
git pull origin main

# Создай ветку (НИКОГДА не коммить в main напрямую!)
git checkout -b fix/issue-N-краткое-описание
```

**Naming веток:**
- `fix/` — баг фиксы
- `feature/` — новые фичи  
- `refactor/` — рефакторинг
- `docs/` — документация

### 2️⃣ После изменений кода

```bash
# Проверь билд
npm run build

# Проверь что хеш изменился
Get-ChildItem .\dist\assets\index-*.js | Select-Object Name
```

### 3️⃣ Коммит (ВАЖНО: формат!)

```bash
# Добавляй КОНКРЕТНЫЕ файлы, НЕ git add .
git add src/components/landing/SomeFile.tsx

# Коммит с правильным форматом
git commit -m "fix(scope): краткое описание

Подробности что сделано.

Closes #N"
```

**Формат:** `<type>(<scope>): <description>`
- **type:** fix, feat, refactor, style, docs, chore
- **scope:** catalog, hero, modal, footer, etc.

### 4️⃣ Push и PR

```bash
git push origin fix/issue-N-описание
```

Затем создай PR на GitHub (шаблон заполнится автоматически).

### 5️⃣ Деплой (после merge в main)

```bash
# ПРАВИЛЬНЫЙ ПУТЬ! /var/www/era-concept/
scp dist/index.html root@185.196.117.49:/var/www/era-concept/
scp dist/assets/index-*.js dist/assets/index-*.css root@185.196.117.49:/var/www/era-concept/assets/

# Проверь что задеплоилось
curl -s https://era-home.kg/ | Select-String "index-.*\.js"
```

### 6️⃣ Верификация

```bash
# На сервере должен быть тот же хеш что в локальном билде
ssh root@185.196.117.49 "grep index- /var/www/era-concept/index.html"
```

---

## 📋 GitHub Workflow: Шаблоны

В проекте настроены шаблоны:
- `.github/ISSUE_TEMPLATE/bug_report.md` — для багов
- `.github/ISSUE_TEMPLATE/feature_request.md` — для фич
- `.github/PULL_REQUEST_TEMPLATE.md` — чеклист для PR
- `.github/CODEOWNERS` — @offflinerpsy ревьюит критичные файлы

**При создании Issue/PR используй эти шаблоны!**

---

## ⛔ КРИТИЧЕСКИ ВАЖНО: GIT РЕПОЗИТОРИЙ

### 🟢 ОСНОВНОЙ РЕПОЗИТОРИЙ (ИСПОЛЬЗОВАТЬ ТОЛЬКО ЕГО):
```
https://github.com/offflinerpsy/barnhouse-vibes-kg-0edb14f0
```

### 🔴 СТАРЫЕ РЕПОЗИТОРИИ (НЕ ИСПОЛЬЗОВАТЬ!):
```
https://github.com/offflinerpsy/barnhouse-vibes-kg  ← ЗАПРЕЩЕНО!
https://github.com/offflinerpsy/barnhouse-vibes-kg-01b96b92  ← ЗАПРЕЩЕНО!
```

**При любых git операциях:**
- `git push origin main` — пушит в Lovable репо ✅
- `git pull origin main` — тянет из Lovable репо ✅
- НИКОГДА не использовать `old-origin`!

**Причина:** Проект синхронизируется с Lovable.dev через этот репо.

---

## 🧠 АВТОМАТИЧЕСКИ: Память проекта

При начале работы с проектом:
1. **Молча** читаю память (`mcp_memory_read_graph`)
2. Получаю контекст: структуру, константы, правила
3. Работаю с пониманием архитектуры ERA Concept

## 📚 АВТОМАТИЧЕСКИ: Документация библиотек (Context7)

Когда нужен код с библиотеками проекта — получаю актуальную документацию:
- **Framer Motion** — анимации (motion, AnimatePresence, useScroll)
- **Radix UI / shadcn** — UI компоненты (Dialog, Accordion, Sheet)
- **react-pdf** — отображение PDF планировок
- **Tailwind CSS** — стилизация, кастомные классы
- **Embla Carousel** — карусели
- **Lucide React** — иконки

## 🔍 АВТОМАТИЧЕСКИ: Пошаговые рассуждения

Для сложных задач использую Sequential Thinking:
- Рефакторинг компонентов (особенно Catalog.tsx — 2000 строк)
- Отладка и диагностика
- Архитектурные решения
- Добавление новых моделей домов

## 🌐 АВТОМАТИЧЕСКИ: Веб-поиск

Когда нужна информация извне — ищу через DDG Search.

---

## 📂 Рабочие папки

| Использовать | Путь | Описание |
|--------------|------|----------|
| ✅ | `barnhouse-vibes-kg/` | Основной проект |
| ✅ | `src/components/landing/` | Секции лендинга |
| ✅ | `public/catalog/` | Изображения домов |
| ❌ | `src/components/ui/` | shadcn — не трогать без причины |
| ❌ | `node_modules/` | Зависимости |

---

## 🎯 Ключевые особенности проекта

| Аспект | Значение |
|--------|----------|
| **Стек** | React 18 + TypeScript + Vite + Tailwind + shadcn/ui |
| **Шрифт** | Rising Sun (кастомный, `/fonts/`) |
| **Главный цвет** | `--primary` / `--gold` = `#C3996B` (золотой) |
| **Фон** | `--background` = `#F5F2ED` (тёплый песочный) |
| **Dark фон** | `--charcoal` = `#3D3632` (Hero, Footer) |
| **Dev порт** | `8080` |
| **Формат изображений** | `.webp` (оптимизированный) |

---

## 🏠 Система каталога

**Именование моделей:**
- `Model [число]` — одноэтажный (1 модуль = 18м²)
- `Model [число]X` — двухэтажный (Duplex)

**Папки в `/public/catalog/`:**
```
model-[этажей]-[площадь]/
├── gallery/       # Основные фото (1.webp, 2.webp, ...)
├── gallery-extra/ # Дополнительные фото
└── floor-plan/    # Планировки (plan-1.webp, plan-1.pdf)
```

**Данные моделей** — в `Catalog.tsx`, массив `houses[]`

---

## 📐 Брейкпоинты

```
sm:  640px   — Мобильный landscape
md:  768px   — Планшет
lg:  1024px  — Ноутбук
xl:  1280px  — Desktop
2xl: 1400px  — Широкий desktop
```

---

## ⛔ НЕ ДЕЛАТЬ

1. **НЕ менять** CSS переменные в `index.css` без понимания каскада
2. **НЕ менять** `catalogPath` у моделей без переименования папок в `/public/catalog/`
3. **НЕ удалять** конфиг чанков в `vite.config.ts`
4. **НЕ менять** путь к шрифтам `/fonts/risingsun-*`
5. **НЕ редактировать** `src/components/ui/` без явной необходимости
6. **НЕ хардкодить** цвета — использовать CSS переменные или Tailwind классы

---

## ✅ Стандарты кода

### Компоненты
```tsx
/**
 * =============================================================================
 * COMPONENT_NAME - Описание
 * =============================================================================
 * 
 * Содержит: ...
 * ID: #section-id (если есть)
 * 
 * =============================================================================
 */
```

### Цвета
```tsx
// ✅ Правильно
className="text-primary bg-background border-border"
className="text-[hsl(var(--gold))]"

// ❌ Неправильно  
className="text-[#C3996B]" // Хардкод
```

### Изображения
```tsx
// ✅ Из public/
src="/catalog/model-1-18/gallery/1.webp"

// ✅ Из assets/ (импорт)
import logoEra from "@/assets/logo-era.png";
```

---

## 🔗 Документация проекта

- `ARCHITECTURE.md` — Полная архитектура (читать первым!)
- `DESIGN_SYSTEM.md` — Цвета, типографика, компоненты
- `CATALOG_GUIDE.md` — Гайд по моделям домов
- `FOOTER_STYLE_GUIDE.md` — Стили футера

---

## 📞 Контакты (константы)

```
Телефон:   +996 222 001 112
WhatsApp:  wa.me/996222001112
Telegram:  @eraconcepthome
Instagram: @eraconcepthome
Адрес:     г. Бишкек, Ул. Байтик Баатыра 61
Часы:      Ежедневно: 10:00 - 19:00
```

---

*ERA Concept Home — Модульные дома в Кыргызстане*

---

## 🔐 GitHub Authentication

```
Repository: offflinerpsy/barnhouse-vibes-kg-0edb14f0
```

**Токен хранится локально:** `~/.github_token`

```powershell
# Загрузить токен
$env:GH_TOKEN = Get-Content $env:USERPROFILE\.github_token
```

---

## 🌐 Production Server

```
Server IP:  185.196.117.49
Domain:     era-home.kg
Web Root:   /var/www/era-concept/    ← ПРАВИЛЬНЫЙ ПУТЬ!
SSH:        ssh root@185.196.117.49
```

> ⚠️ **ВАЖНО:** Nginx настроен на `/var/www/era-concept/`, НЕ на `/var/www/era-home.kg/`!

---

## 📋 Git Workflow (детали)

### Тестирование перед закрытием задачи

**ОБЯЗАТЕЛЬНО проверить на:**
1. **Desktop:** Chrome или Firefox
2. **Mobile:** 
   - iOS Safari (iPhone) — КРИТИЧНО для mobile багов
   - Android Chrome — желательно

**Как тестировать:**
- Очистить кеш (Ctrl+Shift+R)
- Или Incognito режим
- Или приватный режим на мобилке

---

## 🐛 Bug Tracking

### Issue #3: iOS Safari Mobile Bugs

**GitHub Issue:** https://github.com/offflinerpsy/barnhouse-vibes-kg-0edb14f0/issues/3

**Проблемы:**
1. ContactModal открывается ПОД каталогом — BLOCKING
2. Auto-lock не срабатывает при скролле — BLOCKING

**Решение (РЕАЛИЗОВАНО 08.01.2026):**
- ✅ Добавлена `InlineMobileContactForm` внутри CatalogAppView (строки 710-907)
- ✅ Убран IntersectionObserver (не работает на iOS с transform)
- ✅ Упрощено до CSS `scroll-snap-type: y mandatory`
- ✅ Задеплоено в `/var/www/era-concept/` (правильная директория!)

**⚠️ ВАЖНО:** Nginx root = `/var/www/era-concept/`, НЕ `/var/www/era-home.kg/`!

**Статус:** ОЖИДАЕТ ТЕСТИРОВАНИЯ на реальных устройствах

**Тестировать на:**
- iPhone (Safari)
- Samsung Galaxy (Chrome)

---

## 📅 SESSION LOG

### 08.01.2026 — Последняя сессия

**Что сделано:**
1. ✅ Создан GitHub Issue #3 с полным описанием iOS багов
2. ✅ Реализована inline форма в CatalogAppView (заменяет ContactModal на мобилках)
3. ✅ Убран IntersectionObserver, CSS scroll-snap вместо JS автолока
4. ✅ Обновлены TestModals.tsx, Catalog.tsx
5. ✅ **ИСПРАВЛЕН ДЕПЛОЙ:** директория `/var/www/era-concept/` (НЕ era-home.kg!)
6. ✅ Задеплоен билд `index-BNi8UqmB.js`

**Где остановились:**
- Код задеплоен, сайт отдаёт новый JS
- **НУЖНО ПРОТЕСТИРОВАТЬ** на реальном iPhone/Samsung
- Если inline форма не работает — смотреть Issue #3 для альтернатив

**Изменённые файлы:**
- `src/components/landing/CatalogAppView.tsx` — inline форма
- `src/components/landing/Catalog.tsx` — упрощён mobile render
- `src/pages/TestModals.tsx` — обновлён под новый API
- `.github/copilot-instructions.md` — документация
- `.github/ISSUE-iOS-MOBILE-BUGS.md` — GitHub Issue #3

---

## 📁 Ключевые файлы для мобильных багов

```
src/components/landing/CatalogAppView.tsx  — Мобильный каталог
src/components/landing/Catalog.tsx         — Desktop + роутинг
src/components/landing/ContactModal.tsx    — Модалка
src/components/landing/Hero.tsx            — Hero секция
```
