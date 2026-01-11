# 🔍 Comprehensive QA: Full-Stack Bug Testing & Cross-Platform Validation

## 🎯 Objective
Complete quality assurance audit of ERA Concept Home KG website across all platforms, devices, and browsers. This includes functionality testing, performance validation, accessibility compliance, and edge case discovery.

---

## 📊 Testing Matrix

### Devices
| Category | Devices | Resolutions |
|----------|---------|-------------|
| **Desktop** | Windows PC, MacBook | 1920×1080, 1366×768, 2560×1440 |
| **Tablet** | iPad, iPad Pro, Android tablets | 768×1024, 1024×1366, 800×1280 |
| **Mobile** | iPhone SE, 14, 15 Pro / Samsung S21, S23, Pixel | 375×667, 390×844, 393×852, 360×800, 412×915 |

### Browsers
- ✅ Chrome (Desktop + Android)
- ✅ Safari (Desktop + iOS)
- ✅ Firefox (Desktop + Android)
- ✅ Edge (Desktop)
- ✅ Samsung Internet (Android)

### Priority Levels
- **P0 (Critical)**: Blocks core functionality, prevents usage
- **P1 (High)**: Significant UX impact, affects major features
- **P2 (Medium)**: Visual bugs, minor UX issues
- **P3 (Low)**: Polish, nice-to-have improvements

---

## 🚨 Recent Changes to Prioritize (Jan 11, 2026)
These features were just implemented and need thorough validation:

- [ ] **Persistent press effect on "Позвонить" button** (P0)
  - Button should stay pressed (scale 0.95, brightness 0.8) while contacts are expanded
  - Additional whileTap feedback (scale 0.92, brightness 0.7) on click
  - Test on: iOS Safari, Android Chrome, Samsung Internet
  
- [ ] **Model dropdown styling** (P1)
  - Gold background `bg-primary/90` with dark text
  - Rounded-xl with proper padding
  - Should match filter tab appearance
  - Test active/hover states across devices

- [ ] **Photo/Plan button positioning** (P0)
  - Buttons positioned at `bottom-136px`
  - Must NOT overlap with navigation arrows
  - Test in fullscreen catalog on all mobile devices

- [ ] **Haptic feedback implementation** (P2)
  - useHaptic hook with 3 intensity levels
  - Should work on Android Chrome/Samsung Internet
  - Should gracefully fail on iOS (Apple restriction - expected behavior)
  - Check all interactive elements: Header, Hero, FAQ, ContactModal, Catalog

---

## 🧪 Component Testing Checklist

### 1️⃣ Header & Navigation

#### Desktop Tests
- [ ] **Scroll behavior** (P0)
  - Transparent → white background transition on scroll
  - Smooth animation without jank
  - Sticky positioning works correctly
  - Z-index layering correct (stays above content)

- [ ] **Navigation links** (P1)
  - All anchor links scroll smoothly to sections
  - Hover effects visible and smooth
  - Active state indicates current section
  - Logo click scrolls to top

- [ ] **CTA button** (P1)
  - "Получить консультацию" opens ContactModal
  - Hover state works
  - Focus state visible for keyboard navigation

#### Mobile Tests
- [ ] **Burger menu** (P0)
  - Opens/closes smoothly with animation
  - Backdrop blur effect works
  - Menu items clickable and navigate correctly
  - Closes when clicking outside (backdrop)
  - Closes when clicking a nav link
  - Body scroll locked when menu open

- [ ] **Safe area insets** (P0)
  - Header respects safe-area-inset-top on iPhone notch
  - Content not hidden behind status bar
  - Test on: iPhone 14/15 Pro (Dynamic Island), Android with cutouts

- [ ] **Haptic feedback** (P2)
  - Burger button triggers haptic
  - Nav links trigger haptic
  - Test on Android devices (iOS expected to not work)

#### Tablet Tests
- [ ] **Breakpoint transitions** (P1)
  - Smooth transition between mobile/desktop layouts
  - No layout jumps or content shifting
  - Test portrait and landscape orientations

