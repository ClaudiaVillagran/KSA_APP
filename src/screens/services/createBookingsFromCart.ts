import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

type LineItem = { id: string; title: string; unitPrice: number; qty: number; image?: string | null };
type Billing = {
  firstName: string; lastName: string; country: string; commune: string; street: string;
  phone: string; email: string; note?: string;
};
type TBK = { order: string; token_ws: string; code: string; amount: number } | null;
type Requested = { date: string; start: string; end: string } | null;

const ivaCalc = (n: number) => Math.round(n * 0.19);

export async function createBookingsFromCart(params: {
  lineItems: LineItem[];
  billing: Billing;
  tbk: TBK;
  requested?: Requested;
}) {
  const { lineItems, billing, tbk, requested = null } = params;

  const auth = getAuth();
  const db = getFirestore();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Sesión expirada. Inicia sesión.");

  const createdIds: string[] = [];

  for (const it of lineItems) {
    const svcSnap = await getDoc(doc(db, "services", it.id));
    if (!svcSnap.exists()) {
      console.warn("Servicio no disponible:", it.id);
      continue;
    }
    const svc = svcSnap.data() as any;

    const providerId   = svc.ownerId;
    const providerName = svc.ownerName || svc.author?.name || null;
    const price        = typeof it.unitPrice === "number" ? it.unitPrice : (svc.price || svc.pricing?.price || 0);

    const subtotal = price * (it.qty || 1);
    const iva      = ivaCalc(subtotal);
    const total    = subtotal + iva;

    const bookingId = `BK_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
    const payload = {
      bookingId,
      serviceId: it.id,
      serviceTitle: svc.title || it.title || "Servicio",
      providerId,
      providerName,
      customerUid: uid,

      status: "pending_provider",
      price,
      amounts: { subtotal, iva, total },

      address: `${billing.street}, ${billing.commune}, ${billing.country}`,
      contact: {
        name: `${billing.firstName} ${billing.lastName}`.trim(),
        phone: billing.phone,
        email: billing.email,
      },

      // 👇 Propuesta del cliente (NUEVO)
      requested,
      scheduled: null,

      notes: billing.note || "",

      payment: {
        gateway: "webpay",
        status: "paid",
        tbk: tbk ? { ...tbk } : null,
      },

      events: [{ ts: Date.now(), status: "pending_provider", by: "system" }],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      source: "cart",
      qty: it.qty || 1,
      image: it.image || null,
    };

    await setDoc(doc(db, "bookings", bookingId), payload);
    createdIds.push(bookingId);

    try {
      await fetch("https://ksapp-backend.onrender.com/notify/provider-new-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId,
          bookingId,
          serviceTitle: payload.serviceTitle,
          requested, // envía la propuesta al mail/push
          contact: payload.contact,
          address: payload.address,
          total,
        }),
      });
    } catch (e) {
      console.log("Aviso proveedor falló:", e);
    }
  }

  return createdIds;
}
