// store/reducers/servicesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../config/firebase";

export type ServicePricing = {
  type: "fixed" | "from" | "quote";
  price: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  notes: string | null;
  summary: string; // e.g. "$45.000" | "Desde $45.000" | "A cotizar"
  currency: "CLP";
};

export type Service = {
  id: string;
  title: string;
  description: string;
  images: string[];
  pricing: ServicePricing;
  price: number | null; // compat
  ownerId: string;
  ownerName?: string | null;
  ownerEmail?: string | null;
  areaIds: string[];
  categoryIds: string[];
  locationIds: string[];
  isActive: boolean;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
};

type ServicesState = {
  items: Service[];
  loading: boolean;
  error: string | null;
  // stats simples
  total: number;
  active: number;
  inactive: number;
  // control de suscripción
  listeningUid: string | null;
};

const initialState: ServicesState = {
  items: [],
  loading: false,
  error: null,
  total: 0,
  active: 0,
  inactive: 0,
  listeningUid: null,
};

// --- Helper: parse doc ---
const toService = (docSnap: DocumentData): Service => {
  const d = docSnap.data();
  return {
    id: docSnap.id, // usa el id del doc
    title: d.title ?? "",
    description: d.description ?? "",
    images: Array.isArray(d.images) ? d.images : [],
    pricing: d.pricing,
    price: d.price ?? null,
    // 🔁 mapeo desde availableProducts
    ownerId: d.author?.id ?? d.ownerId, // por compat
    ownerName: d.author?.name ?? d.ownerName ?? null,
    ownerEmail: d.author?.email ?? d.ownerEmail ?? null,
    areaIds: d.areaIds ?? [],
    categoryIds: d.categoryIds ?? [],
    locationIds: d.locationIds ?? [],
    isActive: d.isActive ?? true,
    createdAt: d.createdAt ?? null,
    updatedAt: d.updatedAt ?? null,
  };
};

// --- Suscriptor en tiempo real ---
// Lo exponemos como función para que el componente la controle (montar/desmontar).
export const startMyServicesListener = (
  dispatch: any,
  uid: string
): (() => void) => {
  dispatch(setLoading(true));
  dispatch(setListeningUid(uid));

 const q = query(
  collection(db, "availableProducts"),
  where("author.id", "==", uid),
  orderBy("createdAt", "desc")
);


 const unsub = onSnapshot(
  q,
  (snap) => {
    console.log("DBG services snapshot size =>", snap.size);
    const arr: Service[] = [];
    snap.forEach((docSnap) => arr.push(toService(docSnap)));
    console.log("DBG services ids =>", arr.map(a => a.id));
    dispatch(setItems(arr));
    dispatch(setLoading(false));
  },
  (err) => {
    console.log("DBG services snapshot ERROR =>", err?.code, err?.message);
    dispatch(setError(err?.message ?? "Error al escuchar servicios"));
    dispatch(setLoading(false));
  }
);

  return unsub;
};

// --- Thunk opcional: carga una vez (sin escuchar) ---
export const loadMyServicesOnce = createAsyncThunk<
  Service[],
  { uid: string },
  { rejectValue: string }
>("services/loadOnce", async ({ uid }, { rejectWithValue }) => {
  try {
   const q = query(
  collection(db, "availableProducts"),
  where("author.id", "==", uid),
  orderBy("createdAt", "desc")
);

    return await new Promise<Service[]>((resolve, reject) => {
      const unsub = onSnapshot(
        q,
        (snap) => {
          const arr: Service[] = [];
          snap.forEach((docSnap) => arr.push(toService(docSnap)));
          unsub(); // cortamos de inmediato (una vez)
          resolve(arr);
        },
        (err) => reject(err)
      );
    });
  } catch (e: any) {
    return rejectWithValue(e?.message ?? "No se pudo cargar");
  }
});

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<Service[]>) {
      state.items = action.payload;
      console.log(state.items);
      state.total = action.payload.length;
      state.active = action.payload.filter((s) => s.isActive).length;
      state.inactive = state.total - state.active;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setListeningUid(state, action: PayloadAction<string | null>) {
      state.listeningUid = action.payload;
    },
    resetServicesState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMyServicesOnce.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMyServicesOnce.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload;
        state.total = payload.length;
        state.active = payload.filter((s) => s.isActive).length;
        state.inactive = state.total - state.active;
      })
      .addCase(loadMyServicesOnce.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Error";
      });
  },
});

export const {
  setItems,
  setLoading,
  setError,
  setListeningUid,
  resetServicesState,
} = servicesSlice.actions;

export default servicesSlice.reducer;
