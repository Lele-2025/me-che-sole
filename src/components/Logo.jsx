import { C } from "../theme.js";

// Logo ufficiale "lettino" — ombrellone + lettino + sole + onda,
// ricostruito in SVG (scalabile, ricolorabile) dal riferimento fornito.
// showTagline di default segue l'altezza: a dimensioni da navbar (h
// piccola) lo slogan non ci sta leggibile, quindi si nasconde da solo.
export function Logo({h=40, showTagline}) {
  const tagline = showTagline ?? h>=64;
  const scale = h/70;
  const w = (tagline?250:190)*scale;
  return (
    <svg height={h} width={w} viewBox={`0 0 ${tagline?250:190} 70`} fill="none">
      <circle cx="14" cy="16" r="8" fill={C.brandOrange}/>
      <path d="M25,39 Q47,13 69,39 Z" fill={C.brandNavy}/>
      <path d="M28,39 Q31.5,44.5 35,39" stroke={C.brandNavy} strokeWidth="1.2" fill="none"/>
      <path d="M35,39 Q38.5,45 42,39" stroke={C.brandNavy} strokeWidth="1.2" fill="none"/>
      <path d="M42,39 Q47,45.5 52,39" stroke={C.brandNavy} strokeWidth="1.2" fill="none"/>
      <path d="M52,39 Q56.5,45 60,39" stroke={C.brandNavy} strokeWidth="1.2" fill="none"/>
      <path d="M60,39 Q63.5,44.5 66,39" stroke={C.brandNavy} strokeWidth="1.2" fill="none"/>
      <line x1="47" y1="39" x2="47" y2="60" stroke={C.brandNavy} strokeWidth="2.2" strokeLinecap="round"/>
      <rect x="27" y="58" width="35" height="4.5" rx="1.8" fill={C.brandNavy}/>
      <path d="M27,58 L22.5,45 Q22,42.8 24.2,42.3 L35,39.3 Q37.2,38.8 37.7,41 L38.2,56" fill={C.brandNavy}/>
      <text x={86} y="34" fontFamily="'Manrope',sans-serif" fontSize="27" fontWeight="800" fill={C.brandNavy}>lettino</text>
      {tagline&&<text x={86} y="50" fontFamily="'Manrope',sans-serif" fontSize="11" fontWeight="600" fill={C.brandSky}>un click e sei al mare</text>}
    </svg>
  );
}
