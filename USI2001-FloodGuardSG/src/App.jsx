import { useState, useEffect, useRef } from "react";
import logo from './assets/floodguard-logo.png'
import map from './assets/singapore-map.png'

const COLORS = {
  blue: "#1a6eb5", blueDark: "#0d4a82", blueLight: "#e8f2fb",
  teal: "#0f7c5c", tealLight: "#e0f5ee",
  amber: "#c47a0f", amberLight: "#fef3dc",
  red: "#c0392b", redLight: "#fdecea",
  green: "#2e7d32", greenLight: "#e8f5e9",
  gray: "#5f5e5a", grayLight: "#f4f3f0",
};

const SINGAPORE_AREAS = [
  { id: 1,  name: "Sembawang",     x: 285, y:  38, risk: "low"    },
  { id: 2,  name: "Woodlands",     x: 214, y:  88, risk: "low"    },
  { id: 3,  name: "Yishun",        x: 348, y: 117, risk: "medium" },
  { id: 4,  name: "Seletar",       x: 398, y: 135, risk: "low"    },
  { id: 5,  name: "Punggol",       x: 444, y: 117, risk: "low"    },
  { id: 6,  name: "Sengkang",      x: 413, y: 160, risk: "medium" },
  { id: 7,  name: "Ang Mo Kio",    x: 335, y: 185, risk: "low"    },
  { id: 8,  name: "Serangoon",     x: 392, y: 205, risk: "low"    },
  { id: 9,  name: "Hougang",       x: 413, y: 228, risk: "medium" },
  { id: 10, name: "Pasir Ris",     x: 453, y: 221, risk: "low"    },
  { id: 11, name: "Bishan",        x: 336, y: 235, risk: "low"    },
  { id: 12, name: "Toa Payoh",     x: 336, y: 266, risk: "medium" },
  { id: 13, name: "Novena",        x: 313, y: 297, risk: "low"    },
  { id: 14, name: "Bukit Timah",   x: 264, y: 276, risk: "high"   },
  { id: 15, name: "Bukit Panjang", x: 216, y: 209, risk: "medium" },
  { id: 16, name: "Bukit Batok",   x: 211, y: 238, risk: "medium" },
  { id: 17, name: "Choa Chu Kang", x: 180, y: 185, risk: "medium" },
  { id: 18, name: "Jurong East",   x: 167, y: 297, risk: "medium" },
  { id: 19, name: "Jurong West",   x: 115, y: 276, risk: "high"   },
  { id: 20, name: "Boon Lay",      x: 107, y: 312, risk: "medium" },
  { id: 21, name: "Pioneer",       x:  67, y: 294, risk: "low"    },
  { id: 22, name: "Clementi",      x: 200, y: 300, risk: "medium" },
  { id: 23, name: "Queenstown",    x: 218, y: 340, risk: "medium" },
  { id: 24, name: "Tanglin",       x: 286, y: 333, risk: "low"    },
  { id: 25, name: "Kallang",       x: 371, y: 320, risk: "high"   },
  { id: 27, name: "Geylang",       x: 390, y: 297, risk: "medium" },
  { id: 28, name: "Paya Lebar",    x: 400, y: 266, risk: "medium" },
  { id: 29, name: "Tampines",      x: 420, y: 279, risk: "low"    },
  { id: 30, name: "Bedok",         x: 393, y: 331, risk: "medium" },
  { id: 31, name: "Marina Parade", x: 403, y: 356, risk: "high"   },
  { id: 32, name: "Downtown",      x: 334, y: 348, risk: "high"   },
  { id: 33, name: "Marina South",  x: 368, y: 374, risk: "high"   },
];

const FLOOD_REPORTS = [
  { id: 1, area: "Bukit Timah", severity: "high",   time: "10 min ago", x: 264, y: 276, desc: "Road flooded near Bt Timah Plaza" },
  { id: 2, area: "Jurong West", severity: "high",   time: "25 min ago", x: 115, y: 276, desc: "Underpass submerged, avoid PIE exit 35" },
  { id: 3, area: "Kallang",     severity: "medium", time: "42 min ago", x: 371, y: 320, desc: "Surface flooding along Kallang Road" },
  { id: 4, area: "Downtown",    severity: "medium", time: "1 hr ago",   x: 334, y: 348, desc: "Carpark B2 partially flooded" },
  { id: 5, area: "Clementi",    severity: "low",    time: "1.5 hr ago", x: 200, y: 300, desc: "Minor ponding near Ave 3 bus stop" },
];

