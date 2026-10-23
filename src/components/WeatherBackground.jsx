import { useMemo, useState, useEffect } from 'react';

const CLOUDS = [
  { top: '6%', width: 280, duration: 54, delay: -12, opacity: 0.92 },
  { top: '16%', width: 380, duration: 72, delay: -36, opacity: 0.78 },
  { top: '2%', width: 220, duration: 60, delay: -22, opacity: 0.7 },
  { top: '24%', width: 320, duration: 80, delay: -48, opacity: 0.62 },
  { top: '12%', width: 440, duration: 90, delay: -8, opacity: 0.5 },
  { top: '30%', width: 260, duration: 64, delay: -28, opacity: 0.66 },
];

function useCount(mobile, desktop) {
  const [count, setCount] = useState(desktop);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)');
    const apply = () => setCount(media.matches ? mobile : desktop);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [mobile, desktop]);

  return count;
}

function sceneFlags(scene) {
  return {
    sun: scene === 'clear-day' || scene === 'partly-day',
    moon: scene === 'clear-night' || scene === 'partly-night',
    stars: ['clear-night', 'partly-night', 'cloudy-night', 'snow-night', 'thunder'].includes(scene),
    rain: scene.startsWith('rain') || scene === 'thunder',
    snow: scene.startsWith('snow'),
    fog: scene.startsWith('fog'),
    lightning: scene === 'thunder',
    motes: scene === 'clear-day' || scene === 'partly-day',
    storm: scene.startsWith('rain') || scene === 'thunder',
    clouds: scene === 'clear-day' ? 2 : scene === 'clear-night' ? 0 : scene.startsWith('partly') ? 4 : scene.startsWith('fog') ? 3 : scene.startsWith('snow') ? 4 : 5,
  };
}

function Cloud({ top, width, duration, delay, opacity, storm }) {
  const fill = storm ? '#d5dee8' : '#ffffff';
  const shade = storm ? '#b7c3d1' : '#d9e2ee';
  return (
    <svg
      className="cloud"
      viewBox="0 0 320 130"
      style={{ top, width, animationDuration: `${duration}s`, animationDelay: `${delay}s`, opacity }}
    >
      <ellipse cx="150" cy="86" rx="110" ry="24" fill={shade} />
      <ellipse cx="120" cy="70" rx="62" ry="36" fill={fill} />
      <ellipse cx="186" cy="68" rx="70" ry="40" fill={fill} />
      <ellipse cx="230" cy="78" rx="48" ry="28" fill={fill} />
      <ellipse cx="78" cy="80" rx="42" ry="24" fill={fill} />
    </svg>
  );
}

function Rain({ count }) {
  const drops = useMemo(
    () => Array.from({ length: count }, (_, index) => ({
      left: `${(index * 53) % 100}%`,
      delay: `${((index * 0.17) % 1.8).toFixed(2)}s`,
      duration: `${(0.72 + (index % 6) * 0.11).toFixed(2)}s`,
      height: 16 + (index % 5) * 8,
      opacity: 0.28 + (index % 4) * 0.12,
    })),
    [count],
  );

  return drops.map((drop, index) => (
    <span
      key={index}
      className="raindrop"
      style={{
        left: drop.left,
        height: drop.height,
        opacity: drop.opacity,
        animationDelay: drop.delay,
        animationDuration: drop.duration,
      }}
    />
  ));
}

function Snow({ count }) {
  const flakes = useMemo(
    () => Array.from({ length: count }, (_, index) => ({
      left: `${(index * 41) % 100}%`,
      delay: `${((index * 0.47) % 8).toFixed(2)}s`,
      duration: `${(9 + (index % 7) * 1.3).toFixed(2)}s`,
      size: 4 + (index % 4) * 2,
      sway: `${(index % 2 === 0 ? 1 : -1) * (12 + (index % 16))}px`,
      opacity: 0.55 + (index % 4) * 0.1,
    })),
    [count],
  );

  return flakes.map((flake, index) => (
    <span
      key={index}
      className="flake"
      style={{
        left: flake.left,
        width: flake.size,
        height: flake.size,
        opacity: flake.opacity,
        animationDelay: flake.delay,
        animationDuration: flake.duration,
        '--sway': flake.sway,
      }}
    />
  ));
}