---

### 2️⃣ Hero Section

#### Desktop Tests
- [ ] **Background image** (P1)
  - Loads correctly, no 404
  - Proper aspect ratio maintained
  - Parallax effect smooth (if implemented)
  - Overlay gradient visible

- [ ] **CTA button** (P0)
  - "Получить консультацию" opens modal
  - Hover animation smooth
  - Focus state visible

#### Mobile Tests
- [ ] **Responsive layout** (P0)
  - Text readable on small screens
  - Button sized appropriately for touch
  - Image scales correctly
  - No horizontal overflow

- [ ] **Haptic on CTA** (P2)
  - Button triggers haptic on Android

---

### 3️⃣ Catalog Section (Desktop Grid)

#### Desktop Tests
- [ ] **Grid layout** (P0)
  - Cards display in responsive grid
  - Hover effects work (scale, shadow)
  - Images load correctly
  - Model info (name, area, price) visible

- [ ] **Filter tabs** (P1)
  - "Все", "1эт", "2эт", "Биз" tabs switch correctly
  - Active tab highlighted visually
  - Models filter correctly for each category
  - Animation smooth when filtering

- [ ] **Card interaction** (P0)
  - Click opens CatalogAppView fullscreen overlay
  - Correct model data passed
  - Transition animation smooth

#### Mobile Tests
- [ ] **Responsive cards** (P0)
  - Stack properly on small screens
  - Touch targets adequate size
  - Images scale correctly
  - Text remains readable

---

### 4️⃣ CatalogAppView (Fullscreen Overlay) - CRITICAL SECTION

#### Desktop Tests
- [ ] **Overlay behavior** (P0)
  - Opens fullscreen on model card click
  - Backdrop blur effect works
  - ESC key closes overlay
  - X button closes overlay
  - Body scroll locked

- [ ] **Navigation controls** (P0)
  - Left/right arrow buttons work
  - Keyboard arrow keys navigate models
  - Wraps to first/last model correctly
  - Counter shows correct model number (e.g., "1/8")

- [ ] **Filter integration** (P1)
  - Filter tabs work within overlay
  - Models update correctly
  - Current model index resets on filter change
  - No race conditions with navigation

- [ ] **Model dropdown** (P1) ⚠️ NEW
  - Displays current model with gold background
  - Click opens model picker modal
  - Text truncates properly if too long
  - ChevronDown icon visible

- [ ] **Gallery tabs** (P0)
  - "Фото" and "План" tabs switch content
  - Images load correctly for each tab
  - Lazy loading works
  - Zoom functionality (if implemented)

#### Mobile Tests (HIGHEST PRIORITY)
- [ ] **Fullscreen behavior** (P0)
  - Overlay covers entire viewport
  - Safe area insets respected (top/bottom)
  - No iOS Safari address bar issues (100vh)
  - No bounce scroll leak

- [ ] **Swipe navigation** (P0)
  - Swipe left/right changes models
  - Gesture feels natural (not too sensitive)
  - Animation direction matches swipe
  - Works smoothly without lag

- [ ] **Filter bar** (P0)
  - Positioned at top with proper padding
  - Backdrop blur works on mobile
  - Touch targets adequate for tabs
  - Active filter highlighted correctly

- [ ] **Model dropdown** (P0) ⚠️ NEW
  - Gold background `bg-primary/90` displays correctly
  - Text contrast sufficient (dark text on gold)
  - Rounded-xl corners visible
  - Tap opens model picker
  - Picker scrollable and selectable
  - Selected model updates correctly

- [ ] **Photo/Plan buttons** (P0) ⚠️ NEW
  - Positioned at `bottom-136px` from bottom
  - Do NOT overlap navigation arrows
  - Both buttons visible and clickable
  - Test on various screen heights (iPhone SE vs Pro Max)

