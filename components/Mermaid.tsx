"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!ref.current) return;

      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose",
        fontFamily: "system-ui, -apple-system, sans-serif",
      });

      try {
        const id = `mermaid-${Math.random().toString(36).substring(7)}`;
        const { svg } = await mermaid.render(id, chart);
        ref.current.innerHTML = svg;
      } catch (error) {
        console.error("Mermaid rendering error:", error);
        ref.current.innerHTML = `<pre class="text-red-600 text-sm">${error}</pre>`;
      }
    };

    renderDiagram();
  }, [chart]);

  return (
    <div
      ref={ref}
      className="mermaid my-8 flex justify-center items-center bg-gray-50 p-6 rounded-lg border border-gray-200 overflow-x-auto"
    />
  );
}
