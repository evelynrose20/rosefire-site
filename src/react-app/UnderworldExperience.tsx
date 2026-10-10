import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./UnderworldExperience.css";

type Phase = "infection" | "fracture" | "wall" | "blackout" | "terminal" | "uplink" | "chamber";
type Channel = "rumors" | "favors" | "afterdark";

const messages = [
  "> municipal index rejected",
  "> isolating public-facing network ...",
  "> quarantine bypass: accepted",
  "> routing through unregistered relay ...",
  "> surface trace: obscured",
  "> identity mask: active",
  "> underchannel handshake: acknowledged",
  "> relay owner: VESPER"
];
const transcript = messages.join("\n");
const channels: { id: Channel; number: string; name: string; heading: string; description: string }[] = [
  { id: "rumors", number: "01", name: "WHISPERS", heading: "Nothing stays buried forever.", description: "Names, rumors and quiet conversations travel further than people think. Learn to listen before you speak." },
  { id: "favors", number: "02", name: "FAVORS", heading: "Everyone owes somebody.", description: "A favor can open a door that money cannot. Who you trust is your own affair." },
  { id: "afterdark", number: "03", name: "AFTER DARK", heading: "The city has another shift.", description: "Once the storefront lights go out, other people begin their work. Keep your eyes open." }
];

