import { useCallback, useRef } from "react";
import { useAsciiAnimation, type AsciiFrame } from "./AsciiMotion";
import type { CaseStudyVisual } from "../types";

type Vector = { x: number; y: number; z: number };
type Rotation = { x?: number; y?: number; z?: number };
interface Sample {
  (point: Vector, normal: Vector, exposure?: number): void;
  step?: number;
}
const TAU = Math.PI * 2;
const RAMP = " .,:;i+xX$&#@";
const descriptions: Record<CaseStudyVisual, string> = {
  agents:
    "Original ASCII sculpture: three shaded agent nodes linked to a central operator node. A conceptual illustration of coordinated agent sessions.",
  forecast:
    "Original ASCII sculpture: a rippling, densely shaded surface representing signal and noise. This is conceptual artwork, not experimental results.",
  operator:
    "Original ASCII sculpture: five connected geometric stages, with a bright open frame representing human review before the final action.",
  telemetry:
    "Original ASCII sculpture: a shaded globe, an orbital ring, and a small satellite with solar panels, representing CubeSat telemetry research.",
};

function vector(x: number, y: number, z: number): Vector {
  return { x, y, z };
}
function add(a: Vector, b: Vector): Vector {
  return vector(a.x + b.x, a.y + b.y, a.z + b.z);
}
function scale(a: Vector, size: number): Vector {
  return vector(a.x * size, a.y * size, a.z * size);
}
function normalize(a: Vector): Vector {
  const size = Math.hypot(a.x, a.y, a.z) || 1;
  return scale(a, 1 / size);
}
function cross(a: Vector, b: Vector): Vector {
  return vector(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x,
  );
}
function rotate(point: Vector, rotation: Rotation): Vector {
  const rx = rotation.x || 0;
  const ry = rotation.y || 0;
  const rz = rotation.z || 0;
  const y = point.y * Math.cos(rx) - point.z * Math.sin(rx);
  const z = point.y * Math.sin(rx) + point.z * Math.cos(rx);
  const x = point.x * Math.cos(ry) + z * Math.sin(ry);
  const depth = -point.x * Math.sin(ry) + z * Math.cos(ry);
  return vector(
    x * Math.cos(rz) - y * Math.sin(rz),
    x * Math.sin(rz) + y * Math.cos(rz),
    depth,
  );
}

function sphere(sample: Sample, center: Vector, radius: number, exposure = 1) {
  // Sample the camera-facing hemisphere densely enough to fill the character
  // cells. The depth buffer naturally hides connections behind the surface.
  for (let y = -radius; y <= radius; y += sample.step ?? 1.7)
    for (let x = -radius; x <= radius; x += sample.step ?? 1.7) {
      const squared = radius * radius - x * x - y * y;
      if (squared < 0) continue;
      const z = Math.sqrt(squared);
      sample(
        add(center, vector(x, y, z)),
        vector(x / radius, y / radius, z / radius),
        exposure,
      );
    }
}

function tube(
  sample: Sample,
  a: Vector,
  b: Vector,
  radius: number,
  exposure = 1,
) {
  const difference = vector(b.x - a.x, b.y - a.y, b.z - a.z);
  const length = Math.hypot(difference.x, difference.y, difference.z);
  const direction = normalize(difference);
  const tangent = normalize(
    cross(
      direction,
      Math.abs(direction.z) < 0.9 ? vector(0, 0, 1) : vector(0, 1, 0),
    ),
  );
  const bitangent = cross(direction, tangent);
  const segments = Math.ceil(length / (sample.step ?? 1.6));
  for (let step = 0; step <= segments; step++)
    for (let angle = 0; angle < TAU; angle += 0.26) {
      const normal = add(
        scale(tangent, Math.cos(angle)),
        scale(bitangent, Math.sin(angle)),
      );
      sample(
        add(add(a, scale(difference, step / segments)), scale(normal, radius)),
        normal,
        exposure,
      );
    }
}

function box(
  sample: Sample,
  center: Vector,
  dimensions: Vector,
  rotation: Rotation,
  exposure = 1,
) {
  const sizes = [dimensions.x, dimensions.y, dimensions.z];
  const axes: Array<keyof Vector> = ["x", "y", "z"];
  for (let axis = 0; axis < 3; axis++)
    for (const sign of [-1, 1]) {
      const u = (axis + 1) % 3;
      const v = (axis + 2) % 3;
      const normal = vector(0, 0, 0);
      normal[axes[axis]] = sign;
      const rotatedNormal = rotate(normal, rotation);
      if (rotatedNormal.z < 0) continue;
      for (let a = -sizes[u] / 2; a <= sizes[u] / 2; a += sample.step ?? 1.6)
        for (
          let b = -sizes[v] / 2;
          b <= sizes[v] / 2;
          b += sample.step ?? 1.6
        ) {
          const point = vector(0, 0, 0);
          point[axes[axis]] = (sign * sizes[axis]) / 2;
          point[axes[u]] = a;
          point[axes[v]] = b;
          sample(add(center, rotate(point, rotation)), rotatedNormal, exposure);
        }
    }
}

