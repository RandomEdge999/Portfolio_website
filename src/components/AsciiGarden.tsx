import { useEffect, useRef } from "react";

type AsciiGardenProps = {
  paused?: boolean;
  className?: string;
  variant?: "garden" | "specimen";
};
type Vector = { x: number; y: number; z: number };
type Surface = (u: number, v: number) => Vector;
type Mesh = {
  vertices: Float32Array;
  normals: Float32Array;
  triangles: Uint16Array;
  projected: Float32Array;
  reflectance: Float32Array;
  group: number;
};

const TAU = Math.PI * 2;
const WORLD_WIDTH = 1050;
const WORLD_HEIGHT = 620;
const DENSITY = ".,:;-+=!7IZXON0D8$@";

function vector(x: number, y: number, z: number): Vector {
  return { x, y, z };
}
function normalize(a: Vector): Vector {
  const length = Math.hypot(a.x, a.y, a.z) || 1;
  return vector(a.x / length, a.y / length, a.z / length);
}
function cross(a: Vector, b: Vector): Vector {
  return vector(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x,
  );
}
function rotate(a: Vector, tilt: number, turn: number): Vector {
  const y = a.y * Math.cos(tilt) - a.z * Math.sin(tilt);
  const z = a.y * Math.sin(tilt) + a.z * Math.cos(tilt);
  return vector(
    a.x * Math.cos(turn) + z * Math.sin(turn),
    y,
    -a.x * Math.sin(turn) + z * Math.cos(turn),
  );
}

/** Curved meshes and smooth surface normals are prepared only once. */
function surfaceMesh(
  surface: Surface,
  along: number,
  across: number,
  group: number,
  material = 1,
  ribbed = false,
  petal = false,
): Mesh {
  const count = (along + 1) * (across + 1);
  const vertices = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const reflectance = new Float32Array(count);
  const triangles: number[] = [];
  for (let row = 0; row <= along; row += 1) {
    for (let column = 0; column <= across; column += 1) {
      const u = row / along;
      const v = column / across;
      const index = row * (across + 1) + column;
      const point = surface(u, v);
      vertices.set([point.x, point.y, point.z], index * 3);
      const safeU = Math.max(0.0001, Math.min(0.9999, u));
      const safeV = Math.max(0.0001, Math.min(0.9999, v));
      const beforeU = surface(Math.max(0.0001, u - 0.001), safeV);
      const afterU = surface(Math.min(0.9999, u + 0.001), safeV);
      const beforeV = surface(safeU, Math.max(0.0001, v - 0.001));
      const afterV = surface(safeU, Math.min(0.9999, v + 0.001));
      const normal = normalize(
        cross(
          vector(
            afterU.x - beforeU.x,
            afterU.y - beforeU.y,
            afterU.z - beforeU.z,
          ),
          vector(
            afterV.x - beforeV.x,
            afterV.y - beforeV.y,
            afterV.z - beforeV.z,
          ),
        ),
      );
      normals.set([normal.x, normal.y, normal.z], index * 3);
      reflectance[index] =
        material *
        (ribbed
          ? 0.88 +
            Math.cos(u * 46 + Math.abs(v - 0.5) * 18) * 0.075 +
            (1 - Math.abs(v - 0.5) * 2) * 0.07
          : petal
            ? 0.55 + Math.sqrt(u) * 0.45
            : 0.97 + Math.cos(u * 20 + v * 8) * 0.03);
      if (row < along && column < across) {
        const next = index + across + 1;
        triangles.push(index, next, index + 1, index + 1, next, next + 1);
      }
    }
  }
  return {
    vertices,
    normals,
    triangles: new Uint16Array(triangles),
    projected: new Float32Array(count * 4),
    reflectance,
    group,
  };
}

