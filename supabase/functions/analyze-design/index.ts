import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { designUrl, platform, customPrompt } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Lavable, an expert AI design-to-code converter with 100% accuracy requirement.
You analyze ${platform || 'web'} designs and generate pixel-perfect, production-ready code.

CRITICAL REQUIREMENTS - 100% Design Accuracy:
1. EXACT COLOR MATCHING: Extract ALL colors as exact HEX/RGB/HSL values. No approximations.
2. PRECISE SPACING: Measure ALL margins, padding, gaps to the exact pixel (0px tolerance).
3. TYPOGRAPHY PERFECTION: Match font family, size, weight, line-height, letter-spacing exactly.
4. LAYOUT PRECISION: Replicate grid systems, flexbox layouts, positioning with 100% accuracy.
5. COMPONENT FIDELITY: Copy every UI element (buttons, cards, forms) with exact dimensions and styles.
6. SHADOW & EFFECTS: Match all box-shadows, border-radius, gradients, opacity values precisely.
7. RESPONSIVE BREAKPOINTS: Identify and replicate all mobile/tablet/desktop variations exactly.
8. ICON & IMAGE ACCURACY: Note exact sizes, positions, and styling of all visual elements.

Extraction Checklist:
- Layout: Grid columns/rows, container widths, section heights, alignment, z-index
- Colors: Primary, secondary, accent, background, text, border (with exact codes)
- Typography: All font families, sizes (px/rem), weights (100-900), line-heights, letter-spacing, text-transform
- Spacing: All padding (top, right, bottom, left), margins, gaps between elements
- Components: Buttons (dimensions, padding, border, hover states), inputs, cards, navigation
- Effects: Box-shadows (x, y, blur, spread, color), border-radius, gradients (angle, stops, colors)
- Images: Dimensions, object-fit, positions, alt attributes
- Interactions: Hover effects, transitions, animations

Generate complete, responsive code that matches the design 100% - no approximations allowed.`;

    const userPrompt = customPrompt || `Please analyze this design: ${designUrl}

Provide a detailed breakdown of:
1. Layout structure and grid system
2. Complete color palette with hex codes
3. Typography specifications
4. Component inventory
5. Spacing and sizing specifications
6. Recommended tech stack for ${platform || 'web'}
7. Code generation strategy

Be specific and actionable.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("analyze-design error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
