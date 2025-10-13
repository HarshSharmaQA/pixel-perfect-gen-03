import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ResultsDisplayProps {
  result: string;
  isStreaming: boolean;
}

export const ResultsDisplay = ({ result, isStreaming }: ResultsDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Analysis results copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "design-analysis.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Analysis saved to design-analysis.md",
    });
  };

  if (!result && !isStreaming) return null;

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Design Analysis</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={isStreaming}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isStreaming}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>
      
      <div className="bg-background/80 rounded-lg p-4 max-h-[600px] overflow-y-auto">
        <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
          {result}
          {isStreaming && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1"></span>}
        </pre>
      </div>
    </Card>
  );
};
