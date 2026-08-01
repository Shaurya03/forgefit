import { useEffect, useState, useRef } from "react";

export function useCountUp(target, duration = 600) {
  const [value, setValue] = useState(0);
  const prevTarget = useRef(null); // null = "no completed animation yet"

  useEffect(() => {
    const start = prevTarget.current ?? 0;
    const startTime = performance.now();
    let frame;

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + (target - start) * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        prevTarget.current = target;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}