import { useState, useMemo } from "react";

// ─── OMBRELLONE CON OMBRA REALE ─────────────────────────────────────
export function OmbrelloneReal({spot,selected,onSelect,isGestore,onGestoreClick,sunAlt,sunAz,delay=0}) {
  const [hov,setHov]=useState(false);
  const occ=spot.status==="occupied"||spot.status==="reserved";
  const sel=selected?.id===spot.id;
  const cTop=occ?"#BDC3C7":sel?"#FF6B35":"#2ECC71";
  const cBot=occ?"#95A5A6":sel?"#CC4000":"#1A8A4A";

  const shd=useMemo(()=>{
    if(sunAlt<=1.5||occ) return null;
    const altR=sunAlt*Math.PI/180;
    const pxm=15,pH=2.3,cR=1.4;
    const sLen=Math.min(pH/Math.tan(altR),7)*pxm;
    const sAz=(sunAz+180)%360,sAzR=sAz*Math.PI/180;
    const sdx=Math.sin(sAzR),sdy=-Math.cos(sAzR);
    const cx=34+sdx*sLen,cy=42+sdy*sLen;
    const perpR=cR*pxm;
    const parR=Math.min(cR/Math.sin(Math.max(altR,0.035))*pxm,160);
    const angle=Math.atan2(sdy,sdx)*180/Math.PI;
    const op=Math.max(0.06,Math.min(0.52,0.68*(1-sunAlt/90)));
    const warm=Math.max(0,1-sunAlt/70);
    const shColor=`rgba(${Math.round(30+warm*25)},${Math.round(18+warm*8)},5,${op})`;
    return {cx,cy,perpR,parR,angle,op,sdx,sdy,sLen,shColor};
  },[sunAlt,sunAz,occ]);

  const warm=sunAlt>0?Math.max(0,1-sunAlt/65):0;
  const lightFill=sunAlt>0&&warm>0.03?`rgba(255,${Math.round(200-warm*35)},${Math.round(80-warm*60)},${(warm*0.2).toFixed(2)})`:null;
  const uid=spot.id.replace(/[^a-z0-9]/gi,"_");

  return (
    <div
      onClick={()=>{if(occ&&isGestore){onGestoreClick?.(spot);return;}if(!occ)onSelect(spot);}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      title={occ?"Occupato":spot.id+" | €"+spot.price+"/g"+(spot.vip?" VIP":"")}
      style={{width:68,height:88,cursor:occ?(isGestore?"pointer":"default"):"pointer",
        animation:`spotRise 0.18s ease ${delay}s both`,transition:"transform 0.12s",
        transform:sel?"scale(1.18)":hov&&!occ?"scale(1.07)":"scale(1)",
        filter:sel?"drop-shadow(0 0 8px rgba(255,107,53,0.7))":"none"}}>
      <svg width="68" height="88" viewBox="0 0 68 88" style={{overflow:"visible",display:"block"}}>
        <defs>
          <radialGradient id={"cg"+uid} cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor={cTop}/>
            <stop offset="100%" stopColor={cBot}/>
          </radialGradient>
          <filter id={"sf"+uid} x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="4"/></filter>
          <filter id={"sl"+uid} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2.5"/></filter>
        </defs>
        {shd&&<>
          <line x1="34" y1="42" x2={(34+shd.sdx*shd.sLen*0.55).toFixed(1)} y2={(42+shd.sdy*shd.sLen*0.55).toFixed(1)}
            stroke={shd.shColor} strokeWidth="5" strokeLinecap="round" filter={`url(#sl${uid})`}/>
          <ellipse cx={shd.cx.toFixed(1)} cy={shd.cy.toFixed(1)} rx={shd.parR.toFixed(1)} ry={shd.perpR.toFixed(1)}
            fill={shd.shColor} transform={`rotate(${shd.angle.toFixed(1)},${shd.cx.toFixed(1)},${shd.cy.toFixed(1)})`}
            filter={`url(#sf${uid})`}/>
          {[{bx:11,by:58},{bx:43,by:58}].map((b,i)=>(
            <ellipse key={i} cx={(b.bx+shd.sdx*7).toFixed(1)} cy={(b.by+shd.sdy*7).toFixed(1)} rx="14" ry="5"
              fill={shd.shColor} transform={`rotate(${shd.angle.toFixed(1)},${(b.bx+shd.sdx*7).toFixed(1)},${(b.by+shd.sdy*7).toFixed(1)})`}
              filter={`url(#sl${uid})`}/>
          ))}
        </>}
        <rect x="7" y="55" width="22" height="9" rx="3.5" fill={occ?"#CDD0D5":sel?"rgba(255,107,53,0.28)":"rgba(255,255,255,0.22)"} stroke={cBot} strokeWidth="1.5"/>
        {!occ&&<rect x="7" y="55" width="7" height="9" rx="3" fill={cBot} opacity="0.45"/>}
        <rect x="39" y="55" width="22" height="9" rx="3.5" fill={occ?"#CDD0D5":sel?"rgba(255,107,53,0.28)":"rgba(255,255,255,0.22)"} stroke={cBot} strokeWidth="1.5"/>
        {!occ&&<rect x="53" y="55" width="7" height="9" rx="3" fill={cBot} opacity="0.45"/>}
        <rect x="32" y="24" width="4" height="34" rx="2" fill={occ?"#9A9EA5":sel?"#AA2000":"#156635"}/>
        <ellipse cx="34" cy="20" rx="26" ry="18" fill={`url(#cg${uid})`} opacity={occ?0.42:0.93}/>
        {!occ&&[0,45,90,135,180,225,270,315].map((a,i)=>{
          const r=a*Math.PI/180;
          return <line key={i} x1="34" y1="20" x2={(34+25*Math.sin(r)).toFixed(1)} y2={(20+17*Math.cos(r)).toFixed(1)} stroke="rgba(255,255,255,0.2)" strokeWidth="0.7"/>;
        })}
        <ellipse cx="34" cy="20" rx="26" ry="18" fill="none" stroke={cBot} strokeWidth="1.5" opacity="0.8"/>
        {!occ&&[0,40,80,120,160,200,240,280,320].map((a,i)=>{
          const toP=(angle,rx,ry)=>({x:(34+rx*Math.sin(angle*Math.PI/180)).toFixed(1),y:(20+ry*Math.cos(angle*Math.PI/180)).toFixed(1)});
          const a1=toP(a-10,25,17),a2=toP(a+10,25,17),m=toP(a,32,23);
          return <path key={i} d={`M${a1.x},${a1.y} Q${m.x},${m.y} ${a2.x},${a2.y}`} fill={sel?"#FF7040":cTop} opacity="0.78"/>;
        })}
        {lightFill&&!occ&&<ellipse cx="34" cy="20" rx="26" ry="18" fill={lightFill}/>}
        {occ&&<><line x1="26" y1="12" x2="42" y2="28" stroke="rgba(100,100,100,0.55)" strokeWidth="2"/><line x1="42" y1="12" x2="26" y2="28" stroke="rgba(100,100,100,0.55)" strokeWidth="2"/></>}
        {spot.vip&&!occ&&<text x="34" y="22" textAnchor="middle" fontSize="9" fill="rgba(255,230,80,0.85)">♛</text>}
        <text x="34" y="78" textAnchor="middle" fontSize="7.5" fontWeight="800" fill={occ?"#888":sel?"#CC4000":"#1A5A30"} fontFamily="monospace">{spot.settore}{spot.row}{spot.col}</text>
      </svg>
    </div>
  );
}
