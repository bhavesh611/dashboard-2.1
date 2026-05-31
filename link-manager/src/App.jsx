import { useState, useEffect } from "react";

// ── Google Fonts ──────────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --cream: #faf6f0;
      --cream-dark: #f0e9df;
      --ink: #2c2416;
      --ink-light: #6b5d4f;
      --clip: #c0a882;
      --tape-yellow: #f5e07a;
      --tape-pink: #f7b8c4;
      --tape-blue: #a8d4f5;
      --tape-green: #b8e4c0;
    }

    html, body { height: 100%; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--cream);
      color: var(--ink);
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* Paper texture via repeating pattern */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(0,0,0,0.015) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.015) 1px, transparent 1px);
      background-size: 28px 28px;
      pointer-events: none;
      z-index: 0;
    }

    #root { position: relative; z-index: 1; }

    .handwritten { font-family: 'Caveat', cursive; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--clip); border-radius: 99px; }

    /* Bottom sheet backdrop */
    .backdrop {
      position: fixed; inset: 0;
      background: rgba(44,36,22,0.35);
      backdrop-filter: blur(2px);
      z-index: 40;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

    /* Bottom sheet */
    .sheet {
      position: fixed; bottom: 0; left: 0; right: 0;
      background: var(--cream);
      border-radius: 20px 20px 0 0;
      z-index: 50;
      padding: 0 0 env(safe-area-inset-bottom, 16px);
      box-shadow: 0 -4px 32px rgba(44,36,22,0.18);
      animation: slideUp 0.32s cubic-bezier(0.32,0.72,0,1);
      max-height: 92vh;
      overflow-y: auto;
    }
    @keyframes slideUp {
      from { transform: translateY(100%) }
      to   { transform: translateY(0) }
    }

    .sheet-handle {
      width: 40px; height: 4px;
      background: var(--clip);
      border-radius: 99px;
      margin: 12px auto 0;
    }

    /* Card tilt variants */
    .tilt-1 { transform: rotate(-1.2deg); }
    .tilt-2 { transform: rotate(0.8deg); }
    .tilt-3 { transform: rotate(-0.5deg); }
    .tilt-4 { transform: rotate(1.5deg); }
    .tilt-0 { transform: rotate(0deg); }

    .card-wrap:hover .card-inner {
      transform: scale(1.02) rotate(0deg) !important;
      box-shadow: 0 8px 32px rgba(44,36,22,0.18) !important;
    }
    .card-wrap { transition: transform 0.2s ease; }

    /* Washi tape */
    .washi {
      position: absolute;
      top: -10px; left: 50%;
      transform: translateX(-50%) rotate(-2deg);
      height: 18px; width: 56px;
      border-radius: 2px;
      opacity: 0.82;
      z-index: 2;
    }

    /* Paperclip SVG top-right */
    .clip {
      position: absolute;
      top: -14px; right: 16px;
      z-index: 3;
    }

    /* Input styles */
    .diary-input {
      width: 100%;
      background: rgba(255,255,255,0.5);
      border: 1.5px solid var(--cream-dark);
      border-bottom: 2px solid var(--clip);
      border-radius: 8px 8px 0 0;
      padding: 10px 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      color: var(--ink);
      outline: none;
      transition: border-color 0.2s;
    }
    .diary-input:focus { border-bottom-color: #a0522d; background: rgba(255,255,255,0.8); }
    .diary-input::placeholder { color: var(--ink-light); opacity: 0.6; }

    textarea.diary-input { border-radius: 8px; resize: vertical; min-height: 72px; }

    /* Priority dot */
    .priority-high  { background: #e85d4a; }
    .priority-mid   { background: #f5a623; }
    .priority-low   { background: #6cc56a; }

    /* Tag pill */
    .tag-pill {
      font-size: 11px;
      background: rgba(192,168,130,0.18);
      border: 1px solid rgba(192,168,130,0.4);
      border-radius: 99px;
      padding: 2px 8px;
      color: var(--ink-light);
      white-space: nowrap;
    }

    /* Category pill tabs */
    .cat-pill {
      flex-shrink: 0;
      font-family: 'Caveat', cursive;
      font-size: 16px;
      font-weight: 600;
      padding: 6px 16px;
      border-radius: 99px;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.18s;
      white-space: nowrap;
    }
    .cat-pill.active { color: #fff !important; border-color: transparent; }
    .cat-pill:not(.active) { background: transparent !important; border-color: currentColor; opacity: 0.65; }

    /* Summary box */
    .summary-box {
      background: #fffde7;
      border: 1.5px dashed #e6c84a;
      border-radius: 10px;
      padding: 14px;
      font-size: 13.5px;
      line-height: 1.65;
      color: var(--ink);
      margin-top: 8px;
    }

    /* FAB */
    .fab {
      position: fixed;
      bottom: calc(24px + env(safe-area-inset-bottom, 0px));
      right: 20px;
      width: 56px; height: 56px;
      border-radius: 50%;
      background: var(--ink);
      color: #fff;
      border: none;
      cursor: pointer;
      font-size: 26px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(44,36,22,0.35);
      z-index: 30;
      transition: transform 0.18s, box-shadow 0.18s;
    }
    .fab:active { transform: scale(0.92); }

    /* Doodle divider */
    .doodle-div {
      width: 100%;
      height: 2px;
      background: repeating-linear-gradient(
        90deg,
        var(--clip) 0px, var(--clip) 6px,
        transparent 6px, transparent 12px
      );
      border-radius: 99px;
      opacity: 0.5;
      margin: 4px 0 16px;
    }

    /* unDraw placeholder colors per category */
    .ill-wrap {
      width: 100%; height: 130px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 10px;
    }

    .btn-sm {
      font-family: 'Caveat', cursive;
      font-size: 15px;
      font-weight: 600;
      padding: 5px 14px;
      border-radius: 99px;
      border: none;
      cursor: pointer;
      transition: opacity 0.15s, transform 0.15s;
    }
    .btn-sm:active { transform: scale(0.94); opacity: 0.8; }

    .btn-primary {
      background: var(--ink);
      color: #fff;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      padding: 11px 20px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      width: 100%;
      margin-top: 4px;
      transition: opacity 0.15s;
    }
    .btn-primary:active { opacity: 0.75; }

    /* Copied toast */
    .toast {
      position: fixed;
      bottom: 90px; left: 50%;
      transform: translateX(-50%);
      background: var(--ink);
      color: #fff;
      font-family: 'Caveat', cursive;
      font-size: 17px;
      padding: 8px 20px;
      border-radius: 99px;
      z-index: 100;
      pointer-events: none;
      animation: toastAnim 2.2s ease forwards;
    }
    @keyframes toastAnim {
      0%   { opacity: 0; transform: translateX(-50%) translateY(10px); }
      15%  { opacity: 1; transform: translateX(-50%) translateY(0); }
      75%  { opacity: 1; }
      100% { opacity: 0; transform: translateX(-50%) translateY(-6px); }
    }

    @media (min-width: 768px) {
      .sheet { max-width: 480px; left: 50%; transform: translateX(-50%); border-radius: 20px; bottom: 40px; }
      @keyframes slideUp {
        from { transform: translateX(-50%) translateY(100%) }
        to   { transform: translateX(-50%) translateY(0) }
      }
      .fab { right: calc(50% - 240px + 20px); }
    }
  `}</style>
);

// ── Palette per category index ────────────────────────────────────────────────
const PALETTES = [
  { bg: "#fde8d8", accent: "#e8703a", tape: "#f5a67a", ill: "#f4845f" },
  { bg: "#dff0fb", accent: "#3a88c8", tape: "#a8d4f5", ill: "#5ba4cf" },
  { bg: "#e8f5e0", accent: "#4caf6e", tape: "#b8e4c0", ill: "#6abf7b" },
  { bg: "#f5e6fb", accent: "#9b59b6", tape: "#d7b8f5", ill: "#b07fd4" },
  { bg: "#fff3d6", accent: "#d4a017", tape: "#f5e07a", ill: "#e6b830" },
  { bg: "#fde8f0", accent: "#c8396e", tape: "#f7b8c4", ill: "#e05080" },
];

const palette = (idx) => PALETTES[idx % PALETTES.length];
const tiltClass = (idx) => `tilt-${idx % 5}`;

// ── unDraw SVG illustrations (inline, vibrant) ────────────────────────────────
const Illustrations = {
  learning: (color) => (
    <svg viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
      <rect x="30" y="20" width="80" height="100" rx="6" fill={color} opacity="0.25"/>
      <rect x="40" y="30" width="80" height="100" rx="6" fill={color} opacity="0.4"/>
      <rect x="50" y="10" width="80" height="100" rx="6" fill={color}/>
      <rect x="62" y="28" width="50" height="5" rx="2.5" fill="#fff" opacity="0.7"/>
      <rect x="62" y="40" width="40" height="4" rx="2" fill="#fff" opacity="0.5"/>
      <rect x="62" y="52" width="44" height="4" rx="2" fill="#fff" opacity="0.5"/>
      <rect x="62" y="64" width="36" height="4" rx="2" fill="#fff" opacity="0.5"/>
      <circle cx="158" cy="38" r="22" fill={color} opacity="0.3"/>
      <text x="150" y="44" fontSize="22" fill={color}>💡</text>
    </svg>
  ),
  tools: (color) => (
    <svg viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
      <rect x="20" y="50" width="160" height="60" rx="10" fill={color} opacity="0.2"/>
      <rect x="35" y="35" width="50" height="75" rx="8" fill={color} opacity="0.5"/>
      <rect x="95" y="50" width="70" height="40" rx="8" fill={color} opacity="0.7"/>
      <circle cx="60" cy="72" r="14" fill="#fff" opacity="0.4"/>
      <text x="50" y="78" fontSize="18" fill={color}>⚙️</text>
      <text x="100" y="76" fontSize="18" fill={color}>🔧</text>
    </svg>
  ),
  default: (color) => (
    <svg viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
      <circle cx="100" cy="65" r="50" fill={color} opacity="0.2"/>
      <circle cx="100" cy="65" r="34" fill={color} opacity="0.35"/>
      <circle cx="100" cy="65" r="20" fill={color} opacity="0.55"/>
      <text x="88" y="72" fontSize="22" fill="#fff">🔗</text>
    </svg>
  ),
};

const getIllustration = (catName, color) => {
  const n = catName?.toLowerCase() || "";
  if (n.includes("learn") || n.includes("course") || n.includes("study")) return Illustrations.learning(color);
  if (n.includes("tool") || n.includes("dev") || n.includes("code")) return Illustrations.tools(color);
  return Illustrations.default(color);
};

// ── Paperclip SVG ─────────────────────────────────────────────────────────────
const Paperclip = ({ color = "#c0a882" }) => (
  <svg width="22" height="42" viewBox="0 0 22 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 2C6.58172 2 3 5.58172 3 10V32C3 37.5228 7.47715 42 13 42C18.5228 42 23 37.5228 23 32V8" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M7 10V32C7 35.3137 9.68629 38 13 38C16.3137 38 19 35.3137 19 32V10C19 7.79086 17.2091 6 15 6C12.7909 6 11 7.79086 11 10V32" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
  </svg>
);

// ── Storage helpers (localStorage) ───────────────────────────────────────────
const STORAGE_KEY = "linkmanager-v1";

function loadData() {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    return r ? JSON.parse(r) : { links: [], categories: [] };
  } catch { return { links: [], categories: [] }; }
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

// ── Priority label ────────────────────────────────────────────────────────────
const PRIORITIES = ["low", "mid", "high"];

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(() => loadData());
  const [activeCategory, setActiveCategory] = useState("All");
  const [sheet, setSheet] = useState(null);
  const [editLink, setEditLink] = useState(null);
  const [summaryContent, setSummaryContent] = useState({ title: "", prompt: "" });
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  function emptyForm() {
    return { title: "", url: "", notes: "", category: "", tags: "", priority: "mid" };
  }

  // Persist on change
  useEffect(() => {
    saveData(data);
  }, [data]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  // ── Categories derived ──────────────────────────────────────────────────────
  const allCategories = ["All", ...data.categories];

  // ── Filtered links ──────────────────────────────────────────────────────────
  const visibleLinks = data.links.filter(l => {
    const matchCat = activeCategory === "All" || l.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || l.title.toLowerCase().includes(q) || l.url.toLowerCase().includes(q) || (l.notes || "").toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  // Group by category
  const grouped = {};
  visibleLinks.forEach(l => {
    const k = l.category || "Uncategorised";
    if (!grouped[k]) grouped[k] = [];
    grouped[k].push(l);
  });

  // ── Add / Edit ──────────────────────────────────────────────────────────────
  const openAdd = () => { setForm(emptyForm()); setEditLink(null); setSheet("add"); };
  const openEdit = (link) => { setForm({ ...link, tags: (link.tags || []).join(", ") }); setEditLink(link); setSheet("edit"); };

  const handleSave = () => {
    if (!form.url.trim() || !form.title.trim()) return;
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    const catName = form.category.trim() || "Uncategorised";
    const newLink = {
      ...form, tags, category: catName,
      id: editLink?.id || Date.now().toString(),
      saved: editLink?.saved || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    };
    let newCats = [...data.categories];
    if (catName !== "Uncategorised" && !newCats.includes(catName)) newCats.push(catName);
    if (editLink) {
      setData(d => ({ ...d, links: d.links.map(l => l.id === editLink.id ? newLink : l), categories: newCats }));
    } else {
      setData(d => ({ ...d, links: [newLink, ...d.links], categories: newCats }));
    }
    setSheet(null);
    showToast(editLink ? "✏️ Updated!" : "📌 Pinned!");
  };

  const deleteLink = (id) => {
    setData(d => ({ ...d, links: d.links.filter(l => l.id !== id) }));
    showToast("🗑 Removed");
  };

  // ── Summaries ───────────────────────────────────────────────────────────────
  const buildSinglePrompt = (link) =>
    `Please summarise this link for me:\n\nTitle: ${link.title}\nURL: ${link.url}${link.notes ? `\nNotes: ${link.notes}` : ""}${link.tags?.length ? `\nTags: ${link.tags.join(", ")}` : ""}\n\nGive me a concise summary of what this resource is about.`;

  const buildGroupPrompt = (catName, links) =>
    `Please summarise these links from my "${catName}" collection:\n\n${links.map((l, i) => `${i + 1}. ${l.title}\n   URL: ${l.url}${l.notes ? `\n   Notes: ${l.notes}` : ""}${l.tags?.length ? `\n   Tags: ${l.tags.join(", ")}` : ""}`).join("\n\n")}\n\nGive me a combined summary of what these resources cover and key takeaways.`;

  const openSummaryLink = (link) => {
    setSummaryContent({ title: link.title, prompt: buildSinglePrompt(link) });
    setSheet("summary");
  };

  const openSummaryGroup = (catName, links) => {
    setSummaryContent({ title: `${catName} (${links.length} links)`, prompt: buildGroupPrompt(catName, links) });
    setSheet("summary");
  };

  const handleSummarise = () => {
    navigator.clipboard?.writeText(summaryContent.prompt).catch(() => {});
    window.open("https://claude.ai", "_blank");
    showToast("📋 Copied & opening Claude!");
    setSheet(null);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <FontLoader />

      {/* ── TOP BAR ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--cream)", borderBottom: "1.5px solid var(--cream-dark)", padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, maxWidth: 768, margin: "0 auto" }}>
          <span className="handwritten" style={{ fontSize: 26, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.5px" }}>
            my links ✦
          </span>
          <button onClick={() => setShowSearch(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--ink-light)", padding: 4 }}>
            {showSearch ? "✕" : "🔍"}
          </button>
        </div>
        {showSearch && (
          <div style={{ paddingBottom: 10, maxWidth: 768, margin: "0 auto" }}>
            <input className="diary-input" placeholder="search links…" value={search} onChange={e => setSearch(e.target.value)} style={{ borderRadius: 99, borderBottom: "1.5px solid var(--cream-dark)" }} />
          </div>
        )}
        {/* Category pills */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10, paddingTop: 2, maxWidth: 768, margin: "0 auto", scrollbarWidth: "none" }}>
          {allCategories.map((cat, i) => {
            const pal = i === 0 ? { accent: "var(--ink)", bg: "var(--ink)" } : palette(i - 1);
            return (
              <button key={cat} className={`cat-pill ${activeCategory === cat ? "active" : ""}`}
                style={{ color: pal.accent, background: activeCategory === cat ? pal.accent : "transparent" }}
                onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ padding: "20px 16px 100px", maxWidth: 768, margin: "0 auto" }}>
        {Object.keys(grouped).length === 0 && (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <div style={{ fontSize: 48 }}>📖</div>
            <p className="handwritten" style={{ fontSize: 22, color: "var(--ink-light)", marginTop: 12 }}>
              your diary is empty<br />tap + to pin your first link
            </p>
          </div>
        )}

        {Object.entries(grouped).map(([catName, links], gi) => {
          const pal = palette(data.categories.indexOf(catName));
          return (
            <div key={catName} style={{ marginBottom: 36 }}>
              {/* Category header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span className="handwritten" style={{ fontSize: 22, fontWeight: 700, color: pal.accent }}>
                  {catName}
                  <span style={{ fontSize: 14, fontWeight: 400, color: "var(--ink-light)", marginLeft: 6, fontFamily: "DM Sans, sans-serif" }}>
                    {links.length} {links.length === 1 ? "link" : "links"}
                  </span>
                </span>
                <button className="btn-sm" onClick={() => openSummaryGroup(catName, links)}
                  style={{ background: pal.accent, color: "#fff", fontSize: 13 }}>
                  ✨ summarise all
                </button>
              </div>
              <div className="doodle-div" style={{ background: `repeating-linear-gradient(90deg, ${pal.accent} 0px, ${pal.accent} 6px, transparent 6px, transparent 12px)` }} />

              {/* Cards grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: 20 }}>
                {links.map((link, li) => (
                  <LinkCard key={link.id} link={link} palette={pal} tilt={tiltClass(li)} catName={catName}
                    onEdit={() => openEdit(link)}
                    onDelete={() => deleteLink(link.id)}
                    onSummarise={() => openSummaryLink(link)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── FAB ── */}
      <button className="fab" onClick={openAdd}>＋</button>

      {/* ── SHEETS ── */}
      {sheet && (
        <>
          <div className="backdrop" onClick={() => setSheet(null)} />
          <div className="sheet">
            <div className="sheet-handle" />

            {/* Add / Edit form */}
            {(sheet === "add" || sheet === "edit") && (
              <div style={{ padding: "16px 20px 32px" }}>
                <p className="handwritten" style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
                  {sheet === "edit" ? "✏️ edit link" : "📌 pin a link"}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input className="diary-input" placeholder="URL *" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
                  <input className="diary-input" placeholder="Title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                  <input className="diary-input" placeholder="Category (e.g. Learning, Tools…)" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} list="cat-suggestions" />
                  <datalist id="cat-suggestions">{data.categories.map(c => <option key={c} value={c} />)}</datalist>
                  <input className="diary-input" placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
                  <textarea className="diary-input" placeholder="Notes…" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                  {/* Priority */}
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "var(--ink-light)" }}>Priority:</span>
                    {PRIORITIES.map(p => (
                      <button key={p} onClick={() => setForm(f => ({ ...f, priority: p }))}
                        style={{ padding: "4px 14px", borderRadius: 99, border: `2px solid ${form.priority === p ? "var(--ink)" : "var(--cream-dark)"}`, background: form.priority === p ? "var(--ink)" : "transparent", color: form.priority === p ? "#fff" : "var(--ink-light)", fontFamily: "Caveat, cursive", fontSize: 15, cursor: "pointer" }}>
                        {p}
                      </button>
                    ))}
                  </div>
                  <button className="btn-primary" onClick={handleSave}>
                    {sheet === "edit" ? "save changes" : "pin it ✦"}
                  </button>
                </div>
              </div>
            )}

            {/* Summary sheet */}
            {sheet === "summary" && (
              <div style={{ padding: "16px 20px 32px" }}>
                <p className="handwritten" style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>✨ summarise</p>
                <p style={{ fontSize: 13, color: "var(--ink-light)", marginBottom: 14 }}>{summaryContent.title}</p>
                <div className="summary-box">
                  <p style={{ fontSize: 12, color: "var(--ink-light)", marginBottom: 8, fontWeight: 500 }}>PROMPT THAT WILL BE COPIED:</p>
                  <p style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>{summaryContent.prompt}</p>
                </div>
                <button className="btn-primary" style={{ marginTop: 16 }} onClick={handleSummarise}>
                  📋 copy & open Claude.ai
                </button>
                <p style={{ textAlign: "center", fontSize: 12, color: "var(--ink-light)", marginTop: 10 }}>
                  paste the prompt in Claude and get your summary
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── TOAST ── */}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

// ── Link Card ─────────────────────────────────────────────────────────────────
function LinkCard({ link, palette: pal, tilt, catName, onEdit, onDelete, onSummarise }) {
  const [expanded, setExpanded] = useState(false);

  const priorityColor = { high: "#e85d4a", mid: "#f5a623", low: "#6cc56a" }[link.priority] || "#c0a882";

  const tiltDeg = tilt.includes("tilt-1") ? -1.2
    : tilt.includes("tilt-2") ? 0.8
    : tilt.includes("tilt-3") ? -0.5
    : tilt.includes("tilt-4") ? 1.5
    : 0;

  return (
    <div className="card-wrap" style={{ position: "relative", paddingTop: 12 }}>
      {/* Washi tape */}
      <div className="washi" style={{ background: pal.tape }} />
      {/* Paperclip */}
      <div className="clip"><Paperclip color={pal.accent} /></div>

      <div className="card-inner" style={{
        background: pal.bg,
        borderRadius: 12,
        padding: "14px 14px 12px",
        boxShadow: "0 3px 14px rgba(44,36,22,0.12)",
        transform: `rotate(${tiltDeg}deg)`,
        transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        cursor: "pointer",
        userSelect: "none",
      }} onClick={() => setExpanded(e => !e)}>

        {/* Illustration */}
        <div className="ill-wrap" style={{ background: `${pal.accent}18` }}>
          {getIllustration(catName, pal.ill)}
        </div>

        {/* Priority dot + title row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: priorityColor, marginTop: 5, flexShrink: 0 }} />
          <span className="handwritten" style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", lineHeight: 1.3, wordBreak: "break-word" }}>
            {link.title}
          </span>
        </div>

        {/* URL preview */}
        <p style={{ fontSize: 11, color: pal.accent, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
          {link.url.replace(/^https?:\/\//, "")}
        </p>

        {/* Tags */}
        {link.tags?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
            {link.tags.slice(0, 3).map(t => <span key={t} className="tag-pill">#{t}</span>)}
            {link.tags.length > 3 && <span className="tag-pill">+{link.tags.length - 3}</span>}
          </div>
        )}

        {/* Notes (expanded) */}
        {expanded && link.notes && (
          <p style={{ fontSize: 13, color: "var(--ink-light)", marginBottom: 10, lineHeight: 1.55, borderTop: `1px dashed ${pal.accent}55`, paddingTop: 8 }}>
            {link.notes}
          </p>
        )}

        {/* Date + actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 11, color: "var(--ink-light)" }}>{link.saved}</span>
          <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
            <button className="btn-sm" onClick={onSummarise} style={{ background: pal.accent, color: "#fff", fontSize: 12, padding: "4px 10px" }}>✨</button>
            <button className="btn-sm" onClick={onEdit} style={{ background: "rgba(0,0,0,0.08)", color: "var(--ink)", fontSize: 12, padding: "4px 10px" }}>✏️</button>
            <button className="btn-sm" onClick={() => { if (window.confirm("Remove this link?")) onDelete(); }} style={{ background: "rgba(232,93,74,0.12)", color: "#e85d4a", fontSize: 12, padding: "4px 10px" }}>✕</button>
          </div>
        </div>
      </div>
    </div>
  );
}