function Stars({ count }) {
  const stars = useMemo(
    () => Array.from({ length: count }, (_, index) => ({
      left: `${(index * 67) % 100}%`,
      top: `${(index * 29) % 68}%`,
      size: index % 5 === 0 ? 3 : 2,
      delay: `${((index * 0.31) % 3).toFixed(2)}s`,
      duration: `${(2.2 + (index % 5) * 0.45).toFixed(2)}s`,
    })),
    [count],
  );

  return stars.map((star, index) => (
    <span
      key={index}
      className="star"
      style={{
        left: star.left,
        top: star.top,
        width: star.size,
        height: star.size,
        animationDelay: star.delay,
        animationDuration: star.duration,
      }}
    />
  ));
}

function Motes() {
  const motes = useMemo(
    () => Array.from({ length: 16 }, (_, index) => ({
      left: `${8 + ((index * 19) % 80)}%`,
      top: `${20 + ((index * 23) % 60)}%`,
      size: 3 + (index % 3),
      delay: `${(index * 0.6).toFixed(2)}s`,
      duration: `${(8 + (index % 5) * 1.4).toFixed(2)}s`,
    })),
    [],
  );

  return motes.map((mote, index) => (
    <span
      key={index}
      className="mote"
      style={{
        left: mote.left,
        top: mote.top,
        width: mote.size,
        height: mote.size,
        animationDelay: mote.delay,
        animationDuration: mote.duration,
      }}
    />
  ));
}

function Hills() {
  return (
    <svg className="hills" viewBox="0 0 1440 220" preserveAspectRatio="none">
      <path fill="currentColor" fillOpacity="0.13" d="M0 120C160 78 300 156 500 112C740 60 900 154 1140 102C1280 74 1360 118 1440 92V220H0Z" />
      <path fill="currentColor" fillOpacity="0.2" d="M0 164C220 132 390 196 660 154C940 110 1140 186 1440 142V220H0Z" />
    </svg>
  );
}

export default function WeatherBackground({ scene = 'partly-day' }) {
  const flags = sceneFlags(scene);
  const rainCount = useCount(24, 54);
  const snowCount = useCount(20, 42);
  const starCount = useCount(26, 58);

  return (
    <div className={`weather-scene scene-${scene}`} aria-hidden="true">
      <div className="scene-effects" key={scene}>
        {flags.stars && <Stars count={starCount} />}
        {flags.sun && (
          <div className="sun">
            <div className="sun-rays" />
            <div className="sun-core" />
          </div>
        )}
        {flags.moon && (
          <div className="moon">
            <div className="moon-body" />
          </div>
        )}
        {CLOUDS.slice(0, flags.clouds).map((cloud, index) => (
          <Cloud key={index} {...cloud} opacity={scene === 'clear-day' ? cloud.opacity * 0.55 : cloud.opacity} storm={flags.storm} />
        ))}
        {flags.fog && (
          <>
            <span className="fog-band" style={{ top: '18%' }} />
            <span className="fog-band" style={{ top: '42%', animationDuration: '46s' }} />
            <span className="fog-band" style={{ top: '66%', animationDuration: '38s' }} />
          </>
        )}
        {flags.rain && <Rain count={rainCount} />}
        {flags.snow && <Snow count={snowCount} />}
        {flags.motes && <Motes />}
        {flags.lightning && (
          <>
            <div className="lightning-flash" />
            <svg className="lightning-bolt left-[16%] top-[6%] h-40 w-16" viewBox="0 0 80 160">
              <path d="M48 0 18 68h24L20 160 68 62H42L60 0Z" fill="#fff6d8" />
            </svg>
            <svg className="lightning-bolt delay left-[58%] top-[3%] h-28 w-12" viewBox="0 0 80 160">
              <path d="M48 0 18 68h24L20 160 68 62H42L60 0Z" fill="#fff6d8" />
            </svg>
          </>
        )}
        <Hills />
      </div>
    </div>
  );
}
