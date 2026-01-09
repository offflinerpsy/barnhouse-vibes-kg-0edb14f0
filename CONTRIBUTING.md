# 🤝 Contributing Guide

Спасибо за интерес к проекту ERA Concept Home! Этот гайд поможет тебе начать контрибьютить.

---

## ⚠️ ВАЖНО: Как устроен процесс

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   ТЫ (кодер)     │────►│  Pull Request    │────►│   Maintainer     │
│                  │     │                  │     │                  │
│  - Форкаешь      │     │  - Описание      │     │  - Ревьюит       │
│  - Фиксишь       │     │  - Что сделано   │     │  - Мержит        │
│  - Пушишь в форк │     │  - Скриншоты     │     │  - ДЕПЛОИТ       │
│  - Создаёшь PR   │     │                  │     │  - Тестирует     │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

### Твоя зона ответственности:
- ✅ Форкнуть репо
- ✅ Пофиксить баг
- ✅ Проверить что билдится (`npm run build`)
- ✅ Создать PR с описанием
- ✅ Ответить на комментарии ревьюера

### НЕ твоя зона:
- ❌ Деплой на сервер (делает только maintainer)
- ❌ Тестирование на проде (делает maintainer)
- ❌ Merge в main (делает maintainer)

---

## 📋 Быстрый старт

```bash
# 1. ФОРКНИ репозиторий (кнопка Fork на GitHub)
#    Это создаст копию в ТВОЁМ аккаунте

# 2. Клонируй СВОЙ форк (не оригинал!)
git clone https://github.com/ТВОЙ_АККАУНТ/barnhouse-vibes-kg-0edb14f0.git
cd barnhouse-vibes-kg-0edb14f0

# 3. Установи зависимости
npm install

# 4. Запусти dev сервер
npm run dev
# Открой http://localhost:8080

# 5. Готово! Можно кодить
```

---

## 🔄 Workflow для фикса бага

### 1️⃣ Выбери Issue

1. Открой [Issues](https://github.com/offflinerpsy/barnhouse-vibes-kg-0edb14f0/issues)
2. Найди Issue с меткой `help wanted` или `good first issue`
3. Прокомментируй **"Беру в работу"** чтобы другие знали
4. Assign себя на Issue (если есть права)

### 2️⃣ Создай ветку

```bash
# Обнови main
git checkout main
git pull origin main

# Создай ветку от main
git checkout -b fix/issue-123-краткое-описание
```

**Naming convention:**
- `fix/` — баг фиксы
- `feature/` — новые фичи
- `refactor/` — рефакторинг
- `docs/` — документация

### 3️⃣ Сделай изменения

1. Пиши код
2. Проверяй что билдится: `npm run build`
3. Проверяй линтер: `npm run lint`
4. Тестируй локально на разных размерах экрана

### 4️⃣ Коммить

```bash
# Добавь конкретные файлы (НЕ git add .)
git add src/components/landing/SomeComponent.tsx

# Коммит с понятным сообщением
git commit -m "fix(catalog): исправлен z-index модалки на iOS

- Заменил createPortal на inline форму
- Убрал IntersectionObserver (не работает на iOS)
- Добавил CSS scroll-snap

Closes #123"
```

**Формат коммита:**
```
<type>(<scope>): <short description>

[optional body]

Closes #<issue-number>
```

**Types:** `fix`, `feat`, `refactor`, `style`, `docs`, `chore`, `test`

### 5️⃣ Push и создай PR

```bash
git push origin fix/issue-123-краткое-описание
```

Затем на GitHub:
1. Нажми "Compare & pull request"
2. Заполни шаблон PR
3. Запроси ревью у @offflinerpsy

### 6️⃣ Ревью и merge

- Отвечай на комментарии ревьюера
- Вноси правки если нужно
- После approve — merge в main

---

## 🧪 Тестирование

### Обязательно проверь на:

| Платформа | Браузер | Как проверить |
|-----------|---------|---------------|
| Desktop | Chrome | DevTools → Responsive |
| Desktop | Firefox | Для проверки совместимости |
| **iOS** | **Safari** | Реальный iPhone или BrowserStack |
| Android | Chrome | Реальный телефон или эмулятор |

### Критичные брейкпоинты:

```
Mobile:  375px (iPhone SE)
Tablet:  768px (iPad)
Desktop: 1280px
Wide:    1400px
```

### Как тестировать мобилку без устройства:

1. **Chrome DevTools** → Device Toolbar (Ctrl+Shift+M)
2. **BrowserStack** — реальные устройства в облаке
3. **Responsively App** — несколько размеров одновременно

---

## 📁 Структура проекта

```
barnhouse-vibes-kg/
├── public/
│   └── catalog/           # Изображения домов
│       └── model-X-XX/
│           ├── gallery/
│           ├── gallery-extra/
│           └── floor-plan/
├── src/
│   ├── components/
│   │   ├── landing/       # ← Основные компоненты
│   │   │   ├── Catalog.tsx
│   │   │   ├── CatalogAppView.tsx
│   │   │   ├── Hero.tsx
│   │   │   └── ...
│   │   └── ui/            # shadcn компоненты (не трогать!)
│   ├── pages/
│   └── lib/
├── .github/
│   └── copilot-instructions.md  # Инструкции для AI
└── docs/
    ├── ARCHITECTURE.md
    ├── DESIGN_SYSTEM.md
    └── CATALOG_GUIDE.md
```

---

## ⛔ Что НЕ делать

1. **НЕ коммить** в main напрямую
2. **НЕ менять** `src/components/ui/` без острой необходимости
3. **НЕ хардкодить** цвета — используй CSS переменные
4. **НЕ удалять** чанки из `vite.config.ts`
5. **НЕ менять** пути к шрифтам
6. **НЕ делать** `git add .` — добавляй файлы явно

---

## 🎨 Code Style

### Компоненты

```tsx
/**
 * =============================================================================
 * ComponentName - Краткое описание
 * =============================================================================
 */
export const ComponentName = () => {
  // ...
};
```

### Цвета

```tsx
// ✅ Правильно
className="text-primary bg-background"
className="text-[hsl(var(--gold))]"

// ❌ Неправильно
className="text-[#C3996B]"
```

### Изображения

```tsx
// Из public/
src="/catalog/model-1-18/gallery/1.webp"

// Из assets/
import logo from "@/assets/logo.png";
```

---

## 🚀 Деплой

Деплой делает только @offflinerpsy или по его инструкции.

Если нужно задеплоить свои изменения для тестирования — напиши в PR.

---

## ❓ Вопросы?

- Создай Issue с меткой `question`
- Или напиши в комментариях к Issue который делаешь

---

## 📚 Полезные ссылки

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Архитектура проекта
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) — Дизайн-система
- [CATALOG_GUIDE.md](./CATALOG_GUIDE.md) — Гайд по каталогу домов
