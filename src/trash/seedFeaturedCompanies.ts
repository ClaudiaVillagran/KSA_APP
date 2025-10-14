import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/** Normaliza ID a slug si no viene uno */
const slugify = (s: string) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/** Normaliza teléfono a solo dígitos (para WhatsApp, etc.) */
const onlyDigits = (s?: string) => (s ? s.replace(/[^\d]/g, "") : "");

type RawCompany = {
  id?: string;                // opcional
  nombre: string;
  descripcion?: string;
  servicios?: string[];
  cobertura?: string;
  experiencia?: string;
  equipo?: string;
  respaldo?: string;
  diferencial?: string;
  whatsapp?: string;
  sitio?: string;
  instagram?: string;
  facebook?: string;
  email?: string;
  logo?: string;
};

/** Carga/actualiza 1 empresa en /featured_companies/{id} */
export const upsertFeaturedCompany = async (c: RawCompany) => {
  const id = c.id || slugify(c.nombre);
  const ref = doc(collection(db, "featured_companies"), id);

  await setDoc(ref, {
    name: c.nombre,
    shortDescription: c.descripcion || "",
    services: c.servicios || [],
    coverage: c.cobertura || "",
    experience: c.experiencia || "",
    team: c.equipo || "",
    warranty: c.respaldo || "",
    usp: c.diferencial || "",
    contact: {
      whatsapp: onlyDigits(c.whatsapp),
      site: c.sitio || "",
      instagram: c.instagram || "",
      facebook: c.facebook || "",
      email: c.email || "",
    },
    // campos estándar para la sección
    featured: true,
    rating: 4.8,
    logo: c.logo,
    tags: [],
    updatedAt: Date.now(),
  }, { merge: true });
};

/** Carga masiva desde un objeto tipo { clave: ficha } */
export const seedFeaturedCompanies = async (dict: Record<string, RawCompany>) => {
  const entries = Object.entries(dict);
  for (const [, company] of entries) {
    await upsertFeaturedCompany(company);
  }
};