function SceneHeavyRain() {
  return (
    <svg viewBox="0 0 400 200" width="100%" height="200" style={{ borderRadius: 10, display: "block" }}>
      <rect width="400" height="200" fill="#c8dbe8"/>
      <rect width="400" height="200" fill="url(#skyGrad)" opacity="0.6"/>
      <rect x="0" y="140" width="400" height="60" fill="#8aab7a"/>
      <rect x="0" y="155" width="400" height="45" fill="#7a9e6a"/>
      <rect x="30" y="80" width="100" height="75" fill="#e8e0d0" rx="3"/>
      <rect x="30" y="80" width="100" height="15" fill="#c0a86a" rx="3"/>
      <rect x="55" y="110" width="18" height="45" fill="#a09080" rx="2"/>
      <rect x="82" y="115" width="28" height="22" fill="#8ab0c8" rx="2"/>
      <rect x="200" y="70" width="140" height="85" fill="#ddd8cc" rx="3"/>
      <rect x="200" y="70" width="140" height="18" fill="#b8905a" rx="3"/>
      <rect x="215" y="105" width="22" height="50" fill="#a09080" rx="2"/>
      <rect x="248" y="110" width="35" height="25" fill="#8ab0c8" rx="2"/>
      <rect x="298" y="108" width="28" height="22" fill="#8ab0c8" rx="2"/>
      <ellipse cx="80"  cy="30" rx="55" ry="30" fill="#6a7a88"/>
      <ellipse cx="150" cy="22" rx="70" ry="35" fill="#58686e"/>
      <ellipse cx="260" cy="28" rx="80" ry="32" fill="#6a7a88"/>
      <ellipse cx="340" cy="35" rx="50" ry="28" fill="#58686e"/>
      {Array.from({length: 28}).map((_,i) => (
        <line key={i}
          x1={18 + i*14} y1={60 + (i%3)*8}
          x2={14 + i*14} y2={80 + (i%3)*8}
          stroke="#7ab0d4" strokeWidth="1.5" opacity="0.7"/>
      ))}
      <rect x="155" y="130" width="85" height="28" fill="#d0c8b8" rx="14"/>
      <text x="197" y="149" textAnchor="middle" fontSize="11" fill="#5a4a3a" fontWeight="500">⚠ Heavy Rain</text>
      <text x="197" y="165" textAnchor="middle" fontSize="9" fill="#7a8a5a">PUB Alert issued</text>
    </svg>
  );
}

function SceneFloodedRoad() {
  return (
    <svg viewBox="0 0 400 200" width="100%" height="200" style={{ borderRadius: 10, display: "block" }}>
      <rect width="400" height="200" fill="#b8ccd8"/>
      <rect x="0" y="110" width="400" height="90" fill="#6090a8"/>
      <rect x="0" y="120" width="400" height="80" fill="#5585a0" opacity="0.9"/>
      {[0,1,2,3,4,5,6,7].map(i => (
        <ellipse key={i} cx={25+i*52} cy={138} rx={18} ry={5} fill="#7aafc8" opacity="0.4"/>
      ))}
      <line x1="0" y1="115" x2="400" y2="115" stroke="#88b8d0" strokeWidth="1.5" opacity="0.6"/>
      <rect x="0"   y="80" width="400" height="35" fill="#c0b890"/>
      <rect x="60"  y="30" width="75" height="85" fill="#e0d8c8" rx="3"/>
      <rect x="60"  y="30" width="75" height="14" fill="#b8905a" rx="3"/>
      <rect x="80"  y="72" width="16" height="43" fill="#a09080" rx="2"/>
      <rect x="105" y="78" width="22" height="20" fill="#7aaabb" rx="2"/>
      <rect x="240" y="20" width="95" height="95" fill="#ddd8c0" rx="3"/>
      <rect x="240" y="20" width="95" height="15" fill="#c87850" rx="3"/>
      <rect x="258" y="65" width="18" height="50" fill="#a09080" rx="2"/>
      <rect x="288" y="70" width="30" height="22" fill="#7aaabb" rx="2"/>
      <rect x="140" y="88" width="55" height="38" fill="#e05020" rx="4"/>
      <rect x="140" y="88" width="55" height="14" fill="#c04010" rx="4"/>
      <rect x="148" y="104" width="16" height="22" fill="#2a2a2a" rx="2"/>
      <rect x="169" y="104" width="16" height="22" fill="#2a2a2a" rx="2"/>
      <ellipse cx="152" cy="126" rx="10" ry="5" fill="#1a1a1a"/>
      <ellipse cx="175" cy="126" rx="10" ry="5" fill="#1a1a1a"/>
      <rect x="152" y="120" width="34" height="6" fill="#5585a0"/>
      <text x="200" y="175" textAnchor="middle" fontSize="11" fill="#e0f0ff" fontWeight="500">Water level rising — 20cm+</text>
    </svg>
  );
}

