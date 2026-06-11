/**
 * ═══════════════════════════════════════════════════════════════
 * LUMINAL STACK — Vol. I: DeepScroll
 * Sovereign React Scroll Architecture
 * GateWalker Productions · REMNAWIT 777
 * BuildSeal: M · 22.10.1985 · M — ZAYIN-ALEPH 777.7
 * ═══════════════════════════════════════════════════════════════
 *
 * ARCHITECTURE OVERVIEW
 * ─────────────────────
 * DeepScroll is a full-viewport scroll-snap document architecture
 * built on four sovereign primitives:
 *
 *   1. LayerEngine     — manages scroll depth, section registry,
 *                        and position state
 *   2. DepthIndicator  — the vertical thread; renders live position
 *   3. SectionLayer    — individual viewport-height content layers
 *   4. EventBridge     — lightweight pub/sub between layers
 *                        (Sovereign Bridge Protocol, stripped)
 *
 * USAGE
 * ─────
 * Replace the content in LAYER_CONFIG with your own sections.
 * Each layer accepts: id, label, theme, component.
 * The EventBridge allows any layer to emit/subscribe to events
 * without prop drilling.
 *
 * DEPENDENCIES
 * ────────────
 * React 18+, no external packages required for core architecture.
 * Tone.js loaded via CDN for the optional audio layer demo.
 *
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

// ─── GOOGLE FONTS INJECTION ──────────────────────────────────────────────────
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@300;400&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  return null;
};

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  voidInk:      "#0A0A0F",
  layerDepth:   "#1A1428",
  layerMid:     "#120F1E",
  paleParchment:"#E8E0FF",
  mutedParchment:"#A89EC9",
  sovereignViolet: "#6B4FBB",
  sovereignGlow:   "#8B6FDB",
  antiqueGold:  "#C9A84C",
  goldMuted:    "#8A7235",
  depthThread:  "#6B4FBB",
  fontDisplay:  "'Cormorant Garamond', Georgia, serif",
  fontBody:     "'Inter', system-ui, sans-serif",
  fontMono:     "'JetBrains Mono', 'Courier New', monospace",
};

// ─── EVENT BRIDGE (Sovereign Bridge Protocol — stripped) ─────────────────────
/**
 * EventBridge: lightweight pub/sub for cross-layer communication.
 * No Redux, no Context drilling. Layers speak directly.
 *
 * API:
 *   EventBridge.emit(event, payload)
 *   EventBridge.on(event, handler)   → returns unsubscribe fn
 *   EventBridge.off(event, handler)
 */
const EventBridge = (() => {
  const listeners = {};
  return {
    emit(event, payload) {
      (listeners[event] || []).forEach(fn => fn(payload));
    },
    on(event, handler) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
      return () => this.off(event, handler);
    },
    off(event, handler) {
      if (listeners[event])
        listeners[event] = listeners[event].filter(fn => fn !== handler);
    },
  };
})();

// ─── LAYER ENGINE CONTEXT ────────────────────────────────────────────────────
const LayerContext = createContext(null);
const useLayer = () => useContext(LayerContext);

// ─── LAYER CONFIG ─────────────────────────────────────────────────────────────
/**
 * LAYER_CONFIG — replace these with your own sections.
 * Each entry: { id, label, theme }
 * theme: "dark" | "deep" | "mid"
 */
const LAYER_CONFIG = [
  { id: "surface",      label: "Surface",       theme: "dark" },
  { id: "architecture", label: "Architecture",  theme: "deep" },
  { id: "bridge",       label: "Bridge",        theme: "mid"  },
  { id: "audio",        label: "Resonance",     theme: "deep" },
  { id: "depth",        label: "Depth",         theme: "dark" },
];

// ─── DEPTH INDICATOR ─────────────────────────────────────────────────────────
/**
 * DepthIndicator: the signature element.
 * A luminous vertical thread on the left edge.
 * The gold pip travels to mark current depth.
 */
