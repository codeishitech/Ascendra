export type ThemeId = 'candy' | 'cyber' | 'gold' | 'nebula' | 'emerald' | 'crimson' | 'spiderman';

export interface ThemeAcronym {
  short: string;
  expanded: string;
  description: string;
}

export interface ThemeAnnotation {
  label: string;
  text: string;
  icon?: string;
}

export interface ThemeOption {
  id: ThemeId;
  name: string;
  tagline: string;
  swatchPrimary: string;
  swatchSecondary: string;
  accentClass: string;
  badgeClass: string;
  acronyms?: ThemeAcronym[];
  annotations?: ThemeAnnotation[];
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'spiderman',
    name: 'Spider-Man 🕷️',
    tagline: 'Peter & Miles: Crimson Web & Electric Blue',
    swatchPrimary: '#ef4444',
    swatchSecondary: '#3b82f6',
    accentClass: 'text-red-400',
    badgeClass: 'bg-red-500/10 text-red-400 border-red-500/30',
    acronyms: [
      {
        short: 'W.E.B.',
        expanded: 'Worldwide Engineering Brigade',
        description: "Peter Parker's high-tech initiative designing next-gen mechanical web-shooters & modular neural gadgetry.",
      },
      {
        short: 'S.E.N.S.E.',
        expanded: 'Spidey Enhanced Neurological Situational Evaluator',
        description: 'Subconscious precognitive danger & opportunity radar that tingles when adaptive quest branches unlock.',
      },
      {
        short: 'K.A.R.E.N.',
        expanded: 'Kinetic Analysis & Response Engine Network',
        description: 'The tactical suit assistant AI managing real-time trajectory calculation, XP auditing, and combat physics.',
      },
      {
        short: 'T.H.W.I.P.',
        expanded: 'Tensile High-Velocity Web-Shooting Induction Polymer',
        description: 'Shear-thickening synthetic fluid formula pressurized at 300 psi for rapid node-to-node traversal.',
      },
      {
        short: 'M.I.L.E.S.',
        expanded: 'Multiverse Induction & Lightning-Electrified Synapses',
        description: 'Bio-electric venom blast amplifier and optic camouflage stealth protocols from Earth-1610.',
      },
      {
        short: 'S.P.I.D.E.R.',
        expanded: 'Strategic Pulse Intelligence & Defense Evaluation Recon',
        description: 'Spider-Drone mesh telemetry mapping out career skill tree nodes across the multiverse.',
      },
    ],
    annotations: [
      {
        label: 'Core Directive',
        text: 'With great power comes great responsibility — Parker Principle',
        icon: '🕷️',
      },
      {
        label: 'Tactical Status',
        text: 'Spider-Sense active: 360° precognitive awareness engaged',
        icon: '⚡',
      },
      {
        label: 'Web-Shooter Pressure',
        text: 'Fluid cartridge 98% • Double-tap trigger enabled',
        icon: '🕸️',
      },
      {
        label: 'Suit OS',
        text: 'K.A.R.E.N. Protocol v4.2 online • Instant-Kill disarmed',
        icon: '🤖',
      },
      {
        label: 'Audio Signatures',
        text: 'THWIP! • FZZZT! • BZZZZT (Venom Blast ready)',
        icon: '💥',
      },
    ],
  },
  {
    id: 'candy',
    name: 'Candy Crush 🍭',
    tagline: 'Sugar Berry & Jelly Drops',
    swatchPrimary: '#f43f5e',
    swatchSecondary: '#ec4899',
    accentClass: 'text-rose-400',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  },
  {
    id: 'cyber',
    name: 'Cyber Synth',
    tagline: 'Electric Cyan & Indigo',
    swatchPrimary: '#38bdf8',
    swatchSecondary: '#6366f1',
    accentClass: 'text-sky-400',
    badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  },
  {
    id: 'gold',
    name: 'Imperial Gold 👑',
    tagline: 'Onyx & Gilded Amber',
    swatchPrimary: '#fbbf24',
    swatchSecondary: '#ea580c',
    accentClass: 'text-amber-400',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  {
    id: 'nebula',
    name: 'Cosmic Nebula 🔮',
    tagline: 'Neon Violet & Magenta',
    swatchPrimary: '#c084fc',
    swatchSecondary: '#ec4899',
    accentClass: 'text-purple-400',
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
  {
    id: 'emerald',
    name: 'Biometric Solarpunk 🌿',
    tagline: 'Mint Green & Teal',
    swatchPrimary: '#34d399',
    swatchSecondary: '#0d9488',
    accentClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  {
    id: 'crimson',
    name: 'Tactical Stealth 🎯',
    tagline: 'Laser Crimson & Titanium',
    swatchPrimary: '#fb7185',
    swatchSecondary: '#f97316',
    accentClass: 'text-rose-400',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  },
];

const THEME_STORAGE_KEY = 'ascendra_theme_palette_v2';

export function getStoredTheme(): ThemeId {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && ['candy', 'cyber', 'gold', 'nebula', 'emerald', 'crimson', 'spiderman'].includes(saved)) {
      return saved as ThemeId;
    }
  } catch (e) {}
  return 'candy';
}

export function applyTheme(themeId: ThemeId) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeId);
      document.body.setAttribute('data-theme', themeId);
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { themeId } }));
    }
  } catch (e) {}
}
