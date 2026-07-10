# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Cos'è

**"lettino"** ("un click e sei al mare") — prenotazione ombrelloni per la Costa Garganica (da Marina di Vasto a Manfredonia/Siponto, 47 lidi censiti). App multi-lido: il cliente cerca un lido, vede la mappa dei posti con l'**ombra reale calcolata per data/ora** (posizione del sole via `getSunPos`, coordinate fisse 41.7°N/15.9°E), sceglie un posto e prenota.

Il progetto è nato come "Me che sole !" (nome ancora visibile in alcuni identificatori tecnici non rinominati di proposito — vedi sotto) ed è stato ribrandizzato a "lettino" su richiesta dell'utente, che ha fornito il nuovo logo (ombrellone+lettino+sole+onda, navy/arancio/azzurro).

**Repository, package.json e progetto Firebase restano `me-che-sole`/`mechesolelo`**: rinominare un repository GitHub o un progetto Firebase dopo la creazione ha conseguenze reali (URL che cambiano, un project ID Firebase non è nemmeno modificabile senza ricreare tutto il progetto) — non l'ho fatto senza una richiesta esplicita in tal senso. Il nome utente-facing dell'app è "lettino"; gli identificatori tecnici sotto restano quelli originali finché non viene chiesto altrimenti.

## Stato del progetto — leggere prima di modificare

Questo è un **prototipo con autenticazione reale, pagamento reale (Stripe Connect) e UI collegata a Firestore in tempo reale — ma non ancora deployato**. Build pulita. Stato attuale:

1. **Autenticazione reale (Firebase Auth).** `src/firebase.js` inizializza l'app (config da `VITE_FIREBASE_*`, vedi `.env.example`). `StaffLoginModal` + `handleStaffLogin` in `App.jsx` fanno `signInWithEmailAndPassword` vero; il ruolo (gestore di un lido specifico, o admin) è deciso leggendo i custom claim (`admin`, `gestoreLidoId`) dal token. I clienti (senza account) vengono autenticati in modo anonimo all'avvio (`signInAnonymously`) solo per avere un uid stabile a cui agganciare una prenotazione — non esiste ancora un vero flusso di registrazione cliente. **Non esiste ancora nessun account staff**: va creato in Firebase Console (Authentication → Add user), poi gli va assegnato il claim con `node scripts/setStaffClaim.mjs --email ... --admin` (o `--gestore <lidoId>`).
2. **Il pagamento è reale, non più il form finto.** `ModalPagamento.jsx` è stato rimosso. Il bottone "Paga" in `WizardPrenotazione` chiama `createCheckoutSession` (Cloud Function) e reindirizza a Stripe Checkout — il numero di carta non tocca mai il nostro frontend. Il "ritorno" da Stripe atterra sulla root dell'app con `?esito=confermata|annullata&booking=...` (letto da `App.jsx` al mount, niente router).
3. **Cloud Functions Stripe Connect scritte e verificate nell'emulatore** (`functions/`): `createConnectOnboardingLink`, `createCheckoutSession`, `stripeWebhook`. `createCheckoutSession` riserva il posto e crea la prenotazione dentro una `db.runTransaction` (evita che due checkout quasi simultanei sullo stesso posto passino entrambi il controllo "libero"), con rollback a "free" se la chiamata a Stripe fallisce dopo. **Non ancora deployate** — serve `firebase login` di chi ha accesso al progetto, poi impostare i secret (vedi sotto) e `firebase deploy --only functions`.
4. **La UI (Mappa in WizardPrenotazione e nel pannello gestore) ora legge Firestore in tempo reale** tramite l'hook `src/hooks/useLido.js` (`onSnapshot` su `/lidi/{lidoId}` e la sua sottocollezione `/spots`) — non più `generateSpots()`/`useState` locale. `Mappa`/`OmbrelloneReal` non prendono più un prop `bookings` finto: l'occupazione di un posto si legge solo da `spot.status` ("free"/"reserved"/"occupied"), scritto esclusivamente dalle Cloud Functions. **`AdminPanel` resta fuori da questo collegamento**: mostra ancora dati statici/finti (prenotazioni di esempio, conteggio lidi dalla lista locale) — è un cruscotto aggregato multi-lido, un lavoro a parte rispetto al collegamento per-lido già fatto.

