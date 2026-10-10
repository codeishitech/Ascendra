export type ThemeId = 'candy' | 'cyber' | 'gold' | 'nebula' | 'emerald' | 'crimson';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  tagline: string;
  swatchPrimary: string;
  swatchSecondary: string;
  accentClass: string;
  badgeClass: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
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
    if (saved && ['candy', 'cyber', 'gold', 'nebula', 'emerald', 'crimson'].includes(saved)) {
      return saved as ThemeId;
    }
  } catch (e) {}
  return 'candy'; // Default to the requested Candy Crush theme!
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
