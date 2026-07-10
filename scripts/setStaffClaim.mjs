#!/usr/bin/env node
// Utility locale, una tantum, per assegnare i custom claim (admin o
// gestore-di-un-lido) a un account Firebase Auth già esistente.
// NON fa parte dell'app deployata — va eseguito a mano da chi ha la
// service account key del progetto Firebase.
//
// Setup:
//   1. Console Firebase → Impostazioni progetto → Service account →
//      Genera nuova chiave privata → salva il file .json (NON committarlo).
//   2. export GOOGLE_APPLICATION_CREDENTIALS=/percorso/alla/chiave.json
//
// Uso:
//   node scripts/setStaffClaim.mjs --email admin@esempio.it --admin
//   node scripts/setStaffClaim.mjs --email gestore@lido.it --gestore va1
//   node scripts/setStaffClaim.mjs --email chi@esempio.it --revoke
//
// Dopo l'esecuzione l'utente deve rifare login (o forzare un refresh
// del token) perché il nuovo claim compaia nel proprio ID token.

import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const args = process.argv.slice(2);
const flag = name => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};

const email = flag("email");
const isAdmin = args.includes("--admin");
const gestoreLidoId = flag("gestore");
const revoke = args.includes("--revoke");

if (!email || (!isAdmin && !gestoreLidoId && !revoke)) {
  console.error(
    "Uso: node scripts/setStaffClaim.mjs --email <email> [--admin | --gestore <lidoId> | --revoke]"
  );
  process.exit(1);
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error(
    "Manca GOOGLE_APPLICATION_CREDENTIALS. Vedi le istruzioni in cima a questo file."
  );
  process.exit(1);
}

initializeApp({ credential: applicationDefault() });

const auth = getAuth();
const user = await auth.getUserByEmail(email);

const claims = revoke ? {} : isAdmin ? { admin: true } : { gestoreLidoId };
await auth.setCustomUserClaims(user.uid, claims);

console.log(
  revoke
    ? `Claim rimossi per ${email}.`
    : `Claim assegnati a ${email}: ${JSON.stringify(claims)}`
);
console.log("L'utente deve rifare login perché il claim abbia effetto.");
