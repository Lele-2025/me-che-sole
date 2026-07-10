import { useEffect, useState } from "react";
import { doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.js";

// Ascolto realtime su un lido e sulla sua griglia posti. `spot.status`
// ("free" | "reserved" | "occupied") è scritto solo dalle Cloud
// Functions (createCheckoutSession, stripeWebhook) — il frontend qui
// legge soltanto, non decide mai da solo se un posto è libero.
export function useLido(lidoId) {
  const [lido, setLido] = useState(null);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(!!lidoId);

  useEffect(() => {
    if (!lidoId) {
      setLido(null);
      setSpots([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubDoc = onSnapshot(doc(db, "lidi", lidoId), (snap) => {
      setLido(snap.exists() ? { id: snap.id, ...snap.data() } : null);
    });
    const unsubSpots = onSnapshot(collection(db, "lidi", lidoId, "spots"), (snap) => {
      setSpots(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => {
      unsubDoc();
      unsubSpots();
    };
  }, [lidoId]);

  return { lido, spots, loading };
}
