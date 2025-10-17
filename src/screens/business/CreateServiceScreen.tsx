// screens/business/CreateServiceScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Modal,
  FlatList,
  Platform,
  SectionList,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  writeBatch,
  doc,
  setDoc,
} from "firebase/firestore";
import { db, storage } from "../../config/firebase";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { v4 as uuidv4 } from "uuid";

// Importa datos de Chile
import { regionSections, communesFlat } from "../../data/locations/chile";

// ---------------- Tipos ----------------
type AreaWithCats = {
  id: string;
  name: string;
  screen?: string;
  // En Redux llegan como objetos { id, title, img }
  categories?: Array<{ id: string; title?: string; name?: string; img?: string } | string>;
};

type Area = { id: string; name: string }; // solo para UI (chips)
type Category = { id: string; name: string; areaIds: string[] };

type PriceType = "fixed" | "from" | "quote";

type FormValues = {
  title: string;
  description: string;
  priceType: PriceType;     // Fijo | Desde | A cotizar
  price?: number | null;    // para "fixed"
  minPrice?: number | null; // para "from"
  maxPrice?: number | null; // opcional "from"
  pricingNotes?: string;    // notas opcionales
  categoryId_dummy?: string;
  locationIds: string[];
};

// ---------------- Helpers ----------------
const prettyNameFromSlug = (slug: string) =>
  String(slug).replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

const catIdName = (raw: any): { id: string; name: string } => {
  if (typeof raw === "string") return { id: raw, name: prettyNameFromSlug(raw) };
  const id = String(raw?.id ?? "");
  if (!id) return { id: "", name: "" };
  const name = String(raw?.title ?? raw?.name ?? prettyNameFromSlug(id));
  return { id, name };
};

const schema = yup.object({
  title: yup.string().required("Ingresa un título").min(3, "Mínimo 3 caracteres"),
  description: yup.string().required("Describe tu servicio").min(10, "Mínimo 10 caracteres"),
  priceType: yup.mixed<PriceType>().oneOf(["fixed", "from", "quote"]).required(),
  price: yup
    .number()
    .typeError("Precio inválido")
    .when("priceType", {
      is: "fixed",
      then: (s) => s.required("Ingresa un precio").min(0, "No puede ser negativo"),
      otherwise: (s) => s.nullable().transform(() => null),
    }),
  minPrice: yup
    .number()
    .typeError("Precio inválido")
    .when("priceType", {
      is: "from",
      then: (s) => s.required("Ingresa un precio base").min(0, "No puede ser negativo"),
      otherwise: (s) => s.nullable().transform(() => null),
    }),
  maxPrice: yup
    .number()
    .typeError("Precio inválido")
    .nullable()
    .transform((v, o) => (String(o).trim() === "" ? null : v))
    .test("max>=min", "El máximo debe ser mayor o igual al mínimo", function (value) {
      const { priceType, minPrice } = this.parent as FormValues;
      if (priceType !== "from" || value == null || minPrice == null) return true;
      return value >= minPrice;
    }),
  pricingNotes: yup.string().max(300, "Máximo 300 caracteres").nullable(),
  categoryId_dummy: yup.mixed().nullable(),
});

