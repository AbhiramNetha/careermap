import { useState, useEffect, useRef } from 'react';

/**
 * useCountUp — animates a number from 0 → end when the ref element enters view.
 * @param {number} end         - Target number to count up to
 * @param {number} duration    - Animation duration in ms (default 1800)
 * @param {string} suffix      - Optional suffix like '+', '%', 'K'
 */
export default function useCountUp(end, duration = 1800, suffix = '') {
  const [display, setDisplay] = useState('0' + suffix);
  const ref = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          let startTime = null;
          const startValue = 0;

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * (end - startValue) + startValue);
            setDisplay(current + suffix);
            if (progress < 1) requestAnimationFrame(step);
            else setDisplay(end + suffix);
          };

          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, suffix]);

  return { display, ref };
}
