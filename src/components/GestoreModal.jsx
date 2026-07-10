import { useState } from "react";

// ─── GESTORE LOGIN ───────────────────────────────────────────────────
export function GestoreModal({onLogin,onClose,err,loading}) {
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const inp={width:"100%",padding:"0.75rem 1rem",borderRadius:10,border:"2px solid rgba(41,182,206,0.5)",fontSize:"0.95rem",outline:"none",marginBottom:"0.9rem",boxSizing:"border-box",background:"#001E30",color:"#FFFDE8",fontFamily:"'DM Sans',sans-serif"};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,58,88,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:"1rem",backdropFilter:"blur(4px)"}}>
      <div style={{background:"#002A40",borderRadius:20,padding:"2rem",width:"100%",maxWidth:380,border:"2px solid rgba(41,182,206,0.4)",boxShadow:"0 24px 60px rgba(0,0,0,0.5)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:700}}><span style={{color:"#68D8C8"}}>Accesso</span> <span style={{color:"#F4C430"}}>Gestore</span> 🔑</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(255,253,232,0.4)",fontSize:"1.1rem",cursor:"pointer"}}>✕</button>
        </div>
        <div style={{fontSize:"0.68rem",fontWeight:700,color:"#68D8C8",letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:"0.35rem"}}>Email</div>
        <input style={inp} type="email" placeholder="gestore@miolido.it" value={email} onChange={e=>setEmail(e.target.value)}/>
        <div style={{fontSize:"0.68rem",fontWeight:700,color:"#68D8C8",letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:"0.35rem"}}>Password</div>
        <input style={inp} type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!loading&&onLogin(email,pass)}/>
        {err&&<div style={{color:"#FF6B35",fontSize:"0.8rem",marginBottom:"0.8rem"}}>{err}</div>}
        <button onClick={()=>!loading&&onLogin(email,pass)} disabled={loading}
          style={{width:"100%",padding:"0.9rem",borderRadius:50,border:"none",background:loading?"rgba(255,255,255,0.1)":"linear-gradient(135deg,#29B6CE,#007FA0)",color:"white",fontSize:"0.95rem",fontWeight:700,cursor:loading?"not-allowed":"pointer",marginBottom:"0.7rem"}}>
          {loading?"Accesso in corso...":"Entra nel pannello"}
        </button>
        <div style={{fontSize:"0.62rem",color:"rgba(255,253,232,0.2)",textAlign:"center"}}>Demo: gestore@mare.it / admin</div>
      </div>
    </div>
  );
}
