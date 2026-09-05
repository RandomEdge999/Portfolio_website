import { useContext, useEffect, useRef, useState } from "react";
import { AsciiMotionContext } from "./AsciiMotion";

/** A short character decode on entry, keyboard focus, and pointer entry. */
export default function ScrambleText({ text }: { text: string }) {
  const host = useRef<HTMLSpanElement>(null);
  const paused = useContext(AsciiMotionContext);
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let frame = 0;
    const glyphs = "/\\|<>_+-=*:0123456789";
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      cancelAnimationFrame(frame);
      setDisplay(text);
    };
    const start = () => {
      if (paused || preference.matches) return;
      cancelAnimationFrame(frame);
      const started = performance.now();
      let last = 0;
      const tick = (now: number) => {
        const progress = Math.min(1, (now - started) / 650);
        if (progress === 1) {
          setDisplay(text);
          return;
        }
        if (now - last > 35) {
          last = now;
          setDisplay(
            Array.from(text, (character, index) => {
              if (character === " " || index / text.length < progress)
                return character;
              return glyphs[
                (index * 7 + Math.floor((now - started) / 55)) % glyphs.length
              ];
            }).join(""),
          );
        }
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const interactive = element.closest("a, button") ?? element;
    interactive.addEventListener("pointerenter", start);
    interactive.addEventListener("focusin", start);
    preference.addEventListener("change", stop);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        start();
        observer.disconnect();
      }
    });
    observer.observe(element);
    if (paused) stop();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      interactive.removeEventListener("pointerenter", start);
      interactive.removeEventListener("focusin", start);
      preference.removeEventListener("change", stop);
    };
  }, [text, paused]);
  return (
    <span className="scramble-text" ref={host}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