- [ ] **Navigation arrows** (P0)
  - Left/right arrows positioned correctly
  - Do not overlap with Photo/Plan buttons
  - Touch targets adequate size
  - Tap works reliably

- [ ] **"Позвонить" button** (P0) ⚠️ NEW - HIGHEST PRIORITY
  - Green color `#34C759` displays correctly
  - Initial state: normal (scale 1, brightness 1)
  - On tap: deeper press (scale 0.92, brightness 0.7)
  - **While contacts expanded**: stays pressed (scale 0.95, brightness 0.8)
  - ChevronUp icon rotates 180° when expanded
  - Shadow effect `shadow-lg shadow-[#34C759]/40` visible

- [ ] **Contact options** (P0)
  - Expand/collapse smoothly with animation
  - Phone, WhatsApp, Telegram buttons display
  - Each button has correct icon and label
  - Links open correctly (tel:, whatsapp:, tg:)
  - Test on iOS (check if links work) and Android

- [ ] **"Оставить заявку" button** (P0)
  - Opens contact form modal
  - Gold background displays
  - Press effect works (scale 0.97, brightness 0.85)
  - MessageSquare icon visible

- [ ] **Gallery overlay** (P0)
  - Opens from Photo/Plan buttons
  - Displays correct tab (photos or plans)
  - Swipe up/down to close
  - Pinch-to-zoom works (if implemented)
  - Swipe left/right navigates images
  - Image counter visible
  - Close button works

- [ ] **Haptic feedback** (P2) ⚠️ NEW
  - Triggers on all interactive elements:
    - Filter tabs
    - Model dropdown
    - Navigation arrows
    - Позвонить button
    - Contact option buttons
    - Оставить заявку button
    - Photo/Plan buttons
  - Test on Android (Chrome, Samsung Internet)
  - Verify graceful failure on iOS

#### Tablet Tests
- [ ] **Adaptive layout** (P1)
  - Chooses appropriate layout (desktop vs mobile)
  - Touch gestures work
  - Button sizes adequate
  - Portrait and landscape tested

#### Edge Cases & Stress Tests
- [ ] **Rapid interactions** (P1)
  - Fast swipes don't break navigation
  - Multiple rapid taps don't trigger duplicate actions
  - Filter change during animation doesn't crash
  - Opening gallery during model transition

- [ ] **State management** (P0)
  - Model state persists correctly
  - Filter state doesn't get lost
  - No memory leaks on repeated open/close
  - Image cleanup on model change

- [ ] **Error handling** (P0)
  - Missing images show placeholder/fallback
  - Invalid model ID handled gracefully
  - Network errors don't crash overlay

---

### 5️⃣ FAQ Section

#### Desktop Tests
- [ ] **Accordion behavior** (P0)
  - Click opens/closes accordion items
  - Only one item open at a time (or multiple if designed that way)
  - Smooth animation
  - ChevronDown rotates

#### Mobile Tests
- [ ] **Touch interaction** (P0)
  - Tap works reliably
  - Adequate touch target size
  - Content doesn't overflow

- [ ] **Haptic feedback** (P2) ⚠️ NEW
  - Triggers on accordion toggle

---

### 6️⃣ Contact Forms & Modals

#### ContactModal (Hero CTA)
- [ ] **Modal behavior** (P0)
  - Opens from "Получить консультацию" button
  - Backdrop overlay visible
  - ESC key closes
  - Click outside closes
  - X button closes
  - Body scroll locked when open

- [ ] **Contact method selection** (P0)
  - Call, WhatsApp, Telegram options visible
  - Selection highlights active method
  - Visual feedback on selection
  - Selected method stored

- [ ] **Form fields** (P0)
  - Name input accepts text
  - Phone input has mask (e.g., +996 XXX XXX XXX)
  - Required field validation works
  - Error messages display clearly

- [ ] **Submit button** (P0)
  - Validates form before submit
  - Shows loading state during submit
  - Success message on completion
  - Error handling on failure
  - Form clears after success

