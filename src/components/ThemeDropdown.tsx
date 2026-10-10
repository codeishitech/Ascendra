import { useState, useRef, useEffect } from 'react';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { THEME_OPTIONS, getStoredTheme, applyTheme, type ThemeId, type ThemeOption } from '../services/theme';

interface ThemeDropdownProps {
  className?: string;
}

export function ThemeDropdown({ className = '' }: ThemeDropdownProps) {
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(getStoredTheme());
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentTheme = THEME_OPTIONS.find((t) => t.id === currentThemeId) || THEME_OPTIONS[0];

  // Apply theme on initial render
  useEffect(() => {
    applyTheme(currentThemeId);
  }, [currentThemeId]);

  // Sync theme changes across instances
  useEffect(() => {
    const handleSync = (e: any) => {
      if (e.detail?.themeId) {
        setCurrentThemeId(e.detail.themeId);
      }
    };
    window.addEventListener('themeChanged', handleSync);
    return () => window.removeEventListener('themeChanged', handleSync);
  }, []);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTheme = (theme: ThemeOption) => {
    setCurrentThemeId(theme.id);
    applyTheme(theme.id);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition-all shadow-sm select-none"
        title="Change application theme"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Palette className="w-3.5 h-3.5 text-slate-400" />
        
        {/* Dual Color Swatch Dot */}
        <div className="flex items-center -space-x-1">
          <span
            className="w-2.5 h-2.5 rounded-full ring-1 ring-slate-950 inline-block shadow-xs"
            style={{ backgroundColor: currentTheme.swatchPrimary }}
          ></span>
          <span
            className="w-2.5 h-2.5 rounded-full ring-1 ring-slate-950 inline-block shadow-xs"
            style={{ backgroundColor: currentTheme.swatchSecondary }}
          ></span>
        </div>

        <span className="hidden sm:inline font-mono">{currentTheme.name}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl z-50 p-1.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Visual Theme Palette
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Select an aesthetic for your career world
            </div>
          </div>

          <div className="space-y-1">
            {THEME_OPTIONS.map((theme) => {
              const isSelected = theme.id === currentThemeId;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleSelectTheme(theme)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border border-slate-700/80 shadow-xs'
                      : 'hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Swatch Pill */}
                    <div className="flex items-center -space-x-1.5 shrink-0 p-1 rounded-lg bg-slate-950 border border-slate-800">
                      <span
                        className="w-3.5 h-3.5 rounded-full ring-1 ring-slate-900"
                        style={{ backgroundColor: theme.swatchPrimary }}
                      ></span>
                      <span
                        className="w-3.5 h-3.5 rounded-full ring-1 ring-slate-900"
                        style={{ backgroundColor: theme.swatchSecondary }}
                      ></span>
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                        <span>{theme.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {theme.tagline}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: theme.swatchPrimary, color: '#020617' }}
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