function makeScene(variant: "garden" | "specimen") {
  const meshes: Mesh[] = [];
  function leaf(
    base: Vector,
    tip: Vector,
    breadth: number,
    arch: number,
    twist: number,
    group: number,
  ) {
    const length = Math.hypot(tip.x - base.x, tip.y - base.y);
    const sideX = -(tip.y - base.y) / length;
    const sideY = (tip.x - base.x) / length;
    meshes.push(
      surfaceMesh(
        (u, across) => {
          const v = across * 2 - 1;
          const shape = Math.pow(Math.max(0, Math.sin(Math.PI * u)), 0.69);
          const width = breadth * shape * (0.73 + u * 0.27);
          const curve = Math.sin(Math.PI * u);
          return vector(
            base.x +
              (tip.x - base.x) * u +
              sideX * width * v +
              sideX * curve * arch * 0.26,
            base.y +
              (tip.y - base.y) * u +
              sideY * width * v +
              sideY * curve * arch * 0.26,
            base.z +
              (tip.z - base.z) * u +
              curve * (arch * (1 - v * v) + twist * v + Math.abs(v) * 6),
          );
        },
        18,
        8,
        group,
        0.94,
        true,
      ),
    );
  }
  function stem(
    base: Vector,
    control: Vector,
    tip: Vector,
    radius: number,
    group: number,
  ) {
    const center = (t: number) =>
      vector(
        (1 - t) ** 2 * base.x + 2 * (1 - t) * t * control.x + t * t * tip.x,
        (1 - t) ** 2 * base.y + 2 * (1 - t) * t * control.y + t * t * tip.y,
        (1 - t) ** 2 * base.z + 2 * (1 - t) * t * control.z + t * t * tip.z,
      );
    meshes.push(
      surfaceMesh(
        (u, v) => {
          const point = center(u);
          const after = center(Math.min(u + 0.001, 1));
          const before = center(Math.max(u - 0.001, 0));
          const tangent = normalize(
            vector(after.x - before.x, after.y - before.y, after.z - before.z),
          );
          const normal = normalize(cross(tangent, vector(0, 0, 1)));
          const binormal = cross(tangent, normal);
          const width = radius * (1 - u * 0.3);
          return vector(
            point.x +
              width *
                (normal.x * Math.cos(v * TAU) + binormal.x * Math.sin(v * TAU)),
            point.y +
              width *
                (normal.y * Math.cos(v * TAU) + binormal.y * Math.sin(v * TAU)),
            point.z +
              width *
                (normal.z * Math.cos(v * TAU) + binormal.z * Math.sin(v * TAU)),
          );
        },
        20,
        6,
        group,
        0.78,
      ),
    );
  }
  function flower(
    center: Vector,
    size: number,
    tilt: number,
    turn: number,
    group: number,
    rings = 3,
  ) {
    const layers = [
      { count: 11, reach: 1, width: 0.3, height: 0, lift: 0.2, rotation: 0.13 },
      {
        count: 9,
        reach: 0.74,
        width: 0.25,
        height: 0.19,
        lift: 0.31,
        rotation: 0.41,
      },
      {
        count: 7,
        reach: 0.47,
        width: 0.2,
        height: 0.35,
        lift: 0.25,
        rotation: 0.12,
      },
    ];
    for (const layer of layers.slice(0, rings)) {
      for (let petal = 0; petal < layer.count; petal += 1) {
        const angle = (TAU * petal) / layer.count + layer.rotation;
        const radialX = Math.cos(angle);
        const radialY = Math.sin(angle);
        const variation = 1 + Math.sin(petal * 13.4 + group) * 0.035;
        meshes.push(
          surfaceMesh(
            (u, across) => {
              const v = across * 2 - 1;
              const reach = size * (0.065 + u * layer.reach) * variation;
              const spread =
                size *
                layer.width *
                Math.pow(Math.max(0, Math.sin(Math.PI * u)), 0.43) *
                (0.69 + u * 0.31) *
                v;
              const curl =
                size *
                (layer.height +
                  layer.lift * u * u -
                  Math.sin(Math.PI * u) * 0.055 +
                  v * v * Math.sin(Math.PI * u) * 0.105);
              const point = rotate(
                vector(
                  radialX * reach - radialY * spread,
                  radialY * reach + radialX * spread,
                  curl,
                ),
                tilt,
                turn,
              );
              return vector(
                center.x + point.x,
                center.y + point.y,
                center.z + point.z,
              );
            },
            13,
            8,
            group,
            1,
            false,
            true,
          ),
        );
      }
    }
    // The raised seed head anchors the whorls of overlapping petals.
    meshes.push(
      surfaceMesh(
        (u, v) => {
          const polar = u * Math.PI;
          const azimuth = v * TAU;
          const bump =
            1 + 0.055 * Math.sin(azimuth * 13) * Math.sin(polar * 11);
          const point = rotate(
            vector(
              Math.sin(polar) * Math.cos(azimuth) * size * 0.14 * bump,
              Math.sin(polar) * Math.sin(azimuth) * size * 0.14 * bump,
              size * (rings === 3 ? 0.51 : 0.3) +
                Math.cos(polar) * size * 0.095,
            ),
            tilt,
            turn,
          );
          return vector(
            center.x + point.x,
            center.y + point.y,
            center.z + point.z,
          );
        },
        12,
        22,
        group,
        0.81,
      ),
    );
  }
  function fern(base: Vector, tip: Vector, breadth: number, group: number) {
    const control = vector(
      base.x + (tip.x - base.x) * 0.32,
      tip.y + 30,
      base.z - 15,
    );
    stem(base, control, tip, 2.8, group);
    for (let index = 0; index < 9; index += 1) {
      const t = 0.13 + index * 0.086;
      const anchor = vector(
        (1 - t) ** 2 * base.x + 2 * (1 - t) * t * control.x + t * t * tip.x,
        (1 - t) ** 2 * base.y + 2 * (1 - t) * t * control.y + t * t * tip.y,
        base.z + (tip.z - base.z) * t,
      );
      const dx =
        2 * (1 - t) * (control.x - base.x) + 2 * t * (tip.x - control.x);
      const dy =
        2 * (1 - t) * (control.y - base.y) + 2 * t * (tip.y - control.y);
      const distance = Math.hypot(dx, dy);
      const spread = breadth * Math.sin(Math.PI * (t * 0.82 + 0.15));
      for (const direction of [-1, 1]) {
        leaf(
          anchor,
          vector(
            anchor.x -
              (dy / distance) * spread * direction +
              (dx / distance) * 22,
            anchor.y +
              (dx / distance) * spread * direction +
              (dy / distance) * 22,
            anchor.z + 12 + direction * 11,
          ),
          spread * 0.22,
          8,
          direction * 7,
          group,
        );
      }
    }
  }
  if (variant === "specimen") {
    stem(vector(0, 25, 0), vector(-70, 195, -15), vector(-10, 388, 25), 5, 0);
    leaf(vector(0, 45, 15), vector(-225, 300, 35), 71, 54, 22, 0);
    leaf(vector(0, 30, 10), vector(228, 274, 15), 76, 54, -32, 1);
    leaf(vector(10, 20, 55), vector(72, 190, 95), 46, 31, 14, 1);
    flower(vector(-10, 390, 25), 156, 0.33, -0.24, 0);
  } else {
    leaf(vector(-30, 30, -72), vector(-365, 450, -65), 52, 65, 35, 2);
    leaf(vector(0, 25, -76), vector(465, 450, -65), 56, 62, -43, 1);
    leaf(vector(-35, 24, -30), vector(-495, 245, -15), 47, 51, 25, 2);
    leaf(vector(35, 25, -15), vector(498, 190, 1), 56, 50, -31, 1);
    leaf(vector(0, 30, -90), vector(-80, 532, -130), 39, 62, 28, 0);
    stem(
      vector(-10, 13, -8),
      vector(70, 195, -22),
      vector(128, 397, 58),
      5.8,
      0,
    );
    stem(vector(25, 18, -5), vector(279, 91, 10), vector(382, 251, 88), 4.2, 1);
    stem(
      vector(-30, 15, -20),
      vector(-300, 89, -5),
      vector(-313, 278, 48),
      3.8,
      2,
    );
    flower(vector(128, 397, 58), 166, 0.27, -0.23, 0);
    flower(vector(382, 251, 88), 80, -0.24, 0.46, 1, 2);
    flower(vector(-313, 278, 48), 98, 0.44, -0.36, 2, 2);
    leaf(vector(-10, 18, 18), vector(-348, 137, 105), 39, 43, 34, 3);
    leaf(vector(25, 21, 15), vector(366, 139, 108), 43, 39, -29, 4);
    leaf(vector(-3, 20, 68), vector(-184, 224, 126), 46, 45, 19, 3);
    leaf(vector(22, 20, 62), vector(193, 209, 140), 47, 39, -21, 4);
    fern(vector(0, 20, 54), vector(-468, 103, 66), 42, 5);
    fern(vector(21, 20, 65), vector(461, 91, 83), 37, 6);
  }
  return meshes;
}

