import { useState, useEffect } from "react";
import { C, css } from "../theme.js";
import { Logo } from "./Logo.jsx";

export function Splash({onDone}) {
  const [pct,setPct]=useState(0);
  useEffect(()=>{
    let p=0;
    const iv=setInterval(()=>{p=Math.min(p+(p<70?2.5:p<90?1:0.4),100);setPct(p);},30);
    const t=setTimeout(()=>{clearInterval(iv);setPct(100);setTimeout(onDone,400);},2600);
    return ()=>{clearInterval(iv);clearTimeout(t);};
  },[]);
  return (
    <div style={{position:"fixed",inset:0,zIndex:999,background:"linear-gradient(160deg,#FFFDE8,#FFF6C0,#EEF8F8)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <style>{css}</style>
      <div style={{animation:"float 3s ease-in-out infinite",marginBottom:"1.5rem"}}><Logo h={160}/></div>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:C.sea2,fontWeight:600,letterSpacing:"0.08em",marginBottom:"0.3rem"}}>Il mare ti aspetta</div>
      <div style={{fontSize:"0.72rem",color:"rgba(0,127,160,0.5)",letterSpacing:"0.12em",textTransform:"uppercase"}}>Costa Garganica · Adriatico</div>
      <div style={{width:180,marginTop:"2.5rem"}}>
        <div style={{height:3,background:"rgba(41,182,206,0.15)",borderRadius:10,overflow:"hidden"}}>
          <div style={{height:"100%",background:"linear-gradient(90deg,"+C.sea1+","+C.aqua+")",width:pct+"%",transition:"width 0.06s linear"}}/>
        </div>
      </div>
    </div>
  );
}
