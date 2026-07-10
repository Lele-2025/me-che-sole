import { C, maiolicaPattern } from "../theme.js";

export function CardLido({l,onDettaglio}) {
  return (
    <div onClick={()=>onDettaglio(l)} className="card-hover"
      style={{background:C.white,borderRadius:14,overflow:"hidden",boxShadow:"0 2px 10px rgba(28,28,28,0.06)",border:"1.5px solid "+C.line,cursor:"pointer"}}>
      <div style={{height:88,background:C.sabbia,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.6rem",position:"relative"}}>
        {l.img}
        {l.stelle===5&&<span style={{position:"absolute",top:8,right:8,background:C.white,border:"1px solid "+C.line,borderRadius:50,padding:"2px 9px",fontSize:"0.62rem",fontWeight:800,color:C.terracotta}}>★ TOP</span>}
        <span style={{position:"absolute",bottom:8,left:10,background:"rgba(28,28,28,0.55)",borderRadius:50,padding:"2px 8px",fontSize:"0.62rem",color:C.white,fontWeight:700}}>{l.citta}</span>
      </div>
      {/* firma "maiolica pugliese", dettaglio sottile — non sfondo pieno */}
      <div style={{height:5,backgroundImage:maiolicaPattern,backgroundSize:"40px 40px"}}/>
      <div style={{padding:"1rem"}}>
        <div style={{fontFamily:"'Manrope',sans-serif",fontSize:"1.02rem",fontWeight:700,color:C.ink,marginBottom:"0.3rem"}}>{l.nome}</div>
        <div style={{fontSize:"0.75rem",color:C.inkMuted,lineHeight:1.55,marginBottom:"0.85rem"}}>{l.desc}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:"1.15rem",fontWeight:500,color:C.maiolica}}>da €{l.prezzoMin}</div>
            <div style={{fontSize:"0.62rem",color:C.inkMuted}}>al giorno</div>
          </div>
          <div style={{background:C.maiolica,color:C.white,borderRadius:10,padding:"0.55rem 1.1rem",fontSize:"0.8rem",fontWeight:700}}>Prenota →</div>
        </div>
      </div>
    </div>
  );
}
