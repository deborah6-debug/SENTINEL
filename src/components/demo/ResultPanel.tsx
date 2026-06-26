import { CheckCircle, XCircle, Shield, Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreGauge } from "./ScoreGauge";

interface Signal {
  label: string;
  value: string | number;
  risk_level: "high" | "medium" | "low";
}

interface ResultPanelProps {
  result: {
    verdict: "High Risk" | "Medium Risk" | "Low Risk" | "Safe" | "Error";
    fraud_score: number;
    recommendation: "Block" | "Review" | "Pass";
    elapsed_ms: number;
    forensic_signals?: Signal[];
    imageUrl?: string;
  };
}

export function ResultPanel({ result }: ResultPanelProps) {
  const getVerdictColor = () => {
    switch (result.verdict) {
      case "High Risk": return "text-red-500";
      case "Medium Risk": return "text-yellow-500";
      case "Low Risk": return "text-blue-400";
      case "Error": return "text-gray-500";
      default: return "text-green-500";
    }
  };

  const getRecommendationColor = () => {
    switch (result.recommendation) {
      case "Block": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "Review": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Pass": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "";
    }
  };

  const signals = result.forensic_signals || [];
  const hasSignals = signals.length > 0;

  const handleExportReport = () => {
    const report = {
      verdict: result.verdict,
      fraud_score: result.fraud_score,
      recommendation: result.recommendation,
      elapsed_ms: result.elapsed_ms,
      signals: result.forensic_signals,
      timestamp: new Date().toISOString(),
      exported_from: "Sentinel Fraud Detection Dashboard",
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sentinel-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ["Verdict", "Fraud Score", "Recommendation", "Time (ms)", "Signals"];
    const signalSummary = signals.map(s => `${s.label}: ${s.value}`).join("; ");
    const row = [result.verdict, result.fraud_score, result.recommendation, result.elapsed_ms, signalSummary];
    
    const csvContent = [
      headers.join(","),
      row.join(",")
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sentinel-report-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header with Gauge */}
      <div className="flex items-center gap-6 border-b border-border pb-4">
        <ScoreGauge score={result.fraud_score} size="md" />
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Verdict</p>
          <h3 className={`text-2xl font-bold ${getVerdictColor()}`}>
            {result.verdict}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">Score:</span>
            <span className="text-sm font-semibold text-foreground">
              {(result.fraud_score * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className={`flex items-center gap-3 rounded-lg p-3 border ${getRecommendationColor()}`}>
        <Shield className="w-5 h-5" />
        <span className="text-sm font-medium">Recommendation: </span>
        <Badge 
          variant={
            result.recommendation === "Block" ? "destructive" : 
            result.recommendation === "Review" ? "default" : "secondary"
          }
        >
          {result.recommendation}
        </Badge>
        <span className="text-xs text-muted-foreground ml-auto">
          ⚡ {result.elapsed_ms}ms
        </span>
      </div>

      {/* Signals */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
          Forensic Signals ({signals.length})
        </p>
        {hasSignals ? (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted">
            {signals.map((signal, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between bg-muted/20 rounded-md px-3 py-2 border border-border hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {signal.risk_level === "high" ? (
                    <XCircle className="w-4 h-4 text-red-400" />
                  ) : signal.risk_level === "medium" ? (
                    <XCircle className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                  <span className="text-sm text-foreground">{signal.label}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs border-border ${
                    signal.risk_level === "high" ? "text-red-400 border-red-500/20" :
                    signal.risk_level === "medium" ? "text-yellow-400 border-yellow-500/20" : 
                    "text-green-400 border-green-500/20"
                  }`}
                >
                  {signal.value}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground text-sm py-4 border border-dashed border-border rounded-lg">
            No signals available
          </div>
        )}
      </div>

      {/* Export Buttons */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportReport}
          className="flex-1 text-xs"
        >
          <Download className="w-3 h-3 mr-1" />
          JSON
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportCSV}
          className="flex-1 text-xs"
        >
          <FileText className="w-3 h-3 mr-1" />
          CSV
        </Button>
      </div>
    </div>
  );
}