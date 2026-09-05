import { useCallback, useRef } from "react";
import { useAsciiAnimation, type AsciiFrame } from "./AsciiMotion";

export default function AsciiSignal({
  seed = 0,
  atmosphere = false,
}: {
  seed?: number;
  atmosphere?: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const render = useCallback(
    ({ context, width, height, time, pointer }: AsciiFrame) => {
      const cell = atmosphere ? 13 : 6;
      const line = atmosphere ? 16 : 8;
      context.font = `${atmosphere ? 10 : 8}px "Courier New", monospace`;
      context.textBaseline = "middle";
      const columns = Math.ceil(width / cell);
      const rows = Math.ceil(height / line);
      const ramp = " .:-=+x*#%@";
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          const nx = x / columns;
          const ny = y / rows;
          let value: number;
          if (atmosphere) {
            const edge = Math.pow(Math.abs(nx - 0.5) * 2, 4);
            const ribbon =
              Math.sin(nx * 18 + ny * 11 - time * 0.32) +
              Math.cos(ny * 17 - nx * 9 + time * 0.27);
            value = Math.max(0, 1 - Math.abs(ribbon) * 4) * edge;
            if (value < 0.11) continue;
            context.fillStyle = `rgba(255,255,255,${0.05 + value * 0.15})`;
          } else {
            const xx = (nx - 0.5) * 2;
            const yy = (ny - 0.5) * 2;
            const radius = Math.hypot(xx, yy);
            const angle = Math.atan2(yy, xx);
            const petals =
              0.58 +
              0.18 * Math.sin(angle * (3 + (seed % 4)) + time * 0.85 + seed);
            value =
              Math.max(0, 1 - Math.abs(radius - petals) * 5) +
              Math.max(0, 0.6 - radius * 2);
            value *= 0.7 + Math.sin(xx * 5 - yy * 3 + time * 1.4) * 0.3;
            if (value < 0.06) continue;
            context.fillStyle = `rgba(245,245,245,${0.3 + value * (pointer.active ? 0.7 : 0.55)})`;
          }
          const glyph =
            ramp[
              Math.min(
                ramp.length - 1,
                Math.max(1, Math.floor(value * (ramp.length - 1))),
              )
            ];
          context.fillText(glyph, x * cell, y * line);
        }
      }
    },
    [seed, atmosphere],
  );
  useAsciiAnimation(canvas, render, atmosphere ? 10 : 14);
  return (
    <canvas
      ref={canvas}
      className={atmosphere ? "ascii-atmosphere" : "ascii-signal"}
      aria-hidden="true"
    />
  );
}
