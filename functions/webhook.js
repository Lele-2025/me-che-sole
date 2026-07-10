const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { db } = require("./admin");
const { getStripe, STRIPE_SECRET_KEY } = require("./stripeClient");

const STRIPE_WEBHOOK_SECRET = defineSecret("STRIPE_WEBHOOK_SECRET");

// Unico punto che scrive lo stato "confirmed" di una prenotazione: un
// client non può mai marcarsi da solo come pagato (vedi firestore.rules,
// bookings è allow write: if false). Verifica sempre la firma Stripe
// prima di fidarsi del contenuto dell'evento.
exports.stripeWebhook = onRequest(
  { secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET] },
  async (req, res) => {
    const stripe = getStripe();
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        req.headers["stripe-signature"],
        STRIPE_WEBHOOK_SECRET.value()
      );
    } catch (err) {
      res.status(400).send(`Firma webhook non valida: ${err.message}`);
      return;
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { bookingId, lidoId, spotId } = session.metadata || {};
        if (bookingId) {
          await db.collection("bookings").doc(bookingId).update({
            status: "confirmed",
            stripePaymentIntentId: session.payment_intent,
            confirmedAt: new Date().toISOString(),
          });
        }
        if (lidoId && spotId) {
          await db.collection("lidi").doc(lidoId).collection("spots").doc(spotId)
            .update({ status: "occupied" });
        }
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object;
        const { bookingId, lidoId, spotId } = session.metadata || {};
        if (bookingId) {
          await db.collection("bookings").doc(bookingId).update({ status: "cancelled" });
        }
        if (lidoId && spotId) {
          await db.collection("lidi").doc(lidoId).collection("spots").doc(spotId)
            .update({ status: "free" });
        }
        break;
      }
      case "account.updated": {
        const account = event.data.object;
        const lidoId = account.metadata?.lidoId;
        if (lidoId) {
          await db.collection("lidi").doc(lidoId).update({
            stripeOnboardingComplete: !!(account.charges_enabled && account.payouts_enabled),
          });
        }
        break;
      }
      default:
        break;
    }

    res.json({ received: true });
  }
);
