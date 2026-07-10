// ─── CALCOLO SOLARE — Gargano lat:41.7 lon:15.9 ────────────────────
export function getSunPos(dateStr, timeH) {
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