export default function CreateServiceScreen() {
  const user = useSelector((s: RootState) => s.userSlice);
  const areasFromRedux = useSelector((s: RootState) => s.areaSlice.areas) as AreaWithCats[] | undefined;

  const [imageUri, setImageUri] = useState<string | null>(null);

  // ÁREAS / CATEGORÍAS
  const [allAreas, setAllAreas] = useState<Area[]>([]); // UI: id + name
  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>([]);

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  // LOCALIDADES (COMUNAS)
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const [openLocationsModal, setOpenLocationsModal] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");

  // MODALES
  const [openAreasModal, setOpenAreasModal] = useState(false);
  const [openCategoriesModal, setOpenCategoriesModal] = useState(false);

  // BÚSQUEDAS
  const [searchArea, setSearchArea] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  // FORM
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      priceType: "fixed",
      price: null,
      minPrice: null,
      maxPrice: null,
      pricingNotes: "",
    },
  });

  const priceType = watch("priceType");

  // --------- Cargar Áreas: primero Redux; si no, Firestore (solo id+name) ----------
  useEffect(() => {
    async function loadAreas() {
      if (areasFromRedux && areasFromRedux.length) {
        setAllAreas(areasFromRedux.map((a) => ({ id: a.id, name: a.name })));
        return;
      }
      // Fallback simple: si no hay Redux, trae las áreas para llenar el selector
      const snap = await getDocs(collection(db, "areas"));
      const arr: Area[] = [];
      snap.forEach((d) => {
        const data = d.data() as any;
        arr.push({ id: d.id, name: data.name || "Área" });
      });
      setAllAreas(arr);
    }
    loadAreas();
  }, [areasFromRedux]);

  // --------- Cargar Categorías en base a Áreas seleccionadas (desde Redux) ----------
  useEffect(() => {
    function loadCategoriesFromSelectedAreas() {
      if (!selectedAreaIds.length || !areasFromRedux?.length) {
        setAllCategories([]);
        setFilteredCategories([]);
        setSelectedCategoryIds([]);
        return;
      }

      const selectedAreas = areasFromRedux.filter((a) => selectedAreaIds.includes(a.id));
      const catMap: Record<string, Category> = {};

      for (const area of selectedAreas) {
        const rawCats = Array.isArray(area.categories) ? area.categories : [];
        for (const raw of rawCats) {
          const { id, name } = catIdName(raw);
          if (!id) continue;
          if (!catMap[id]) catMap[id] = { id, name, areaIds: [area.id] };
          else if (!catMap[id].areaIds.includes(area.id)) catMap[id].areaIds.push(area.id);
        }
      }

      const list = Object.values(catMap).sort((a, b) => a.name.localeCompare(b.name));
      setAllCategories(list);
      setFilteredCategories(list);
      setSelectedCategoryIds((prev) => prev.filter((id) => !!catMap[id]));
    }

    loadCategoriesFromSelectedAreas();
  }, [selectedAreaIds, areasFromRedux]);

  // Secciones de categorías agrupadas por Área (para el modal)
  const categorySections = useMemo(() => {
    if (!selectedAreaIds.length || !areasFromRedux?.length) return [];

    return selectedAreaIds
      .map((areaId) => {
        const area = areasFromRedux.find((a) => a.id === areaId);
        if (!area) return null;

        const rawCats = Array.isArray(area.categories) ? area.categories : [];
        const seen: Record<string, boolean> = {};
        const data = rawCats
          .map((raw) => {
            if (typeof raw === "string") {
              const id = raw;
              const name = id.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
              return { id, name };
            }
            const id = String(raw?.id ?? "");
            if (!id) return null;
            const name = String(
              raw?.title ?? raw?.name ?? id.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())
            );
            return { id, name };
          })
          .filter(Boolean)
          .filter((cat) => {
            if (!cat) return false;
            if (seen[cat.id]) return false;
            seen[cat.id] = true;
            return true;
          })
          .filter((cat) =>
            searchCategory.trim()
              ? cat!.name.toLowerCase().includes(searchCategory.trim().toLowerCase())
              : true
          )
          .sort((a, b) => a!.name.localeCompare(b!.name)) as Array<{ id: string; name: string }>;

        return {
          title: area.name ?? "Área",
          areaId: area.id,
          data,
        };
      })
      .filter(Boolean);
  }, [selectedAreaIds, searchCategory, areasFromRedux]);

  // --------- Búsquedas ----------
  const visibleAreas = useMemo(() => {
    const s = searchArea.trim().toLowerCase();
    if (!s) return allAreas;
    return allAreas.filter((a) => a.name.toLowerCase().includes(s));
  }, [allAreas, searchArea]);

  const visibleCategories = useMemo(() => {
    const s = searchCategory.trim().toLowerCase();
    if (!s) return filteredCategories;
    return filteredCategories.filter((c) => c.name.toLowerCase().includes(s));
  }, [filteredCategories, searchCategory]);

  // --------- Localidades helpers ----------
  const communeNameById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of communesFlat) map[c.id] = c.name;
    return map;
  }, []);

  const locationSections = useMemo(() => {
    const q = searchLocation.trim().toLowerCase();
    if (!q) return regionSections;
    const filtered = regionSections
      .map((sec) => ({
        ...sec,
        data: sec.data.filter((c: { id: string; name: string }) => c.name.toLowerCase().includes(q)),
      }))
      .filter((sec) => sec.data.length > 0);
    return filtered;
  }, [searchLocation]);

  // --------- Imagen ----------
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (!res.canceled) setImageUri(res.assets[0].uri);
  };

  // const uploadImageIfAny = async () => {
  //   if (!imageUri) return null;
  //   const response = await fetch(imageUri);
  //   const blob = await response.blob();
  //   const id = uuidv4();
  //   const storageRef = ref(storage, `services/${user.uid}/${id}.jpg`);
  //   await uploadBytes(storageRef, blob);
  //   return await getDownloadURL(storageRef);
  // };
  const uploadImageIfAny = async (): Promise<string | null> => {
  return null; // omitimos Storage por ahora
};

  // Helper para formatear CLP sin dependencias
  const clp = (n?: number | null) =>
    typeof n === "number" ? `$${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}` : "";

  // --------- Submit ----------
