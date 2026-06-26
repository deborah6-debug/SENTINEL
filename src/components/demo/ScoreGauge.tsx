import { useEffect, useRef } from "react";

interface ScoreGaugeProps {
  score: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export function ScoreGauge({ score, label = "Risk", size = "md", animate = true }: ScoreGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const currentScore = useRef(0);

  const sizeMap = {
    sm: { width: 80, height: 80, strokeWidth: 8, fontSize: 14, labelSize: 9 },
    md: { width: 120, height: 120, strokeWidth: 12, fontSize: 22, labelSize: 11 },
    lg: { width: 180, height: 180, strokeWidth: 16, fontSize: 32, labelSize: 14 },
  };

  const getColor = (value: number) => {
    if (value > 0.7) return "#ef4444";
    if (value > 0.4) return "#eab308";
    return "#22c55e";
  };

  const drawGauge = (value: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height, strokeWidth, fontSize, labelSize } = sizeMap[size];
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - strokeWidth / 2 - 10;
    
    ctx.clearRect(0, 0, width, height);
    
    // Background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, Math.PI * 1.5);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.stroke();
    
    // Score arc
    const endAngle = -Math.PI / 2 + (Math.PI * 2 * value);
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#22c55e");
    gradient.addColorStop(0.5, "#eab308");
    gradient.addColorStop(1, "#ef4444");
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.stroke();
    
    // Glow effect
    if (value > 0.1) {
      ctx.shadowColor = getColor(value);
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle);
      ctx.strokeStyle = getColor(value);
      ctx.lineWidth = strokeWidth / 2;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    
    // Center circle
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.45, 0, Math.PI * 2);
    ctx.fill();
    
    // Percentage text
    ctx.fillStyle = getColor(value);
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${Math.round(value * 100)}%`, centerX, centerY - 4);
    
    // Label
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = `${labelSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, centerX, centerY + fontSize / 1.8 + 2);
  };

  useEffect(() => {
    if (animate) {
      let startTime = performance.now();
      const startValue = currentScore.current;
      const targetValue = Math.max(0, Math.min(1, score));
      const duration = 1000;
      
      const animateScore = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (targetValue - startValue) * eased;
        
        drawGauge(currentValue);
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateScore);
        } else {
          currentScore.current = targetValue;
        }
      };
      
      animationRef.current = requestAnimationFrame(animateScore);
    } else {
      drawGauge(Math.max(0, Math.min(1, score)));
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [score, size, animate]);

  return <canvas ref={canvasRef} />;
}