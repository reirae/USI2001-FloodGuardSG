import { useState, useEffect, useRef } from "react";

const COLORS = {
  blue: "#1a6eb5",
  blueDark: "#0d4a82",
  blueLight: "#e8f2fb",
  teal: "#0f7c5c",
  tealLight: "#e0f5ee",
  amber: "#c47a0f",
  amberLight: "#fef3dc",
  red: "#c0392b",
  redLight: "#fdecea",
  green: "#2e7d32",
  greenLight: "#e8f5e9",
  gray: "#5f5e5a",
  grayLight: "#f4f3f0",
};

const SINGAPORE_AREAS = [
  { id: 1, name: "Orchard", x: 340, y: 200, risk: "medium" },
  { id: 2, name: "Bukit Timah", x: 270, y: 170, risk: "high" },
  { id: 3, name: "Tampines", x: 560, y: 230, risk: "low" },
  { id: 4, name: "Jurong", x: 180, y: 280, risk: "high" },
  { id: 5, name: "Bedok", x: 520, y: 310, risk: "medium" },
  { id: 6, name: "Woodlands", x: 310, y: 80, risk: "low" },
  { id: 7, name: "Yishun", x: 380, y: 90, risk: "medium" },
  { id: 8, name: "Ang Mo Kio", x: 390, y: 160, risk: "low" },
  { id: 9, name: "Clementi", x: 240, y: 280, risk: "medium" },
  { id: 10, name: "Pasir Ris", x: 590, y: 170, risk: "low" },
  { id: 11, name: "Sengkang", x: 470, y: 140, risk: "medium" },
  { id: 12, name: "Toa Payoh", x: 390, y: 190, risk: "low" },
  { id: 13, name: "Marina Bay", x: 420, y: 330, risk: "high" },
  { id: 14, name: "Punggol", x: 510, y: 110, risk: "low" },
  { id: 15, name: "Queenstown", x: 320, y: 270, risk: "medium" },
];

const FLOOD_REPORTS = [
  { id: 1, area: "Bukit Timah", severity: "high", time: "10 min ago", x: 270, y: 170, desc: "Road flooded near Bt Timah Plaza" },
  { id: 2, area: "Jurong West", severity: "high", time: "25 min ago", x: 180, y: 280, desc: "Underpass submerged, avoid PIE exit 35" },
  { id: 3, area: "Orchard", severity: "medium", time: "42 min ago", x: 340, y: 200, desc: "Surface flooding along Orchard Road" },
  { id: 4, area: "Marina Bay", severity: "medium", time: "1 hr ago", x: 420, y: 330, desc: "Carpark B2 partially flooded" },
  { id: 5, area: "Clementi", severity: "low", time: "1.5 hr ago", x: 240, y: 280, desc: "Minor ponding near Ave 3 bus stop" },
];