// --------- Submit ----------
const onSubmit = async (data: FormValues) => {
  // ... (validaciones iguales)

  try {
    // Omitimos Storage:
    const imageUrl: string | null = null;

    let priceSummary = "";
    if (data.priceType === "fixed") priceSummary = clp(data.price);
    if (data.priceType === "from") {
      priceSummary = `Desde ${clp(data.minPrice)}` + (data.maxPrice ? ` a ${clp(data.maxPrice)}` : "");
    }
    if (data.priceType === "quote") priceSummary = "A cotizar";

    const serviceId = doc(collection(db, "services")).id;

    const basePayload = {
      id: serviceId,
      title: data.title,
      description: data.description,
      pricing: {
        type: data.priceType as PriceType,
        price: data.price ?? null,
        minPrice: data.minPrice ?? null,
        maxPrice: data.maxPrice ?? null,
        notes: data.pricingNotes?.trim() || null,
        summary: priceSummary,
        currency: "CLP",
      },
      // Compat con código antiguo
      price: data.priceType === "fixed" ? Number(data.price) : null,

      // 🚫 Sin imagen por ahora
      images: [], // <-- importante: array vacío
      ownerId: user.uid,
      ownerName: user.displayName || user.email,
      ownerEmail: user.email ?? null,
      areaIds: selectedAreaIds,
      categoryIds: selectedCategoryIds,
      locationIds: selectedLocationIds,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const batch = writeBatch(db);

    // services/{serviceId}
    batch.set(doc(db, "services", serviceId), basePayload);

    // availableProducts/{serviceId}
    batch.set(doc(db, "services", serviceId), {
      ...basePayload,
      author: {
        id: user.uid,
        name: user.displayName || null,
        email: user.email || null,
      },
      searchableTitle: data.title.toLowerCase(),
    });

    // Índices áreas->categorías->products/{serviceId}
    const catById: Record<string, Category> = {};
    for (const c of allCategories) catById[c.id] = c;

    const indexPaths = new Set<string>();
    for (const categoryId of selectedCategoryIds) {
      const cat = catById[categoryId];
      const resolvedAreas = (cat?.areaIds?.length ? cat.areaIds : selectedAreaIds)
        .filter((a) => selectedAreaIds.includes(a));
      const areaIdsForThisCat = resolvedAreas.length ? resolvedAreas : selectedAreaIds;

      for (const areaId of areaIdsForThisCat) {
        const path = `areas/${areaId}/categories/${categoryId}/products/${serviceId}`;
        if (indexPaths.has(path)) continue;
        indexPaths.add(path);

        batch.set(doc(db, "areas", areaId, "categories", categoryId, "products", serviceId), {
          id: serviceId,
          title: data.title,
          pricing: basePayload.pricing,
          price: basePayload.price,
          ownerId: user.uid,
          ownerName: user.displayName || user.email,
          images: [], // <-- sin imagen
          locationIds: selectedLocationIds,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          searchableTitle: data.title.toLowerCase(),
          areaId,
          categoryId,
        });
      }
    }

    await batch.commit();

    Alert.alert("Éxito", "Servicio creado y publicado (sin imagen).");
    reset();
    setImageUri(null);
    setSelectedAreaIds([]);
    setSelectedCategoryIds([]);
    setSelectedLocationIds([]);
  } catch (e: any) {
    console.error(e);
    Alert.alert("Error", e?.message ?? "No se pudo crear el servicio");
  }
};


  // --------- Helpers UI ----------
  const toggleArea = (id: string) =>
    setSelectedAreaIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleCategory = (id: string) =>
    setSelectedCategoryIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleLocation = (id: string) =>
    setSelectedLocationIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // ---------------- Render ----------------
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.h1}>Nuevo servicio</Text>
        <Text style={styles.subtitle}>Selecciona áreas, categorías, comunas e imagen.</Text>

        {/* Título */}
        <View style={styles.field}>
          <Text style={styles.label}>Título</Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Instalación de aire acondicionado"
                placeholderTextColor="#9aa4af"
              />
            )}
          />
          {errors.title && <Text style={styles.err}>{errors.title.message}</Text>}
        </View>

        {/* Descripción */}
        <View style={styles.field}>
          <Text style={styles.label}>Descripción</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[styles.input, styles.textarea, errors.description && styles.inputError]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                placeholder="Describe el servicio, materiales, garantías, tiempos, etc."
                placeholderTextColor="#9aa4af"
              />
            )}
          />
          {errors.description && <Text style={styles.err}>{errors.description.message}</Text>}
        </View>

        {/* Tipo de precio */}
        <View style={styles.field}>
          <Text style={styles.label}>Tipo de precio</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {([
              { id: "fixed", label: "Fijo" },
              { id: "from", label: "Desde" },
              { id: "quote", label: "A cotizar" },
            ] as const).map((opt) => (
              <Controller
                key={opt.id}
                control={control}
                name="priceType"
                render={({ field: { value, onChange } }) => {
                  const selected = value === opt.id;
                  return (
                    <Pressable
                      onPress={() => {
                        onChange(opt.id);
                        // Limpia campos que no aplican al cambiar
                        setValue("price", null);
                        setValue("minPrice", null);
                        setValue("maxPrice", null);
                      }}
                      style={[styles.segment, selected && styles.segmentSelected]}
                    >
                      <Text style={[styles.segmentText, selected && styles.segmentTextSel]}>{opt.label}</Text>
                    </Pressable>
                  );
                }}
              />
            ))}
          </View>
          {errors.priceType && <Text style={styles.err}>{String(errors.priceType.message)}</Text>}
        </View>

        {/* Precio fijo */}
        {priceType === "fixed" && (
          <View style={styles.field}>
            <Text style={styles.label}>Precio (CLP)</Text>
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={[styles.input, errors.price && styles.inputError]}
                  value={value == null ? "" : String(value)}
                  onChangeText={(t) => onChange(Number(t.replace(/[^0-9]/g, "")) || null)}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  placeholder="45000"
                  placeholderTextColor="#9aa4af"
                />
              )}
            />
            {errors.price && <Text style={styles.err}>{errors.price.message}</Text>}
          </View>
        )}

        {/* Precio 'Desde' */}
        {priceType === "from" && (
          <>
            <View style={styles.field}>
              <Text style={styles.label}>Precio base (CLP) — “Desde”</Text>
              <Controller
                control={control}
                name="minPrice"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    style={[styles.input, errors.minPrice && styles.inputError]}
                    value={value == null ? "" : String(value)}
                    onChangeText={(t) => onChange(Number(t.replace(/[^0-9]/g, "")) || null)}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    placeholder="45000"
                    placeholderTextColor="#9aa4af"
                  />
                )}
              />
              {errors.minPrice && <Text style={styles.err}>{errors.minPrice.message}</Text>}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Precio máximo (opcional)</Text>
              <Controller
                control={control}
                name="maxPrice"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    style={[styles.input, errors.maxPrice && styles.inputError]}
                    value={value == null ? "" : String(value)}
                    onChangeText={(t) => onChange(t.trim() ? Number(t.replace(/[^0-9]/g, "")) : null)}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    placeholder="120000"
                    placeholderTextColor="#9aa4af"
                  />
                )}
              />
              {errors.maxPrice && <Text style={styles.err}>{errors.maxPrice.message}</Text>}
            </View>
          </>
        )}

        {/* A cotizar: notas opcionales */}
        {priceType === "quote" && (
          <View style={styles.field}>
            <Text style={styles.label}>Notas de precio (opcional)</Text>
            <Controller
              control={control}
              name="pricingNotes"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={[styles.input, styles.textarea]}
                  value={value ?? ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  placeholder="Ej: Requiere visita técnica. Varía según materiales, acceso y pendientes del terreno."
                  placeholderTextColor="#9aa4af"
                />
              )}
            />
            {errors.pricingNotes && <Text style={styles.err}>{errors.pricingNotes.message}</Text>}
          </View>
        )}

        {/* Áreas (multi) */}
        <View style={styles.field}>
          <Text style={styles.label}>Áreas</Text>
          <View style={styles.chipsWrap}>
            {selectedAreaIds.length === 0 ? (
              <Text style={styles.helper}>Ninguna seleccionada</Text>
            ) : (
              selectedAreaIds.map((id) => {
                const a = allAreas.find((x) => x.id === id);
                return (
                  <View key={id} style={styles.chipSelected}>
                    <Text style={styles.chipSelectedText}>{a?.name ?? id}</Text>
                  </View>
                );
              })
            )}
          </View>
          <Pressable style={styles.btnOutline} onPress={() => setOpenAreasModal(true)}>
            <Text style={styles.btnOutlineText}>Seleccionar áreas</Text>
          </Pressable>
        </View>

        {/* Categorías (multi, dependientes) */}
        <View style={styles.field}>
          <Text style={styles.label}>Categorías</Text>
          <View style={styles.chipsWrap}>
            {selectedCategoryIds.length === 0 ? (
              <Text style={styles.helper}>Ninguna seleccionada</Text>
            ) : (
              selectedCategoryIds.map((id) => {
                const c = allCategories.find((x) => x.id === id);
                return (
                  <View key={id} style={styles.chipSelectedAlt}>
                    <Text style={styles.chipSelectedAltText}>{c?.name ?? id}</Text>
                  </View>
                );
              })
            )}
          </View>
          <Pressable
            style={[styles.btnOutline, !selectedAreaIds.length && { opacity: 0.6 }]}
            onPress={() => selectedAreaIds.length && setOpenCategoriesModal(true)}
          >
            <Text style={styles.btnOutlineText}>Seleccionar categorías</Text>
          </Pressable>
          {!selectedAreaIds.length && (
            <Text style={[styles.helper, { marginTop: 6 }]}>
              Primero selecciona una o más áreas para cargar categorías.
            </Text>
          )}
        </View>

        {/* Localidades (multi) */}
        <View style={styles.field}>
          <Text style={styles.label}>Localidades (comunas)</Text>
          <View style={styles.chipsWrap}>
            {selectedLocationIds.length === 0 ? (
              <Text style={styles.helper}>Ninguna seleccionada</Text>
            ) : (
              selectedLocationIds.map((id) => (
                <View key={id} style={styles.chipSelected}>
                  <Text style={styles.chipSelectedText}>{communeNameById[id] ?? id}</Text>
                </View>
              ))
            )}
          </View>

          <Pressable style={styles.btnOutline} onPress={() => setOpenLocationsModal(true)}>
            <Text style={styles.btnOutlineText}>Seleccionar comunas</Text>
          </Pressable>
        </View>

        {/* Uploader */}
        <View style={styles.field}>
          <Text style={styles.label}>Imagen</Text>
          <Pressable onPress={pickImage} style={styles.uploader}>
            <Text style={styles.uploaderText}>{imageUri ? "Cambiar imagen" : "Subir imagen"}</Text>
            <Text style={styles.uploaderHint}>JPG o PNG (máx recomendado 2 MB)</Text>
          </Pressable>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
        </View>

        {/* Acciones */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.btn,
              styles.btnPrimary,
              (pressed || isSubmitting) && styles.btnPressed,
              isSubmitting && styles.btnDisabled,
            ]}
          >
            <Text style={styles.btnPrimaryText}>{isSubmitting ? "Guardando..." : "Publicar servicio"}</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              reset();
              setImageUri(null);
              setSelectedAreaIds([]);
              setSelectedCategoryIds([]);
              setSelectedLocationIds([]);
            }}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.btn,
              styles.btnOutline,
              pressed && styles.btnOutlinePressed,
              isSubmitting && styles.btnDisabled,
            ]}
          >
            <Text style={styles.btnOutlineText}>Limpiar</Text>
          </Pressable>
        </View>
      </View>

      {/* MODAL ÁREAS */}
      <Modal visible={openAreasModal} animationType="slide">
        <View style={styles.modalWrap}>
          <Text style={styles.modalTitle}>Seleccionar áreas</Text>
          <TextInput
            placeholder="Buscar área..."
            placeholderTextColor="#9aa4af"
            value={searchArea}
            onChangeText={setSearchArea}
            style={styles.searchInput}
          />
        <FlatList
            data={visibleAreas}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item }) => {
              const selected = selectedAreaIds.includes(item.id);
              return (
                <Pressable onPress={() => toggleArea(item.id)} style={[styles.rowItem, selected && styles.rowItemSelected]}>
                  <Text style={[styles.rowItemText, selected && styles.rowItemTextSel]}>{item.name}</Text>
                </Pressable>
              );
            }}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
          <Pressable style={styles.modalClose} onPress={() => setOpenAreasModal(false)}>
            <Text style={styles.modalCloseText}>Listo</Text>
          </Pressable>
        </View>
      </Modal>

      {/* MODAL CATEGORÍAS (agrupadas por Área) */}
      <Modal visible={openCategoriesModal} animationType="slide">
        <View style={styles.modalWrap}>
          <Text style={styles.modalTitle}>Seleccionar categorías</Text>
          <TextInput
            placeholder="Buscar categoría..."
            placeholderTextColor="#9aa4af"
            value={searchCategory}
            onChangeText={setSearchCategory}
            style={styles.searchInput}
          />

          <SectionList
            sections={
              categorySections as Array<{
                title: string;
                areaId: string;
                data: Array<{ id: string; name: string }>;
              }>
            }
            keyExtractor={(item, index) => `${item.id}:${index}`}
            stickySectionHeadersEnabled
            renderSectionHeader={({ section }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            SectionSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => {
              const selected = selectedCategoryIds.includes(item.id);
              return (
                <Pressable
                  onPress={() => toggleCategory(item.id)}
                  style={[styles.rowItem, selected && styles.rowItemSelectedAlt]}
                >
                  <Text style={[styles.rowItemText, selected && styles.rowItemTextSelAlt]}>{item.name}</Text>
                </Pressable>
              );
            }}
            contentContainerStyle={{ paddingBottom: 16 }}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", color: "#7a8794", marginTop: 12 }}>
                {selectedAreaIds.length ? "No hay categorías para mostrar." : "Primero selecciona una o más áreas."}
              </Text>
            }
          />

          <Pressable style={styles.modalClose} onPress={() => setOpenCategoriesModal(false)}>
            <Text style={styles.modalCloseText}>Listo</Text>
          </Pressable>
        </View>
      </Modal>

      {/* MODAL LOCALIDADES (agrupadas por región) */}
      <Modal visible={openLocationsModal} animationType="slide">
        <View style={styles.modalWrap}>
          <Text style={styles.modalTitle}>Seleccionar comunas</Text>

          <TextInput
            placeholder="Buscar comuna..."
            placeholderTextColor="#9aa4af"
            value={searchLocation}
            onChangeText={setSearchLocation}
            style={styles.searchInput}
          />

          <SectionList
            sections={
              locationSections as Array<{
                title: string;
                regionId: string;
                data: Array<{ id: string; name: string }>;
              }>
            }
            keyExtractor={(item, index) => `${item.id}:${index}`}
            stickySectionHeadersEnabled
            renderSectionHeader={({ section }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            SectionSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => {
              const selected = selectedLocationIds.includes(item.id);
              return (
                <Pressable onPress={() => toggleLocation(item.id)} style={[styles.rowItem, selected && styles.rowItemSelected]}>
                  <Text style={[styles.rowItemText, selected && styles.rowItemTextSel]}>{item.name}</Text>
                </Pressable>
              );
            }}
            contentContainerStyle={{ paddingBottom: 16 }}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", color: "#7a8794", marginTop: 12 }}>
                No hay comunas que coincidan con tu búsqueda.
              </Text>
            }
          />

          <Pressable style={styles.modalClose} onPress={() => setOpenLocationsModal(false)}>
            <Text style={styles.modalCloseText}>Listo</Text>
          </Pressable>
        </View>
      </Modal>
    </ScrollView>
  );
}

