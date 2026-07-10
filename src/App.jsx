import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signInAnonymously, signOut } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { auth, functions } from "./firebase.js";
import { css } from "./theme.js";
import { generateSpots } from "./data/spots.js";
import { Splash } from "./components/Splash.jsx";
import { Logo } from "./components/Logo.jsx";
import { StaffLoginModal } from "./components/StaffLoginModal.jsx";
import { Mappa } from "./components/Mappa.jsx";
import { Home } from "./screens/Home.jsx";
import { DettaglioLido } from "./screens/DettaglioLido.jsx";
import { WizardPrenotazione } from "./screens/WizardPrenotazione.jsx";
import { AdminPanel } from "./screens/AdminPanel.jsx";

const createCheckoutSession = httpsCallable(functions, "createCheckoutSession");

// ─── APP PRINCIPALE ──────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen]=useState("splash");
  const [lidoSel,setLidoSel]=useState(null);
  const [lidoDettaglio,setLidoDettaglio]=useState(null);
  const [staffModal,setStaffModal]=useState(false);
  const [staffErr,setStaffErr]=useState("");
  const [staffLoading,setStaffLoading]=useState(false);
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
  const [bookingLoading,setBookingLoading]=useState(false);
  const [bookingErr,setBookingErr]=useState("");
  const [successMsg,setSuccessMsg]=useState("");

  // Un cliente non ha (ancora) un account vero: lo autentichiamo in modo
  // anonimo così una prenotazione ha comunque un uid stabile a cui
  // agganciarsi (richiesto da createCheckoutSession e da firestore.rules),
  // senza imporre una schermata di registrazione che non esiste ancora.
  useEffect(()=>{
    if(!auth.currentUser) signInAnonymously(auth).catch(()=>{});
  },[]);

  // Ritorno da Stripe Checkout: l'app è una SPA senza router, quindi
  // success_url/cancel_url (vedi functions/checkout.js) puntano alla
  // root con dei query param invece che a pagine dedicate.
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const esito=params.get("esito");
    if(esito==="confermata"){
      setSuccessMsg("Pagamento ricevuto! La prenotazione è confermata, QR code via email.");
      setTimeout(()=>setSuccessMsg(""),6000);
    }else if(esito==="annullata"){
      setBookingErr("Pagamento annullato: il posto è stato rilasciato.");
    }
    if(esito){
      window.history.replaceState(null,"",window.location.pathname);
    }
  },[]);

  // Login staff (gestore o admin): il ruolo è deciso dai custom claim
  // sul token Firebase Auth, assegnati solo via scripts/setStaffClaim.mjs
  // o (in futuro) da una Cloud Function — mai hardcoded nel client.
  const handleStaffLogin=async(email,pass)=>{
    setStaffLoading(true);
    setStaffErr("");
    try{
      const cred=await signInWithEmailAndPassword(auth,email,pass);
      const token=await cred.user.getIdTokenResult();
      if(token.claims.admin){ setStaffModal(false); setScreen("admin"); }
      else if(token.claims.gestoreLidoId){ setStaffModal(false); setScreen("gestore"); }
      else{ setStaffErr("Il tuo account non ha permessi di gestione."); await signOut(auth); }
    }catch(e){
      setStaffErr("Credenziali non valide.");
    }finally{
      setStaffLoading(false);
    }
  };
  const handleStaffLogout=async()=>{
    await signOut(auth);
    await signInAnonymously(auth).catch(()=>{});
    setScreen("home");
  };

  // Crea la Checkout Session lato server e reindirizza a Stripe
  // (hosted, il numero di carta non passa mai dal nostro frontend) —
  // sostituisce il vecchio ModalPagamento che simulava un addebito.
  const handleBook=async(pren)=>{
    setBookingErr("");
    setBookingLoading(true);
    try{
      const {spot,dateStart,dateEnd,ora,imp,total}=pren;
      const res=await createCheckoutSession({
        lidoId:lidoSel.id, spotId:spot.id,
        dateStart, dateEnd, ora, imp,
        totalCents:Math.round(total*100),
      });
      window.location.href=res.data.url;
    }catch(e){
      setBookingErr(e.message==="internal"?"Errore imprevisto, riprova.":e.message||"Impossibile avviare il pagamento.");
      setBookingLoading(false);
    }
  };

  if(screen==="splash") return <Splash onDone={()=>setScreen("home")}/>;
  if(screen==="admin") return <AdminPanel onExit={handleStaffLogout}/>;
  if(screen==="dettaglio"&&lidoDettaglio) return <DettaglioLido lido={lidoDettaglio} onBack={()=>setScreen("home")} onPrenota={l=>{setLidoSel(l);setScreen("prenota");}}/>;
  if(screen==="prenota"&&lidoSel) return (
    <WizardPrenotazione lidoSel={lidoSel} spots={spots} bookings={bookings} onBack={()=>setScreen("dettaglio")}
      onBook={handleBook} bookingLoading={bookingLoading} bookingErr={bookingErr}/>
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
          <button onClick={handleStaffLogout} style={{background:"rgba(255,107,53,0.1)",border:"1.5px solid rgba(255,107,53,0.3)",color:"#FF6B35",borderRadius:50,padding:"0.38rem 0.9rem",fontSize:"0.76rem",fontWeight:700,cursor:"pointer"}}>Esci</button>
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
      {bookingErr&&<div style={{position:"fixed",top:14,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#FF6B35,#C04010)",color:"white",borderRadius:50,padding:"0.7rem 1.4rem",fontSize:"0.85rem",fontWeight:700,zIndex:200,boxShadow:"0 4px 20px rgba(255,107,53,0.5)",maxWidth:"90vw",textAlign:"center"}}>{bookingErr}</div>}
      <Home onDettaglio={l=>{setLidoDettaglio(l);setScreen("dettaglio");}} onGestore={()=>setStaffModal(true)}/>
      {staffModal&&<StaffLoginModal onLogin={handleStaffLogin} onClose={()=>{setStaffModal(false);setStaffErr("");}} err={staffErr} loading={staffLoading}/>}
    </>
  );
}
