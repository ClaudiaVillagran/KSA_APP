
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

async function indexUsersByEmail() {
  const m = new Map();
  const snap = await db.collection("users").get();
  snap.forEach(d => {
    const u = d.data();
    const email = (u.email || "").trim().toLowerCase();
    if (email) m.set(email, { uid: d.id, ...u });
  });
  return m;
}

(async () => {
  const byEmail = await indexUsersByEmail();
  const featuredSnap = await db.collection("featured_companies").get();

  for (const doc of featuredSnap.docs) {
    const data = doc.data();
    const email = (data?.contact?.email || "").trim().toLowerCase();
    if (!email || !byEmail.has(email)) {
      console.warn(`⚠ No match por email para featured ${doc.id} (${email})`);
      continue;
    }
    const { uid } = byEmail.get(email);
    await doc.ref.set({
      userUid: uid,
      userRef: db.doc(`users/${uid}`),
      featured: true,
      updatedAt: Date.now()
    }, { merge: true });
    console.log(`✔ Enlazado ${doc.id} → users/${uid}`);
  }

  console.log("✅ Listo");
  process.exit(0);
})();
