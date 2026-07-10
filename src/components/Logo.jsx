export function Logo({h=40}) {
  return (
    <svg height={h} viewBox="0 0 200 170" fill="none">
      <ellipse cx="112" cy="55" rx="50" ry="46" fill="#F4C430" opacity="0.3"/>
      <ellipse cx="112" cy="55" rx="30" ry="28" fill="#F4C430" opacity="0.4"/>
      <path d="M72,70 Q112,40 152,70" stroke="#3D2B1A" strokeWidth="3" fill="none"/>
      <path d="M72,70 Q112,52 152,70 Q112,80 72,70Z" fill="#D4A84B" opacity="0.7"/>
      {[77,92,107,122,137,148].map((x,i)=><path key={i} d={"M"+x+",70 Q"+(x+5)+",78 "+(x+10)+",70"} stroke="#3D2B1A" strokeWidth="1.5" fill="none"/>)}
      <line x1="112" y1="70" x2="112" y2="118" stroke="#3D2B1A" strokeWidth="3"/>
      <rect x="54" y="88" width="30" height="18" rx="3" fill="#D4A84B" stroke="#3D2B1A" strokeWidth="2"/>
      <rect x="54" y="88" width="10" height="18" rx="2" fill="#C49030" stroke="#3D2B1A" strokeWidth="1.5"/>
      <line x1="58" y1="106" x2="52" y2="120" stroke="#3D2B1A" strokeWidth="2"/>
      <line x1="78" y1="106" x2="82" y2="120" stroke="#3D2B1A" strokeWidth="2"/>
      <text x="28" y="148" fontFamily="Georgia,serif" fontSize="21" fill="#4A3520" fontStyle="italic">Me che sole !</text>
    </svg>
  );
}
