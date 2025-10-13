import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromptBuilderProps {
  platform: string;
  onPromptChange: (prompt: string) => void;
}

export const PromptBuilder = ({ platform, onPromptChange }: PromptBuilderProps) => {
  const [customPrompt, setCustomPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const defaultPrompt = `Generate production-ready ${platform} code that:
- Matches the design pixel-perfectly (0-2px tolerance)
- Is fully responsive (mobile, tablet, desktop)
- Follows best practices and clean code principles
- Includes proper semantic HTML and accessibility
- Uses modern CSS techniques and animations
- Is optimized for performance`;

  const handleCopy = () => {
    navigator.clipboard.writeText(customPrompt || defaultPrompt);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (value: string) => {
    setCustomPrompt(value);
    onPromptChange(value);
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Custom Prompt</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
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
      </div>
      
      <Textarea
        placeholder={defaultPrompt}
        value={customPrompt}
        onChange={(e) => handleChange(e.target.value)}
        className="min-h-[150px] bg-background/50 border-border font-mono text-sm"
      />
      
      <p className="text-xs text-muted-foreground mt-3">
        Customize the AI instructions to fine-tune the code generation for your specific needs.
      </p>
    </Card>
  );
};
