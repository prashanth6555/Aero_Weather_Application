import { useId } from 'react';
import { getIconType } from '../utils/weather';

function CloudShape({ id, cx, cy, scale = 1, fill = '#f7fbff' }) {
  return (
    <path
      transform={`translate(${cx} ${cy}) scale(${scale})`}
      d="M-2 14h20.5a8.2 8.2 0 0 0 1.4-16.3A11.2 11.2 0 0 0-4.5-6.2 7.4 7.4 0 0 0-6 8.2 7.6 7.6 0 0 0-2 14Z"
      fill={fill}
      stroke="#4e6284"
      strokeWidth="1.8"
      strokeLinejoin="round"
      filter={`url(#${id}-shadow)`}
    />
  );
}

function Rays({ stroke = '#f5b942' }) {
  return [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
    <line
      key={deg}
      x1="32"
      y1="7"
      x2="32"
      y2="14"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      transform={`rotate(${deg} 32 32)`}
    />
  ));
}

function Drops({ x, y, length = 7 }) {
  return [0, 1, 2].map((index) => (
    <line
      key={index}
      className="icon-drop"
      x1={x + index * 8}
      y1={y}
      x2={x + index * 8}
      y2={y + length}
      stroke="#0284c7"
      strokeWidth="2.4"
      strokeLinecap="round"
      style={{ animationDelay: `${index * 0.18}s` }}
    />
  ));
}

function IconBody({ type, id }) {
  if (type === 'clear-day') {
    return (
      <>
        <g className="spin-slow">
          <Rays />
        </g>
        <circle cx="32" cy="32" r="16" fill="#ffd15c" opacity="0.28" />
        <circle cx="32" cy="32" r="11" fill={`url(#${id}-sun)`} />
      </>
    );
  }

  if (type === 'clear-night') {
    return (
      <>
        <circle cx="46" cy="16" r="1.4" fill="#f8fafc" />
        <path d="m48 24 1 2.2 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3Z" fill="#fde68a" />
        <circle cx="30" cy="34" r="14" fill="#f8fafc" filter={`url(#${id}-shadow)`} mask={`url(#${id}-moon)`} />
      </>
    );
  }

  if (type === 'partly-day') {
    return (
      <>
        <g transform="translate(24 22)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="0"
              y1="-12"
              x2="0"
              y2="-8"
              stroke="#f6c453"
              strokeWidth="2.4"
              strokeLinecap="round"
              transform={`rotate(${deg})`}
            />
          ))}
          <circle r="8" fill={`url(#${id}-sun)`} />
        </g>
        <g className="float-y">
          <CloudShape id={id} cx="36" cy="40" scale="0.95" />
        </g>
      </>
    );
  }

  if (type === 'partly-night') {
    return (
      <>
        <circle cx="24" cy="24" r="8" fill="#f8fafc" mask={`url(#${id}-moon-small)`} />
        <g className="float-y">
          <CloudShape id={id} cx="36" cy="40" scale="0.95" />
        </g>
      </>
    );
  }

  if (type === 'cloudy') {
    return (
      <>
        <CloudShape id={id} cx="26" cy="30" scale="0.82" fill="#e8eef6" />
        <g className="float-y">
          <CloudShape id={id} cx="36" cy="40" />
        </g>
      </>
    );
  }

  if (type === 'fog') {
    return (
      <>
        <CloudShape id={id} cx="32" cy="28" scale="0.9" />
        <g stroke="#64748b" strokeWidth="3" strokeLinecap="round">
          <line x1="14" y1="46" x2="50" y2="46" />
          <line className="fog-line" x1="18" y1="53" x2="46" y2="53" />
          <line className="fog-line" x1="22" y1="60" x2="42" y2="60" style={{ animationDelay: '0.4s' }} />
        </g>
      </>
    );
  }

  if (type === 'drizzle') {
    return (
      <>
        <g className="float-y">
          <CloudShape id={id} cx="32" cy="28" />
        </g>
        <Drops x="22" y="46" length="6" />
      </>
    );
  }

  if (type === 'rain') {
    return (
      <>
        <g className="float-y">
          <CloudShape id={id} cx="32" cy="26" fill="#f8fafc" />
        </g>
        <Drops x="20" y="44" length="10" />
      </>
    );
  }

  if (type === 'snow') {
    return (
      <>
        <g className="float-y">
          <CloudShape id={id} cx="32" cy="26" />
        </g>
        {[22, 32, 42].map((x, index) => (
          <g key={x} transform={`translate(${x} ${48 + (index === 1 ? 4 : 0)})`}>
            <g className="flake-spin" style={{ animationDelay: `${index * 0.4}s` }}>
              <path d="M0-5V5M-4.2-2.5 4.2 2.5M-4.2 2.5 4.2-2.5" stroke="#0284c7" strokeWidth="1.7" strokeLinecap="round" />
            </g>
          </g>
        ))}
      </>
    );
  }

  return (
    <>
      <g className="float-y">
        <CloudShape id={id} cx="32" cy="28" scale="1.05" fill="#e8eef5" />
      </g>
      <path className="bolt" d="M36 30 25 44h8l-7 14 18-20h-9l8-8Z" fill="#fbbf24" />
    </>
  );
}

export default function WeatherIcon({ code = 0, isDay = true, className = 'h-12 w-12' }) {
  const rawId = useId().replace(/:/g, '');
  const type = getIconType(code, isDay);

  return (
    <svg viewBox="0 0 64 64" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id={`${rawId}-sun`} cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff7df" />
          <stop offset="48%" stopColor="#ffd15c" />
          <stop offset="100%" stopColor="#f4a01c" />
        </radialGradient>
        <filter id={`${rawId}-shadow`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1.05" floodColor="#0f172a" floodOpacity="0.28" />
        </filter>
        <mask id={`${rawId}-moon`}>
          <rect width="64" height="64" fill="black" />
          <circle cx="30" cy="34" r="14" fill="white" />
          <circle cx="38" cy="30" r="12" fill="black" />
        </mask>
        <mask id={`${rawId}-moon-small`}>
          <rect width="64" height="64" fill="black" />
          <circle cx="24" cy="24" r="8" fill="white" />
          <circle cx="28" cy="22" r="7" fill="black" />
        </mask>
      </defs>
      <IconBody type={type} id={rawId} />
    </svg>
  );
}
