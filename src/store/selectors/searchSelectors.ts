import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";

// ---------- helpers ----------
const normalize = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const prettifySlug = (s?: string) => {
  if (!s) return "";
  // "construcción_en_general" -> "Construcción en general"
  // "santiago-centro" -> "Santiago centro"
  const clean = s.replace(/[_-]/g, " ").trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

const joinLabels = (arr?: string[]) =>
  (arr || []).map(prettifySlug).filter(Boolean).join(", ");

// ---------- types ----------
type RawProductService = {
  id: string;
  title?: string;
  searchableTitle?: string;
  description?: string;
  images?: string[];
  categoryIds?: string[];
  areaIds?: string[];
  locationIds?: string[];
  ownerName?: string;
  author?: { name?: string; email?: string; id?: string };
  pricing?: {
    currency?: string;
    price?: number | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    type?: "fixed" | "quote";
    notes?: string | null;
    summary?: string | null;
  };
  // ...otros campos
};

export type SearchableService = {
  id: string;
  title: string;            // título a mostrar
  subtitle: string;         // metadata resumida (categoría • área • ubicaciones)
  description?: string;
  priceSummary?: string;    // pricing.summary (ej: "A cotizar", "$50.000")
  image?: string;           // primer image si hay
  __raw: RawProductService; // por si necesitas todo al navegar
};

// ---------- base selectors ----------
const selectProducts = (state: RootState) =>
  (state.productSlice?.products as RawProductService[]) || [];

// Mapea products-> SearchableService (memoizado)
export const selectSearchables = createSelector([selectProducts], (products) => {
  return products.map((p) => {
    const title =
      p.title?.trim() ||
      p.searchableTitle?.trim() ||
      "Servicio"; // fallback

    const categories = joinLabels(p.categoryIds);
    const areas = joinLabels(p.areaIds);
    const locations = joinLabels(p.locationIds);

    const parts = [categories, areas, locations].filter(Boolean);
    const subtitle = parts.join(" • ");

    return {
      id: p.id,
      title,
      subtitle,
      description: p.description || "",
      priceSummary: p.pricing?.summary || undefined,
      image: p.images?.[0],
      __raw: p,
    } as SearchableService;
  });
});

// selector de filtro por query (memoizado)
const selectQuery = (_: RootState, q: string) => q;

export const selectFilteredSearchables = createSelector(
  [selectSearchables, selectQuery],
  (items, q) => {
    const nQ = normalize(q).trim();
    if (!nQ) return [];

    return items.filter((it) => {
      const raw = it.__raw;
      const haystack = normalize(
        [
          it.title,
          it.description,
          it.subtitle,
          raw?.searchableTitle,
          raw?.ownerName,
          raw?.author?.name,
          ...(raw?.categoryIds || []),
          ...(raw?.areaIds || []),
          ...(raw?.locationIds || []),
        ]
          .filter(Boolean)
          .join(" ")
      );
      return haystack.includes(nQ);
    });
  }
);
