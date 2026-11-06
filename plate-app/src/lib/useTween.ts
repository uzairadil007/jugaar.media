import { useEffect, useRef, useState } from 'react';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Smoothly animates a number towards `target` and returns the in-between value.
 * Used for the plate filling up and the big counters ticking.
 */
export function useTween(target: number, duration = 700, from?: number): number {
  const [value, setValue] = useState(from ?? target);
  const valueRef = useRef(value);

  useEffect(() => {
    const start = valueRef.current;
    if (start === target) return;
    const begin = performance.now();
    let frame = 0;

    const step = () => {
      const t = Math.min(1, (performance.now() - begin) / duration);
      const next = start + (target - start) * easeOutCubic(t);
      valueRef.current = next;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
