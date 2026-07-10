const Stripe = require("stripe");
const { defineSecret } = require("firebase-functions/params");

// Il valore vero non sta in nessun file del repo: va impostato con
//   firebase functions:secrets:set STRIPE_SECRET_KEY
// (richiede il login Firebase CLI di chi ha accesso al progetto).
const STRIPE_SECRET_KEY = defineSecret("STRIPE_SECRET_KEY");

function getStripe() {
  return new Stripe(STRIPE_SECRET_KEY.value(), { apiVersion: "2024-12-18.acacia" });
}

module.exports = { getStripe, STRIPE_SECRET_KEY };
