import { BadgeCheck, Zap, Signal } from "lucide-react";

export function MetricsBar() {
  const metrics = [
    { label: "Detection Accuracy", value: "99.2%", icon: BadgeCheck },
    { label: "Median Verdict Time", value: "<800ms", icon: Zap },
    { label: "Forensic Signals", value: "12+", icon: Signal },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 -mt-4 relative z-10">
      <div className="bg-card border border-border rounded-2xl p-6 backdrop-blur-xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border shadow-2xl shadow-blue-500/5">
        {metrics.map((metric, idx) => (
          <div key={idx} className="flex items-center justify-center gap-4 py-3 md:py-0">
            <metric.icon className="w-6 h-6 text-blue-400" />
            <div>
              <div className="text-2xl font-bold tracking-tight text-foreground">{metric.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{metric.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}