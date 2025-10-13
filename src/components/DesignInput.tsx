import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Link2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DesignInputProps {
  onSubmit: (designUrl: string) => void;
  isLoading: boolean;
}

export const DesignInput = ({ onSubmit, isLoading }: DesignInputProps) => {
  const [designUrl, setDesignUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (designUrl.trim()) {
      onSubmit(designUrl.trim());
    }
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-border">
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="url" className="gap-2">
            <Link2 className="w-4 h-4" />
            Figma URL
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="w-4 h-4" />
            Upload Design
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="url">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="design-url" className="text-sm font-medium text-foreground mb-2 block">
                Paste your Figma or Adobe XD link
              </label>
              <Input
                id="design-url"
                type="url"
                placeholder="https://www.figma.com/file/..."
                value={designUrl}
                onChange={(e) => setDesignUrl(e.target.value)}
                className="bg-background/50 border-border"
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={isLoading || !designUrl.trim()}
            >
              {isLoading ? "Analyzing..." : "Analyze Design"}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="upload">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop your design files here
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PNG, JPG, PDF, Figma exports
            </p>
            <Button variant="outline" className="mt-4">
              Select Files
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