function SceneFloodedHome() {
  return (
    <svg viewBox="0 0 400 200" width="100%" height="200" style={{ borderRadius: 10, display: "block" }}>
      <rect width="400" height="200" fill="#d0dce8"/>
      <rect x="0" y="130" width="400" height="70" fill="#5880a0" opacity="0.85"/>
      {[0,1,2,3,4,5].map(i => (
        <ellipse key={i} cx={35+i*65} cy={148} rx={22} ry={6} fill="#78a8c8" opacity="0.35"/>
      ))}
      <rect x="60" y="30" width="280" height="145" fill="#f0ece0" rx="4"/>
      <rect x="60" y="30" width="280" height="22" fill="#d0a868" rx="4"/>
      <polygon points="40,52 200,5 360,52" fill="#c87840"/>
      <rect x="168" y="80" width="64" height="95" fill="#8a7060" rx="3"/>
      <rect x="168" y="80" width="30" height="95" fill="#7a6050" rx="3"/>
      <circle cx="198" cy="127" r="4" fill="#d4af60"/>
      <rect x="80"  y="90" width="55" height="45" fill="#88b8d0" rx="3"/>
      <rect x="265" y="90" width="55" height="45" fill="#88b8d0" rx="3"/>
      <rect x="0" y="148" width="400" height="52" fill="#4878a0" opacity="0.5"/>
      <line x1="0" y1="148" x2="400" y2="148" stroke="#88b8d0" strokeWidth="2"/>
      <line x1="168" y1="148" x2="168" y2="175" stroke="#c87840" strokeWidth="1.5" strokeDasharray="3,3"/>
      <line x1="232" y1="148" x2="232" y2="175" stroke="#c87840" strokeWidth="1.5" strokeDasharray="3,3"/>
      <rect x="88" y="138" width="38" height="12" fill="#ffd060" rx="3" opacity="0.9"/>
      <text x="107" y="148" textAnchor="middle" fontSize="8" fill="#7a5800">ELEC OFF</text>
      <text x="200" y="190" textAnchor="middle" fontSize="11" fill="#e8f4ff" fontWeight="500">Ground floor flooding — evacuate upstairs</text>
    </svg>
  );
}

function SceneAfterFlood() {
  return (
    <svg viewBox="0 0 400 200" width="100%" height="200" style={{ borderRadius: 10, display: "block" }}>
      <rect width="400" height="200" fill="#d8e8d0"/>
      <rect x="0" y="125" width="400" height="75" fill="#b8c8a8"/>
      <rect x="0" y="140" width="400" height="60" fill="#a8b898"/>
      <rect x="50" y="40" width="120" height="100" fill="#e8e0d0" rx="3"/>
      <rect x="50" y="40" width="120" height="16" fill="#c09050" rx="3"/>
      <rect x="78"  y="90" width="20" height="50" fill="#908070" rx="2"/>
      <rect x="108" y="95" width="30" height="22" fill="#7ab8c0" rx="2"/>
      <rect x="240" y="30" width="110" height="110" fill="#ddd8c8" rx="3"/>
      <rect x="240" y="30" width="110" height="16" fill="#b87840" rx="3"/>
      <rect x="265" y="80" width="20" height="60" fill="#908070" rx="2"/>
      <rect x="298" y="85" width="34" height="26" fill="#7ab8c0" rx="2"/>
      <rect x="38"  y="148" width="50" height="12" fill="#78a068" rx="3"/>
      <rect x="100" y="152" width="80" height="8"  fill="#68906a" rx="3"/>
      <rect x="200" y="150" width="60" height="10" fill="#78a068" rx="3"/>
      <rect x="280" y="148" width="90" height="12" fill="#68906a" rx="3"/>
      <rect x="55"  y="100" width="28" height="28" fill="#d08040" opacity="0.6" rx="3"/>
      <rect x="260" y="95"  width="30" height="30" fill="#c07030" opacity="0.6" rx="3"/>
      <line x1="100" y1="80" x2="120" y2="80" stroke="#e05030" strokeWidth="2"/>
      <line x1="110" y1="70" x2="110" y2="90" stroke="#e05030" strokeWidth="2"/>
      <circle cx="110" cy="80" r="14" fill="none" stroke="#e05030" strokeWidth="1.5"/>
      <text x="200" y="180" textAnchor="middle" fontSize="10" fill="#4a6840" fontWeight="500">Wait for official clearance before re-entering</text>
    </svg>
  );
}

const SCENE_COMPONENTS = [SceneHeavyRain, SceneFloodedRoad, SceneFloodedHome, SceneAfterFlood];

