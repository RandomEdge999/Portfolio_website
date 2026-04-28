import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const marksDir = join(root, "assets", "project-marks");
const objectsDir = join(root, "assets", "project-objects");

const projects = [
  ["findmyjob", "FJ", "operator", "#d2ff00", 13],
  ["agentwarehouse", "AW", "agent", "#d2ff00", 149],
  ["agentclassroom", "AC", "agent", "#c7ff2a", 29],
  ["rhokpy", "RP", "education", "#d2ff00", 167],
  ["rhok-sat", "RS", "satellite", "#d2ff00", 101],
  ["rgan-research", "RG", "model", "#caff1a", 181],
  ["city-pulse", "CP", "city", "#b9f500", 41],
  ["teacher-evaluation", "TE", "education", "#d8ff44", 57],
  ["soccer-predictor-pro", "SP", "model", "#cfff00", 73],
  ["hand-reading-ai", "HR", "vision", "#e1ff4d", 89],
  ["joby", "JB", "operator", "#c9fb2c", 127],
  ["ai-social-mirror", "SM", "vision", "#ddff55", 199],
  ["adhd-kryptonite", "AK", "reader", "#ceff2d", 211],
  ["heritage-ai", "HA", "education", "#d8ff00", 229],
  ["applypilot", "AP", "operator", "#d2ff00", 241],
  ["campuscloset", "CC", "marketplace", "#d9ff30", 263],
  ["redsubcontinent", "RS", "history", "#d2ff00", 277],
  ["bouquet-venooo", "BV", "creative", "#d2ff00", 293],
  ["git-client", "GC", "utility", "#d2ff00", 307],
  ["swaply", "SW", "archive", "#d2ff00", 331],
  ["cherrypick", "CP", "archive", "#d2ff00", 347],
  ["janestreetathome", "JS", "archive", "#d2ff00", 359],
  ["my-favourite-cinema", "FC", "archive", "#d2ff00", 373],
];

const fmt = (value) => Number(value.toFixed(2));
const line = (x1, y1, x2, y2, cls = "a", extra = "") =>
  `<line class="${cls}" x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" ${extra}/>`;
const rect = (x, y, w, h, cls = "panel", extra = "") =>
  `<rect class="${cls}" x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" ${extra}/>`;
const circle = (cx, cy, r, cls = "a", extra = "") =>
  `<circle class="${cls}" cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(r)}" ${extra}/>`;
const path = (d, cls = "a") => `<path class="${cls}" d="${d}"/>`;

function rails(seed, count = 18) {
  return Array.from({ length: count }, (_, index) => {
    const y = 78 + ((seed * 11 + index * 47) % 420);
    const x = -72 + ((seed * 7 + index * 29) % 260);
    const len = 280 + ((seed + index * 31) % 380);
    return line(x, y, x + len, y - 52, index % 4 === 0 ? "b" : "a", `opacity="${index % 5 === 0 ? 0.72 : 0.35}"`);
  }).join("");
}

function nodes(seed, count = 12) {
  return Array.from({ length: count }, (_, index) => {
    const cx = 92 + ((seed * 19 + index * 67) % 545);
    const cy = 74 + ((seed * 17 + index * 41) % 390);
    return circle(cx, cy, 3 + ((seed + index) % 6), index % 3 === 0 ? "c" : "d");
  }).join("");
}

function chart(seed) {
  const points = Array.from({ length: 9 }, (_, index) => {
    const x = 116 + index * 58;
    const y = 338 - Math.sin((seed + index) * 0.7) * 44 - ((seed + index * 9) % 54);
    return `${fmt(x)},${fmt(y)}`;
  }).join(" ");
  return `<polyline class="b thick" points="${points}"/>${points
    .split(" ")
    .map((pair, index) => {
      const [x, y] = pair.split(",");
      return circle(Number(x), Number(y), index % 2 ? 5 : 3, "c");
    })
    .join("")}`;
}

