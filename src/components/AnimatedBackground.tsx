import { useState, useEffect } from 'react';
import { getStoredTheme, type ThemeId } from '../services/theme';

export function AnimatedBackground() {
  const [theme, setTheme] = useState<ThemeId>(getStoredTheme());

  useEffect(() => {
    const handleThemeChange = (e: any) => {
      if (e.detail?.themeId) {
        setTheme(e.detail.themeId);
      }
    };
    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  // Candy Crush elements
  const candyIcons = ['🍬', '🍭', '🧁', '✨', '🍓', '🍩', '🍫', '⭐'];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic Ambient Background Glows */}
      {theme === 'candy' ? (
        <>
          {/* Candy Crush Sweet Background Ambient Glows */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-pink-500/15 rounded-full blur-3xl animate-pulse duration-1000"></div>
          <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-yellow-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-3xl"></div>

          {/* Floating Candy Elements & Sugar Bubbles */}
          <div className="absolute inset-0">
            {Array.from({ length: 18 }).map((_, i) => {
              const icon = candyIcons[i % candyIcons.length];
              const leftPos = (i * 5.8 + 2) % 96;
              const duration = 12 + (i % 9) * 2.5;
              const delay = (i * 1.7) % 10;
              const size = 16 + (i % 5) * 8;

              return (
                <div
                  key={`candy-${i}`}
                  className="absolute opacity-30 select-none animate-candy-float"
                  style={{
                    left: `${leftPos}%`,
                    bottom: '-10%',
                    fontSize: `${size}px`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                  }}
                >
                  {icon}
                </div>
              );
            })}

            {/* Glowing Sugar Jelly Spheres */}
            {Array.from({ length: 12 }).map((_, i) => {
              const colors = [
                'bg-pink-400/20 border-pink-300/40',
                'bg-purple-500/20 border-purple-400/40',
                'bg-yellow-400/20 border-yellow-300/40',
                'bg-cyan-400/20 border-cyan-300/40',
              ];
              const colorClass = colors[i % colors.length];
              const size = 18 + (i % 4) * 14;
              const leftPos = (i * 8.5 + 4) % 94;
              const duration = 14 + (i % 6) * 3;
              const delay = (i * 2.2) % 12;

              return (
                <div
                  key={`jelly-${i}`}
                  className={`absolute rounded-full border backdrop-blur-xs animate-candy-bubble ${colorClass}`}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${leftPos}%`,
                    bottom: '-10%',
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                    boxShadow: '0 0 15px rgba(236, 72, 153, 0.25)',
                  }}
                />
              );
            })}
          </div>
        </>
      ) : theme === 'gold' ? (
        <>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-3xl"></div>
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`gold-sparkle-${i}`}
              className="absolute w-1.5 h-1.5 bg-amber-300/40 rounded-full animate-float-sparkle"
              style={{
                left: `${(i * 7 + 3) % 95}%`,
                bottom: '-10%',
                animationDuration: `${14 + (i % 6) * 2}s`,
                animationDelay: `${(i * 1.5) % 8}s`,
                boxShadow: '0 0 8px #fbbf24',
              }}
            />
          ))}
        </>
      ) : theme === 'nebula' ? (
        <>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-3xl"></div>
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`nebula-star-${i}`}
              className="absolute w-2 h-2 bg-purple-300/40 rounded-full animate-float-sparkle"
              style={{
                left: `${(i * 7 + 4) % 95}%`,
                bottom: '-10%',
                animationDuration: `${13 + (i % 6) * 2}s`,
                animationDelay: `${(i * 1.8) % 9}s`,
                boxShadow: '0 0 10px #c084fc',
              }}
            />
          ))}
        </>
      ) : theme === 'emerald' ? (
        <>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-3xl"></div>
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`spore-${i}`}
              className="absolute w-2 h-2 bg-emerald-400/30 rounded-full animate-float-sparkle"
              style={{
                left: `${(i * 6.5 + 5) % 95}%`,
                bottom: '-10%',
                animationDuration: `${15 + (i % 5) * 2}s`,
                animationDelay: `${(i * 1.4) % 8}s`,
                boxShadow: '0 0 8px #34d399',
              }}
            />
          ))}
        </>
      ) : theme === 'crimson' ? (
        <>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-600/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl"></div>
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`crimson-spark-${i}`}
              className="absolute w-1.5 h-1.5 bg-rose-400/40 rounded-full animate-float-sparkle"
              style={{
                left: `${(i * 6.8 + 2) % 95}%`,
                bottom: '-10%',
                animationDuration: `${12 + (i % 6) * 2}s`,
                animationDelay: `${(i * 1.3) % 7}s`,
                boxShadow: '0 0 8px #f43f5e',
              }}
            />
          ))}
        </>
      ) : (
        <>
          {/* Cyber Synth */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={`cyber-dot-${i}`}
              className="absolute w-1.5 h-1.5 bg-sky-400/30 rounded-full animate-float-sparkle"
              style={{
                left: `${(i * 7.2 + 3) % 95}%`,
                bottom: '-10%',
                animationDuration: `${15 + (i % 5) * 2}s`,
                animationDelay: `${(i * 1.5) % 8}s`,
                boxShadow: '0 0 6px #38bdf8',
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
