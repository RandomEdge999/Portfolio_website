import { AppWindow, BrainCircuit, Database, ShieldCheck } from "lucide-react";
import { useState, type CSSProperties, type ReactNode } from "react";
import { systemLayers } from "../data/site";
import type { SystemLayer } from "../types";

const layerIcons: Record<SystemLayer["id"], ReactNode> = {
  interface: <AppWindow size={23} strokeWidth={1.7} />,
  data: <Database size={23} strokeWidth={1.7} />,
  model: <BrainCircuit size={23} strokeWidth={1.7} />,
  approval: <ShieldCheck size={23} strokeWidth={1.7} />,
};

function LayerDemo({ id }: { id: SystemLayer["id"] }) {
  if (id === "interface") {
    return (
      <span className="layer-demo layer-demo-interface" aria-hidden="true">
        <i /><i /><i />
        <b>Review</b>
      </span>
    );
  }

  if (id === "data") {
    return (
      <span className="layer-demo layer-demo-data" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
      </span>
    );
  }

  if (id === "model") {
    return (
      <svg className="layer-demo layer-demo-model" viewBox="0 0 210 58" aria-hidden="true">
        <path d="M12 29H50M64 16h30m-30 26h30m14-26h34m-34 26h34m14-26h34m-34 26h34" />
        <path d="M50 29l14-13m-14 13 14 13m30-26 14 0m-14 26h14m30-26 14 0m-14 26h14" />
        {[12, 50, 64, 94, 108, 138, 152, 186].map((x, index) => (
          <circle key={`${x}-${index}`} cx={x} cy={index === 0 || index === 1 ? 29 : index % 2 === 0 ? 16 : 42} r="4" />
        ))}
      </svg>
    );
  }

  return (
    <span className="layer-demo layer-demo-approval" aria-hidden="true">
      <i>Hold</i>
      <i>Inspect</i>
      <b>Approve</b>
    </span>
  );
}

export default function SystemMap() {
  const [activeLayer, setActiveLayer] = useState<SystemLayer["id"]>("approval");
  const active = systemLayers.find((layer) => layer.id === activeLayer) ?? systemLayers[3];

  return (
    <div className="system-map" onPointerLeave={() => setActiveLayer("approval")}>
      <div className="system-map-key" aria-label="Diagram legend">
        <span><i className="key-control" />Human control path</span>
        <span><i className="key-state" />System state</span>
      </div>

      <div className="system-map-trace" aria-hidden="true">
        <span className="trace-orange" />
        <span className="trace-blue" />
      </div>

      <div className="system-map-layers" aria-label="The four layers of an inspectable AI system">
        {systemLayers.map((layer, index) => (
          <button
            className={`system-layer ${activeLayer === layer.id ? "is-active" : ""}`}
            key={layer.id}
            type="button"
            onPointerEnter={() => setActiveLayer(layer.id)}
            onFocus={() => setActiveLayer(layer.id)}
            aria-pressed={activeLayer === layer.id}
            style={{ "--layer-index": index } as CSSProperties}
          >
            <span className="system-layer-index">{layer.index}</span>
            <span className="system-layer-icon" aria-hidden="true">{layerIcons[layer.id]}</span>
            <span className="system-layer-name">{layer.label}</span>
            <LayerDemo id={layer.id} />
          </button>
        ))}
      </div>

      <div className="system-map-readout" id="system-map-readout" aria-live="polite">
        <span>{active.index} / Active layer</span>
        <strong>{active.title}</strong>
        <p>{active.description}</p>
      </div>
    </div>
  );
}
