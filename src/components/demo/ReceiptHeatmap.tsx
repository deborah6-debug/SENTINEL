import { useState, useRef, useEffect } from "react";
import { Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReceiptHeatmapProps {
  imageUrl: string;
  elaData?: {
    max: number;
    mean: number;
    std: number;
    heatmapUrl?: string;
  };
}

export function ReceiptHeatmap({ imageUrl, elaData }: ReceiptHeatmapProps) {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate heatmap generation (in production, this would come from your API)
  const generateHeatmap = async () => {
    setIsLoading(true);
    try {
      // In production: call API to get heatmap
      // const response = await fetch("http://localhost:7000/predict/receipt/heatmap", {
      //   method: "POST",
      //   body: JSON.stringify({ image_url: imageUrl }),
      // });
      // const data = await response.json();
      // Draw heatmap on canvas
      
      // For now, simulate with a canvas overlay
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Simulate heatmap overlay (random red spots for demo)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Add random "forgery" spots based on ELA data
        const intensity = elaData?.max || 0.3;
        for (let i = 0; i < data.length; i += 4) {
          const x = (i / 4) % canvas.width;
          const y = Math.floor((i / 4) / canvas.width);
          
          // Create heatmap pattern
          const heatValue = Math.sin(x / 20) * Math.cos(y / 20) * intensity;
          if (heatValue > 0.2) {
            data[i] = Math.min(255, data[i] + heatValue * 200);     // R
            data[i + 1] = Math.max(0, data[i + 1] - heatValue * 150); // G
            data[i + 2] = Math.max(0, data[i + 2] - heatValue * 150); // B
          }
        }
        ctx.putImageData(imageData, 0, 0);
        setIsLoading(false);
      };
      img.src = imageUrl;
    } catch (error) {
      console.error("Heatmap generation failed:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showHeatmap && !elaData?.heatmapUrl) {
      generateHeatmap();
    }
  }, [showHeatmap]);

  return (
    <div className="relative rounded-lg overflow-hidden border border-border">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt="Receipt" 
          className="w-full h-auto max-h-[400px] object-contain"
          style={{ display: showHeatmap ? 'none' : 'block' }}
        />
        <canvas 
          ref={canvasRef}
          className="w-full h-auto max-h-[400px] object-contain"
          style={{ display: showHeatmap ? 'block' : 'none' }}
        />
        
        {/* Heatmap Toggle Button */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="bg-black/80 hover:bg-black/90 text-white border border-white/20 backdrop-blur-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Eye className="w-4 h-4 mr-2" />
            )}
            {showHeatmap ? "Show Original" : "Show Forgery Heatmap"}
          </Button>
        </div>
      </div>
      
      {/* Legend */}
      {showHeatmap && (
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" />
            <span className="text-white">Low → High Risk</span>
          </div>
        </div>
      )}
    </div>
  );
}