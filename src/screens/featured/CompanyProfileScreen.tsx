// screens/company/CompanyProfileScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useSelector /*, useDispatch*/ } from "react-redux";
import { RootState } from "../../store/store";
// import { addItemToCart } from "../../store/reducers/cartSlice";

import { db } from "../../config/firebase";
import { collection, onSnapshot, query, where, DocumentData } from "firebase/firestore";

// 👉 importa tu tarjeta reutilizable
import ServiceCard from "../../components/cards/ServiceCard";

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
  price?: number | null;
  isActive?: boolean;
  locationIds?: string[];
  categoryIds?: string[];
  createdAt?: any;
  ownerId?: string;
  author?: { id?: string; name?: string; email?: string };
};

export default function CompanyProfileScreen() {
  const route = useRoute<RouteProp<ParamList, "CompanyProfile">>();
  const { companyId } = route.params;
  // const dispatch = useDispatch();

  // Perfil desde Redux
  const company = useSelector((s: RootState) =>
    s.companySlice.companies.find((c: any) => c.id === companyId)
  ) as FeaturedCompany | undefined;

  const ownerKey = useMemo(() => {
    return company?.userUid || (company as any)?.userRef?.id || company?.id || null;
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

    const q1 = query(collection(db, "services"), where("author.id", "==", ownerKey));
    unsub1 = onSnapshot(
      q1,
      (snap) => {
        const arr: Service[] = [];
        snap.forEach((d) => arr.push({ id: d.id, ...(d.data() as DocumentData) }));
        if (arr.length > 0) {
          arr.sort((a, b) => {
            const ta = a?.createdAt?.seconds || a?.createdAt?._seconds || 0;
            const tb = b?.createdAt?.seconds || b?.createdAt?._seconds || 0;
            return tb - ta;
          });
          setServices(arr);
          setLoadingServices(false);
        } else {
          const q2 = query(collection(db, "services"), where("ownerId", "==", ownerKey));
          unsub2 = onSnapshot(
            q2,
            (snap2) => {
              const arr2: Service[] = [];
              snap2.forEach((d) => arr2.push({ id: d.id, ...(d.data() as DocumentData) }));
              arr2.sort((a, b) => {
                const ta = a?.createdAt?.seconds || a?.createdAt?._seconds || 0;
                const tb = b?.createdAt?.seconds || b?.createdAt?._seconds || 0;
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
        const q2 = query(collection(db, "services"), where("ownerId", "==", ownerKey));
        unsub2 = onSnapshot(
          q2,
          (snap2) => {
            const arr2: Service[] = [];
            snap2.forEach((d) => arr2.push({ id: d.id, ...(d.data() as DocumentData) }));
            arr2.sort((a, b) => {
              const ta = a?.createdAt?.seconds || a?.createdAt?._seconds || 0;
              const tb = b?.createdAt?.seconds || b?.createdAt?._seconds || 0;
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

  if (!company) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyTitle}>Empresa no encontrada</Text>
        <Text style={styles.muted}>Vuelve y elige otra destacada.</Text>
      </View>
    );
  }

  const {
    name, logo, shortDescription, rating, experience, coverage, usp, warranty, team, tags,
  } = company;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 28 }}>
      {/* Header perfil */}
      <View style={styles.header}>
        <View style={styles.logoWrap}>
          {logo ? <Image source={{ uri: logo }} style={styles.logo} /> : <View style={[styles.logo, styles.logoFallback]} />}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.muted}>{experience || "Experiencia no indicada"}</Text>
          <Text style={styles.muted}>{typeof rating === "number" ? `⭐ ${rating.toFixed(1)}` : "Sin rating"}</Text>
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
      {(coverage || usp || warranty || team || (tags && tags.length > 0)) ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detalles</Text>
          {coverage ? <Text style={styles.detailItem}><Text style={styles.detailLabel}>Cobertura: </Text>{coverage}</Text> : null}
          {usp ? <Text style={styles.detailItem}><Text style={styles.detailLabel}>Propuesta de valor: </Text>{usp}</Text> : null}
          {warranty ? <Text style={styles.detailItem}><Text style={styles.detailLabel}>Garantía/Respaldo: </Text>{warranty}</Text> : null}
          {team ? <Text style={styles.detailItem}><Text style={styles.detailLabel}>Equipo: </Text>{team}</Text> : null}
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
          <Text style={styles.muted}>Aún no hay servicios para este proveedor.</Text>
        ) : (
          <FlatList
            data={services}
            keyExtractor={(it) => it.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }) => (
              <ServiceCard
                title={item.title}
                description={item.description}
                pricing={item.pricing}
                price={item.price}
                images={item.images}
                // Si ya tienes nombres de categorías, pásalos.
                // De momento enviamos los IDs para mostrar como chips simples:
                categories={item.categoryIds || []}
                onQuotePress={() => {
                  // TODO: abrir modal/formulario de cotización
                }}
                // onAddToCart={() => {
                //   const p = item?.pricing?.price ?? item?.price ?? 0;
                //   dispatch(addItemToCart({ id: item.id, title: item.title, price: p, quantity: 1, image: (item.images?.[0] as string) ?? null }));
                // }}
              />
            )}
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
  cardTitle: { fontSize: 16, fontWeight: "800", marginBottom: 8, color: KSA.text },
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
