import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import {
  Zap,
  Radio,
  BookOpen,
  X,
  ExternalLink,
  Cpu,
  Compass,
  Volume2,
  ArrowLeft,
} from 'lucide-react';
import { THEME_OPTIONS } from '../services/theme';

export function SpidermanThemeHUD() {
  const [selectedAcronym, setSelectedAcronym] = useState<string | null>(null);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [lastThwip, setLastThwip] = useState<string | null>(null);

  // Close modal on Escape key and lock body scroll
  useEffect(() => {
    if (!showDossierModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowDossierModal(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDossierModal]);

  const spideyTheme = THEME_OPTIONS.find((t) => t.id === 'spiderman');
  if (!spideyTheme || !spideyTheme.acronyms) return null;

  const handleThwip = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 90,
        origin: { y: 0.35, x: 0.5 },
        colors: ['#ef4444', '#3b82f6', '#ffffff', '#dc2626', '#1d4ed8'],
        ticks: 200,
        gravity: 1.2,
      });
    } catch (e) {}

    const thwips = [
      'THWIP! 🕸️ Web-line anchored to senior architecture nodes!',
      'THWIP! 🕷️ Spider-Sense detects +150 XP bonus path!',
      'FZZZT! ⚡ Miles Morales bio-electric venom blast ready!',
      'THWIP! 🚀 "With great power comes great responsibility!"',
      'ZIP! 🕸️ K.A.R.E.N. recalculates optimal skill tree trajectory!',
    ];
    const chosen = thwips[Math.floor(Math.random() * thwips.length)];
    setLastThwip(chosen);
    setTimeout(() => setLastThwip(null), 4000);
  };

  const activeAcronymData = spideyTheme.acronyms.find((a) => a.short === selectedAcronym);

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900/90 to-blue-950/80 border border-red-500/30 p-4 shadow-xl backdrop-blur-md overflow-hidden">
      {/* Decorative Web Background Watermark */}
      <div className="absolute -right-8 -top-8 w-40 h-40 opacity-15 pointer-events-none text-red-400">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="50" cy="50" r="15" />
          <circle cx="50" cy="50" r="30" />
          <circle cx="50" cy="50" r="45" />
          <line x1="50" y1="5" x2="50" y2="95" />
          <line x1="5" y1="50" x2="95" y2="50" />
          <line x1="18" y1="18" x2="82" y2="82" />
          <line x1="18" y1="82" x2="82" y2="18" />
        </svg>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
        {/* Left: Spider-Sense Status & Live Indicator */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-xl shadow-lg shadow-red-500/20 animate-spider-sense">
              🕷️
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500 border-2 border-slate-900"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-sm tracking-wide text-white uppercase flex items-center gap-1.5">
                <span>Spider-Man OS</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-mono">
                  v4.2 K.A.R.E.N.
                </span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <Radio className="w-2.5 h-2.5 animate-pulse" /> S.E.N.S.E. Tingling
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium flex items-center gap-1 mt-0.5">
              <span className="text-red-400 font-semibold italic">"With great power comes great responsibility"</span>
              <span className="text-slate-400 hidden md:inline">— Peter Parker & Miles Morales</span>
            </p>
          </div>
        </div>

        {/* Center: Acronym Badges with Quick Click */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-red-400" /> Acronyms:
          </span>
          {spideyTheme.acronyms.map((acr) => (
            <button
              key={acr.short}
              type="button"
              onClick={() => setSelectedAcronym(acr.short)}
              className="px-2 py-1 rounded-lg bg-slate-900/90 hover:bg-red-500/20 border border-slate-700/80 hover:border-red-500/50 text-[11px] font-mono font-bold text-slate-200 hover:text-white transition-all shadow-xs flex items-center gap-1"
              title={`${acr.expanded} — Click to inspect`}
            >
              <span className="text-red-400">#</span>
              <span>{acr.short}</span>
            </button>
          ))}
        </div>

        {/* Right: Actions (THWIP sound simulation & Full Dossier) */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <button
            type="button"
            onClick={handleThwip}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/30 transition-all active:scale-95 whitespace-nowrap"
            title="Fire web-shooter simulation"
          >
            <span className="text-sm">🕸️</span>
            <span>THWIP!</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDossierModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
            title="Open complete Spider-Man Acronyms & Annotations Dossier"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Spidey Dossier</span>
          </button>
        </div>
      </div>

      {/* Dynamic THWIP! Toast Banner */}
      {lastThwip && (
        <div className="mt-3 px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-xs font-mono text-red-200 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Volume2 className="w-3.5 h-3.5 text-red-400 shrink-0 animate-bounce" />
          <span className="font-semibold">{lastThwip}</span>
        </div>
      )}

      {/* Selected Acronym Quick Insight Drawer */}
      {activeAcronymData && (
        <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-red-500/40 flex items-start justify-between gap-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                {activeAcronymData.short}
              </span>
              <span className="text-xs font-bold text-white">
                {activeAcronymData.expanded}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeAcronymData.description}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedAcronym(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Full Spider-Man Dossier Modal (Portaled to document.body for full visibility) */}
      {showDossierModal && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDossierModal(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Spider-Man Theme Dossier"
        >
          <div
            className="relative w-full max-w-2xl bg-slate-900 border border-red-500/40 rounded-3xl shadow-2xl overflow-hidden p-6 max-h-[88vh] flex flex-col z-[1000]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Prominent Go Back and Close options */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setShowDossierModal(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all shrink-0 active:scale-95 shadow-sm"
                  title="Return to Career World"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-red-400" />
                  <span>Go Back</span>
                </button>

                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-blue-600 flex items-center justify-center text-lg shadow-md shadow-red-500/20 shrink-0">
                  🕷️
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white font-display flex items-center gap-2 truncate">
                    <span>Spider-Man Dossier</span>
                    <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                      Acronyms & Annotations
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">
                    Tactical specifications & Parker Principle directives
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDossierModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                title="Close modal (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto py-4 space-y-6 pr-1">
              {/* Section 1: Acronyms */}
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-red-400 mb-3">
                  <Cpu className="w-4 h-4" />
                  <span>Spider-Verse Technology Acronyms</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {spideyTheme.acronyms.map((acr) => (
                    <div
                      key={acr.short}
                      className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-red-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                          {acr.short}
                        </span>
                        <span className="text-xs font-bold text-white truncate">
                          {acr.expanded}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mt-1">
                        {acr.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Tactical Annotations */}
              {spideyTheme.annotations && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-3">
                    <Compass className="w-4 h-4" />
                    <span>Tactical Annotations & Operational Directives</span>
                  </div>
                  <div className="space-y-2.5">
                    {spideyTheme.annotations.map((ann, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/90 flex items-start gap-3"
                      >
                        <span className="text-lg shrink-0 mt-0.5">{ann.icon || '🕷️'}</span>
                        <div>
                          <div className="text-xs font-mono font-bold text-slate-200">
                            {ann.label}
                          </div>
                          <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                            {ann.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 3: Spider-Sense Career Analog */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 to-blue-950/40 border border-red-500/30">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-300 mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>The Parker Principle Applied to Ascendra</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every quest mastered grants profound capability. With high-level AI competencies,
                  architectural acumen, and distributed engineering comes the duty to build ethical,
                  resilient, and human-empowering technological infrastructure.
                </p>
              </div>
            </div>

            {/* Modal Footer with Go Back option */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0 gap-3">
              <button
                type="button"
                onClick={handleThwip}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-600/30 active:scale-95"
              >
                <span>🕸️ Test Web-Shooter</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDossierModal(false)}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Go Back to World</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
