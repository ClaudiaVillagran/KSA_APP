// screens/company/CompanyProfileScreen.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { db } from "../../config/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  DocumentData,
} from "firebase/firestore";
import ServiceCard from "../../components/cards/ServiceCard";
import { addItemToCart } from "../../store/reducers/cartSlice";

type ParamList = { CompanyProfile: { companyId: string } };

type FeaturedCompany = {
  id: string;
  name: string;
  logo?: string;
  shortDescription?: string;
  rating?: number;
  experience?: string;
  coverage?: string;
  usp?: string;
  warranty?: string;
  team?: string;
  tags?: string[];
  userUid?: string;
  userRef?: { id?: string };
};

type Service = {
  id: string;
  title: string;
  description?: string;
  images?: (string | { url: string })[];
  pricing?: {
    currency?: "CLP";
    type?: "fixed" | "from" | "quote";
    price?: number | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    notes?: string | null;
    summary?: string;
  };
  price?: number | null; // a veces viene aquí
  type?: string; // a veces viene en root
  isActive?: boolean;
  locationIds?: string[];
  categoryIds?: string[];
  createdAt?: any;
  ownerId?: string;
  author?: { id?: string; name?: string; email?: string };
};

/** Señal de cotización (prioridad WhatsApp) */
const hasQuoteSignal = (item: Service) => {
  const typeRoot = (item?.type || "").toLowerCase() === "quote";
  const typePricing =
    ((item?.pricing?.type || "") as string).toLowerCase() === "quote";
  const summaryCotiz = (item?.pricing?.summary || "")
    .toLowerCase()
    .includes("cotiz");
  return typeRoot || typePricing || summaryCotiz;
};

/** Precio fijo usable */
const hasFixedPrice = (item: Service) => {
  const typeRootFixed = (item?.type || "").toLowerCase() === "fixed";
  const typePricingFixed =
    ((item?.pricing?.type || "") as string).toLowerCase() === "fixed";
  const numericRoot = typeof item?.price === "number";
  const numericPricing = typeof item?.pricing?.price === "number";
  return typeRootFixed || typePricingFixed || numericRoot || numericPricing;
};

/** CLP seguro */
const fmtCLP = (n?: number | null) =>
  typeof n === "number"
    ? new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      }).format(n)
    : null;

/** Label de precio */
const getPrimaryPriceLabel = (item: Service) => {
  if (hasQuoteSignal(item)) return item?.pricing?.summary || "A cotizar";
  if (hasFixedPrice(item)) {
    const raw =
      typeof item.price === "number"
        ? item.price
        : typeof item.pricing?.price === "number"
        ? item.pricing!.price!
        : null;
    const f = fmtCLP(raw);
    if (f) return f;
  }
  const min =
    typeof item?.pricing?.minPrice === "number"
      ? fmtCLP(item.pricing!.minPrice)
      : null;
  const max =
    typeof item?.pricing?.maxPrice === "number"
      ? fmtCLP(item.pricing!.maxPrice)
      : null;
  if (min && max) return `${min} - ${max}`;
  if (min) return min;
  return "—";
};

/** Util: primera imagen */
const getCover = (images?: (string | { url: string })[]) => {
  if (!images || !images.length) return null;
  const f: any = images[0];
  return typeof f === "string" ? f : f?.url ?? null;
};

