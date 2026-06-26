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

    const data = await response.json();
    const elapsed = Math.round(performance.now() - startTime);

    // Map to your AnalysisResult format
    const analysisResult: AnalysisResult = {
      verdict:
        data.final_decision === "decline"
          ? "High Risk"
          : data.final_decision === "review"
          ? "Medium Risk"
          : "Low Risk",
      fraud_score: Math.max(data.cc_score || 0, data.ato_score || 0),
      recommendation:
        data.final_decision === "decline"
          ? "Block"
          : data.final_decision === "review"
          ? "Review"
          : "Pass",
      elapsed_ms: elapsed,
      forensic_signals: [
        // CC Signals
        ...(data.cc_score !== undefined
          ? [{ label: "CC Fraud Score", value: data.cc_score.toFixed(3), risk_level: data.cc_score > 0.5 ? "high" : "low" }]
          : []),
        // ATO Signals
        { label: "ATO Risk Score", value: data.ato_score.toFixed(3), risk_level: data.ato_score > 0.4 ? "high" : "low" },
        { label: "Device Switch", value: data.ato_flags?.device_switch_flag ? "Yes" : "No", risk_level: data.ato_flags?.device_switch_flag ? "high" : "low" },
        { label: "Location Switch", value: data.ato_flags?.location_switch_flag ? "Yes" : "No", risk_level: data.ato_flags?.location_switch_flag ? "high" : "low" },
        { label: "IP Switch", value: data.ato_flags?.ip_switch_flag ? "Yes" : "No", risk_level: data.ato_flags?.ip_switch_flag ? "high" : "low" },
        { label: "Channel Switch", value: data.ato_flags?.channel_switch_flag ? "Yes" : "No", risk_level: data.ato_flags?.channel_switch_flag ? "medium" : "low" },
        { label: "Anomaly Flags", value: `${data.ato_flags?.anomaly_flag_sum || 0}/4`, risk_level: data.ato_flags?.anomaly_flag_sum > 1 ? "high" : "low" },
      ],
    };

    setResult(analysisResult);
    setHistory((prev) => [analysisResult, ...prev].slice(0, 5));
  } catch (error) {
    console.error("Analysis failed:", error);
  } finally {
    setIsLoading(false);
  }
};