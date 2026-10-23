function Svg({ className = 'h-5 w-5', children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function SearchIcon({ className }) {
  return (
    <Svg className={className}>
      <circle cx="11" cy="11" r="6.25" />
      <path d="M16 16.5 20.2 20.7" />
    </Svg>
  );
}

export function Spinner({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={`spin ${className}`} aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.4" />
      <path d="M12 4a8 8 0 0 1 8 8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function LocateIcon({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="3.25" />
      <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2" />
      <circle cx="12" cy="12" r="7" />
    </Svg>
  );
}

export function SunMiniIcon({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 3.5v1.8M12 18.7v1.8M3.5 12h1.8M18.7 12h1.8M6 6l1.3 1.3M16.7 16.7 18 18M18 6l-1.3 1.3M7.3 16.7 6 18" />
    </Svg>
  );
}

export function MoonMiniIcon({ className }) {
  return (
    <Svg className={className}>
      <path d="M15.5 14.2A6.2 6.2 0 0 1 9.8 5.2 6.4 6.4 0 1 0 15.5 14.2Z" />
    </Svg>
  );
}

export function CloseIcon({ className = 'h-3.5 w-3.5' }) {
  return (
    <Svg className={className}>
      <path d="M7 7l10 10M17 7 7 17" />
    </Svg>
  );
}

export function ChevronIcon({ className = 'h-4 w-4', direction = 'right' }) {
  const rotate = { left: 'rotate-180', right: '', up: '-rotate-90', down: 'rotate-90' }[direction] || '';
  return (
    <Svg className={`${className} ${rotate}`}>
      <path d="m9 5 6 7-6 7" />
    </Svg>
  );
}

export function DropletIcon({ className = 'h-4 w-4' }) {
  return (
    <Svg className={className}>
      <path d="M12 3.5s5.5 6 5.5 9.4a5.5 5.5 0 0 1-11 0C6.5 9.5 12 3.5 12 3.5Z" />
    </Svg>
  );
}

export function WindIcon({ className = 'h-4 w-4' }) {
  return (
    <Svg className={className}>
      <path d="M4 8h9.5a2.2 2.2 0 1 0-2.1-3" />
      <path d="M4 12h13a2.2 2.2 0 1 1-2.1 3" />
      <path d="M4 16h7.5" />
    </Svg>
  );
}

export function EyeIcon({ className = 'h-4 w-4' }) {
  return (
    <Svg className={className}>
      <path d="M2.8 12S6.2 6.8 12 6.8 21.2 12 21.2 12 17.8 17.2 12 17.2 2.8 12 2.8 12Z" />
      <circle cx="12" cy="12" r="2.3" />
    </Svg>
  );
}

export function GaugeIcon({ className = 'h-4 w-4' }) {
  return (
    <Svg className={className}>
      <path d="M5 16.5a7.2 7.2 0 1 1 14 0" />
      <path d="m12 13 3.2-3.6" />
      <path d="M8 16.5h.1M12 16.5h.1M16 16.5h.1" />
    </Svg>
  );
}

export function ArrowUpIcon({ className = 'h-3.5 w-3.5', style }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M12 19V6" />
      <path d="m7.5 10.5 4.5-4.5 4.5 4.5" />
    </svg>
  );
}
