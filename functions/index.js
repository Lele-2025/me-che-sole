const { setGlobalOptions } = require("firebase-functions/v2");

// Regione UE: dati di prenotazione (personali) restano in territorio
// europeo, coerente con la decisione GDPR presa per il progetto.
setGlobalOptions({ region: "europe-west1", maxInstances: 10 });

exports.createConnectOnboardingLink = require("./connectOnboarding").createConnectOnboardingLink;
exports.createCheckoutSession = require("./checkout").createCheckoutSession;
exports.stripeWebhook = require("./webhook").stripeWebhook;