export default function UnderworldExperience({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>("infection");
  const [printed, setPrinted] = useState("");
  const [seconds, setSeconds] = useState(12);
  const [selection, setSelection] = useState<Channel | null>(null);
  const closeRef = useRef(onExit);
  closeRef.current = onExit;

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.classList.add("rf-uw-site-disturbance");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const schedule = reduced
      ? ([["blackout", 350], ["terminal", 800]] as const)
      : ([["fracture", 1100], ["wall", 2700], ["blackout", 4900], ["terminal", 5900]] as const);
    const timers = schedule.map(([step, delay]) => window.setTimeout(() => setPhase(step), delay));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.classList.remove("rf-uw-site-disturbance");
      previousFocus?.focus();
    };
  }, []);

  useEffect(() => {
    if (phase !== "terminal") return;
    let offset = 0;
    let doneTimer: ReturnType<typeof setTimeout> | undefined;
    const interval = window.setInterval(() => {
      offset = Math.min(transcript.length, offset + 2);
      setPrinted(transcript.slice(0, offset));
      if (offset === transcript.length) {
        window.clearInterval(interval);
        doneTimer = window.setTimeout(() => setPhase("uplink"), 1800);
      }
    }, 45);
    return () => {
      window.clearInterval(interval);
      if (doneTimer) window.clearTimeout(doneTimer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "uplink") return;
    let remaining = 12;
    setSeconds(12);
    const clock = window.setInterval(() => {
      remaining -= 1;
      setSeconds(remaining);
      if (remaining <= 0) {
        window.clearInterval(clock);
        setPhase("chamber");
      }
    }, 1000);
    return () => window.clearInterval(clock);
  }, [phase]);

  const isBreaking = phase === "infection" || phase === "fracture" || phase === "wall";
  const activeChannel = channels.find(item => item.id === selection);
  return createPortal(
    <div className={"rf-uw rf-uw--" + phase} role="dialog" aria-modal="true" aria-label="Rosefire underground relay">
      <button className="rf-uw-escape" type="button" onClick={onExit} aria-label="Leave the underground network">EXIT / ESC</button>

      {isBreaking && <div className="rf-uw-breach" aria-hidden="true">
        <div className="rf-uw-breach-shroud" />
        <div className="rf-uw-breach-slice rf-uw-breach-slice--one"><span>RESIDENT DIRECTORY /// MEMORY DESYNC</span></div>
        <div className="rf-uw-breach-slice rf-uw-breach-slice--two"><span>SA PUBLIC NETWORK ::: SIGNAL OVERRIDE</span></div>
        <div className="rf-uw-breach-slice rf-uw-breach-slice--three"><span>ROSEFIRE // LOST PACKET // 019</span></div>
        <div className="rf-uw-breach-bars" />
        <div className="rf-uw-wall"><div className="rf-uw-wall-core" /><div className="rf-uw-wall-grid" /><div className="rf-uw-wall-cross" /><div className="rf-uw-wall-center">
          <span>YOU ARE BEYOND THE PUBLIC NETWORK</span>
          <strong>THE VEIL IS DOWN</strong>
          <small>RESTRICTED RELAY // ENTRY IRREVERSIBLE</small>
        </div></div>
        <div className="rf-uw-breach-warning"><span>CRITICAL SIGNAL ERROR</span><strong>PUBLIC LAYER COMPROMISED</strong><span>CONNECTION TRANSFERRING</span></div>
      </div>}

      {phase === "blackout" && <div className="rf-uw-blackout"><span>NO SIGNAL</span><strong>TRANSFER IN PROGRESS</strong></div>}

      {(phase === "terminal" || phase === "uplink") && <div className="rf-uw-console">
        <div className="rf-uw-console-top"><span>UNREGISTERED NETWORK RECOVERY</span><span>CHANNEL: RED / 07</span></div>
        <div className="rf-uw-console-main">
          <p className="rf-uw-eyebrow">THE SURFACE IS GONE. STAY QUIET.</p>
          <h1>Ghost relay established<span className="rf-uw-caret">_</span></h1>
          <pre>{printed}{phase === "terminal" && <span className="rf-uw-caret">█</span>}</pre>
          {phase === "uplink" && <div className="rf-uw-countdown">
            <div className="rf-uw-countdown-title"><span>ENCRYPTED UPLINK INITIALIZING</span><strong>{String(seconds).padStart(2, "0")}</strong></div>
            <div className="rf-uw-meter"><span style={{ width: ((12 - seconds) / 12 * 100) + "%" }} /></div>
            <div className="rf-uw-console-stats"><span>IDENTITY / MASKED</span><span>TRACE / LOST</span><span>HANDSHAKE / VERIFIED</span></div>
          </div>}
        </div>
        <div className="rf-uw-console-bottom">ACCESS CONTROLLED BY UNKNOWN NODE · DO NOT DISCONNECT</div>
      </div>}

      {phase === "chamber" && <div className="rf-uw-chamber">
        <div className="rf-uw-depth"><div className="rf-uw-horizon" /><div className="rf-uw-orbit rf-uw-orbit--outer" /><div className="rf-uw-orbit rf-uw-orbit--inner" /><div className="rf-uw-radial" /></div>
        <header className="rf-uw-chamber-header">
          <div className="rf-uw-wordmark"><span className="rf-uw-brand-mark">V</span><div><strong>VEIL / PRIVATE NETWORK</strong><small>ROSEFIRE UNDERGROUND · UNLISTED NODE</small></div></div>
          <div className="rf-uw-live"><span className="rf-uw-live-dot" /> CONNECTION SECURE <span className="rf-uw-trace">TRACE LOST</span></div>
        </header>
        <div className="rf-uw-chamber-layout">
          <main className="rf-uw-presence">
            <div className="rf-uw-presence-marker"><span>INCOMING TRANSMISSION</span><span>VESPER / CHANNEL OWNER</span></div>
            <div className="rf-uw-sigil" aria-hidden="true"><span>V</span><i /></div>
            <span className="rf-uw-eyebrow">WELCOME TO THE OTHER SIDE</span>
            <h1>Well, well.<br /><em>You found me.</em></h1>
            <p>Call me <strong>Vesper</strong>. There is a whole other Rosefire underneath the one they put on postcards. Deals nobody advertises. Names that never make the papers. Doors that only open for the right sort of stranger.</p>
            <p>Maybe you took a wrong turn. Or maybe you were looking for this all along.</p>
            <p className="rf-uw-invitation">You can see what is out there, darling. Or you can go running right back to safety. Your choice.</p>
            <div className="rf-uw-actions"><button type="button" onClick={() => setSelection("rumors")}>ENTER THE UNDERWORLD <span>↗</span></button><button className="rf-uw-safety" type="button" onClick={onExit}>GO BACK TO SAFETY ↗</button></div>
          </main>
          <aside className="rf-uw-panels" aria-label="Underground network channels">
            <div className="rf-uw-panels-heading"><span>NETWORK CHANNELS</span><span>03 FOUND</span></div>
            {channels.map(channel => <button className={"rf-uw-channel" + (selection === channel.id ? " rf-uw-channel--active" : "")} type="button" key={channel.id} onClick={() => setSelection(channel.id)}>
              <span className="rf-uw-channel-number">{channel.number} /</span><span className="rf-uw-channel-name">{channel.name}<small>{channel.heading}</small></span><span className="rf-uw-channel-arrow">↗</span>
            </button>)}
            <div className="rf-uw-dossier">
              <div><span>VEIL INTELLIGENCE</span><span>{activeChannel ? activeChannel.number : "00"} / 03</span></div>
              <h2>{activeChannel ? activeChannel.heading : "Most people never notice the door."}</h2>
              <p>{activeChannel ? activeChannel.description : "You did. The network remembers curious people. Take your time deciding what to look at."}</p>
              <span className="rf-uw-dossier-footer">INFORMATION / NOT FOR PUBLIC RELEASE</span>
            </div>
          </aside>
        </div>
        <footer className="rf-uw-chamber-footer"><span>NODE: VESPER / ONLINE</span><span>NO PUBLIC RECORD OF THIS SESSION</span><span>ROSEFIRE · UNLISTED</span></footer>
      </div>}
    </div>,
    document.documentElement
  );
}
