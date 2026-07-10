import { useState } from "react";
import { C, css } from "../theme.js";
import { Mappa } from "../components/Mappa.jsx";

// ─── WIZARD PRENOTAZIONE ────────────────────────────────────────────
export function WizardPrenotazione({lidoSel,spots,bookings,onBook,onBack}) {
  const [passo,setPasso]=useState(1);
  const [dateStart,setDateStart]=useState("");
  const [dateEnd,setDateEnd]=useState("");
  const [ora,setOra]=useState("");
  const [imp,setImp]=useState(false);
  const [selected,setSelected]=useState(null);
  const oggi=new Date().toISOString().split("T")[0];
  const days=dateStart&&dateEnd?Math.max(1,Math.ceil((new Date(dateEnd)-new Date(dateStart))/86400000)+1):1;
  const base=(selected?.price||0)*days;
  const extra=imp?Math.ceil(base*0.15):0;
  const total=base+extra;
  const timeH=ora?(parseInt(ora.split(":")[0])+(parseInt(ora.split(":")[1]||"0")/60)):null;
  const inp={width:"100%",padding:"0.9rem 1.1rem",borderRadius:14,border:"2px solid rgba(41,182,206,0.3)",fontSize:"1rem",outline:"none",boxSizing:"border-box",color:C.navy,background:"white",fontFamily:"'DM Sans',sans-serif"};
  const BtnV=({label,onClick,disabled})=>(
    <button onClick={onClick} disabled={disabled} style={{width:"100%",padding:"1.1rem",borderRadius:50,border:"none",background:disabled?"rgba(0,0,0,0.08)":"linear-gradient(135deg,#27AE60,#1A8A4A)",color:disabled?"#bbb":"white",fontSize:"1rem",fontWeight:800,cursor:disabled?"not-allowed":"pointer",boxShadow:disabled?"none":"0 6px 20px rgba(39,174,96,0.45)"}}>
      {label}
    </button>
  );
  const BtnI=({onClick})=>(
    <button onClick={onClick} style={{width:"100%",padding:"0.85rem",borderRadius:50,border:"2px solid rgba(0,0,0,0.1)",background:"transparent",color:"#888",fontSize:"0.9rem",fontWeight:600,cursor:"pointer",marginTop:"0.6rem"}}>← Indietro</button>
  );
  const Steps=()=>(
    <div style={{display:"flex",alignItems:"center",marginBottom:"1.5rem"}}>
      {[{n:1,l:"Date"},{n:2,l:"Posto"},{n:3,l:"Conferma"}].map((s,i)=>(
        <div key={s.n} style={{display:"flex",alignItems:"center",flex:i<2?1:0}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <div style={{width:36,height:36,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.82rem",fontWeight:800,background:passo>s.n?"#27AE60":passo===s.n?"linear-gradient(135deg,"+C.sea1+","+C.sea2+")":"rgba(0,0,0,0.08)",color:passo>=s.n?"white":"#aaa"}}>{passo>s.n?"✓":s.n}</div>
            <span style={{fontSize:"0.62rem",fontWeight:700,color:passo===s.n?C.sea2:"#aaa",whiteSpace:"nowrap"}}>{s.l}</span>
          </div>
          {i<2&&<div style={{flex:1,height:3,background:passo>s.n?"#27AE60":"rgba(0,0,0,0.08)",borderRadius:2,marginBottom:18}}/>}
        </div>
      ))}
    </div>
  );
  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",minHeight:"100vh",background:"linear-gradient(160deg,#FFFDE8,#FFF6C0,#EEF8F8)"}}>
      <style>{css}</style>
      <div style={{background:"rgba(255,253,232,0.97)",backdropFilter:"blur(14px)",borderBottom:"2px solid rgba(41,182,206,0.15)",padding:"0.8rem 1.2rem",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
        <button onClick={onBack} style={{background:"none",border:"none",fontSize:"1rem",cursor:"pointer",color:C.sea2,fontWeight:700}}>← Indietro</button>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",fontWeight:700,color:C.navy,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"55%",textAlign:"center"}}>{lidoSel?.nome}</div>
        <div style={{width:60}}/>
      </div>
      <div style={{maxWidth:680,margin:"0 auto",padding:"1.5rem 1.2rem 5rem"}}>
        <Steps/>
        {passo===1&&(
          <div style={{animation:"fadeUp 0.35s ease both"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.7rem",fontWeight:700,color:C.navy,marginBottom:"0.3rem"}}>📅 Quando vuoi venire?</div>
            <div style={{fontSize:"0.88rem",color:C.muted,marginBottom:"1.5rem"}}>Scegli il giorno e l'orario di arrivo.</div>
            <div style={{background:"white",borderRadius:20,padding:"1.4rem",boxShadow:"0 4px 20px rgba(0,0,0,0.07)",marginBottom:"1.2rem",display:"flex",flexDirection:"column",gap:"1rem"}}>
              <div>
                <label style={{fontSize:"0.8rem",fontWeight:800,color:C.navy,display:"block",marginBottom:"0.5rem"}}>🌅 Giorno di arrivo *</label>
                <input style={inp} type="date" min={oggi} value={dateStart} onChange={e=>{setDateStart(e.target.value);if(!dateEnd||dateEnd<e.target.value)setDateEnd(e.target.value);}}/>
              </div>
              <div>
                <label style={{fontSize:"0.8rem",fontWeight:800,color:C.navy,display:"block",marginBottom:"0.5rem"}}>🌇 Giorno di partenza</label>
                <input style={inp} type="date" min={dateStart||oggi} value={dateEnd} onChange={e=>setDateEnd(e.target.value)}/>
              </div>
              <div>
                <label style={{fontSize:"0.8rem",fontWeight:800,color:C.navy,display:"block",marginBottom:"0.5rem"}}>⏰ Ora di arrivo prevista *</label>
                <input style={inp} type="time" value={ora} onChange={e=>setOra(e.target.value)}/>
                <div style={{fontSize:"0.72rem",color:C.muted,marginTop:"0.4rem"}}>⚠️ Posto tenuto per 2 ore. Con Imprevisti: garantito tutto il giorno.</div>
              </div>
            </div>
            <div onClick={()=>setImp(v=>!v)} style={{background:"white",borderRadius:16,padding:"1.1rem 1.2rem",border:"2px solid "+(imp?"rgba(124,58,237,0.4)":"rgba(0,0,0,0.08)"),cursor:"pointer",display:"flex",gap:"1rem",alignItems:"center",marginBottom:"1.5rem"}}>
              <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,background:imp?"linear-gradient(135deg,#9B59B6,#7D3C98)":"rgba(0,0,0,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",color:"white"}}>{imp?"✓":""}</div>
              <div>
                <div style={{fontWeight:800,color:C.navy,fontSize:"0.92rem",marginBottom:"0.2rem"}}>🛡️ Con Imprevisti <span style={{color:"#9B59B6",fontSize:"0.75rem"}}>(+15%)</span></div>
                <div style={{fontSize:"0.75rem",color:C.muted}}>Ombrellone riservato tutta la giornata, arrivi quando vuoi.</div>
              </div>
            </div>
            <BtnV label="Scegli il posto →" disabled={!dateStart||!ora} onClick={()=>dateStart&&ora&&setPasso(2)}/>
            {(!dateStart||!ora)&&<div style={{textAlign:"center",marginTop:"0.7rem",fontSize:"0.78rem",color:C.coral}}>ℹ️ Inserisci data e ora per continuare</div>}
          </div>
        )}
        {passo===2&&(
          <div style={{animation:"fadeUp 0.35s ease both"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.7rem",fontWeight:700,color:C.navy,marginBottom:"0.3rem"}}>☀️ Scegli il tuo posto</div>
            <div style={{fontSize:"0.88rem",color:C.muted,marginBottom:"1rem"}}>Le ombre sono <strong>reali</strong> per le <strong>{ora}</strong>. Tocca un ombrellone verde.</div>
            <div style={{background:selected?"rgba(39,174,96,0.08)":"rgba(255,255,255,0.7)",borderRadius:16,padding:"0.9rem 1.1rem",marginBottom:"1rem",border:"2px solid "+(selected?"rgba(39,174,96,0.4)":"rgba(0,0,0,0.08)"),display:"flex",alignItems:"center",gap:"0.8rem"}}>
              <div style={{fontSize:"1.8rem",flexShrink:0}}>{selected?"☀️":"👆"}</div>
              <div style={{flex:1}}>
                {selected?<>
                  <div style={{fontWeight:800,color:"#1A8A4A",fontSize:"0.95rem"}}>Posto {selected.id} {selected.vip?"👑 VIP":""}</div>
                  <div style={{fontSize:"0.78rem",color:C.muted}}>Fila {selected.row} · Settore {selected.settore} · €{selected.price}/g</div>
                </>:<div style={{fontWeight:600,color:"#aaa",fontSize:"0.88rem"}}>Tocca un ombrellone verde sulla mappa</div>}
              </div>
              {selected&&<button onClick={()=>setSelected(null)} style={{background:"none",border:"none",color:"#ccc",fontSize:"1.2rem",cursor:"pointer"}}>✕</button>}
            </div>
            <Mappa spots={spots} selected={selected} onSelect={setSelected} bookings={bookings}
              lidoNome={lidoSel?.nome} isGestore={false} dateStr={dateStart} timeHours={timeH}/>
            <div style={{marginTop:"1.2rem",display:"flex",flexDirection:"column",gap:"0.6rem"}}>
              <BtnV label={selected?"Vai al riepilogo →":"Seleziona un ombrellone per continuare"} disabled={!selected} onClick={()=>selected&&setPasso(3)}/>
              <BtnI onClick={()=>setPasso(1)}/>
            </div>
          </div>
        )}
        {passo===3&&(
          <div style={{animation:"fadeUp 0.35s ease both"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.7rem",fontWeight:700,color:C.navy,marginBottom:"0.3rem"}}>✅ Tutto in ordine?</div>
            <div style={{background:"white",borderRadius:20,overflow:"hidden",boxShadow:"0 6px 24px rgba(0,0,0,0.09)",marginBottom:"1.2rem"}}>
              <div style={{background:"linear-gradient(135deg,"+C.deep+","+C.navy+")",padding:"1.2rem",display:"flex",alignItems:"center",gap:"0.9rem"}}>
                <div style={{fontSize:"2.4rem"}}>{lidoSel?.img||"🏖️"}</div>
                <div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.15rem",fontWeight:700,color:"white"}}>{lidoSel?.nome}</div>
                  <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.6)"}}>⚓ {lidoSel?.citta}</div>
                </div>
              </div>
              <div style={{padding:"1.2rem"}}>
                {[{ico:"📍",l:"Posto",v:selected?.id+(selected?.vip?" 👑":"")},{ico:"📅",l:"Dal",v:dateStart},{ico:"📅",l:"Al",v:dateEnd||dateStart},{ico:"⏰",l:"Ora arrivo",v:ora,hl:true},{ico:"📆",l:"Durata",v:days+" giorno"+(days>1?"i":"")},{ico:"🛡️",l:"Tipo",v:imp?"Con Imprevisti":"Standard"}].map(r=>(
                  <div key={r.l} style={{display:"flex",alignItems:"center",gap:"0.8rem",padding:"0.65rem 0",borderBottom:"1px solid rgba(0,0,0,0.05)"}}>
                    <span style={{fontSize:"1rem",flexShrink:0,width:24,textAlign:"center"}}>{r.ico}</span>
                    <span style={{fontSize:"0.78rem",color:C.muted,minWidth:100}}>{r.l}</span>
                    <span style={{fontWeight:700,color:r.hl?C.coral:C.navy,fontSize:"0.88rem",flex:1,textAlign:"right"}}>{r.v}</span>
                  </div>
                ))}
                <div style={{marginTop:"1rem",padding:"1rem",background:"rgba(39,174,96,0.06)",borderRadius:14,border:"2px solid rgba(39,174,96,0.2)"}}>
                  {imp&&<div style={{display:"flex",justifyContent:"space-between",fontSize:"0.82rem",color:"#9B59B6",marginBottom:"0.3rem"}}><span>🛡️ Imprevisti +15%</span><span>+€{extra}</span></div>}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontWeight:800,color:C.navy,fontSize:"1rem"}}>Totale</span>
                    <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:700,color:"#1A8A4A"}}>€{total}</span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={()=>onBook({spot:selected,dateStart,dateEnd:dateEnd||dateStart,ora,imp,total,days})}
              style={{width:"100%",padding:"1.1rem",borderRadius:50,border:"none",background:"linear-gradient(135deg,#27AE60,#1A8A4A)",color:"white",fontSize:"1rem",fontWeight:800,cursor:"pointer",boxShadow:"0 6px 20px rgba(39,174,96,0.45)",marginBottom:"0.6rem"}}>
              💳 Paga €{total} — Conferma prenotazione
            </button>
            <BtnI onClick={()=>setPasso(2)}/>
          </div>
        )}
      </div>
    </div>
  );
}
