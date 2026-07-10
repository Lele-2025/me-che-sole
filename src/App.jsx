import { useState } from "react";
import { css } from "./theme.js";
import { generateSpots } from "./data/spots.js";
import { DEMO_USERS } from "./data/demoAuth.js";
import { Splash } from "./components/Splash.jsx";
import { Logo } from "./components/Logo.jsx";
import { GestoreModal } from "./components/GestoreModal.jsx";
import { AdminModal } from "./components/AdminModal.jsx";
import { ModalPagamento } from "./components/ModalPagamento.jsx";
import { Mappa } from "./components/Mappa.jsx";
import { Home } from "./screens/Home.jsx";
import { DettaglioLido } from "./screens/DettaglioLido.jsx";
import { WizardPrenotazione } from "./screens/WizardPrenotazione.jsx";
import { AdminPanel } from "./screens/AdminPanel.jsx";

// ─── APP PRINCIPALE ──────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen]=useState("splash");
  const [lidoSel,setLidoSel]=useState(null);
  const [lidoDettaglio,setLidoDettaglio]=useState(null);
  const [gestoreModal,setGestoreModal]=useState(false);
  const [adminModal,setAdminModal]=useState(false);
  const [adminTap,setAdminTap]=useState(0);
  const [adminErr,setAdminErr]=useState("");
  const [gestoreErr,setGestoreErr]=useState("");
  const [gestoreLoading,setGestoreLoading]=useState(false);
  const [spots]=useState(generateSpots);
  const [bookings,setBookings]=useState([
    {spotId:"P-A1",client:"Laura M.",date:"2025-07-14",arrivalTime:"08:45",price:32,tipo:"Con Imprevisti"},
    {spotId:"P-A3",client:"Marco R.",date:"2025-07-14",arrivalTime:"09:00",price:32,tipo:"Standard"},
    {spotId:"Q-B2",client:"Giulia T.",date:"2025-07-14",arrivalTime:"10:00",price:26,tipo:"Standard"},
    {spotId:"Q-A5",client:"Roberto F.",date:"2025-07-14",arrivalTime:"09:30",price:32,tipo:"Con Imprevisti"},
    {spotId:"R-C3",client:"Ospite",date:"2025-07-14",arrivalTime:"11:00",price:20,tipo:"Standard"},
    {spotId:"S-A2",client:"Elena C.",date:"2025-07-14",arrivalTime:"08:30",price:32,tipo:"Con Imprevisti"},
  ]);
  const [selected,setSelected]=useState(null);
  const [showPayment,setShowPayment]=useState(false);
  const [prenotazionePending,setPrenotazionePending]=useState(null);
  const [successMsg,setSuccessMsg]=useState("");

  const handleAdminTap=()=>{const n=adminTap+1;setAdminTap(n);if(n>=5){setAdminModal(true);setAdminTap(0);}setTimeout(()=>setAdminTap(0),3000);};
  const handleGestoreLogin=(email,pass)=>{
    setGestoreLoading(true);
    setTimeout(()=>{
      const u=DEMO_USERS[email.toLowerCase()];
      setGestoreLoading(false);
      if(!u||u.password!==pass){setGestoreErr("Credenziali non valide.");return;}
      setGestoreModal(false);setGestoreErr("");setScreen("gestore");
    },600);
  };
  const handleAdminLogin=(pass)=>{if(pass==="superadmin"){setAdminErr("");setAdminModal(false);setScreen("admin");}else setAdminErr("Password errata.");};
  const handleBook=(pren)=>{setPrenotazionePending(pren);setShowPayment(true);};
  const handleConferma=()=>{
    if(!prenotazionePending) return;
    const {spot,dateStart,dateEnd,ora,imp,total}=prenotazionePending;
    setBookings(b=>[...b,{spotId:spot.id,client:"Cliente",date:dateStart+(dateEnd&&dateEnd!==dateStart?" > "+dateEnd:""),arrivalTime:ora,price:total,tipo:imp?"Con Imprevisti":"Standard"}]);
    setSuccessMsg("Prenotato "+spot.id+" per il "+dateStart+" ore "+ora+"! QR code via email.");
    setSelected(null);setShowPayment(false);setPrenotazionePending(null);
    setTimeout(()=>setSuccessMsg(""),6000);
  };

  if(screen==="splash") return <Splash onDone={()=>setScreen("home")}/>;
  if(screen==="admin") return <AdminPanel onExit={()=>setScreen("home")}/>;
  if(screen==="dettaglio"&&lidoDettaglio) return <DettaglioLido lido={lidoDettaglio} onBack={()=>setScreen("home")} onPrenota={l=>{setLidoSel(l);setScreen("prenota");}}/>;
  if(screen==="prenota"&&lidoSel) return (
    <>
      <WizardPrenotazione lidoSel={lidoSel} spots={spots} bookings={bookings} onBack={()=>setScreen("dettaglio")} onBook={handleBook}/>
      {showPayment&&prenotazionePending&&<ModalPagamento prenotazione={prenotazionePending} onConferma={handleConferma} onChiudi={()=>{setShowPayment(false);setPrenotazionePending(null);}}/>}
    </>
  );

  // ── GESTORE PANEL ──────────────────────────────────────────────────
  if(screen==="gestore") return (
    <div style={{fontFamily:"'DM Sans',sans-serif",minHeight:"100vh",background:"linear-gradient(160deg,#FFFDE8,#FFF6C0,#EEF8F8)"}}>
      <style>{css}</style>
      {successMsg&&<div style={{position:"fixed",top:70,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#27AE60,#1A8A4A)",color:"white",borderRadius:50,padding:"0.7rem 1.4rem",fontSize:"0.85rem",fontWeight:700,zIndex:100,boxShadow:"0 4px 20px rgba(39,174,96,0.5)",maxWidth:"90vw",textAlign:"center"}}>{successMsg}</div>}
      <nav style={{background:"rgba(255,253,232,0.97)",backdropFilter:"blur(14px)",borderBottom:"1.5px solid rgba(41,182,206,0.2)",padding:"0.7rem clamp(0.8rem,4vw,2rem)",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
        <Logo h={36}/>
        <div style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>
          <span style={{fontSize:"0.7rem",color:"#007FA0",fontWeight:700,background:"rgba(41,182,206,0.1)",borderRadius:50,padding:"0.25rem 0.7rem"}}>🔑 Gestore</span>
          <button onClick={()=>setScreen("home")} style={{background:"rgba(255,107,53,0.1)",border:"1.5px solid rgba(255,107,53,0.3)",color:"#FF6B35",borderRadius:50,padding:"0.38rem 0.9rem",fontSize:"0.76rem",fontWeight:700,cursor:"pointer"}}>Esci</button>
        </div>
      </nav>
      <div style={{maxWidth:980,margin:"0 auto",padding:"1.5rem clamp(0.8rem,4vw,2rem) 4rem"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:700,color:"#003A58",marginBottom:"1rem"}}>Pannello gestore — Lido Azzurro</div>
        <Mappa spots={spots} selected={selected}
          onSelect={s=>{const bk=bookings.find(b=>b.spotId===s.id);if(!bk)setSelected(s);}}
          bookings={bookings} lidoNome="Lido Azzurro" isGestore={true}
          dateStr={new Date().toISOString().split("T")[0]} timeHours={10}/>
      </div>
    </div>
  );

  // ── HOME ──────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      {successMsg&&<div style={{position:"fixed",top:14,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#27AE60,#1A8A4A)",color:"white",borderRadius:50,padding:"0.7rem 1.4rem",fontSize:"0.85rem",fontWeight:700,zIndex:200,boxShadow:"0 4px 20px rgba(39,174,96,0.5)",maxWidth:"90vw",textAlign:"center",whiteSpace:"nowrap"}}>{successMsg}</div>}
      <Home onDettaglio={l=>{setLidoDettaglio(l);setScreen("dettaglio");}} onGestore={()=>setGestoreModal(true)} onAdminTap={handleAdminTap}/>
      {gestoreModal&&<GestoreModal onLogin={handleGestoreLogin} onClose={()=>{setGestoreModal(false);setGestoreErr("");}} err={gestoreErr} loading={gestoreLoading}/>}
      {adminModal&&<AdminModal onLogin={handleAdminLogin} onClose={()=>{setAdminModal(false);setAdminErr("");}} err={adminErr}/>}
    </>
  );
}