const SCENARIOS = [
  {
    id: 1,
    phase: "Before",
    title: "Preparing for Heavy Rain",
    story: "PUB has issued a Heavy Rain Warning for your area. It's currently sunny but dark clouds are forming. You have about 30 minutes before the downpour.",
    image: "🌤️",
    choices: [
      { text: "Continue with your outdoor plans — it'll probably miss us", outcome: "bad", feedback: "Incorrect. Singapore flash floods can develop within 30 minutes. Never ignore PUB Heavy Rain Warnings — you could get stranded in dangerous conditions." },
      { text: "Check PUB flood maps to know if your area is prone to flooding", outcome: "good", feedback: "Correct! Knowing your area's flood risk in advance helps you make better decisions. PUB maintains an updated flood risk map at their website." },
      { text: "Head to the nearest basement carpark to wait it out", outcome: "bad", feedback: "Dangerous! Basement carparks are one of the highest-risk areas during flash floods. Water can fill them rapidly with little warning." },
      { text: "Move your belongings upstairs, prepare sandbags if available, and stay indoors", outcome: "best", feedback: "Excellent! Proactive preparation — elevating items, deploying flood barriers, and staying indoors — is the ideal response to an incoming heavy rain warning." },
    ],
  },
  {
    id: 2,
    phase: "During",
    title: "Flash Flood in Progress",
    story: "You are driving home and suddenly encounter water rising rapidly on the road ahead. The level looks about 20cm and climbing. Your car is a normal sedan.",
    image: "🚗",
    choices: [
      { text: "Drive through quickly — momentum should get you across", outcome: "bad", feedback: "Very dangerous! Even 30cm of moving water can sweep away a car. More than half of flood-related deaths occur in vehicles. Never attempt to drive through floodwater." },
      { text: "Stop, turn around, and find an alternate route", outcome: "best", feedback: "Correct! 'Turn Around, Don't Drown' is the key rule. Find an alternative route and report the flooding to PUB via the MyWaters app." },
      { text: "Park the car and wade through on foot", outcome: "bad", feedback: "Incorrect. Walking through floodwater is dangerous — it can contain debris, open drains, and electrical hazards. Currents are also stronger than they appear." },
      { text: "Wait in your car for the water to subside", outcome: "ok", feedback: "Partially correct — waiting is safer than driving through. However, if water continues rising, you should exit the vehicle and move to higher ground immediately." },
    ],
  },
  {
    id: 3,
    phase: "During",
    title: "Trapped in a Ground-Floor Unit",
    story: "Water is seeping under your door. It's rising slowly — about 5cm in the last 10 minutes. You are on the ground floor of an HDB block. Electricity is still on.",
    image: "🏠",
    choices: [
      { text: "Turn off the main electrical switch and move to a higher floor immediately", outcome: "best", feedback: "Correct! Turning off electricity prevents electrocution hazards. Moving to a higher floor keeps you safe as water rises. This is the ideal sequence of actions." },
      { text: "Keep the electrical appliances on to stay informed via TV/radio", outcome: "bad", feedback: "Dangerous! Electricity and water are a lethal combination. Turn off your main switch immediately when water starts entering your home." },
      { text: "Use towels and sandbags to block the water and stay put", outcome: "ok", feedback: "Partially useful — flood barriers can slow ingress. But if water is rising significantly, you should still evacuate to a higher floor as a precaution." },
      { text: "Open the front door to let water flow through faster", outcome: "bad", feedback: "Incorrect. Opening the door allows more water and debris to enter rapidly, worsening conditions and creating stronger currents inside your unit." },
    ],
  },
  {
    id: 4,
    phase: "After",
    title: "Flood Receding — Returning Home",
    story: "The rain has stopped and authorities say the water is receding. You want to return to your ground-floor flat to assess damage. Floodwater has just cleared from the streets.",
    image: "🌊",
    choices: [
      { text: "Return immediately and turn on all appliances to check what survived", outcome: "bad", feedback: "Dangerous! Never turn on electrical appliances after flooding without professional inspection. Water damage is not always visible and can cause electrocution or fire." },
      { text: "Wait for PUB/SCDF to declare the area safe, then inspect before turning on utilities", outcome: "best", feedback: "Correct! Always wait for official clearance. Have a qualified electrician inspect your wiring before restoring power. Document all damage with photos for insurance claims." },
      { text: "Drink tap water to check if the supply is safe", outcome: "bad", feedback: "Incorrect. Floodwater can contaminate water supplies. Wait for official confirmation that tap water is safe to drink, or boil it first." },
      { text: "Clean up immediately without any protective gear", outcome: "bad", feedback: "Avoid this. Floodwater contains bacteria, sewage and chemical contaminants. Always wear waterproof boots, gloves, and protective clothing when cleaning up after a flood." },
    ],
  },
];

const RAINFALL_DATA = [45, 12, 8, 67, 134, 89, 23, 15, 45, 78, 112, 56, 34, 18, 91, 143, 67, 29, 11, 55, 88, 76, 43, 22];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHLY_AVG = [167, 107, 174, 168, 165, 130, 155, 155, 163, 177, 256, 295];

