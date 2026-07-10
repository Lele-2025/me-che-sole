// Logo "Lido Minimal": ombrellone flat (niente gradienti/ombre), un
// solo accento terracotta sul finale, wordmark in Manrope.
export function Logo({h=40}) {
  return (
    <svg height={h} viewBox="0 0 210 60" fill="none">
      <path d="M10 36 Q35 14 60 36 Z" fill="#2D5F8A"/>
      <circle cx="35" cy="15" r="3" fill="#C05F3C"/>
      <line x1="35" y1="36" x2="35" y2="54" stroke="#1C1C1C" strokeWidth="2.5" strokeLinecap="round"/>
      <text x="72" y="41" fontFamily="'Manrope',sans-serif" fontSize="21" fontWeight="800" fill="#1C1C1C">
        Me che sole<tspan fill="#C05F3C">!</tspan>
      </text>
    </svg>
  );
}
