import React, { useMemo, useCallback } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "../../store/store";
import AvailableProductsCard from "../../components/cards/AvailableProductsCard";
import { addItemToCart } from "../../store/reducers/cartSlice";
import * as Linking from "expo-linking";

type Props = {
  /** IDs de servicios a mostrar, en el ORDEN que quieres renderizarlos */
  featuredIds: string[];
  title?: string;
  horizontal?: boolean;
};

/** === Detecta servicios “a cotizar” === */
const isQuoteLike = (item: any) => {
  const rootPriceNull = item?.price == null && item?.pricing?.price == null;
  const typeQuote = (item?.type || "").toLowerCase() === "quote";
  const typePricingQuote = (item?.pricing?.type || "").toLowerCase() === "quote";
  const summary = (item?.pricing?.summary || item?.summary || "").toLowerCase();
  const summaryCotizar = summary.includes("cotiz"); // cotizar/cotización...
  return rootPriceNull || typeQuote || typePricingQuote || summaryCotizar;
};

/** === Tiene precio fijo utilizable para carrito === */
const canAddToCart = (item: any) => {
  if (isQuoteLike(item)) return false;
  if (typeof item?.price === "number") return true;
  if (typeof item?.pricing?.price === "number") return true;
  if (typeof item?.pricing?.minPrice === "number") return true;
  return false;
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

/** === Precio unitario para carrito === */
const getUnitPrice = (item: any): number | null => {
  if (typeof item?.price === "number") return item.price;
  if (typeof item?.pricing?.price === "number") return item.pricing.price;
  if (typeof item?.pricing?.minPrice === "number") return item.pricing.minPrice;
  return null;
};

/** === Label principal de precio (para mostrar) === */
const getPrimaryPriceLabel = (item: any) => {
  if (isQuoteLike(item)) return item?.pricing?.summary || item?.summary || "A cotizar";

  const unit = getUnitPrice(item);
  if (typeof unit === "number") return fmtCLP(unit)!;

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
  const navigation = useNavigation();

  // Fuentes posibles
  const { areas } = useSelector((state: RootState) => state.areaSlice);
  const { products: productSliceProducts } = useSelector(
    (state: RootState) => state.productSlice
  );
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
  const featuredProducts = useMemo(
    () => featuredIds.map((id) => allById.get(id)).filter(Boolean),
    [featuredIds, allById]
  );

  /** Handlers */

  // ✅ Agregar al carrito SOLO si tiene precio fijo
  const handleAddToCart = useCallback(
    (item: any) => {
      if (!canAddToCart(item)) {
        // Si llegara a llamarse en uno de cotizar, no hace nada destructivo
        return;
      }

      const unitPrice = getUnitPrice(item);
      const image = pickImageUrl(item);

      if (typeof unitPrice === "number") {
        dispatch(
          addItemToCart({
            id: item.id,
            title: item.title,
            price: unitPrice,
            qty: 1,
            image: image || null,
          })
        );
      }
    },
    [dispatch]
  );

  // ✅ WhatsApp para cotizar
  const handleWhatsApp = useCallback((item: any) => {
    const phone = "56944748591";
    const t = item?.title || item?.searchableTitle || "Servicio";
    const code = item?.id ? ` (ID: ${item.id})` : "";
    const loc =
      Array.isArray(item?.locationIds) && item.locationIds.length
        ? `, ubicación: ${item.locationIds.join(", ")}`
        : "";
    const txt = `Hola 👋, quiero cotizar "${t}"${code}${loc}. Vengo desde KSAPP.`;
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
      txt
    )}&type=phone_number&app_absent=0`;
    Linking.openURL(url);
  }, []);

  // ✅ Ir al detalle del servicio (tap en la card)
  const handleOpenDetail = useCallback(
    (item: any) => {
      const quote = isQuoteLike(item);

      navigation.navigate(
        "ServiceDetailScreen" as never,
        {
          item,
          autoOpenQuote: quote, // si quieres que en detalle ya se marque como "a cotizar"
        } as never
      );
    },
    [navigation]
  );

  /** Estado vacío */
  if (!featuredProducts.length) {
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
              isQuote={quote}
              price={getUnitPrice(item)}
              priceLabel={displayPrice}
              // CTA según tipo:
              onAddToCart={() => handleAddToCart(item)}
              onQuote={() => handleWhatsApp(item)}
              // 👇 Tap en la card → detalle del servicio
              onPress={() => handleOpenDetail(item)}
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
