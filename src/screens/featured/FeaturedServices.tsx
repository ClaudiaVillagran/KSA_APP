import React, { useMemo, useCallback } from "react";
import { FlatList, StyleSheet, Text, View, Linking } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import AvailableProductsCard from "../../components/cards/AvailableProductsCard";
import { addItemToCart } from "../../store/reducers/cartSlice";

type Props = {
  /** IDs de servicios a mostrar, en el ORDEN que quieres renderizarlos */
  featuredIds: string[];
  title?: string;
  horizontal?: boolean;
};

/** === Detecta servicios “a cotizar” === */
const isQuoteLike = (item: any) => {
  const rootPriceNull = item?.price == null;
  const typeQuote = (item?.type || "").toLowerCase() === "quote";
  const summary = (item?.pricing?.summary || item?.summary || "").toLowerCase();
  const summaryCotizar = summary.includes("cotiz"); // cotizar/cotización...
  return rootPriceNull || typeQuote || summaryCotizar;
};

/** === CLP seguro === */
const fmtCLP = (n?: number | null) =>
  typeof n === "number"
    ? new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      }).format(n)
    : null;

/** === Label principal de precio === */
const getPrimaryPriceLabel = (item: any) => {
  if (isQuoteLike(item)) return item?.pricing?.summary || item?.summary || "A cotizar";
  if (typeof item?.price === "number") return fmtCLP(item.price)!;
  const min =
    typeof item?.pricing?.minPrice === "number" ? fmtCLP(item.pricing.minPrice) : null;
  const max =
    typeof item?.pricing?.maxPrice === "number" ? fmtCLP(item.pricing.maxPrice) : null;
  if (min && max) return `${min} - ${max}`;
  if (min) return min;
  return "—";
};

/** Normaliza imagen: string | {url:string}[] */
const pickImageUrl = (item: any): string | undefined => {
  if (typeof item?.image === "string") return item.image;
  if (typeof item?.imageUrl === "string") return item.imageUrl;
  if (Array.isArray(item?.images) && item.images.length) {
    const first = item.images[0];
    if (typeof first === "string") return first;
    if (first && typeof first.url === "string") return first.url;
  }
  return undefined;
};

export default function FeaturedServices({
  featuredIds,
  title = "Servicios destacados",
  horizontal = true,
}: Props) {
  const dispatch = useDispatch();

  // Fuentes posibles
  const { areas } = useSelector((state: RootState) => state.areaSlice);
  const { products: productSliceProducts } = useSelector(
    (state: RootState) => state.productSlice
  );
  // Si tienes un serviceSlice con services, lo tomamos (no rompe si no existe)
  const serviceSliceServices =
    (useSelector((state: any) => state?.serviceSlice?.services) as any[]) || [];

  /** 1) Aplana productos desde areas[].categories[].products */
  const fromAreas = useMemo(() => {
    const acc: any[] = [];
    const seen = new Set<string>();
    areas?.forEach((area: any) => {
      area?.categories?.forEach((cat: any) => {
        cat?.products?.forEach((p: any) => {
          if (p?.id && !seen.has(p.id)) {
            seen.add(p.id);
            acc.push(p);
          }
        });
      });
    });
    return acc;
  }, [areas]);

  /** 2) Merge de todas las fuentes (último gana) */
  const allById = useMemo(() => {
    const map = new Map<string, any>();
    const push = (arr?: any[]) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((it) => {
        if (it?.id) map.set(it.id, it);
      });
    };
    push(fromAreas);
    push(productSliceProducts);
    push(serviceSliceServices);
    return map;
  }, [fromAreas, productSliceProducts, serviceSliceServices]);

  /** 3) Construye la lista final en el orden exacto de featuredIds */
  const featuredProducts = useMemo(() => {
    return featuredIds
      .map((id) => allById.get(id))
      .filter(Boolean); // quita IDs no encontrados
  }, [featuredIds, allById]);

  /** Handlers */
  const handleAddToCart = useCallback(
    (item: any) => {
      dispatch(addItemToCart(item));
    },
    [dispatch]
  );

  const handleWhatsApp = useCallback((item: any) => {
    const phone = "56944748591";
    const base = "https://api.whatsapp.com/send";
    const t = item?.title || item?.searchableTitle || "Servicio";
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

  /** Estado vacío */
  if (!featuredProducts.length) {
    // Pequeña ayuda de depuración: ¿cuántos IDs no se encontraron?
    const missing = featuredIds.filter((id) => !allById.has(id));
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.helperText}>
          Aún no hay servicios destacados para mostrar.
        </Text>
        {missing.length > 0 && (
          <Text style={[styles.helperText, { marginTop: 6 }]}>
            (IDs no encontrados: {missing.join(", ")})
          </Text>
        )}
      </View>
    );
  }

  /** Render */
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <FlatList
        horizontal={horizontal}
        data={featuredProducts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const quote = isQuoteLike(item);
          const displayPrice = getPrimaryPriceLabel(item);
          const imageUrl = pickImageUrl(item);

          return (
            <AvailableProductsCard
              imageUrl={imageUrl}
              title={item.title}
              author={item.ownerName || item?.author?.name}
              // comportamiento condicional:
              isQuote={quote}
              price={item?.price ?? null}
              priceLabel={displayPrice}
              onAddToCart={() => handleAddToCart(item)}
              onQuote={() => handleWhatsApp(item)}
            />
          );
        }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 20, backgroundColor: "#f9f9f9" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 16,
    marginBottom: 12,
    color: "#222",
  },
  listContent: { paddingLeft: 16, paddingRight: 8 },
  helperText: { marginLeft: 16, color: "#666" },
});
