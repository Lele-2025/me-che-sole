import { useState, useEffect, useRef, useMemo } from "react";

// ─── PALETTE ────────────────────────────────────────────────────────
const C = {
  sea1:"#29B6CE", sea2:"#007FA0", sun:"#F4C430",
  aqua:"#68D8C8", cream:"#FFFDE8", sand:"#FFF6C0",
  deep:"#005880", navy:"#003A58", coral:"#FF6B35",
  muted:"#6ABBC8", white:"#FFFFFF",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=DM+Sans:wght@400;600;700;800&display=swap');
@keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
@keyframes pulse   { 0%,100%{opacity:0.6} 50%{opacity:1} }
@keyframes spotRise{ from{opacity:0;transform:translateY(8px)scale(0.9)} to{opacity:1;transform:none} }
@keyframes slideProgress { from{width:0%} to{width:100%} }
@keyframes waveL   { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
@keyframes waveR   { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
@keyframes tideAnim{ 0%,100%{height:6px;opacity:0.35} 50%{height:18px;opacity:0.55} }
.card-hover{transition:transform .18s,box-shadow .18s;}
.card-hover:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(41,182,206,0.22);}
`;

// ─── DATI ───────────────────────────────────────────────────────────
const LIDI = [
  // ── VASTO / MARINA DI VASTO (CH) ──────────────────────────────
  {id:"va1",nome:"Lido Maremaje",          citta:"Marina di Vasto",    regione:"Abruzzo",        stelle:4,posti:50,prezzoMin:14,img:"🏖️",desc:"Familiare, zona ristoro con gazebo, vista adriatico",tel:"0873 801234"},
  {id:"va2",nome:"Lido Acapulco",          citta:"Marina di Vasto",    regione:"Abruzzo",        stelle:4,posti:45,prezzoMin:14,img:"🌊",desc:"Pizzeria e bar, pranzo vista mare, molto animato",tel:"0873 802345"},
  {id:"va3",nome:"Lido Sabbia d'Oro",      citta:"Marina di Vasto",    regione:"Abruzzo",        stelle:4,posti:48,prezzoMin:13,img:"✨",desc:"Bandiera Blu, spiaggia nella riserva naturale",tel:"0873 803456"},
  {id:"va4",nome:"Lido Zio Fiore",         citta:"Marina di Vasto",    regione:"Abruzzo",        stelle:3,posti:38,prezzoMin:12,img:"🌻",desc:"Staff alla mano, bar con aperitivo sul mare",tel:"0873 804567"},
  {id:"va5",nome:"Lido Caravel",           citta:"Marina di Vasto",    regione:"Abruzzo",        stelle:4,posti:42,prezzoMin:13,img:"⛵",desc:"Bandiera Blu, attività per bambini, resort annesso",tel:"0873 805678"},
  {id:"va6",nome:"Lido La Sirenella",      citta:"Marina di Vasto",    regione:"Abruzzo",        stelle:3,posti:35,prezzoMin:12,img:"🧜",desc:"Rilassante, confortevole, ristorazione locale",tel:"0873 806789"},
  // ── SAN SALVO MARINA (CH) ──────────────────────────────────────
  {id:"ss1",nome:"Baiocco Beach",          citta:"San Salvo Marina",   regione:"Abruzzo",        stelle:4,posti:55,prezzoMin:13,img:"🐠",desc:"Spiaggia ampia, acque calme, ideale famiglie",tel:"0873 547123"},
  {id:"ss2",nome:"Lido Il Delfino",        citta:"San Salvo Marina",   regione:"Abruzzo",        stelle:3,posti:40,prezzoMin:12,img:"🐬",desc:"Tranquillo e accogliente, ottimo rapporto qualita/prezzo",tel:"0873 547234"},
  // ── MARINA DI CHIEUTI / LESINA / VARANO (FG) ──────────────────
  {id:"ch1",nome:"Capojale Beach Park",    citta:"Marina di Lesina",   regione:"Puglia-Gargano", stelle:5,posti:70,prezzoMin:18,img:"🌴",desc:"Beach park sul lago di Lesina, sport acquatici, bungalow",tel:"0882 991234"},
  {id:"ch2",nome:"Laguna Beach Village",   citta:"Marina di Lesina",   regione:"Puglia-Gargano", stelle:5,posti:80,prezzoMin:20,img:"🏝️",desc:"Villaggio balneare completo, fronte laguna",tel:"0882 992345"},
  {id:"ch3",nome:"Lido Kursaal",           citta:"Marina di Lesina",   regione:"Puglia-Gargano", stelle:4,posti:45,prezzoMin:15,img:"🎠",desc:"Storico lido con area giochi, discoteca e pizzeria",tel:"0882 993456"},
  // ── RODI GARGANICO (FG) ───────────────────────────────────────
  {id:"ro1",nome:"Lido del Sole",          citta:"Rodi Garganico",     regione:"Puglia-Gargano", stelle:5,posti:50,prezzoMin:18,img:"🌅",desc:"Prima fila, arance del Gargano, tramonto mozzafiato",tel:"0884 965111"},
  {id:"ro2",nome:"Lido Nautilus",          citta:"Rodi Garganico",     regione:"Puglia-Gargano", stelle:4,posti:40,prezzoMin:16,img:"🐚",desc:"Kayak e SUP noleggio, bar ristorante, docce",tel:"0884 965222"},
  {id:"ro3",nome:"Lido Ponente",           citta:"Rodi Garganico",     regione:"Puglia-Gargano", stelle:4,posti:38,prezzoMin:15,img:"🌇",desc:"Esposizione ovest, tramonti romanticissimi",tel:"0884 965333"},
  {id:"ro4",nome:"Lido Levante",           citta:"Rodi Garganico",     regione:"Puglia-Gargano", stelle:4,posti:36,prezzoMin:15,img:"🌄",desc:"Alba sul mare, fondale basso, famiglie con bambini",tel:"0884 965444"},
  // ── SAN MENAIO / VICO DEL GARGANO (FG) ───────────────────────
  {id:"sm1",nome:"Spiaggia Cento Scalini", citta:"San Menaio",         regione:"Puglia-Gargano", stelle:5,posti:30,prezzoMin:22,img:"🪨",desc:"100 gradini nella pineta, acque turchesi, iconica",tel:"0884 968111"},
  {id:"sm2",nome:"Spiaggia di Calenelle",  citta:"San Menaio",         regione:"Puglia-Gargano", stelle:5,posti:35,prezzoMin:20,img:"🌿",desc:"Baia nascosta nella pineta, silenziosa ed esclusiva",tel:"0884 968222"},
  {id:"sm3",nome:"Lido Marina Piccola",    citta:"Vico del Gargano",   regione:"Puglia-Gargano", stelle:4,posti:40,prezzoMin:17,img:"⛵",desc:"Porticciolo con pescherecci, atmosfera autentica",tel:"0884 992111"},
  {id:"sm4",nome:"Lido Spiaggia Azzurra",  citta:"Vico del Gargano",   regione:"Puglia-Gargano", stelle:4,posti:40,prezzoMin:16,img:"💙",desc:"Acque azzurro intenso, bar panoramico sul mare",tel:"0884 992222"},
  // ── PESCHICI (FG) ─────────────────────────────────────────────
  {id:"pe1",nome:"Lido Jalillo",           citta:"Peschici",           regione:"Puglia-Gargano", stelle:5,posti:50,prezzoMin:22,img:"🏄",desc:"Top lido di Peschici, musica, cocktail bar, sport acquatici",tel:"0884 964111"},
  {id:"pe2",nome:"Lido San Nicola",        citta:"Peschici",           regione:"Puglia-Gargano", stelle:5,posti:45,prezzoMin:22,img:"⛪",desc:"Cala riparata, acque cristalline, fondale misto",tel:"0884 964222"},
  {id:"pe3",nome:"Lido Orchidea",          citta:"Peschici",           regione:"Puglia-Gargano", stelle:4,posti:40,prezzoMin:18,img:"🌸",desc:"Pineta ombreggiante, ideale coppie e famiglie",tel:"0884 964333"},
  {id:"pe4",nome:"Lido Manaccora",         citta:"Peschici",           regione:"Puglia-Gargano", stelle:5,posti:55,prezzoMin:25,img:"🌴",desc:"Baia di Manaccora, fondale sabbioso, ristorante pesce",tel:"0884 964444"},
  // ── VIESTE (FG) ── top destinazione ───────────────────────────
  {id:"vi1",nome:"Lido L'Approdo",         citta:"Vieste",             regione:"Puglia-Gargano", stelle:5,posti:80,prezzoMin:28,img:"🏰",desc:"Primo lido sul lungomare Pizzomunno, ai piedi del faraglione",tel:"0884 701001"},
  {id:"vi2",nome:"Pelikano Beach Club",    citta:"Vieste",             regione:"Puglia-Gargano", stelle:5,posti:70,prezzoMin:28,img:"🦩",desc:"Lungomare Mattei, ristorante gourmet, ombrelloni paglia",tel:"0884 701002"},
  {id:"vi3",nome:"Pirola Beach",           citta:"Vieste",             regione:"Puglia-Gargano", stelle:5,posti:65,prezzoMin:26,img:"🪸",desc:"DJ set, aperitivo al tramonto, VIP area attrezzata",tel:"0884 701003"},
  {id:"vi4",nome:"Lido Albatros",          citta:"Vieste",             regione:"Puglia-Gargano", stelle:4,posti:60,prezzoMin:22,img:"🦅",desc:"Spiaggia Pizzomunno, ombrelloni ampi, dog friendly",tel:"0884 701004"},
  {id:"vi5",nome:"Ghironda Beach",         citta:"Vieste",             regione:"Puglia-Gargano", stelle:4,posti:55,prezzoMin:20,img:"🌊",desc:"1 km dal centro, verde e pineta, parcheggio incluso",tel:"0884 701005"},
  {id:"vi6",nome:"Lido Tre Stelle",        citta:"Vieste",             regione:"Puglia-Gargano", stelle:4,posti:55,prezzoMin:19,img:"⭐",desc:"Bar ristorante, serate danzanti, verde e relax",tel:"0884 700941"},
  {id:"vi7",nome:"Lido Oasi",             citta:"Vieste",             regione:"Puglia-Gargano", stelle:4,posti:50,prezzoMin:18,img:"🌴",desc:"Lungomare Mattei, ombrelloni spaziosi, docce calde",tel:"0884 708974"},
  {id:"vi8",nome:"Lido Cristalda Beach",  citta:"Vieste",             regione:"Puglia-Gargano", stelle:5,posti:65,prezzoMin:24,img:"💎",desc:"Tra i piu' grandi di Vieste, noleggio sdraio, snorkeling",tel:"0884 701008"},
  {id:"vi9",nome:"Lido San Lorenzo",      citta:"Vieste",             regione:"Puglia-Gargano", stelle:4,posti:50,prezzoMin:20,img:"⛪",desc:"Lungomare nord, beach volley, beach soccer, ristorante",tel:"0884 701009"},
  {id:"vi10",nome:"Lido La Bussola",      citta:"Vieste",             regione:"Puglia-Gargano", stelle:5,posti:60,prezzoMin:25,img:"🧭",desc:"Grande ed elegante, migliori servizi del lungomare",tel:"0884 701010"},
  {id:"vi11",nome:"Lido Quasenada",       citta:"Vieste",             regione:"Puglia-Gargano", stelle:4,posti:45,prezzoMin:18,img:"🌅",desc:"Loc. Portonuovo, baia tranquilla, fondale digradante",tel:"340 521 1696"},
  {id:"vi12",nome:"Lido Vignanotica",     citta:"Vieste",             regione:"Puglia-Gargano", stelle:5,posti:40,prezzoMin:26,img:"🏞️",desc:"Baia incantevole del Gargano, kayak, cucina tipica",tel:"0884 701012"},
  {id:"vi13",nome:"Lido Afrodite",        citta:"Vieste",             regione:"Puglia-Gargano", stelle:4,posti:48,prezzoMin:20,img:"🏖️",desc:"Spiaggia Pizzomunno, moderni ombrelloni, service mare",tel:"0884 701013"},
  // ── MATTINATA (FG) ────────────────────────────────────────────
  {id:"ma1",nome:"Lido San Matteo",       citta:"Mattinata",          regione:"Puglia-Gargano", stelle:4,posti:45,prezzoMin:18,img:"🌊",desc:"Spiaggia bianca calcarea, acque smeraldo, parcheggio",tel:"0884 559111"},
  {id:"ma2",nome:"Lido Monte Saraceno",   citta:"Mattinata",          regione:"Puglia-Gargano", stelle:5,posti:50,prezzoMin:24,img:"🏔️",desc:"Vista promontorio, acque trasparenti, trekking vicino",tel:"0884 559222"},
  {id:"ma3",nome:"Lido Baia delle Zagare",citta:"Mattinata",          regione:"Puglia-Gargano", stelle:5,posti:60,prezzoMin:28,img:"🗿",desc:"Faraglioni iconici, acque smeraldo, barca dal lido",tel:"0884 559333"},
  {id:"ma4",nome:"Lido Cala dei Cefali",  citta:"Mattinata",          regione:"Puglia-Gargano", stelle:5,posti:38,prezzoMin:26,img:"🐟",desc:"Caletta esclusiva, snorkeling, pesci colorati",tel:"0884 559444"},
  // ── MANFREDONIA / SIPONTO / IPPOCAMPO (FG) ───────────────────
  {id:"mf1",nome:"Lido Aurora",           citta:"Manfredonia",        regione:"Puglia-Gargano", stelle:4,posti:50,prezzoMin:15,img:"🌅",desc:"Spiaggia sabbiosa, acque basse, famiglie con bimbi",tel:"0884 511111"},
  {id:"mf2",nome:"Lido La Pineta",        citta:"Manfredonia",        regione:"Puglia-Gargano", stelle:4,posti:45,prezzoMin:14,img:"🌲",desc:"Pineta ombreggiante, fresco naturale, prezzi onesti",tel:"0884 511222"},
  {id:"mf3",nome:"Lido Sabbia d'Oro Sip.",citta:"Siponto",            regione:"Puglia-Gargano", stelle:4,posti:50,prezzoMin:14,img:"🏅",desc:"Lunghissima spiaggia sabbiosa di Siponto",tel:"0884 511333"},
  {id:"mf4",nome:"Bagni Bonobo",          citta:"Siponto",            regione:"Puglia-Gargano", stelle:4,posti:42,prezzoMin:13,img:"🐒",desc:"Storico di Siponto, atmosfera allegra, musica live",tel:"0884 511444"},
  {id:"mf5",nome:"Lido Nettuno",          citta:"Manfredonia",        regione:"Puglia-Gargano", stelle:4,posti:45,prezzoMin:14,img:"🔱",desc:"Vicino al porto, ottima cucina di pesce fresco",tel:"0884 511555"},
  {id:"mf6",nome:"Lido Ippocampo",        citta:"Ippocampo",          regione:"Puglia-Gargano", stelle:5,posti:55,prezzoMin:18,img:"🦄",desc:"Esclusivo, sabbia fine, acqua limpida",tel:"0884 511666"},
  {id:"mf7",nome:"Lido Blu Marine",       citta:"Manfredonia",        regione:"Puglia-Gargano", stelle:4,posti:45,prezzoMin:15,img:"🫧",desc:"Design moderno, lounge, aperitivi al tramonto",tel:"0884 511777"},
];

const CITTA = [...new Set(LIDI.map(l=>l.citta))].sort();
const SETTORI = ["P","Q","R","S"];
const FILE_ROWS = ["A","B","C","D","E"];
const COLS = 6;
const prezzoFila = {A:32,B:26,C:20,D:17,E:14};

function generateSpots() {
  const spots = [];
  SETTORI.forEach(settore=>{
    FILE_ROWS.forEach(row=>{
      for(let col=1;col<=COLS;col++){
        spots.push({id:settore+"-"+row+col, settore, row, col,
          status:"free", vip:row==="A"||row==="B", price:prezzoFila[row]||14});
      }
    });
  });
  return spots;
}

// ─── DEMO AUTH ──────────────────────────────────────────────────────
const DEMO_USERS = {"gestore@mare.it":{password:"admin",name:"Marco Pellegrini"}};

// ─── CALCOLO SOLARE — Gargano lat:41.7 lon:15.9 ────────────────────
function getSunPos(dateStr, timeH) {
  if(!dateStr||timeH==null) return {alt:45,az:200,isDay:true,desc:"",shAz:20};
  const d=new Date(dateStr+"T12:00:00");
  const yr=d.getFullYear(),mo=d.getMonth()+1,dy=d.getDate();
  const dn=Math.floor(275*mo/9)-Math.floor((mo+9)/12)*(1+Math.floor((yr-4*Math.floor(yr/4)+2)/3))+dy-30;
  const decl=-23.45*Math.cos(2*Math.PI*(dn+10)/365);
  const b=2*Math.PI*(dn-81)/364;
  const eot=9.87*Math.sin(2*b)-7.53*Math.cos(b)-1.5*Math.sin(b);
  const tz=(mo>=3&&mo<=10)?2:1;
  const lst=timeH-tz+15.9/15+eot/60;
  const H=15*(lst-12);
  const latR=41.7*Math.PI/180,decR=decl*Math.PI/180,HR=H*Math.PI/180;
  const sinA=Math.sin(latR)*Math.sin(decR)+Math.cos(latR)*Math.cos(decR)*Math.cos(HR);
  const alt=Math.asin(Math.max(-1,Math.min(1,sinA)))*180/Math.PI;
  const cosZ=(Math.sin(decR)-Math.sin(latR)*sinA)/(Math.cos(latR)*Math.cos(Math.max(alt,0.1)*Math.PI/180));
  let az=Math.acos(Math.max(-1,Math.min(1,cosZ)))*180/Math.PI;
  if(lst>12) az=360-az;
  const shAz=(az+180)%360;
  const dir=a=>["N","NE","E","SE","S","SO","O","NO","N"][Math.round(((a%360)+360)%360/45)];
  const desc=alt<=0?"Notte — nessuna ombra":alt<12?`Sole basso a ${dir(az)} — ombra lunghissima verso ${dir(shAz)}`:alt<35?`Sole a ${dir(az)} — ombra lunga verso ${dir(shAz)}`:alt<60?`Sole a ${dir(az)} — ombra media verso ${dir(shAz)}`:`Sole quasi verticale — ombra corta sotto l'ombrellone`;
  return {alt,az,isDay:alt>0,desc,shAz};
}

// ─── LOGO ───────────────────────────────────────────────────────────
function Logo({h=40}) {
  return (
    <svg height={h} viewBox="0 0 200 170" fill="none">
      <ellipse cx="112" cy="55" rx="50" ry="46" fill="#F4C430" opacity="0.3"/>
      <ellipse cx="112" cy="55" rx="30" ry="28" fill="#F4C430" opacity="0.4"/>
      <path d="M72,70 Q112,40 152,70" stroke="#3D2B1A" strokeWidth="3" fill="none"/>
      <path d="M72,70 Q112,52 152,70 Q112,80 72,70Z" fill="#D4A84B" opacity="0.7"/>
      {[77,92,107,122,137,148].map((x,i)=><path key={i} d={"M"+x+",70 Q"+(x+5)+",78 "+(x+10)+",70"} stroke="#3D2B1A" strokeWidth="1.5" fill="none"/>)}
      <line x1="112" y1="70" x2="112" y2="118" stroke="#3D2B1A" strokeWidth="3"/>
      <rect x="54" y="88" width="30" height="18" rx="3" fill="#D4A84B" stroke="#3D2B1A" strokeWidth="2"/>
      <rect x="54" y="88" width="10" height="18" rx="2" fill="#C49030" stroke="#3D2B1A" strokeWidth="1.5"/>
      <line x1="58" y1="106" x2="52" y2="120" stroke="#3D2B1A" strokeWidth="2"/>
      <line x1="78" y1="106" x2="82" y2="120" stroke="#3D2B1A" strokeWidth="2"/>
      <text x="28" y="148" fontFamily="Georgia,serif" fontSize="21" fill="#4A3520" fontStyle="italic">Me che sole !</text>
    </svg>
  );
}

// ─── SPLASH ─────────────────────────────────────────────────────────
function Splash({onDone}) {
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

// ─── COMPASS SOLARE ─────────────────────────────────────────────────
function SunCompass({alt,az,size=80}) {
  const cx=size/2,cy=size/2,r=size/2-10;
  const azR=(az||0)*Math.PI/180;
  const sx=cx+(r-4)*Math.sin(azR),sy=cy-(r-4)*Math.cos(azR);
  const shAzR=((az+180)%360)*Math.PI/180;
  const shx=cx+(r-7)*Math.sin(shAzR),shy=cy-(r-7)*Math.cos(shAzR);
  const isDay=alt>0;
  const sunCol=alt<15?"#F4A030":alt<40?"#F4D030":"#FFEE70";
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
      <svg width={size} height={size}>
        <defs>
          <filter id="sg"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <circle cx={cx} cy={cy} r={r+2} fill="rgba(0,30,60,0.85)" stroke="rgba(41,182,206,0.4)" strokeWidth="1.5"/>
        {[{l:"N",x:cx,y:10},{l:"S",x:cx,y:size-6},{l:"E",x:size-7,y:cy+4},{l:"O",x:6,y:cy+4}].map(p=>(
          <text key={p.l} x={p.x} y={p.y} textAnchor="middle" fontSize="7" fill="rgba(104,216,200,0.75)" fontWeight="800" fontFamily="monospace">{p.l}</text>
        ))}
        {isDay&&<line x1={cx} y1={cy} x2={shx} y2={shy} stroke="rgba(160,100,30,0.85)" strokeWidth="2.5" strokeDasharray="4,2.5" strokeLinecap="round"/>}
        {isDay&&<circle cx={sx} cy={sy} r={7} fill={sunCol} filter="url(#sg)"/>}
        {!isDay&&<circle cx={cx} cy={cy} r={7} fill="rgba(80,90,150,0.5)"/>}
      </svg>
      <div style={{fontSize:"0.5rem",color:"rgba(255,255,255,0.55)",textAlign:"center"}}>{isDay?Math.round(alt)+"°":"Notte"}</div>
    </div>
  );
}

// ─── OMBRELLONE CON OMBRA REALE ─────────────────────────────────────
function OmbrelloneReal({spot,bookings,selected,onSelect,isGestore,onGestoreClick,sunAlt,sunAz,delay=0}) {
  const [hov,setHov]=useState(false);
  const booked=bookings.find(b=>b.spotId===spot.id);
  const occ=!!booked||spot.status==="occupied"||spot.status==="reserved";
  const sel=selected?.id===spot.id;
  const cTop=occ?"#BDC3C7":sel?"#FF6B35":"#2ECC71";
  const cBot=occ?"#95A5A6":sel?"#CC4000":"#1A8A4A";

  const shd=useMemo(()=>{
    if(sunAlt<=1.5||occ) return null;
    const altR=sunAlt*Math.PI/180;
    const pxm=15,pH=2.3,cR=1.4;
    const sLen=Math.min(pH/Math.tan(altR),7)*pxm;
    const sAz=(sunAz+180)%360,sAzR=sAz*Math.PI/180;
    const sdx=Math.sin(sAzR),sdy=-Math.cos(sAzR);
    const cx=34+sdx*sLen,cy=42+sdy*sLen;
    const perpR=cR*pxm;
    const parR=Math.min(cR/Math.sin(Math.max(altR,0.035))*pxm,160);
    const angle=Math.atan2(sdy,sdx)*180/Math.PI;
    const op=Math.max(0.06,Math.min(0.52,0.68*(1-sunAlt/90)));
    const warm=Math.max(0,1-sunAlt/70);
    const shColor=`rgba(${Math.round(30+warm*25)},${Math.round(18+warm*8)},5,${op})`;
    return {cx,cy,perpR,parR,angle,op,sdx,sdy,sLen,shColor};
  },[sunAlt,sunAz,occ]);

  const warm=sunAlt>0?Math.max(0,1-sunAlt/65):0;
  const lightFill=sunAlt>0&&warm>0.03?`rgba(255,${Math.round(200-warm*35)},${Math.round(80-warm*60)},${(warm*0.2).toFixed(2)})`:null;
  const uid=spot.id.replace(/[^a-z0-9]/gi,"_");

  return (
    <div
      onClick={()=>{if(occ&&isGestore){onGestoreClick?.(spot,booked);return;}if(!occ)onSelect(spot);}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      title={occ?"Occupato":spot.id+" | €"+spot.price+"/g"+(spot.vip?" VIP":"")}
      style={{width:68,height:88,cursor:occ?(isGestore?"pointer":"default"):"pointer",
        animation:`spotRise 0.18s ease ${delay}s both`,transition:"transform 0.12s",
        transform:sel?"scale(1.18)":hov&&!occ?"scale(1.07)":"scale(1)",
        filter:sel?"drop-shadow(0 0 8px rgba(255,107,53,0.7))":"none"}}>
      <svg width="68" height="88" viewBox="0 0 68 88" style={{overflow:"visible",display:"block"}}>
        <defs>
          <radialGradient id={"cg"+uid} cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor={cTop}/>
            <stop offset="100%" stopColor={cBot}/>
          </radialGradient>
          <filter id={"sf"+uid} x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="4"/></filter>
          <filter id={"sl"+uid} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2.5"/></filter>
        </defs>
        {shd&&<>
          <line x1="34" y1="42" x2={(34+shd.sdx*shd.sLen*0.55).toFixed(1)} y2={(42+shd.sdy*shd.sLen*0.55).toFixed(1)}
            stroke={shd.shColor} strokeWidth="5" strokeLinecap="round" filter={`url(#sl${uid})`}/>
          <ellipse cx={shd.cx.toFixed(1)} cy={shd.cy.toFixed(1)} rx={shd.parR.toFixed(1)} ry={shd.perpR.toFixed(1)}
            fill={shd.shColor} transform={`rotate(${shd.angle.toFixed(1)},${shd.cx.toFixed(1)},${shd.cy.toFixed(1)})`}
            filter={`url(#sf${uid})`}/>
          {[{bx:11,by:58},{bx:43,by:58}].map((b,i)=>(
            <ellipse key={i} cx={(b.bx+shd.sdx*7).toFixed(1)} cy={(b.by+shd.sdy*7).toFixed(1)} rx="14" ry="5"
              fill={shd.shColor} transform={`rotate(${shd.angle.toFixed(1)},${(b.bx+shd.sdx*7).toFixed(1)},${(b.by+shd.sdy*7).toFixed(1)})`}
              filter={`url(#sl${uid})`}/>
          ))}
        </>}
        <rect x="7" y="55" width="22" height="9" rx="3.5" fill={occ?"#CDD0D5":sel?"rgba(255,107,53,0.28)":"rgba(255,255,255,0.22)"} stroke={cBot} strokeWidth="1.5"/>
        {!occ&&<rect x="7" y="55" width="7" height="9" rx="3" fill={cBot} opacity="0.45"/>}
        <rect x="39" y="55" width="22" height="9" rx="3.5" fill={occ?"#CDD0D5":sel?"rgba(255,107,53,0.28)":"rgba(255,255,255,0.22)"} stroke={cBot} strokeWidth="1.5"/>
        {!occ&&<rect x="53" y="55" width="7" height="9" rx="3" fill={cBot} opacity="0.45"/>}
        <rect x="32" y="24" width="4" height="34" rx="2" fill={occ?"#9A9EA5":sel?"#AA2000":"#156635"}/>
        <ellipse cx="34" cy="20" rx="26" ry="18" fill={`url(#cg${uid})`} opacity={occ?0.42:0.93}/>
        {!occ&&[0,45,90,135,180,225,270,315].map((a,i)=>{
          const r=a*Math.PI/180;
          return <line key={i} x1="34" y1="20" x2={(34+25*Math.sin(r)).toFixed(1)} y2={(20+17*Math.cos(r)).toFixed(1)} stroke="rgba(255,255,255,0.2)" strokeWidth="0.7"/>;
        })}
        <ellipse cx="34" cy="20" rx="26" ry="18" fill="none" stroke={cBot} strokeWidth="1.5" opacity="0.8"/>
        {!occ&&[0,40,80,120,160,200,240,280,320].map((a,i)=>{
          const toP=(angle,rx,ry)=>({x:(34+rx*Math.sin(angle*Math.PI/180)).toFixed(1),y:(20+ry*Math.cos(angle*Math.PI/180)).toFixed(1)});
          const a1=toP(a-10,25,17),a2=toP(a+10,25,17),m=toP(a,32,23);
          return <path key={i} d={`M${a1.x},${a1.y} Q${m.x},${m.y} ${a2.x},${a2.y}`} fill={sel?"#FF7040":cTop} opacity="0.78"/>;
        })}
        {lightFill&&!occ&&<ellipse cx="34" cy="20" rx="26" ry="18" fill={lightFill}/>}
        {occ&&<><line x1="26" y1="12" x2="42" y2="28" stroke="rgba(100,100,100,0.55)" strokeWidth="2"/><line x1="42" y1="12" x2="26" y2="28" stroke="rgba(100,100,100,0.55)" strokeWidth="2"/></>}
        {spot.vip&&!occ&&<text x="34" y="22" textAnchor="middle" fontSize="9" fill="rgba(255,230,80,0.85)">♛</text>}
        <text x="34" y="78" textAnchor="middle" fontSize="7.5" fontWeight="800" fill={occ?"#888":sel?"#CC4000":"#1A5A30"} fontFamily="monospace">{spot.settore}{spot.row}{spot.col}</text>
      </svg>
    </div>
  );
}

// ─── MAPPA CON OMBRE SOLARI ──────────────────────────────────────────
function Mappa({spots,selected,onSelect,bookings,lidoNome,isGestore,onGestoreClick,dateStr,timeHours}) {
  const [previewT,setPreviewT]=useState(timeHours!=null?timeHours:10);
  useEffect(()=>{if(timeHours!=null)setPreviewT(timeHours);},[timeHours]);

  const sun=useMemo(()=>getSunPos(dateStr||new Date().toISOString().split("T")[0],previewT),[dateStr,previewT]);
  const free=spots.filter(s=>!bookings.find(b=>b.spotId===s.id)&&s.status==="free").length;
  const occ=spots.length-free;
  const colFila={A:"#0066AA",B:"#1E96B0",C:"#1A8A4A",D:"#7CB342",E:"#F9A825"};

  const h=Math.floor(previewT),m=Math.round((previewT%1)*60);
  const tLabel=String(h).padStart(2,"0")+":"+String(m).padStart(2,"0");
  const sunBg=sun.alt<=0?"rgba(20,20,50,0.95)":sun.alt<20?"linear-gradient(135deg,rgba(200,100,20,0.9),rgba(220,140,30,0.9))":"linear-gradient(135deg,rgba(30,80,160,0.85),rgba(50,120,200,0.85))";
  const sunIco=sun.alt<=0?"🌙":sun.alt<20?"🌅":sun.alt<50?"⛅":"☀️";

  return (
    <div style={{borderRadius:20,overflow:"hidden",boxShadow:"0 8px 36px rgba(0,0,0,0.16)",border:"2px solid rgba(41,182,206,0.2)",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{css}</style>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#002840,#003A58,#005880)",padding:"0.85rem 1.1rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.6rem"}}>
        <div style={{flex:1,minWidth:140}}>
          <div style={{fontSize:"0.56rem",color:"rgba(104,216,200,0.7)",fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:"0.1rem"}}>Mappa · ombra in tempo reale</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",color:"white",fontWeight:700}}>{lidoNome||"Lido"}</div>
        </div>
        <div style={{display:"flex",gap:"0.8rem",alignItems:"center"}}>
          <SunCompass alt={sun.alt} az={sun.az} size={80}/>
          <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
            <div style={{background:"rgba(39,174,96,0.15)",borderRadius:10,padding:"0.3rem 0.6rem",textAlign:"center"}}>
              <div style={{fontSize:"1rem",fontWeight:800,color:"#2ECC71",lineHeight:1}}>{free}</div>
              <div style={{fontSize:"0.5rem",color:"rgba(255,255,255,0.5)",textTransform:"uppercase"}}>Liberi</div>
            </div>
            <div style={{background:"rgba(255,107,107,0.12)",borderRadius:10,padding:"0.3rem 0.6rem",textAlign:"center"}}>
              <div style={{fontSize:"1rem",fontWeight:800,color:"#FF6B6B",lineHeight:1}}>{occ}</div>
              <div style={{fontSize:"0.5rem",color:"rgba(255,255,255,0.5)",textTransform:"uppercase"}}>Occupati</div>
            </div>
          </div>
        </div>
      </div>
      {/* Info ombra */}
      <div style={{background:sunBg,padding:"0.65rem 1rem",display:"flex",alignItems:"center",gap:"0.7rem"}}>
        <span style={{fontSize:"1.2rem"}}>{sunIco}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.9)",fontWeight:700,lineHeight:1.3}}>{tLabel} — {sun.desc}</div>
          {sun.isDay&&<div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.55)",marginTop:"0.15rem"}}>💡 Mattina=ombra a Ovest · Pomeriggio=ombra a Est</div>}
        </div>
      </div>
      {/* Slider */}
      <div style={{background:"rgba(0,0,0,0.22)",padding:"0.5rem 1rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.6rem"}}>
          <span style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.5)",fontWeight:700,flexShrink:0}}>🕐 Ombra alle:</span>
          <input type="range" min="5.5" max="21" step="0.25" value={previewT}
            onChange={e=>setPreviewT(parseFloat(e.target.value))}
            style={{flex:1,accentColor:"#F4C430",cursor:"pointer"}}/>
          <span style={{fontSize:"0.78rem",color:"#F4C430",fontWeight:800,minWidth:38,textAlign:"right"}}>{tLabel}</span>
        </div>
        {timeHours!=null&&Math.abs(previewT-timeHours)>0.2&&(
          <div style={{display:"flex",justifyContent:"flex-end",marginTop:"0.2rem"}}>
            <button onClick={()=>setPreviewT(timeHours)} style={{background:"rgba(244,196,48,0.18)",border:"1px solid rgba(244,196,48,0.4)",color:"#F4C430",borderRadius:50,padding:"1px 8px",fontSize:"0.58rem",fontWeight:700,cursor:"pointer"}}>
              Torna orario prenotazione ({String(Math.floor(timeHours)).padStart(2,"0")}:{String(Math.round((timeHours%1)*60)).padStart(2,"0")})
            </button>
          </div>
        )}
      </div>
      {/* Barra occupazione */}
      <div style={{height:5,background:"rgba(0,0,0,0.15)"}}>
        <div style={{height:"100%",width:Math.round(occ/spots.length*100)+"%",background:"linear-gradient(90deg,#2ECC71,#FF6B35)",transition:"width 0.4s ease"}}/>
      </div>
      {/* Mare — onde in CSS puro, zero JS re-render */}
      <div style={{position:"relative",height:64,background:"linear-gradient(180deg,#003060,#0066AA,#1E96B0)",overflow:"hidden"}}>
        <svg style={{position:"absolute",bottom:0,left:0,width:"200%",height:"55%",animation:"waveL 7s linear infinite"}} viewBox="0 0 1200 36" preserveAspectRatio="none">
          <path d="M0,11 C200,2 400,22 600,11 S1000,2 1200,11 L1200,36 L0,36Z" fill="rgba(41,182,206,0.92)"/>
        </svg>
        <svg style={{position:"absolute",bottom:0,left:0,width:"200%",height:"35%",animation:"waveR 5s linear infinite",opacity:0.65}} viewBox="0 0 1200 22" preserveAspectRatio="none">
          <path d="M0,7 C200,1 400,14 600,7 S1000,1 1200,7 L1200,22 L0,22Z" fill="rgba(104,216,200,0.75)"/>
        </svg>
        <div style={{position:"absolute",bottom:7,width:"100%",textAlign:"center",color:"rgba(255,255,255,0.4)",fontSize:"0.5rem",fontWeight:800,letterSpacing:"0.3em",textTransform:"uppercase"}}>⬆ MARE</div>
      </div>
      {/* Bagnasciuga — animazione marea CSS */}
      <div style={{animation:"tideAnim 4s ease-in-out infinite",background:"rgba(41,182,206,0.4)"}}/>
      {/* Griglia ombrelloni */}
      <div style={{background:"linear-gradient(180deg,#F2D890,#E8C868 55%,#DDB850)",overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
        <div style={{minWidth:"max-content",padding:"0.5rem 0.7rem 0.8rem"}}>
          {/* Etichette settori */}
          <div style={{display:"flex",marginBottom:5,paddingLeft:32}}>
            {SETTORI.map((s,si)=>(
              <div key={s} style={{display:"flex",alignItems:"center"}}>
                <div style={{width:COLS*71,textAlign:"center",fontSize:"0.58rem",fontWeight:800,color:"rgba(80,50,5,0.5)",letterSpacing:"0.1em",textTransform:"uppercase",borderBottom:"2px dashed rgba(80,50,5,0.12)",paddingBottom:3}}>Settore {s}</div>
                {si<SETTORI.length-1&&<div style={{width:18}}/>}
              </div>
            ))}
          </div>
          {/* File */}
          {FILE_ROWS.map((row,rIdx)=>(
            <div key={row}>
              {(row==="C"||row==="E")&&(
                <div style={{display:"flex",marginBottom:3}}>
                  <div style={{width:32,flexShrink:0}}/>
                  <div style={{flex:1,height:14,background:"repeating-linear-gradient(90deg,#C8A058 0,#C8A058 14px,#A88038 14px,#A88038 28px)",borderRadius:4,border:"1px solid rgba(100,70,20,0.18)"}}/>
                </div>
              )}
              <div style={{display:"flex",alignItems:"center",marginBottom:3}}>
                <div style={{width:32,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                  <div style={{width:24,height:24,borderRadius:7,background:colFila[row],display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.68rem",fontWeight:900,color:"white",boxShadow:"0 2px 6px rgba(0,0,0,0.22)"}}>{row}</div>
                  {(row==="A"||row==="B")&&<div style={{fontSize:"0.36rem",color:"#B8860B",fontWeight:900}}>VIP</div>}
                </div>
                {SETTORI.map((settore,si)=>{
                  const rowSpots=spots.filter(s=>s.settore===settore&&s.row===row).sort((a,b)=>a.col-b.col);
                  return (
                    <div key={settore} style={{display:"flex",alignItems:"center"}}>
                      <div style={{display:"flex",gap:3}}>
                        {rowSpots.map((spot,ci)=>(
                          <OmbrelloneReal key={spot.id} spot={spot} bookings={bookings}
                            selected={selected} onSelect={onSelect}
                            isGestore={isGestore} onGestoreClick={onGestoreClick}
                            sunAlt={sun.alt} sunAz={sun.az} delay={(rIdx*6+ci)*0.012}/>
                        ))}
                      </div>
                      {si<SETTORI.length-1&&(
                        <div style={{width:18,height:88,flexShrink:0,background:"repeating-linear-gradient(180deg,#C8A058 0,#C8A058 10px,#A88038 10px,#A88038 20px)",borderLeft:"1px solid rgba(100,70,20,0.18)",borderRight:"1px solid rgba(100,70,20,0.18)"}}/>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {/* Stabilimento */}
          <div style={{height:40,marginTop:12,background:"linear-gradient(90deg,#9A7240,#7A5220,#9A7240)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"space-around",fontSize:"0.65rem",fontWeight:700,color:"rgba(255,230,170,0.88)"}}>
            <span>🚿 Docce</span><span>☕ Bar</span><span>👙 Spogliatoi</span><span>🏥 Pronto Soccorso</span>
          </div>
        </div>
        {/* Legenda */}
        <div style={{display:"flex",gap:"0.7rem",flexWrap:"wrap",alignItems:"center",padding:"0.5rem 0.7rem 0.8rem",borderTop:"1px solid rgba(139,96,32,0.15)"}}>
          {[{c:"#2ECC71",b:"#1A8A4A",l:"Libero"},{c:"#BDC3C7",b:"#95A5A6",l:"Occupato"},{c:"#FF6B35",b:"#CC4000",l:"Selezionato"}].map(c=>(
            <div key={c.l} style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:14,height:14,borderRadius:4,background:c.c,border:"2px solid "+c.b}}/>
              <span style={{fontSize:"0.68rem",color:"#555",fontWeight:500}}>{c.l}</span>
            </div>
          ))}
          <span style={{fontSize:"0.62rem",color:"#888",marginLeft:"auto",fontStyle:"italic"}}>☁️ Ombre calcolate per orario selezionato</span>
        </div>
      </div>
    </div>
  );
}
function Home({onDettaglio,onGestore,onAdminTap}) {
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
        <span onClick={onAdminTap} style={{fontSize:"0.6rem",color:"rgba(41,182,206,0.15)",cursor:"default",userSelect:"none"}}>© 2025 Me che sole</span>
      </div>
    </div>
  );
}

function CardLido({l,onDettaglio}) {
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

// ─── DETTAGLIO LIDO ─────────────────────────────────────────────────
function DettaglioLido({lido,onBack,onPrenota}) {
  const [tab,setTab]=useState("info");
  const rec=[
    {nome:"Giulia T.",voto:5,testo:"Posto meraviglioso, mare cristallino!",data:"Agosto 2025"},
    {nome:"Marco R.",voto:5,testo:"Beach club ottimo, lettini comodissimi.",data:"Agosto 2025"},
    {nome:"Anna V.",voto:4,testo:"Bellissimo, vale ogni euro.",data:"Luglio 2025"},
    {nome:"Roberto F.",voto:5,testo:"La baia piu' bella del Gargano!",data:"Giugno 2025"},
  ];
  const media=(rec.reduce((s,r)=>s+r.voto,0)/rec.length).toFixed(1);
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#FFFDE8,#FFF6C0,#EEF8F8)",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{css}</style>
      <div style={{position:"relative",height:"clamp(200px,38vw,290px)",overflow:"hidden",background:"linear-gradient(135deg,"+C.deep+","+C.navy+","+C.sea1+")"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-55%)",fontSize:"clamp(5rem,12vw,7rem)",animation:"float 3.5s ease-in-out infinite"}}>{lido.img}</div>
        <div style={{position:"absolute",bottom:14,left:0,right:0,textAlign:"center"}}>
          <span style={{background:"rgba(255,253,232,0.95)",borderRadius:50,padding:"0.3rem 1rem",fontSize:"0.85rem",fontWeight:800,color:C.navy}}>⭐ {media} · {rec.length} recensioni</span>
        </div>
        <button onClick={onBack} style={{position:"absolute",top:14,left:14,background:"rgba(255,255,255,0.2)",backdropFilter:"blur(8px)",border:"2px solid rgba(255,255,255,0.3)",borderRadius:50,padding:"0.45rem 1rem",fontSize:"0.82rem",fontWeight:700,color:"white",cursor:"pointer"}}>← Indietro</button>
      </div>
      <div style={{maxWidth:720,margin:"0 auto",padding:"0 1.2rem 7rem"}}>
        <div style={{background:"white",borderRadius:"0 0 20px 20px",padding:"1.2rem 1.4rem",marginBottom:"1rem",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"0.8rem"}}>
            <div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.4rem,5vw,2rem)",fontWeight:700,color:C.navy,lineHeight:1.1,marginBottom:"0.3rem"}}>{lido.nome}</h1>
              <div style={{fontSize:"0.8rem",color:C.muted}}>⚓ {lido.citta} · {lido.regione}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:700,color:"#1A8A4A",lineHeight:1}}>da €{lido.prezzoMin}</div>
              <div style={{fontSize:"0.65rem",color:C.muted}}>al giorno</div>
            </div>
          </div>
        </div>
        <div style={{display:"flex",background:"rgba(255,255,255,0.8)",borderRadius:50,padding:4,gap:3,marginBottom:"1rem",border:"2px solid rgba(41,182,206,0.15)"}}>
          {[["info","ℹ️ Info"],["rec","⭐ Recensioni"]].map(([id,lb])=>(
            <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"0.6rem",border:"none",cursor:"pointer",borderRadius:50,fontSize:"0.85rem",fontWeight:700,transition:"all 0.2s",background:tab===id?"linear-gradient(135deg,"+C.sea1+","+C.sea2+")":"transparent",color:tab===id?"white":C.muted}}>{lb}</button>
          ))}
        </div>
        {tab==="info"&&(
          <div style={{animation:"fadeUp 0.3s ease both"}}>
            <div style={{background:"white",borderRadius:16,padding:"1.1rem 1.2rem",marginBottom:"0.9rem",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",fontWeight:700,color:C.navy,marginBottom:"0.7rem"}}>📖 Descrizione</div>
              <div style={{fontSize:"0.88rem",color:"#4A7A9A",lineHeight:1.75}}>{lido.desc}. Uno dei lidi piu' apprezzati della costa garganica.</div>
            </div>
            <div style={{background:"white",borderRadius:16,padding:"1.1rem 1.2rem",marginBottom:"0.9rem",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",fontWeight:700,color:C.navy,marginBottom:"0.7rem"}}>🛎️ Servizi</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:"0.5rem"}}>
                {["🚿 Docce calde","🅿️ Parcheggio","🍹 Bar","📶 Wi-Fi","🏄 Sport acquatici","👶 Area bambini"].map(s=>(
                  <div key={s} style={{background:"rgba(39,174,96,0.07)",borderRadius:10,padding:"0.5rem 0.75rem",fontSize:"0.78rem",color:"#1A5A30",border:"1.5px solid rgba(39,174,96,0.15)",fontWeight:600}}>{s}</div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab==="rec"&&(
          <div style={{animation:"fadeUp 0.3s ease both"}}>
            {rec.map((rc,i)=>(
              <div key={i} style={{background:"white",borderRadius:16,padding:"1rem 1.2rem",marginBottom:"0.8rem",boxShadow:"0 2px 10px rgba(0,0,0,0.05)"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.5rem"}}>
                  <span style={{fontWeight:800,color:C.navy,fontSize:"0.9rem"}}>{rc.nome}</span>
                  <span style={{fontSize:"0.72rem",color:C.muted}}>{"⭐".repeat(rc.voto)} · {rc.data}</span>
                </div>
                <div style={{fontSize:"0.84rem",color:"#4A7A9A",lineHeight:1.65}}>{rc.testo}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(255,253,232,0.97)",backdropFilter:"blur(14px)",borderTop:"2px solid rgba(39,174,96,0.2)",padding:"1rem 1.2rem",display:"flex",gap:"0.8rem",alignItems:"center",maxWidth:720,margin:"0 auto",boxSizing:"border-box"}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:800,color:C.navy,fontSize:"0.88rem"}}>{lido.nome}</div>
          <div style={{fontSize:"0.7rem",color:C.muted}}>da €{lido.prezzoMin}/giorno</div>
        </div>
        <button onClick={()=>onPrenota(lido)} style={{background:"linear-gradient(135deg,#27AE60,#1A8A4A)",color:"white",border:"none",borderRadius:50,padding:"0.85rem 1.5rem",fontSize:"0.95rem",fontWeight:800,cursor:"pointer",boxShadow:"0 6px 20px rgba(39,174,96,0.45)",whiteSpace:"nowrap"}}>🏖️ Prenota ora</button>
      </div>
    </div>
  );
}

// ─── WIZARD PRENOTAZIONE ────────────────────────────────────────────
function WizardPrenotazione({lidoSel,spots,bookings,onBook,onBack}) {
  const [passo,setPasso]=useState(1);
  const [dateStart,setDateStart]=useState("");
  const [dateEnd,setDateEnd]=useState("");
  const [ora,setOra]=useState("");
  const [imp,setImp]=useState(false);
  const [selected,setSelected]=useState(null);
  const oggi=new Date().toISOString().split("T")[0];
  const days=dateStart&&dateEnd?Math.max(1,Math.ceil((new Date(dateEnd)-new Date(dateStart))/86400000)+1):1;
  const base=(selected?.price||0)*days;
  const extra=imp?Math.ceil(base*0.15):0;
  const total=base+extra;
  const timeH=ora?(parseInt(ora.split(":")[0])+(parseInt(ora.split(":")[1]||"0")/60)):null;
  const inp={width:"100%",padding:"0.9rem 1.1rem",borderRadius:14,border:"2px solid rgba(41,182,206,0.3)",fontSize:"1rem",outline:"none",boxSizing:"border-box",color:C.navy,background:"white",fontFamily:"'DM Sans',sans-serif"};
  const BtnV=({label,onClick,disabled})=>(
    <button onClick={onClick} disabled={disabled} style={{width:"100%",padding:"1.1rem",borderRadius:50,border:"none",background:disabled?"rgba(0,0,0,0.08)":"linear-gradient(135deg,#27AE60,#1A8A4A)",color:disabled?"#bbb":"white",fontSize:"1rem",fontWeight:800,cursor:disabled?"not-allowed":"pointer",boxShadow:disabled?"none":"0 6px 20px rgba(39,174,96,0.45)"}}>
      {label}
    </button>
  );
  const BtnI=({onClick})=>(
    <button onClick={onClick} style={{width:"100%",padding:"0.85rem",borderRadius:50,border:"2px solid rgba(0,0,0,0.1)",background:"transparent",color:"#888",fontSize:"0.9rem",fontWeight:600,cursor:"pointer",marginTop:"0.6rem"}}>← Indietro</button>
  );
  const Steps=()=>(
    <div style={{display:"flex",alignItems:"center",marginBottom:"1.5rem"}}>
      {[{n:1,l:"Date"},{n:2,l:"Posto"},{n:3,l:"Conferma"}].map((s,i)=>(
        <div key={s.n} style={{display:"flex",alignItems:"center",flex:i<2?1:0}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <div style={{width:36,height:36,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.82rem",fontWeight:800,background:passo>s.n?"#27AE60":passo===s.n?"linear-gradient(135deg,"+C.sea1+","+C.sea2+")":"rgba(0,0,0,0.08)",color:passo>=s.n?"white":"#aaa"}}>{passo>s.n?"✓":s.n}</div>
            <span style={{fontSize:"0.62rem",fontWeight:700,color:passo===s.n?C.sea2:"#aaa",whiteSpace:"nowrap"}}>{s.l}</span>
          </div>
          {i<2&&<div style={{flex:1,height:3,background:passo>s.n?"#27AE60":"rgba(0,0,0,0.08)",borderRadius:2,marginBottom:18}}/>}
        </div>
      ))}
    </div>
  );
  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",minHeight:"100vh",background:"linear-gradient(160deg,#FFFDE8,#FFF6C0,#EEF8F8)"}}>
      <style>{css}</style>
      <div style={{background:"rgba(255,253,232,0.97)",backdropFilter:"blur(14px)",borderBottom:"2px solid rgba(41,182,206,0.15)",padding:"0.8rem 1.2rem",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
        <button onClick={onBack} style={{background:"none",border:"none",fontSize:"1rem",cursor:"pointer",color:C.sea2,fontWeight:700}}>← Indietro</button>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",fontWeight:700,color:C.navy,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"55%",textAlign:"center"}}>{lidoSel?.nome}</div>
        <div style={{width:60}}/>
      </div>
      <div style={{maxWidth:680,margin:"0 auto",padding:"1.5rem 1.2rem 5rem"}}>
        <Steps/>
        {passo===1&&(
          <div style={{animation:"fadeUp 0.35s ease both"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.7rem",fontWeight:700,color:C.navy,marginBottom:"0.3rem"}}>📅 Quando vuoi venire?</div>
            <div style={{fontSize:"0.88rem",color:C.muted,marginBottom:"1.5rem"}}>Scegli il giorno e l'orario di arrivo.</div>
            <div style={{background:"white",borderRadius:20,padding:"1.4rem",boxShadow:"0 4px 20px rgba(0,0,0,0.07)",marginBottom:"1.2rem",display:"flex",flexDirection:"column",gap:"1rem"}}>
              <div>
                <label style={{fontSize:"0.8rem",fontWeight:800,color:C.navy,display:"block",marginBottom:"0.5rem"}}>🌅 Giorno di arrivo *</label>
                <input style={inp} type="date" min={oggi} value={dateStart} onChange={e=>{setDateStart(e.target.value);if(!dateEnd||dateEnd<e.target.value)setDateEnd(e.target.value);}}/>
              </div>
              <div>
                <label style={{fontSize:"0.8rem",fontWeight:800,color:C.navy,display:"block",marginBottom:"0.5rem"}}>🌇 Giorno di partenza</label>
                <input style={inp} type="date" min={dateStart||oggi} value={dateEnd} onChange={e=>setDateEnd(e.target.value)}/>
              </div>
              <div>
                <label style={{fontSize:"0.8rem",fontWeight:800,color:C.navy,display:"block",marginBottom:"0.5rem"}}>⏰ Ora di arrivo prevista *</label>
                <input style={inp} type="time" value={ora} onChange={e=>setOra(e.target.value)}/>
                <div style={{fontSize:"0.72rem",color:C.muted,marginTop:"0.4rem"}}>⚠️ Posto tenuto per 2 ore. Con Imprevisti: garantito tutto il giorno.</div>
              </div>
            </div>
            <div onClick={()=>setImp(v=>!v)} style={{background:"white",borderRadius:16,padding:"1.1rem 1.2rem",border:"2px solid "+(imp?"rgba(124,58,237,0.4)":"rgba(0,0,0,0.08)"),cursor:"pointer",display:"flex",gap:"1rem",alignItems:"center",marginBottom:"1.5rem"}}>
              <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,background:imp?"linear-gradient(135deg,#9B59B6,#7D3C98)":"rgba(0,0,0,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",color:"white"}}>{imp?"✓":""}</div>
              <div>
                <div style={{fontWeight:800,color:C.navy,fontSize:"0.92rem",marginBottom:"0.2rem"}}>🛡️ Con Imprevisti <span style={{color:"#9B59B6",fontSize:"0.75rem"}}>(+15%)</span></div>
                <div style={{fontSize:"0.75rem",color:C.muted}}>Ombrellone riservato tutta la giornata, arrivi quando vuoi.</div>
              </div>
            </div>
            <BtnV label="Scegli il posto →" disabled={!dateStart||!ora} onClick={()=>dateStart&&ora&&setPasso(2)}/>
            {(!dateStart||!ora)&&<div style={{textAlign:"center",marginTop:"0.7rem",fontSize:"0.78rem",color:C.coral}}>ℹ️ Inserisci data e ora per continuare</div>}
          </div>
        )}
        {passo===2&&(
          <div style={{animation:"fadeUp 0.35s ease both"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.7rem",fontWeight:700,color:C.navy,marginBottom:"0.3rem"}}>☀️ Scegli il tuo posto</div>
            <div style={{fontSize:"0.88rem",color:C.muted,marginBottom:"1rem"}}>Le ombre sono <strong>reali</strong> per le <strong>{ora}</strong>. Tocca un ombrellone verde.</div>
            <div style={{background:selected?"rgba(39,174,96,0.08)":"rgba(255,255,255,0.7)",borderRadius:16,padding:"0.9rem 1.1rem",marginBottom:"1rem",border:"2px solid "+(selected?"rgba(39,174,96,0.4)":"rgba(0,0,0,0.08)"),display:"flex",alignItems:"center",gap:"0.8rem"}}>
              <div style={{fontSize:"1.8rem",flexShrink:0}}>{selected?"☀️":"👆"}</div>
              <div style={{flex:1}}>
                {selected?<>
                  <div style={{fontWeight:800,color:"#1A8A4A",fontSize:"0.95rem"}}>Posto {selected.id} {selected.vip?"👑 VIP":""}</div>
                  <div style={{fontSize:"0.78rem",color:C.muted}}>Fila {selected.row} · Settore {selected.settore} · €{selected.price}/g</div>
                </>:<div style={{fontWeight:600,color:"#aaa",fontSize:"0.88rem"}}>Tocca un ombrellone verde sulla mappa</div>}
              </div>
              {selected&&<button onClick={()=>setSelected(null)} style={{background:"none",border:"none",color:"#ccc",fontSize:"1.2rem",cursor:"pointer"}}>✕</button>}
            </div>
            <Mappa spots={spots} selected={selected} onSelect={setSelected} bookings={bookings}
              lidoNome={lidoSel?.nome} isGestore={false} dateStr={dateStart} timeHours={timeH}/>
            <div style={{marginTop:"1.2rem",display:"flex",flexDirection:"column",gap:"0.6rem"}}>
              <BtnV label={selected?"Vai al riepilogo →":"Seleziona un ombrellone per continuare"} disabled={!selected} onClick={()=>selected&&setPasso(3)}/>
              <BtnI onClick={()=>setPasso(1)}/>
            </div>
          </div>
        )}
        {passo===3&&(
          <div style={{animation:"fadeUp 0.35s ease both"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.7rem",fontWeight:700,color:C.navy,marginBottom:"0.3rem"}}>✅ Tutto in ordine?</div>
            <div style={{background:"white",borderRadius:20,overflow:"hidden",boxShadow:"0 6px 24px rgba(0,0,0,0.09)",marginBottom:"1.2rem"}}>
              <div style={{background:"linear-gradient(135deg,"+C.deep+","+C.navy+")",padding:"1.2rem",display:"flex",alignItems:"center",gap:"0.9rem"}}>
                <div style={{fontSize:"2.4rem"}}>{lidoSel?.img||"🏖️"}</div>
                <div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.15rem",fontWeight:700,color:"white"}}>{lidoSel?.nome}</div>
                  <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.6)"}}>⚓ {lidoSel?.citta}</div>
                </div>
              </div>
              <div style={{padding:"1.2rem"}}>
                {[{ico:"📍",l:"Posto",v:selected?.id+(selected?.vip?" 👑":"")},{ico:"📅",l:"Dal",v:dateStart},{ico:"📅",l:"Al",v:dateEnd||dateStart},{ico:"⏰",l:"Ora arrivo",v:ora,hl:true},{ico:"📆",l:"Durata",v:days+" giorno"+(days>1?"i":"")},{ico:"🛡️",l:"Tipo",v:imp?"Con Imprevisti":"Standard"}].map(r=>(
                  <div key={r.l} style={{display:"flex",alignItems:"center",gap:"0.8rem",padding:"0.65rem 0",borderBottom:"1px solid rgba(0,0,0,0.05)"}}>
                    <span style={{fontSize:"1rem",flexShrink:0,width:24,textAlign:"center"}}>{r.ico}</span>
                    <span style={{fontSize:"0.78rem",color:C.muted,minWidth:100}}>{r.l}</span>
                    <span style={{fontWeight:700,color:r.hl?C.coral:C.navy,fontSize:"0.88rem",flex:1,textAlign:"right"}}>{r.v}</span>
                  </div>
                ))}
                <div style={{marginTop:"1rem",padding:"1rem",background:"rgba(39,174,96,0.06)",borderRadius:14,border:"2px solid rgba(39,174,96,0.2)"}}>
                  {imp&&<div style={{display:"flex",justifyContent:"space-between",fontSize:"0.82rem",color:"#9B59B6",marginBottom:"0.3rem"}}><span>🛡️ Imprevisti +15%</span><span>+€{extra}</span></div>}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontWeight:800,color:C.navy,fontSize:"1rem"}}>Totale</span>
                    <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:700,color:"#1A8A4A"}}>€{total}</span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={()=>onBook({spot:selected,dateStart,dateEnd:dateEnd||dateStart,ora,imp,total,days})}
              style={{width:"100%",padding:"1.1rem",borderRadius:50,border:"none",background:"linear-gradient(135deg,#27AE60,#1A8A4A)",color:"white",fontSize:"1rem",fontWeight:800,cursor:"pointer",boxShadow:"0 6px 20px rgba(39,174,96,0.45)",marginBottom:"0.6rem"}}>
              💳 Paga €{total} — Conferma prenotazione
            </button>
            <BtnI onClick={()=>setPasso(2)}/>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MODAL PAGAMENTO ────────────────────────────────────────────────
function ModalPagamento({prenotazione,onConferma,onChiudi}) {
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

// ─── GESTORE LOGIN ───────────────────────────────────────────────────
function GestoreModal({onLogin,onClose,err,loading}) {
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

// ─── ADMIN MODAL ─────────────────────────────────────────────────────
function AdminModal({onLogin,onClose,err}) {
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

// ─── ADMIN PANEL ─────────────────────────────────────────────────────
function AdminPanel({onExit}) {
  const spots=generateSpots();
  const [bookings]=useState([
    {spotId:"P-A1",client:"Laura M.",date:"2025-07-14",arrivalTime:"08:45",price:32,tipo:"Con Imprevisti"},
    {spotId:"P-A3",client:"Marco R.",date:"2025-07-14",arrivalTime:"09:00",price:32,tipo:"Standard"},
    {spotId:"Q-B2",client:"Giulia T.",date:"2025-07-14",arrivalTime:"10:00",price:26,tipo:"Standard"},
  ]);
  return (
    <div style={{minHeight:"100vh",background:"#050810",color:"#E8EEFF",fontFamily:"'DM Sans',sans-serif",padding:"1.5rem"}}>
      <style>{css}</style>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"2rem"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:700,color:"#6070FF"}}>🔒 Admin Panel</div>
        <button onClick={onExit} style={{background:"rgba(100,120,255,0.15)",border:"1px solid rgba(100,120,255,0.3)",color:"#8090EE",borderRadius:50,padding:"0.4rem 1rem",fontSize:"0.78rem",cursor:"pointer"}}>← Esci</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"1rem",marginBottom:"2rem"}}>
        {[{l:"Lidi",v:LIDI.length},{l:"Ombrelloni",v:spots.length},{l:"Prenotazioni",v:bookings.length},{l:"Disponibili",v:spots.length-bookings.length}].map(s=>(
          <div key={s.l} style={{background:"rgba(100,120,255,0.1)",borderRadius:14,padding:"1rem",textAlign:"center",border:"1px solid rgba(100,120,255,0.2)"}}>
            <div style={{fontSize:"1.8rem",fontWeight:800,color:"#8090EE"}}>{s.v}</div>
            <div style={{fontSize:"0.72rem",color:"rgba(200,210,255,0.5)",textTransform:"uppercase",letterSpacing:"0.06em"}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:"1rem"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",fontWeight:700,marginBottom:"1rem",color:"#8090EE"}}>Prenotazioni recenti</div>
        {bookings.map((b,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"0.6rem 0",borderBottom:"1px solid rgba(255,255,255,0.06)",fontSize:"0.82rem"}}>
            <span style={{color:"rgba(200,210,255,0.7)"}}>{b.spotId} · {b.client}</span>
            <span style={{color:"#8090EE",fontWeight:700}}>€{b.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
          <span style={{fontSize:"0.7rem",color:C.sea2,fontWeight:700,background:"rgba(41,182,206,0.1)",borderRadius:50,padding:"0.25rem 0.7rem"}}>🔑 Gestore</span>
          <button onClick={()=>setScreen("home")} style={{background:"rgba(255,107,53,0.1)",border:"1.5px solid rgba(255,107,53,0.3)",color:C.coral,borderRadius:50,padding:"0.38rem 0.9rem",fontSize:"0.76rem",fontWeight:700,cursor:"pointer"}}>Esci</button>
        </div>
      </nav>
      <div style={{maxWidth:980,margin:"0 auto",padding:"1.5rem clamp(0.8rem,4vw,2rem) 4rem"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:700,color:C.navy,marginBottom:"1rem"}}>Pannello gestore — Lido Azzurro</div>
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
