// src/data/firestoreData/CompaniesFromFirestore.ts
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../../config/firebase";

export const fetchFeaturedCompanies = async (max = 10) => {
  const col = collection(db, "featured_companies");
  // sin orderBy para evitar índice compuesto
  const q = query(col, where("featured", "==", true), limit(max));
  const snap = await getDocs(q);

  const list = snap.docs.map((d) => {
    const data = d.data() || {};
    return {
      id: d.id,
      name: data.name || "Empresa",
      logo: data.logo || null,
      rating: data.rating ?? 4.8,
      featured: !!data.featured,
      tags: data.tags || [],
      shortDescription: data.shortDescription || "",
      services: data.services || [],
      coverage: data.coverage || "",
      experience: data.experience || "",
      team: data.team || "",
      warranty: data.warranty || "",
      usp: data.usp || "",
      contact: data.contact || {},
    };
  });

  // ordena por nombre en el cliente
  list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
};
