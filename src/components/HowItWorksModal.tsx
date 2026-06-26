import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle, Shield, Zap, Eye, FileCheck, AlertTriangle } from "lucide-react";

interface HowItWorksModalProps {
  trigger: React.ReactNode;
}

export function HowItWorksModal({ trigger }: HowItWorksModalProps) {
  const features = [
    {
      icon: Shield,
      title: "Card Fraud Detection",
      description: "Catches CNP fraud, card-testing bursts, BIN/IP mismatches, AVS/CVV failures, and reshipper shipping in real time.",
      color: "text-blue-400",
    },
    {
      icon: AlertTriangle,
      title: "Account Takeover Defense",
      description: "Flags impossible travel, anonymizing IPs, 2FA tampering, and post-login payouts before money moves.",
      color: "text-yellow-400",
    },
    {
      icon: Eye,
      title: "Receipt Forgery Detection",
      description: "Uses Error Level Analysis (ELA) to detect tampering, price manipulation, and altered dates with 94.8% accuracy.",
      color: "text-purple-400",
    },
    {
      icon: Zap,
      title: "Sub-Second Verdicts",
      description: "Forensic-grade AI processes transactions in under 800ms, enabling real-time fraud prevention.",
      color: "text-green-400",
    },
    {
      icon: FileCheck,
      title: "Forensic Signals",
      description: "Every decision comes with a breakdown of 12+ forensic signals, making the AI's reasoning transparent.",
      color: "text-orange-400",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" />
            How Sentinel Works
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            Forensic-grade fraud detection in seconds
          </p>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {features.map((feature, idx) => (
            <div key={idx} className="flex gap-4 p-4 bg-muted/20 rounded-lg border border-border">
              <div className="flex-shrink-0 mt-1">
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-400">
              🚀 Ready to try it? Scroll down to the Live Demo and test it yourself!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
