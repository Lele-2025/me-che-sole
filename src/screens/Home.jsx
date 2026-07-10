import { useState } from "react";
import { C, css } from "../theme.js";
import { LIDI, CITTA } from "../data/lidi.js";
import { Logo } from "../components/Logo.jsx";
import { CardLido } from "../components/CardLido.jsx";

export function Home({onDettaglio,onGestore}) {
  const [search,setSearch]=useState("");
  const [cittaSel,setCittaSel]=useState("");
  const [results,setResults]=useState([]);
  const [searched,setSearched]=useState(false);
  const cerca=(cs)=>{
    const c=cs!==undefined?cs:cittaSel;
    setSearched(true);
    let f=LIDI;
    if(c) f=f.filter(l=>l.citta===c);
    else if(search.trim()){const q=search.trim().toLowerCase();f=f.filter(l=>l.citta.toLowerCase().includes(q)||l.nome.toLowerCase().includes(q)||l.regione.toLowerCase().includes(q));}
    setResults(f);
  };
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#FFFDE8 0%,#FFF6C0 55%,#EEF8F8 100%)",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{css}</style>
      <nav style={{position:"sticky",top:0,zIndex:50,background:"rgba(255,253,232,0.97)",backdropFilter:"blur(14px)",borderBottom:"2px solid rgba(41,182,206,0.15)",padding:"0.7rem 1.2rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Logo h={36}/>
        <button onClick={onGestore} style={{background:"linear-gradient(135deg,"+C.deep+","+C.navy+")",color:"white",border:"none",borderRadius:50,padding:"0.5rem 1.1rem",fontSize:"0.8rem",fontWeight:700,cursor:"pointer"}}>🔑 Gestore</button>
      </nav>
      <div style={{textAlign:"center",padding:"clamp(2rem,5vw,3.5rem) 1.2rem 1.5rem",maxWidth:640,margin:"0 auto"}}>
        <div style={{animation:"float 4s ease-in-out infinite",display:"inline-block",marginBottom:"0.8rem"}}><Logo h={110}/></div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,6vw,2.8rem)",fontWeight:700,color:C.navy,lineHeight:1.15,marginBottom:"0.6rem"}}>
          Prenota il tuo <span style={{color:"#1A8A4A"}}>ombrellone</span>
        </h1>
        <p style={{fontSize:"clamp(0.9rem,2.5vw,1rem)",color:C.muted,lineHeight:1.7,marginBottom:"1.8rem"}}>
          Scegli il lido, vedi la mappa con le <strong>ombre reali</strong> al tuo orario.
        </p>
        <div style={{background:"white",borderRadius:24,boxShadow:"0 8px 40px rgba(0,0,0,0.1)",padding:"1.4rem",border:"2px solid rgba(41,182,206,0.15)"}}>
          <div style={{fontSize:"0.85rem",fontWeight:800,color:C.navy,marginBottom:"0.7rem",textAlign:"left"}}>🔍 Dove vuoi andare?</div>
          <div style={{display:"flex",gap:"0.6rem",marginBottom:"1rem"}}>
            <input type="text" placeholder="Cerca citta' o nome lido..." value={search}
              onChange={e=>{setSearch(e.target.value);setCittaSel("");}}
              onKeyDown={e=>e.key==="Enter"&&cerca()}
              style={{flex:1,padding:"0.85rem 1rem",borderRadius:14,fontSize:"0.95rem",border:"2px solid rgba(41,182,206,0.25)",outline:"none",color:C.navy,background:"#FAFEFF"}}/>
            <button onClick={()=>cerca()} style={{background:"linear-gradient(135deg,"+C.sea1+","+C.sea2+")",color:"white",border:"none",borderRadius:14,padding:"0 1.2rem",fontSize:"1rem",fontWeight:800,cursor:"pointer"}}>Cerca</button>
          </div>
          <div style={{fontSize:"0.75rem",fontWeight:700,color:C.muted,marginBottom:"0.5rem",textAlign:"left"}}>📍 Oppure scegli la zona:</div>
          <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
            {CITTA.map(c=>(
              <button key={c} onClick={()=>{setCittaSel(c===cittaSel?"":c);cerca(c===cittaSel?"":c);}}
                style={{padding:"0.4rem 0.9rem",borderRadius:50,border:"2px solid",cursor:"pointer",fontSize:"0.78rem",fontWeight:700,transition:"all .15s",
                  borderColor:cittaSel===c?"#1A8A4A":"rgba(41,182,206,0.25)",
                  background:cittaSel===c?"#27AE60":"rgba(41,182,206,0.06)",
                  color:cittaSel===c?"white":C.sea2}}>{c}</button>
            ))}
          </div>
        </div>
      </div>
      {searched?(
        <div style={{maxWidth:880,margin:"0 auto",padding:"0 1.2rem 4rem",animation:"fadeUp 0.35s ease both"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"}}>
            <div style={{fontSize:"1rem",fontWeight:700,color:C.navy}}>{results.length>0?results.length+" lidi trovati 🌊":"Nessun lido trovato"}</div>
            <button onClick={()=>{setSearched(false);setSearch("");setCittaSel("");}} style={{background:"rgba(41,182,206,0.1)",border:"none",color:C.sea2,borderRadius:50,padding:"0.3rem 0.8rem",fontSize:"0.75rem",fontWeight:700,cursor:"pointer"}}>✕ Cancella</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,270px),1fr))",gap:"1.1rem"}}>
            {results.map(l=><CardLido key={l.id} l={l} onDettaglio={onDettaglio}/>)}
          </div>
        </div>
      ):(
        <div style={{maxWidth:860,margin:"0 auto",padding:"0.5rem 1.2rem 4rem"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:700,color:C.navy,textAlign:"center",marginBottom:"1.2rem"}}>Come funziona — 3 passi</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,200px),1fr))",gap:"1rem",marginBottom:"2rem"}}>
            {[{n:"1",ico:"🔍",t:"Cerca il lido",d:"Scegli la destinazione sulla costa"},
              {n:"2",ico:"☀️",t:"Scegli il posto",d:"Mappa con ombre reali al tuo orario"},
              {n:"3",ico:"✅",t:"Paga e vai!",d:"Conferma e ricevi il QR code"}].map(f=>(
              <div key={f.t} style={{background:"white",borderRadius:18,padding:"1.3rem",border:"2px solid rgba(41,182,206,0.12)",boxShadow:"0 3px 14px rgba(0,0,0,0.07)",textAlign:"center"}}>
                <div style={{width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg,"+C.sea1+","+C.sea2+")",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 0.7rem",boxShadow:"0 4px 12px rgba(41,182,206,0.35)"}}>
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",fontWeight:800,color:"white"}}>{f.n}</span>
                </div>
                <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>{f.ico}</div>
                <div style={{fontWeight:800,color:C.navy,fontSize:"0.95rem",marginBottom:"0.35rem"}}>{f.t}</div>
                <div style={{fontSize:"0.78rem",color:C.muted,lineHeight:1.6}}>{f.d}</div>
              </div>
            ))}
          </div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:700,color:C.navy,marginBottom:"1rem"}}>🌊 I migliori lidi del Gargano</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,270px),1fr))",gap:"1.1rem"}}>
            {LIDI.filter(l=>l.stelle===5).slice(0,6).map(l=><CardLido key={l.id} l={l} onDettaglio={onDettaglio}/>)}
          </div>
        </div>
      )}
      <div style={{textAlign:"center",paddingBottom:"2rem"}}>
        <span style={{fontSize:"0.6rem",color:"rgba(41,182,206,0.15)",userSelect:"none"}}>© 2025 Me che sole</span>
      </div>
    </div>
  );
}