**Percentuale di commissione piattaforma: PLACEHOLDER non confermato.** `functions/checkout.js` ha `PLATFORM_FEE_PERCENT = 10` come valore di partenza — è una mia stima ragionevole per un marketplace di prenotazioni, non una cifra decisa con te. Da confermare o correggere prima del deploy in produzione.

**Secret richiesti per le Cloud Functions** (mai nel codice, si impostano con `firebase functions:secrets:set NOME_SECRET` dopo `firebase login`):
- `STRIPE_SECRET_KEY` — chiave segreta Stripe (test o live)
- `STRIPE_WEBHOOK_SECRET` — si ottiene solo dopo aver registrato l'endpoint `stripeWebhook` (una volta deployato) su Stripe Dashboard → Sviluppatori → Webhook, e serve a verificare che le richieste al webhook vengano davvero da Stripe.

Nota ambientale: in questo sandbox di sviluppo le chiamate a `identitytoolkit.googleapis.com` (Firebase Auth) vengono resettate dalla rete (stesso comportamento osservato per `fonts.googleapis.com`) — il codice gestisce l'errore correttamente (mostra "Credenziali non valide" invece di crashare), ma un login riuscito non è stato verificabile da qui. Va testato in locale o in un ambiente di deploy reale una volta creato il primo account staff.

## Decisioni di prodotto prese (non rimetterle in discussione senza nuove info)

- **Modello: booking diretto con pagamento online**, non richiesta assistita. Supera una versione precedente del progetto che prevedeva solo richiesta/conferma manuale del gestore.
- **Flusso di denaro: Stripe Connect (marketplace).** Ogni lido deve completare l'onboarding Stripe Connect (KYC, IBAN) per poter incassare. Non diventiamo mai il soggetto che detiene i fondi o che risponde di rimborsi per un servizio erogato da terzi. Finché un lido non ha completato l'onboarding, non può ricevere prenotazioni a pagamento nell'app.
- **Backend: Firebase** — Firestore per dati/disponibilità realtime, Firebase Auth per l'identità di clienti/gestori/admin, Cloud Functions per tutto ciò che deve restare server-side (creazione sessioni Stripe, webhook di conferma pagamento). Progetto Firebase dedicato (non condiviso con HERRERA SYSTEM).
- **Niente scraping/automazione sui siti dei lidi** — rischio legale/tecnico troppo alto.
- **Privacy utenti**: nickname + QR generato dall'app, mai numero di telefono o email visibili ad altri utenti.
- **Layer social è v2**: foto, stato, chat, forum lidi — solo dopo che il booking-core ha utenti reali attivi.
- **Recensioni/foto/posizione lido**: quelle attuali in `DettaglioLido.jsx` sono dati statici di esempio. Da agganciare a Google Places API (non scraping) quando si affronta quel punto.

## Comandi

```bash
npm install      # dipendenze (React 18, Vite 5)
npm run dev       # dev server su :5173
npm run build     # build di produzione — usalo per verificare che il progetto compili dopo ogni refactor
npm run preview   # serve la build di produzione in locale
```

Non ci sono test automatici né linter configurati.

## Architettura

Vite + React puro (nessun router, nessun state manager esterno). Struttura:

