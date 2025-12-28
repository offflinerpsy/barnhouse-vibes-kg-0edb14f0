# 🎨 ERA Concept Home — Footer Style Guide для v0

## Цветовая палитра (HSL → HEX)

| Токен | HSL | HEX | Использование |
|-------|-----|-----|---------------|
| **charcoal** (фон футера) | `30 15% 20%` | `#3D3632` | Основной фон футера |
| **primary** (gold/bronze) | `32 42% 59%` | `#C3996B` | Заголовки секций, hover-состояния, акценты |
| **white** | - | `#FFFFFF` | Логотип, основной текст |
| **white/70** | - | `rgba(255,255,255,0.7)` | Описание, навигация, контакты |
| **white/50** | - | `rgba(255,255,255,0.5)` | Копирайт |
| **white/10** | - | `rgba(255,255,255,0.1)` | Бордеры, фон иконок соцсетей |

---

## Типографика

- **Шрифт**: `Rising Sun` (sans-serif fallback)
- **Заголовки секций**: `font-semibold text-lg` (~18px, золотой `#C3996B`)
- **Описание/текст**: `text-sm` (~14px), цвет `white/70`
- **Копирайт**: `text-sm`, цвет `white/50`

---

## Структура (4 колонки на desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│  [SKYLINE АНИМАЦИЯ - НЕ ТРОГАЕМ]                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────┐  ┌──────────┐              │
│  │ LOGO + DESC      │  │ Навигация│  │ Контакты │              │
│  │ (lg:col-span-2)  │  │          │  │          │              │
│  │                  │  │ • Каталог│  │ 📞 +996  │              │
│  │ Описание компании│  │ • FAQ    │  │ ✉️ email │              │
│  │                  │  │ • etc... │  │ 📍 город │              │
│  │ [🟢][✈️][📷]    │  │          │  │          │              │
│  │ соцсети          │  │          │  │          │              │
│  └──────────────────┘  └──────────┘  └──────────┘              │
│                                                                  │
│  ─────────────────── border white/10 ───────────────────        │
│                                                                  │
│            © 2025 ERA Concept Home. Все права защищены.         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Компоненты

### Соцсети (кнопки)

```css
width: 44px;
height: 44px;
border-radius: 50%;
background: rgba(255,255,255,0.1);

/* Hover states: */
WhatsApp: hover → bg-green-500/20
Telegram: hover → bg-blue-500/20  
Instagram: hover → bg-pink-500/20
+ scale: 1.1 на hover
transition: all 300ms
```

### Навигация

```css
color: rgba(255,255,255,0.7);
hover: color → #C3996B, translateX(4px)
transition: all 300ms
```

### Контакты

```css
display: flex;
align-items: center;
gap: 12px;
Иконка: hover → scale(1.1)
Текст: hover → color #C3996B
```

### Разделитель

```css
border-top: 1px solid rgba(255,255,255,0.1);
margin-top: 32px;
padding-top: 24px;
```

---

## Отступы

- Секция: `pt-12 pb-8` (padding-top: 48px, padding-bottom: 32px)
- Между колонками: `gap-8 lg:gap-6`
- Между элементами в колонке: `space-y-3` или `space-y-4`
- Заголовок → контент: `mb-5`

---

## Промпт для v0

```
Create a modern footer for ERA Concept Home (modular homes company in Kyrgyzstan).

Design requirements:
- Background: dark charcoal #3D3632
- Accent color: warm gold #C3996B (for headings, hover states)
- Text: white with 70% opacity for body, 50% for copyright
- Font: clean sans-serif (Inter or similar)

Structure (4 columns on desktop, stack on mobile):
1. Logo + company description + social icons (WhatsApp, Telegram, Instagram)
2. Navigation links (Catalog, Advantages, Stages, FAQ, Contacts)
3. Contact info (phone, email, address with icons)
4. Merge columns 1+2 on desktop (lg:col-span-2 for logo section)

Interactions:
- Social icons: rounded circles with subtle colored hover (green/blue/pink)
- Nav links: slide right + gold color on hover
- Contact icons: scale up on hover

Bottom: thin white/10 border separator, centered copyright text

Keep it minimal, warm, premium feel. NO animations above footer (skyline is separate component).
```

---

## Текущий код футера

Файл: `src/components/landing/Footer.tsx`

**Важно**: Компонент `<FooterSkyline />` с анимацией домиков находится в отдельном файле и НЕ должен меняться!
