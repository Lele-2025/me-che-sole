import { useState } from "react";
import { C, css } from "../theme.js";

// ─── DETTAGLIO LIDO ─────────────────────────────────────────────────
// NOTA: le recensioni qui sotto sono dati di esempio statici, non reali.
// Da collegare a Google Places API (vedi CONTEXT.md originale, roadmap punto 6).
export function DettaglioLido({lido,onBack,onPrenota}) {
  const [tab,setTab]=useState("info");
  const rec=[
    {nome:"Giulia T.",voto:5,testo:"Posto meraviglioso, mare cristallino!",data:"Agosto 2025"},
    {nome:"Marco R.",voto:5,testo:"Beach club ottimo, lettini comodissimi.",data:"Agosto 2025"},
    {nome:"Anna V.",voto:4,testo:"Bellissimo, vale ogni euro.",data:"Luglio 2025"},
    {nome:"Roberto F.",voto:5,testo:"La baia piu' bella del Gargano!",data:"Giugno 2025"},
  ];
  const media=(rec.reduce((s,r)=>s+r.voto,0)/rec.length).toFixed(1);
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#FFFDE8,#FFF6C0,#EEF8F8)",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{css}</style>
      <div style={{position:"relative",height:"clamp(200px,38vw,290px)",overflow:"hidden",background:"linear-gradient(135deg,"+C.deep+","+C.navy+","+C.sea1+")"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-55%)",fontSize:"clamp(5rem,12vw,7rem)",animation:"float 3.5s ease-in-out infinite"}}>{lido.img}</div>
        <div style={{position:"absolute",bottom:14,left:0,right:0,textAlign:"center"}}>
          <span style={{background:"rgba(255,253,232,0.95)",borderRadius:50,padding:"0.3rem 1rem",fontSize:"0.85rem",fontWeight:800,color:C.navy}}>⭐ {media} · {rec.length} recensioni</span>
        </div>
        <button onClick={onBack} style={{position:"absolute",top:14,left:14,background:"rgba(255,255,255,0.2)",backdropFilter:"blur(8px)",border:"2px solid rgba(255,255,255,0.3)",borderRadius:50,padding:"0.45rem 1rem",fontSize:"0.82rem",fontWeight:700,color:"white",cursor:"pointer"}}>← Indietro</button>
      </div>
      <div style={{maxWidth:720,margin:"0 auto",padding:"0 1.2rem 7rem"}}>
        <div style={{background:"white",borderRadius:"0 0 20px 20px",padding:"1.2rem 1.4rem",marginBottom:"1rem",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"0.8rem"}}>
            <div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.4rem,5vw,2rem)",fontWeight:700,color:C.navy,lineHeight:1.1,marginBottom:"0.3rem"}}>{lido.nome}</h1>
              <div style={{fontSize:"0.8rem",color:C.muted}}>⚓ {lido.citta} · {lido.regione}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:700,color:"#1A8A4A",lineHeight:1}}>da €{lido.prezzoMin}</div>
              <div style={{fontSize:"0.65rem",color:C.muted}}>al giorno</div>
            </div>
          </div>
        </div>
        <div style={{display:"flex",background:"rgba(255,255,255,0.8)",borderRadius:50,padding:4,gap:3,marginBottom:"1rem",border:"2px solid rgba(41,182,206,0.15)"}}>
          {[["info","ℹ️ Info"],["rec","⭐ Recensioni"]].map(([id,lb])=>(
            <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"0.6rem",border:"none",cursor:"pointer",borderRadius:50,fontSize:"0.85rem",fontWeight:700,transition:"all 0.2s",background:tab===id?"linear-gradient(135deg,"+C.sea1+","+C.sea2+")":"transparent",color:tab===id?"white":C.muted}}>{lb}</button>
          ))}
        </div>
        {tab==="info"&&(
          <div style={{animation:"fadeUp 0.3s ease both"}}>
            <div style={{background:"white",borderRadius:16,padding:"1.1rem 1.2rem",marginBottom:"0.9rem",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",fontWeight:700,color:C.navy,marginBottom:"0.7rem"}}>📖 Descrizione</div>
              <div style={{fontSize:"0.88rem",color:"#4A7A9A",lineHeight:1.75}}>{lido.desc}. Uno dei lidi piu' apprezzati della costa garganica.</div>
            </div>
            <div style={{background:"white",borderRadius:16,padding:"1.1rem 1.2rem",marginBottom:"0.9rem",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",fontWeight:700,color:C.navy,marginBottom:"0.7rem"}}>🛎️ Servizi</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:"0.5rem"}}>
                {["🚿 Docce calde","🅿️ Parcheggio","🍹 Bar","📶 Wi-Fi","🏄 Sport acquatici","👶 Area bambini"].map(s=>(
                  <div key={s} style={{background:"rgba(39,174,96,0.07)",borderRadius:10,padding:"0.5rem 0.75rem",fontSize:"0.78rem",color:"#1A5A30",border:"1.5px solid rgba(39,174,96,0.15)",fontWeight:600}}>{s}</div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab==="rec"&&(
          <div style={{animation:"fadeUp 0.3s ease both"}}>
            {rec.map((rc,i)=>(
              <div key={i} style={{background:"white",borderRadius:16,padding:"1rem 1.2rem",marginBottom:"0.8rem",boxShadow:"0 2px 10px rgba(0,0,0,0.05)"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.5rem"}}>
                  <span style={{fontWeight:800,color:C.navy,fontSize:"0.9rem"}}>{rc.nome}</span>
                  <span style={{fontSize:"0.72rem",color:C.muted}}>{"⭐".repeat(rc.voto)} · {rc.data}</span>
                </div>
                <div style={{fontSize:"0.84rem",color:"#4A7A9A",lineHeight:1.65}}>{rc.testo}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(255,253,232,0.97)",backdropFilter:"blur(14px)",borderTop:"2px solid rgba(39,174,96,0.2)",padding:"1rem 1.2rem",display:"flex",gap:"0.8rem",alignItems:"center",maxWidth:720,margin:"0 auto",boxSizing:"border-box"}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:800,color:C.navy,fontSize:"0.88rem"}}>{lido.nome}</div>
          <div style={{fontSize:"0.7rem",color:C.muted}}>da €{lido.prezzoMin}/giorno</div>
        </div>
        <button onClick={()=>onPrenota(lido)} style={{background:"linear-gradient(135deg,#27AE60,#1A8A4A)",color:"white",border:"none",borderRadius:50,padding:"0.85rem 1.5rem",fontSize:"0.95rem",fontWeight:800,cursor:"pointer",boxShadow:"0 6px 20px rgba(39,174,96,0.45)",whiteSpace:"nowrap"}}>🏖️ Prenota ora</button>
      </div>
    </div>
  );
}
