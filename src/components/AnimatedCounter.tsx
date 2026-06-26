import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function AnimatedCounter({ 
  target, 
  duration = 1000, 
  suffix = "", 
  prefix = "" 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.round(eased * target));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, [target, duration]);

  return <span>{prefix}{count}{suffix}</span>;
}