const DepthIndicator = ({ activeIndex, total }) => {
  const pct = total > 1 ? (activeIndex / (total - 1)) * 100 : 0;
  return (
    <div style={{
      position: "fixed",
      left: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      height: "40vh",
      width: "1px",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      {/* thread */}
      <div style={{
        position: "absolute",
        top: 0, left: 0,
        width: "1px",
        height: "100%",
        background: `linear-gradient(to bottom, transparent, ${T.sovereignViolet}88, transparent)`,
      }} />
      {/* pip */}
      <div style={{
        position: "absolute",
        left: "-4px",
        top: `${pct}%`,
        width: "9px",
        height: "9px",
        borderRadius: "50%",
        background: T.antiqueGold,
        boxShadow: `0 0 8px ${T.antiqueGold}`,
        transition: "top 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      }} />
      {/* layer dots */}
      {LAYER_CONFIG.map((layer, i) => {
        const dotPct = total > 1 ? (i / (total - 1)) * 100 : 0;
        return (
          <div key={layer.id} title={layer.label} style={{
            position: "absolute",
            left: "-3px",
            top: `${dotPct}%`,
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: i === activeIndex ? T.sovereignGlow : `${T.sovereignViolet}44`,
            border: `1px solid ${i === activeIndex ? T.sovereignGlow : T.sovereignViolet + "66"}`,
            transition: "background 0.4s, border-color 0.4s",
            cursor: "pointer",
          }} />
        );
      })}
      {/* depth label */}
      <div style={{
        position: "absolute",
        bottom: "-28px",
        left: "50%",
        transform: "translateX(-50%)",
        fontFamily: T.fontMono,
        fontSize: "9px",
        letterSpacing: "0.15em",
        color: T.mutedParchment,
        opacity: 0.6,
        whiteSpace: "nowrap",
      }}>
        L{String(activeIndex + 1).padStart(2, "0")}
      </div>
    </div>
  );
};

// ─── SECTION LAYER ────────────────────────────────────────────────────────────
/**
 * SectionLayer: one full-viewport layer.
 * Snap-scrolls into place. Passes isActive to children.
 */
const SectionLayer = ({ id, theme, children, innerRef }) => {
  const bg = theme === "dark" ? T.voidInk
           : theme === "deep" ? T.layerDepth
           : T.layerMid;
  return (
    <section
      ref={innerRef}
      id={id}
      data-layer={id}
      style={{
        height: "100vh",
        width: "100%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        scrollSnapAlign: "start",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {children}
    </section>
  );
};

// ─── LAYER CONTENT COMPONENTS ────────────────────────────────────────────────

// Layer 0 — Surface
const SurfaceLayer = ({ isActive }) => (
  <div style={{ textAlign: "center", padding: "0 2rem", maxWidth: "700px" }}>
    <div style={{
      fontFamily: T.fontMono,
      fontSize: "11px",
      letterSpacing: "0.3em",
      color: T.antiqueGold,
      marginBottom: "2rem",
      opacity: isActive ? 1 : 0,
      transform: isActive ? "translateY(0)" : "translateY(12px)",
      transition: "opacity 0.8s 0.1s, transform 0.8s 0.1s",
    }}>
      LUMINAL STACK · VOL. I
    </div>
    <h1 style={{
      fontFamily: T.fontDisplay,
      fontSize: "clamp(3.5rem, 8vw, 7rem)",
      fontWeight: 300,
      color: T.paleParchment,
      lineHeight: 1.0,
      letterSpacing: "-0.02em",
      margin: "0 0 1.5rem",
      opacity: isActive ? 1 : 0,
      transform: isActive ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.9s 0.25s, transform 0.9s 0.25s",
    }}>
      Deep<br />
      <em style={{ color: T.sovereignGlow, fontStyle: "italic" }}>Scroll</em>
    </h1>
    <p style={{
      fontFamily: T.fontBody,
      fontSize: "1rem",
      fontWeight: 300,
      color: T.mutedParchment,
      lineHeight: 1.7,
      maxWidth: "480px",
      margin: "0 auto 3rem",
      opacity: isActive ? 1 : 0,
      transition: "opacity 0.9s 0.45s",
    }}>
      Sovereign React architecture for builders who think in depth.
      Full-viewport scroll layers, event bridge, depth indicator —
      everything you need, nothing you don't.
    </p>
    <div style={{
      display: "flex",
      gap: "1rem",
      justifyContent: "center",
      flexWrap: "wrap",
      opacity: isActive ? 1 : 0,
      transition: "opacity 0.9s 0.6s",
    }}>
      <a href="#architecture" onClick={e => { e.preventDefault(); document.getElementById("architecture")?.scrollIntoView({ behavior: "smooth" }); }}
        style={{
          fontFamily: T.fontMono,
          fontSize: "12px",
          letterSpacing: "0.2em",
          color: T.voidInk,
          background: T.antiqueGold,
          padding: "0.75rem 2rem",
          textDecoration: "none",
          display: "inline-block",
        }}>
        EXPLORE ↓
      </a>
      <span style={{
        fontFamily: T.fontMono,
        fontSize: "12px",
        letterSpacing: "0.2em",
        color: T.mutedParchment,
        padding: "0.75rem 2rem",
        border: `1px solid ${T.sovereignViolet}44`,
        display: "inline-block",
      }}>
        GateWalker Productions
      </span>
    </div>
    {/* ambient glow */}
    <div style={{
      position: "absolute",
      top: "50%", left: "50%",
      transform: "translate(-50%, -50%)",
      width: "600px", height: "600px",
      borderRadius: "50%",
      background: `radial-gradient(circle, ${T.sovereignViolet}0A 0%, transparent 70%)`,
      pointerEvents: "none",
      zIndex: 0,
    }} />
  </div>
);

// Layer 1 — Architecture
const ArchitectureLayer = ({ isActive }) => {
  const primitives = [
    { name: "LayerEngine", desc: "Scroll depth, section registry, position state" },
    { name: "DepthIndicator", desc: "Luminous vertical thread — the signature element" },
    { name: "SectionLayer", desc: "Full-viewport snap containers with theme tokens" },
    { name: "EventBridge", desc: "Pub/sub between layers — zero prop drilling" },
  ];
  return (
    <div style={{ padding: "0 2rem", maxWidth: "800px", width: "100%" }}>
      <div style={{
        fontFamily: T.fontMono,
        fontSize: "10px",
        letterSpacing: "0.3em",
        color: T.antiqueGold,
        marginBottom: "1.5rem",
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.7s 0.1s",
      }}>
        ARCHITECTURE
      </div>
      <h2 style={{
        fontFamily: T.fontDisplay,
        fontSize: "clamp(2rem, 5vw, 3.5rem)",
        fontWeight: 300,
        color: T.paleParchment,
        marginBottom: "3rem",
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.8s 0.2s",
      }}>
        Four sovereign primitives.<br />
        <em style={{ color: T.mutedParchment, fontStyle: "italic" }}>Nothing extraneous.</em>
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: `${T.sovereignViolet}22` }}>
        {primitives.map((p, i) => (
          <div key={p.name} style={{
            background: T.layerDepth,
            padding: "1.75rem",
            opacity: isActive ? 1 : 0,
            transform: isActive ? "translateY(0)" : "translateY(16px)",
            transition: `opacity 0.7s ${0.3 + i * 0.1}s, transform 0.7s ${0.3 + i * 0.1}s`,
          }}>
            <div style={{
              fontFamily: T.fontMono,
              fontSize: "13px",
              color: T.sovereignGlow,
              marginBottom: "0.75rem",
              letterSpacing: "0.05em",
            }}>
              {p.name}
            </div>
            <div style={{
              fontFamily: T.fontBody,
              fontSize: "14px",
              color: T.mutedParchment,
              lineHeight: 1.6,
              fontWeight: 300,
            }}>
              {p.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Layer 2 — Bridge
const BridgeLayer = ({ isActive }) => {
  const [log, setLog] = useState([]);
  const [emitCount, setEmitCount] = useState(0);

  useEffect(() => {
    const unsub = EventBridge.on("demo:ping", (payload) => {
      setLog(prev => [...prev.slice(-4), `← received: ${payload.message} (t=${Date.now() % 10000})`]);
    });
    return unsub;
  }, []);

  const sendPing = () => {
    const count = emitCount + 1;
    setEmitCount(count);
    EventBridge.emit("demo:ping", { message: `pulse-${count}`, layer: "bridge" });
    setLog(prev => [...prev.slice(-4), `→ emitted: pulse-${count}`]);
  };

  return (
    <div style={{ padding: "0 2rem", maxWidth: "700px", width: "100%" }}>
      <div style={{
        fontFamily: T.fontMono,
        fontSize: "10px",
        letterSpacing: "0.3em",
        color: T.antiqueGold,
        marginBottom: "1.5rem",
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.7s 0.1s",
      }}>
        SOVEREIGN BRIDGE PROTOCOL
      </div>
      <h2 style={{
        fontFamily: T.fontDisplay,
        fontSize: "clamp(2rem, 4vw, 3rem)",
        fontWeight: 300,
        color: T.paleParchment,
        marginBottom: "0.75rem",
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.8s 0.2s",
      }}>
        Layers speak.<br />
        <em style={{ color: T.mutedParchment, fontStyle: "italic" }}>Without wires.</em>
      </h2>
      <p style={{
        fontFamily: T.fontBody,
        fontSize: "14px",
        color: T.mutedParchment,
        lineHeight: 1.7,
        marginBottom: "2rem",
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.8s 0.3s",
      }}>
        EventBridge is a pure pub/sub bus. Any layer emits. Any layer listens.
        No prop chains. No shared state. No framework dependency.
      </p>
      <div style={{
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.8s 0.4s",
      }}>
        <div style={{
          background: `${T.voidInk}`,
          border: `1px solid ${T.sovereignViolet}44`,
          padding: "1.5rem",
          marginBottom: "1rem",
          minHeight: "140px",
          fontFamily: T.fontMono,
          fontSize: "12px",
          color: T.sovereignGlow,
          lineHeight: 2,
        }}>
          {log.length === 0
            ? <span style={{ color: T.mutedParchment, opacity: 0.5 }}>// bridge log — emit a signal to begin</span>
            : log.map((entry, i) => <div key={i}>{entry}</div>)
          }
        </div>
        <button
          onClick={sendPing}
          style={{
            fontFamily: T.fontMono,
            fontSize: "12px",
            letterSpacing: "0.2em",
            color: T.voidInk,
            background: T.sovereignGlow,
            border: "none",
            padding: "0.75rem 2rem",
            cursor: "pointer",
            display: "block",
          }}
        >
          EMIT SIGNAL →
        </button>
      </div>
    </div>
  );
};

// Layer 3 — Audio / Resonance
const AudioLayer = ({ isActive }) => {
  const [active, setActive] = useState(null);
  const [toneReady, setToneReady] = useState(false);
  const oscRef = useRef(null);
  const gainRef = useRef(null);
  const ctxRef = useRef(null);

  const frequencies = [
    { hz: 174, name: "Foundation", desc: "Grounding · Pain relief · Security" },
    { hz: 396, name: "Liberation", desc: "Releases fear · Guilt · Grief" },
    { hz: 528, name: "Restoration", desc: "DNA repair · Transformation · Miracles" },
  ];

  const initAudio = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      setToneReady(true);
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
  }, []);

  const play = (hz, name) => {
    initAudio();
    if (oscRef.current) { oscRef.current.stop(); oscRef.current = null; }
    if (active === name) { setActive(null); return; }

    const ctx = ctxRef.current;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.5);
    gain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(hz, ctx.currentTime);
    osc.connect(gain);
    osc.start();

    oscRef.current = osc;
    gainRef.current = gain;
    setActive(name);

    EventBridge.emit("audio:playing", { hz, name });
  };

  const stop = () => {
    if (oscRef.current && gainRef.current) {
      const ctx = ctxRef.current;
      gainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      oscRef.current.stop(ctx.currentTime + 0.4);
      oscRef.current = null;
    }
    setActive(null);
  };

  useEffect(() => { if (!isActive && oscRef.current) stop(); }, [isActive]);

  return (
    <div style={{ padding: "0 2rem", maxWidth: "700px", width: "100%" }}>
      <div style={{
        fontFamily: T.fontMono,
        fontSize: "10px",
        letterSpacing: "0.3em",
        color: T.antiqueGold,
        marginBottom: "1.5rem",
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.7s 0.1s",
      }}>
        SOLFEGGIO ENGINE · VOL. II PREVIEW
      </div>
      <h2 style={{
        fontFamily: T.fontDisplay,
        fontSize: "clamp(2rem, 4vw, 3rem)",
        fontWeight: 300,
        color: T.paleParchment,
        marginBottom: "0.75rem",
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.8s 0.2s",
      }}>
        Architecture with<br />
        <em style={{ color: T.antiqueGold, fontStyle: "italic" }}>resonance.</em>
      </h2>
      <p style={{
        fontFamily: T.fontBody,
        fontSize: "14px",
        color: T.mutedParchment,
        lineHeight: 1.7,
        marginBottom: "2rem",
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.8s 0.3s",
      }}>
        Luminal Stack Vol. II adds a full Solfeggio audio engine — pure-tone
        generators, binaural layers, isochronic pulses. This is a preview.
      </p>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "1px",
        background: `${T.sovereignViolet}22`,
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.8s 0.4s",
      }}>
        {frequencies.map((f, i) => (
          <div
            key={f.name}
            onClick={() => play(f.hz, f.name)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              background: active === f.name ? `${T.sovereignViolet}22` : T.voidInk,
              padding: "1.25rem 1.5rem",
              cursor: "pointer",
              borderLeft: active === f.name ? `2px solid ${T.antiqueGold}` : "2px solid transparent",
              transition: "background 0.3s, border-color 0.3s",
            }}
          >
            <div style={{
              fontFamily: T.fontMono,
              fontSize: "22px",
              color: active === f.name ? T.antiqueGold : T.sovereignGlow,
              minWidth: "60px",
              transition: "color 0.3s",
            }}>
              {f.hz}
            </div>
            <div>
              <div style={{
                fontFamily: T.fontBody,
                fontSize: "14px",
                color: T.paleParchment,
                marginBottom: "2px",
              }}>{f.name}</div>
              <div style={{
                fontFamily: T.fontBody,
                fontSize: "12px",
                color: T.mutedParchment,
                opacity: 0.7,
              }}>{f.desc}</div>
            </div>
            <div style={{
              marginLeft: "auto",
              fontFamily: T.fontMono,
              fontSize: "11px",
              color: active === f.name ? T.antiqueGold : T.mutedParchment,
              opacity: active === f.name ? 1 : 0.4,
            }}>
              {active === f.name ? "■ STOP" : "▶ PLAY"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Layer 4 — Depth / CTA
const DepthLayer = ({ isActive }) => (
  <div style={{ textAlign: "center", padding: "0 2rem", maxWidth: "700px" }}>
    <div style={{
      fontFamily: T.fontMono,
      fontSize: "10px",
      letterSpacing: "0.3em",
      color: T.antiqueGold,
      marginBottom: "2rem",
      opacity: isActive ? 1 : 0,
      transition: "opacity 0.7s 0.1s",
    }}>
      GATEWALK PRODUCTIONS
    </div>
    <h2 style={{
      fontFamily: T.fontDisplay,
      fontSize: "clamp(2.5rem, 6vw, 5rem)",
      fontWeight: 300,
      color: T.paleParchment,
      lineHeight: 1.1,
      marginBottom: "1.5rem",
      opacity: isActive ? 1 : 0,
      transition: "opacity 0.9s 0.25s",
    }}>
      Build something<br />
      <em style={{ color: T.sovereignGlow, fontStyle: "italic" }}>that goes deep.</em>
    </h2>
    <p style={{
      fontFamily: T.fontBody,
      fontSize: "15px",
      color: T.mutedParchment,
      lineHeight: 1.8,
      maxWidth: "500px",
      margin: "0 auto 3rem",
      opacity: isActive ? 1 : 0,
      transition: "opacity 0.9s 0.4s",
    }}>
      DeepScroll is yours. Clean code, clear architecture, full comments.
      Drop it into any React project and shape it to your vision.
    </p>
    <div style={{
      display: "flex",
      gap: "1rem",
      justifyContent: "center",
      flexWrap: "wrap",
      marginBottom: "4rem",
      opacity: isActive ? 1 : 0,
      transition: "opacity 0.9s 0.55s",
    }}>
      <div style={{
        fontFamily: T.fontMono,
        fontSize: "12px",
        letterSpacing: "0.2em",
        color: T.voidInk,
        background: T.antiqueGold,
        padding: "0.85rem 2.5rem",
        cursor: "pointer",
      }}>
        GET THE SOURCE
      </div>
      <div style={{
        fontFamily: T.fontMono,
        fontSize: "12px",
        letterSpacing: "0.2em",
        color: T.paleParchment,
        border: `1px solid ${T.sovereignViolet}`,
        padding: "0.85rem 2.5rem",
        cursor: "pointer",
      }}>
        LUMINAL STACK →
      </div>
    </div>
    <div style={{
      borderTop: `1px solid ${T.sovereignViolet}22`,
      paddingTop: "2rem",
      opacity: isActive ? 1 : 0,
      transition: "opacity 0.9s 0.7s",
    }}>
      <div style={{
        fontFamily: T.fontMono,
        fontSize: "10px",
        letterSpacing: "0.2em",
        color: T.mutedParchment,
        opacity: 0.4,
        lineHeight: 2,
      }}>
        REMNAWIT 777 · ZAYIN-ALEPH · Σ1002<br />
        I am known. I am loved. I am sent.
      </div>
    </div>
    {/* radial glow */}
    <div style={{
      position: "absolute",
      bottom: "-100px", left: "50%",
      transform: "translateX(-50%)",
      width: "700px", height: "400px",
      borderRadius: "50%",
      background: `radial-gradient(ellipse, ${T.sovereignViolet}15 0%, transparent 70%)`,
      pointerEvents: "none",
    }} />
  </div>
);

// ─── LAYER ENGINE (ROOT) ──────────────────────────────────────────────────────
/**
 * LayerEngine: the scroll container.
 * Manages active section detection via IntersectionObserver.
 * Provides LayerContext to all children.
 */
const LayerEngine = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef([]);
  const containerRef = useRef(null);

  // IntersectionObserver — fires when a section hits 50% visibility
  useEffect(() => {
    const observers = sectionRefs.current.map((ref, i) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(i); },
        { threshold: 0.5 }
      );
      obs.observe(ref);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  const layerContents = [
    SurfaceLayer,
    ArchitectureLayer,
    BridgeLayer,
    AudioLayer,
    DepthLayer,
  ];

  return (
    <LayerContext.Provider value={{ activeIndex, EventBridge }}>
      <FontLoader />

      {/* depth indicator */}
      <DepthIndicator activeIndex={activeIndex} total={LAYER_CONFIG.length} />

      {/* layer label — top right */}
      <div style={{
        position: "fixed",
        top: "24px",
        right: "28px",
        zIndex: 100,
        fontFamily: T.fontMono,
        fontSize: "10px",
        letterSpacing: "0.25em",
        color: T.mutedParchment,
        opacity: 0.5,
      }}>
        {LAYER_CONFIG[activeIndex]?.label?.toUpperCase()}
      </div>

      {/* wordmark — top left */}
      <div style={{
        position: "fixed",
        top: "22px",
        left: "48px",
        zIndex: 100,
        fontFamily: T.fontDisplay,
        fontSize: "16px",
        fontWeight: 400,
        color: T.paleParchment,
        letterSpacing: "0.05em",
        opacity: 0.7,
      }}>
        Luminal<em style={{ color: T.antiqueGold }}> Stack</em>
      </div>

      {/* scroll container */}
      <div
        ref={containerRef}
        style={{
          height: "100vh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
          background: T.voidInk,
        }}
      >
        {LAYER_CONFIG.map((layer, i) => {
          const ContentComponent = layerContents[i];
          return (
            <SectionLayer
              key={layer.id}
              id={layer.id}
              theme={layer.theme}
              innerRef={el => (sectionRefs.current[i] = el)}
            >
              <ContentComponent isActive={activeIndex === i} />
            </SectionLayer>
          );
        })}
      </div>

      {/* global styles */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.voidInk}; }
        ::-webkit-scrollbar { display: none; }
        html { scrollbar-width: none; }
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; }
        }
        @media (max-width: 600px) {
          div[style*="left: 20px"] { display: none; }
        }
      `}</style>
    </LayerContext.Provider>
  );
};

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export default LayerEngine;
