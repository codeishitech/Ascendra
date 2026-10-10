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

  // Spider-Man elements
  const spiderIcons = ['🕷️', '🕸️', '⚡', '🏙️', '🕸️', '🕷️', '✨'];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic Ambient Background Glows */}
      {theme === 'spiderman' ? (
        <>
          {/* Spider-Man Crimson & Electric Blue Ambient Atmosphere */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[550px] bg-red-600/20 rounded-full blur-3xl animate-pulse duration-1000"></div>
          <div className="absolute bottom-10 right-1/4 w-[650px] h-[600px] bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-red-500/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-sky-500/15 rounded-full blur-3xl"></div>

          {/* Top Corner Web Net Overlays (SVG) */}
          <div className="absolute top-0 left-0 w-44 h-44 opacity-25 text-red-500">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
              <path d="M0 0 L100 0 L0 100 Z" strokeDasharray="2 2" opacity="0.3" />
              <path d="M0 20 Q 20 20 20 0 M0 40 Q 40 40 40 0 M0 60 Q 60 60 60 0 M0 80 Q 80 80 80 0 M0 100 Q 100 100 100 0" />
              <line x1="0" y1="0" x2="30" y2="100" />
              <line x1="0" y1="0" x2="60" y2="100" />
              <line x1="0" y1="0" x2="100" y2="60" />
              <line x1="0" y1="0" x2="100" y2="30" />
            </svg>
          </div>
          <div className="absolute top-0 right-0 w-44 h-44 opacity-25 text-blue-500 transform scale-x-[-1]">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
              <path d="M0 0 L100 0 L0 100 Z" strokeDasharray="2 2" opacity="0.3" />
              <path d="M0 20 Q 20 20 20 0 M0 40 Q 40 40 40 0 M0 60 Q 60 60 60 0 M0 80 Q 80 80 80 0 M0 100 Q 100 100 100 0" />
              <line x1="0" y1="0" x2="30" y2="100" />
              <line x1="0" y1="0" x2="60" y2="100" />
              <line x1="0" y1="0" x2="100" y2="60" />
              <line x1="0" y1="0" x2="100" y2="30" />
            </svg>
          </div>

          {/* Hanging Swinging Web Strands from top */}
          <div className="absolute top-0 left-12 animate-web-swing" style={{ animationDelay: '0.2s', animationDuration: '4.8s' }}>
            <div className="w-[1.5px] h-36 bg-gradient-to-b from-slate-400/60 to-red-400/80 mx-auto"></div>
            <div className="w-7 h-7 -mt-1 rounded-full bg-slate-900 border border-red-500/60 shadow-lg shadow-red-500/30 flex items-center justify-center text-sm">
              🕷️
            </div>
          </div>

          <div className="absolute top-0 right-28 animate-web-swing" style={{ animationDelay: '1.4s', animationDuration: '5.2s' }}>
            <div className="w-[1.5px] h-48 bg-gradient-to-b from-slate-400/60 to-blue-400/80 mx-auto"></div>
            <div className="w-7 h-7 -mt-1 rounded-full bg-slate-900 border border-blue-500/60 shadow-lg shadow-blue-500/30 flex items-center justify-center text-sm">
              🕸️
            </div>
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-web-swing" style={{ animationDelay: '0.8s', animationDuration: '6s' }}>
            <div className="w-[1px] h-28 bg-gradient-to-b from-slate-400/40 to-sky-400/60 mx-auto"></div>
            <div className="w-6 h-6 -mt-1 rounded-full bg-slate-950/80 border border-sky-400/50 shadow-md flex items-center justify-center text-xs">
              ⚡
            </div>
          </div>

          {/* Floating Spider Emblems & Web Filaments */}
          <div className="absolute inset-0">
            {Array.from({ length: 16 }).map((_, i) => {
              const icon = spiderIcons[i % spiderIcons.length];
              const leftPos = (i * 6.2 + 3) % 95;
              const duration = 14 + (i % 8) * 2;
              const delay = (i * 1.6) % 9;
              const size = 18 + (i % 4) * 8;

              return (
                <div
                  key={`spiderman-icon-${i}`}
                  className="absolute opacity-35 select-none animate-web-float"
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

            {/* Venom Blast & Web Node Spark Spheres */}
            {Array.from({ length: 12 }).map((_, i) => {
              const isVenom = i % 2 === 0;
              const size = 10 + (i % 3) * 8;
              const leftPos = (i * 7.8 + 5) % 94;
              const duration = 12 + (i % 5) * 2.5;
              const delay = (i * 2.1) % 10;

              return (
                <div
                  key={`spider-node-spark-${i}`}
                  className={`absolute rounded-full border backdrop-blur-xs animate-float-sparkle ${
                    isVenom
                      ? 'bg-red-500/25 border-red-400/50 shadow-red-500/30'
                      : 'bg-blue-500/25 border-blue-400/50 shadow-blue-500/30'
                  }`}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${leftPos}%`,
                    bottom: '-10%',
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                    boxShadow: isVenom ? '0 0 16px rgba(239, 68, 68, 0.4)' : '0 0 16px rgba(59, 130, 246, 0.4)',
                  }}
                />
              );
            })}
          </div>
        </>
      ) : theme === 'candy' ? (
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
