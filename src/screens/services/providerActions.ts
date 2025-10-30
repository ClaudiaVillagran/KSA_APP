import { arrayUnion, doc, getDoc, getFirestore, serverTimestamp, updateDoc } from "firebase/firestore";

export async function providerAcceptBooking(bookingId: string, providerUid: string) {
  const db = getFirestore();
  const ref = doc(db, "bookings", bookingId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Booking no existe");

  const b = snap.data() as any;
  if (b.providerId !== providerUid) throw new Error("No autorizado");

  await updateDoc(ref, {
    status: "accepted",
    events: arrayUnion({ ts: Date.now(), status: "accepted", by: providerUid }),
    updatedAt: serverTimestamp(),
  });
}

export async function providerScheduleBooking(
  bookingId: string,
  providerUid: string,
  slot: { date: string; start: string; end: string }
) {
  const db = getFirestore();
  const ref = doc(db, "bookings", bookingId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Booking no existe");

  const b = snap.data() as any;
  if (b.providerId !== providerUid) throw new Error("No autorizado");

  await updateDoc(ref, {
    status: "scheduled",
    scheduled: slot,
    events: arrayUnion({ ts: Date.now(), status: "scheduled", by: providerUid }),
    updatedAt: serverTimestamp(),
  });

  try {
    await fetch("https://ksapp-backend.onrender.com/notify/customer-scheduled", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        customerUid: b.customerUid,
        bookingId,
        providerId: providerUid,
        scheduled: slot,
      }),
    });
  } catch (e) {
    console.log("notify customer failed", e);
  }
}
