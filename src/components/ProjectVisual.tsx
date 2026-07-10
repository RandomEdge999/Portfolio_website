import { Check, CircleUserRound, Database, FileText, Play, RadioTower, Search, TerminalSquare } from "lucide-react";
import type { CaseStudyVisual } from "../types";

function AgentsVisual() {
  return (
    <div className="project-visual visual-agents" role="img" aria-label="Diagram of agent terminals, trace events, and an approval queue">
      <div className="visual-topbar">
        <span>Runtime / cycle 014</span>
        <b>3 agents active</b>
      </div>
      <div className="agent-sidebar">
        {["Planner", "Builder", "Verifier"].map((agent, index) => (
          <div className={index === 1 ? "is-current" : ""} key={agent}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{agent}</strong>
            <i>{index === 1 ? "waiting" : "running"}</i>
          </div>
        ))}
      </div>
      <div className="agent-terminal">
        <div className="terminal-title"><TerminalSquare size={14} /> builder / workspace</div>
        <code><span>$</span> pnpm check</code>
        <code>✓ types&nbsp;&nbsp;✓ tests&nbsp;&nbsp;✓ build</code>
        <code><span>$</span> awaiting operator approval_</code>
        <div className="terminal-cursor" />
      </div>
      <div className="approval-ticket">
        <span>Approval required</span>
        <strong>Apply verified patch?</strong>
        <div><i>Inspect</i><i>Approve</i></div>
      </div>
      <div className="trace-strip" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </div>
    </div>
  );
}

function ForecastVisual() {
  return (
    <div className="project-visual visual-forecast" role="img" aria-label="Forecast comparison diagram showing observed, regression, and residual signals">
      <div className="visual-topbar">
        <span>Evaluation / volatile regime</span>
        <b>Window 096</b>
      </div>
      <div className="forecast-legend">
        <span><i className="observed" />Observed</span>
        <span><i className="regression" />Regression</span>
        <span><i className="residual" />Residual model</span>
      </div>
      <svg className="forecast-chart" viewBox="0 0 760 360" preserveAspectRatio="none" aria-hidden="true">
        <g className="chart-grid">
          {[60, 120, 180, 240, 300].map((y) => <line key={`y-${y}`} x1="0" x2="760" y1={y} y2={y} />)}
          {[95, 190, 285, 380, 475, 570, 665].map((x) => <line key={`x-${x}`} x1={x} x2={x} y1="0" y2="360" />)}
        </g>
        <path className="chart-observed" d="M0 255C30 220 50 278 78 232S124 90 154 164s42 160 75 104 44-170 78-130 38 100 69 56 42-150 80-92 50 182 86 130 42-112 76-74 42 120 80 60 38-128 62-98" />
        <path className="chart-regression" d="M0 248C64 228 104 178 158 185s94 68 146 42 87-79 140-61 99 86 154 54 96-74 162-46" />
        <path className="chart-residual" d="M0 252C48 242 89 205 132 195s88 45 133 42 80-46 128-56 95 54 145 49 90-51 122-56" />
      </svg>
      <div className="forecast-metrics">
        {["RMSE", "MAE", "MAPE", "VAR"].map((metric, index) => (
          <div key={metric}><span>{metric}</span><strong>{["tracked", "tracked", "tracked", "reviewed"][index]}</strong><i /></div>
        ))}
      </div>
    </div>
  );
}

function OperatorVisual() {
  const steps = [
    { icon: <Search size={17} />, label: "Discover" },
    { icon: <Database size={17} />, label: "Screen" },
    { icon: <FileText size={17} />, label: "Draft" },
    { icon: <CircleUserRound size={17} />, label: "Review" },
    { icon: <Play size={17} />, label: "Act" },
  ];

  return (
    <div className="project-visual visual-operator" role="img" aria-label="Five-stage supervised workflow from job discovery to approved browser action">
      <div className="visual-topbar">
        <span>Local operator / preview mode</span>
        <b>Human supervised</b>
      </div>
      <div className="operator-pipeline">
        {steps.map((step, index) => (
          <div className={step.label === "Review" ? "is-gate" : ""} key={step.label}>
            <span>{step.icon}</span>
            <strong>{step.label}</strong>
            <small>{String(index + 1).padStart(2, "0")}</small>
          </div>
        ))}
      </div>
      <div className="operator-ledger">
        <span>Alignment review</span>
        <strong>Software Engineer · screening complete</strong>
        <i><b style={{ width: "78%" }} /></i>
        <ul>
          <li><Check size={13} /> Sponsorship language checked</li>
          <li><Check size={13} /> Tailored materials previewed</li>
          <li><Check size={13} /> Browser action awaiting approval</li>
        </ul>
      </div>
      <div className="operator-approval">
        <span>Operator gate</span>
        <strong>Review before browser action</strong>
        <i>Approve next step</i>
      </div>
    </div>
  );
}

function TelemetryVisual() {
  return (
    <div className="project-visual visual-telemetry" role="img" aria-label="CubeSat orbit, packet stream, and telemetry quality diagram">
      <div className="visual-topbar">
        <span>Ground station / packet stream</span>
        <b>Signal acquired</b>
      </div>
      <div className="orbit-stage" aria-hidden="true">
        <svg viewBox="0 0 420 310">
          <ellipse cx="210" cy="155" rx="162" ry="88" />
          <ellipse cx="210" cy="155" rx="105" ry="145" transform="rotate(58 210 155)" />
          <circle cx="210" cy="155" r="44" />
          <path d="M185 155h50M210 130v50" />
          <g className="satellite-mark" transform="translate(329 88)">
            <rect x="-13" y="-9" width="26" height="18" />
            <path d="M-35-13h18v26h-18zm52 0h18v26H17zM0-9v-14" />
          </g>
          <circle className="orbit-pulse" cx="329" cy="88" r="5" />
        </svg>
        <RadioTower size={29} />
      </div>
      <div className="packet-stream">
        {[
          ["A1-229", "valid"],
          ["A1-230", "valid"],
          ["A1-231", "loss"],
          ["A1-232", "valid"],
        ].map(([packet, state]) => (
          <div className={state === "loss" ? "has-loss" : ""} key={packet}><span>{packet}</span><i /><b>{state}</b></div>
        ))}
      </div>
      <div className="telemetry-readout">
        <div><span>Packets</span><strong>captured</strong></div>
        <div><span>Integrity</span><strong>checked</strong></div>
        <div><span>Window</span><strong>selected</strong></div>
      </div>
    </div>
  );
}

export default function ProjectVisual({ visual }: { visual: CaseStudyVisual }) {
  if (visual === "agents") return <AgentsVisual />;
  if (visual === "forecast") return <ForecastVisual />;
  if (visual === "operator") return <OperatorVisual />;
  return <TelemetryVisual />;
}
