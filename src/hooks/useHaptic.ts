import { useCallback } from 'react';

type HapticIntensity = 'light' | 'medium' | 'heavy';

const HAPTIC_DURATION: Record<HapticIntensity, number> = {
  light: 10,   // Легкое касание (навигация, свайп)
  medium: 20,  // Нажатие кнопки
  heavy: 40,   // Важное действие (отправка формы, подтверждение)
};

/**
 * Хук для тактильной обратной связи (Haptic Feedback)
 * Работает на мобильных устройствах с поддержкой Vibration API
 * На десктопе ничего не делает (graceful fallback)
 * 
 * @example
 * const { haptic } = useHaptic();
 * <button onClick={() => { haptic(); doSomething(); }}>Click</button>
 * 
 * // С указанием интенсивности
 * <button onClick={() => { haptic('heavy'); submitForm(); }}>Submit</button>
 */
export function useHaptic() {
  const haptic = useCallback((intensity: HapticIntensity = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(HAPTIC_DURATION[intensity]);
    }
  }, []);

  return { haptic };
}

/**
 * Функция для использования вне React компонентов
 * или когда не нужен хук
 */
export function triggerHaptic(intensity: HapticIntensity = 'light') {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(HAPTIC_DURATION[intensity]);
  }
}

export default useHaptic;
