import { useState } from "react";

// ─── ADMIN MODAL ─────────────────────────────────────────────────────
export function AdminModal({onLogin,onClose,err}) {
  const [pass,setPass]=useState("");
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:"1rem"}}>
      <div style={{background:"#0A0F1E",borderRadius:20,padding:"2rem",width:"100%",maxWidth:340,border:"2px solid rgba(100,120,255,0.4)"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:700,color:"#E8EEFF",marginBottom:"1.5rem"}}>🔒 Accesso Admin</div>
        <input type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onLogin(pass)}
          style={{width:"100%",padding:"0.8rem 1rem",borderRadius:10,boxSizing:"border-box",border:"2px solid rgba(100,140,255,0.4)",background:"#050810",color:"#E8EEFF",fontSize:"1rem",outline:"none",marginBottom:"0.8rem"}}/>
        {err&&<div style={{color:"#FF6B35",fontSize:"0.8rem",marginBottom:"0.8rem"}}>{err}</div>}
        <button onClick={()=>onLogin(pass)} style={{width:"100%",padding:"0.9rem",borderRadius:50,border:"none",background:"linear-gradient(135deg,#6070FF,#4050CC)",color:"white",fontSize:"0.95rem",fontWeight:700,cursor:"pointer",marginBottom:"0.6rem"}}>Accedi</button>
        <button onClick={onClose} style={{width:"100%",padding:"0.7rem",borderRadius:50,border:"1px solid rgba(100,120,255,0.3)",background:"transparent",color:"rgba(200,210,255,0.5)",fontSize:"0.85rem",cursor:"pointer"}}>Annulla</button>
      </div>
    </div>
  );
}
