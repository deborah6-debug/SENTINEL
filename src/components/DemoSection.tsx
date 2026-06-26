import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardFraudForm } from "./demo/CardFraudForm";
import { AccountTakeoverForm } from "./demo/AccountTakeoverForm";
import { ReceiptUpload } from "./demo/ReceiptUpload";
import { ResultPanel } from "./demo/ResultPanel";
import { Loader2, Sparkles } from "lucide-react";

// Import the AnalysisResult type
import type { AnalysisResult } from "@/lib/mockApi";

export function DemoSection() {
  const [activeTab, setActiveTab] = useState("card");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  const handleAnalyze = async (formData: any) => {
    setIsLoading(true);
    setResult(null);

    try {
      const startTime = performance.now();

      const response = await fetch("http://localhost:7000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      const elapsed = Math.round(performance.now() - startTime);

      // Build forensic signals safely
      const forensic_signals = [];

      // Add CC Fraud Score if available
      if (data.cc_score !== undefined) {
        forensic_signals.push({
          label: "CC Fraud Score",
          value: data.cc_score.toFixed(3),
          risk_level: data.cc_score > 0.5 ? "high" : "low",
        });
      }

      // Add ATO Risk Score
      if (data.ato_score !== undefined) {
        forensic_signals.push({
          label: "ATO Risk Score",
          value: data.ato_score.toFixed(3),
          risk_level: data.ato_score > 0.4 ? "high" : "low",
        });
      }

      // Add ATO flags if they exist
      if (data.ato_flags) {
        const flags = [
          { key: "device_switch_flag", label: "Device Switch" },
          { key: "location_switch_flag", label: "Location Switch" },
          { key: "ip_switch_flag", label: "IP Switch" },
          { key: "channel_switch_flag", label: "Channel Switch" },
        ];
        
        flags.forEach(({ key, label }) => {
          if (data.ato_flags[key] !== undefined) {
            forensic_signals.push({
              label,
              value: data.ato_flags[key] ? "Yes" : "No",
              risk_level: data.ato_flags[key] ? "high" : "low",
            });
          }
        });

        // Add anomaly flag sum if available
        if (data.ato_flags.anomaly_flag_sum !== undefined) {
          forensic_signals.push({
            label: "Anomaly Flags",
            value: `${data.ato_flags.anomaly_flag_sum}/4`,
            risk_level: data.ato_flags.anomaly_flag_sum > 1 ? "high" : "low",
          });
        }
      }

      // Determine verdict
      let verdict: "High Risk" | "Medium Risk" | "Low Risk" | "Safe" = "Low Risk";
      if (data.final_decision === "decline") {
        verdict = "High Risk";
      } else if (data.final_decision === "review") {
        verdict = "Medium Risk";
      } else if (data.ato_score > 0.6 || data.cc_score > 0.6) {
        verdict = "Medium Risk";
      } else {
        verdict = "Low Risk";
      }

      // Determine recommendation
      let recommendation: "Block" | "Review" | "Pass" = "Pass";
      if (data.final_decision === "decline") {
        recommendation = "Block";
      } else if (data.final_decision === "review") {
        recommendation = "Review";
      } else {
        recommendation = "Pass";
      }

      const analysisResult: AnalysisResult = {
        verdict,
        fraud_score: Math.max(data.cc_score || 0, data.ato_score || 0),
        recommendation,
        elapsed_ms: elapsed,
        forensic_signals: forensic_signals.length > 0 ? forensic_signals : [
          {
            label: "No Signals",
            value: "Unable to parse API response",
            risk_level: "low",
          }
        ],
      };

      setResult(analysisResult);
      setHistory((prev) => [analysisResult, ...prev].slice(0, 5));
      
    } catch (error) {
      console.error("Analysis failed:", error);
      
      // Show error state
      setResult({
        verdict: "Error",
        fraud_score: 0,
        recommendation: "Review",
        elapsed_ms: 0,
        forensic_signals: [
          {
            label: "Error",
            value: error instanceof Error ? error.message : "Unknown error",
            risk_level: "high",
          },
          {
            label: "Hint",
            value: "Check console for details",
            risk_level: "medium",
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReceiptSubmit = async (file: File) => {
    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://localhost:7000/predict/receipt", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      const receiptResult: AnalysisResult = {
        verdict:
          data.decision === "fraudulent"
            ? "High Risk"
            : data.decision === "suspicious"
            ? "Medium Risk"
            : "Low Risk",
        fraud_score: data.fraud_probability,
        recommendation:
          data.decision === "fraudulent"
            ? "Block"
            : data.decision === "suspicious"
            ? "Review"
            : "Pass",
        elapsed_ms: 0,
        forensic_signals: [
          {
            label: "ELA Max Score",
            value: data.features?.ela_max?.toFixed(3) || "N/A",
            risk_level: data.features?.ela_max > 0.3 ? "high" : "low",
          },
          {
            label: "ELA Mean Score",
            value: data.features?.ela_mean?.toFixed(3) || "N/A",
            risk_level: data.features?.ela_mean > 0.1 ? "medium" : "low",
          },
          {
            label: "ELA Std Score",
            value: data.features?.ela_std?.toFixed(3) || "N/A",
            risk_level: data.features?.ela_std > 0.05 ? "medium" : "low",
          },
        ],
      };

      setResult(receiptResult);
      setHistory((prev) => [receiptResult, ...prev].slice(0, 5));
    } catch (error) {
      console.error("Receipt analysis failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-semibold text-foreground">Live Demo</h2>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">
          Interactive
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Panel - Inputs */}
        <div className="lg:w-1/2 bg-card border border-border rounded-2xl p-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              setResult(null);
            }}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 bg-muted border border-border">
              <TabsTrigger value="card" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-foreground">
                💳 Card fraud
              </TabsTrigger>
              <TabsTrigger value="account" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-foreground">
                🔐 Account takeover
              </TabsTrigger>
              <TabsTrigger value="receipt" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-foreground">
                🧾 Receipt
              </TabsTrigger>
            </TabsList>

            <TabsContent value="card" className="mt-6">
              <CardFraudForm onSubmit={handleAnalyze} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="account" className="mt-6">
              <AccountTakeoverForm onSubmit={handleAnalyze} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="receipt" className="mt-6">
              <ReceiptUpload onSubmit={handleReceiptSubmit} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Results */}
        <div className="lg:w-1/2 bg-card border border-border rounded-2xl p-6 min-h-[450px] flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-muted-foreground text-sm animate-pulse">Forensic AI scanning patterns...</p>
              <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse" />
              </div>
              <p className="text-xs text-muted-foreground/60">
                {activeTab === "card"
                  ? "Analyzing 12+ card fraud signals"
                  : activeTab === "account"
                  ? "Analyzing 8+ ATO signals"
                  : "Analyzing receipt authenticity"}
              </p>
            </div>
          ) : result ? (
            <ResultPanel result={result} />
          ) : history.length > 0 ? (
            <div className="w-full">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Recent Verdicts</p>
                <button
                  onClick={() => setHistory([])}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-muted/20 rounded-md px-3 py-2 border border-border"
                  >
                    <span
                      className={`text-sm font-medium ${
                        item.verdict === "High Risk"
                          ? "text-red-500"
                          : item.verdict === "Medium Risk"
                          ? "text-yellow-500"
                          : item.verdict === "Low Risk"
                          ? "text-blue-400"
                          : "text-green-500"
                      }`}
                    >
                      {item.verdict}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(item.fraud_score * 100).toFixed(0)}% · {item.elapsed_ms}ms
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <div className="text-6xl mb-4">🔍</div>
              <p className="font-medium">Enter transaction details</p>
              <p className="text-sm">and hit "Run Analysis"</p>
              <p className="text-xs text-muted-foreground/60 mt-2">Powered by forensic-grade AI</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}