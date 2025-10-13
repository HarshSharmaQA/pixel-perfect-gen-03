import { useState } from "react";
import { Sparkles, Zap, Code2 } from "lucide-react";
import { PlatformSelector } from "@/components/PlatformSelector";
import { DesignInput } from "@/components/DesignInput";
import { PromptBuilder } from "@/components/PromptBuilder";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("nextjs");
  const [customPrompt, setCustomPrompt] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyzeDesign = async (designUrl: string) => {
    setIsAnalyzing(true);
    setAnalysisResult("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-design`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            designUrl,
            platform: selectedPlatform,
            customPrompt,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze design");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;

        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              setAnalysisResult((prev) => prev + content);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      toast({
        title: "Analysis Complete!",
        description: "Your design has been analyzed successfully.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Lavable
              </h1>
            </div>
            <div className="flex gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4" />
              <span>AI-Powered Design to Code</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Intro */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-5xl font-bold text-foreground">
              Transform Designs into{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Pixel-Perfect Code
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your Figma or Adobe XD designs and watch as AI generates production-ready code
              in your chosen platform.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-scale-in">
            <div className="p-6 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50">
              <Code2 className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">100% Accurate</h3>
              <p className="text-sm text-muted-foreground">
                0-2px tolerance matching with your original design
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50">
              <Sparkles className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-semibold text-foreground mb-2">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Advanced AI analyzes every design detail automatically
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50">
              <Zap className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Multi-Platform</h3>
              <p className="text-sm text-muted-foreground">
                Support for Next.js, React, WordPress, Shopify, and more
              </p>
            </div>
          </div>

          {/* Platform Selection */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-foreground">1. Select Your Platform</h3>
            <PlatformSelector
              selectedPlatform={selectedPlatform}
              onSelect={setSelectedPlatform}
            />
          </div>

          {/* Design Input */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-foreground">2. Add Your Design</h3>
            <DesignInput onSubmit={handleAnalyzeDesign} isLoading={isAnalyzing} />
          </div>

          {/* Custom Prompt */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-foreground">
              3. Customize AI Instructions (Optional)
            </h3>
            <PromptBuilder platform={selectedPlatform} onPromptChange={setCustomPrompt} />
          </div>

          {/* Results */}
          {(analysisResult || isAnalyzing) && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-2xl font-semibold text-foreground">4. Review Analysis</h3>
              <ResultsDisplay result={analysisResult} isStreaming={isAnalyzing} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Powered by Lovable Cloud & Advanced AI</p>
            <p className="mt-2">© 2025 Lavable. Transform designs into reality.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