- [ ] **Haptic feedback** (P2) ⚠️ NEW
  - Triggers on method selection
  - Triggers on submit button

#### Contact Section Form
- [ ] **Form functionality** (P0)
  - All fields work (name, phone, message)
  - Textarea expands appropriately
  - Validation on required fields
  - Submit works correctly

- [ ] **Mobile layout** (P1)
  - Fields stack properly
  - Keyboard doesn't hide submit button
  - Virtual keyboard handled correctly (iOS/Android)

#### Edge Cases
- [ ] **Validation edge cases** (P1)
  - Empty form submission blocked
  - Invalid phone format rejected
  - XSS attempts sanitized
  - Very long input handled (name, message)
  - Special characters in fields

- [ ] **Rapid interactions** (P1)
  - Double-click submit prevented
  - Modal open/close rapidly doesn't break
  - Multiple form submissions blocked

---

### 7️⃣ Footer

#### Desktop Tests
- [ ] **Layout** (P2)
  - All sections display correctly
  - Links work
  - Contact info visible
  - Social icons clickable

- [ ] **Skyline SVG** (P2)
  - FooterSkyline component renders
  - No visual glitches
  - Scales responsively

#### Mobile Tests
- [ ] **Responsive layout** (P2)
  - Sections stack properly
  - Text readable
  - Links have adequate touch targets

---

## ⚡ Performance Testing

### Metrics to Validate
- [ ] **Lighthouse scores** (P1)
  - Performance: > 85
  - Accessibility: > 90
  - Best Practices: > 90
  - SEO: > 90

- [ ] **Core Web Vitals** (P0)
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

- [ ] **Loading performance** (P1)
  - First Contentful Paint: < 1.5s
  - Time to Interactive: < 3.0s
  - Total bundle size reasonable

### Specific Checks
- [ ] **Image optimization** (P1)
  - WebP format used where supported
  - Fallback formats for older browsers
  - Lazy loading implemented
  - Correct sizes for responsive images
  - No 404 errors on images

- [ ] **Animation performance** (P1)
  - Framer Motion animations at 60fps
  - No jank during scroll
  - Reduced motion respected (prefers-reduced-motion)
  - Transforms use GPU acceleration (translateZ, will-change)

- [ ] **Code splitting** (P2)
  - Lazy imports for large components
  - Vite chunks appropriately sized
  - No huge monolithic bundle

- [ ] **Font loading** (P2)
  - Custom fonts load without FOUT/FOIT
  - Font-display strategy appropriate

### Network Conditions
- [ ] **Throttled connections** (P1)
  - Test on 3G (750kb/s)
  - Test on 4G (4Mb/s)
  - Loading states display during slow load
  - No broken layout during progressive load

---

## ♿ Accessibility Audit

- [ ] **Keyboard navigation** (P0)
  - Tab through all interactive elements
  - Focus visible on all elements
  - Modal traps focus correctly
  - ESC closes modals
  - No keyboard traps

- [ ] **Screen reader** (P1)
  - Test with NVDA (Windows) or VoiceOver (Mac)
  - All images have alt text
  - Form labels associated correctly
  - ARIA labels on icon-only buttons
  - Semantic HTML used (nav, main, footer, section)

- [ ] **Color contrast** (P1)
  - Text meets WCAG AA contrast ratio (4.5:1)
  - Interactive elements distinguishable
  - Focus indicators visible

- [ ] **Focus management** (P0)
  - Modal focus management correct
  - Focus returns to trigger after modal close
  - Skip to content link (if implemented)

- [ ] **Touch targets** (P0)
  - All buttons minimum 44×44px on mobile
  - Adequate spacing between touch targets

---

## 🌐 Browser-Specific Issues

### iOS Safari
- [ ] **100vh issue** (P0)
  - Address bar hiding doesn't break layout
  - Use `dvh` or JavaScript solution if needed

- [ ] **Position fixed bugs** (P1)
  - Fixed elements stay fixed during scroll
  - No jumping or repositioning