```
src/
  firebase.js               → inizializzazione Firebase (app, auth, db, functions) da variabili d'ambiente VITE_FIREBASE_*/VITE_STRIPE_PUBLISHABLE_KEY
  theme.js                 → palette colori (C) e keyframes/CSS globali (css), importati ovunque serva lo stile
  assets/
    logo-lettino.png        → logo ufficiale, file fornito dall'utente — usato così com'è in Logo.jsx (vedi nota sotto), non ridisegnato
  data/
    lidi.js                → i 47 lidi (dati statici, per la UI) + CITTA derivata — stessa fonte usata da scripts/seedLidi.mjs per popolare Firestore
    spots.js                → griglia posti (settori P/Q/R/S × file A-E × 6 colonne), generateSpots() — usata solo dal seed script e da AdminPanel, non più dalla UI cliente/gestore
  lib/
    sunEngine.js            → getSunPos(dateStr, timeH): calcolo astronomico posizione solare, usato per proiettare le ombre
  hooks/
    useLido.js               → onSnapshot realtime su un lido + la sua sottocollezione spots (Firestore, non più stato locale)
  components/                → pezzi riusabili senza logica di navigazione propria
    Logo, Splash, SunCompass, OmbrelloneReal, Mappa, CardLido,
    StaffLoginModal (login Firebase Auth reale)
  screens/                    → schermate intere, montate da App.jsx in base allo stato `screen`
    Home, DettaglioLido, WizardPrenotazione, AdminPanel (ancora dati finti, vedi sopra)
  App.jsx                     → orchestratore: state machine a schermate (splash/home/dettaglio/prenota/gestore/admin), useLido per il lido "attivo" (cliente o gestore), login/logout staff, chiamata a createCheckoutSession, lettura del ritorno da Stripe via query param
scripts/
  setStaffClaim.mjs          → utility locale one-shot per assegnare i custom claim (admin/gestoreLidoId) a un account Firebase Auth esistente, via firebase-admin + service account key locale (mai committata)
  seedLidi.mjs                → utility locale one-shot per scrivere i 47 lidi + la loro griglia posti su Firestore (stessa fonte dati di src/data/lidi.js), idempotente: non resetta lo status di uno spot già prenotato
firestore.rules              → regole di sicurezza Firestore (ruoli via custom claim, bookings mai scrivibili da client)
functions/                    → Cloud Functions (Node 20, region europe-west1)
  admin.js                   → inizializzazione firebase-admin, esporta `db`
  stripeClient.js             → istanza Stripe da secret STRIPE_SECRET_KEY (defineSecret, mai in chiaro)
  connectOnboarding.js         → createConnectOnboardingLink: crea l'account Stripe Express del lido (se non esiste) + link di onboarding, solo per il gestore di quel lido o admin
  checkout.js                  → createCheckoutSession: crea la prenotazione "pending" + una Checkout Session Stripe con transfer_data verso l'account del lido (destination charge)
  webhook.js                   → stripeWebhook: unico punto che marca una prenotazione "confirmed" (dopo verifica firma Stripe) e il posto "occupied"
```

**Il routing è uno state machine manuale in `App.jsx`**, non un router: `screen` è una stringa (`"splash" | "home" | "dettaglio" | "prenota" | "gestore" | "admin"`) e ogni valore fa da early-return con un componente diverso. Se aggiungi una schermata, segui lo stesso pattern invece di introdurre React Router per una sola aggiunta.

**Il motore ombra è il differenziatore del prodotto.** `getSunPos` in `sunEngine.js` calcola altitudine/azimuth solare reali per le coordinate del Gargano; `OmbrelloneReal` usa quei valori per disegnare via SVG l'ombra proiettata di ogni ombrellone. È matematica astronomica verificata, non toccarla senza motivo — un refactor che la "semplifica" rischia di romperla silenziosamente (nessun test la copre).

**`Mappa` legge sempre spot da Firestore via `useLido`**, sia nel wizard di prenotazione cliente sia nel pannello gestore — l'unica eccezione è `AdminPanel`, che genera ancora la propria griglia con `generateSpots()` per uno pseudo-cruscotto non collegato a nessun lido reale. Se cambi il modello di disponibilità dei posti (nuovo stato oltre free/reserved/occupied, nuovi campi), aggiorna `firestore.rules`, `functions/checkout.js`, `functions/webhook.js`, `scripts/seedLidi.mjs` e `useLido.js` insieme.