const objectShapes = {
  operator(seed) {
    return `
      ${rect(146, 118, 250, 208, "box")}
      ${rect(224, 72, 214, 142, "screen tilt")}
      ${rect(92, 256, 182, 144, "paper")}
      ${rect(430, 206, 128, 176, "box side")}
      ${line(188, 168, 356, 168, "b thick")}
      ${line(188, 202, 326, 202, "a")}
      ${line(188, 236, 388, 236, "a")}
      ${line(128, 296, 226, 296, "dark")}
      ${line(128, 330, 244, 330, "dark")}
      ${circle(496, 264, 36, "ring")}
      ${line(522, 290, 586, 346, "b thick")}
      ${rails(seed, 14)}
    `;
  },
  agent(seed) {
    return `
      ${rect(110, 94, 250, 170, "screen")}
      ${rect(368, 138, 190, 156, "box side")}
      ${rect(208, 290, 278, 92, "box")}
      ${circle(236, 182, 42, "ring")}
      ${circle(440, 212, 42, "ring")}
      ${line(278, 182, 398, 212, "b thick")}
      ${line(248, 330, 446, 330, "b")}
      ${nodes(seed, 16)}
      ${rails(seed, 13)}
    `;
  },
  city(seed) {
    return `
      ${rect(96, 306, 98, 98, "box")}
      ${rect(218, 244, 82, 160, "box side")}
      ${rect(328, 184, 118, 220, "box")}
      ${rect(468, 270, 94, 134, "box side")}
      ${path("M84 248 C188 152 276 282 352 198 S520 146 628 232", "map")}
      ${path("M106 342 C196 292 268 382 356 306 S506 266 602 340", "map b")}
      ${circle(352, 198, 46, "ring")}
      ${circle(468, 270, 28, "c")}
      ${nodes(seed, 20)}
    `;
  },
  education(seed) {
    return `
      ${rect(156, 76, 314, 342, "paper")}
      ${rect(196, 124, 232, 46, "box")}
      ${Array.from({ length: 5 }, (_, i) => `${circle(212, 218 + i * 34, 9, i % 2 ? "d" : "c")}${line(240, 218 + i * 34, 402, 218 + i * 34, "dark")}`).join("")}
      ${rect(492, 174, 76, 198, "screen side")}
      ${line(530, 204, 530, 340, "b thick")}
      ${line(502, 238, 556, 238, "a")}
      ${line(502, 294, 556, 294, "a")}
      ${rails(seed, 13)}
    `;
  },
  model(seed) {
    return `
      ${rect(124, 104, 470, 284, "screen")}
      ${chart(seed)}
      ${path("M96 198 C158 108 226 286 292 198 S430 108 500 198 S600 278 650 198", "wave")}
      ${path("M92 250 C156 182 220 318 286 248 S420 182 490 250 S594 310 650 250", "wave b")}
      ${rect(172, 142, 72, 42, "box")}
      ${rect(472, 142, 72, 42, "box side")}
      ${line(244, 164, 472, 164, "a")}
      ${nodes(seed, 14)}
    `;
  },
  vision(seed) {
    return `
      ${rect(132, 94, 456, 306, "screen")}
      ${path("M254 346 L244 210 C242 174 286 172 292 210 L302 284 L314 160 C318 124 364 124 366 160 L370 282 L394 184 C402 150 446 158 440 194 L418 302 L462 224 C476 198 514 220 498 248 L430 366 Z", "hand")}
      ${circle(334, 248, 98, "ring")}
      ${Array.from({ length: 16 }, (_, i) => circle(244 + ((seed + i * 31) % 230), 150 + ((seed + i * 47) % 210), 4, i % 2 ? "c" : "d")).join("")}
      ${line(208, 144, 512, 350, "a")}
      ${line(506, 142, 204, 350, "a")}
    `;
  },
  satellite(seed) {
    return `
      ${rect(294, 196, 120, 104, "cube")}
      ${rect(150, 166, 132, 72, "panel")}
      ${rect(426, 262, 132, 72, "panel")}
      ${line(282, 220, 414, 282, "b thick")}
      ${line(414, 218, 282, 282, "b thick")}
      ${circle(354, 250, 136, "ring")}
      ${circle(354, 250, 206, "orbit")}
      ${path("M74 382 C178 282 284 464 382 360 S562 256 650 342", "map")}
      ${line(80, 426, 234, 310, "a")}
      ${line(80, 426, 308, 372, "a")}
      ${line(80, 426, 394, 392, "a")}
      ${nodes(seed, 14)}
    `;
  },
  reader(seed) {
    return `
      ${rect(132, 76, 456, 344, "paper")}
      ${rect(176, 122, 288, 38, "box")}
      ${Array.from({ length: 9 }, (_, i) => line(176, 202 + i * 24, 526 - (i % 3) * 72, 202 + i * 24, i === 3 ? "b thick" : "dark")).join("")}
      ${rect(156, 272, 410, 36, "highlight")}
      ${path("M178 366 C226 324 266 404 314 366 S408 324 456 366 S526 402 562 366", "wave")}
      ${rails(seed, 10)}
    `;
  },
  marketplace(seed) {
    return `
      ${rect(126, 110, 128, 250, "box")}
      ${rect(298, 92, 128, 268, "box side")}
      ${rect(470, 136, 112, 224, "box")}
      ${line(112, 124, 608, 124, "b thick")}
      ${Array.from({ length: 5 }, (_, i) => `<path class="hanger" d="M${188 + i * 86} 126 L${168 + i * 86} 196 L${208 + i * 86} 196 Z"/>`).join("")}
      ${circle(236, 386, 28, "ring")}
      ${circle(514, 386, 28, "ring")}
      ${rails(seed, 12)}
    `;
  },
  history(seed) {
    return `
      ${rect(96, 96, 528, 324, "screen")}
      ${path("M170 180 C210 130 272 164 300 212 C338 278 438 226 482 310 C510 362 586 328 610 382", "map b")}
      ${Array.from({ length: 8 }, (_, i) => line(142, 148 + i * 31, 574, 148 + i * 31, i % 2 ? "a" : "dark")).join("")}
      ${circle(300, 212, 40, "ring")}
      ${circle(482, 310, 54, "ring")}
      ${nodes(seed, 20)}
    `;
  },
  creative(seed) {
    return `
      ${circle(360, 258, 104, "ring")}
      ${Array.from({ length: 9 }, (_, i) => {
        const a = i * 0.72;
        const x = 360 + Math.cos(a) * (72 + (i % 3) * 18);
        const y = 258 + Math.sin(a) * (72 + (i % 2) * 24);
        return `${circle(x, y, 34 + (i % 3) * 6, i % 2 ? "petal" : "petal b")}${line(360, 258, x, y, "a")}`;
      }).join("")}
      ${rect(224, 350, 270, 58, "paper")}
      ${line(254, 378, 464, 378, "dark")}
      ${rails(seed, 10)}
    `;
  },
  utility(seed) {
    return `
      ${rect(132, 108, 456, 300, "screen")}
      ${Array.from({ length: 5 }, (_, i) => `${circle(196 + i * 82, 214 + (i % 2) * 64, 26, "ring")}${line(222 + i * 82, 214 + (i % 2) * 64, 260 + i * 82, 278 - (i % 2) * 64, "b")}`).join("")}
      ${line(170, 142, 550, 142, "a")}
      ${line(170, 372, 550, 372, "a")}
      ${nodes(seed, 14)}
    `;
  },
  archive(seed) {
    return `
      ${rect(160, 124, 400, 270, "screen")}
      ${circle(280, 258, 62, "ring")}
      ${circle(440, 258, 62, "ring")}
      ${line(324, 258, 396, 258, "b thick")}
      ${rails(seed, 11)}
    `;
  },
};

