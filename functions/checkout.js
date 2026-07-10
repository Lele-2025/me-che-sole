const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { db } = require("./admin");
const { getStripe, STRIPE_SECRET_KEY } = require("./stripeClient");

// PLACEHOLDER — percentuale di commissione della piattaforma, non
// ancora confermata: 10% è un punto di partenza ragionevole per un
// marketplace di prenotazioni, non una cifra concordata con l'utente.
const PLATFORM_FEE_PERCENT = 10;

// Crea una Checkout Session Stripe per una prenotazione. Il cliente
// paga, il denaro va (meno la commissione) direttamente all'account
// Connect del lido via transfer_data — noi non tratteniamo mai i fondi.
// La prenotazione nasce qui in stato "pending" e viene confermata SOLO
// dal webhook dopo che Stripe conferma il pagamento (vedi webhook.js).
exports.createCheckoutSession = onCall(
  { secrets: [STRIPE_SECRET_KEY] },
  async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "Devi accedere per prenotare.");

    const { lidoId, spotId, dateStart, dateEnd, ora, imp, totalCents } = request.data || {};
    if (!lidoId || !spotId || !dateStart || !ora || !totalCents) {
      throw new HttpsError("invalid-argument", "Dati di prenotazione incompleti.");
    }

    const lidoRef = db.collection("lidi").doc(lidoId);
    const lidoSnap = await lidoRef.get();
    if (!lidoSnap.exists) throw new HttpsError("not-found", "Lido non trovato.");
    const { stripeAccountId, stripeOnboardingComplete, nome: lidoNome } = lidoSnap.data();
    if (!stripeAccountId || !stripeOnboardingComplete) {
      throw new HttpsError(
        "failed-precondition",
        "Questo lido non ha ancora completato l'attivazione dei pagamenti."
      );
    }

    const spotRef = lidoRef.collection("spots").doc(spotId);
    const spotSnap = await spotRef.get();
    if (!spotSnap.exists) throw new HttpsError("not-found", "Posto non trovato.");
    if (spotSnap.data().status !== "free") {
      throw new HttpsError("failed-precondition", "Posto non più disponibile.");
    }

    const stripe = getStripe();
    const applicationFeeAmount = Math.round(totalCents * (PLATFORM_FEE_PERCENT / 100));

    const bookingRef = db.collection("bookings").doc();
    await bookingRef.set({
      lidoId, spotId, clientId: request.auth.uid,
      dateStart, dateEnd: dateEnd || dateStart, ora, imp: !!imp,
      totalCents, currency: "eur", status: "pending",
      createdAt: new Date().toISOString(),
    });

    const origin = request.rawRequest?.headers?.origin || "https://me-che-sole.web.app";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "eur",
          unit_amount: totalCents,
          product_data: { name: `${lidoNome} — posto ${spotId} — ${dateStart} ${ora}` },
        },
        quantity: 1,
      }],
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount,
        transfer_data: { destination: stripeAccountId },
      },
      metadata: { bookingId: bookingRef.id, lidoId, spotId },
      success_url: `${origin}/prenotazione-confermata?booking=${bookingRef.id}`,
      cancel_url: `${origin}/prenotazione-annullata?booking=${bookingRef.id}`,
    });

    await bookingRef.update({ stripeCheckoutSessionId: session.id });

    // "reserved", non ancora "occupied": evita doppie prenotazioni
    // durante il checkout, ma va liberato se il pagamento non arriva
    // (vedi checkout.session.expired nel webhook).
    await spotRef.update({ status: "reserved" });

    return { url: session.url };
  }
);