**Il logo è l'immagine fornita dall'utente (`src/assets/logo-lettino.png`), non un SVG ridisegnato.** Il file originale caricato NON aveva un canale alpha reale: lo sfondo "a scacchiera" (indicatore visivo di trasparenza) era disegnato dentro l'immagine come pixel opachi bianco/grigio. È stato corretto con un fix tecnico mirato (flood-fill delle regioni connesse al bordo dell'immagine + fori delle lettere nell'area del testo, y>700 nel file originale) che rende trasparente solo lo sfondo vero, lasciando intatti i pannelli bianchi dell'ombrellone (che condividono lo stesso colore ma non sono connessi al bordo). Se l'utente fornisce una nuova versione del logo, ripeti la stessa verifica (`Image.open(...).mode` — se non è `RGBA` con un canale alpha reale, il file non è davvero trasparente anche se sembra tale) prima di usarlo direttamente.

**Rebrand a "lettino" in corso, non ancora completo.** `theme.js` contiene ORA due palette in parallelo: quella originale "Costa Garganica" (`C.sea1/sea2/sun/aqua/cream/deep/navy/coral/muted`, font Cormorant Garamond+DM Sans) ancora usata da `WizardPrenotazione`, `DettaglioLido`, `Mappa`, `StaffLoginModal`, `Splash`, e i pannelli gestore/admin in `App.jsx`; e quella nuova del brand "lettino" (`C.white/sabbia/brandNavy/brandNavyDark/brandOrange/brandSky/ink/inkMuted/line`, font Manrope+DM Mono, più `brandPattern` per i dettagli decorativi) già applicata a `Home.jsx`, `CardLido.jsx`, `Logo.jsx`. `brandNavy`/`brandOrange`/`brandSky` sono stati campionati per pixel dal file logo fornito dall'utente (non inventati) — se servono altre tonalità derivate, riparti da quei tre valori, non dalla vecchia palette "Costa Garganica"/"Lido Minimal" (superata). Finché il rebrand non è completo, non rimuovere i token della vecchia palette — servono ancora. Il pulsante di CardLido dice "Prenota" (non più "Richiedi": quella dicitura era per il vecchio modello a richiesta assistita, superato dalla decisione booking-diretto). `Logo.jsx` nasconde automaticamente lo slogan "un click e sei al mare" sotto una certa altezza (`h<64`), per restare leggibile nella navbar.

## Prossimi passi tecnici (in ordine — vedi anche la task list)

1. ~~Rimuovere `DEMO_USERS` e il backdoor admin~~ — fatto.
2. ~~Scaffold Cloud Functions Stripe Connect~~ — fatto, non ancora deployato.
3. ~~Sostituire `ModalPagamento` con Stripe Checkout reale~~ — fatto lato codice.
4. ~~Collegare Mappa/WizardPrenotazione/Gestore a Firestore in tempo reale~~ — fatto (`useLido.js`), `AdminPanel` escluso di proposito (vedi sopra).
5. ~~Onboarding gestori~~ — fatto: banner nel pannello gestore che chiama `createConnectOnboardingLink`, mostra "pagamenti non ancora attivi" finché `stripeOnboardingComplete` non è vero.
6. **Deploy**: `firebase login` (di chi ha accesso al progetto) → `firebase functions:secrets:set STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` → `node scripts/seedLidi.mjs` (popola Firestore) → `firebase deploy --only functions,firestore:rules` → registrare l'URL di `stripeWebhook` su Stripe Dashboard (Sviluppatori → Webhook). Solo dopo questo passo il flusso di pagamento è testabile end-to-end.
7. **Rebrand "lettino" — completare la propagazione**: `WizardPrenotazione`, `DettaglioLido`, `Mappa`/`OmbrelloneReal`/`SunCompass`, `StaffLoginModal`, `Splash` (già mostra il nuovo logo ma su sfondo/testo della vecchia palette — visivamente incoerente finché non si finisce), pannelli gestore/admin in `App.jsx`. Solo dopo, rimuovere i token della vecchia palette "Costa Garganica" da `theme.js`.
8. **AdminPanel reale**: cruscotto multi-lido con dati veri (richiede una collectionGroup query su `spots` e una query su `bookings`, non affrontato in questo giro).
9. **Audit dei 47 lidi**: verificare che contatti/dati siano ancora corretti (il progetto era fermo da tempo).

Confermare `PLATFORM_FEE_PERCENT` in `functions/checkout.js` prima del deploy in produzione (vedi sopra).