- [ ] **Backdrop-filter** (P1)
  - Blur effects work or have fallback
  - Performance acceptable

- [ ] **Touch events** (P0)
  - Touch delay removed (touch-action)
  - No ghost clicks
  - Swipes work smoothly

### Android Chrome/Samsung Internet
- [ ] **Safe area insets** (P0)
  - Various manufacturer cutouts handled
  - Gesture navigation doesn't conflict

- [ ] **Keyboard viewport resize** (P0)
  - Virtual keyboard doesn't break fixed elements
  - Form inputs remain visible when keyboard open

- [ ] **Haptic API** (P2)
  - Vibration works correctly
  - No errors in console

### Firefox
- [ ] **Backdrop-filter fallback** (P2)
  - Older versions without support have fallback

### Edge
- [ ] **General compatibility** (P2)
  - No Chromium-specific bugs

---

## 🔥 Stress & Edge Case Testing

- [ ] **Rapid interactions**
  - Multiple rapid clicks on buttons
  - Fast navigation through catalog
  - Quick open/close of modals
  - Spam filter changes

- [ ] **Resize handling**
  - Rotate device (portrait ↔ landscape)
  - Resize browser window
  - Zoom in/out (pinch, Ctrl+/-)

- [ ] **Long sessions**
  - Keep catalog open for 5+ minutes
  - Navigate through all models multiple times
  - Check for memory leaks (DevTools Memory profiler)

- [ ] **Extreme content**
  - Very long model names
  - Missing images
  - Empty states

- [ ] **Offline behavior**
  - Disconnect network
  - Check error handling
  - Service worker caching (if implemented)

---

## 📋 Success Criteria

This QA audit is complete when:
1. ✅ All P0 issues are resolved
2. ✅ All P1 issues are documented with fix plans
3. ✅ Recent changes (Jan 11) fully validated across devices
4. ✅ Performance benchmarks meet targets
5. ✅ No critical accessibility violations
6. ✅ Cross-browser compatibility confirmed

---

## 🛠️ Testing Tools & Methods

### Recommended Tools
- **Browser DevTools**: Inspect, performance profiling, network throttling
- **BrowserStack**: Real device testing (optional)
- **Lighthouse**: Automated audits (built into Chrome DevTools)
- **WAVE**: Accessibility checker
- **axe DevTools**: Accessibility testing
- **React DevTools**: Component state inspection

### Testing Methodology
1. **Manual testing** on real devices (highest priority for mobile)
2. **Automated Lighthouse audits** for performance/a11y baseline
3. **Visual regression** testing via screenshots (optional)
4. **Console monitoring** for errors/warnings
5. **Network throttling** to simulate slow connections

---

## ⚠️ Known Limitations (Not Bugs)

- **Haptic feedback on iOS**: Apple blocks Vibration API in Safari - expected behavior
- **Backdrop-filter performance**: May lag on older/low-end devices - acceptable
- **Some animations on low-end Android**: May drop to 30fps - acceptable if not critical path

---

## 📝 Bug Report Template

When you find a bug, please report using this format:

```markdown
### [Component] Brief description

**Priority**: P0/P1/P2/P3
**Device**: iPhone 14 / Desktop Chrome / etc.
**Browser**: Safari 17.2 / Chrome 120 / etc.

**Steps to reproduce**:
1. Step one
2. Step two
3. ...

**Expected behavior**: What should happen

**Actual behavior**: What actually happens

**Screenshots/Video**: (if applicable)

**Console errors**: (if any)
```

---

## 🎯 Assignment

@copilot Please conduct this comprehensive QA audit. Prioritize:
1. Recent changes (Jan 11, 2026) - button press states, dropdown styling, positioning
2. Mobile catalog functionality (highest risk area)
3. Cross-browser/device compatibility
4. Performance and accessibility

Report findings using the bug template above. Group related issues together. Focus on P0/P1 first.
