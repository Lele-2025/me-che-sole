# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Cos'è

"Me che sole !" — prenotazione ombrelloni per la Costa Garganica (da Marina di Vasto a Manfredonia/Siponto, 47 lidi censiti). App multi-lido: il cliente cerca un lido, vede la mappa dei posti con l'**ombra reale calcolata per data/ora** (posizione del sole via `getSunPos`, coordinate fisse 41.7°N/15.9°E), sceglie un posto e prenota.

## Stato del progetto — leggere prima di modificare

Questo è un **prototipo con autenticazione reale e backend Stripe/Firestore scritto ma non ancora collegato al frontend**. Build pulita, UI completa. Stato attuale:

1. **Nessuna persistenza reale nel frontend, ma il modello dati e le regole esistono.** L'app React tiene ancora `spots`/`bookings` in `useState` dentro `App.jsx` — un refresh cancella tutto. `firestore.rules` è scritto e verificato; le Cloud Functions (punto 4) scrivono già in Firestore. Manca solo l'ultimo miglio: far leggere/scrivere l'app React da Firestore invece che da `useState` locale.
2. **L'autenticazione è reale (Firebase Auth).** `src/firebase.js` inizializza l'app (config da `VITE_FIREBASE_*`, vedi `.env.example`). `StaffLoginModal` + `handleStaffLogin` in `App.jsx` fanno `signInWithEmailAndPassword` vero; il ruolo (gestore di un lido specifico, o admin) è deciso leggendo i custom claim (`admin`, `gestoreLidoId`) dal token dopo il login. **Non esiste ancora nessun account staff**: va creato in Firebase Console (Authentication → Add user), poi gli va assegnato il claim con `node scripts/setStaffClaim.mjs --email ... --admin` (o `--gestore <lidoId>`), usando una service account key locale (mai committata).
3. **Il pagamento nel frontend è ancora il form finto.** `src/components/ModalPagamento.jsx` raccoglie numero carta/scadenza/CVV in `useState` e "conferma" con un `setTimeout` — nessun addebito reale. Il backend Stripe che dovrebbe sostituirlo (punto 4) è già scritto: manca solo collegare il frontend a `createCheckoutSession` e reindirizzare a Stripe Checkout invece di aprire questo modal.
4. **Cloud Functions Stripe Connect scritte e verificate nell'emulatore** (`functions/`): `createConnectOnboardingLink`, `createCheckoutSession`, `stripeWebhook`. Non ancora deployate — serve `firebase login` di chi ha accesso al progetto, poi impostare i secret (vedi sotto) e `firebase deploy --only functions`.

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
  firebase.js               → inizializzazione Firebase (app, auth, db) da variabili d'ambiente VITE_FIREBASE_*
  theme.js                 → palette colori (C) e keyframes/CSS globali (css), importati ovunque serva lo stile
  data/
    lidi.js                → i 47 lidi (dati statici) + CITTA derivata
    spots.js                → griglia posti (settori P/Q/R/S × file A-E × 6 colonne), generateSpots()
  lib/
    sunEngine.js            → getSunPos(dateStr, timeH): calcolo astronomico posizione solare, usato per proiettare le ombre
  components/                → pezzi riusabili senza logica di navigazione propria
    Logo, Splash, SunCompass, OmbrelloneReal, Mappa, CardLido,
    StaffLoginModal (login Firebase Auth reale), ModalPagamento (placeholder, vedi sopra)
  screens/                    → schermate intere, montate da App.jsx in base allo stato `screen`
    Home, DettaglioLido, WizardPrenotazione, AdminPanel
  App.jsx                     → orchestratore: state machine a schermate (splash/home/dettaglio/prenota/gestore/admin), tutto lo state applicativo (bookings, spots, screen corrente), login/logout staff
scripts/
  setStaffClaim.mjs          → utility locale one-shot per assegnare i custom claim (admin/gestoreLidoId) a un account Firebase Auth esistente, via firebase-admin + service account key locale (mai committata)
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

**`Mappa` è condiviso tra tre contesti**: vista cliente nel wizard di prenotazione, vista gestore (pannello proprietario lido), e implicitamente l'admin panel (che genera la propria griglia posti indipendente). Se cambi la logica di disponibilità dei posti, verifica tutti e tre gli usi.

## Prossimi passi tecnici (in ordine — vedi anche la task list)

1. ~~Rimuovere `DEMO_USERS` e il backdoor admin~~ — fatto.
2. ~~Scaffold Cloud Functions Stripe Connect~~ — fatto, non ancora deployato (serve `firebase login` + secret + `firebase deploy --only functions`).
3. **Collegare l'app a Firestore per davvero**: sostituire gli `useState` di `spots`/`bookings` in `App.jsx` con letture/scritture reali su `/lidi/{lidoId}/spots` e `/bookings`.
4. **Sostituire `ModalPagamento`**: al posto del form finto, chiamare `createCheckoutSession` (callable) e reindirizzare l'utente all'URL di Stripe Checkout restituito. Il numero di carta non deve mai passare per lo `state` React.
5. **Onboarding gestori**: UI nel pannello gestore che chiama `createConnectOnboardingLink` e mostra un lido come "pagamenti non ancora attivi" finché `stripeOnboardingComplete` non è vero.
6. **Audit dei 47 lidi**: verificare che contatti/dati siano ancora corretti (il progetto era fermo da tempo).
7. Redesign UI (direzione "Lido Minimal": bianco/sabbia/blu maiolica/terracotta, tipografia Manrope+DM Mono, pattern maiolica pugliese come dettaglio, non sfondo) — da fare dopo che booking+pagamento reali funzionano, non prima.

Confermare `PLATFORM_FEE_PERCENT` in `functions/checkout.js` prima del deploy in produzione (vedi sopra).
