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

    // Transazione: legge lo spot, verifica che sia libero, lo marca
    // "reserved" e crea la prenotazione "pending" in un solo colpo
    // atomico. Senza questo, due checkout quasi simultanei sullo
    // stesso posto potrebbero superare entrambi il controllo "libero"
    // prima che la scrittura dell'uno sia visibile all'altro.
    const spotRef = lidoRef.collection("spots").doc(spotId);
    const bookingRef = db.collection("bookings").doc();
    await db.runTransaction(async (tx) => {
      const spotSnap = await tx.get(spotRef);
      if (!spotSnap.exists) throw new HttpsError("not-found", "Posto non trovato.");
      if (spotSnap.data().status !== "free") {
        throw new HttpsError("failed-precondition", "Posto non più disponibile.");
      }
      tx.update(spotRef, { status: "reserved" });
      tx.set(bookingRef, {
        lidoId, spotId, clientId: request.auth.uid,
        dateStart, dateEnd: dateEnd || dateStart, ora, imp: !!imp,
        totalCents, currency: "eur", status: "pending",
        createdAt: new Date().toISOString(),
      });
    });

    try {
      const stripe = getStripe();
      const applicationFeeAmount = Math.round(totalCents * (PLATFORM_FEE_PERCENT / 100));
      const origin = request.rawRequest?.headers?.origin || "https://me-che-sole.web.app";

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        // Scadenza breve (il minimo che Stripe consente): un checkout
        // abbandonato libera il posto in 30 minuti, non lo tiene
        // bloccato per il default di 24h.
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
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
        // L'app è una SPA a singola pagina senza router: il "ritorno"
        // da Stripe atterra sulla root con dei query param, letti da
        // App.jsx al mount.
        success_url: `${origin}/?esito=confermata&booking=${bookingRef.id}`,
        cancel_url: `${origin}/?esito=annullata&booking=${bookingRef.id}`,
      });

      await bookingRef.update({ stripeCheckoutSessionId: session.id });
      return { url: session.url };
    } catch (err) {
      // La Checkout Session non è stata creata: annulla la
      // prenotazione (posto tenuto per niente) invece di lasciarlo
      // "reserved" a vita.
      await spotRef.update({ status: "free" });
      await bookingRef.update({ status: "failed" });
      throw new HttpsError("internal", "Impossibile avviare il pagamento, riprova.");
    }
  }
);
