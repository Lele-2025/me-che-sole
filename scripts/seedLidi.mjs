#!/usr/bin/env node
// Utility locale, una tantum: scrive i 47 lidi e la loro griglia posti
// su Firestore, così le Cloud Functions (createCheckoutSession) hanno
// documenti reali da leggere. Il frontend continua a usare la lista
// statica in src/data/lidi.js per la UI — qui la importiamo diretta,
// un'unica fonte di verità, non una copia da tenere sincronizzata a mano.
//
// Setup: stesso di scripts/setStaffClaim.mjs — serve una service
// account key locale (mai committata):
//   export GOOGLE_APPLICATION_CREDENTIALS=/percorso/alla/chiave.json
//
// Uso:
//   node scripts/seedLidi.mjs
//
// Idempotente: rieseguirlo aggiorna i campi anagrafici dei lidi senza
// toccare stripeAccountId/stripeOnboardingComplete se già presenti, e
// non tocca lo stato (free/reserved/occupied) degli spot già creati.

import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { LIDI } from "../src/data/lidi.js";
import { generateSpots } from "../src/data/spots.js";

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error(
    "Manca GOOGLE_APPLICATION_CREDENTIALS. Vedi le istruzioni in cima a questo file."
  );
  process.exit(1);
}

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

const spots = generateSpots();

for (const lido of LIDI) {
  const lidoRef = db.collection("lidi").doc(lido.id);
  await lidoRef.set(
    {
      nome: lido.nome,
      citta: lido.citta,
      regione: lido.regione,
      stelle: lido.stelle,
      posti: lido.posti,
      prezzoMin: lido.prezzoMin,
      img: lido.img,
      desc: lido.desc,
      tel: lido.tel,
    },
    { merge: true }
  );

  // Legge quali spot esistono già: un rerun non deve mai resettare a
  // "free" un posto che nel frattempo è stato prenotato davvero.
  const existing = await lidoRef.collection("spots").get();
  const existingIds = new Set(existing.docs.map((d) => d.id));

  const batch = db.batch();
  for (const spot of spots) {
    const spotRef = lidoRef.collection("spots").doc(spot.id);
    const anagrafica = { settore: spot.settore, row: spot.row, col: spot.col, vip: spot.vip, price: spot.price };
    if (existingIds.has(spot.id)) {
      batch.set(spotRef, anagrafica, { merge: true });
    } else {
      batch.set(spotRef, { ...anagrafica, status: "free" });
    }
  }
  await batch.commit();

  console.log(`Seed completato: ${lido.id} (${lido.nome}) — ${spots.length} posti.`);
}

console.log(`\nFatto: ${LIDI.length} lidi seminati su Firestore.`);
console.log(
  "Nota: stripeAccountId/stripeOnboardingComplete NON vengono impostati qui — " +
  "li crea createConnectOnboardingLink quando un gestore completa l'onboarding."
);
