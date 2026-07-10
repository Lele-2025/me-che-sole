import { C } from "../theme.js";

export function CardLido({l,onDettaglio}) {
  return (
    <div onClick={()=>onDettaglio(l)} className="card-hover"
      style={{background:"white",borderRadius:20,overflow:"hidden",boxShadow:"0 3px 16px rgba(0,0,0,0.09)",border:"1.5px solid rgba(41,182,206,0.14)",cursor:"pointer"}}>
      <div style={{height:90,background:"linear-gradient(135deg,"+C.deep+","+C.sea1+","+C.aqua+")",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.8rem",position:"relative"}}>
        {l.img}
        {l.stelle===5&&<span style={{position:"absolute",top:8,right:8,background:"rgba(244,196,48,0.95)",borderRadius:50,padding:"2px 9px",fontSize:"0.62rem",fontWeight:800,color:"#3A2A00"}}>⭐ TOP</span>}
        <span style={{position:"absolute",bottom:8,left:10,background:"rgba(0,0,0,0.35)",borderRadius:50,padding:"2px 8px",fontSize:"0.62rem",color:"white",fontWeight:700}}>📍 {l.citta}</span>
      </div>
      <div style={{padding:"1rem"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",fontWeight:700,color:C.navy,marginBottom:"0.3rem"}}>{l.nome}</div>
        <div style={{fontSize:"0.73rem",color:"#4A7A9A",lineHeight:1.55,marginBottom:"0.8rem"}}>{l.desc}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:700,color:"#1A8A4A"}}>da €{l.prezzoMin}</div>
            <div style={{fontSize:"0.62rem",color:C.muted}}>al giorno</div>
          </div>
          <div style={{background:"linear-gradient(135deg,#27AE60,#1A8A4A)",color:"white",borderRadius:50,padding:"0.55rem 1.1rem",fontSize:"0.82rem",fontWeight:800}}>Scopri →</div>
        </div>
      </div>
    </div>
  );
}
