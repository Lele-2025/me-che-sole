const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { db } = require("./admin");
const { getStripe, STRIPE_SECRET_KEY } = require("./stripeClient");

// Genera il link di onboarding Stripe Connect (Express) per il
// gestore di UN lido. Callable solo dal gestore di quel lido
// specifico o da un admin — mai da un cliente qualunque.
exports.createConnectOnboardingLink = onCall(
  { secrets: [STRIPE_SECRET_KEY] },
  async (request) => {
    const { lidoId } = request.data || {};
    if (!lidoId) throw new HttpsError("invalid-argument", "lidoId mancante.");

    const claims = request.auth?.token;
    const isAdmin = claims?.admin === true;
    const isGestoreDiQuestoLido = claims?.gestoreLidoId === lidoId;
    if (!request.auth || (!isAdmin && !isGestoreDiQuestoLido)) {
      throw new HttpsError("permission-denied", "Non hai i permessi per questo lido.");
    }

    const lidoRef = db.collection("lidi").doc(lidoId);
    const lidoSnap = await lidoRef.get();
    if (!lidoSnap.exists) throw new HttpsError("not-found", "Lido non trovato.");

    const stripe = getStripe();
    let stripeAccountId = lidoSnap.data().stripeAccountId;
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        business_type: "company",
        metadata: { lidoId },
      });
      stripeAccountId = account.id;
      await lidoRef.update({ stripeAccountId, stripeOnboardingComplete: false });
    }

    const origin = request.rawRequest?.headers?.origin || "https://me-che-sole.web.app";
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${origin}/onboarding-refresh`,
      return_url: `${origin}/onboarding-complete`,
      type: "account_onboarding",
    });

    return { url: accountLink.url };
  }
);