function ring(
  sample: Sample,
  center: Vector,
  radius: number,
  thickness: number,
  rotation: Rotation,
  exposure = 1,
) {
  for (
    let angle = 0;
    angle < TAU;
    angle += Math.min(0.024, (sample.step ?? 1.7) / radius)
  )
    for (let around = 0; around < TAU; around += 0.3) {
      const normal = vector(
        Math.cos(angle) * Math.cos(around),
        Math.sin(angle) * Math.cos(around),
        Math.sin(around),
      );
      const point = vector(
        (radius + thickness * Math.cos(around)) * Math.cos(angle),
        (radius + thickness * Math.cos(around)) * Math.sin(angle),
        thickness * Math.sin(around),
      );
      sample(
        add(center, rotate(point, rotation)),
        rotate(normal, rotation),
        exposure,
      );
    }
}

function agents(sample: Sample, time: number) {
  const center = vector(-8, -4, 24);
  const nodes = [
    vector(-191 + Math.sin(time * 0.8) * 12, -5 + Math.sin(time) * 30, -16),
    vector(155 + Math.cos(time * 0.7) * 22, 66 + Math.sin(time * 0.8) * 20, -5),
    vector(180 + Math.sin(time * 0.7) * 16, -77 + Math.cos(time * 0.9) * 20, 9),
  ];
  nodes.forEach((node) => tube(sample, center, node, 8, 0.9));
  tube(sample, nodes[1], nodes[2], 3.5, 0.7);
  sphere(sample, nodes[0], 47, 0.93);
  sphere(sample, nodes[1], 43, 0.9);
  sphere(sample, nodes[2], 39, 0.96);
  sphere(sample, center, 75, 1.15);
  ring(sample, center, 86, 1.25, { x: 1.18, y: 0.3, z: -0.47 }, 0.9);
}

function forecast(sample: Sample, time: number) {
  const rotation = { x: 0.93, y: -0.15, z: -0.09 };
  const height = (u: number, v: number) =>
    22 * Math.sin(u / 37 + v / 35 - time * 1.3) +
    15 * Math.sin(v / 28 - u / 90 + time * 0.8) +
    7 * Math.cos(u / 16 + v / 44 - time * 0.6);
  for (let u = -222; u <= 222; u += sample.step ?? 1.7)
    for (let v = -100; v <= 100; v += sample.step ?? 1.7) {
      const h = height(u, v);
      const a = Math.cos(u / 37 + v / 35 - time * 1.3);
      const b = Math.cos(v / 28 - u / 90 + time * 0.8);
      const c = Math.sin(u / 16 + v / 44 - time * 0.6);
      const du = (22 / 37) * a - (15 / 90) * b - (7 / 16) * c;
      const dv = (22 / 35) * a + (15 / 28) * b - (7 / 44) * c;
      const point = rotate(vector(u, h, v), rotation);
      const normal = rotate(normalize(vector(-du, 1, -dv)), rotation);
      sample(point, normal, 1.12);
    }
  // Shallow cut edges make the field read as a three-dimensional material.
  for (const v of [-100, 100])
    for (let u = -222; u <= 222; u += sample.step ?? 1.7) {
      const h = height(u, v);
      for (let depth = 0; depth <= 15; depth += sample.step ?? 1.7) {
        sample(
          rotate(vector(u, h - depth, v), rotation),
          rotate(vector(0, 0, Math.sign(v)), rotation),
          0.75,
        );
      }
    }
}

function operator(sample: Sample, time: number) {
  const rotation = { x: 0.27, y: -0.43, z: 0.08 };
  const positions = [-215, -107, 1, 109, 217];
  tube(sample, vector(-220, -11, -35), vector(220, -11, -35), 3.5, 0.85);
  positions.forEach((x, index) => {
    const center = vector(x, -4 + Math.sin(time * 1.15 - index * 0.7) * 12, 0);
    const turning = {
      ...rotation,
      y: rotation.y + Math.sin(time * 0.65 - index * 0.3) * 0.4,
    };
    if (index === 3) {
      // Four solid bars form a bright, open review gate. The opening remains
      // actual negative space; this is a sculpture rather than product UI.
      const gate = (offset: Vector, dimensions: Vector) =>
        box(
          sample,
          add(center, rotate(offset, turning)),
          dimensions,
          turning,
          1.6,
        );
      gate(vector(-32, 0, 0), vector(14, 98, 31));
      gate(vector(32, 0, 0), vector(14, 98, 31));
      gate(vector(0, 42, 0), vector(64, 14, 31));
      gate(vector(0, -42, 0), vector(64, 14, 31));
    } else {
      box(
        sample,
        center,
        vector(57, 69, 50),
        turning,
        index === 4 ? 1.07 : 0.9,
      );
    }
  });
}

