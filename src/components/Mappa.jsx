import { useState, useEffect, useMemo } from "react";
import { css } from "../theme.js";
import { SETTORI, FILE_ROWS, COLS } from "../data/spots.js";
import { getSunPos } from "../lib/sunEngine.js";
import { SunCompass } from "./SunCompass.jsx";
import { OmbrelloneReal } from "./OmbrelloneReal.jsx";

// ─── MAPPA CON OMBRE SOLARI ──────────────────────────────────────────
export function Mappa({spots,selected,onSelect,bookings,lidoNome,isGestore,onGestoreClick,dateStr,timeHours}) {
  const [previewT,setPreviewT]=useState(timeHours!=null?timeHours:10);
  useEffect(()=>{if(timeHours!=null)setPreviewT(timeHours);},[timeHours]);

  const sun=useMemo(()=>getSunPos(dateStr||new Date().toISOString().split("T")[0],previewT),[dateStr,previewT]);
  const free=spots.filter(s=>!bookings.find(b=>b.spotId===s.id)&&s.status==="free").length;
  const occ=spots.length-free;
  const colFila={A:"#0066AA",B:"#1E96B0",C:"#1A8A4A",D:"#7CB342",E:"#F9A825"};

  const h=Math.floor(previewT),m=Math.round((previewT%1)*60);
  const tLabel=String(h).padStart(2,"0")+":"+String(m).padStart(2,"0");
  const sunBg=sun.alt<=0?"rgba(20,20,50,0.95)":sun.alt<20?"linear-gradient(135deg,rgba(200,100,20,0.9),rgba(220,140,30,0.9))":"linear-gradient(135deg,rgba(30,80,160,0.85),rgba(50,120,200,0.85))";
  const sunIco=sun.alt<=0?"🌙":sun.alt<20?"🌅":sun.alt<50?"⛅":"☀️";

  return (
    <div style={{borderRadius:20,overflow:"hidden",boxShadow:"0 8px 36px rgba(0,0,0,0.16)",border:"2px solid rgba(41,182,206,0.2)",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{css}</style>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#002840,#003A58,#005880)",padding:"0.85rem 1.1rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.6rem"}}>
        <div style={{flex:1,minWidth:140}}>
          <div style={{fontSize:"0.56rem",color:"rgba(104,216,200,0.7)",fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:"0.1rem"}}>Mappa · ombra in tempo reale</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",color:"white",fontWeight:700}}>{lidoNome||"Lido"}</div>
        </div>
        <div style={{display:"flex",gap:"0.8rem",alignItems:"center"}}>
          <SunCompass alt={sun.alt} az={sun.az} size={80}/>
          <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
            <div style={{background:"rgba(39,174,96,0.15)",borderRadius:10,padding:"0.3rem 0.6rem",textAlign:"center"}}>
              <div style={{fontSize:"1rem",fontWeight:800,color:"#2ECC71",lineHeight:1}}>{free}</div>
              <div style={{fontSize:"0.5rem",color:"rgba(255,255,255,0.5)",textTransform:"uppercase"}}>Liberi</div>
            </div>
            <div style={{background:"rgba(255,107,107,0.12)",borderRadius:10,padding:"0.3rem 0.6rem",textAlign:"center"}}>
              <div style={{fontSize:"1rem",fontWeight:800,color:"#FF6B6B",lineHeight:1}}>{occ}</div>
              <div style={{fontSize:"0.5rem",color:"rgba(255,255,255,0.5)",textTransform:"uppercase"}}>Occupati</div>
            </div>
          </div>
        </div>
      </div>
      {/* Info ombra */}
      <div style={{background:sunBg,padding:"0.65rem 1rem",display:"flex",alignItems:"center",gap:"0.7rem"}}>
        <span style={{fontSize:"1.2rem"}}>{sunIco}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.9)",fontWeight:700,lineHeight:1.3}}>{tLabel} — {sun.desc}</div>
          {sun.isDay&&<div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.55)",marginTop:"0.15rem"}}>💡 Mattina=ombra a Ovest · Pomeriggio=ombra a Est</div>}
        </div>
      </div>
      {/* Slider */}
      <div style={{background:"rgba(0,0,0,0.22)",padding:"0.5rem 1rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.6rem"}}>
          <span style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.5)",fontWeight:700,flexShrink:0}}>🕐 Ombra alle:</span>
          <input type="range" min="5.5" max="21" step="0.25" value={previewT}
            onChange={e=>setPreviewT(parseFloat(e.target.value))}
            style={{flex:1,accentColor:"#F4C430",cursor:"pointer"}}/>
          <span style={{fontSize:"0.78rem",color:"#F4C430",fontWeight:800,minWidth:38,textAlign:"right"}}>{tLabel}</span>
        </div>
        {timeHours!=null&&Math.abs(previewT-timeHours)>0.2&&(
          <div style={{display:"flex",justifyContent:"flex-end",marginTop:"0.2rem"}}>
            <button onClick={()=>setPreviewT(timeHours)} style={{background:"rgba(244,196,48,0.18)",border:"1px solid rgba(244,196,48,0.4)",color:"#F4C430",borderRadius:50,padding:"1px 8px",fontSize:"0.58rem",fontWeight:700,cursor:"pointer"}}>
              Torna orario prenotazione ({String(Math.floor(timeHours)).padStart(2,"0")}:{String(Math.round((timeHours%1)*60)).padStart(2,"0")})
            </button>
          </div>
        )}
      </div>
      {/* Barra occupazione */}
      <div style={{height:5,background:"rgba(0,0,0,0.15)"}}>
        <div style={{height:"100%",width:Math.round(occ/spots.length*100)+"%",background:"linear-gradient(90deg,#2ECC71,#FF6B35)",transition:"width 0.4s ease"}}/>
      </div>
      {/* Mare — onde in CSS puro, zero JS re-render */}
      <div style={{position:"relative",height:64,background:"linear-gradient(180deg,#003060,#0066AA,#1E96B0)",overflow:"hidden"}}>
        <svg style={{position:"absolute",bottom:0,left:0,width:"200%",height:"55%",animation:"waveL 7s linear infinite"}} viewBox="0 0 1200 36" preserveAspectRatio="none">
          <path d="M0,11 C200,2 400,22 600,11 S1000,2 1200,11 L1200,36 L0,36Z" fill="rgba(41,182,206,0.92)"/>
        </svg>
        <svg style={{position:"absolute",bottom:0,left:0,width:"200%",height:"35%",animation:"waveR 5s linear infinite",opacity:0.65}} viewBox="0 0 1200 22" preserveAspectRatio="none">
          <path d="M0,7 C200,1 400,14 600,7 S1000,1 1200,7 L1200,22 L0,22Z" fill="rgba(104,216,200,0.75)"/>
        </svg>
        <div style={{position:"absolute",bottom:7,width:"100%",textAlign:"center",color:"rgba(255,255,255,0.4)",fontSize:"0.5rem",fontWeight:800,letterSpacing:"0.3em",textTransform:"uppercase"}}>⬆ MARE</div>
      </div>
      {/* Bagnasciuga — animazione marea CSS */}
      <div style={{animation:"tideAnim 4s ease-in-out infinite",background:"rgba(41,182,206,0.4)"}}/>
      {/* Griglia ombrelloni */}
      <div style={{background:"linear-gradient(180deg,#F2D890,#E8C868 55%,#DDB850)",overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
        <div style={{minWidth:"max-content",padding:"0.5rem 0.7rem 0.8rem"}}>
          {/* Etichette settori */}
          <div style={{display:"flex",marginBottom:5,paddingLeft:32}}>
            {SETTORI.map((s,si)=>(
              <div key={s} style={{display:"flex",alignItems:"center"}}>
                <div style={{width:COLS*71,textAlign:"center",fontSize:"0.58rem",fontWeight:800,color:"rgba(80,50,5,0.5)",letterSpacing:"0.1em",textTransform:"uppercase",borderBottom:"2px dashed rgba(80,50,5,0.12)",paddingBottom:3}}>Settore {s}</div>
                {si<SETTORI.length-1&&<div style={{width:18}}/>}
              </div>
            ))}
          </div>
          {/* File */}
          {FILE_ROWS.map((row,rIdx)=>(
            <div key={row}>
              {(row==="C"||row==="E")&&(
                <div style={{display:"flex",marginBottom:3}}>
                  <div style={{width:32,flexShrink:0}}/>
                  <div style={{flex:1,height:14,background:"repeating-linear-gradient(90deg,#C8A058 0,#C8A058 14px,#A88038 14px,#A88038 28px)",borderRadius:4,border:"1px solid rgba(100,70,20,0.18)"}}/>
                </div>
              )}
              <div style={{display:"flex",alignItems:"center",marginBottom:3}}>
                <div style={{width:32,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                  <div style={{width:24,height:24,borderRadius:7,background:colFila[row],display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.68rem",fontWeight:900,color:"white",boxShadow:"0 2px 6px rgba(0,0,0,0.22)"}}>{row}</div>
                  {(row==="A"||row==="B")&&<div style={{fontSize:"0.36rem",color:"#B8860B",fontWeight:900}}>VIP</div>}
                </div>
                {SETTORI.map((settore,si)=>{
                  const rowSpots=spots.filter(s=>s.settore===settore&&s.row===row).sort((a,b)=>a.col-b.col);
                  return (
                    <div key={settore} style={{display:"flex",alignItems:"center"}}>
                      <div style={{display:"flex",gap:3}}>
                        {rowSpots.map((spot,ci)=>(
                          <OmbrelloneReal key={spot.id} spot={spot} bookings={bookings}
                            selected={selected} onSelect={onSelect}
                            isGestore={isGestore} onGestoreClick={onGestoreClick}
                            sunAlt={sun.alt} sunAz={sun.az} delay={(rIdx*6+ci)*0.012}/>
                        ))}
                      </div>
                      {si<SETTORI.length-1&&(
                        <div style={{width:18,height:88,flexShrink:0,background:"repeating-linear-gradient(180deg,#C8A058 0,#C8A058 10px,#A88038 10px,#A88038 20px)",borderLeft:"1px solid rgba(100,70,20,0.18)",borderRight:"1px solid rgba(100,70,20,0.18)"}}/>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {/* Stabilimento */}
          <div style={{height:40,marginTop:12,background:"linear-gradient(90deg,#9A7240,#7A5220,#9A7240)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"space-around",fontSize:"0.65rem",fontWeight:700,color:"rgba(255,230,170,0.88)"}}>
            <span>🚿 Docce</span><span>☕ Bar</span><span>👙 Spogliatoi</span><span>🏥 Pronto Soccorso</span>
          </div>
        </div>
        {/* Legenda */}
        <div style={{display:"flex",gap:"0.7rem",flexWrap:"wrap",alignItems:"center",padding:"0.5rem 0.7rem 0.8rem",borderTop:"1px solid rgba(139,96,32,0.15)"}}>
          {[{c:"#2ECC71",b:"#1A8A4A",l:"Libero"},{c:"#BDC3C7",b:"#95A5A6",l:"Occupato"},{c:"#FF6B35",b:"#CC4000",l:"Selezionato"}].map(c=>(
            <div key={c.l} style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:14,height:14,borderRadius:4,background:c.c,border:"2px solid "+c.b}}/>
              <span style={{fontSize:"0.68rem",color:"#555",fontWeight:500}}>{c.l}</span>
            </div>
          ))}
          <span style={{fontSize:"0.62rem",color:"#888",marginLeft:"auto",fontStyle:"italic"}}>☁️ Ombre calcolate per orario selezionato</span>
        </div>
      </div>
    </div>
  );
}
