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

  const defaultPrompt = `Generate production-ready ${platform} code with 100% design accuracy:

PIXEL-PERFECT REQUIREMENTS:
✓ Extract EXACT colors (HEX/RGB/HSL) - no approximations
✓ Measure ALL spacing values to exact pixels (margins, padding, gaps)
✓ Match typography precisely (font-family, size, weight, line-height, letter-spacing)
✓ Replicate layout structure exactly (grid systems, flexbox, positioning)
✓ Copy ALL component dimensions and styles (buttons, cards, forms)
✓ Match shadows, borders, gradients, and effects exactly
✓ Implement ALL responsive breakpoints from design
✓ Preserve exact icon sizes, image dimensions, and visual hierarchy

CODE QUALITY:
✓ Fully responsive (mobile, tablet, desktop) matching design breakpoints
✓ Semantic HTML5 with proper ARIA labels and accessibility
✓ Clean, maintainable component architecture
✓ Modern CSS techniques (flexbox, grid, custom properties)
✓ Smooth transitions and animations from design
✓ Performance optimized (lazy loading, efficient selectors)
✓ Production-ready with proper error handling

VALIDATION:
✓ 0px tolerance for spacing and dimensions
✓ Exact color matching verified
✓ Typography specs confirmed
✓ All interactive states implemented (hover, focus, active)
✓ Cross-browser compatibility ensured`;

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