const KSA = {
  bg: "#0f2535",
  accent: "#ff8a3d",
  surface: "#ffffff",
  surfaceAlt: "#F3F4F6",
  text: "#0b1220",
  muted: "#6b7785",
  border: "#e9eef4",
  primary: "#0da2ff",
  danger: "#ef4444",
};

const styles = StyleSheet.create({
  screen: { padding: 16, backgroundColor: KSA.surfaceAlt },
  card: {
    backgroundColor: KSA.surface,
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eef2f7",
  },
  h1: { fontSize: 22, fontWeight: "800", color: KSA.text },
  subtitle: { marginTop: 6, fontSize: 13, color: KSA.muted },

  field: { marginTop: 14 },
  label: { marginBottom: 6, fontSize: 13, fontWeight: "700", color: KSA.text },
  input: {
    borderWidth: 1.2,
    borderColor: KSA.border,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 15,
    color: KSA.text,
  },
  textarea: { minHeight: 110, textAlignVertical: "top", lineHeight: 20 },
  inputError: { borderColor: "#fecaca", backgroundColor: "#fffafa" },
  err: { marginTop: 6, color: KSA.danger, fontSize: 12, fontWeight: "700" },
  helper: { marginTop: 6, color: KSA.muted, fontSize: 12 },

  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chipSelected: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipSelectedText: { color: "#065F46", fontWeight: "800", fontSize: 12 },
  chipSelectedAlt: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipSelectedAltText: { color: "#1E3A8A", fontWeight: "800", fontSize: 12 },

  uploader: {
    borderWidth: 1.5,
    borderColor: KSA.border,
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  uploaderText: { fontWeight: "800", color: KSA.bg },
  uploaderHint: { marginTop: 4, fontSize: 12, color: KSA.muted },
  preview: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: KSA.border,
  },

  actionsRow: { flexDirection: "row", gap: 10, marginTop: 18 },
  btn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: KSA.primary },
  btnPrimaryText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1.2,
    borderColor: KSA.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  btnOutlineText: { color: KSA.text, fontWeight: "700", fontSize: 15 },
  btnPressed: {
    opacity: Platform.select({ ios: 0.7, android: 0.85 }),
    transform: [{ scale: 0.996 }],
  },
  btnOutlinePressed: {
    backgroundColor: "#fafafa",
    transform: [{ scale: 0.996 }],
  },
  btnDisabled: { opacity: 0.7 },

  // Segmented
  segment: {
    borderWidth: 1.2,
    borderColor: KSA.border,
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  segmentSelected: { backgroundColor: "#EEF2FF", borderColor: "#C7D2FE" },
  segmentText: { color: KSA.text, fontWeight: "700", fontSize: 13 },
  segmentTextSel: { color: "#3730A3", fontWeight: "800" },

  // MODALES
  modalWrap: { flex: 1, backgroundColor: "#fff", padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "800", color: KSA.text, marginBottom: 10 },
  searchInput: {
    borderWidth: 1.2,
    borderColor: KSA.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: KSA.text,
    marginBottom: 10,
  },
  rowItem: {
    borderWidth: 1,
    borderColor: KSA.border,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  rowItemSelected: { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" },
  rowItemSelectedAlt: { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" },
  rowItemText: { color: KSA.text, fontWeight: "600" },
  rowItemTextSel: { color: "#065F46", fontWeight: "800" },
  rowItemTextSelAlt: { color: "#1E3A8A", fontWeight: "800" },
  modalClose: {
    marginTop: 12,
    backgroundColor: KSA.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalCloseText: { color: "#fff", fontWeight: "800" },
  sectionHeader: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: KSA.border,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  sectionHeaderText: { fontWeight: "800", color: KSA.text },
});
