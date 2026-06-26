import { useRef } from "react";
import { Header } from "./components/Header";
import { MetricsBar } from "./components/MetricsBar";
import { DemoSection } from "./components/DemoSection";
import { HowItWorksModal } from "./components/HowItWorksModal";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";

function App() {
  const demoRef = useRef<HTMLDivElement>(null);

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground antialiased">
      <Header />
      
      <section className="pt-20 pb-10 px-4 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-400 mb-6">
          <Shield className="w-4 h-4" />
          AI forensic analysis · sub-second verdicts
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground via-blue-100 to-purple-400 bg-clip-text text-transparent leading-[1.1]">
          Catch fraud before <br />it costs you.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Score any transaction for fraud risk and verify receipts for forgery — 
          backed by forensic-grade AI trained on millions of patterns.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            onClick={scrollToDemo}
          >
            Run an analysis <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <HowItWorksModal 
            trigger={
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-accent">
                See how it works
              </Button>
            }
          />
        </div>
      </section>

      <MetricsBar />

      <div ref={demoRef}>
        <DemoSection />
      </div>
    </main>
  );
}

export default App;