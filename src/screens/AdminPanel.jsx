import { useState } from "react";
import { css } from "../theme.js";
import { LIDI } from "../data/lidi.js";
import { generateSpots } from "../data/spots.js";

export function AdminPanel({onExit}) {
  const spots=generateSpots();
  const [bookings]=useState([
    {spotId:"P-A1",client:"Laura M.",date:"2025-07-14",arrivalTime:"08:45",price:32,tipo:"Con Imprevisti"},
    {spotId:"P-A3",client:"Marco R.",date:"2025-07-14",arrivalTime:"09:00",price:32,tipo:"Standard"},
    {spotId:"Q-B2",client:"Giulia T.",date:"2025-07-14",arrivalTime:"10:00",price:26,tipo:"Standard"},
  ]);
  return (
    <div style={{minHeight:"100vh",background:"#050810",color:"#E8EEFF",fontFamily:"'DM Sans',sans-serif",padding:"1.5rem"}}>
      <style>{css}</style>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"2rem"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:700,color:"#6070FF"}}>🔒 Admin Panel</div>
        <button onClick={onExit} style={{background:"rgba(100,120,255,0.15)",border:"1px solid rgba(100,120,255,0.3)",color:"#8090EE",borderRadius:50,padding:"0.4rem 1rem",fontSize:"0.78rem",cursor:"pointer"}}>← Esci</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"1rem",marginBottom:"2rem"}}>
        {[{l:"Lidi",v:LIDI.length},{l:"Ombrelloni",v:spots.length},{l:"Prenotazioni",v:bookings.length},{l:"Disponibili",v:spots.length-bookings.length}].map(s=>(
          <div key={s.l} style={{background:"rgba(100,120,255,0.1)",borderRadius:14,padding:"1rem",textAlign:"center",border:"1px solid rgba(100,120,255,0.2)"}}>
            <div style={{fontSize:"1.8rem",fontWeight:800,color:"#8090EE"}}>{s.v}</div>
            <div style={{fontSize:"0.72rem",color:"rgba(200,210,255,0.5)",textTransform:"uppercase",letterSpacing:"0.06em"}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:"1rem"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",fontWeight:700,marginBottom:"1rem",color:"#8090EE"}}>Prenotazioni recenti</div>
        {bookings.map((b,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"0.6rem 0",borderBottom:"1px solid rgba(255,255,255,0.06)",fontSize:"0.82rem"}}>
            <span style={{color:"rgba(200,210,255,0.7)"}}>{b.spotId} · {b.client}</span>
            <span style={{color:"#8090EE",fontWeight:700}}>€{b.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