export default function CompanyProfileScreen() {
  const route = useRoute<RouteProp<ParamList, "CompanyProfile">>();
  const { companyId } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Perfil desde Redux
  const company = useSelector((s: RootState) =>
    s.companySlice.companies.find((c: any) => c.id === companyId)
  ) as FeaturedCompany | undefined;

  const ownerKey = useMemo(() => {
    return (
      company?.userUid || (company as any)?.userRef?.id || company?.id || null
    );
  }, [company]);

  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    if (!ownerKey) {
      setServices([]);
      setLoadingServices(false);
      return;
    }

    let unsub1: (() => void) | null = null;
    let unsub2: (() => void) | null = null;
    setLoadingServices(true);

    const q1 = query(
      collection(db, "services"),
      where("author.id", "==", ownerKey)
    );
    unsub1 = onSnapshot(
      q1,
      (snap) => {
        const arr: Service[] = [];
        snap.forEach((d) =>
          arr.push({ id: d.id, ...(d.data() as DocumentData) } as Service)
        );
        if (arr.length > 0) {
          arr.sort((a, b) => {
            const ta =
              a?.createdAt?.seconds || (a as any)?.createdAt?._seconds || 0;
            const tb =
              b?.createdAt?.seconds || (b as any)?.createdAt?._seconds || 0;
            return tb - ta;
          });
          setServices(arr);
          setLoadingServices(false);
        } else {
          const q2 = query(
            collection(db, "services"),
            where("ownerId", "==", ownerKey)
          );
          unsub2 = onSnapshot(
            q2,
            (snap2) => {
              const arr2: Service[] = [];
              snap2.forEach((d) =>
                arr2.push({
                  id: d.id,
                  ...(d.data() as DocumentData),
                } as Service)
              );
              arr2.sort((a, b) => {
                const ta =
                  a?.createdAt?.seconds || (a as any)?.createdAt?._seconds || 0;
                const tb =
                  b?.createdAt?.seconds || (b as any)?.createdAt?._seconds || 0;
                return tb - ta;
              });
              setServices(arr2);
              setLoadingServices(false);
            },
            () => {
              setServices([]);
              setLoadingServices(false);
            }
          );
        }
      },
      () => {
        const q2 = query(
          collection(db, "services"),
          where("ownerId", "==", ownerKey)
        );
        unsub2 = onSnapshot(
          q2,
          (snap2) => {
            const arr2: Service[] = [];
            snap2.forEach((d) =>
              arr2.push({ id: d.id, ...(d.data() as DocumentData) } as Service)
            );
            arr2.sort((a, b) => {
              const ta =
                a?.createdAt?.seconds || (a as any)?.createdAt?._seconds || 0;
              const tb =
                b?.createdAt?.seconds || (b as any)?.createdAt?._seconds || 0;
              return tb - ta;
            });
            setServices(arr2);
            setLoadingServices(false);
          },
          () => {
            setServices([]);
            setLoadingServices(false);
          }
        );
      }
    );

    return () => {
      if (unsub1) unsub1();
      if (unsub2) unsub2();
    };
  }, [ownerKey]);

  const handleWhatsApp = useCallback((item: Service) => {
    const phone = "56944748591";
    const base = "https://api.whatsapp.com/send";
    const t = item?.title || "Servicio";
    const code = item?.id ? ` (ID: ${item.id})` : "";
    const loc =
      Array.isArray(item?.locationIds) && item.locationIds.length
        ? `, ubicación: ${item.locationIds.join(", ")}`
        : "";
    const txt = `Hola 👋, quiero cotizar "${t}"${code}${loc}. Vengo desde KSAPP.`;
    const url = `${base}/?phone=${phone}&text=${encodeURIComponent(
      txt
    )}&type=phone_number&app_absent=0`;
    Linking.openURL(url);
  }, []);

  /** Agregar al carrito (solo si NO es cotización y SÍ hay precio fijo) */
  const handleAddToCart = useCallback(
    (item: Service) => {
      // bloquea si es item a cotizar
      if (hasQuoteSignal(item)) {
        Alert.alert(
          "Este servicio se cotiza",
          "Contáctanos por WhatsApp para avanzar."
        );
        return;
      }
      // necesita precio fijo usable
      if (!hasFixedPrice(item)) {
        Alert.alert(
          "Precio no disponible",
          "Este servicio no tiene precio fijo para carrito."
        );
        return;
      }

      // determina precio unitario (root > pricing.price)
      const unitPrice =
        typeof item.price === "number"
          ? item.price
          : typeof item.pricing?.price === "number"
          ? item.pricing!.price!
          : 0;

      const image = getCover(item.images);

      // payload consistente con tu slice: { id, title, price, qty, image }
      dispatch(
        addItemToCart({
          id: item.id,
          title: item.title,
          price: unitPrice,
          qty: 1,
          image: image || null,
        })
      );

      Alert.alert(
        "Agregado al carrito",
        `"${item.title}" fue agregado correctamente.`
      );
    },
    [dispatch]
  );

  if (!company) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyTitle}>Empresa no encontrada</Text>
        <Text style={styles.muted}>Vuelve y elige otra destacada.</Text>
      </View>
    );
  }

  const {
    name,
    logo,
    shortDescription,
    rating,
    experience,
    coverage,
    usp,
    warranty,
    team,
    tags,
  } = company;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 28 }}
    >
      {/* Header perfil */}
      <View style={styles.header}>
        <View style={styles.logoWrap}>
          {logo ? (
            <Image source={{ uri: logo }} style={styles.logo} />
          ) : (
            <View style={[styles.logo, styles.logoFallback]} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.muted}>
            {experience || "Experiencia no indicada"}
          </Text>
          <Text style={styles.muted}>
            {typeof rating === "number"
              ? `⭐ ${rating.toFixed(1)}`
              : "Sin rating"}
          </Text>
        </View>
      </View>

      {/* Sobre la empresa */}
      {shortDescription ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sobre la empresa</Text>
          <Text style={styles.paragraph}>{shortDescription}</Text>
        </View>
      ) : null}

      {/* Detalles */}
      {coverage || usp || warranty || team || (tags && tags.length > 0) ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detalles</Text>
          {coverage ? (
            <Text style={styles.detailItem}>
              <Text style={styles.detailLabel}>Cobertura: </Text>
              {coverage}
            </Text>
          ) : null}
          {usp ? (
            <Text style={styles.detailItem}>
              <Text style={styles.detailLabel}>Propuesta de valor: </Text>
              {usp}
            </Text>
          ) : null}
          {warranty ? (
            <Text style={styles.detailItem}>
              <Text style={styles.detailLabel}>Garantía/Respaldo: </Text>
              {warranty}
            </Text>
          ) : null}
          {team ? (
            <Text style={styles.detailItem}>
              <Text style={styles.detailLabel}>Equipo: </Text>
              {team}
            </Text>
          ) : null}
          {tags && tags.length > 0 ? (
            <View style={[styles.chipsWrap, { marginTop: 8 }]}>
              {tags.map((t, i) => (
                <View key={i} style={[styles.chip, styles.chipGhost]}>
                  <Text style={styles.chipText}>{t}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      {/* Servicios publicados */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Servicios publicados</Text>

        {loadingServices ? (
          <View style={styles.loadingBlock}>
            <ActivityIndicator />
            <Text style={styles.muted}>Cargando servicios…</Text>
          </View>
        ) : services.length === 0 ? (
          <Text style={styles.muted}>
            Aún no hay servicios para este proveedor.
          </Text>
        ) : (
          <FlatList
            data={services}
            keyExtractor={(it) => it.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }) => {
              const quote = hasQuoteSignal(item);
              const priceLabel = getPrimaryPriceLabel(item);
              return (
                <ServiceCard
                  title={item.title}
                  description={item.description}
                  pricing={item.pricing as any}
                  price={
                    typeof item.price === "number"
                      ? item.price
                      : item.pricing?.price ?? null
                  }
                  images={item.images}
                  categories={item.categoryIds || []}
                  isQuoteOverride={quote}
                  priceLabelOverride={priceLabel}
                  onQuotePress={() => handleWhatsApp(item)}
                  onAddToCart={() => handleAddToCart(item)}
                />
              );
            }}
            renderItem={({ item }) => {
              const quote = hasQuoteSignal(item);
              const priceLabel = getPrimaryPriceLabel(item);

              return (
                <ServiceCard
                  title={item.title}
                  description={item.description}
                  pricing={item.pricing as any}
                  price={
                    typeof item.price === "number"
                      ? item.price
                      : item.pricing?.price ?? null
                  }
                  images={item.images}
                  categories={item.categoryIds || []}
                  isQuoteOverride={quote}
                  priceLabelOverride={priceLabel}
                  onQuotePress={() => handleWhatsApp(item)}
                  onAddToCart={() => handleAddToCart(item)}
                  onOpenDetail={() =>
                    navigation.navigate(
                      "ServiceDetailScreen" as never,
                      {
                        item,
                        autoOpenQuote: quote, // opcional: abre modo cotización si aplica
                      } as never
                    )
                  }
                />
              );
            }}
          />
        )}
      </View>
    </ScrollView>
  );
}

const KSA = {
  surface: "#ffffff",
  surfaceAlt: "#F6F7FB",
  text: "#0b1220",
  muted: "#6b7785",
  border: "#e7edf3",
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: KSA.surfaceAlt },

  header: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: KSA.surface,
    borderBottomWidth: 1,
    borderBottomColor: KSA.border,
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: KSA.border,
  },
  logo: { width: "100%", height: "100%" },
  logoFallback: { backgroundColor: "#eef2f7" },
  title: { fontSize: 20, fontWeight: "800", color: KSA.text },
  muted: { color: KSA.muted, marginTop: 4 },

  card: {
    backgroundColor: KSA.surface,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: KSA.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
    color: KSA.text,
  },
  paragraph: { color: KSA.text, lineHeight: 20 },

  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: KSA.border,
  },
  chipGhost: { backgroundColor: "#F9FAFB" },
  chipText: { fontSize: 12, fontWeight: "700", color: KSA.text },

  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: KSA.surfaceAlt,
  },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: KSA.text },
  loadingBlock: { paddingVertical: 8, gap: 8, alignItems: "center" },
});
