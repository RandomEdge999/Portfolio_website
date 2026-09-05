import { useCallback, useRef } from "react";
import { useAsciiAnimation, type AsciiFrame } from "./AsciiMotion";

type Cell = { x: number; y: number; density: number };

/** The readable DOM text also determines layout; the visible lettering is glyphs. */
export default function AsciiText({ text }: { text: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const source = useRef<HTMLSpanElement>(null);
  const cache = useRef<{ key: string; cells: Cell[]; step: number } | null>(
    null,
  );
  const render = useCallback(
    ({ context, width, height, time, pointer }: AsciiFrame) => {
      if (!source.current) return;
      const style = getComputedStyle(source.current);
      const fontSize = parseFloat(style.fontSize);
      const key = `${width}:${height}:${fontSize}:${text}:${style.fontFamily}`;
      if (cache.current?.key !== key) {
        const mask = document.createElement("canvas");
        mask.width = Math.ceil(width);
        mask.height = Math.ceil(height);
        const ink = mask.getContext("2d", { willReadFrequently: true });
        if (!ink) return;
        ink.font = `700 ${fontSize}px "Courier New", monospace`;
        ink.letterSpacing = style.letterSpacing;
        ink.textBaseline = "middle";
        ink.fillStyle = "white";
        const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.1;
        let line = "";
        let y = lineHeight / 2;
        for (const word of text.toUpperCase().split(" ")) {
          const candidate = line ? `${line} ${word}` : word;
          if (line && ink.measureText(candidate).width > width + 1) {
            ink.fillText(line, 0, y);
            line = word;
            y += lineHeight;
          } else line = candidate;
        }
        ink.fillText(line, 0, y);
        const pixels = ink.getImageData(0, 0, mask.width, mask.height).data;
        const step = Math.max(1.8, Math.min(4, fontSize / 23));
        const cells: Cell[] = [];
        for (let row = step / 2; row < height; row += step * 1.22) {
          for (let x = step / 2; x < width; x += step) {
            const density =
              pixels[(Math.floor(row) * mask.width + Math.floor(x)) * 4 + 3] /
              255;
            if (density > 0.15) cells.push({ x, y: row, density });
          }
        }
        cache.current = { key, cells, step };
      }
      const { cells, step } = cache.current;
      context.font = `700 ${step * 1.65}px "Courier New", monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      const ramp = "+x#%@";
      const sweep = ((time * 0.16) % 1.5) - 0.25;
      for (const cell of cells) {
        const wave = Math.sin(cell.x / 43 - time * 1.8 + cell.y / 23);
        const beam = Math.max(0, 1 - Math.abs(cell.x / width - sweep) * 10);
        const hover = pointer.active
          ? Math.max(
              0,
              1 -
                Math.hypot(
                  cell.x / width - pointer.x,
                  cell.y / height - pointer.y,
                ) *
                  4,
            )
          : 0;
        context.fillStyle = `rgba(245,245,245,${Math.min(1, 0.66 + wave * 0.09 + beam * 0.26 + hover * 0.25) * cell.density})`;
        const index =
          Math.abs(
            Math.floor(cell.x / step + cell.y / step + time * 2 + beam * 5),
          ) % ramp.length;
        context.fillText(ramp[index], cell.x, cell.y);
      }
    },
    [text],
  );
  useAsciiAnimation(canvas, render, 12);
  return (
    <span className="ascii-type">
      <span className="ascii-type-source" ref={source}>
        {text}
      </span>
      <canvas ref={canvas} aria-hidden="true" />
    </span>
  );
}