function markSvg(slug, initials, group, accent, seed) {
  const satellite = group === "satellite";
  const archive = group === "archive";
  if (satellite) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 240 240" fill="none">
  <style>
    .bg{fill:#101012}
    .lime{stroke:${accent};fill:none;stroke-linecap:square;stroke-linejoin:miter}
    .paper{stroke:#f4f4ed;fill:none;stroke-linecap:square;stroke-linejoin:miter}
    .fill{fill:${accent}}
    .ink{fill:#101012}
    .type{fill:#f4f4ed;font-family:Arial Black,Arial,sans-serif;font-size:31px;font-weight:900}
    .small{fill:${accent};font-family:Arial Black,Arial,sans-serif;font-size:16px;font-weight:900}
  </style>
  <path class="bg" d="M18 36h132l20-18h52v152l-28 52H58l-40-40V36Z"/>
  <path class="lime" stroke-width="5" d="M18 36h132l20-18h52v152l-28 52H58l-40-40V36Z"/>
  <path class="lime" stroke-width="3" d="M36 148C66 60 166 42 210 108"/>
  <path class="lime" stroke-width="3" d="M26 94c54 54 124 78 194 38"/>
  <path class="paper" stroke-width="2" d="M54 178c42-40 92-42 150-6"/>
  <path class="paper" stroke-width="2" d="M78 186v22M116 178v30M154 178v30M192 186v22"/>
  <g transform="rotate(-13 122 107)">
    <path class="lime" stroke-width="4" d="M82 86h80v52H82z"/>
    <path class="lime" stroke-width="3" d="M42 92h40M162 92h40M42 132h40M162 132h40"/>
    <path class="paper" stroke-width="2" d="M98 86v52M122 86v52M146 86v52M82 103h80M82 120h80"/>
    <circle class="fill" cx="122" cy="112" r="8"/>
    <circle class="ink" cx="122" cy="112" r="3"/>
  </g>
  <text class="type" x="34" y="67">RHOK</text>
  <text class="small" x="147" y="207">SAT</text>
</svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 240 240" fill="none">
  <style>
    .bg{fill:#101012}
    .edge{stroke:${accent};stroke-width:4;stroke-linejoin:miter}
    .fine{stroke:#f4f4ed;stroke-width:2;opacity:.72}
    .lime{stroke:${accent};fill:none}
    .fill{fill:${accent}}
    .type{fill:${archive ? "#d2ff00" : "#f4f4ed"};font-family:Arial Black,Arial,sans-serif;font-size:${initials.length > 2 ? 48 : 64}px;font-weight:900;letter-spacing:-2px}
  </style>
  <path class="bg" d="M24 20h154l38 38v158H62l-38-38V20Z"/>
  <path class="edge" d="M24 20h154l38 38v158H62l-38-38V20Z"/>
  <path class="fine" d="M42 ${62 + (seed % 22)}h154M42 ${106 + (seed % 18)}h154M42 ${150 + (seed % 16)}h154"/><path class="lime" stroke-width="4" d="M42 172l42-92 42 70 42-106 30 74"/><circle class="fill" cx="${66 + (seed % 86)}" cy="${58 + (seed % 92)}" r="6"/>
  <text class="type" x="36" y="216">${initials}</text>
</svg>`;
}

function objectSvg(slug, group, accent, seed) {
  const body = (objectShapes[group] ?? objectShapes.archive)(seed);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1040" viewBox="0 0 720 520" fill="none">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <linearGradient id="panel" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#2b301f"/>
      <stop offset="1" stop-color="#111112"/>
    </linearGradient>
  </defs>
  <style>
    .a{stroke:${accent};stroke-width:2;stroke-linecap:square;stroke-linejoin:miter;filter:url(#glow)}
    .b{stroke:${accent};stroke-width:4;stroke-linecap:square;stroke-linejoin:miter;filter:url(#glow)}
    .c{fill:${accent};filter:url(#glow)}
    .d{fill:#f4f4ed;opacity:.72}
    .dark{stroke:#141414;stroke-width:4;stroke-linecap:square}
    .box{fill:url(#panel);stroke:#f4f4ed;stroke-width:2;opacity:.96}
    .screen,.panel,.cube{fill:#151812;stroke:${accent};stroke-width:2;opacity:.94}
    .paper{fill:#f4f4ed;stroke:#111112;stroke-width:2;opacity:.95}
    .side{opacity:.74}
    .tilt{transform:rotate(-8deg);transform-origin:center}
    .ring,.orbit{stroke:${accent};stroke-width:3;opacity:.84}
    .orbit{stroke-dasharray:12 18;opacity:.7}
    .map,.wave{stroke:#f4f4ed;stroke-width:3;opacity:.74}
    .hand{fill:#f4f4ed;stroke:#111112;stroke-width:3;opacity:.92}
    .highlight,.petal{fill:${accent};opacity:.55}
    .hanger{stroke:${accent};stroke-width:3;fill:none;opacity:.86}
    .thick{stroke-width:5}
  </style>
  <g opacity=".16">${rails(seed + 3, 24)}</g>
  <g>${body}</g>
  <g opacity=".38">${nodes(seed + 5, 10)}</g>
</svg>`;
}

mkdirSync(marksDir, { recursive: true });
mkdirSync(objectsDir, { recursive: true });

for (const [slug, initials, group, accent, seed] of projects) {
  writeFileSync(join(marksDir, `${slug}.svg`), markSvg(slug, initials, group, accent, seed));
  writeFileSync(join(objectsDir, `${slug}.svg`), objectSvg(slug, group, accent, seed));
}