const SCENARIOS = [
  {
    id: 1, phase: "Before", title: "Preparing for Heavy Rain",
    story: "PUB has issued a Heavy Rain Warning for your area. It's currently sunny but dark clouds are forming. You have about 30 minutes before the downpour.",
    choices: [
      { text: "Continue with your outdoor plans — it'll probably miss us", outcome: "bad", feedback: "Incorrect. Singapore flash floods can develop within 30 minutes. Never ignore PUB Heavy Rain Warnings — you could get stranded in dangerous conditions." },
      { text: "Check PUB flood maps to know if your area is prone to flooding", outcome: "good", feedback: "Correct! Knowing your area's flood risk in advance helps you make better decisions. PUB maintains an updated flood risk map at their website." },
      { text: "Head to the nearest basement carpark to wait it out", outcome: "bad", feedback: "Dangerous! Basement carparks are one of the highest-risk areas during flash floods. Water can fill them rapidly with little warning." },
      { text: "Move your belongings upstairs, prepare sandbags if available, and stay indoors", outcome: "best", feedback: "Excellent! Proactive preparation — elevating items, deploying flood barriers, and staying indoors — is the ideal response to an incoming heavy rain warning." },
    ],
  },
  {
    id: 2, phase: "During", title: "Flash Flood in Progress",
    story: "You are driving home and encounter water rising rapidly on the road ahead. The level looks about 20cm and climbing. Your car is a normal sedan.",
    choices: [
      { text: "Drive through quickly — momentum should get you across", outcome: "bad", feedback: "Very dangerous! Even 30cm of moving water can sweep away a car. More than half of flood-related deaths occur in vehicles. Never drive through floodwater." },
      { text: "Stop, turn around, and find an alternate route", outcome: "best", feedback: "Correct! 'Turn Around, Don't Drown' is the key rule. Find an alternative route and report the flooding to PUB via the MyWaters app." },
      { text: "Park the car and wade through on foot", outcome: "bad", feedback: "Incorrect. Walking through floodwater is dangerous — it can contain debris, open drains, and electrical hazards. Currents are stronger than they appear." },
      { text: "Wait in your car for the water to subside", outcome: "ok", feedback: "Partially correct — waiting is safer than driving through. However, if water continues rising, exit the vehicle and move to higher ground immediately." },
    ],
  },
  {
    id: 3, phase: "During", title: "Trapped in a Ground-Floor Unit",
    story: "Water is seeping under your door — about 5cm in the last 10 minutes. You are on the ground floor of an HDB block. Electricity is still on.",
    choices: [
      { text: "Turn off the main electrical switch and move to a higher floor immediately", outcome: "best", feedback: "Correct! Turning off electricity prevents electrocution hazards. Moving to a higher floor keeps you safe as water rises. This is the ideal sequence of actions." },
      { text: "Keep the electrical appliances on to stay informed via TV/radio", outcome: "bad", feedback: "Dangerous! Electricity and water are a lethal combination. Turn off your main switch immediately when water starts entering your home." },
      { text: "Use towels and sandbags to block the water and stay put", outcome: "ok", feedback: "Partially useful — flood barriers can slow ingress. But if water is rising significantly, you should still evacuate to a higher floor as a precaution." },
      { text: "Open the front door to let water flow through faster", outcome: "bad", feedback: "Incorrect. Opening the door allows more water and debris to enter rapidly, worsening conditions and creating stronger currents inside your unit." },
    ],
  },
  {
    id: 4, phase: "After", title: "Flood Receding — Returning Home",
    story: "The rain has stopped and authorities say the water is receding. You want to return to your ground-floor flat to assess damage. Floodwater has just cleared from the streets.",
    choices: [
      { text: "Return immediately and turn on all appliances to check what survived", outcome: "bad", feedback: "Dangerous! Never turn on electrical appliances after flooding without professional inspection. Water damage is not always visible and can cause electrocution or fire." },
      { text: "Wait for PUB/SCDF to declare the area safe, then inspect before turning on utilities", outcome: "best", feedback: "Correct! Always wait for official clearance. Have a qualified electrician inspect your wiring before restoring power. Document all damage with photos for insurance claims." },
      { text: "Drink tap water to check if the supply is safe", outcome: "bad", feedback: "Incorrect. Floodwater can contaminate water supplies. Wait for official confirmation that tap water is safe to drink, or boil it first." },
      { text: "Clean up immediately without any protective gear", outcome: "bad", feedback: "Avoid this. Floodwater contains bacteria, sewage and chemical contaminants. Always wear waterproof boots, gloves, and protective clothing when cleaning up." },
    ],
  },
];

const RAINFALL_DATA = [45,12,8,67,134,89,23,15,45,78,112,56,34,18,91,143,67,29,11,55,88,76,43,22];

