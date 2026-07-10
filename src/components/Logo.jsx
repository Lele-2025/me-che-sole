import logoLettino from "../assets/logo-lettino.png";

// Logo ufficiale "lettino": l'immagine fornita dall'utente, usata così
// com'è (nessun elemento ridisegnato). L'unico intervento è stato
// tecnico, non di design: il file originale non aveva un vero canale
// alpha — lo sfondio "a scacchiera" era disegnato dentro l'immagine
// come pixel opachi. È stato reso trasparente per davvero (sfondo +
// contorni interni delle lettere), lasciando intatti tutti i colori e
// le forme del logo.
export function Logo({h=40}) {
  return <img src={logoLettino} alt="lettino — un click e sei al mare" height={h} style={{display:"block",width:"auto"}}/>;
}
