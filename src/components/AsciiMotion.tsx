import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type RefObject,
} from "react";

export const AsciiMotionContext = createContext(false);

export type AsciiFrame = {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  time: number;
  pointer: { x: number; y: number; active: boolean };
};

/** Animation time stops offscreen, in hidden tabs, and when motion is paused. */
export function useAsciiAnimation(
  ref: RefObject<HTMLCanvasElement | null>,
  render: (frame: AsciiFrame) => void,
  fps = 16,
) {
  const paused = useContext(AsciiMotionContext);
  const pausedRef = useRef(paused);
  const syncRef = useRef<(() => void) | null>(null);
  const timeRef = useRef(0);
  pausedRef.current = paused;
  useEffect(() => syncRef.current?.(), [paused]);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;
    let width = 0;
    let height = 0;
    let visible = true;
    let disposed = false;
    let frame = 0;
    let previous = 0;
    const pointer = { x: 0.5, y: 0.5, active: false };
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canMove = () =>
      !pausedRef.current && !preference.matches && visible && !document.hidden;
    const draw = () => {
      if (!width || !height || disposed) return;
      context.clearRect(0, 0, width, height);
      render({ context, width, height, time: timeRef.current, pointer });
    };
    const tick = (now: number) => {
      frame = 0;
      if (!canMove() || disposed) return;
      if (!previous || now - previous >= 1000 / fps) {
        if (previous)
          timeRef.current += Math.min((now - previous) / 1000, 0.12);
        previous = now;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      if (canMove() && !disposed) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    };
    const move = (event: PointerEvent) => {
      if (!canMove()) return;
      const bounds = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - bounds.left) / width;
      pointer.y = (event.clientY - bounds.top) / height;
      pointer.active = true;
    };
    const leave = () => {
      pointer.active = false;
    };
    const host =
      canvas.closest("a, article, h1, h2, h3") ?? canvas.parentElement;
    host?.addEventListener("pointermove", move as EventListener);
    host?.addEventListener("pointerleave", leave);
    const resizeObserver = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { rootMargin: "30px" },
    );
    resizeObserver.observe(canvas);
    intersection.observe(canvas);
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    syncRef.current = sync;
    resize();
    sync();
    void document.fonts.ready.then(() => {
      if (!disposed) resize();
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      host?.removeEventListener("pointermove", move as EventListener);
      host?.removeEventListener("pointerleave", leave);
      syncRef.current = null;
    };
  }, [ref, render, fps]);
}