export default function FloodGuardSG() {
  const [activeTab, setActiveTab] = useState("map");
  const [reports, setReports] = useState(FLOOD_REPORTS);
  const [reportForm, setReportForm] = useState(false);
  const [newReport, setNewReport] = useState({ area: "", severity: "medium", desc: "" });
  const [selectedArea, setSelectedArea] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [gameScenario, setGameScenario] = useState(0);
  const [gameState, setGameState] = useState("playing");
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const [checklist, setChecklist] = useState([
    { id: 1, text: "Store emergency water supply (3L per person per day)", done: false },
    { id: 2, text: "Keep important documents in waterproof container", done: false },
    { id: 3, text: "Subscribe to PUB Telegram flood alerts", done: false },
    { id: 4, text: "Know your nearest evacuation route", done: false },
    { id: 5, text: "Have a portable battery bank charged", done: false },
    { id: 6, text: "Purchase sandbags or flood barriers", done: false },
    { id: 7, text: "Know how to turn off your main electricity switch", done: false },
    { id: 8, text: "Save PUB emergency number: 1800-284-6600", done: false },
  ]);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (activeTab !== "dashboard") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const pad = { top: 20, right: 20, bottom: 40, left: 45 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    ctx.clearRect(0, 0, W, H);
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const textColor = isDark ? "#ccc" : "#555";
    const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
    const maxVal = 200;
    const barW = chartW / 24 - 4;
    ctx.font = "11px sans-serif";
    ctx.fillStyle = textColor;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + chartH - (i / 4) * chartH;
      ctx.fillStyle = gridColor.replace("rgba", "rgba");
      ctx.strokeStyle = gridColor;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + chartW, y); ctx.stroke();
      ctx.fillStyle = textColor;
      ctx.textAlign = "right";
      ctx.fillText((i * 50) + "mm", pad.left - 6, y + 4);
    }
    RAINFALL_DATA.forEach((val, i) => {
      const x = pad.left + i * (chartW / 24) + 2;
      const barH = (val / maxVal) * chartH;
      const y = pad.top + chartH - barH;
      const isHigh = val > 100;
      ctx.fillStyle = isHigh ? "#c0392b" : val > 60 ? "#e67e22" : COLORS.blue;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, 2);
      ctx.fill();
    });
    const hourLabels = ["00", "03", "06", "09", "12", "15", "18", "21"];
    hourLabels.forEach((lbl, i) => {
      const x = pad.left + (i * 3) * (chartW / 24) + barW / 2;
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.fillText(lbl + ":00", x, pad.top + chartH + 16);
    });
  }, [activeTab]);

  function handleChoice(choice, idx) {
    setSelectedChoice(idx);
    const pts = choice.outcome === "best" ? 3 : choice.outcome === "good" ? 2 : choice.outcome === "ok" ? 1 : 0;
    setScore(s => s + pts);
    setAnswers(a => [...a, { scenario: gameScenario, pts, outcome: choice.outcome }]);
    setGameState("feedback");
  }

  function nextScenario() {
    if (gameScenario + 1 >= SCENARIOS.length) {
      setGameState("complete");
    } else {
      setGameScenario(s => s + 1);
      setGameState("playing");
      setSelectedChoice(null);
    }
  }

  function resetGame() {
    setGameScenario(0);
    setGameState("playing");
    setSelectedChoice(null);
    setScore(0);
    setAnswers([]);
  }

  function submitReport() {
    if (!newReport.area || !newReport.desc) return;
    const area = SINGAPORE_AREAS.find(a => a.name === newReport.area);
    setReports(r => [{
      id: Date.now(),
      area: newReport.area,
      severity: newReport.severity,
      time: "Just now",
      x: area ? area.x + Math.random() * 20 - 10 : 350,
      y: area ? area.y + Math.random() * 20 - 10 : 200,
      desc: newReport.desc,
    }, ...r]);
    setSubmitted(true);
    setTimeout(() => { setReportForm(false); setSubmitted(false); setNewReport({ area: "", severity: "medium", desc: "" }); }, 1500);
  }

  const severityColor = (s) => s === "high" ? COLORS.red : s === "medium" ? COLORS.amber : COLORS.blue;
  const severityBg = (s) => s === "high" ? COLORS.redLight : s === "medium" ? COLORS.amberLight : COLORS.blueLight;
  const riskColor = (r) => r === "high" ? COLORS.red : r === "medium" ? COLORS.amber : COLORS.teal;

  const scenario = SCENARIOS[gameScenario];
  const checklistDone = checklist.filter(c => c.done).length;
  const maxScore = SCENARIOS.length * 3;

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif", minHeight: "100vh", background: "var(--color-background-tertiary)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .tab-btn { padding: 10px 20px; border: none; cursor: pointer; font-size: 14px; font-weight: 500; font-family: inherit; background: none; transition: all .15s; white-space: nowrap; }
        .tab-btn.active { color: ${COLORS.blue}; border-bottom: 2.5px solid ${COLORS.blue}; }
        .tab-btn:not(.active) { color: var(--color-text-secondary); border-bottom: 2.5px solid transparent; }
        .tab-btn:hover:not(.active) { color: var(--color-text-primary); }
        .card { background: var(--color-background-primary); border: 0.5px solid var(--color-border-tertiary); border-radius: 12px; padding: 1rem 1.25rem; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 500; }
        .choice-btn { width: 100%; text-align: left; padding: 12px 14px; border-radius: 8px; border: 1px solid var(--color-border-secondary); background: var(--color-background-primary); cursor: pointer; font-size: 14px; font-family: inherit; color: var(--color-text-primary); transition: all .15s; margin-bottom: 8px; line-height: 1.4; }
        .choice-btn:hover:not(:disabled) { background: var(--color-background-secondary); border-color: ${COLORS.blue}; }
        .choice-btn:disabled { cursor: default; opacity: 0.7; }
        .choice-btn.selected-best { border-color: ${COLORS.green}; background: ${COLORS.greenLight}; }
        .choice-btn.selected-good { border-color: ${COLORS.teal}; background: ${COLORS.tealLight}; }
        .choice-btn.selected-ok { border-color: ${COLORS.amber}; background: ${COLORS.amberLight}; }
        .choice-btn.selected-bad { border-color: ${COLORS.red}; background: ${COLORS.redLight}; }
        .check-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 0.5px solid var(--color-border-tertiary); cursor: pointer; }
        .check-item:last-child { border-bottom: none; }
        .check-box { width: 18px; height: 18px; border-radius: 4px; border: 1.5px solid var(--color-border-primary); flex-shrink: 0; display: flex; align-items: center; justify-content: center; margin-top: 2px; transition: all .15s; }
        .check-box.done { background: ${COLORS.teal}; border-color: ${COLORS.teal}; }
        .primary-btn { background: ${COLORS.blue}; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 500; font-size: 14px; font-family: inherit; transition: background .15s; }
        .primary-btn:hover { background: ${COLORS.blueDark}; }
        .secondary-btn { background: none; color: ${COLORS.blue}; border: 1px solid ${COLORS.blue}; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 500; font-size: 14px; font-family: inherit; transition: all .15s; }
        .secondary-btn:hover { background: ${COLORS.blueLight}; }
        select, input, textarea { font-family: inherit; font-size: 14px; padding: 8px 10px; border: 1px solid var(--color-border-secondary); border-radius: 8px; background: var(--color-background-primary); color: var(--color-text-primary); width: 100%; }
        textarea { resize: vertical; min-height: 70px; }
        .map-area { position: absolute; cursor: pointer; transform: translate(-50%, -50%); }
        .map-pin { position: absolute; cursor: pointer; transform: translate(-50%, -100%); }
        .phase-tag { font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 999px; }
        .stat-card { background: var(--color-background-secondary); border-radius: 8px; padding: 1rem; text-align: center; }
      `}</style>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.blueDark} 0%, ${COLORS.blue} 60%, #1a8c9b 100%)`, padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ fontSize: 28 }}>🌊</div>
        <div>
          <div style={{ color: "#fff", fontWeight: 600, fontSize: 20, letterSpacing: "-0.3px" }}>FloodGuard SG</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Community Flood Awareness & Preparedness</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          <div style={{ background: "rgba(255,255,255,0.18)", color: "#fff", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 500 }}>
            ⚠️ Heavy Rain Watch Active
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "var(--color-background-primary)", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", gap: 0, padding: "0 1.5rem", overflowX: "auto" }}>
        {[
          { id: "map", label: "🗺️ Flood Map" },
          { id: "game", label: "🎮 Preparedness Game" },
          { id: "dashboard", label: "📊 Risk Dashboard" },
        ].map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "1.25rem 1.5rem", maxWidth: 900, margin: "0 auto" }}>

        {/* ===== MAP TAB ===== */}
        {activeTab === "map" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 16 }}>Real-time Flood Reports</div>
                <div style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>{reports.length} active reports · Updated just now</div>
              </div>
              <button className="primary-btn" onClick={() => setReportForm(true)}>+ Report Flooding</button>
            </div>

            {/* Map */}
            <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: "1rem" }}>
              <div style={{ position: "relative", height: 420, background: "#e8eff8", overflow: "hidden" }}>
                {/* Singapore outline illustration */}
                <svg width="100%" height="100%" viewBox="0 0 700 420" style={{ position: "absolute", top: 0, left: 0 }}>
                  <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(100,140,180,0.15)" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="700" height="420" fill="#dce8f5"/>
                  <rect width="700" height="420" fill="url(#grid)"/>
                  <ellipse cx="350" cy="220" rx="260" ry="120" fill="#c8dbe8" stroke="rgba(100,140,180,0.3)" strokeWidth="1"/>
                  <ellipse cx="350" cy="215" rx="245" ry="108" fill="#d8e8f0" stroke="rgba(100,140,180,0.2)" strokeWidth="0.5"/>
                  <text x="350" y="380" textAnchor="middle" fill="rgba(100,140,180,0.5)" fontSize="11">Singapore</text>
                  <text x="160" y="80" textAnchor="middle" fill="rgba(100,140,180,0.4)" fontSize="10">Johor Strait</text>
                  <text x="350" y="410" textAnchor="middle" fill="rgba(100,140,180,0.4)" fontSize="10">Singapore Strait</text>
                  {SINGAPORE_AREAS.map(area => (
                    <g key={area.id}>
                      <circle cx={area.x} cy={area.y} r={selectedArea?.id === area.id ? 22 : 18}
                        fill={`${riskColor(area.risk)}22`}
                        stroke={riskColor(area.risk)}
                        strokeWidth={selectedArea?.id === area.id ? 2 : 1}
                        style={{ cursor: "pointer", transition: "all .2s" }}
                        onClick={() => setSelectedArea(selectedArea?.id === area.id ? null : area)}
                      />
                      <text x={area.x} y={area.y + 1} textAnchor="middle" dominantBaseline="middle"
                        fill={riskColor(area.risk)} fontSize="9" fontWeight="500" style={{ pointerEvents: "none" }}>
                        {area.name.split(" ")[0]}
                      </text>
                    </g>
                  ))}
                  {reports.map(r => (
                    <g key={r.id}>
                      <circle cx={r.x} cy={r.y} r="8" fill={severityColor(r.severity)} opacity="0.85"/>
                      <circle cx={r.x} cy={r.y} r="14" fill={severityColor(r.severity)} opacity="0.2"/>
                      <text x={r.x} y={r.y + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="8">!</text>
                    </g>
                  ))}
                </svg>

                {/* Map legend */}
                <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(255,255,255,0.92)", borderRadius: 8, padding: "8px 12px", fontSize: 11 }}>
                  <div style={{ fontWeight: 500, marginBottom: 4 }}>Flood Risk</div>
                  {["high", "medium", "low"].map(r => (
                    <div key={r} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: riskColor(r) }}></div>
                      <span style={{ textTransform: "capitalize", color: "#444" }}>{r}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "0.5px solid #ccc", marginTop: 6, paddingTop: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.red }}></div>
                      <span style={{ color: "#444" }}>Active report</span>
                    </div>
                  </div>
                </div>

                {selectedArea && (
                  <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.95)", borderRadius: 10, padding: "10px 14px", minWidth: 180, border: `1px solid ${riskColor(selectedArea.risk)}` }}>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>{selectedArea.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: riskColor(selectedArea.risk), fontWeight: 500, fontSize: 13 }}>
                        {selectedArea.risk.charAt(0).toUpperCase() + selectedArea.risk.slice(1)} Risk
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                      {reports.filter(r => r.area.includes(selectedArea.name)).length} active reports nearby
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Report Form */}
            {reportForm && (
              <div className="card" style={{ marginBottom: "1rem", border: `1px solid ${COLORS.blue}` }}>
                <div style={{ fontWeight: 500, marginBottom: "0.75rem", color: COLORS.blue }}>Report a Flood Incident</div>
                {submitted ? (
                  <div style={{ textAlign: "center", padding: "1rem", color: COLORS.green, fontWeight: 500 }}>✓ Report submitted! Thank you for helping your community.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>Area</div>
                        <select value={newReport.area} onChange={e => setNewReport(r => ({ ...r, area: e.target.value }))}>
                          <option value="">Select area...</option>
                          {SINGAPORE_AREAS.map(a => <option key={a.id}>{a.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>Severity</div>
                        <select value={newReport.severity} onChange={e => setNewReport(r => ({ ...r, severity: e.target.value }))}>
                          <option value="low">Low – minor ponding</option>
                          <option value="medium">Medium – road affected</option>
                          <option value="high">High – dangerous levels</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>Description</div>
                      <textarea value={newReport.desc} onChange={e => setNewReport(r => ({ ...r, desc: e.target.value }))} placeholder="Describe what you see (e.g. water level, blocked roads, danger)..." />
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="primary-btn" onClick={submitReport}>Submit Report</button>
                      <button className="secondary-btn" onClick={() => setReportForm(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recent reports list */}
            <div className="card">
              <div style={{ fontWeight: 500, marginBottom: "0.75rem" }}>Recent Reports</div>
              {reports.slice(0, 5).map((r, i) => (
                <div key={r.id} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 0", borderBottom: i < reports.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: severityColor(r.severity), flexShrink: 0, marginTop: 5 }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontWeight: 500, fontSize: 14 }}>{r.area}</span>
                      <span className="badge" style={{ background: severityBg(r.severity), color: severityColor(r.severity) }}>
                        {r.severity}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{r.desc}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", flexShrink: 0 }}>{r.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== GAME TAB ===== */}
        {activeTab === "game" && (
          <div>
            {gameState === "complete" ? (
              <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
                <div style={{ fontSize: 48, marginBottom: "1rem" }}>🏆</div>
                <div style={{ fontWeight: 600, fontSize: 22, marginBottom: "0.5rem" }}>Game Complete!</div>
                <div style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>You scored {score} out of {maxScore} points</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "1.5rem" }}>
                  {answers.map((a, i) => (
                    <div key={i} className="stat-card">
                      <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4 }}>Scenario {i + 1}</div>
                      <div style={{ fontWeight: 500, color: a.outcome === "best" ? COLORS.green : a.outcome === "good" ? COLORS.teal : a.outcome === "ok" ? COLORS.amber : COLORS.red }}>
                        {a.pts}/{3} pts
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: score >= 10 ? COLORS.greenLight : score >= 6 ? COLORS.amberLight : COLORS.redLight, borderRadius: 8, padding: "12px 16px", marginBottom: "1.5rem", color: score >= 10 ? COLORS.green : score >= 6 ? COLORS.amber : COLORS.red, fontWeight: 500 }}>
                  {score >= 10 ? "Excellent! You are well-prepared for flood emergencies." : score >= 6 ? "Good effort. Review the scenarios you missed to improve your readiness." : "Keep learning! Flood preparedness knowledge can save lives."}
                </div>
                <button className="primary-btn" onClick={resetGame}>Play Again</button>
              </div>
            ) : (
              <div>
                {/* Progress */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                  <div style={{ flex: 1, height: 6, background: "var(--color-background-secondary)", borderRadius: 999 }}>
                    <div style={{ width: `${((gameScenario) / SCENARIOS.length) * 100}%`, height: "100%", background: COLORS.blue, borderRadius: 999, transition: "width .3s" }}></div>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--color-text-secondary)", flexShrink: 0 }}>
                    {gameScenario + 1} / {SCENARIOS.length} · {score} pts
                  </div>
                </div>

                <div className="card">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                    <span style={{ fontSize: 32 }}>{scenario.image}</span>
                    <div>
                      <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                        <span className="phase-tag" style={{ background: scenario.phase === "Before" ? COLORS.blueLight : scenario.phase === "During" ? COLORS.redLight : COLORS.greenLight, color: scenario.phase === "Before" ? COLORS.blue : scenario.phase === "During" ? COLORS.red : COLORS.green }}>
                          {scenario.phase} Flood
                        </span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 17 }}>{scenario.title}</div>
                    </div>
                  </div>

                  <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "12px 14px", marginBottom: "1.25rem", fontSize: 14, lineHeight: 1.6, color: "var(--color-text-primary)" }}>
                    {scenario.story}
                  </div>

                  <div style={{ fontWeight: 500, fontSize: 14, marginBottom: "0.75rem", color: "var(--color-text-secondary)" }}>What do you do?</div>

                  {scenario.choices.map((choice, idx) => {
                    let cls = "choice-btn";
                    if (gameState === "feedback" && idx === selectedChoice) {
                      cls += ` selected-${choice.outcome}`;
                    }
                    return (
                      <button
                        key={idx}
                        className={cls}
                        disabled={gameState === "feedback"}
                        onClick={() => handleChoice(choice, idx)}
                      >
                        {choice.text}
                      </button>
                    );
                  })}

                  {gameState === "feedback" && selectedChoice !== null && (
                    <div style={{ marginTop: "1rem" }}>
                      <div style={{ background: scenario.choices[selectedChoice].outcome === "best" || scenario.choices[selectedChoice].outcome === "good" ? COLORS.greenLight : scenario.choices[selectedChoice].outcome === "ok" ? COLORS.amberLight : COLORS.redLight, borderRadius: 8, padding: "12px 14px", fontSize: 14, lineHeight: 1.6, marginBottom: "1rem", borderLeft: `3px solid ${scenario.choices[selectedChoice].outcome === "best" || scenario.choices[selectedChoice].outcome === "good" ? COLORS.green : scenario.choices[selectedChoice].outcome === "ok" ? COLORS.amber : COLORS.red}` }}>
                        <div style={{ fontWeight: 500, marginBottom: 4, color: scenario.choices[selectedChoice].outcome === "best" || scenario.choices[selectedChoice].outcome === "good" ? COLORS.green : scenario.choices[selectedChoice].outcome === "ok" ? COLORS.amber : COLORS.red }}>
                          {scenario.choices[selectedChoice].outcome === "best" ? "✓ Best choice!" : scenario.choices[selectedChoice].outcome === "good" ? "✓ Good choice" : scenario.choices[selectedChoice].outcome === "ok" ? "⚠ Partially correct" : "✗ Incorrect"}
                        </div>
                        {scenario.choices[selectedChoice].feedback}
                      </div>
                      <button className="primary-btn" onClick={nextScenario}>
                        {gameScenario + 1 >= SCENARIOS.length ? "See Results →" : "Next Scenario →"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== DASHBOARD TAB ===== */}
        {activeTab === "dashboard" && (
          <div>
            {/* Summary stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "1rem" }}>
              {[
                { label: "Active Reports", value: reports.length, color: COLORS.blue },
                { label: "High Risk Areas", value: SINGAPORE_AREAS.filter(a => a.risk === "high").length, color: COLORS.red },
                { label: "24h Rainfall (mm)", value: "143", color: COLORS.amber },
                { label: "Alert Level", value: "Yellow", color: COLORS.amber },
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 600, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Rainfall chart */}
            <div className="card" style={{ marginBottom: "1rem" }}>
              <div style={{ fontWeight: 500, marginBottom: "0.25rem" }}>24-Hour Rainfall Intensity</div>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: "0.75rem" }}>mm/hr · Today</div>
              <div style={{ display: "flex", gap: "12px", fontSize: 11, marginBottom: "8px" }}>
                {[["Normal", COLORS.blue], ["Elevated", "#e67e22"], ["Heavy (>100mm)", COLORS.red]].map(([l, c]) => (
                  <span key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: "inline-block" }}></span>
                    <span style={{ color: "var(--color-text-secondary)" }}>{l}</span>
                  </span>
                ))}
              </div>
              <canvas ref={canvasRef} width={800} height={220} style={{ width: "100%", height: 220 }}
                role="img" aria-label="Bar chart showing 24-hour rainfall intensity with peaks above 100mm in the afternoon">
                24-hour rainfall data showing varying intensities throughout the day.
              </canvas>
            </div>

            {/* Area risk table */}
            <div className="card" style={{ marginBottom: "1rem" }}>
              <div style={{ fontWeight: 500, marginBottom: "0.75rem" }}>Area Risk Levels</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {SINGAPORE_AREAS.map(area => (
                  <div key={area.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: "var(--color-background-secondary)", borderRadius: 8, fontSize: 13 }}>
                    <span>{area.name}</span>
                    <span className="badge" style={{ background: area.risk === "high" ? COLORS.redLight : area.risk === "medium" ? COLORS.amberLight : COLORS.tealLight, color: riskColor(area.risk) }}>
                      {area.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparedness checklist */}
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ fontWeight: 500 }}>Preparedness Checklist</div>
                <span style={{ fontSize: 13, color: checklistDone === checklist.length ? COLORS.green : "var(--color-text-secondary)", fontWeight: 500 }}>
                  {checklistDone}/{checklist.length} done
                </span>
              </div>
              <div style={{ height: 6, background: "var(--color-background-secondary)", borderRadius: 999, marginBottom: "1rem" }}>
                <div style={{ width: `${(checklistDone / checklist.length) * 100}%`, height: "100%", background: checklistDone === checklist.length ? COLORS.green : COLORS.blue, borderRadius: 999, transition: "width .3s" }}></div>
              </div>
              {checklist.map(item => (
                <div key={item.id} className="check-item" onClick={() => setChecklist(c => c.map(i => i.id === item.id ? { ...i, done: !i.done } : i))}>
                  <div className={`check-box ${item.done ? "done" : ""}`}>
                    {item.done && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ fontSize: 14, color: item.done ? "var(--color-text-secondary)" : "var(--color-text-primary)", textDecoration: item.done ? "line-through" : "none" }}>{item.text}</span>
                </div>
              ))}

              {/* Tips */}
              <div style={{ marginTop: "1rem", padding: "12px 14px", background: COLORS.blueLight, borderRadius: 8, fontSize: 13, lineHeight: 1.6 }}>
                <div style={{ fontWeight: 500, color: COLORS.blueDark, marginBottom: 4 }}>💡 Quick Tips</div>
                <div style={{ color: COLORS.blueDark }}>
                  PUB's heavy rain threshold is 70mm/hr — that's when flash flooding becomes likely. Subscribe to PUB Telegram alerts for 15–30 min advance warning. Bookmark <strong>myenv.gov.sg</strong> for real-time rainfall data.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