export default function FloodGuardSG() {
  const [activeTab, setActiveTab]     = useState("map");
  const [reports, setReports]         = useState(FLOOD_REPORTS);
  const [reportForm, setReportForm]   = useState(false);
  const [newReport, setNewReport]     = useState({ area: "", severity: "medium", desc: "" });
  const [selectedArea, setSelectedArea] = useState(null);
  const [submitted, setSubmitted]     = useState(false);

  const [gameScenario, setGameScenario] = useState(0);
  const [gameState, setGameState]       = useState("playing");
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [score, setScore]               = useState(0);
  const [answers, setAnswers]           = useState([]);

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
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + chartH - (i / 4) * chartH;
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
      ctx.fillStyle = val > 100 ? "#c0392b" : val > 60 ? "#e67e22" : COLORS.blue;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, 2);
      ctx.fill();
    });
    const hourLabels = ["00","03","06","09","12","15","18","21"];
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
    if (gameScenario + 1 >= SCENARIOS.length) { setGameState("complete"); }
    else { setGameScenario(s => s + 1); setGameState("playing"); setSelectedChoice(null); }
  }
  function resetGame() {
    setGameScenario(0); setGameState("playing"); setSelectedChoice(null); setScore(0); setAnswers([]);
  }
  function submitReport() {
    if (!newReport.area || !newReport.desc) return;
    const area = SINGAPORE_AREAS.find(a => a.name === newReport.area);
    setReports(r => [{ id: Date.now(), area: newReport.area, severity: newReport.severity, time: "Just now",
      x: area ? area.x + Math.random() * 20 - 10 : 350, y: area ? area.y + Math.random() * 20 - 10 : 200,
      desc: newReport.desc }, ...r]);
    setSubmitted(true);
    setTimeout(() => { setReportForm(false); setSubmitted(false); setNewReport({ area: "", severity: "medium", desc: "" }); }, 1500);
  }

  const severityColor = s => s === "high" ? COLORS.red : s === "medium" ? COLORS.amber : COLORS.blue;
  const severityBg    = s => s === "high" ? COLORS.redLight : s === "medium" ? COLORS.amberLight : COLORS.blueLight;
  const riskColor     = r => r === "high" ? COLORS.red : r === "medium" ? COLORS.amber : COLORS.teal;

  const scenario     = SCENARIOS[gameScenario];
  const SceneComp    = SCENE_COMPONENTS[gameScenario];
  const checklistDone = checklist.filter(c => c.done).length;
  const maxScore     = SCENARIOS.length * 3;

  return (
    <div style={{ fontFamily: "'IBM Plex Sans','Segoe UI',sans-serif", minHeight: "100vh", background: "var(--color-background-tertiary)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .tab-btn{padding:10px 20px;border:none;cursor:pointer;font-size:14px;font-weight:500;font-family:inherit;background:none;transition:all .15s;white-space:nowrap}
        .tab-btn.active{color:${COLORS.blue};border-bottom:2.5px solid ${COLORS.blue}}
        .tab-btn:not(.active){color:var(--color-text-secondary);border-bottom:2.5px solid transparent}
        .tab-btn:hover:not(.active){color:var(--color-text-primary)}
        .card{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:12px;padding:1rem 1.25rem}
        .badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:500}
        .choice-btn{width:100%;text-align:left;padding:12px 14px;border-radius:8px;border:1px solid var(--color-border-secondary);background:var(--color-background-primary);cursor:pointer;font-size:14px;font-family:inherit;color:var(--color-text-primary);transition:all .15s;margin-bottom:8px;line-height:1.4}
        .choice-btn:hover:not(:disabled){background:var(--color-background-secondary);border-color:${COLORS.blue}}
        .choice-btn:disabled{cursor:default;opacity:.7}
        .choice-btn.sel-best{border-color:${COLORS.green};background:${COLORS.greenLight}}
        .choice-btn.sel-good{border-color:${COLORS.teal};background:${COLORS.tealLight}}
        .choice-btn.sel-ok{border-color:${COLORS.amber};background:${COLORS.amberLight}}
        .choice-btn.sel-bad{border-color:${COLORS.red};background:${COLORS.redLight}}
        .check-item{display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:0.5px solid var(--color-border-tertiary);cursor:pointer}
        .check-item:last-child{border-bottom:none}
        .check-box{width:18px;height:18px;border-radius:4px;border:1.5px solid var(--color-border-primary);flex-shrink:0;display:flex;align-items:center;justify-content:center;margin-top:2px;transition:all .15s}
        .check-box.done{background:${COLORS.teal};border-color:${COLORS.teal}}
        .primary-btn{background:${COLORS.blue};color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:500;font-size:14px;font-family:inherit;transition:background .15s}
        .primary-btn:hover{background:${COLORS.blueDark}}
        .secondary-btn{background:none;color:${COLORS.blue};border:1px solid ${COLORS.blue};padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:500;font-size:14px;font-family:inherit}
        .secondary-btn:hover{background:${COLORS.blueLight}}
        select,input,textarea{font-family:inherit;font-size:14px;padding:8px 10px;border:1px solid var(--color-border-secondary);border-radius:8px;background:var(--color-background-primary);color:var(--color-text-primary);width:100%}
        textarea{resize:vertical;min-height:70px}
        .stat-card{background:var(--color-background-secondary);border-radius:8px;padding:1rem;text-align:center}
        .phase-tag{font-size:11px;font-weight:500;padding:3px 10px;border-radius:999px}

      `}</style>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${COLORS.blueDark} 0%,${COLORS.blue} 60%,#1a8c9b 100%)`, padding: "0.75rem 1.5rem", display: "flex", alignItems: "center", gap: 14 }}>
        {/* Logo */}
        <img
          src={logo}
          alt="FloodGuard SG logo"
          style={{ height: 56, width: "auto", objectFit: "contain", flexShrink: 0, mixBlendMode: "screen" }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 20, letterSpacing: "0.5px", textTransform: "uppercase" }}>FloodGuard SG</div>
          <div style={{ color: "rgba(255,255,255,.85)", fontSize: 11, letterSpacing: "0.3px", marginTop: 2, fontStyle: "italic" }}>Prepared Today, Protected Tomorrow</div>
        </div>
        <div>
          <div style={{ background: "rgba(255,255,255,.18)", color: "#fff", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 500 }}>⚠️ Heavy Rain Watch Active</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "var(--color-background-primary)", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", padding: "0 1.5rem", overflowX: "auto" }}>
        {[{ id:"map",label:"🗺️ Flood Map" },{ id:"game",label:"🎮 Preparedness Game" },{ id:"dashboard",label:"📊 Risk Dashboard" }].map(t => (
          <button key={t.id} className={`tab-btn ${activeTab===t.id?"active":""}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: "1.25rem 1.5rem", maxWidth: 900, margin: "0 auto" }}>

        {/* ====== MAP TAB ====== */}
        {activeTab === "map" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 16 }}>Real-time Flood Reports</div>
                <div style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>{reports.length} active reports · Updated just now</div>
              </div>
              <button className="primary-btn" onClick={() => setReportForm(true)}>+ Report Flooding</button>
            </div>

            <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: "1rem" }}>
              <div style={{ position: "relative", height: 420, overflow: "hidden", background: "#b8d8ec" }}>
                {/* PNG map cropped to Singapore bounds via background-image */}
                <div style={{
                  position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                  backgroundImage: `url(${map})`,
                  backgroundSize: "900px 608px",
                  backgroundPosition: "-10px -40px",
                  backgroundRepeat: "no-repeat",
                }} />
                {/* SVG overlay — markers aligned to the cropped map region */}
                <svg width="100%" height="100%" viewBox="0 0 700 420"
                  style={{ position: "absolute", top: 0, left: 0 }}>

                  {/* Area risk markers */}
                  {SINGAPORE_AREAS.map(area => (
                    <g key={area.id} style={{ cursor: "pointer" }} onClick={() => setSelectedArea(selectedArea?.id === area.id ? null : area)}>
                      <circle cx={area.x} cy={area.y}
                        r={selectedArea?.id === area.id ? 13 : 9}
                        fill={`${riskColor(area.risk)}55`}
                        stroke={riskColor(area.risk)}
                        strokeWidth={selectedArea?.id === area.id ? 2.5 : 1.8}
                      />
                      {selectedArea?.id === area.id && (
                        <text x={area.x} y={area.y + 1} textAnchor="middle" dominantBaseline="middle"
                          fill={riskColor(area.risk)} fontSize="7" fontWeight="700" style={{ pointerEvents: "none" }}>
                          {area.name.split(" ")[0]}
                        </text>
                      )}
                    </g>
                  ))}

                  {/* Flood incident pins — teardrop style */}
                  {reports.map(r => (
                    <g key={r.id}>
                      <circle cx={r.x} cy={r.y - 9} r="9" fill={severityColor(r.severity)} opacity="0.92"/>
                      <polygon points={`${r.x},${r.y + 4} ${r.x - 5},${r.y - 4} ${r.x + 5},${r.y - 4}`} fill={severityColor(r.severity)} opacity="0.92"/>
                      <text x={r.x} y={r.y - 8} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9" fontWeight="700" style={{ pointerEvents: "none" }}>!</text>
                    </g>
                  ))}
                </svg>

                {/* Legend */}
                <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(255,255,255,0.93)", borderRadius: 8, padding: "8px 12px", fontSize: 11, boxShadow: "0 1px 4px rgba(0,0,0,.12)" }}>
                  <div style={{ fontWeight: 600, marginBottom: 5, fontSize: 12 }}>Map Legend</div>
                  {["high","medium","low"].map(r => (
                    <div key={r} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: riskColor(r) }}></div>
                      <span style={{ color: "#444", textTransform: "capitalize" }}>{r} flood risk</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "0.5px solid #ddd", marginTop: 5, paddingTop: 5, display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.red }}></div>
                    <span style={{ color: "#444" }}>Active incident report</span>
                  </div>
                </div>

                {selectedArea && (
                  <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.96)", borderRadius: 10, padding: "10px 14px", minWidth: 185, border: `1.5px solid ${riskColor(selectedArea.risk)}`, boxShadow: "0 2px 8px rgba(0,0,0,.1)" }}>
                    <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 14 }}>{selectedArea.name}</div>
                    <span className="badge" style={{ background: selectedArea.risk==="high" ? COLORS.redLight : selectedArea.risk==="medium" ? COLORS.amberLight : COLORS.tealLight, color: riskColor(selectedArea.risk), marginBottom: 6, display: "inline-block" }}>
                      {selectedArea.risk} flood risk
                    </span>
                    <div style={{ fontSize: 12, color: "#666" }}>{reports.filter(r => r.area.includes(selectedArea.name)).length} active report(s) nearby</div>
                  </div>
                )}
              </div>
            </div>

            {reportForm && (
              <div className="card" style={{ marginBottom: "1rem", border: `1px solid ${COLORS.blue}` }}>
                <div style={{ fontWeight: 500, marginBottom: "0.75rem", color: COLORS.blue }}>Report a Flood Incident</div>
                {submitted ? (
                  <div style={{ textAlign: "center", padding: "1rem", color: COLORS.green, fontWeight: 500 }}>✓ Report submitted! Thank you for helping your community.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
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
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="primary-btn" onClick={submitReport}>Submit Report</button>
                      <button className="secondary-btn" onClick={() => setReportForm(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="card">
              <div style={{ fontWeight: 500, marginBottom: "0.75rem" }}>Recent Reports</div>
              {reports.slice(0, 5).map((r, i) => (
                <div key={r.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: i < Math.min(reports.length,5)-1 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: severityColor(r.severity), flexShrink: 0, marginTop: 5 }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontWeight: 500, fontSize: 14 }}>{r.area}</span>
                      <span className="badge" style={{ background: severityBg(r.severity), color: severityColor(r.severity) }}>{r.severity}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{r.desc}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", flexShrink: 0 }}>{r.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====== GAME TAB ====== */}
        {activeTab === "game" && (
          <div>
            {gameState === "complete" ? (
              <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
                <div style={{ fontSize: 52, marginBottom: "0.75rem" }}>🏆</div>
                <div style={{ fontWeight: 600, fontSize: 22, marginBottom: "0.4rem" }}>Quiz Complete!</div>
                <div style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>You scored {score} out of {maxScore} points</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: "1.5rem" }}>
                  {answers.map((a, i) => (
                    <div key={i} className="stat-card">
                      <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4 }}>Scenario {i+1}</div>
                      <div style={{ fontWeight: 500, color: a.outcome==="best" ? COLORS.green : a.outcome==="good" ? COLORS.teal : a.outcome==="ok" ? COLORS.amber : COLORS.red }}>{a.pts}/3 pts</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: score>=10 ? COLORS.greenLight : score>=6 ? COLORS.amberLight : COLORS.redLight, borderRadius: 8, padding: "12px 16px", marginBottom: "1.5rem", color: score>=10 ? COLORS.green : score>=6 ? COLORS.amber : COLORS.red, fontWeight: 500 }}>
                  {score>=10 ? "Excellent! You are well-prepared for flood emergencies." : score>=6 ? "Good effort. Review the scenarios you missed to improve your readiness." : "Keep learning! Flood preparedness knowledge can save lives."}
                </div>
                <button className="primary-btn" onClick={resetGame}>Play Again</button>
              </div>
            ) : (
              <div>
                {/* Progress bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
                  <div style={{ flex: 1, height: 6, background: "var(--color-background-secondary)", borderRadius: 999 }}>
                    <div style={{ width: `${(gameScenario / SCENARIOS.length) * 100}%`, height: "100%", background: COLORS.blue, borderRadius: 999, transition: "width .3s" }}/>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--color-text-secondary)", flexShrink: 0 }}>{gameScenario+1}/{SCENARIOS.length} · {score} pts</div>
                </div>

                {/* Scene illustration card */}
                <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: "1rem" }}>
                  <SceneComp />
                  <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
                    <span className="phase-tag" style={{ background: scenario.phase==="Before" ? COLORS.blueLight : scenario.phase==="During" ? COLORS.redLight : COLORS.greenLight, color: scenario.phase==="Before" ? COLORS.blue : scenario.phase==="During" ? COLORS.red : COLORS.green }}>
                      {scenario.phase} Flood
                    </span>
                    <span style={{ fontWeight: 600, fontSize: 16 }}>{scenario.title}</span>
                  </div>
                </div>

                {/* Scenario card */}
                <div className="card">
                  <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "12px 14px", marginBottom: "1.25rem", fontSize: 14, lineHeight: 1.65, color: "var(--color-text-primary)", borderLeft: `3px solid ${scenario.phase==="Before" ? COLORS.blue : scenario.phase==="During" ? COLORS.red : COLORS.green}`, borderRadius: 0, borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
                    {scenario.story}
                  </div>

                  <div style={{ fontWeight: 500, fontSize: 14, marginBottom: "0.75rem", color: "var(--color-text-secondary)" }}>What do you do?</div>

                  {scenario.choices.map((choice, idx) => {
                    let cls = "choice-btn";
                    if (gameState === "feedback" && idx === selectedChoice) cls += ` sel-${choice.outcome}`;
                    return (
                      <button key={idx} className={cls} disabled={gameState === "feedback"} onClick={() => handleChoice(choice, idx)}>
                        <span style={{ marginRight: 8, opacity: 0.5 }}>{["A","B","C","D"][idx]}.</span>
                        {choice.text}
                      </button>
                    );
                  })}

                  {gameState === "feedback" && selectedChoice !== null && (() => {
                    const c = scenario.choices[selectedChoice];
                    const isGood = c.outcome === "best" || c.outcome === "good";
                    const bgCol = isGood ? COLORS.greenLight : c.outcome === "ok" ? COLORS.amberLight : COLORS.redLight;
                    const txCol = isGood ? COLORS.green : c.outcome === "ok" ? COLORS.amber : COLORS.red;
                    const label = c.outcome === "best" ? "✓ Best choice!" : c.outcome === "good" ? "✓ Good choice" : c.outcome === "ok" ? "⚠ Partially correct" : "✗ Incorrect";
                    return (
                      <div style={{ marginTop: "1rem" }}>
                        <div style={{ background: bgCol, borderRadius: 8, padding: "12px 14px", fontSize: 14, lineHeight: 1.6, marginBottom: "1rem", borderLeft: `3px solid ${txCol}`, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                          <div style={{ fontWeight: 600, marginBottom: 5, color: txCol }}>{label}</div>
                          <div style={{ color: "var(--color-text-primary)" }}>{c.feedback}</div>
                        </div>
                        <button className="primary-btn" onClick={nextScenario}>
                          {gameScenario + 1 >= SCENARIOS.length ? "See Results →" : "Next Scenario →"}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====== DASHBOARD TAB ====== */}
        {activeTab === "dashboard" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: "1rem" }}>
              {[
                { label: "Active Reports", value: reports.length, color: COLORS.blue },
                { label: "High Risk Areas", value: SINGAPORE_AREAS.filter(a=>a.risk==="high").length, color: COLORS.red },
                { label: "24h Rainfall (mm)", value: "143", color: COLORS.amber },
                { label: "Alert Level", value: "Yellow", color: COLORS.amber },
              ].map((s,i) => (
                <div key={i} className="stat-card">
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 600, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ marginBottom: "1rem" }}>
              <div style={{ fontWeight: 500, marginBottom: "0.25rem" }}>24-Hour Rainfall Intensity</div>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: "0.75rem" }}>mm/hr · Today</div>
              <div style={{ display: "flex", gap: 12, fontSize: 11, marginBottom: 8 }}>
                {[["Normal",COLORS.blue],["Elevated","#e67e22"],["Heavy (>100mm)",COLORS.red]].map(([l,c]) => (
                  <span key={l} style={{ display:"flex",alignItems:"center",gap:4 }}>
                    <span style={{ width:10,height:10,borderRadius:2,background:c,display:"inline-block" }}></span>
                    <span style={{ color:"var(--color-text-secondary)" }}>{l}</span>
                  </span>
                ))}
              </div>
              <canvas ref={canvasRef} width={800} height={220} style={{ width:"100%",height:220 }}
                role="img" aria-label="Bar chart showing 24-hour rainfall intensity">
                24-hour rainfall data.
              </canvas>
            </div>

            <div className="card" style={{ marginBottom: "1rem" }}>
              <div style={{ fontWeight: 500, marginBottom: "0.75rem" }}>Area Risk Levels</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {SINGAPORE_AREAS.map(area => (
                  <div key={area.id} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",background:"var(--color-background-secondary)",borderRadius:8,fontSize:13 }}>
                    <span>{area.name}</span>
                    <span className="badge" style={{ background: area.risk==="high"?COLORS.redLight:area.risk==="medium"?COLORS.amberLight:COLORS.tealLight, color: riskColor(area.risk) }}>{area.risk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.75rem" }}>
                <div style={{ fontWeight: 500 }}>Preparedness Checklist</div>
                <span style={{ fontSize:13,color:checklistDone===checklist.length?COLORS.green:"var(--color-text-secondary)",fontWeight:500 }}>{checklistDone}/{checklist.length} done</span>
              </div>
              <div style={{ height:6,background:"var(--color-background-secondary)",borderRadius:999,marginBottom:"1rem" }}>
                <div style={{ width:`${(checklistDone/checklist.length)*100}%`,height:"100%",background:checklistDone===checklist.length?COLORS.green:COLORS.blue,borderRadius:999,transition:"width .3s" }}/>
              </div>
              {checklist.map(item => (
                <div key={item.id} className="check-item" onClick={() => setChecklist(c => c.map(i => i.id===item.id?{...i,done:!i.done}:i))}>
                  <div className={`check-box ${item.done?"done":""}`}>
                    {item.done && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ fontSize:14,color:item.done?"var(--color-text-secondary)":"var(--color-text-primary)",textDecoration:item.done?"line-through":"none" }}>{item.text}</span>
                </div>
              ))}
              <div style={{ marginTop:"1rem",padding:"12px 14px",background:COLORS.blueLight,borderRadius:8,fontSize:13,lineHeight:1.6 }}>
                <div style={{ fontWeight:500,color:COLORS.blueDark,marginBottom:4 }}>💡 Quick Tips</div>
                <div style={{ color:COLORS.blueDark }}>PUB's heavy rain threshold is 70mm/hr — that's when flash flooding becomes likely. Subscribe to PUB Telegram alerts for 15–30 min advance warning. Bookmark <strong>myenv.gov.sg</strong> for real-time rainfall data.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
