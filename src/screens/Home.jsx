import { useState } from "react";
import { C, css, brandPattern } from "../theme.js";
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
    <div style={{minHeight:"100vh",background:C.sabbia,fontFamily:"'Manrope',sans-serif"}}>
      <style>{css}</style>
      <nav style={{position:"sticky",top:0,zIndex:50,background:"rgba(245,242,236,0.95)",backdropFilter:"blur(14px)",borderBottom:"1px solid "+C.line,padding:"0.7rem 1.2rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Logo h={32}/>
        <button onClick={onGestore} style={{background:C.brandNavy,color:C.white,border:"none",borderRadius:10,padding:"0.5rem 1.1rem",fontSize:"0.8rem",fontWeight:700,cursor:"pointer"}}>Area Gestore</button>
      </nav>
      <div style={{textAlign:"center",padding:"clamp(2rem,5vw,3.5rem) 1.2rem 1.5rem",maxWidth:640,margin:"0 auto"}}>
        <div style={{animation:"float 4s ease-in-out infinite",display:"inline-block",marginBottom:"1rem"}}><Logo h={90}/></div>
        <h1 style={{fontFamily:"'Manrope',sans-serif",fontSize:"clamp(2rem,6vw,2.7rem)",fontWeight:800,color:C.ink,lineHeight:1.15,marginBottom:"0.6rem"}}>
          Prenota il tuo <span style={{color:C.brandNavy}}>ombrellone</span>
        </h1>
        <p style={{fontSize:"clamp(0.9rem,2.5vw,1rem)",color:C.inkMuted,lineHeight:1.7,marginBottom:"1.8rem"}}>
          Scegli il lido, vedi la mappa con le <strong style={{color:C.ink}}>ombre reali</strong> al tuo orario.
        </p>
        <div style={{background:C.white,borderRadius:16,boxShadow:"0 4px 20px rgba(28,28,28,0.06)",padding:"1.4rem",border:"1px solid "+C.line}}>
          <div style={{fontSize:"0.85rem",fontWeight:700,color:C.ink,marginBottom:"0.7rem",textAlign:"left"}}>Dove vuoi andare?</div>
          <div style={{display:"flex",gap:"0.6rem",marginBottom:"1rem"}}>
            <input type="text" placeholder="Cerca città o nome lido…" value={search}
              onChange={e=>{setSearch(e.target.value);setCittaSel("");}}
              onKeyDown={e=>e.key==="Enter"&&cerca()}
              style={{flex:1,padding:"0.85rem 1rem",borderRadius:10,fontSize:"0.95rem",border:"1.5px solid "+C.line,outline:"none",color:C.ink,background:C.white,fontFamily:"'Manrope',sans-serif"}}/>
            <button onClick={()=>cerca()} style={{background:C.brandNavy,color:C.white,border:"none",borderRadius:10,padding:"0 1.2rem",fontSize:"0.95rem",fontWeight:700,cursor:"pointer"}}>Cerca</button>
          </div>
          <div style={{fontSize:"0.75rem",fontWeight:700,color:C.inkMuted,marginBottom:"0.5rem",textAlign:"left"}}>Oppure scegli la zona:</div>
          <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
            {CITTA.map(c=>(
              <button key={c} onClick={()=>{setCittaSel(c===cittaSel?"":c);cerca(c===cittaSel?"":c);}}
                style={{padding:"0.4rem 0.9rem",borderRadius:8,border:"1.5px solid",cursor:"pointer",fontSize:"0.78rem",fontWeight:700,transition:"all .15s",
                  borderColor:cittaSel===c?C.brandNavy:C.line,
                  background:cittaSel===c?C.brandNavy:C.white,
                  color:cittaSel===c?C.white:C.ink}}>{c}</button>
            ))}
          </div>
        </div>
      </div>
      {searched?(
        <div style={{maxWidth:880,margin:"0 auto",padding:"0 1.2rem 4rem",animation:"fadeUp 0.35s ease both"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"}}>
            <div style={{fontSize:"1rem",fontWeight:700,color:C.ink}}>{results.length>0?results.length+" lidi trovati":"Nessun lido trovato"}</div>
            <button onClick={()=>{setSearched(false);setSearch("");setCittaSel("");}} style={{background:"transparent",border:"1px solid "+C.line,color:C.inkMuted,borderRadius:8,padding:"0.3rem 0.8rem",fontSize:"0.75rem",fontWeight:700,cursor:"pointer"}}>✕ Cancella</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,270px),1fr))",gap:"1.1rem"}}>
            {results.map(l=><CardLido key={l.id} l={l} onDettaglio={onDettaglio}/>)}
          </div>
        </div>
      ):(
        <div style={{maxWidth:860,margin:"0 auto",padding:"0.5rem 1.2rem 4rem"}}>
          <div style={{fontFamily:"'Manrope',sans-serif",fontSize:"1.3rem",fontWeight:800,color:C.ink,textAlign:"center",marginBottom:"1.2rem"}}>Come funziona — 3 passi</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,200px),1fr))",gap:"1rem",marginBottom:"2.2rem"}}>
            {[{n:"1",t:"Cerca il lido",d:"Scegli la destinazione sulla costa"},
              {n:"2",t:"Scegli il posto",d:"Mappa con ombre reali al tuo orario"},
              {n:"3",t:"Paga e vai",d:"Conferma online e ricevi il QR code"}].map(f=>(
              <div key={f.t} style={{background:C.white,borderRadius:14,padding:"1.3rem",border:"1px solid "+C.line,textAlign:"center"}}>
                <div style={{width:40,height:40,borderRadius:10,background:C.brandNavy,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 0.8rem"}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:"1.05rem",fontWeight:500,color:C.white}}>{f.n}</span>
                </div>
                <div style={{fontWeight:700,color:C.ink,fontSize:"0.95rem",marginBottom:"0.35rem"}}>{f.t}</div>
                <div style={{fontSize:"0.78rem",color:C.inkMuted,lineHeight:1.6}}>{f.d}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"0.7rem",marginBottom:"1rem"}}>
            <div style={{fontFamily:"'Manrope',sans-serif",fontSize:"1.2rem",fontWeight:800,color:C.ink}}>I migliori lidi del Gargano</div>
            <div style={{flex:1,height:5,backgroundImage:brandPattern,backgroundSize:"40px 40px",borderRadius:3}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,270px),1fr))",gap:"1.1rem"}}>
            {LIDI.filter(l=>l.stelle===5).slice(0,6).map(l=><CardLido key={l.id} l={l} onDettaglio={onDettaglio}/>)}
          </div>
        </div>
      )}
      <div style={{textAlign:"center",paddingBottom:"2rem"}}>
        <span style={{fontSize:"0.65rem",color:C.inkMuted,userSelect:"none"}}>© 2025 lettino</span>
      </div>
    </div>
  );
}