/**
 * Shaded 3D surfaces are depth-tested at character resolution; each visible
 * sample becomes one real ASCII glyph. No images, traced outlines, or WebGL.
 */
export default function AsciiGarden({
  paused = false,
  className = "",
  variant = "garden",
}: AsciiGardenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const syncRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    pausedRef.current = paused;
    syncRef.current?.();
  }, [paused]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;
    const meshes = makeScene(variant);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = preference.matches;
    let visible = true;
    let disposed = false;
    let frame = 0;
    let lastFrame = 0;
    let previousTime = 0;
    let time = 0;
    let pointerTarget = 0;
    let pointerTurn = 0;
    let width = 0;
    let height = 0;
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let cellWidth = 5.35;
    let cellHeight = 7.75;
    let columns = 0;
    let rows = 0;
    let depth = new Float32Array(0);
    let brightness = new Float32Array(0);
    const keyLight = normalize(vector(-0.6, 0.85, 1.1));
    const halfLight = normalize(vector(keyLight.x, keyLight.y, keyLight.z + 1));

    function renderMesh(mesh: Mesh, yaw: number, lean: number) {
      const cosYaw = Math.cos(yaw);
      const sinYaw = Math.sin(yaw);
      const cosLean = Math.cos(lean);
      const sinLean = Math.sin(lean);
      const projected = mesh.projected;
      for (let index = 0; index < mesh.reflectance.length; index += 1) {
        const source = index * 3;
        const sourceX = mesh.vertices[source];
        const sourceY = mesh.vertices[source + 1] - 20;
        const sourceZ = mesh.vertices[source + 2];
        const leaningX = sourceX * cosLean - sourceY * sinLean;
        const y = sourceX * sinLean + sourceY * cosLean + 20;
        const x = leaningX * cosYaw + sourceZ * sinYaw;
        const z = -leaningX * sinYaw + sourceZ * cosYaw;
        const perspective = 1040 / (1110 - z);
        const nx =
          mesh.normals[source] * cosLean - mesh.normals[source + 1] * sinLean;
        let ny =
          mesh.normals[source] * sinLean + mesh.normals[source + 1] * cosLean;
        let normalX = nx * cosYaw + mesh.normals[source + 2] * sinYaw;
        let normalZ = -nx * sinYaw + mesh.normals[source + 2] * cosYaw;
        if (normalZ < 0) {
          normalX = -normalX;
          ny = -ny;
          normalZ = -normalZ;
        }
        const diffuse = Math.max(
          0,
          normalX * keyLight.x + ny * keyLight.y + normalZ * keyLight.z,
        );
        const specular = Math.pow(
          Math.max(
            0,
            normalX * halfLight.x + ny * halfLight.y + normalZ * halfLight.z,
          ),
          20,
        );
        const rim = Math.pow(1 - Math.max(0, normalZ), 2) * 0.12;
        const luminance = Math.min(
          1,
          (0.08 + diffuse * 0.76 + specular * 0.2 + rim) *
            mesh.reflectance[index],
        );
        const destination = index * 4;
        projected[destination] =
          (WORLD_WIDTH / 2 + x * perspective) / cellWidth;
        projected[destination + 1] =
          (WORLD_HEIGHT / 2 - (y - WORLD_HEIGHT / 2) * perspective) /
          cellHeight;
        projected[destination + 2] = z;
        projected[destination + 3] = luminance;
      }
      const triangles = mesh.triangles;
      for (let triangle = 0; triangle < triangles.length; triangle += 3) {
        const a = triangles[triangle] * 4;
        const b = triangles[triangle + 1] * 4;
        const c = triangles[triangle + 2] * 4;
        const ax = projected[a],
          ay = projected[a + 1];
        const bx = projected[b],
          by = projected[b + 1];
        const cx = projected[c],
          cy = projected[c + 1];
        const denominator = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
        if (Math.abs(denominator) < 0.0001) continue;
        const left = Math.max(0, Math.ceil(Math.min(ax, bx, cx)));
        const right = Math.min(columns - 1, Math.floor(Math.max(ax, bx, cx)));
        const top = Math.max(0, Math.ceil(Math.min(ay, by, cy)));
        const bottom = Math.min(rows - 1, Math.floor(Math.max(ay, by, cy)));
        const inverse = 1 / denominator;
        for (let row = top; row <= bottom; row += 1) {
          for (let column = left; column <= right; column += 1) {
            const wa =
              ((by - cy) * (column - cx) + (cx - bx) * (row - cy)) * inverse;
            const wb =
              ((cy - ay) * (column - cx) + (ax - cx) * (row - cy)) * inverse;
            const wc = 1 - wa - wb;
            if (wa < -0.0001 || wb < -0.0001 || wc < -0.0001) continue;
            const z =
              wa * projected[a + 2] +
              wb * projected[b + 2] +
              wc * projected[c + 2];
            const target = row * columns + column;
            if (z > depth[target]) {
              depth[target] = z;
              brightness[target] =
                wa * projected[a + 3] +
                wb * projected[b + 3] +
                wc * projected[c + 3];
            }
          }
        }
      }
    }
    function draw() {
      if (!width || !height || !context || !canvas) return;
      depth.fill(-Infinity);
      brightness.fill(0);
      pointerTurn += (pointerTarget - pointerTurn) * 0.07;
      const yaw = 0.025 + Math.sin(time * 0.52) * 0.29 + pointerTurn;
      for (const mesh of meshes) {
        const lean =
          Math.sin(time * 0.86 + mesh.group * 1.1) * 0.036 +
          Math.sin(time * 1.31 + mesh.group) * 0.009;
        renderMesh(mesh, yaw, lean);
      }
      // A narrow contact shadow separates overlapping petal whorls. The
      // sample follows the upper-left light and only affects nearby surfaces.
      for (let row = 3; row < rows; row += 1) {
        for (let column = 3; column < columns; column += 1) {
          const index = row * columns + column;
          if (depth[index] === -Infinity) continue;
          let shadow = 0;
          for (let step = 1; step <= 3; step += 1) {
            const neighbor = index - step * (columns + 1);
            const difference = depth[neighbor] - depth[index];
            if (difference > step * 3 && difference < 65)
              shadow += Math.min(1, (difference - step * 3) / 19) / step;
          }
          brightness[index] *= 1 - Math.min(0.38, shadow * 0.24);
        }
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.translate(offsetX, offsetY);
      context.scale(scale, scale);
      context.font = `700 ${cellHeight * 1.06}px "Courier New", monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      // Loose pollen characters make the airflow visible between the plants.
      context.fillStyle = "rgba(210,210,210,.38)";
      for (let particle = 0; particle < 62; particle++) {
        const x =
          (particle * 113.7 + time * (7 + (particle % 5))) % WORLD_WIDTH;
        const y =
          45 +
          ((((particle * 83.3 - time * 9) % (WORLD_HEIGHT - 80)) +
            WORLD_HEIGHT -
            80) %
            (WORLD_HEIGHT - 80));
        context.fillText(
          ".+:*"[particle % 4],
          x + Math.sin(time + particle) * 8,
          y,
        );
      }
      const tones = [
        "rgba(235,235,235,.38)",
        "rgba(240,240,240,.6)",
        "rgba(246,246,246,.86)",
        "rgb(250,250,250)",
      ];
      for (let tone = 0; tone < tones.length; tone += 1) {
        context.fillStyle = tones[tone];
        for (let index = 0; index < brightness.length; index += 1) {
          if (depth[index] === -Infinity) continue;
          const light = Math.pow(Math.max(0, brightness[index]), 0.93);
          if (Math.min(3, Math.floor(light * 4)) !== tone) continue;
          const column = index % columns;
          const row = Math.floor(index / columns);
          const dither = (((column * 13 + row * 7) % 11) / 11 - 0.5) * 0.042;
          const density = Math.max(
            0,
            Math.min(
              DENSITY.length - 1,
              Math.floor((light + dither) * (DENSITY.length - 1)),
            ),
          );
          context.fillText(
            DENSITY[density],
            column * cellWidth,
            row * cellHeight,
          );
        }
      }
    }
    function tick(timestamp: number) {
      frame = 0;
      if (
        disposed ||
        pausedRef.current ||
        reducedMotion ||
        !visible ||
        document.hidden
      )
        return;
      if (timestamp - lastFrame >= 1000 / 20) {
        if (previousTime)
          time += Math.min((timestamp - previousTime) / 1000, 0.1);
        previousTime = timestamp;
        lastFrame = timestamp;
        draw();
      }
      frame = window.requestAnimationFrame(tick);
    }
    function syncAnimation() {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      if (
        !disposed &&
        !pausedRef.current &&
        !reducedMotion &&
        visible &&
        !document.hidden
      )
        frame = window.requestAnimationFrame(tick);
    }
    function resize() {
      if (!canvas) return;
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      if (width / height > 1.55 && variant === "garden") {
        scale = Math.min(width / 1100, height / 565);
        offsetX = (width - WORLD_WIDTH * scale) / 2;
        offsetY = height - WORLD_HEIGHT * scale + 16;
      } else {
        scale = Math.min(width / 500, height / WORLD_HEIGHT);
        offsetX =
          width / 2 -
          (WORLD_WIDTH / 2 + (variant === "garden" ? 125 : 0)) * scale;
        offsetY = (height - WORLD_HEIGHT * scale) / 2;
      }
      cellWidth = width < 480 ? 6.25 : 5.35;
      cellHeight = cellWidth * 1.45;
      columns = Math.ceil(WORLD_WIDTH / cellWidth) + 1;
      rows = Math.ceil(WORLD_HEIGHT / cellHeight) + 1;
      depth = new Float32Array(columns * rows);
      brightness = new Float32Array(columns * rows);
      draw();
    }
    function preferenceChanged(event: MediaQueryListEvent) {
      reducedMotion = event.matches;
      syncAnimation();
      draw();
    }
    const resizeObserver = new ResizeObserver(resize);
    const movePointer = (event: PointerEvent) => {
      if (pausedRef.current || reducedMotion) return;
      const bounds = canvas.getBoundingClientRect();
      pointerTarget =
        ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.32;
    };
    const leavePointer = () => {
      pointerTarget = 0;
    };
    canvas.addEventListener("pointermove", movePointer);
    canvas.addEventListener("pointerleave", leavePointer);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncAnimation();
      },
      { rootMargin: "60px" },
    );
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    preference.addEventListener("change", preferenceChanged);
    document.addEventListener("visibilitychange", syncAnimation);
    syncRef.current = syncAnimation;
    resize();
    syncAnimation();
    return () => {
      disposed = true;
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", movePointer);
      canvas.removeEventListener("pointerleave", leavePointer);
      intersectionObserver.disconnect();
      preference.removeEventListener("change", preferenceChanged);
      document.removeEventListener("visibilitychange", syncAnimation);
      syncRef.current = null;
    };
  }, [variant]);
  return (
    <canvas
      ref={canvasRef}
      className={`ascii-garden ${className}`.trim()}
      role="img"
      aria-label={
        variant === "garden"
          ? "A three-dimensional garden rendered in white ASCII: a layered flower, smaller blooms, folded leaves, and ferns slowly turning in the dark."
          : "A sculptural flower and folded leaves rendered in white ASCII characters."
      }
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      Sculptural flowers and leaves formed entirely from printable ASCII
      characters.
    </canvas>
  );
}
