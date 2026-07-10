import { useState } from "react";
import { C } from "../theme.js";

// ATTENZIONE: questo componente raccoglie numero carta/CVV in state
// React e simula la conferma con un setTimeout — nessun addebito reale
// avviene. Da sostituire con Stripe Checkout/Payment Element prima di
// qualunque uso reale (vedi CLAUDE.md e task collegato).
export function ModalPagamento({prenotazione,onConferma,onChiudi}) {
  const [step,setStep]=useState("condizioni");
  const [ok,setOk]=useState(false);
  const [carta,setCarta]=useState({numero:"",scadenza:"",cvv:"",nome:""});
  const [errC,setErrC]=useState("");
  const {spot,dateStart,dateEnd,ora,imp,total}=prenotazione;
  const fmtN=v=>v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtS=v=>v.replace(/\D/g,"").slice(0,4).replace(/(\d{2})(\d)/,"$1/$2");
  const valida=()=>{
    if(carta.numero.replace(/\s/g,"").length<16) return "Numero carta non valido";
    if(carta.scadenza.length<5) return "Data scadenza non valida";
    if(carta.cvv.length<3) return "CVV non valido";
    if(carta.nome.trim().length<3) return "Nome titolare mancante";
    return "";
  };
  const paga=()=>{const e=valida();if(e){setErrC(e);return;}setErrC("");setStep("processing");setTimeout(()=>{setStep("done");setTimeout(onConferma,1800);},2200);};
  const ov={position:"fixed",inset:0,background:"rgba(0,58,88,0.75)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:300,backdropFilter:"blur(4px)"};
  const box={background:"white",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"92vh",overflowY:"auto",padding:"1.5rem 1.3rem 2rem",boxShadow:"0 -8px 40px rgba(0,58,88,0.3)"};
  const inp={width:"100%",padding:"0.72rem 0.9rem",borderRadius:10,border:"1.5px solid rgba(41,182,206,0.3)",fontSize:"0.92rem",outline:"none",boxSizing:"border-box",color:C.navy,background:"#FAFEFF"};
  if(step==="processing") return (<div style={{...ov,alignItems:"center"}}><div style={{background:"white",borderRadius:20,padding:"2.5rem 2rem",textAlign:"center",maxWidth:320,width:"90%"}}><div style={{fontSize:"3rem",marginBottom:"1rem",animation:"pulse 1s ease-in-out infinite"}}>💳</div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",fontWeight:700,color:C.navy}}>Pagamento in corso...</div><div style={{height:4,background:"rgba(41,182,206,0.15)",borderRadius:10,overflow:"hidden",marginTop:"1rem"}}><div style={{height:"100%",background:"linear-gradient(90deg,"+C.sea1+","+C.coral+")",borderRadius:10,animation:"slideProgress 2.2s ease forwards"}}/></div></div></div>);
  if(step==="done") return (<div style={{...ov,alignItems:"center"}}><div style={{background:"white",borderRadius:20,padding:"2.5rem 2rem",textAlign:"center",maxWidth:340,width:"90%"}}><div style={{width:70,height:70,borderRadius:"50%",background:"linear-gradient(135deg,#4CAF50,#2E7D32)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem",margin:"0 auto 1rem"}}>✅</div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:700,color:C.navy,marginBottom:"0.5rem"}}>Prenotazione confermata!</div><div style={{fontSize:"0.82rem",color:C.muted}}>Posto <strong style={{color:C.sea2}}>{spot.id}</strong> prenotato. QR code via email.</div></div></div>);
  if(step==="carta") return (
    <div style={ov} onClick={onChiudi}>
      <div style={box} onClick={e=>e.stopPropagation()}>
        <div style={{width:40,height:4,background:"rgba(0,58,88,0.15)",borderRadius:10,margin:"0 auto 1.2rem"}}/>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",fontWeight:700,color:C.navy,marginBottom:"1rem"}}>💳 Dati di pagamento</div>
        <div style={{background:"linear-gradient(135deg,"+C.deep+","+C.navy+")",borderRadius:16,padding:"1.2rem 1.4rem",marginBottom:"1.2rem"}}>
          <div style={{fontFamily:"monospace",fontSize:"1.1rem",color:"rgba(255,253,232,0.9)",letterSpacing:"0.1em",marginBottom:"0.7rem"}}>{carta.numero||"•••• •••• •••• ••••"}</div>
          <div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:"0.8rem",color:"rgba(255,253,232,0.85)",fontWeight:600}}>{carta.nome.toUpperCase()||"NOME COGNOME"}</div><div style={{fontFamily:"monospace",fontSize:"0.8rem",color:"rgba(255,253,232,0.85)"}}>{carta.scadenza||"MM/YY"}</div></div>
        </div>
        {[{l:"Numero carta",pl:"0000 0000 0000 0000",k:"numero",ch:e=>setCarta(c=>({...c,numero:fmtN(e.target.value)}))},
          {l:"Nome titolare",pl:"Mario Rossi",k:"nome",ch:e=>setCarta(c=>({...c,nome:e.target.value}))}].map(f=>(
          <div key={f.k} style={{marginBottom:"0.7rem"}}>
            <label style={{fontSize:"0.66rem",fontWeight:700,color:C.sea1,display:"block",marginBottom:"0.2rem",textTransform:"uppercase"}}>{f.l}</label>
            <input style={inp} type="text" placeholder={f.pl} value={carta[f.k]} onChange={f.ch}/>
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.7rem",marginBottom:"1rem"}}>
          <div>
            <label style={{fontSize:"0.66rem",fontWeight:700,color:C.sea1,display:"block",marginBottom:"0.2rem",textTransform:"uppercase"}}>Scadenza</label>
            <input style={inp} type="text" inputMode="numeric" placeholder="MM/YY" value={carta.scadenza} onChange={e=>setCarta(c=>({...c,scadenza:fmtS(e.target.value)}))}/>
          </div>
          <div>
            <label style={{fontSize:"0.66rem",fontWeight:700,color:C.sea1,display:"block",marginBottom:"0.2rem",textTransform:"uppercase"}}>CVV</label>
            <input style={inp} type="text" inputMode="numeric" placeholder="123" value={carta.cvv} onChange={e=>setCarta(c=>({...c,cvv:e.target.value.replace(/\D/g,"").slice(0,4)}))}/>
          </div>
        </div>
        {errC&&<div style={{background:"rgba(255,107,53,0.1)",border:"1px solid rgba(255,107,53,0.3)",borderRadius:10,padding:"0.6rem 0.9rem",fontSize:"0.8rem",color:C.coral,marginBottom:"0.8rem"}}>{errC}</div>}
        <div style={{background:"rgba(41,182,206,0.06)",border:"1px solid rgba(41,182,206,0.2)",borderRadius:12,padding:"0.8rem 1rem",marginBottom:"1rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:"0.85rem",color:C.muted}}>Totale</span>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:700,color:"#1A8A4A"}}>€{total}</span>
        </div>
        <button onClick={paga} style={{width:"100%",padding:"0.95rem",borderRadius:50,border:"none",background:"linear-gradient(135deg,"+C.coral+",#C04010)",color:"white",fontSize:"0.95rem",fontWeight:700,cursor:"pointer"}}>🔒 Paga €{total}</button>
        <button onClick={()=>setStep("condizioni")} style={{width:"100%",marginTop:"0.6rem",padding:"0.7rem",borderRadius:50,border:"1.5px solid rgba(41,182,206,0.2)",background:"transparent",color:C.muted,fontSize:"0.82rem",cursor:"pointer"}}>← Torna</button>
      </div>
    </div>
  );
  return (
    <div style={ov} onClick={onChiudi}>
      <div style={box} onClick={e=>e.stopPropagation()}>
        <div style={{width:40,height:4,background:"rgba(0,58,88,0.15)",borderRadius:10,margin:"0 auto 1.2rem"}}/>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:700,color:C.navy,marginBottom:"1rem"}}>📋 Riepilogo e Condizioni</div>
        <div style={{background:"rgba(41,182,206,0.06)",border:"1px solid rgba(41,182,206,0.2)",borderRadius:14,padding:"1rem",marginBottom:"1rem"}}>
          {[{l:"Posto",v:spot.id+(spot.vip?" 👑":"")},{l:"Date",v:dateStart+(dateEnd&&dateEnd!==dateStart?" → "+dateEnd:"")},{l:"Ora",v:ora,hl:true},{l:"Tipo",v:imp?"Con Imprevisti 🛡️":"Standard"},{l:"Totale",v:"€"+total,big:true}].map(r=>(
            <div key={r.l} style={{display:"flex",justifyContent:"space-between",fontSize:"0.82rem",padding:"0.28rem 0",borderBottom:"1px solid rgba(41,182,206,0.08)"}}>
              <span style={{color:C.muted}}>{r.l}</span>
              <span style={{fontWeight:r.big?800:600,color:r.hl?C.coral:r.big?"#1A8A4A":C.navy}}>{r.v}</span>
            </div>
          ))}
        </div>
        <div style={{background:"#FFF8EE",border:"1px solid rgba(244,196,48,0.3)",borderRadius:14,padding:"1rem",marginBottom:"1rem",fontSize:"0.78rem",color:"#5A4010",lineHeight:1.7}}>
          <div style={{fontWeight:700,marginBottom:"0.4rem"}}>📜 Regole</div>
          {["Cancellazione gratuita fino a 24h prima","Posto tenuto 2 ore dall'orario (Standard)","Pagamento immediato · QR code via email"].map((c,i)=>(
            <div key={i} style={{display:"flex",gap:6}}><span>✓</span><span>{c}</span></div>
          ))}
        </div>
        <label style={{display:"flex",alignItems:"flex-start",gap:"0.7rem",cursor:"pointer",marginBottom:"1.2rem",padding:"0.8rem",background:ok?"rgba(39,174,96,0.06)":"rgba(0,0,0,0.03)",borderRadius:12,border:"1.5px solid "+(ok?"rgba(39,174,96,0.3)":"rgba(0,0,0,0.1)")}}>
          <input type="checkbox" checked={ok} onChange={e=>setOk(e.target.checked)} style={{width:18,height:18,marginTop:2,accentColor:"#27AE60",cursor:"pointer",flexShrink:0}}/>
          <span style={{fontSize:"0.8rem",color:C.navy,lineHeight:1.5}}>Ho letto e accetto le condizioni.</span>
        </label>
        <button onClick={()=>ok&&setStep("carta")} style={{width:"100%",padding:"0.95rem",borderRadius:50,border:"none",background:ok?"linear-gradient(135deg,"+C.sea1+","+C.sea2+")":"rgba(0,0,0,0.1)",color:"white",fontSize:"0.95rem",fontWeight:700,cursor:ok?"pointer":"not-allowed"}}>Continua al pagamento →</button>
        <button onClick={onChiudi} style={{width:"100%",marginTop:"0.6rem",padding:"0.7rem",borderRadius:50,border:"1.5px solid rgba(41,182,206,0.2)",background:"transparent",color:C.muted,fontSize:"0.85rem",cursor:"pointer"}}>Annulla</button>
      </div>
    </div>
  );
}
