import { Code2, Blocks, Palette, ShoppingBag, Globe, FileCode } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const platforms = [
  {
    id: "nextjs",
    name: "Next.js + Tailwind",
    icon: Code2,
    description: "React framework with server-side rendering",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "react",
    name: "React + Styled Components",
    icon: Blocks,
    description: "Component-based UI library",
    color: "from-cyan-500 to-blue-500"
  },
  {
    id: "wordpress",
    name: "WordPress Theme",
    icon: Globe,
    description: "Custom theme with ACF/Gutenberg",
    color: "from-indigo-500 to-purple-500"
  },
  {
    id: "shopify",
    name: "Shopify + Liquid",
    icon: ShoppingBag,
    description: "E-commerce with Tailwind sections",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "webflow",
    name: "Webflow Export",
    icon: Palette,
    description: "Auto-imported layout format",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "html",
    name: "HTML + CSS + JS",
    icon: FileCode,
    description: "Static site with vanilla code",
    color: "from-orange-500 to-red-500"
  }
];

interface PlatformSelectorProps {
  selectedPlatform: string;
  onSelect: (platformId: string) => void;
}

export const PlatformSelector = ({ selectedPlatform, onSelect }: PlatformSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {platforms.map((platform) => {
        const Icon = platform.icon;
        const isSelected = selectedPlatform === platform.id;
        
        return (
          <Card
            key={platform.id}
            onClick={() => onSelect(platform.id)}
            className={cn(
              "p-6 cursor-pointer transition-all duration-300 hover:scale-105 border-2",
              "bg-card/50 backdrop-blur-sm",
              isSelected 
                ? "border-primary shadow-glow animate-glow-pulse" 
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex flex-col gap-3">
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center",
                "bg-gradient-to-br",
                platform.color
              )}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{platform.name}</h3>
                <p className="text-sm text-muted-foreground">{platform.description}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
