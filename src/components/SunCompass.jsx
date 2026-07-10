// ─── COMPASS SOLARE ─────────────────────────────────────────────────
export function SunCompass({alt,az,size=80}) {
  const cx=size/2,cy=size/2,r=size/2-10;
  const azR=(az||0)*Math.PI/180;
  const sx=cx+(r-4)*Math.sin(azR),sy=cy-(r-4)*Math.cos(azR);
  const shAzR=((az+180)%360)*Math.PI/180;
  const shx=cx+(r-7)*Math.sin(shAzR),shy=cy-(r-7)*Math.cos(shAzR);
  const isDay=alt>0;
  const sunCol=alt<15?"#F4A030":alt<40?"#F4D030":"#FFEE70";
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
      <svg width={size} height={size}>
        <defs>
          <filter id="sg"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <circle cx={cx} cy={cy} r={r+2} fill="rgba(0,30,60,0.85)" stroke="rgba(41,182,206,0.4)" strokeWidth="1.5"/>
        {[{l:"N",x:cx,y:10},{l:"S",x:cx,y:size-6},{l:"E",x:size-7,y:cy+4},{l:"O",x:6,y:cy+4}].map(p=>(
          <text key={p.l} x={p.x} y={p.y} textAnchor="middle" fontSize="7" fill="rgba(104,216,200,0.75)" fontWeight="800" fontFamily="monospace">{p.l}</text>
        ))}
        {isDay&&<line x1={cx} y1={cy} x2={shx} y2={shy} stroke="rgba(160,100,30,0.85)" strokeWidth="2.5" strokeDasharray="4,2.5" strokeLinecap="round"/>}
        {isDay&&<circle cx={sx} cy={sy} r={7} fill={sunCol} filter="url(#sg)"/>}
        {!isDay&&<circle cx={cx} cy={cy} r={7} fill="rgba(80,90,150,0.5)"/>}
      </svg>
      <div style={{fontSize:"0.5rem",color:"rgba(255,255,255,0.55)",textAlign:"center"}}>{isDay?Math.round(alt)+"°":"Notte"}</div>
    </div>
  );
}