function telemetry(sample: Sample, time: number) {
  const center = vector(-40, -2, 0);
  sphere(sample, center, 75, 1.07);
  ring(sample, center, 138, 2.6, { x: 0.98, y: -0.27, z: 0.39 }, 1.08);
  ring(sample, center, 143, 0.8, { x: 0.98, y: -0.27, z: 0.39 }, 0.63);
  const orbit = time * 0.48 + 0.38;
  const satellite = vector(
    -40 + Math.cos(orbit) * 180,
    Math.sin(orbit) * 87,
    Math.sin(orbit) * 90,
  );
  const rotation = { x: 0.35, y: -0.5, z: -0.45 };
  const part = (offset: Vector, dimensions: Vector, exposure = 1) =>
    box(
      sample,
      add(satellite, rotate(offset, rotation)),
      dimensions,
      rotation,
      exposure,
    );
  part(vector(0, 0, 0), vector(27, 39, 29), 1.28);
  part(vector(-48, 0, 0), vector(52, 31, 4), 0.68);
  part(vector(48, 0, 0), vector(52, 31, 4), 0.68);
  for (const side of [-1, 1]) {
    for (const x of [25, 42, 59, 74])
      tube(
        sample,
        add(satellite, rotate(vector(x * side, -15, 4), rotation)),
        add(satellite, rotate(vector(x * side, 15, 4), rotation)),
        1.15,
        1.1,
      );
    tube(
      sample,
      add(satellite, rotate(vector(25 * side, 0, 4), rotation)),
      add(satellite, rotate(vector(74 * side, 0, 4), rotation)),
      1.1,
      1.1,
    );
  }
  tube(
    sample,
    add(satellite, rotate(vector(0, 19, 0), rotation)),
    add(satellite, rotate(vector(0, 44, 0), rotation)),
    1.2,
    1.2,
  );
}

/** Pure renderer, also usable for static share images with an offscreen canvas. */
export function renderProjectArtwork(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  visual: CaseStudyVisual,
  time = 0,
) {
  if (width <= 0 || height <= 0) return;
  const cellWidth = width < 420 ? 3.6 : 4;
  const cellHeight = cellWidth * 1.53;
  const columns = Math.ceil(width / cellWidth);
  const rows = Math.ceil(height / cellHeight);
  const depths = new Float32Array(columns * rows).fill(-Infinity);
  const lightness = new Float32Array(columns * rows);
  const fitting = Math.min(width / 600, height / 280);
  const light = normalize(vector(-0.55, 0.7, 0.75));
  const sample: Sample = (point, normal, exposure = 1) => {
    const column = Math.round((width / 2 + point.x * fitting) / cellWidth);
    const row = Math.round((height / 2 - point.y * fitting) / cellHeight);
    if (column < 0 || column >= columns || row < 0 || row >= rows) return;
    const index = row * columns + column;
    if (point.z < depths[index]) return;
    const diffuse = Math.max(
      0,
      normal.x * light.x + normal.y * light.y + normal.z * light.z,
    );
    const grain = Math.sin(column * 127.1 + row * 311.7) * 43758.5453;
    const brightness = Math.min(
      1,
      (0.19 + diffuse * 0.81) * exposure +
        (grain - Math.floor(grain) - 0.5) * 0.08,
    );
    depths[index] = point.z;
    lightness[index] = brightness;
  };
  sample.step = Math.min(2.7, 2.9 / fitting);
  if (visual === "agents") agents(sample, time);
  else if (visual === "forecast") forecast(sample, time);
  else if (visual === "operator") operator(sample, time);
  else telemetry(sample, time);

  context.clearRect(0, 0, width, height);
  context.font = `400 ${cellHeight * 1.05}px "JetBrains Mono", "Courier New", monospace`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#f0f0f0";
  for (let index = 0; index < lightness.length; index++) {
    if (depths[index] === -Infinity) continue;
    const brightness = lightness[index];
    const glyph =
      RAMP[
        Math.max(
          1,
          Math.min(RAMP.length - 1, Math.floor(brightness * (RAMP.length - 1))),
        )
      ];
    context.globalAlpha = 0.27 + brightness * 0.73;
    context.fillText(
      glyph,
      (index % columns) * cellWidth,
      Math.floor(index / columns) * cellHeight,
    );
  }
  context.globalAlpha = 1;
}

export default function ProjectVisual({ visual }: { visual: CaseStudyVisual }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draw = useCallback(
    ({ context, width, height, time }: AsciiFrame) => {
      renderProjectArtwork(context, width, height, visual, time);
    },
    [visual],
  );
  useAsciiAnimation(canvasRef, draw, 16);
  return (
    <div
      className={`project-visual visual-${visual}`}
      role="img"
      aria-label={descriptions[visual]}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
